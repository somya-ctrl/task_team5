// lib/controller/profile_controller.dart
import 'package:mind_ease_app/model/user_model.dart';
import 'package:mind_ease_app/services/api/auth_service.dart';

class ProfileController {
  Future<bool> updateProfile({
    required UserModel user,
    required String phone,
    required String gender,
    required String age,
  }) async {
    try {
      final data = {
        "name": user.name ?? "",
        "email": user.email,
        "phone": phone,
        "gender": gender,
        "age": age,
      };
      final authService = AuthService(); 
      final response = await authService.putRequest(
        '/edit',
        data,
        token: user.token, // include token if required by backend
      );

      if (response['success'] == true ||
          response['message']?.toString().toLowerCase().contains('updated') ==
              true) {
        return true;
      }
      return false;
    } catch (e) {
      print("❌ Error updating profile: $e");
      return false;
    }
  }
}
