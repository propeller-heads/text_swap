import json
import os
from logging import getLogger
from typing import Optional

import openai
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
url = "http://localhost:8000/chat"  # URL of the API endpoint

web3 = Web3(HTTPProvider(os.getenv("W3__CONNECTION_STRING")))
openai.api_key = os.getenv("OPENAI_API_KEY")

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
    token_balances: Optional[dict[str, float]] = None

    def __repr__(self):
        str({"token_balances": self.token_balances, "user_query": self.user_query})


@app.post("/chat")
async def chat(message: Message):
    log.warning(message.user_query)
    # Get token balances. see moralis. or just top10

    message.user_query = message.user_query
    if len(message.wallet_address):
        message.wallet_address = to_checksum_address(
            message.wallet_address
        )
    else:
        return {"message": "Please login with MetaMask to proceed.", "data": {}}

    # Query chatgpt
    full_prompt = CHATGPT_PROMPT + str(message)
    chat_completion = openai.ChatCompletion.create(
        model="gpt-4", messages=[{"role": "user", "content": full_prompt}]
    )
    gpt_response = chat_completion.choices[0].message.content
    api_output = {}
    try:
        preprocessed_response = gpt_response.replace("\n", "").replace(" ", "").replace("'", "\"")
        swap_dict = json.loads(preprocessed_response)
        formatted_swaps = ""
        for idx, swap in enumerate(swap_dict.values()):
            formatted_swaps = (
                formatted_swaps
                + f"> {swap['amount_in']} {swap['token_in']} to {swap['token_out']}"
            )
            if idx != len(swap_dict) - 1:
                formatted_swaps += "\n"

        message = f"Would you like to execute {'these swaps' if len(swap_dict)>1  else 'this swap'} " \
                  f"? \n{formatted_swaps}"
        api_output["message"] = json.dumps(message)
        api_output["intent"] = swap_dict
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