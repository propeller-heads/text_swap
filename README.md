# SwapChat

SwapChat: A smart DeFi app that uses GPT-based AI for seamless crypto swaps. Connect MetaMask, chat about your trading intent, confirm, and trade. Powered by OpenAI, 1inch Fusion SDK, Metamask and React.

# Install
conda env create -f text-swap-env.yml
conda activate text-swap

add a .env file in your backend directory with the following in it

OPENAI_API_KEY=<YOUR-API-KEY>


# How to run
In frontend directory run:
npm install
npm start

In backend directory run:
uvicorn api:app --reload
