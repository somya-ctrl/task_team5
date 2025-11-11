import React, { useState,useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function Chat() {

  const user = JSON.parse(localStorage.getItem("user") || "{}");
const uid = user?.id;

const addActivity = (uid, text, meta = "") => {
  const key = `user-${uid}-activity`;
  const arr = JSON.parse(localStorage.getItem(key) || "[]");
  arr.unshift({ text, meta, ts: Date.now() });
  if (arr.length > 20) arr.length = 20; 
  localStorage.setItem(key, JSON.stringify(arr));
};


  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [sessionStarted, setSessionStarted] = useState(false);
  const SESSION_ID = "mindbot-user-1";

  const BASE_CHAT = import.meta.env.VITE_CHATBOT_API;
  const token = localStorage.getItem("accessToken");  

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    try {
      let res;
      const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

      if (!sessionStarted) {
        
        res = await axios.post(
          `${BASE_CHAT}/start`,
          {
            session_id: SESSION_ID,
            query: userText,
          },
          config
        );
        setSessionStarted(true);
      } else {
        
        res = await axios.post(
          `${BASE_CHAT}/chat`,
          {
            session_id: SESSION_ID,
            query: userText,
          },
          config
        );
      }

      setMessages((prev) => [
        ...prev,
        { role: "bot", text: res?.data?.response || "No response" },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Error connecting to server" },
      ]);
    }
    setLoading(false);
  }

  useEffect(() => {
  if (uid) addActivity(uid, "Opened AI Therapist");
}, [uid]);


  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-backg flex flex-col text-darkblue">
        <div className="px-6 mt-22 py-8 bg-darkblue text-lightgrey font-bold text-3xl text-center shadow-md fixed z-50 w-full ">
          MindBot Support Chat 💬
        </div>

        {messages.length === 0 && (
          <div className="p-6 text-center text-darkblue opacity-70 text-xl leading-relaxed">
            Your safe space to talk.
            <br />Ask questions about stress, anxiety, feelings… anything.
          </div>
        )}

        <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[40%] px-5 py-4 rounded-2xl text-md shadow-sm left-100 right-100 ${
                m.role === "user"
                  ? "ml-auto bg-lightgreen text-white"
                  : "mr-auto bg-lightgrey text-darkblue border border-lightgreen"
              }`}
            >
              {m.text}
            </div>
          ))}

          {loading && <div className="text-sm text-darkblue opacity-50">typing...</div>}
        </div>

        <div className="fixed bottom-0  p-3  border-t border-lightgreen flex gap-2 bg-white w-full">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Share what's on your mind..."
            className="flex-1 border border-lightgreen rounded-xl px-3 py-2 mb-5 bg-white text-darkblue focus:outline-lightgreen"
          />
          <button
            onClick={sendMessage}
            className="px-5  bg-lightgreen rounded-xl text-white font-semibold active:scale-95 transition cursor-pointer"
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}
