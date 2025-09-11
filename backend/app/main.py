from fastapi import FastAPI, Form, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
#from app.openai_service import optimize_code
from app.open_router_service import optimize_code

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/optimize-code")
async def optimize(
    code: str = Form(None),
    file: UploadFile = File(None),
):
    if file and not file.filename.endswith(".tsx"):
        return {"error": "Only .tsx files are allowed."}

    if file:
        contents = await file.read()
        code = contents.decode("utf-8")

    if not code:
        return {"error": "No code or file provided."}

    optimized = await optimize_code(code)
    return {"optimized": optimized}
