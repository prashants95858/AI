
# Import OpenAI client for interacting with OpenRouter API
from openai import OpenAI
# Standard library for environment variables
import os
# Load environment variables from .env file
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Initialize OpenAI client with base URL and API key from environment
client = OpenAI(
    base_url=os.getenv("OPEN_ROUTER_BASE_URL"),
    api_key=os.getenv("OPEN_ROUTER_API_KEY")
)


# Asynchronous function to optimize TSX code using OpenRouter API
# Takes TypeScript/TSX code as input and returns optimized code
async def optimize_tsx_code(code: str) -> str:
    response = client.chat.completions.create(
        model=os.getenv("OPEN_ROUTER_MODEL"),  # Model name from environment
        messages=[
            # System prompt to instruct the AI
            {"role": "system", "content": "You are a TypeScript expert who improves React/TSX code."},
            # User prompt with the code to optimize
            {"role": "user", "content": f"Optimize & provide proper code for the following TypeScript/TSX code:\n\n{code}"}
        ],
        temperature=0.7  # Controls randomness of output
    )
    # Return the optimized code from the response
    return response.choices[0].message.content
