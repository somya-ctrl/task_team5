import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaBook, FaSmile, FaFrown, FaSadTear, FaRegLaughBeam, FaAngry } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export const Journal = () => {
  const [journalText, setJournalText] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().substr(0,10)); 
  const [isToday, setIsToday] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const today = new Date().toISOString().substr(0,10);
    setIsToday(date === today);

    fetchJournal();
  }, [date]);

  const fetchJournal = async () => {
    try {
      const res = await axios.get(
        `https://mindease-backend-cyvy.onrender.com/getjournal?date=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (res.data?.journals?.length > 0) {
        setJournalText(res.data.journals[0].content);
      } else {
        setJournalText("");
      }

    } catch (err) {
      console.log("fetch error --> ", err);
      setJournalText("");
    }
  };

  const handleAnalyse = async () => {
    if (!journalText.trim()) return;
    if (!isToday) return;

    try {
     await axios.post(
  "https://mindease-backend-cyvy.onrender.com/journal",
  {
    content: journalText,
    date: date,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }
);


      navigate("/chatbot");

    } catch (error) {
      console.log("Error sending journal text:", error);
    }
  };

  const handleMoodSelect = async (mood) => {
    if (!isToday) return;

    try {
     await axios.post(
  "https://mindease-backend-cyvy.onrender.com/journal",
  {
    mood: mood,
    date: date,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  }
);


      navigate("/chatbot");

    } catch (error) {
      console.log("Error sending mood data:", error);
    }
  };

  return (
    <div className="bg-backg min-h-screen w-full py-35 px-4">

      <div className="text-center mb-10">
        <div className="text-4xl text-lightgreen mb-2 flex justify-center">
          <FaBook />
        </div>
        <h1 className="text-darkblue font-semibold text-3xl">Your Daily Journal</h1>
      </div>

    
      <div className="max-w-3xl mx-auto mb-6">
        <input
          type="date"
          className="border border-lightgreen p-2 rounded-lg"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <div className="max-w-3xl mx-auto bg-lightgrey border-2 border-lightgreen rounded-xl p-6 shadow-sm">

        <textarea
          className="w-full h-60 focus:outline-none"
          placeholder={isToday ? "Write what's on your mind today..." : "You cannot edit past journals"}
          value={journalText}
          disabled={!isToday}
          onChange={(e) => setJournalText(e.target.value)}
        ></textarea>

        <div className="text-center mt-5">
          {isToday && (
            <button
              onClick={handleAnalyse}
              className="bg-lightgreen text-white font-medium py-2 px-8 rounded-full hover:bg-aquaGlow transition"
            >
              Analyse Text
            </button>
          )}
        </div>
      </div>

      {isToday && (
        <div className="max-w-3xl mx-auto bg-lightgrey border-2 border-lightgreen rounded-xl p-6 text-center mt-10 shadow-sm">
          <p className="text-darkblue font-semibold mb-5">How are you feeling today?</p>

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
      )}

    </div>
  );
};

export default Journal;
