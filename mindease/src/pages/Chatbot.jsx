import React, { useState, useEffect } from "react";
import axios from "axios";
import Doctor from "../assets/image.png";
import Cloud from "../assets/Cloud.png";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Journal from "./Journal";

const Chatbot = () => {
  const [showGuide, setShowGuide] = useState(true);
  const [suggestion, setSuggestion] = useState(
    "Hey! Write your feelings here and I’ll help you understand them "
  );

  const navigate = useNavigate();

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/suggestion"); 
        if (res.data?.message) setSuggestion(res.data.message);
      } catch (err) {
        console.log("Suggestion fetch error:", err);
      }
    };

    fetchSuggestion();
  }, []);

  return (
    <>
      
      {showGuide && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4">

          <div className="relative flex items-center">

            
            <img
              src={Doctor}
              alt="Doctor"
              className="w-48 sm:w-60 md:w-72 lg:w-80 drop-shadow-2xl mr-4"
            />

           
            <div className="relative flex flex-col items-center">

              <img
                src={Cloud}
                alt="Cloud Bubble"
                className="w-48 sm:w-60 md:w-64 lg:w-72"
              />

            
              <p className="
                absolute top-1/2 left-1/2 
                w-[75%]
                transform -translate-x-1/2 -translate-y-1/2 
                text-center text-darkblue font-semibold
                text-[10px] sm:text-xs md:text-sm lg:text-base
                leading-tight
              ">
                {suggestion}
              </p>

              
              <button
                onClick={() => navigate("/journal")}
                className="mt-3 bg-lightgreen hover:bg-aquaGlow text-white px-4 py-2 rounded-full shadow-md text-xs sm:text-sm md:text-base transition"
              >
                Got it!
              </button>
            </div>

          </div>
        </div>
      )}

    
      <div className={`${showGuide ? "blur-sm pointer-events-none" : ""}`}>
        <Navbar />
        <Journal />
        <Footer />
      </div>
    </>
  );
};

export default Chatbot;

