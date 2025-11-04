from chat_engine import get_response

session_id = "test_001"
query = "I am feeling it's over , i am feeling worthless now"

response = get_response(session_id, query)
print("AI Response:", response)