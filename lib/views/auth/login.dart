import 'package:flutter/material.dart';
import 'package:mind_ease_app/controller/auth_controller.dart';

class MyLogin extends StatefulWidget {
  const MyLogin({super.key});

  @override
  State<MyLogin> createState() => _MyLoginState();
}

class _MyLoginState extends State<MyLogin> {
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final AuthController authController = AuthController();
  bool _isPasswordVisible = false;

  @override
  void dispose() {
    emailController.dispose();
    passwordController.dispose();
    super.dispose();
  }
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        image: DecorationImage(
          image: AssetImage('assets/signupandloginbg.png'),fit: BoxFit.cover,
        ),
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Stack(
          children: [
            Container(
              padding: EdgeInsets.only(top: 260, left: 140),
              child: Text(
                'Mind',
                style: TextStyle(color: const Color.fromARGB(255, 31, 58, 95),
                 fontSize: 33,fontWeight: FontWeight.bold,
                ),
              ),
            ),
            Container(
              padding: EdgeInsets.only(top: 260, left: 210),
              child: Text(
                'Ease',
                style: TextStyle(color: const Color.fromARGB(255, 68, 173, 162),
                  fontSize: 33,fontWeight: FontWeight.bold,
                ),
              ),
            ),
            Container(
              padding: EdgeInsets.only(top: 310, left: 40),
              child: Text(
                'Welcome back to your safe place',
                style: TextStyle(color: const Color.fromARGB(255, 92, 114, 141), fontSize: 23),
              ),
            ),
            SingleChildScrollView(
              child: Container(
                padding: EdgeInsets.only(
                  top: MediaQuery.of(context).size.height * 0.48,left: 35,right: 35,
                ),
                child: Column(
                  children: [
                    TextField(
                      controller: emailController,
                      decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.email,color: Color.fromARGB(255, 31, 58, 95),),
                        hintText: 'Email address',
                        fillColor: Colors.white,filled: true,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ),
                    SizedBox(height: 20),
                    TextField(
                      controller: passwordController,
                      obscureText: !_isPasswordVisible, 
                      decoration: InputDecoration(
                       prefixIcon: const Icon(Icons.lock,
                         color: Color.fromARGB(255, 31, 58, 95),
                        ),
                       hintText: 'Password',
                       fillColor: Colors.white,
                       filled: true,
                       border: OutlineInputBorder(
                         borderRadius: BorderRadius.circular(10),
                        ),
                       suffixIcon: IconButton(icon: Icon(
                         _isPasswordVisible ? Icons.visibility : Icons.visibility_off,
                         color: const Color.fromARGB(255, 31, 58, 95),
                         ),
                         onPressed: () {
                           setState(() {
                           _isPasswordVisible = !_isPasswordVisible;
                           });
                          },
                        ),
                      ),
                    ),
                    SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: () {
                        authController.login(context,
                        emailController.text.trim(),
                        passwordController.text.trim(),
                       );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color.fromARGB(255,68,173,162),
                        padding: EdgeInsets.symmetric(horizontal: 140,vertical: 13),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      child: Text(
                        'Login',
                        style: TextStyle(color: Colors.white, fontSize: 18),
                      ),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          "Don't have an account? ",
                          style: TextStyle(color: Colors.black),
                        ),
                        GestureDetector(
                          onTap: () {
                            Navigator.pushNamed(context, 'register');
                          },
                          child: const Text(
                            "Sign Up",
                            style: TextStyle(color: Color.fromARGB(255, 68, 173, 162),fontWeight: FontWeight.bold),
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
