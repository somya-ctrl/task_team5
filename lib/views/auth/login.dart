import 'package:flutter/material.dart';
import 'package:flutter_form_builder/flutter_form_builder.dart';
import 'package:form_builder_validators/form_builder_validators.dart';
import 'package:mind_ease_app/controller/auth_controller.dart';

class MyLogin extends StatefulWidget {
  const MyLogin({super.key});

  @override
  State<MyLogin> createState() => _MyLoginState();
}

class _MyLoginState extends State<MyLogin> {
  final _formKey = GlobalKey<FormBuilderState>();
  final AuthController authController = AuthController();

  bool _isPasswordVisible = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        image: DecorationImage(
          image: AssetImage('assets/signupandloginbg.png'),
          fit: BoxFit.cover,
        ),
      ),
      child: Scaffold(
        backgroundColor: Colors.transparent,
        body: Stack(
          children: [
            // Title Section
            Container(
              padding: const EdgeInsets.only(top: 260, left: 140),
              child: const Text(
                'Mind',
                style: TextStyle(
                  color: Color.fromARGB(255, 31, 58, 95),
                  fontSize: 33,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.only(top: 260, left: 210),
              child: const Text(
                'Ease',
                style: TextStyle(
                  color: Color.fromARGB(255, 68, 173, 162),
                  fontSize: 33,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.only(top: 310, left: 40),
              child: const Text(
                'Welcome back to your safe place',
                style: TextStyle(
                  color: Color.fromARGB(255, 92, 114, 141),
                  fontSize: 23,
                ),
              ),
            ),

            // Form Section
            SingleChildScrollView(
              child: Container(
                padding: EdgeInsets.only(
                  top: MediaQuery.of(context).size.height * 0.48,
                  left: 35,
                  right: 35,
                ),
                child: FormBuilder(
                  key: _formKey,
                  child: Column(
                    children: [
                      // EMAIL FIELD
                      FormBuilderTextField(
                        name: 'email',
                        decoration: _inputDecoration('Email address', Icons.email),
                        validator: FormBuilderValidators.compose([
                          FormBuilderValidators.required(
                              errorText: 'Please enter your email'),
                          FormBuilderValidators.email(
                              errorText: 'Please enter a valid email'),
                          (value) {
                            if (value == null || value.isEmpty) return null;
                            if (!value.toLowerCase().endsWith('@gmail.com')) {
                              return 'Email must end with @gmail.com';
                            }
                            return null;
                          },
                        ]),
                      ),
                      const SizedBox(height: 20),

                      // PASSWORD FIELD
                      FormBuilderTextField(
                        name: 'password',
                        obscureText: !_isPasswordVisible,
                        decoration: _inputDecoration(
                          'Password',
                          Icons.lock,
                          suffix: IconButton(
                            icon: Icon(
                              _isPasswordVisible
                                  ? Icons.visibility
                                  : Icons.visibility_off,
                              color: const Color.fromARGB(255, 31, 58, 95),
                            ),
                            onPressed: () {
                              setState(() {
                                _isPasswordVisible = !_isPasswordVisible;
                              });
                            },
                          ),
                        ),
                        validator: FormBuilderValidators.compose([
                          FormBuilderValidators.required(
                              errorText: 'Please enter your password'),
                          FormBuilderValidators.match(
                            RegExp(
                              r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$',
                            ),
                            errorText:
                                'Must have 8 chars including letter, number & symbol',
                          ),
                        ]),
                      ),
                      const SizedBox(height: 20),

                      // LOGIN BUTTON
                      ElevatedButton(
                        onPressed: () {
                          if (_formKey.currentState?.saveAndValidate() ?? false) {
                            final data = _formKey.currentState!.value;
                            authController.login(
                              context,
                              data['email'].trim(),
                              data['password'].trim(),
                            );
                          }
                        },
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color.fromARGB(255, 68, 173, 162),
                          padding: const EdgeInsets.symmetric(
                              horizontal: 140, vertical: 13),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10)),
                        ),
                        child: const Text(
                          'Login',
                          style: TextStyle(color: Colors.white, fontSize: 18),
                        ),
                      ),
                      const SizedBox(height: 20),

                      // GOOGLE LOGIN (UI Only)
                      ElevatedButton.icon(
                        onPressed: () async {
                          
                        },
                        icon: Image.asset('assets/icons/google.png', height: 24),
                        label: const Text(
                          'Login with Google',
                          style: TextStyle(color: Colors.black, fontSize: 16),
                        ),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          padding: const EdgeInsets.symmetric(
                              horizontal: 85, vertical: 12),
                          shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10)),
                        ),
                      ),
                      const SizedBox(height: 10),

                      // SIGN-UP LINK
                      Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const Text(
                            "Don't have an account ?",
                            style: TextStyle(color: Colors.black),
                          ),
                          GestureDetector(
                            onTap: () {
                              Navigator.pushNamed(context, 'register');
                            },
                            child: const Text(
                              " Sign Up",
                              style: TextStyle(
                                color: Color.fromARGB(255, 68, 173, 162),
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  // Common Input Decoration
  InputDecoration _inputDecoration(String hint, IconData icon, {Widget? suffix}) {
    return InputDecoration(
      prefixIcon: Icon(icon, color: const Color.fromARGB(255, 31, 58, 95)),
      suffixIcon: suffix,
      hintText: hint,
      fillColor: Colors.white,
      filled: true,
      border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
    );
  }
}
