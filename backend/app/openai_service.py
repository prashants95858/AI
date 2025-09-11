import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def optimize_code(code: str) -> str:
    try:
        prompt = f"Optimize the following TypeScript/TSX code:\n\n{code}"
        response = client.chat.completions.create(
            model=os.getenv("OPENAI_MODEL"), #gpt-5, 
            messages=[
                {"role": "system", "content": "You are a TypeScript expert who improves React/TSX code."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,
            max_tokens=200,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {str(e)}"
