import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  final String baseUrl = 'https://mindease-backend-cyvy.onrender.com';

  Future<http.Response> login(String email, String password) async {
  final url = Uri.parse('$baseUrl/login');
  return await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({
      "email": email,
      "password": password,
    }),
    
  );
}


  Future<http.Response> signup(String name, String email, String password) async {
  final url = Uri.parse('$baseUrl/signup');
  return await http.post(
    url,
    headers: {'Content-Type': 'application/json'},
    body: jsonEncode({
      "name": name,
      "email": email,
      "password": password,
    }),
  );
}


  Future<Map<String, dynamic>> putRequest(
  String endpoint,
  Map<String, dynamic> data, {
  String? token,
}) async {
  final url = Uri.parse('$baseUrl$endpoint');
  final headers = {
    'Content-Type': 'application/json',
    if (token != null) 'Authorization': 'Bearer $token',
  };

  final response = await http.put(url, headers: headers, body: jsonEncode(data));

  if (response.statusCode == 200) {
    return jsonDecode(response.body);
  } else {
    print('Failed PUT ${response.statusCode}: ${response.body}');
    return {'success': false, 'message': response.body};
  }
}



 

}
