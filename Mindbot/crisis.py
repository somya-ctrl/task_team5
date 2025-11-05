from typing import List

CRISIS_KEYWORDS: List[str] = [
    "suicidal", "suicide", "kill myself", "want to die",
    "hopeless", "worthless", "can't go on", "give up",
    "ending it all", "no reason to live", "end my life"
]

SAFETY_MESSAGE = (
    "💙 It seems like you might be going through a very difficult time right now.\n"
    "You're not alone, and it’s okay to reach out for help.\n\n"
    "Here are some trusted helplines you can contact:\n"
    "📞 India: 9999666555 (Live Love Laugh – WhatsApp/Chat)\n"
    "📞 India: 022-25521111 (iCALL Helpline)\n"
    "📞 USA: Dial 988 (Suicide & Crisis Lifeline)\n"
    "📞 UK: 116 123 (Samaritans)\n\n"
    "If you or someone you know is in immediate danger, please contact local emergency services.\n"
    "You matter, and help is available. 💙"
)

def contains_crisis_keywords(text: str) -> bool:
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in CRISIS_KEYWORDS)
