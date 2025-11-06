import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:mind_ease_app/controller/journal_controller.dart';

class JournalPage extends StatefulWidget {
  const JournalPage({super.key});

  @override
  State<JournalPage> createState() => _JournalPageState();
}

class _JournalPageState extends State<JournalPage> {
  String selectedMood = "";
  final TextEditingController journalController = TextEditingController();
  bool showAnalysisPopup = false;
  final journalControllerInstance = JournalController();

  // Step 2: List to store fetched journal entries
  List<Map<String, dynamic>> savedJournals = [];

  @override
  void initState() {
    super.initState();
    _loadSavedJournals(); // Fetch saved journals when the page loads
  }

  // Step 2: Fetch journal entries from backend
  Future<void> _loadSavedJournals() async {
    final entries = await journalControllerInstance.fetchJournalEntries();
    setState(() {
      savedJournals = entries;
    });
  }

  @override
  Widget build(BuildContext context) {
    final String formattedDate =
        DateFormat('EEEE, MMMM d, yyyy').format(DateTime.now());

    const Color tealColor = Color.fromARGB(255, 68, 173, 162);

    return Scaffold(
      backgroundColor: const Color.fromARGB(255, 253, 247, 231),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                const SizedBox(height: 10),
                const Icon(
                  Icons.book_outlined,
                  size: 60,
                  color: Color.fromARGB(255, 31, 58, 95),
                ),
                const SizedBox(height: 8),
                const Text(
                  "Your Daily Journal",
                  style: TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.bold,
                    color: Color.fromARGB(255, 31, 58, 95),
                  ),
                ),
                const SizedBox(height: 6),
                const Text(
                  "Our AI chat will analyse your journal entry and help you get better.",
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: Color.fromARGB(255, 31, 58, 95),
                    fontSize: 12.5,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 40),

                // ---------------- Journal Input ----------------
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    border: Border.all(color: tealColor),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        formattedDate,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Color.fromARGB(255, 31, 58, 95),
                          fontSize: 15,
                        ),
                      ),
                      const SizedBox(height: 8),
                      const Text(
                        "What's on your mind?",
                        style: TextStyle(
                          color: Color.fromARGB(255, 31, 58, 95),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 10),
                      TextField(
                        controller: journalController,
                        maxLines: 6,
                        decoration: InputDecoration(
                          hintText:
                              "Write your thoughts, feelings, or reflections here...",
                          filled: true,
                          fillColor: Colors.white,
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                      ),
                      const SizedBox(height: 15),
                      Center(
                        child: ElevatedButton(
                          onPressed: () async {
                            final text = journalController.text.trim();
                            final mood = selectedMood;

                            if (text.isEmpty || mood.isEmpty) {
                              ScaffoldMessenger.of(context).showSnackBar(
                                const SnackBar(
                                    content: Text(
                                        'Please write your journal and select a mood')),
                              );
                              return;
                            }

                            final result = await journalControllerInstance
                                .submitJournalEntry(text, mood);

                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                  content: Text(
                                      result ?? 'Error submitting journal')),
                            );

                            // Refresh the saved journals after submission
                            _loadSavedJournals();

                            setState(() {
                              showAnalysisPopup = true;
                            });
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: tealColor,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(8),
                            ),
                            padding: const EdgeInsets.symmetric(
                              horizontal: 35,
                              vertical: 10,
                            ),
                          ),
                          child: const Text(
                            "Save Text",
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 30),

                // ---------------- Mood Selection ----------------
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    border: Border.all(color: tealColor),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Column(
                    children: [
                      const Text(
                        "How are you feeling today?",
                        style: TextStyle(
                          color: Color.fromARGB(255, 31, 58, 95),
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                        ),
                      ),
                      const SizedBox(height: 15),
                      Wrap(
                        alignment: WrapAlignment.center,
                        spacing: 20,
                        runSpacing: 10,
                        children: [
                          _buildMoodButton(
                              Icons.sentiment_satisfied_alt, "Happy"),
                          _buildMoodButton(Icons.sentiment_dissatisfied, "Sad"),
                          _buildMoodButton(Icons.sentiment_neutral, "Anxious"),
                          _buildMoodButton(Icons.self_improvement, "Calm"),
                          _buildMoodButton(
                              Icons.sentiment_very_dissatisfied, "Angry"),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 30),

                // ---------------- Display Saved Journals ----------------
                if (savedJournals.isNotEmpty)
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        "Saved Journal Entries",
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 18,
                          color: Color.fromARGB(255, 31, 58, 95),
                        ),
                      ),
                      const SizedBox(height: 10),
                      ListView.builder(
                        shrinkWrap: true,
                        physics: const NeverScrollableScrollPhysics(),
                        itemCount: savedJournals.length,
                        itemBuilder: (context, index) {
                          final entry = savedJournals[index];
                          return Card(
                            margin: const EdgeInsets.symmetric(vertical: 6),
                            child: ListTile(
                              title: Text(entry['text'] ?? ''),
                              subtitle: Text(
                                  "Mood: ${entry['mood'] ?? 'N/A'} | Date: ${entry['date'] ?? 'N/A'}"),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
              ],
            ),
          ),

          // Analysis Popup (optional)
          if (showAnalysisPopup)
            Positioned.fill(
              child: Stack(
                children: [
                  Center(
                    child: GestureDetector(
                      onTap: () {
                        setState(() {
                          showAnalysisPopup = false;
                        });
                      },
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildMoodButton(IconData icon, String label) {
    bool isSelected = selectedMood == label;

    return GestureDetector(
      onTap: () {
        setState(() {
          selectedMood = label;
        });
      },
      child: Column(
        children: [
          Container(
            decoration: BoxDecoration(
              color: isSelected
                  ? Color.alphaBlend(
                      const Color.fromARGB(51, 68, 173, 162),
                      Colors.white,
                    )
                  : Colors.white,
              shape: BoxShape.circle,
              boxShadow: const [
                BoxShadow(
                  color: Colors.black12,
                  blurRadius: 4,
                  offset: Offset(2, 2),
                ),
              ],
            ),
            padding: const EdgeInsets.all(16),
            child: Icon(icon, size: 28, color: Color.fromARGB(255, 68, 173, 162)),
          ),
          const SizedBox(height: 6),
          Text(
            label,
            style: TextStyle(
              color: isSelected
                  ? Color.fromARGB(255, 68, 173, 162)
                  : const Color.fromARGB(255, 31, 58, 95),
              fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
              fontSize: 14,
            ),
          ),
        ],
      ),
    );
  }
}
