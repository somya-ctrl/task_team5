import 'package:flutter/material.dart';
import 'package:mind_ease_app/controller/quiz_controller.dart';
import 'package:provider/provider.dart';

class QuizPage extends StatefulWidget {
  const QuizPage({super.key});

  @override
  State<QuizPage> createState() => _QuizPageState();
}

class _QuizPageState extends State<QuizPage> {
  @override
  void initState() {
    super.initState();
    // Load quiz as soon as page starts
    Future.microtask(() =>
        Provider.of<QuizController>(context, listen: false).loadQuiz());
  }

  @override
  Widget build(BuildContext context) {
    return Consumer<QuizController>(
      builder: (context, controller, child) {
        if (controller.isLoading) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        }

        if (controller.questions.isEmpty) {
          return const Scaffold(
            body: Center(child: Text("No quiz available")),
          );
        }

        final question = controller.currentQuestion;
        final selectedAnswer =
            controller.userAnswers[question.id.toString()] ?? '';

        return Scaffold(
          appBar: AppBar(
            title: Text(
              "Quiz (${controller.currentIndex + 1}/${controller.questions.length})",
            ),
            centerTitle: true,
            backgroundColor: Colors.teal,
          ),
          body: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  question.questionText,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                const SizedBox(height: 20),

                // ✅ Handle both MCQs and text inputs
                if (question.options.isNotEmpty)
                  ...question.options.map(
                    (option) => RadioListTile(
                      title: Text(option),
                      value: option,
                      groupValue: selectedAnswer,
                      onChanged: (value) {
                        controller.answerQuestion(
                            question.id.toString(), value!);
                      },
                    ),
                  )
                else
                  TextFormField(
                    initialValue:
                        controller.userAnswers[question.id.toString()] ?? '',
                    decoration: InputDecoration(
                      labelText: "Enter your answer",
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    onChanged: (value) {
                      controller.answerQuestion(
                          question.id.toString(), value);
                    },
                  ),

                const Spacer(),

                // ✅ Navigation Buttons
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    ElevatedButton(
                      onPressed: controller.currentIndex > 0
                          ? controller.previousQuestion
                          : null,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.grey[400],
                      ),
                      child: const Text("Previous"),
                    ),

                    // ✅ Submit Button
                    ElevatedButton(
                      onPressed: () async {
                        if (controller.currentIndex <
                            controller.questions.length - 1) {
                          controller.nextQuestion();
                        } else {
                          // ✅ Submit the quiz
                          await controller.submitAnswers();
                          await Future.delayed(const Duration(seconds: 2));


                          // ✅ Fetch the result
                          final resultData =
                              await controller.fetchResult();

                          if (!mounted) return;

                          if (resultData.containsKey('result')) {
                            // 🎨 Show formatted dialog instead of short snackbar
                            showDialog(
                              context: context,
                              builder: (context) {
                                final resultText =
                                    resultData['result'] ?? 'No result';
                                final confidence =
                                    resultData['confidence'] ?? 'N/A';

                                return AlertDialog(
                                  shape: RoundedRectangleBorder(
                                      borderRadius:
                                          BorderRadius.circular(16)),
                                  title: const Text(
                                    "🧠 Mental Health Assessment",
                                    style: TextStyle(
                                        fontWeight: FontWeight.bold),
                                  ),
                                  content: Column(
                                    mainAxisSize: MainAxisSize.min,
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        "Result: $resultText",
                                        style: const TextStyle(
                                          fontSize: 18,
                                          fontWeight: FontWeight.w500,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Text(
                                        "Confidence: $confidence",
                                        style: const TextStyle(
                                          fontSize: 16,
                                          color: Colors.blueGrey,
                                        ),
                                      ),
                                    ],
                                  ),
                                  actions: [
                                    TextButton(
                                      onPressed: () =>
                                          Navigator.pop(context),
                                      child: const Text("OK"),
                                    ),
                                  ],
                                );
                              },
                            );
                          } else {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text(
                                    'Result not available yet, please try again later.'),
                                backgroundColor: Colors.redAccent,
                              ),
                            );
                          }
                        }
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.teal,
                      ),
                      child: Text(
                        controller.currentIndex <
                                controller.questions.length - 1
                            ? "Next"
                            : "Submit",
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        );
      },
    );
  }
}
