import os
from dotenv import load_dotenv
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.llms.openai import OpenAI as LlamaOpenAI

# Load environment variables
load_dotenv()

# Updated model to latest stable GPT version
llama_llm = LlamaOpenAI(model="gpt-4-turbo", api_key=os.getenv("OPENAI_API_KEY"))

# Load your documents
documents = SimpleDirectoryReader("data").load_data()

# Create index
index = VectorStoreIndex.from_documents(documents)

# Create query engine
query_engine = index.as_query_engine(llm=llama_llm)

# Function to query the documents
def query_documents(user_query: str):
    return query_engine.query(user_query)
