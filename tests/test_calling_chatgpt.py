import os

import openai
from dotenv import load_dotenv
from eth_utils import to_checksum_address

from backend.api import Message
from backend.chatgpt_prompt import CHATGPT_PROMPT


def test_calling_chatgpt():
    load_dotenv("../backend/.env")
    openai.api_key = os.getenv("OPENAI_API_KEY")

    message = Message(user_query="", wallet_address="")
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

    assert eval(gpt_response)
