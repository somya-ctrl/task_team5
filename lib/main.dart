import 'package:flutter/material.dart';
import 'package:mind_ease_app/login.dart';

void main() {
  runApp(MaterialApp(
    debugShowCheckedModeBanner: false,
    initialRoute: 'login',
    routes: {'login': (context) => MyLogin()},
    ));
}

