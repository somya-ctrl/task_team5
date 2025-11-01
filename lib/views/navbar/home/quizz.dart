import 'package:flutter/material.dart';

class QuizPage extends StatefulWidget {
  const QuizPage({super.key});

  @override
  State<QuizPage> createState() => _QuizPageState();
}

class _QuizPageState extends State<QuizPage> {
  int currentQuestionIndex = 0;

  final List<Map<String, dynamic>> questions = [
    {"question": "What is your age?"},
    {"question": "What is your Gender?"},
    {"question": "What is your Country?"},
    {"question": "How often do you feel stressed?"},
    {"question": "How well do you sleep at night?"},
  ];

  void nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      setState(() {
        currentQuestionIndex++;
      });
    }
  }

  void previousQuestion() {
    if (currentQuestionIndex > 0) {
      setState(() {
        currentQuestionIndex--;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final currentQuestion = questions[currentQuestionIndex];

    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 253, 247, 231),
      appBar: AppBar(
        backgroundColor: const Color.fromARGB(255, 237, 228, 198),
        title: const Text(
          "MindEase",
          style: TextStyle(
            color: Color.fromARGB(255, 31, 58, 95),
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: true,
      ),
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 25),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(height: 10),
            const Text(
              "Mental Wellness Assessment",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w800,
                color: Color.fromARGB(255, 31, 58, 95),
              ),
            ),
            const SizedBox(height: 6),
            const Text(
              "Take your time and answer honestly. There are no right or wrong answers.",
              textAlign: TextAlign.center,
              style: TextStyle(
                fontSize: 13,
                color: Color.fromARGB(255, 31, 58, 95),
              ),
            ),
            const SizedBox(height: 25),

            // Question Card
            Expanded(
              child: AnimatedSwitcher(
                duration: const Duration(milliseconds: 400),
                child: Container(
                  key: ValueKey<int>(currentQuestionIndex),
                  margin: const EdgeInsets.symmetric(vertical: 10),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: const Color.fromARGB(255, 237, 236, 221),
                    borderRadius: BorderRadius.circular(15),
                    border: Border.all(
                      color: const Color.fromARGB(255, 31, 58, 95),
                      width: 1,
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        "Question ${currentQuestionIndex + 1} of ${questions.length}",
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Color.fromARGB(255, 31, 58, 95),
                        ),
                      ),
                      const SizedBox(height: 15),
                      Text(
                        currentQuestion["question"],
                        textAlign: TextAlign.center,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                          color: Color.fromARGB(255, 31, 58, 95),
                        ),
                      ),
                      const SizedBox(height: 25),

                      // Placeholder for your custom input (like TextField, slider, buttons)
                      Container(
                        height: 35,
                        width: 100,
                        decoration: BoxDecoration(
                          color: const Color.fromARGB(255, 68, 173, 162),
                          borderRadius: BorderRadius.circular(8),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),

            const SizedBox(height: 15),

            // Buttons
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                ElevatedButton(
                  onPressed: previousQuestion,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color.fromARGB(255, 68, 173, 162),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 25, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: const Text(
                    "Previous",
                    style: TextStyle(
                      color: Color.fromARGB(255, 31, 58, 95),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
                ElevatedButton(
                  onPressed: nextQuestion,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color.fromARGB(255, 68, 173, 162),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 30, vertical: 12),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10),
                    ),
                  ),
                  child: Text(
                    currentQuestionIndex == questions.length - 1
                        ? "Finish"
                        : "Next",
                    style: const TextStyle(
                      color: Color.fromARGB(255, 31, 58, 95),
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 15),
          ],
        ),
      ),
    );
  }
}
