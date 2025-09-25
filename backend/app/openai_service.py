
# Standard library for environment variables
import os
# Load environment variables from .env file
from dotenv import load_dotenv
# Import OpenAI client for API interaction
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()
# Initialize OpenAI client with API key from environment
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


# Asynchronous function to optimize TSX code using OpenAI API
# Takes TypeScript/TSX code as input and returns optimized code
async def optimize_tsx_code(code: str, system_prompt: str = None, user_prompt: str = None) -> str:
    try:
        # Create prompt for code optimization
        if user_prompt:
            prompt = f"{user_prompt}\n\n{code}"
        else:
            prompt = f"Optimize the following TypeScript/TSX code:\n\n{code}"

        # Default system prompt if not provided
        if not system_prompt:
            system_prompt = "You are a TypeScript expert who improves React/TSX code."
    
        # Call OpenAI chat completion API
        response = client.chat.completions.create(
            model="gpt-4o", # Other models: "gpt-4o-mini", "gpt-4o-2024-08-06", "gpt-4o-2024-08-06-preview"
            messages=[
                # System prompt to instruct the AI
                {"role": "system", "content": system_prompt},
                # User prompt with the code to optimize
                {"role": "user", "content": prompt}
            ],
            temperature=0.3,  # Controls randomness of output
            max_tokens=200,   # Limit response length
        )
        # Return the optimized code from the response
        return response.choices[0].message.content.strip()
    except Exception as e:
        # Return error message if API call fails
        return f"Error: {str(e)}"
