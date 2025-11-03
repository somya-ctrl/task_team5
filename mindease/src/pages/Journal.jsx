import React, { useState } from "react";
import axios from "axios";
import { FaBook, FaSmile, FaFrown, FaSadTear, FaRegLaughBeam, FaAngry } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const Journal = () => {
  const [journalText, setJournalText] = useState("");
  const navigate = useNavigate();

  const handleAnalyse = async () => {
    if (!journalText.trim()) return;

    try {
      await axios.post("https://mindease-backend-cyvy.onrender.com/journal", {
        text: journalText,
      });

      navigate("/chatbot");

    } catch (error) {
      console.log("Error sending journal text:", error);
    }
  };

  
  const handleMoodSelect = async (mood) => {
    if (!journalText.trim()) return;

    try {
      await axios.post("https://mindease-backend-cyvy.onrender.com/journal", {
        mood: mood,
      });

      navigate("/chatbot");

    } catch (error) {
      console.log("Error sending mood data:", error);
    }
  };

  return (
    <>
      <div className="bg-backg min-h-screen w-full py-35 px-4">

        <div className="text-center mb-20">
          <div className="text-4xl text-lightgreen mb-2 flex justify-center">
            <FaBook />
          </div>
          <h1 className="text-darkblue font-semibold text-3xl">Your Daily Journal</h1>
          <p className="text-darkblue mt-1">
            Our AI chat will analyse your journal entry and help you feel better.
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-lightgrey border-2 border-lightgreen rounded-xl p-6 shadow-sm">
          <p className="text-darkblue font-semibold text-lg border-b border-aquaGlow pb-2 mb-4 -mx-6 px-6">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>

          <textarea
            className="w-full h-60 focus:outline-none"
            placeholder=" What’s on your mind? 
Write your thoughts, feelings, or reflections here..."
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
          ></textarea>

          <div className="text-center mt-5">
            <button
              onClick={handleAnalyse}
              className="bg-lightgreen text-white font-medium py-2 px-8 rounded-full hover:bg-aquaGlow transition"
            >
              Analyse Text
            </button>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-lightgrey border-2 border-lightgreen rounded-xl p-6 text-center mt-20 shadow-sm">
          <p className="text-darkblue font-semibold mb-5">
            How are you feeling today?
          </p>

          <div className="grid grid-cols-5 gap-4">
            {[
              { icon: <FaSmile className="text-2xl " />, label: "Happy" },
              { icon: <FaSadTear className="text-2xl" />, label: "Sad" },
              { icon: <FaFrown className="text-2xl" />, label: "Anxious" },
              { icon: <FaRegLaughBeam className="text-2xl" />, label: "Calm" },
              { icon: <FaAngry className="text-2xl" />, label: "Angry" },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => handleMoodSelect(item.label)} 
                className="border-2 border-aquaGlow rounded-lg py-4 text-lightgreen hover:bg-aquaGlow hover:text-white transition flex flex-col items-center"
              >
                {item.icon}
                <span className="text-sm text-darkblue pt-1 font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default Journal;
