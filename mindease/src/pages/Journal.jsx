import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaBook } from "react-icons/fa";

export const Journal = () => {
  const [journalText, setJournalText] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().substr(0, 10));
  const [isToday, setIsToday] = useState(true);
  const [loading, setLoading] = useState(false);
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const uid = user?.id;

  const today = new Date().toISOString().slice(0, 10);
  const dailyKey = `user-${uid}-daily`;

  const loadDaily = () => JSON.parse(localStorage.getItem(dailyKey) || "{}");
  const saveDaily = (obj) => localStorage.setItem(dailyKey, JSON.stringify(obj));

  const addActivity = useCallback((uid, text, meta = "") => {
    const key = `user-${uid}-activity`;
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.unshift({ text, meta, ts: Date.now() });
    if (arr.length > 20) arr.length = 20;
    localStorage.setItem(key, JSON.stringify(arr));
  }, []);

  useEffect(() => {
    if (uid) addActivity(uid, "Journal Opened", "");
  }, [uid, addActivity]);

  useEffect(() => {
    setIsToday(date === today);
    fetchJournal();
  }, [date]);

  const fetchJournal = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/getjournal?date=${date}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.journals?.length > 0) setJournalText(res.data.journals[0].content);
      else setJournalText("");
    } catch {
      setJournalText("");
    }
  };

  
  const saveJournal = async () => {
    try {
      setLoading(true);
      await axios.post(
        `${BASE_URL}/journal`,
        {
          content: journalText,
          date: date,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Journal Saved ✅");
    } catch (err) {
      alert("Failed to save");
    }
    setLoading(false);
  };

  // typing tracking
  const [typingStart, setTypingStart] = useState(null);
  const [totalTypingTime, setTotalTypingTime] = useState(0);

  const handleTyping = (e) => {
    setJournalText(e.target.value);
    if (!typingStart) setTypingStart(Date.now());
    else {
      const now = Date.now();
      const delta = now - typingStart;
      setTotalTypingTime((prev) => prev + delta);
      setTypingStart(now);
    }
  };

  const handleBlur = () => setTypingStart(null);

  useEffect(() => {
    if (totalTypingTime >= 10000) {
      const seconds = Math.floor(totalTypingTime / 1000);
      const minutes = Math.floor(seconds / 60);
      const remSec = seconds % 60;
      const timeString = minutes > 0 ? `${minutes} min ${remSec} sec` : `${remSec} sec`;

      addActivity(uid, "Completed Journal Entry", timeString);

      const tk = `user-${uid}-tasks-${today}`;
      const taskObj = JSON.parse(localStorage.getItem(tk) || '{"meditation":false,"journal":false,"mood":false}');
      taskObj.journal = true;
      localStorage.setItem(tk, JSON.stringify(taskObj));
    }
  }, [totalTypingTime, uid, today, addActivity]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!typingStart) return;

      const diff = Date.now() - typingStart;
      const combined = diff + totalTypingTime;
      const minutes = Math.floor(combined / 60000);

      if (minutes > 0) {
        const daily = loadDaily();
        const todayObj = daily[today] || { meditation: 0, journal: 0, mood: 0 };
        todayObj.journal += minutes;
        daily[today] = todayObj;
        saveDaily(daily);

        setTotalTypingTime(0);
        setTypingStart(Date.now());
      }
    }, 10000);

    return () => clearInterval(timer);
  }, [typingStart, totalTypingTime]);

  return (
    <div className="bg-backg min-h-screen w-full py-35 px-4">
      <div className="text-center mb-10">
        <div className="text-4xl text-lightgreen mb-2 flex justify-center"><FaBook /></div>
        <h1 className="text-darkblue font-semibold text-3xl">Your Daily Journal</h1>
      </div>

      <div className="max-w-3xl mx-auto mb-6">
        <input
          type="date"
          className="border border-lightgreen p-2 rounded-lg"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={today}
        />
      </div>

      <div className="max-w-3xl mx-auto bg-lightgrey border-2 border-lightgreen rounded-xl p-6 shadow-sm">
        <textarea
          className="w-full h-60 focus:outline-none"
          placeholder={isToday ? "Write what's on your mind today..." : "You cannot edit past journals"}
          value={journalText}
          disabled={!isToday}
          onChange={handleTyping}
          onBlur={handleBlur}
        />
        <div className="text-center mt-5">
          {isToday && (
            <button
              onClick={saveJournal}
              className="bg-lightgreen text-white font-medium py-2 px-8 rounded-full hover:bg-aquaGlow transition"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Journal"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Journal;
