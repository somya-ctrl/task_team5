import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.memory import ConversationBufferMemory
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate


# Load environment variables from .env file
load_dotenv()

# Get the OpenAI API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY not found. Please check your .env file")

# Initialize the model
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7, api_key=OPENAI_API_KEY)

# Session memory dictionary
session_memory_map = {}

def get_response(session_id: str, user_query: str) -> str:
    """
    Handles user queries and maintains conversation memory for each session.
    """
    if session_id not in session_memory_map:
        # Memory for conversation context
        memory = ConversationBufferMemory(memory_key="chat_history")

        # Simple chat prompt
        prompt = PromptTemplate(
            input_variables=["chat_history", "user_input"],
            template="{chat_history}\nUser: {user_input}\nAI:"
        )

        chain = LLMChain(llm=llm, prompt=prompt, memory=memory, verbose=True)
        session_memory_map[session_id] = chain

    chain = session_memory_map[session_id]
    response = chain.run(user_input=user_query)
    return response
