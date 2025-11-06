import 'package:mind_ease_app/services/api/chatbot_service.dart';

class ChatbotController {
  final ChatbotService _chatbotService = ChatbotService();

  /// Sends a message to the chatbot API and returns the bot's response.
  Future<String> getChatbotResponse(String message, String sessionId) async {
    try {
      final response = await _chatbotService.sendMessage(message, sessionId);
      return response ?? 'No response from chatbot.';
    } catch (e) {
      return 'Error: $e';
    }
  }
}
