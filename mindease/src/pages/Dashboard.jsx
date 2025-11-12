import React, { useMemo, useState, useEffect } from "react";
import { Doughnut, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "axios";
import {
  FaSmile,
  FaSadTear,
  FaFrown,
  FaRegLaughBeam,
  FaAngry,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Journal from "../assets/journal.png";
import AI from "../assets/AI.png";
import Quiz from "../assets/quiz.png";
import Meditation from "../assets/meditation.png";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const getUser = () => JSON.parse(localStorage.getItem("user") || "{}");
const todayISO = () => new Date().toISOString().slice(0, 10);

const DAILY_KEY = (uid) => `user-${uid}-daily`;
const loadDaily = (uid) => JSON.parse(localStorage.getItem(DAILY_KEY(uid)) || "{}");
const saveDaily = (uid, obj) => localStorage.setItem(DAILY_KEY(uid), JSON.stringify(obj));
const upserDay = (dayObj) => ({ meditation: 0, journal: 0, mood: 0, ...dayObj });

const addMinutes = (daily, date, field, minutes) => {
  const d = upserDay(daily[date]);
  d[field] += minutes;
  daily[date] = d;
};
const incMood = (daily, date) => {
  const d = upserDay(daily[date]);
  d.mood += 1;
  daily[date] = d;
};

const sumLast7 = (daily, field) => {
  let total = 0;
  const base = new Date(todayISO());
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    total += daily[key]?.[field] || 0;
  }
  return total;
};

const streak = (daily, predicate) => {
  let s = 0;
  const base = new Date(todayISO());
  while (true) {
    const key = base.toISOString().slice(0, 10);
    if (predicate(upserDay(daily[key]))) {
      s++;
      base.setDate(base.getDate() - 1);
    } else break;
  }
  return s;
};

const TASKS_KEY = (uid, d = todayISO()) => `user-${uid}-tasks-${d}`;
const loadTasks = (uid, d = todayISO()) =>
  JSON.parse(localStorage.getItem(TASKS_KEY(uid, d)) || '{"meditation":false,"journal":false,"mood":false}');
const saveTasks = (uid, tasks, d = todayISO()) =>
  localStorage.setItem(TASKS_KEY(uid, d), JSON.stringify(tasks));

const MOOD_KEY = (uid) => `user-${uid}-mood-history`;
const loadMoodHistory = (uid) =>
  JSON.parse(localStorage.getItem(MOOD_KEY(uid)) || '{"Happy":0,"Sad":0,"Anxious":0,"Calm":0,"Angry":0}');
const saveMoodHistory = (uid, obj) => localStorage.setItem(MOOD_KEY(uid), JSON.stringify(obj));

const ACTIVITY_KEY = (uid) => `user-${uid}-activity`;

const loadActivity = (uid) => {
  const arr = JSON.parse(localStorage.getItem(ACTIVITY_KEY(uid)) || "[]");
  if (arr.length === 0) return [];

  const filtered = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i].text !== arr[i - 1].text) filtered.push(arr[i]);
  }
  return filtered;
};

const clamp = (n, min, max) => Math.min(Math.max(n, min), max);

const useDashboardData = (tasks) => {
  const [goals, setGoals] = useState([
    { id: 1, text: " Meditation", duration: "30 mins", done: tasks.meditation, auto: true },
    { id: 2, text: "Journal Entry", duration: "5 mins", done: tasks.journal, auto: true },
    { id: 3, text: "Mood Check", duration: " ", done: tasks.mood, auto: true },
  ]);

  useEffect(() => {
    setGoals((gs) =>
      gs.map((g) =>
        g.id === 1 ? { ...g, done: tasks.meditation }
          : g.id === 2 ? { ...g, done: tasks.journal }
            : g.id === 3 ? { ...g, done: tasks.mood }
              : g
      )
    );
  }, [tasks]);

  const toggleGoal = (id) =>
    setGoals((gs) =>
      gs.map((g) => (g.auto ? g : g.id === id ? { ...g, done: !g.done } : g))
    );
  return { goals, toggleGoal, setGoals };
};

