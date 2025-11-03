# === main.py ===
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn

# Import your existing working modules
from models import ChatRequest
from chat_engine import get_response
from logger import log_chat
from crisis import contains_crisis_keywords, SAFETY_MESSAGE
from doc_engine import query_documents

# === Initialize FastAPI app ===
app = FastAPI(title="Mindbot API", version="1.0")

# === CORS settings (important for frontend connection) ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # You can later replace "*" with your frontend URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === Root endpoint (Render will use this for health check) ===
@app.get("/")
def home():
    return {"message": "Mindbot API is running successfully!"}

# === Chat endpoint ===
@app.post("/chat")
def chat_with_memory(request: ChatRequest):
    session_id = request.session_id
    user_query = request.query

    # Crisis detection
    if contains_crisis_keywords(user_query):
        log_chat(session_id, user_query, SAFETY_MESSAGE, is_crisis=True)
        return {"response": SAFETY_MESSAGE}

    response = get_response(session_id, user_query)
    log_chat(session_id, user_query, response, is_crisis=False)
    return {"response": response}

# === Document chatbot endpoint ===
@app.post("/doc-chat")
def chat_with_documents(request: ChatRequest):
    try:
        response = query_documents(request.query)
        return {"response": str(response)}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    port = 8090  
    print(f"🚀 Running on http://127.0.0.1:{port}")
    uvicorn.run("main:app", host="0.0.0.0", port=port)
