import React from "react";
import Abot from "../assets/abot.png"
import Navbar from "../components/Navbar";

export default function About() {
  return (
    <div className="min-h-screen bg-[#f5f5f5] text-darkblue">
      <div className="w-full flex justify-center items-end mt-12 mb-2">
          <img
            src={Abot}
            alt="Plants Row"
            className="w-[90%] md:w-[75%] rounded-xl shadow-md"
            style={{ objectFit: 'cover' }}
          />
        </div> 
     
    </div>
  );
}
