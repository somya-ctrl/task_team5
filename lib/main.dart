import 'package:flutter/material.dart';
import 'package:mind_ease_app/views/navbar/home/home.dart';
import 'package:mind_ease_app/views/navbar/home/quizz.dart';
import 'package:mind_ease_app/views/navbar/journal.dart';
import 'package:mind_ease_app/views/auth/login.dart';
import 'package:mind_ease_app/views/navbar/meditation.dart';
import 'package:mind_ease_app/views/navbar/mood_detection.dart';
import 'package:mind_ease_app/views/auth/register.dart';

void main() {
  runApp(MaterialApp(
    debugShowCheckedModeBanner: false,
    initialRoute: 'login',
    routes: {
      'login': (context) => MyLogin(),
      'register': (context) => MyRegister(),
      'home': (context) => HomePage(),
      'quizz': (context) => QuizPage(),
      'journal': (context) => JournalPage(),
      'meditation': (context) => MeditationPage(),
      'mood_detection': (context) => MoodDetectionPage(),
      },
    ));
}

