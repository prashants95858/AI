from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

client = OpenAI(
    base_url=os.getenv("OPEN_ROUTER_BASE_URL"),
    api_key=os.getenv("OPEN_ROUTER_API_KEY")
)

async def optimize_code(code: str) -> str:
    response = client.chat.completions.create(
        model=os.getenv("OPEN_ROUTER_MODEL"),  # or any model you choose
        messages=[
            {"role": "system", "content": "You are a helpful AI that improves TypeScript code."},
            {"role": "user", "content": f"Optimize the following TypeScript/TSX code:\n\n{code}"}
        ],    
        max_tokens=200,
        temperature=0.7
    )
    return response.choices[0].message.content
