import 'package:flutter/material.dart';
import 'package:mind_ease_app/views/navbar/home/home.dart';
import 'package:mind_ease_app/views/navbar/home/quizz.dart';
import 'package:mind_ease_app/views/navbar/journal.dart';
import 'package:mind_ease_app/views/auth/login.dart';
import 'package:mind_ease_app/views/navbar/meditation.dart';
import 'package:mind_ease_app/views/navbar/mood_detection.dart';
import 'package:mind_ease_app/views/auth/register.dart';
import 'package:provider/provider.dart';
import 'package:mind_ease_app/controller/quiz_controller.dart';
import 'package:shared_preferences/shared_preferences.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized(); // Required before using SharedPreferences

  final prefs = await SharedPreferences.getInstance();
  final bool isLoggedIn = prefs.getBool('isLoggedIn') ?? false;

  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => QuizController()),
      ],
      child: MindEaseApp(isLoggedIn: isLoggedIn),
    ),
  );
}

class MindEaseApp extends StatelessWidget {
  final bool isLoggedIn;
  const MindEaseApp({super.key, required this.isLoggedIn});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,

      // If logged in, go to HomePage; otherwise, go to LoginPage
      home: isLoggedIn ? const HomePage() : const MyLogin(),

      routes: {
        'login': (context) => const MyLogin(),
        'register': (context) => const MyRegister(),
        'home': (context) => const HomePage(),
        'quizz': (context) => const QuizPage(),
        'journal': (context) => const JournalPage(),
        'meditation': (context) => const MeditationPage(),
        'mood_detection': (context) => const MoodDetectionPage(),
      },
    );
  }
}
