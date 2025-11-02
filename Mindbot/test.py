from chat_engine import get_response

session_id = "test_001"
query = "Hey, how are you today?"

response = get_response(session_id, query)
print("AI Response:", response)
