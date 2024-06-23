from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
from openai import OpenAI

class Message(BaseModel):
    user_input: str

app = FastAPI()

# CORS設定
origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = OpenAI(
    api_key=os.getenv('OPENAI_API_KEY'),
)

company_rules = """
1. 勤務時間は午前9時から午後6時までです。
2. 有給休暇の申請は、上司の承認が必要です。
3. オフィス内での喫煙は禁止されています。
"""

def get_response(user_input):
    response = client.chat.completions.create(
        model="gpt-4o-2024-05-13",
        messages=[
            {"role": "system", "content": f"You are a company bot. Here are the company regulations: {company_rules}"},
            {"role": "user", "content": user_input}
        ],
        max_tokens=150
    )
    return response.choices[0].message.content.strip()

@app.post("/chat/")
async def chat(message: Message):
    try:
        response = get_response(message.user_input)
        return {"response": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
