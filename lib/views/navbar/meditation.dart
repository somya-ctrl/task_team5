import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

class MeditationPage extends StatelessWidget {
  const MeditationPage({super.key});

  
  Future<void> _launchURL(String url) async {
    final Uri uri = Uri.parse(url);
    if (!await launchUrl(uri, mode: LaunchMode.externalApplication)) {
      throw 'Could not launch $url';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 253, 247, 231), 
      
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(height: 20),
            const Center(
              child: Text(
                "Guided meditations for mental wellness",
                style: TextStyle(color: Color.fromARGB(255, 31, 58, 95), fontSize: 22, fontWeight: FontWeight.bold),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 10),
            const Center(
              child: Text(
                "You don't have to face this alone. These specially designed meditations are here to support you through difficult times, offering gentle guidance for anxiety, depression, and emotional healing.",
                style: TextStyle(color: Color.fromARGB(255, 31, 58, 95),fontSize: 12),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 20),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Text(
                "Remember - Meditation is a practice, not perfection. It’s okay if your mind wanders. Each moment you choose to try is a moment of self care.",
                style: TextStyle(
                    fontWeight: FontWeight.w500, color: Color.fromARGB(255, 68, 173, 162)),
                textAlign: TextAlign.center,
              ),
            ),
            const SizedBox(height: 25),
            const Text(
              "Choose your practice",
              style: TextStyle(color: Color.fromARGB(255, 31, 58, 95),fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 15),

            
            GridView.count(
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              childAspectRatio: 0.6,
              children: [
                meditationCard(
                    title: "Loving-Kindness (Metta)",
                    description:
                        "Cultivates self-compassion and kindness towards yourself.\n\nBenefits:\n• Builds self compassion\n• Reduces self criticism\n• Improves emotional resilience",
                    imagePath: "assets/images/loving_kindness.jpg",
                    url:
                        "https://www.youtube.com/embed/-d_AA9H4z9U"),
                meditationCard(
                    title: "Breathing for Calm",
                    description:
                        "Simple yet powerful breathing techniques to centre yourself and find immediate relief.\n\nBenefits:\n• Quick stress relief\n• Lowers heart rate and BP\n• Can be done anywhere",
                    imagePath: "assets/images/breathing_calm.jpg",
                    url:
                        "https://www.youtube.com/embed/VUjiXcfKBn8"),
                meditationCard(
                    title: "Body Scan for Depression",
                    description:
                        "A comprehensive practice to reconnect with your body and release tension.\n\nBenefits:\n• Increases body awareness\n• Releases physical tension\n• Grounds you in the moment",
                    imagePath: "assets/images/body_scan.jpg",
                    url:
                        "https://www.youtube.com/embed/_DTmGtznab4"),
                meditationCard(
                    title: "Anxiety Relief Meditation",
                    description:
                        "A gentle guided meditation to help calm anxious thoughts and bring peace to your mind.\n\nBenefits:\n• Racing thoughts and worry\n• Promotes deep relaxation\n• Helps manage panic and stress",
                    imagePath: "assets/homepage2.jpg",
                    url:
                        "https://www.youtube.com/embed/O-6f5wQXSu8"),
                meditationCard(
                    title: "Sleep Meditation",
                    description:
                        "Gentle guidance to help you let go of the day's worries and drift into peaceful, restorative sleep.\n\nBenefits:\n• Improves sleep quality\n• Eases insomnia\n• Calms nighttime anxiety",
                    imagePath: "assets/images/sleep_meditation.jpg",
                    url:
                        "https://www.youtube.com/embed/g0jfhRcXtLQ"),
                meditationCard(
                    title: "Mindful Walking",
                    description:
                        "A moving meditation that combines gentle movement with mindfulness.\n\nBenefits:\n• Includes movement\n• Boosts mood naturally\n• Great for restless energy",
                    imagePath: "assets/images/mindful_walking.jpg",
                    url:
                        "https://www.youtube.com/embed/NfPBlRE4RIc"),
              ],
            ),
           ],
        ),
      ),
    );
  }
  
  Widget meditationCard({
    required String title,
    required String description,
    required String imagePath,
    required String url,}) {
    return GestureDetector(
      onTap: () => _launchURL(url),
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        child: Padding(
          padding: const EdgeInsets.all(10),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(15),
                child: Image.asset(
                  imagePath,
                  height: 100,
                  width: double.infinity,
                  fit: BoxFit.cover,
                ),
              ),
              const SizedBox(height: 8),
              Text(title,
                  style: const TextStyle(color: Color.fromARGB(255, 31, 58, 95),
                      fontWeight: FontWeight.bold, fontSize: 15)),
              const SizedBox(height: 4),
              Expanded(
                child: Text(
                  description,
                  style: const TextStyle(fontSize: 12, color: Color.fromARGB(255, 31, 58, 95),),
                ),
              ),
              const SizedBox(height: 6),
              ElevatedButton(
                onPressed: () => _launchURL(url),
                style: ElevatedButton.styleFrom(iconAlignment: IconAlignment.start,
                  backgroundColor: Color.fromARGB(255, 68, 173, 162),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20)),
                ),
                child: const Text("Start Session", style: TextStyle(color: Colors.white, fontSize: 12)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
