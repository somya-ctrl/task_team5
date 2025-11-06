import 'package:flutter/material.dart';
import 'package:mind_ease_app/controller/chatbot_controller.dart';

class ChatbotPage extends StatefulWidget {
  const ChatbotPage({super.key});

  @override
  State<ChatbotPage> createState() => _ChatbotPageState();
}

class _ChatbotPageState extends State<ChatbotPage> {
  final TextEditingController _messageController = TextEditingController();
  final List<Map<String, String>> _messages = [];
  final ChatbotController _chatbotController = ChatbotController();
  bool _isLoading = false;

  // You can make this dynamic (e.g. user email or UID)
  final String _sessionId = "user123";

  static const Color tealColor = Color.fromARGB(255, 68, 173, 162);
  static const Color creamColor = Color.fromARGB(255, 253, 247, 231);

  Future<void> sendMessage() async {
    final message = _messageController.text.trim();
    if (message.isEmpty) return;

    setState(() {
      _messages.add({'sender': 'user', 'text': message});
      _isLoading = true;
    });

    _messageController.clear();

    try {
      final botResponse = await _chatbotController.getChatbotResponse(
        message,
        _sessionId,
      );

      setState(() {
        _messages.add({'sender': 'bot', 'text': botResponse});
        _isLoading = false;
      });
    } catch (e) {
      setState(() {
        _messages.add({
          'sender': 'bot',
          'text': '⚠️ Failed to get response: $e',
        });
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: creamColor,
      appBar: AppBar(
        title: const Text(
          "MindEase Chatbot",
          style: TextStyle(
            color: Color.fromARGB(255, 31, 58, 95),
            fontWeight: FontWeight.bold,
          ),
        ),
        backgroundColor: creamColor,
        elevation: 0,
        iconTheme: const IconThemeData(color: Color.fromARGB(255, 31, 58, 95)),
      ),
      body: SafeArea(
        child: Column(
          children: [
            const Padding(
              padding: EdgeInsets.all(12),
              child: Text(
                "Chat with MindBot – your AI companion for emotional support 💬",
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: Color.fromARGB(255, 31, 58, 95),
                  fontSize: 14,
                  fontWeight: FontWeight.w500,
                ),
              ),
            ),
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.all(12),
                itemCount: _messages.length,
                itemBuilder: (context, index) {
                  final msg = _messages[index];
                  final isUser = msg['sender'] == 'user';
                  return Align(
                    alignment:
                        isUser ? Alignment.centerRight : Alignment.centerLeft,
                    child: Container(
                      margin: const EdgeInsets.symmetric(vertical: 6),
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: isUser ? tealColor : Colors.white,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: const [
                          BoxShadow(
                            color: Colors.black12,
                            blurRadius: 3,
                            offset: Offset(2, 2),
                          ),
                        ],
                      ),
                      child: Text(
                        msg['text'] ?? '',
                        style: TextStyle(
                          color: isUser
                              ? Colors.white
                              : const Color.fromARGB(255, 31, 58, 95),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),
            if (_isLoading)
              const Padding(
                padding: EdgeInsets.all(8),
                child: CircularProgressIndicator(color: tealColor),
              ),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 8),
              decoration: const BoxDecoration(
                color: Colors.white,
                boxShadow: [
                  BoxShadow(color: Colors.black12, blurRadius: 4),
                ],
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      decoration: const InputDecoration(
                        hintText: "Type your message...",
                        border: InputBorder.none,
                      ),
                      onSubmitted: (_) => sendMessage(),
                    ),
                  ),
                  IconButton(
                    icon: const Icon(Icons.send, color: tealColor),
                    onPressed: sendMessage,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
