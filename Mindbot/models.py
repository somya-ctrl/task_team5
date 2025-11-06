from pydantic import BaseModel

class ChatRequest(BaseModel):
    session_id: str
    query: str

# ADDED
class StartRequest(BaseModel):
    session_id: str
