## 📦 Backend (Python + FastAPI)

### ✅ Requirements

- Python 3.13+
- [Virtualenv](https://virtualenv.pypa.io/en/latest/)
- OpenRouter or OpenAI API Key

### 📁 Setup backend

```bash
cd backend
python3 -m venv venv # here we can use python or python3 based on what you have selected
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload # to start the backend server
```

### Run unit test for backend

```bash
cd backend
python3 -m venv venv # here we can use python or python3 based on what you have selected
source venv/bin/activate
pytest #run the test case
pytest --cov=. --cov-report=html #generate coverage report.
```
