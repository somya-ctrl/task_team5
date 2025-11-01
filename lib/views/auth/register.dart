import 'package:flutter/material.dart';
import 'package:mind_ease_app/controller/auth_controller.dart';

class MyRegister extends StatefulWidget {
  const MyRegister({super.key});

  @override
  State<MyRegister> createState() => _MyRegisterState();
}

class _MyRegisterState extends State<MyRegister> {
  final TextEditingController nameController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();
  final TextEditingController confirmPasswordController = TextEditingController();
  final AuthController authController = AuthController();
  bool _isPasswordVisible = false;
  bool _isConfirmPasswordVisible = false;

  @override
  void dispose() {
    nameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    confirmPasswordController.dispose();
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
              padding: EdgeInsets.only(top: 310, left: 110),
              child: Text(
                'Create your account',
                style: TextStyle(color: const Color.fromARGB(255, 92, 114, 141), fontSize: 23),
              ),
            ),
            SingleChildScrollView(
              child: Container(
                padding: EdgeInsets.only(
                  top: MediaQuery.of(context).size.height * 0.43,left: 35,right: 35,
                ),
                child: Column(
                  children: [
                    TextField(
                      controller: nameController,
                      decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.person,color: Color.fromARGB(255, 31, 58, 95)),
                        hintText: 'User',
                        fillColor: Colors.white,filled: true,
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                    ),
                    SizedBox(height: 20),
                    TextField(
                      controller: emailController,
                      decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.email,color: Color.fromARGB(255, 31, 58, 95)),
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
                    TextField(
                     controller: confirmPasswordController,
                     obscureText: !_isConfirmPasswordVisible,
                     decoration: InputDecoration(
                        prefixIcon: const Icon(Icons.lock_reset,
                          color: Color.fromARGB(255, 31, 58, 95),
                        ),
                        hintText: 'Confirm Password',
                        fillColor: Colors.white,
                        filled: true,
                        border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                        suffixIcon: IconButton(icon: Icon(
                           _isConfirmPasswordVisible ? Icons.visibility : Icons.visibility_off,
                           color: const Color.fromARGB(255, 31, 58, 95),
                          ),
                         onPressed: () {
                           setState(() {
                             _isConfirmPasswordVisible = !_isConfirmPasswordVisible;
                            });
                          },
                        ),
                      ),
                    ),

                    SizedBox(height: 20),
                    ElevatedButton(
                      onPressed: () {
                        // Basic client-side validation: confirm passwords match
                        if (passwordController.text.trim() != confirmPasswordController.text.trim()) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('Passwords do not match')),
                          );
                          return;
                        }

                        authController.signup(
                          context,
                          nameController.text.trim(),
                          emailController.text.trim(),
                          passwordController.text.trim(),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color.fromARGB(255,68,173,162),
                        padding: EdgeInsets.symmetric(horizontal: 130,vertical: 13),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                      ),
                      child: Text(
                        'Sign Up',
                        style: TextStyle(color: Colors.white, fontSize: 18),
                      ),
                    ),
                    const SizedBox(height: 10),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          "Already have an account? ",
                          style: TextStyle(color: Colors.black),
                        ),
                        GestureDetector(
                          onTap: () {
                            Navigator.pushNamed(context, 'login');
                          },
                          child: const Text(
                            "Login here",
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
