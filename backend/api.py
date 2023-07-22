import json
import os
from logging import getLogger
from typing import Optional, Any

import openai
import pandas as pd
import requests
from dotenv import load_dotenv
from eth_utils import to_checksum_address
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from web3 import Web3
from web3.providers import HTTPProvider

from chatgpt_prompt import CHATGPT_PROMPT

load_dotenv()

log = getLogger(__name__)
app = FastAPI()
localhost = "http://localhost:8000/chat"  # URL of the API endpoint

web3 = Web3(HTTPProvider(os.getenv("W3__CONNECTION_STRING")))
openai.api_key = os.getenv("OPENAI_API_KEY")

TOKENS_CSV = pd.read_csv(
    os.path.dirname(__file__) + "/utils/tokens.csv", index_col="address"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Message(BaseModel):
    user_query: str
    wallet_address: str
    token_balances: Optional[dict[str, float]] = {}

    def __repr__(self):
        str({"token_balances": self.token_balances, "user_query": self.user_query})


def _remove_impossible_swaps(swaps: dict, balances: dict[str, float]) -> list[dict]:
    # in_token in wallet balances
    # out_token in our known tokens
    # in_amount does not exceed token balance
    possible_swaps = []
    for swap in swaps.values():
        if (
            swap["token_in"] in balances
            and balances[swap["token_in"]] >= swap["amount_in"]
            and swap["token_out"] in TOKENS_CSV.symbol.values
        ):
            possible_swaps.append(swap)
        else:
            continue
    return possible_swaps


def _add_addresses_to_swaps(swaps: list[dict]):
    for swap in swaps:
        token_in = TOKENS_CSV.loc[TOKENS_CSV.symbol == swap["token_in"]]
        token_out = TOKENS_CSV.loc[TOKENS_CSV.symbol == swap["token_out"]]

        log.warning(token_in)
        swap["token_in_address"] = to_checksum_address(token_in.index[0])
        swap["token_out_address"] = to_checksum_address(token_out.index[0])


@app.post("/chat")
async def chat(message: Message):
    log.warning(message.user_query)

    # message.user_query = "sell ETH for USDC"
    # message.token_balances = {"ETH": 0.2, "USDC": 5000.0}
    # message.wallet_address = "0xCCBF1C9038D202a50B1dAd88134D47275CB213EF"
    if len(message.wallet_address):
        message.wallet_address = to_checksum_address(message.wallet_address)
    else:
        return {"message": "Please login with MetaMask to proceed.", "data": {}}

    token_balances = _get_token_balances(message.wallet_address.lower())
    message.token_balances.update(token_balances)

    log.warning(message)

    # Query chatgpt
    full_prompt = CHATGPT_PROMPT + str(message)
    chat_completion = openai.ChatCompletion.create(
        model="gpt-4", messages=[{"role": "user", "content": full_prompt}]
    )
    gpt_response = chat_completion.choices[0].message.content
    api_output: dict[str, Any] = {}
    try:
        preprocessed_response = (
            gpt_response.replace("\n", "").replace(" ", "").replace("'", '"')
        )
        swap_dict = json.loads(preprocessed_response)
        swap_list = _remove_impossible_swaps(swap_dict, message.token_balances)
        if len(swap_list) < 1:
            api_output["message"] = "No known tokens were found for this trade."
            return api_output
        _add_addresses_to_swaps(swap_list)

        formatted_swaps = ""
        for idx, swap in enumerate(swap_list):
            formatted_swaps = (
                formatted_swaps
                + f"> {swap['amount_in']} {swap['token_in']} to {swap['token_out']}"
            )
            if idx != len(swap_dict) - 1:
                formatted_swaps += "\n"

        message = (
            f"Would you like to execute {'these swaps' if len(swap_dict)>1  else 'this swap'} "
            f"? \n{formatted_swaps}"
        )
        api_output["message"] = json.dumps(message)
        api_output["intent"] = swap_list
    except json.decoder.JSONDecodeError:
        api_output["message"] = gpt_response
        api_output["intent"] = ""

    return api_output

    # NEED NEW ENDPOINT FOR THIS:
    # If user agrees, send gpt response back to us, then format into 1inch fusion input


@app.post("/submit")
async def submit():
    log.warning("submitting order")
    return {"message": "YES SUBMIT"}


def _get_token_balances(wallet_address: str):
    alchemy_url = "https://eth-mainnet.g.alchemy.com/v2/demo"

    headers = {"Content-Type": "application/json"}

    data = {
        "jsonrpc": "2.0",
        "method": "alchemy_getTokenBalances",
        "params": [wallet_address, "erc20"],
        "id": "42",
    }

    response = requests.post(alchemy_url, headers=headers, json=data)
    try:
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        log.error(e)
        return {}

    raw_balances = response.json()["result"]["tokenBalances"]

    clean_balances = {}
    for b in raw_balances:
        if (address := b["contractAddress"]) in TOKENS_CSV.index:
            token = TOKENS_CSV.loc[address]
            token_amount = int(b["tokenBalance"], 16) / 10 ** int(token.decimals)
            if token_amount > 0:
                clean_balances[token.symbol] = token_amount
    return clean_balances
