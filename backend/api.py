import os
from logging import getLogger
from typing import Optional

import openai
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

    message.user_query = "sell 2000 USDC for DAI"
    message.token_balances = {"ETH": 0.2, "USDC": 5000.0}
    message.wallet_address = to_checksum_address(
        "0x202E76939c4c924a75dd1484D721056Bd382f816"
    )

    # Query chatgpt
    full_prompt = CHATGPT_PROMPT + str(message)
    chat_completion = openai.ChatCompletion.create(
        model="gpt-4", messages=[{"role": "user", "content": full_prompt}]
    )
    gpt_response = chat_completion.choices[0].message.content
    return gpt_response

    # Send result to user
    # (with token descriptions (link to coingecko or smth))
    api_response = requests.post(url, json=gpt_response)
    try:
        api_response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        log.error(api_response.json())

    # NEED NEW ENDPOINT FOR THIS:
    # If user agrees, send gpt response back to us, then format into 1inch fusion input

    return {"message": "I'm chat gpt telling you how to run your life."}
