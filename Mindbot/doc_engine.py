# === doc_engine.py ===
import os
from dotenv import load_dotenv
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader, StorageContext, load_index_from_storage
from llama_index.llms.openai import OpenAI as LlamaOpenAI

# Load environment variables
load_dotenv()

index = None
query_engine = None

def init_index():
    """Initialize or load the index only once."""
    global index, query_engine

    if index is None or query_engine is None:
        try:
            print("🔹 Initializing or loading document index...")
            api_key = os.getenv("OPENAI_API_KEY")
            if not api_key:
                raise ValueError("❌ Missing OpenAI API key in .env file")

            llama_llm = LlamaOpenAI(
                model="gpt-4-turbo",
                api_key=api_key
            )

            # Folder to store embeddings
            storage_dir = "storage"

            # If previously built, just load it
            if os.path.exists(storage_dir):
                print("✅ Loading existing document index from storage...")
                storage_context = StorageContext.from_defaults(persist_dir=storage_dir)
                index = load_index_from_storage(storage_context)
            else:
                print("🧠 Building new document index...")
                documents = SimpleDirectoryReader("data").load_data()
                index = VectorStoreIndex.from_documents(documents)
                index.storage_context.persist(persist_dir=storage_dir)

            query_engine = index.as_query_engine(llm=llama_llm)
            print("✅ Document index ready!")

        except Exception as e:
            print(f"🚨 Error initializing doc engine: {e}")
            raise e


def query_documents(user_query: str):
    """Safely query uploaded documents."""
    try:
        if not user_query.strip():
            return "⚠️ Please provide a valid question."

        init_index()
        response = query_engine.query(user_query)
        return str(response)

    except Exception as e:
        return f"⚠️ Document query failed: {e}"
