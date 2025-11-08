// Dashboard.jsx
import React, { useMemo, useState, useEffect } from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import {
  FaSmile,
  FaSadTear,
  FaFrown,
  FaRegLaughBeam,
  FaAngry,
} from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

// ---------- utils ----------
const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

// ---------- simple data hook (no mood here anymore) ----------
const useDashboardData = () => {
  const [taskCompletion] = useState(50);

  const [goals, setGoals] = useState([
    { id: 1, text: "Morning Meditation", duration: "7 mins", done: true },
    { id: 2, text: "Journal Entry", duration: "7 mins", done: false },
    { id: 3, text: "Evening Mood Check", duration: "7 mins", done: false },
  ]);

  const [activity] = useState([
    { id: 11, text: "Journal Entry", meta: "7 mins" },
    { id: 12, text: "Evening Mood Check", meta: "7 mins" },
    { id: 13, text: "Morning Meditation", meta: "7 mins" },
  ]);

  const toggleGoal = (id) =>
    setGoals((gs) => gs.map((g) => (g.id === id ? { ...g, done: !g.done } : g)));

  return { taskCompletion, goals, toggleGoal, activity };
};

// ---------- charts ----------
function Gauge({ value }) {
  const v = clamp(value, 0, 100);
  const gaugePalette = ["#219654", "#48B6BC", "#C54E9E"]; // lightgreen, aquaGlow, pinkGlow
  const segments = [33, 33, 34];

  const data = {
    labels: ["Good", "Okay", "Low"],
    datasets: [
      {
        data: segments,
        backgroundColor: gaugePalette,
        borderWidth: 0,
        cutout: "65%",
        circumference: 180,
        rotation: -90,
      },
    ],
  };

  const options = {
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    responsive: true,
    maintainAspectRatio: false,
  };

  const angle = -90 + (180 * v) / 100;

  return (
    <div className="relative w-full max-w-xl mx-auto aspect-[2/1]">
      <Doughnut data={data} options={options} />
      {/* needle */}
      <div
        className="absolute left-1/2 bottom-[18%] origin-bottom"
        style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
      >
        <div className="h-28 w-1.5 bg-darkblue rounded-full" />
        <div className="h-3 w-3 -mt-1 rounded-full bg-darkblue mx-auto" />
      </div>
      {/* center cap */}
      <div className="absolute left-1/2 bottom-[18%] -translate-x-1/2 translate-y-1/2">
        <div className="h-6 w-6 rounded-full bg-white ring-2 ring-darkblue" />
      </div>
    </div>
  );
}

function HalfDonut({ percent }) {
  const p = clamp(percent, 0, 100);
  const data = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        data: [p, 100 - p],
        backgroundColor: ["#C54E9E", "#E5E7EB"],
        borderWidth: 0,
        cutout: "70%",
        circumference: 180,
        rotation: -90,
      },
    ],
  };
  const options = {
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    responsive: true,
    maintainAspectRatio: false,
  };
  return (
    <div className="relative w-full aspect-[2/1]">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex items-center justify-center pt-6">
        <span className="text-3xl font-semibold">{p}%</span>
      </div>
    </div>
  );
}

function MoodPie({ items }) {
  // items come in the same order as buttons: Happy, Sad, Anxious, Calm, Angry
  const data = useMemo(() => {
    return {
      labels: items.map((i) => i.label),
      datasets: [
        {
          data: items.map((i) => i.value),
          backgroundColor: [
            "#219654", // lightgreen (Happy)
            "#C54E9E", // pinkGlow (Sad)
            "#F97316", // orange (Anxious)
            "#60A5FA", // blue (Calm)
            "#F59E0B", // amber (Angry)
          ],
          borderWidth: 0,
        },
      ],
    };
  }, [items]);

  const options = {
    plugins: { legend: { display: false } },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="w-full h-64">
      <Pie data={data} options={options} />
    </div>
  );
}

// ---------- UI atoms ----------
const BigAction = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-end rounded-2xl bg-blend-color ring-1 ring-darkblue-200 hover:shadow-md transition w-50 h-45 ml-9 my-7"
  >
    <div className="h-14 w-14 rounded-2xl bg-aquaGlow/15 flex items-center justify-center text-aquaGlow text-2xl">
      {icon}
    </div>
    <span className="mt-3 font-medium pb-6">{label}</span>
  </button>
);

const Card = ({ title, children, className = "" }) => (
  <div className={`rounded-2xl bg-blend-color p-5 ${className}`}>
    {title && <h3 className="text-base font-semibold mb-3">{title}</h3>}
    {children}
  </div>
);

