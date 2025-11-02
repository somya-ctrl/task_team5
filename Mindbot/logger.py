import os
import csv
from datetime import datetime

def log_chat(session_id: str, query: str, response: str, is_crisis: bool):
    log_file = "chat_log.csv"
    file_exists = os.path.isfile(log_file)

    with open(log_file, mode="a", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        
        # Write header if the file is newly created
        if not file_exists:
            writer.writerow(["timestamp", "session_id", "query", "response", "crisis_flag"])
        
        # Log the chat entry
        writer.writerow([
            datetime.now().isoformat(),
            session_id,
            query,
            response,
            str(is_crisis)
        ])
