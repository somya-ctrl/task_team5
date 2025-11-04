from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uvicorn

# === Load environment variables ===
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise EnvironmentError("❌ OPENAI_API_KEY missing in .env file. Please add it before starting the app.")

# === Import internal modules ===
from models import ChatRequest
from chat_engine import get_response
from logger import log_chat
from crisis import contains_crisis_keywords, SAFETY_MESSAGE
from doc_engine import query_documents

# === Initialize FastAPI app ===
app = FastAPI(
    title="🧠 Mindbot API",
    version="1.0",
    description="A conversational mental health chatbot with document understanding and crisis support.",
)

# === CORS configuration (secure + flexible) ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),  # configurable via .env
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Health Check / Root Route ===
@app.get("/")
def home():
    return {
        "status": "✅ Mindbot API is running successfully!",
        "version": "1.0",
        "docs": "/docs",
        "developer": "Harshita Sharma",
    }

# === Chat Endpoint ===
@app.post("/chat")
def chat_with_memory(request: ChatRequest):
    """Handle user queries and maintain conversation memory."""
    try:
        session_id = request.session_id.strip()
        user_query = request.query.strip()

        if not user_query:
            raise HTTPException(status_code=400, detail="Query cannot be empty.")

        # Crisis detection
        if contains_crisis_keywords(user_query):
            log_chat(session_id, user_query, SAFETY_MESSAGE, is_crisis=True)
            return {"response": SAFETY_MESSAGE, "crisis_detected": True}

        # Normal chatbot flow
        response = get_response(session_id, user_query)
        log_chat(session_id, user_query, response, is_crisis=False)
        return {"response": response, "crisis_detected": False}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")

# === Document Chat Endpoint ===
@app.post("/doc-chat")
def chat_with_documents(request: ChatRequest):
    """Answer user queries based on uploaded knowledge documents."""
    try:
        query = request.query.strip()
        if not query:
            raise HTTPException(status_code=400, detail="Query cannot be empty.")

        response = query_documents(query)
        return {"response": response}

    except FileNotFoundError:
        raise HTTPException(
            status_code=404,
            detail="📁 Data folder not found. Please ensure 'data/' exists with some .txt or .pdf files.",
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Doc-chat error: {str(e)}")

# === Application Entry Point ===
if __name__ == "__main__":
    port = int(os.getenv("PORT", 8090))
    print(f"\n🚀 Mindbot API running on: http://127.0.0.1:{port}")
    print(f"📘 API Docs: http://127.0.0.1:{port}/docs")  # ✅ fixed formatting
    uvicorn.run("main:app", host="0.0.0.0", port=port)
