import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class JournalController {
  final String baseUrl = 'https://mindease-backend-cyvy.onrender.com';

  Future<String?> submitJournalEntry(String text, String mood) async {
  try {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString('auth_token');

    if (token == null) {
      return 'No token found. Please log in again.';
    }

    final url = Uri.parse('$baseUrl/journal');
    print('🔹 Sending POST request to: $url');
    print('🔹 Token: $token');
    print('🔹 Body: ${jsonEncode({'content': text})}');

    final response = await http.post(
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({
        'content': text,
      }),
    );

    print('🔹 Response status: ${response.statusCode}');
    print('🔹 Response body: ${response.body}');

    if (response.statusCode == 200 || response.statusCode == 201) {
      final data = jsonDecode(response.body);
      if (data['success'] == true) {
        return 'Journal saved successfully!';
      }
    }
    return 'Failed to submit journal.';
  } catch (e) {
    print('🔹 Error: $e');
    return 'Error: $e';
  }
}


  Future<List<Map<String, dynamic>>> fetchJournalEntries() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final token = prefs.getString('auth_token');

      if (token == null) return [];

      final response = await http.get(
        Uri.parse('$baseUrl/journal'),
        headers: {
          'Authorization': 'Bearer $token',
        },
      );

      if (response.statusCode == 200) {
        final List data = jsonDecode(response.body);
        return List<Map<String, dynamic>>.from(data);
      } else {
        return [];
      }
    } catch (e) {
      return [];
    }
  }
}
