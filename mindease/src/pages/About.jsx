import React from "react";
import Abot from "../assets/abot.png";
import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar />

      <div className="pt-10 w-full flex justify-center">
        <div className="relative w-[95%] md:w-[80%] max-w-6xl">

          {/* full width image */}
          <img
            src={Abot}
            alt="Plants Row"
            className="w-full h-auto rounded-xl shadow-lg"
          />

          {/* text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-start px-8 text-center pt-14 md:pt-24">

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-[#1f3a5f]">Mind</span>{" "}
              <span className="text-[#38b485]">Ease</span>
            </h2>

            <p className="text-[#38b485] text-lg md:text-xl font-medium leading-relaxed max-w-3xl">
              We understand that navigating mental health challenges whether it's
              the heavy fog of depression, the persistent grip of anxiety, or the
              feeling of being overwhelmed by life can be an incredibly isolating
              experience. It's easy to feel like no one truly understands what
              you're going through.
              <br/><br/>
              MindEase was born from that very feeling. We created this space because
              we believe that everyone deserves a safe, non-judgmental, and compassionate
              place to turn to. We believe that finding reliable information, practical
              support, and a sense of community shouldn’t be another struggle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

