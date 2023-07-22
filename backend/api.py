from fastapi import FastAPI
from typing import Optional
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from logging import getLogger
log = getLogger(__name__)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str
    wallet: Optional[str] = None
    

@app.post("/chat")
async def chat(message: Message):
    log.warn(message.message)
    return {"message": f"I'm chat gpt telling you how to run your life. Careful, I know your wallet {message.wallet}", "intent": True}


@app.post("/submit")
async def submit():
    log.warn("submitting order")
    return {"message": "default"}