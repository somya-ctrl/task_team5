import os
from dotenv import load_dotenv
from groq import Groq
from PyPDF2 import PdfReader
from docx import Document

load_dotenv()

API_KEY = os.getenv("GROQ_API_KEY")
if not API_KEY:
    raise ValueError("❌ GROQ_API_KEY missing in .env")

client = Groq(api_key=API_KEY)
MODEL = "llama-3.1-8b-instant"

def _read_txt(path: str) -> str:
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()

def _read_pdf(path: str) -> str:
    text = []
    with open(path, "rb") as f:
        reader = PdfReader(f)
        for page in reader.pages:
            text.append(page.extract_text() or "")
    return "\n".join(text)

def _read_docx(path: str) -> str:
    doc = Document(path)
    return "\n".join([p.text for p in doc.paragraphs])

def _ingest_data(data_dir: str = "data") -> str:
    if not os.path.isdir(data_dir):
        raise FileNotFoundError("data folder missing")
    blobs = []
    for fn in os.listdir(data_dir):
        p = os.path.join(data_dir, fn)
        if not os.path.isfile(p):
            continue
        low = fn.lower()
        try:
            if low.endswith(".txt"):
                blobs.append(_read_txt(p))
            elif low.endswith(".pdf"):
                blobs.append(_read_pdf(p))
            elif low.endswith(".docx"):
                blobs.append(_read_docx(p))
        except Exception:
            continue
    return "\n\n".join([b for b in blobs if b.strip()])

def _chat(messages):
    resp = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        temperature=0.3,
    )
    return resp.choices[0].message.content.strip()

def query_documents(user_query: str) -> str:
    try:
        corpus = _ingest_data("data")
        if not corpus.strip():
            return "📁 No readable documents found in 'data/' (supported: .txt, .pdf, .docx)."

        system = (
            "You are MindBot. Answer ONLY using the provided documents. "
            "If the answer is not present, say you don't have enough information."
        )
        prompt = (
            f"=== DOCUMENTS START ===\n{corpus}\n=== DOCUMENTS END ===\n\n"
            f"Question: {user_query}"
        )
        return _chat([
            {"role": "system", "content": system},
            {"role": "user", "content": prompt},
        ])
    except FileNotFoundError:
        return "📁 'data/' folder not found."
    except Exception as e:
        return f"⚠️ Document query failed: {e}"
