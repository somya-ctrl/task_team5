import os
from dotenv import load_dotenv
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.llms.openai import OpenAI as LlamaOpenAI

# Load environment variables
load_dotenv()

# Load your documents *only when needed*
index = None
query_engine = None

def init_index():
    """Initialize the index only once."""
    global index, query_engine

    if index is None or query_engine is None:
        print("🔹 Initializing document index...")
        llama_llm = LlamaOpenAI(
            model="gpt-4-turbo",
            api_key=os.getenv("OPENAI_API_KEY")
        )

        # Load docs safely
        documents = SimpleDirectoryReader("data").load_data()
        index = VectorStoreIndex.from_documents(documents)
        query_engine = index.as_query_engine(llm=llama_llm)


def query_documents(user_query: str):
    """Query your uploaded documents."""
    init_index()  # Initialize on first call
    response = query_engine.query(user_query)
    return str(response) 