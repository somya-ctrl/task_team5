import os
from typing import List, Dict
from dotenv import load_dotenv
from groq import Groq
import requests

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")
if not API_KEY:
    raise ValueError("❌ GROQ_API_KEY missing in .env")

# Groq official SDK client
client = Groq(api_key=API_KEY)

# In-process session memory: { session_id: [messages...] }
_session_store: Dict[str, List[Dict[str, str]]] = {}

# Solid default chat model (fast + good quality)
DEFAULT_MODEL = "llama-3.1-8b-instant"

SYSTEM_PROMPT = (
    "You are MindBot, a kind, non-clinical mental-health companion. "
    "Be empathetic, concise, and avoid diagnosis. "
    "Encourage seeking professional help when appropriate."
)

def _truncate(history: List[Dict[str, str]], max_turns: int = 12) -> List[Dict[str, str]]:
    # keep last ~12 user+assistant exchanges (+system)
    if not history:
        return history
    # leave the first message if it's system, then last 24 messages
    head = history[:1] if history and history[0].get("role") == "system" else []
    tail = history[-(max_turns * 2):]
    return head + tail

def _chat(messages: List[Dict[str, str]], model: str = DEFAULT_MODEL) -> str:
    # Using Groq's OpenAI-compatible chat endpoint via SDK
    resp = client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=0.6,
    )
    return resp.choices[0].message.content.strip()

def get_response(session_id: str, user_query: str) -> str:
    if session_id not in _session_store:
        _session_store[session_id] = [{"role": "system", "content": SYSTEM_PROMPT}]
    _session_store[session_id].append({"role": "user", "content": user_query})
    history = _truncate(_session_store[session_id])
    answer = _chat(history, model=DEFAULT_MODEL)
    _session_store[session_id].append({"role": "assistant", "content": answer})
    return answer
