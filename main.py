import os

import openai
from dotenv import load_dotenv


def print_hi():
    load_dotenv()

    openai.api_key = os.getenv("OPENAI_API_KEY")

    # create a chat completion
    chat_completion = openai.ChatCompletion.create(
        model="gpt-4", messages=[{"role": "user", "content": "Hello world"}]
    )

    # print the chat completion
    print(chat_completion.choices[0].message.content)


# Press the green button in the gutter to run the script.
if __name__ == "__main__":
    print_hi()
