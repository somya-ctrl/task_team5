# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uvicorn

# --------- Env & keys ----------
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise EnvironmentError("❌ GROQ_API_KEY missing in .env file. Please add it before starting the app.")

# --------- Internal imports ----------
from models import ChatRequest, StartRequest  # ADDED StartRequest
from chat_engine import get_response, start_session  # ADDED start_session
from logger import log_chat
from crisis import contains_crisis_keywords, SAFETY_MESSAGE
from doc_engine import query_documents

# --------- FastAPI app (explicit docs/openapi paths help on Render) ----------
app = FastAPI(
    title="🧠 MindBot API (Groq)",
    version="3.0",
    description="A conversational mental health chatbot with memory, doc understanding, and crisis support.",
    docs_url="/docs",
    redoc_url=None,
    openapi_url="/openapi.json",
)

# --------- CORS ----------
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),  # e.g. "https://your-frontend.com"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------- Health & home ----------
@app.get("/healthz")
def healthz():
    return {"ok": True}

@app.get("/")
def home():
    return {
        "status": "✅ MindBot (Groq) is running",
        "version": "3.0",
        "docs": "/docs",
        "developer": "Harshita Sharma",
    }

# --------- Chat endpoints ----------
@app.post("/start")  # ADDED
def start_chat(request: StartRequest):
    try:
        session_id = (request.session_id or "").strip()
        if not session_id:
            raise HTTPException(status_code=400, detail="session_id cannot be empty.")
        greeting = start_session(session_id)
        try:
            log_chat(session_id, "[AUTOGREET]", greeting, is_crisis=False)
        except Exception:
            pass
        return {"response": greeting, "crisis_detected": False, "autostart": True}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Start error: {str(e)}")

@app.post("/chat")
def chat_with_memory(request: ChatRequest):
    try:
        session_id = request.session_id.strip()
        user_query = request.query.strip()
        if not user_query:
            raise HTTPException(status_code=400, detail="Query cannot be empty.")

        if contains_crisis_keywords(user_query):
            log_chat(session_id, user_query, SAFETY_MESSAGE, is_crisis=True)
            return {"response": SAFETY_MESSAGE, "crisis_detected": True}

        response = get_response(session_id, user_query)
        log_chat(session_id, user_query, response, is_crisis=False)
        return {"response": response, "crisis_detected": False}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

@app.post("/doc-chat")
def chat_with_documents(request: ChatRequest):
    try:
        query = request.query.strip()
        if not query:
            raise HTTPException(status_code=400, detail="Query cannot be empty.")
        response = query_documents(query)
        return {"response": response}
    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="📁 Data folder not found. Please ensure 'data/' exists with some .txt/.pdf/.docx files.",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Doc-chat error: {str(e)}")

# --------- Local run (Render uses the Start Command instead) ----------
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8090))
    print(f"\n🚀 MindBot (Groq) running on: http://127.0.0.1:{port}")
    print(f"📘 API Docs: http://127.0.0.1:{port}/docs")
    uvicorn.run("main:app", host="0.0.0.0", port=port, proxy_headers=True)
