import 'dart:convert';
import 'package:http/http.dart' as http;

class JournalService {
  final String baseUrl = 'https://mindease-backend-cyvy.onrender.com';

  // POST journal entry
  Future<http.Response> submitJournal(String token, String text, String mood) {
    final url = Uri.parse('$baseUrl/journal');
    return http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'text': text,
        'mood': mood,
      }),
    );
  }

  // GET all journal entries
  Future<http.Response> fetchJournals(String token) {
    final url = Uri.parse('$baseUrl/getjournal');
    return http.get(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );
  }
}
