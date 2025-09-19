
# FastAPI imports for building the API and handling form/file uploads
from fastapi import FastAPI, Form, UploadFile, File
# Middleware to enable CORS (Cross-Origin Resource Sharing)
from fastapi.middleware.cors import CORSMiddleware
# Import the code optimization service (OpenRouter version)
# from app.openai_service import optimize_tsx_code
from app.open_router_service import optimize_tsx_code


# Initialize FastAPI app
app = FastAPI()


# Add CORS middleware to allow requests from any origin (for development)
# In production, restrict 'allow_origins' to trusted domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API endpoint to optimize TSX code
# Accepts either raw code (form field) or a .tsx file upload
@app.post("/optimize-tsx-code")
async def optimize(
    code: str = Form(None),
    file: UploadFile = File(None),
    user_prompt: str = Form(None),
    system_prompt: str = Form(None)
):
    # Validate file extension if a file is uploaded
    if file and not file.filename.endswith(".tsx"):
        return {"error": "Only .tsx files are allowed."}

    # Read code from uploaded file if present
    if file:
        contents = await file.read()
        code = contents.decode("utf-8")

    # Ensure code is provided
    if not code:
        return {"error": "No code or file provided."}

    # Call the optimization service and return the result
    optimized = await optimize_tsx_code(code, system_prompt, user_prompt)
    return {"optimized": optimized}
