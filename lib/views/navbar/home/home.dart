import 'package:flutter/material.dart';
import 'package:mind_ease_app/views/navbar/home/chatbot.dart';
import 'package:mind_ease_app/views/navbar/home/profile_page.dart';
import 'package:mind_ease_app/views/navbar/home/quizz.dart';
import '../journal.dart';
import 'package:mind_ease_app/views/navbar/meditation.dart';
import 'package:mind_ease_app/views/navbar/mood_detection.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});
  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;
  final ScrollController _scrollController = ScrollController();
  final GlobalKey _featuresKey = GlobalKey();

  final List<Widget> _pages = [
    const SizedBox.shrink(),
    const JournalPage(),
    const MeditationPage(),
    const MoodDetectionPage(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 253, 247, 231),
      appBar: AppBar(
        backgroundColor: const Color.fromARGB(255, 237, 228, 198),
        elevation: 1,
        title: Row(
          children: const [
            Text(
              "Mind",
              style: TextStyle(
                color: Color.fromARGB(255, 31, 58, 95),
                fontWeight: FontWeight.bold,
                fontSize: 22,
              ),
            ),
            Text(
              "Ease",
              style: TextStyle(
                color: Color.fromARGB(255, 68, 173, 162),
                fontWeight: FontWeight.bold,
                fontSize: 22,
              ),
            ),
          ],
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.only(right: 20),
            child: InkWell(
              onTap: () {
                Navigator.push(context,
                    MaterialPageRoute(builder: (context) => const ProfilePage()));
              },
              borderRadius: BorderRadius.circular(25),
              child: const CircleAvatar(
                backgroundColor: Color.fromARGB(255, 68, 173, 162),
                child: Icon(Icons.person, color: Colors.white),
              ),
            ),
          ),
        ],
      ),
      body: _selectedIndex == 0
          ? SingleChildScrollView(
              controller: _scrollController,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const SizedBox(height: 30),
                  Center(
                    child: Column(
                      children: const [
                        Text(
                          "Your journey to inner peace starts here\nWelcome to your safe place for",
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w600,
                            color: Color.fromARGB(255, 31, 58, 95),
                            height: 1.5,
                          ),
                        ),
                        Text(
                          "mental peace",
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w600,
                            color: Color.fromARGB(255, 68, 173, 162),
                            height: 1.5,
                          ),
                        ),
                        SizedBox(height: 15),
                        Text(
                          "MindEase provides guided meditations, mood tracking, and a supportive\ncommunity to help you navigate life's challenges with calm and clarity.",
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 12.35,
                            color: Color.fromARGB(255, 31, 58, 95),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 25),
                  Center(
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        ElevatedButton(
                          onPressed: () {
                            Scrollable.ensureVisible(
                              _featuresKey.currentContext!,
                              duration: const Duration(seconds: 1),
                              curve: Curves.easeInOut,
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color.fromARGB(255, 68, 173, 162),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 25,
                              vertical: 12,
                            ),
                          ),
                          child: const Text(
                            "Explore Features",
                            style:
                                TextStyle(color: Color.fromARGB(255, 31, 58, 95)),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 30),
                  Center(
                    child: Column(
                      children: const [
                        Text(
                          "Everything you need for",
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w600,
                            color: Color.fromARGB(255, 31, 58, 95),
                          ),
                        ),
                        Text(
                          "wellness",
                          style: TextStyle(
                            fontSize: 22,
                            fontWeight: FontWeight.w600,
                            color: Color.fromARGB(255, 68, 173, 162),
                          ),
                        ),
                        Text(
                          "Comprehensive tools and resources to support your mental health journey",
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w500,
                            color: Color.fromARGB(255, 31, 58, 95),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 25),
                  Padding(
                    key: _featuresKey,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    child: GridView.count(
                      crossAxisCount: 2,
                      crossAxisSpacing: 5,
                      mainAxisSpacing: 20,
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      children: [
                        FeatureCard(
                          iconPath: 'assets/icons/guided_meditation.png',
                          title: "Guided Meditations",
                          description:
                              "Calm your mind with guided sessions designed to reduce stress and increase focus.",
                          onTap: () {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) =>
                                        const MeditationPage()));
                          },
                        ),
                        FeatureCard(
                          iconPath: 'assets/icons/daily_journaling.png',
                          title: "Daily Journal",
                          description:
                              "Reflect on your thoughts and track your emotional growth through daily entries",
                          onTap: () {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => const JournalPage()));
                          },
                        ),
                        FeatureCard(
                          iconPath: 'assets/icons/mood_tracking.png',
                          title: "Mood Detection",
                          description:
                              "AI-powered mood tracking helps you identify emotional patterns and triggers.",
                          onTap: () {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) =>
                                        const MoodDetectionPage()));
                          },
                        ),
                        FeatureCard(
                          iconPath: 'assets/icons/supportive_communication.png',
                          title: "Community Space",
                          description:
                              "Connect with others, share your experiences, and grow together.",
                        ),
                        FeatureCard(
                          iconPath: 'assets/icons/ai_companion.png',
                          title: "AI Companion",
                          description:
                              "Chat with our AI-powered Therapist for real time emotional support.",
                              onTap: () {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) =>
                                        const ChatbotPage()));
                          },
                        ),
                        FeatureCard(
                          iconPath: 'assets/icons/guided_meditation.png',
                          title: "Mental Wellness Check",
                          description:
                              "A short assessment that suggests whether you're doing fine, need extra self-care, or may benefit from talking to someone.",
                          onTap: () {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) => const QuizPage()));
                          },
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 10),
                  Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        Row(
                          children: [
                            Expanded(
                              flex: 2,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: const [
                                  Text(
                                    "Your feelings are valid.\nYour journey is important.\nWelcome to your SAFE SPACE.",
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w900,
                                      color: Color.fromARGB(255, 31, 58, 95),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(width: 20),
                            Expanded(
                              flex: 1,
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(15),
                                child: Image(
                                    image:
                                        AssetImage('assets/homepage2.jpg')),
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 30),
                        Row(
                          children: [
                            Expanded(
                              flex: 1,
                              child: ClipRRect(
                                borderRadius: BorderRadius.circular(15),
                                child: Image(
                                    image:
                                        AssetImage('assets/homepage1.jpg')),
                              ),
                            ),
                            const SizedBox(width: 20),
                            Expanded(
                              flex: 2,
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: const [
                                  Text(
                                    "Your trusted companion for Mental Wellbeing. Find peace, build resilience, and connect with a supportive community.",
                                    style: TextStyle(
                                      fontSize: 16,
                                      fontWeight: FontWeight.w900,
                                      color: Color.fromARGB(255, 31, 58, 95),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            )
          : _pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        type: BottomNavigationBarType.fixed,
        backgroundColor: const Color.fromARGB(255, 237, 228, 198),
        selectedItemColor: const Color.fromARGB(255, 68, 173, 162),
        unselectedItemColor: Colors.black54,
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(icon: Icon(Icons.book), label: 'Journal'),
          BottomNavigationBarItem(
              icon: Icon(Icons.self_improvement), label: 'Meditation'),
          BottomNavigationBarItem(icon: Icon(Icons.mood), label: 'Mood Detection'),
        ],
      ),
    );
  }
}

class FeatureCard extends StatelessWidget {
  final String iconPath;
  final String title;
  final String description;
  final VoidCallback? onTap;

  const FeatureCard({
    super.key,
    required this.iconPath,
    required this.title,
    required this.description,
    this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        color: const Color.fromARGB(255, 252, 250, 241),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
        elevation: 4,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset(iconPath, height: 40, width: 40, fit: BoxFit.contain),
              const SizedBox(height: 10),
              Text(
                title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 13,
                  color: Color.fromARGB(255, 31, 58, 95),
                ),
              ),
              const SizedBox(height: 6),
              Text(
                description,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 10,
                  color: Color.fromARGB(255, 31, 58, 95),
                  height: 1.4,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
