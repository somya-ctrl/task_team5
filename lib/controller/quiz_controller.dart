import 'package:flutter/material.dart';
import 'package:mind_ease_app/model/quiz_model.dart';
import 'package:mind_ease_app/services/api/quiz_service.dart';

class QuizController with ChangeNotifier {
  final QuizService _quizService = QuizService(); // ✅ create instance

  List<QuizQuestion> _questions = [];
  int _currentIndex = 0;
  Map<String, String> _userAnswers = {};

  bool isLoading = false;

  List<QuizQuestion> get questions => _questions;
  int get currentIndex => _currentIndex;
  QuizQuestion get currentQuestion => _questions[_currentIndex];
  Map<String, String> get userAnswers => _userAnswers;

  /// ✅ Load quiz data from API
  Future<void> loadQuiz() async {
    isLoading = true;
    notifyListeners();

    try {
      _questions = await _quizService.fetchQuiz();
    } catch (e) {
      debugPrint('❌ Error loading quiz: $e');
    } finally {
      isLoading = false;
      notifyListeners();
    }
  }

  /// ✅ Save user's selected or typed answer
  void answerQuestion(String questionId, String answer) {
    _userAnswers[questionId] = answer;
    notifyListeners();
  }

  /// ✅ Go to next question
  void nextQuestion() {
    if (_currentIndex < _questions.length - 1) {
      _currentIndex++;
      notifyListeners();
    }
  }

  /// ✅ Go to previous question
  void previousQuestion() {
    if (_currentIndex > 0) {
      _currentIndex--;
      notifyListeners();
    }
  }

  /// ✅ Submit quiz to backend
  Future<Map<String, dynamic>> submitAnswers() async {
    try {
      final List<dynamic> answersList = _userAnswers.values.toList();
final result = await _quizService.submitQuiz(answersList);

      return result;
    } catch (e) {
      debugPrint('❌ Error submitting quiz: $e');
      return {'success': false, 'message': 'Failed to submit quiz'};
    }
  }

  Future<Map<String, dynamic>> fetchResult() async {
  try {
    final result = await _quizService.fetchResult();
    return result;
  } catch (e) {
    debugPrint('❌ Error fetching result: $e');
    return {'success': false, 'message': 'Failed to fetch result'};
  }
}

}
