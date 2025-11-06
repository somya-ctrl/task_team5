import 'package:flutter/material.dart';
import 'package:mind_ease_app/views/navbar/home/chatbot.dart';

class MoodDetectionPage extends StatefulWidget {
  const MoodDetectionPage({super.key});

  @override
  State<MoodDetectionPage> createState() => _MoodDetectionPageState();
}

class _MoodDetectionPageState extends State<MoodDetectionPage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 253, 247, 231),
      body: SingleChildScrollView(
        padding: const EdgeInsets.only(top: 40, left: 20, right: 20, bottom: 40),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Center(
              child: Text(
                "Discover your Mental State",
                style: TextStyle(fontSize: 22,fontWeight: FontWeight.bold,
                  color: Color.fromARGB(255, 31, 58, 95)),
              ),
            ),
            const SizedBox(height: 10),
            const Center(
              child: Text(
                "Let our AI-powered mood detection help you understand your current emotional state.\nTake a moment for yourself, and let’s explore how you’re feeling today.",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12,color: Color.fromARGB(255, 31, 58, 95),height: 1.4),
              ),
            ),

            const SizedBox(height: 30),
            
            Card(
              color: const Color.fromARGB(255, 237, 228, 198),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15),
              ),
              child: Padding(
                padding: const EdgeInsets.all(25.0),
                child: Column(
                  children: [
                    const Icon(Icons.camera_alt, size: 40, color: Color.fromARGB(255, 68, 173, 162)),
                    const SizedBox(height: 15),
                    const Text(
                      "Ready to check your mood?",
                      style: TextStyle(color: Color.fromARGB(255, 31, 58, 95),fontSize: 18,fontWeight: FontWeight.bold),
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      "Click the button below to activate your camera and analyze your facial expressions.",
                      textAlign: TextAlign.center,
                      style: TextStyle(fontSize: 12, color: Color.fromARGB(255, 31, 58, 95)),
                    ),
                    const SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Color.fromARGB(255, 68, 173, 162),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        padding: const EdgeInsets.symmetric(horizontal: 30, vertical: 12),
                      ),
                      child: const Text("Predict your Mood", style: TextStyle(color: Colors.white)),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 40),
            
            const Center(
              child: Text(
                "Take a Moment to Breathe",
                style: TextStyle(fontSize: 20,fontWeight: FontWeight.bold,color: Color.fromARGB(255, 31, 58, 95)),
              ),
            ),
            const SizedBox(height: 8),
            const Center(
              child: Text(
                "Here are some peaceful images to help calm your mind and lift your spirits",
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 12, color: Color.fromARGB(255, 31, 58, 95)),
              ),
            ),

            const SizedBox(height: 25),

            Row(
              children: [
                Expanded(
                  child: Column(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.asset('assets/nature_flower.jpg'),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        "Find peace in nature",
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                      const Text(
                        "Nature has a calming effect on your mind and soul.",
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 12, color: Colors.black54),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 20),
                Expanded(
                  child: Column(
                    children: [
                      ClipRRect(
                        borderRadius: BorderRadius.circular(12),
                        child: Image.asset('assets/sunset_calm.jpg'),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        "Every sunset brings hope",
                        style: TextStyle(fontWeight: FontWeight.w600),
                      ),
                      const Text(
                        "Tomorrow is a new day with new possibilities.",
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 12, color: Colors.black54),
                      ),
                    ],
                  ),
                ),
              ],
            ),

            const SizedBox(height: 40),

            Card(
              color: const Color.fromARGB(255, 237, 228, 198),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
              child: Padding(
                padding: const EdgeInsets.all(25),
                child: Column(
                  children: [
                    const Icon(Icons.sentiment_satisfied_alt,
                      size: 40,color: Color.fromARGB(255, 68, 173, 162)),
                    const SizedBox(height: 10),
                    const Text(
                      "You are not alone",
                      style: TextStyle(
                        color: Color.fromARGB(255, 31, 58, 95),fontWeight: FontWeight.bold,fontSize: 18),
                    ),
                    const SizedBox(height: 10),
                    const Text(
                      "Remember, it's okay to not be okay sometimes. Whatever you're feeling right now is valid."
                      "Take things one step at a time, and be gentle with yourself. Brighter days are ahead.",
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Color.fromARGB(255, 31, 58, 95),fontSize: 12,height: 1.4),
                    ),
                    const SizedBox(height: 20),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        OutlinedButton(
                          onPressed: () {
                            Navigator.pushNamed(context, 'meditation');
                          },
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Color.fromARGB(255, 68, 173, 162)),
                            backgroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            padding: const EdgeInsets.symmetric(horizontal: 15,vertical: 12)),
                          child: const Text(
                            "Explore Meditations",
                            style: TextStyle(color: Color.fromARGB(255, 68, 173, 162)),
                          ),
                        ),
                        const SizedBox(width: 8),
                        OutlinedButton(
                          onPressed: () {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) =>
                                        const ChatbotPage()));
                          },
                          style: OutlinedButton.styleFrom(
                            side: const BorderSide(color: Color.fromARGB(255, 68, 173, 162)),
                            backgroundColor: Colors.white,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                            padding: const EdgeInsets.symmetric(horizontal: 15,vertical: 12),
                          ),
                          child: const Text(
                            "Talk to Chatbot",
                            style: TextStyle(color: Color.fromARGB(255, 68, 173, 162)),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
