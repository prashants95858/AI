
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
async def optimize_tsx_code(
    code: str,
    system_prompt: str = None,
    user_prompt: str = None
) -> str:
    # Create prompt for code optimization
    if user_prompt:
        prompt = f"{user_prompt}\n\n{code}"
    else:
        prompt = f"Optimize & provide proper code for the following TypeScript/TSX code:\n\n{code}"

    # Default system prompt if not provided
    if not system_prompt:
        system_prompt = "You are a TypeScript expert who improves React/TSX code."
        
    # Call OpenRouter chat completion API
    response = client.chat.completions.create(
        model=os.getenv("OPEN_ROUTER_MODEL"),  # Model name from environment
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7  # Controls randomness of output
    )
    # Return the optimized code from the response
    return response.choices[0].message.content
