from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPEN_ROUTER_API_KEY")
)

async def optimize_code(code: str) -> str:
    response = client.chat.completions.create(
        model="mistralai/mistral-7b-instruct",  # or any model you choose
        messages=[
            {"role": "system", "content": "You are a helpful AI that improves TypeScript code."},
            {"role": "user", "content": f"Optimize the following TypeScript/TSX code:\n\n{code}"}
        ]
    )
    return response.choices[0].message.content
