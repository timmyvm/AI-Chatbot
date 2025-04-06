from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from together import Together
import logging
import os
from dotenv import load_dotenv

logging.basicConfig(filename='server.log', level=logging.INFO)
logger = logging.getLogger(__name__)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
api_key = os.getenv("TOGETHER_API_KEY")  
client = Together(api_key=api_key) 

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        response = client.chat.completions.create(
            model="deepseek-ai/DeepSeek-R1-Distill-Llama-70B",
            messages=[{"role": "user", "content": request.message}],
        )
        content = response.choices[0].message.content.strip()
        logger.info(f"POST /chat - message: {request.message}")
        return {"response": content}
    except Exception as e:
        logger.error(f"Error: {str(e)}")
        return {"error": "Something went wrong."}