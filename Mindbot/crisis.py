# crisis.py

from typing import List

CRISIS_KEYWORDS: List[str] = [
    "suicidal", "suicide", "kill myself", "want to die",
    "hopeless", "worthless", "can't go on", "give up",
    "ending it all", "no reason to live", "end my life"
]

# Safe, supportive message with verified helpline numbers
SAFETY_MESSAGE = (
    "💙 It seems like you might be going through a very difficult time right now.\n"
    "You're not alone, and it’s okay to reach out for help.\n\n"
    "Here are some trusted helpline numbers you can contact:\n"
    "📞 **India:** 9999666555 (Live Love Laugh Foundation – WhatsApp/Chat)\n"
    "📞 **India:** 022-25521111 (iCALL Helpline – Phone/Email Support)\n"
    "📞 **USA:** Dial 988 (Suicide & Crisis Lifeline – 24×7)\n"
    "📞 **UK:** 116 123 (Samaritans – 24×7)\n\n"
    "If you or someone you know is in immediate danger, please contact your local emergency services.\n"
    "You matter, and help is available. 💙"
)

# Function to detect crisis-related phrases
def contains_crisis_keywords(text: str) -> bool:
    """
    Checks if the user's text contains any crisis-related words.
    Returns True if a keyword is found, otherwise False.
    """
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in CRISIS_KEYWORDS)