function Gauge({ value }) {
  const v = clamp(value, 0, 100);
  const gaugePalette = ["#219654", "#FFFF00", "#880808"];
  const segments = [33, 33, 34];
  const labels = ["Good", "Mid", "Bad"];

  const data = {
    labels,
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
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
      datalabels: {
        color: "#000",
        font: { weight: "bold", size: 20 },
        formatter: (value, context) => context.chart.data.labels[context.dataIndex],
        anchor: "center",
        align: "center",
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const angle = -90 + (180 * v) / 100;

  return (
    <div className="relative w-full max-w-xl mx-auto aspect-[2/1] sm:aspect-[3/2]">
      <Doughnut data={data} options={options} />
      {/* Needle */}
      <div
        className="absolute left-1/2 bottom-[18%] origin-bottom"
        style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
      >
        <div className="h-20 sm:h-28 w-1.5 bg-darkblue rounded-full" />
        <div className="h-3 w-3 -mt-1 rounded-full bg-darkblue mx-auto" />
      </div>
      {/* Center circle */}
      <div className="absolute left-1/2 bottom-[18%] -translate-x-1/2 translate-y-1/2">
        <div className="h-6 w-6 rounded-full bg-white ring-2 ring-darkblue" />
      </div>
    </div>
  );
}

function TaskCompletionDonut({ percent }) {
  const p = clamp(percent, 0, 100);
  const data = {
    datasets: [
      { data: [p, 100 - p], backgroundColor: ["#C54E9E", "#E5E7EB"], borderWidth: 0, cutout: "55%" },
    ],
  };
  return (
    <div className="relative w-full h-48 sm:h-64 flex items-center justify-center">
      <Doughnut
        data={data}
        options={{
          cutout: "55%",
          plugins: { legend: { display: false }, tooltip: { enabled: false } },
          maintainAspectRatio: false,
        }}
      />
      <div className="absolute text-xl sm:text-2xl font-bold text-darkblue">{p}%</div>
    </div>
  );
}

function MoodPie({ items }) {
  const data = React.useMemo(() => {
    return {
      labels: items.map((i) => i.label),
      datasets: [
        {
          data: items.map((i) => i.value),
          backgroundColor: [
            "#219654",
            "#C54E9E",
            "#F97316",
            "#60A5FA",
            "#F59E0B",
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
    <div className="w-full h-48 sm:h-64">
      <Pie data={data} options={options} />
    </div>
  );
}

const BigAction = ({ img, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-end rounded-2xl bg-blend-color ring-1 ring-darkblue-200 hover:shadow-lg transition w-full max-w-2xl mx-auto h-44 sm:h-48 my-4 "
  >
    <div className="h-27 w-22 rounded-2xl bg-aquaGlow/15 flex items-center justify-center text-2xl">
      <img src={img} alt={label} className="h-12 w-12 object-contain" />
    </div>
    <span className="mt-3 font-semibold pb-6 text-lg text-center">{label}</span>
  </button>
);

const Card = ({ title, children, className = "" }) => (
  <div className={`rounded-2xl bg-blend-color p-5 ${className}`}>
    {title && <h3 className="text-base font-semibold mb-3">{title}</h3>}
    {children}
  </div>
);

export default function Dashboard() {
  const user = getUser();
  const uid = user?.id;
  const userName = user?.name || "User";
  const profession = (user?.profession || localStorage.getItem("profession"))?.toLowerCase();
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setScore(0);
      return;
    }
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    if (profession === "student") {
      axios
        .get("https://mindease-backend-cyvy.onrender.com/sturesult", config)
        .then((res) => setScore(res.data?.result?.stress_score ?? 0))
        .catch(() => setScore(0));
    } else {
      axios
        .get("https://mindease-backend-cyvy.onrender.com/result", config)
        .then((res) => setScore(res.data?.result?.score ?? 0))
        .catch(() => setScore(0));
    }
  }, [profession]);

  const [tasks, setTasks] = useState(() => loadTasks(uid));
  useEffect(() => {
    const key = TASKS_KEY(uid, todayISO());
    const onStorage = (e) => {
      if (e.key === key && e.newValue) setTasks(JSON.parse(e.newValue));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [uid]);

  const [moodHistory, setMoodHistory] = useState(() => loadMoodHistory(uid));

  const handleMoodSelect = (mood) => {
    const updatedHistory = { ...moodHistory, [mood]: (moodHistory[mood] || 0) + 1 };
    setMoodHistory(updatedHistory);
    saveMoodHistory(uid, updatedHistory);

    setTasks((prev) => {
      const next = { ...prev, mood: true };
      saveTasks(uid, next);
      return next;
    });

    const daily = loadDaily(uid);
    incMood(daily, todayISO());
    saveDaily(uid, daily);
  };

  const { goals, toggleGoal } = useDashboardData(tasks);
  const [activity, setActivity] = useState(() => loadActivity(uid));

  useEffect(() => {
    const key = ACTIVITY_KEY(uid);
    const onStorage = (e) => {
      if (e.key === key) setActivity(loadActivity(uid));
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [uid]);

  useEffect(() => {
    const onFocus = () => setActivity(loadActivity(uid));
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [uid]);

  const doneCount = ["meditation", "journal", "mood"].filter((k) => tasks[k]).length;
  const taskPercent = Math.round((doneCount / 3) * 100);

  const daily = loadDaily(uid);
  const medWeek = sumLast7(daily, "meditation");
  const journalWeek = sumLast7(daily, "journal");
  const moodWeek = sumLast7(daily, "mood");

  const medStreak = streak(daily, (d) => d.meditation > 0);
  const journalStreak = streak(daily, (d) => d.journal > 0);
  const moodStreak = streak(daily, (d) => d.mood > 0);

  return (
    <div className="min-h-screen bg-backg text-slate-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-30 space-y-8">
        <section className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-semibold">
            Welcome back, <span className="font-bold">{userName}</span>
          </h1>

          <Card>
            <Gauge value={score} />
            <div className="text-center mt-4">
              <p className="text-md text-slate-600">Your Mental Health Score</p>
              <p className="text-3xl font-extrabold mt-1">{score}%</p>
            </div>
          </Card>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-20 px-4 sm:px-6 lg:px-6">
          <BigAction label="Meditate" img={Meditation} onClick={() => navigate("/meditations")} />
          <BigAction label="Journal" img={Journal} onClick={() => navigate("/journal")} />
          <BigAction label="Mini Ques" img={Quiz} onClick={() => navigate("/miniques")} />
          <BigAction label="AI Therapist" img={AI} onClick={() => navigate("/chat")} />
        </section>

        <section className="pt-10 px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold mb-6 sm:mb-10">Select your mood</h2>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
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
                <span className="text-sm text-darkblue pt-1 font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold my-8 sm:my-12">Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              <TaskCompletionDonut percent={taskPercent} />
              <p className="mt-3 text-center font-medium">Daily Task Completion</p>
            </Card>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 sm:px-6 lg:px-8">
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
                    onClick={() => !g.auto && toggleGoal(g.id)}
                    className={`h-6 w-6 rounded-full border flex items-center justify-center ${
                      g.done ? "bg-lightgreen text-white border-lightgreen" : "border-slate-300"
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
              {activity.length === 0 && (
                <li className="text-slate-500">No recent activity</li>
              )}
              {activity.slice(0, 3).map((a, idx) => (
                <li
                  key={a.ts ?? idx}
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

        <section className="px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-semibold mb-3">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl p-5 bg-lightgreen/30">
              <p className="text-sm">{medWeek} min</p>
              <p className="text-xs text-slate-700">Meditation this week</p>
              <p className="text-xs mt-2 font-medium">{medStreak} day streak</p>
            </div>
            <div className="rounded-2xl p-5 bg-aquaGlow/20">
              <p className="text-sm">{journalWeek} min</p>
              <p className="text-xs text-slate-700">Journaling this week</p>
              <p className="text-xs mt-2 font-medium">{journalStreak} day streak</p>
            </div>
            <div className="rounded-2xl p-5 bg-pinkGlow/20">
              <p className="text-sm">{moodWeek}</p>
              <p className="text-xs text-slate-700">Mood checks this week</p>
              <p className="text-xs mt-2 font-medium">{moodStreak} day streak</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
