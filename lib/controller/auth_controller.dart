import 'dart:convert';
import 'package:flutter/material.dart';

import 'package:shared_preferences/shared_preferences.dart';
import '../services/api/auth_service.dart';

class AuthController {
  final AuthService _authService = AuthService();
  

Future<void> login(BuildContext context, String email, String password) async {
  try {
    final response = await _authService.login(email, password);
    print('Login response body: ${response.body}');

    Map<String, dynamic>? data;
    try {
      data = jsonDecode(response.body);
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Server error: ${response.body}')));
      return;
    }

    if (data != null && response.statusCode == 200 && data['user'] != null) {
      final user = data['user'];
      final token = data['token'];

      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('auth_token', token);
      await prefs.setString('user_name', user['name']);
      await prefs.setString('user_email', user['email']);
      await prefs.setBool('isLoggedIn', true);

      if (!context.mounted) return;
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Welcome back, ${user['name']}!')));

      Navigator.pushReplacementNamed(context, 'home');
    } else {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text(data?['message'] ?? 'Login failed')));
    }
  } catch (e) {
    if (!context.mounted) return;
    ScaffoldMessenger.of(context)
        .showSnackBar(SnackBar(content: Text('Error: $e')));
  }
}


  // -------------------- Signup --------------------
  Future<void> signup(
      BuildContext context, String name, String email, String password) async {
    try {
      final response = await _authService.signup(name, email, password);
      final data = jsonDecode(response.body);

      if (response.statusCode == 201 || response.statusCode == 200) {
        if (!context.mounted) return;
        ScaffoldMessenger.of(context)
            .showSnackBar(const SnackBar(content: Text('Account created successfully!')));
        Navigator.pushReplacementNamed(context, 'home');
      } else {
        if (!context.mounted) return;
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text(data['message'] ?? 'Signup failed')));
      }
    } catch (e) {
      if (!context.mounted) return;
      ScaffoldMessenger.of(context)
          .showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }


  // -------------------- Logout --------------------
  Future<void> logout(BuildContext context) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.clear();
    

    if (!context.mounted) return;
    Navigator.pushReplacementNamed(context, 'login');
  }

  // -------------------- Get User --------------------
  Future<Map<String, String?>> getUserDetails() async {
    final prefs = await SharedPreferences.getInstance();
    return {
      'name': prefs.getString('user_name'),
      'email': prefs.getString('user_email'),
      'token': prefs.getString('auth_token'),
    };
  }
}
