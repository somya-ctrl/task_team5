import React, { useState } from "react";
import Navbar from "../components/Navbar";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userText }]);
    setInput("");
    setLoading(true);

    const res = await fetch("https://mindbot-1eic.onrender.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        session_id: "mindbot-user-1",
        query: userText
      })
    });

    const data = await res.json();

    setMessages(prev => [...prev, { role: "bot", text: data?.response || "No response" }]);
    setLoading(false);
  }

  return (
<>
<Navbar/>
    <div className="min-h-screen bg-backg flex flex-col text-darkblue">

      
      <div className="px-6 mt-22 py-8 bg-darkblue text-lightgrey font-bold text-3xl text-center shadow-md rounded-b-2xl">
        MindBot Support Chat 💬
      </div>

      
      {messages.length === 0 && (
        <div className="p-6 text-center text-darkblue opacity-70 text-xl leading-relaxed">
          Your safe space to talk.  
          <br/>Ask questions about stress, anxiety, feelings… anything.
        </div>
      )}

      
      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[40%] px-5 py-2 rounded-2xl text-sm shadow-sm
              ${m.role === "user" 
          ? "ml-auto bg-lightgreen text-white"
                : "mr-auto bg-lightgrey text-darkblue border border-lightgreen"
              }`
            }
          >
            {m.text}
          </div>
        ))}

        {loading && <div className="text-sm text-darkblue opacity-50">typing…</div>}
      </div>

      {/* input bar */}
      <div className="fixed bottom-0 left-0 right-0 p-3 bg-backg border-t border-lightgreen flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Share what's on your mind..."
          className="flex-1 border border-lightgreen rounded-xl px-3 py-2 bg-lightgrey text-darkblue focus:outline-lightgreen"
        />
        <button
          onClick={sendMessage}
          className="px-5 py-2 bg-lightgreen rounded-xl text-white font-semibold active:scale-95 transition"
        >
          Send
        </button>
      </div>
    </div>

    </>
  );
}