// ---------- PAGE ----------
export default function Dashboard() {
  // score from backend
  const [score, setScore] = useState(0);
  useEffect(() => {
    axios
      .get("https://mindease-backend-cyvy.onrender.com/result", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((res) => {
        console.log("Dashboard Result API:", res.data);
        setScore(res.data?.result?.score ?? 0);
      })
      .catch((err) => {
        console.log(err);
        setScore(0);
      });
  }, []);

  // mood history from localStorage (simple totals)
  const [moodHistory, setMoodHistory] = useState(() => {
    const saved = localStorage.getItem("mood-history");
    return saved
      ? JSON.parse(saved)
      : { Happy: 0, Sad: 0, Anxious: 0, Calm: 0, Angry: 0 };
  });

  const handleMoodSelect = (mood) => {
    const updated = { ...moodHistory, [mood]: (moodHistory[mood] || 0) + 1 };
    setMoodHistory(updated);
    localStorage.setItem("mood-history", JSON.stringify(updated));
  };

  const { taskCompletion, goals, toggleGoal, activity } = useDashboardData();

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = storedUser.name || storedUser.fullName || "User";

  return (
    <div className="min-h-screen bg-[#FAF5E6] text-slate-900">
     
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-36 space-y-8">
        {/* Welcome + Gauge */}
        <section className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Welcome back, <span className="font-bold">{userName}</span>
          </h1>

          <Card >
            <Gauge value={score} />
            <div className="text-center mt-4">
              <p className="text-sm text-slate-600">Your Mental Health Score</p>
              <p className="text-3xl font-extrabold mt-1">{score}%</p>
            </div>
          </Card>
        </section>

        {/* Big actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <BigAction label="Meditate" icon={"🧘"} onClick={() => {}} />
          <BigAction label="Journal" icon={"📝"} onClick={() => {}} />
          <BigAction label="Mood Check" icon={"😊"} onClick={() => {}} />
          <BigAction label="AI Therapist" icon={"👨‍⚕️"} onClick={() => {}} />
        </section>

        {/* Mood selector (ABOVE Analysis) */}
        <section className="pt-10">
          <h2 className="text-2xl font-semibold mb-10">Select your mood</h2>
          <div className="grid grid-cols-5 gap-4">
            {[
              { icon: <FaSmile className="text-2xl" />, label: "Happy" },
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
                <span className="text-sm text-darkblue pt-1 font-medium">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Analysis */}
        <section>
          <h2 className="text-2xl font-semibold my-12">Analysis</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <MoodPie
                items={[
                  { label: "Happy", value: moodHistory.Happy },
                  { label: "Sad", value: moodHistory.Sad },
                  { label: "Anxious", value: moodHistory.Anxious },
                  { label: "Calm", value: moodHistory.Calm },
                  { label: "Angry", value: moodHistory.Angry },
                ]}
              />
              <p className="mt-3 text-center font-medium">Last 7 days mood (local)</p>
            </Card>

            <Card>
              <HalfDonut percent={taskCompletion} />
              <p className="mt-3 text-center font-medium">Daily Task Completion</p>
            </Card>
          </div>
        </section>

        {/* Goals & Recent Activity */}
        <section className="grid md:grid-cols-2 gap-6">
          <Card title="Today's Goals">
            <ul className="space-y-3">
              {goals.map((g) => (
                <li
                  key={g.id}
                  className="flex items-center justify-between rounded-xl bg-[#FBF6EA] ring-1 ring-slate-200 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">•</span>
                    <div>
                      <p className="font-medium">{g.text}</p>
                      <p className="text-xs text-slate-500">{g.duration}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleGoal(g.id)}
                    className={`h-6 w-6 rounded-full border flex items-center justify-center ${
                      g.done
                        ? "bg-lightgreen text-white border-lightgreen"
                        : "border-slate-300"
                    }`}
                  >
                    {g.done ? "✓" : ""}
                  </button>
                </li>
              ))}
            </ul>
           
          </Card>

          <Card title="Recent Activity">
            <ul className="space-y-3">
              {activity.map((a) => (
                <li
                  key={a.id}
                  className="flex items-center justify-between rounded-xl bg-[#FBF6EA] ring-1 ring-slate-200 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📝</span>
                    <p className="font-medium">{a.text}</p>
                  </div>
                  <p className="text-xs text-slate-500">{a.meta}</p>
                </li>
              ))}
            </ul>
          </Card>
        </section>

        {/* Overview */}
        <section>
          <h2 className="text-xl font-semibold mb-3">Overview</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="rounded-2xl p-5 bg-lightgreen/30">
              <p className="text-sm">45 min</p>
              <p className="text-xs text-slate-700">Meditation this week</p>
              <p className="text-xs mt-2 font-medium">7 day streak</p>
            </div>
            <div className="rounded-2xl p-5 bg-aquaGlow/20">
              <p className="text-sm">45 min</p>
              <p className="text-xs text-slate-700">Journaling this week</p>
              <p className="text-xs mt-2 font-medium">7 day streak</p>
            </div>
            <div className="rounded-2xl p-5 bg-pinkGlow/20">
              <p className="text-sm">7</p>
              <p className="text-xs text-slate-700">Mood checks this week</p>
              <p className="text-xs mt-2 font-medium">Keep it up</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
