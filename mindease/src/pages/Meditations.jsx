import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const practices = [
  {
    title: "Loving-Kindness (Metta)",
    description: "Cultivates self compassion and kindness towards yourself",
    benefits: [
      "Builds self compassion",
      "Reduces self criticism",
      "Improves emotional resilience",
    ],
    thumbnail: "https://img.youtube.com/vi/-d_AA9H4z9U/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/-d_AA9H4z9U",
  },
  {
    title: "Breathing for Calm",
    description:
      "Simple yet powerful breathing techniques to centre yourself and find immediate relief.",
    benefits: [
      "Quick stress relief",
      "Lower heart rate and BP",
      "Can be done anywhere",
    ],
    thumbnail: "https://img.youtube.com/vi/VUjiXcfKBn8/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/VUjiXcfKBn8",
  },
  {
    title: "Body Scan for Depression",
    description:
      "A compassionate practise to reconnect with your body and release tension.",
    benefits: [
      "Increase body awareness",
      "Release physical tension",
      "Grounds you in the moment",
    ],
    thumbnail: "https://img.youtube.com/vi/_DTmGtznab4/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/_DTmGtznab4",
  },
  {
    title: "Anxiety Relief Meditation",
    description:
      "A gentle guided meditation to help calm anxious thoughts and bring peace to your mind.",
    benefits: [
      "Reduces racing thoughts and worry",
      "Promotes deep relaxation",
      "Helps manage panic and stress",
    ],
    thumbnail: "https://img.youtube.com/vi/O-6f5wQXSu8/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/O-6f5wQXSu8",
  },
  {
    title: "Sleep Meditation",
    description:
      "Gentle guidance to help you leave the day’s worries and drift into peaceful, restorative sleep.",
    benefits: [
      "Improves sleep quality",
      "Eases insomnia",
      "Calms nighttime anxiety",
    ],
    thumbnail: "https://img.youtube.com/vi/g0jfhRcXtLQ/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/g0jfhRcXtLQ",
  },
  {
    title: "Mindful Walking",
    description:
      "A moving meditation that combines gentle movement with mindfulness.",
    benefits: [
      "Includes movement",
      "Boosts mood naturally",
      "Great for restless energy",
    ],
    thumbnail: "https://img.youtube.com/vi/NfPBlRE4RIc/hqdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/NfPBlRE4RIc",
  },
];

export default function Meditations() {
  const [activeVideo, setActiveVideo] = useState(null);
  const [meditationStart, setMeditationStart] = useState(null);
  const prevVideoRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const uid = user?.id; 
  const today = new Date().toISOString().slice(0, 10);
  const dailyKey = `user-${uid}-daily`;
  const navigate = useNavigate();

  
  const accessToken = localStorage.getItem("accessToken");

  const addActivity = (uid, text, meta = "") => {
    const key = `user-${uid}-activity`;
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.unshift({ text, meta, ts: Date.now() });
    if (arr.length > 20) arr.length = 20; 
    localStorage.setItem(key, JSON.stringify(arr));
  };

  const loadDaily = () => JSON.parse(localStorage.getItem(dailyKey) || "{}");
  const saveDaily = (obj) => localStorage.setItem(dailyKey, JSON.stringify(obj));

  useEffect(() => {
    if (uid) addActivity(uid, "Opened Meditation Page");
  }, [uid]);

  const stopAndSave = () => {
    if (!meditationStart) return;
    const diffMs = Date.now() - meditationStart;
    const seconds = Math.floor(diffMs / 1000);

    if (seconds >= 10) {
      const minutes = Math.floor(seconds / 60);
      const remSec = seconds % 60;
      const timeString = minutes > 0 ? `${minutes} min ${remSec} sec` : `${remSec} sec`;
      addActivity(uid, "Completed Meditation Session", timeString);

      const daily = loadDaily();
      const todayObj = daily[today] || { meditation: 0, journal: 0, mood: 0 };
      todayObj.meditation += minutes;
      daily[today] = todayObj;
      saveDaily(daily);

      const tk = `user-${uid}-tasks-${today}`;
      const taskObj = JSON.parse(localStorage.getItem(tk) || '{"meditation":false,"journal":false,"mood":false}');
      taskObj.meditation = true;
      localStorage.setItem(tk, JSON.stringify(taskObj));
    }

    setMeditationStart(null);
  };

  useEffect(() => {
    const prev = prevVideoRef.current;
    if (prev !== null && prev !== activeVideo) stopAndSave();
    prevVideoRef.current = activeVideo;
    if (activeVideo !== null && !meditationStart) {
      setMeditationStart(Date.now());
    }
  }, [activeVideo]);

  useEffect(() => {
    if (!meditationStart) return;
    const interval = setInterval(() => {
      const diff = Date.now() - meditationStart;
      if (diff >= 10000) {
        stopAndSave(); 
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [meditationStart]);

  useEffect(() => {
    const handler = () => stopAndSave();
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, []);

  return (
    <div className="min-h-screen bg-backg text-darkblue py-20">
      <section className="max-w-6xl px-6 mx-auto md:px-12 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-darkblue">
            Guided Meditation for Mental Wellness
          </h1>
          <p className="mt-6 text-lg text-darkblue">Meditation is a practise, not perfection.</p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md">
        <p className="text-center text-lightgreen py-4 font-semibold px-4">
          <span className="text-darkblue font-semibold">Remember - </span>
          Each second you choose to try is self-care.
        </p>
      </div>

      <div className="min-h-screen bg-backg py-12 px-4 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-darkblue mb-10">Choose your practise</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl">
          {practices.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col transition-transform transform hover:scale-105 hover:shadow-xl"
            >
              {activeVideo === index ? (
                <iframe
                  className="w-full h-56"
                  src={`${item.videoUrl}?autoplay=1`}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="h-48 w-full object-cover cursor-pointer"
                  onClick={() => setActiveVideo(index)}
                />
              )}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-darkblue mb-2">{item.title}</h3>
                <p className="text-darkblue mb-4">{item.description}</p>
                <h4 className="font-semibold text-pinkGlow mb-1">Benefits:</h4>
                <ul className="list-disc list-inside text-darkblue mb-4 text-sm">
                  {item.benefits.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
                <button
                  className="mt-auto bg-lightgreen text-white font-medium py-2 px-4 rounded-xl hover:bg-aquaGlow transition"
                  onClick={() => setActiveVideo(index)}
                >
                  Start Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
