import {  useNavigate } from "react-router-dom";

import Mountain from '../assets/mountain.jpg'
import Shape from '../assets/shape.jpg'
import { useRef } from "react";
import ai from "../assets/AI.png"
import Journal from "../assets/journal.png"
import Meditation from "../assets/meditation.png"
import Quiz from "../assets/quiz.png"
import Mood from "../assets/Mood.png"
import Community from "../assets/Community.png"

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Landing() {
  
  const featuresRef = useRef(null);
const navigate = useNavigate();

const handleScrollToFeatures = () => {
  featuresRef.current?.scrollIntoView({ behavior: "smooth" });
};


  return (
    
    <>
   
   
    <div className="min-h-screen bg-backg text-darkblue">
      

      <main className="hero-bg ">
        <section className="max-w-6xl px-6 mx-auto md:px-12 py-13">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-darkblue">
              Your journey to inner peace starts here
            </h1>
            <h2 className="mt-4 text-3xl md:text-4xl font-bold text-center text-darkblue">
              Welcome to your safe place for
              <span className="text-aquaGlow"> Mental Health</span>
            </h2>

            <p className="mt-6 text-lg text-center text-darkblue">
              MindEase provides guided meditations, mood tracking, and a supportive
              community to help you navigate life’s challenges with calm and clarity.
            </p>

            <div className="mt-15 pb-6 flex flex-wrap items-center justify-center gap-20">
              



              <button
                onClick={() => navigate("/register")} 
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-aquaGlow text-black font-semibold text-xl hover:bg-pinkGlow transition shadow-sm"
              >
                Sign up
              </button>


              <button
                onClick={handleScrollToFeatures}
                className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-aquaGlow text-black font-semibold text-xl hover:bg-pinkGlow transition shadow-sm"
              >
                Explore Features
              </button>
            </div>
          </div>

        
          <div className="mt-12 text-center">
            <h3 className="text-4xl font-bold text-darkblue">
              Everything you need for <span className="text-aquaGlow">wellness</span>
            </h3>
            <p className="mt-2 text-darkblue mx-auto">
              Comprehensive tools and resources to support your mental health journey.
            </p>
          </div>
        </section>

        
        <section ref={featuresRef} className="max-w-6xl mx-auto px-6 md:px-12 py-14">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 ">
            
            <div className="bg-backg rounded-2xl shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl border-2 border-darkblue hover:border-darkblue">
              
              <div className="w-16 h-20 mx-auto mb-4">

                <img src={Meditation}  
              alt="Guided Meditations"
className="rounded-3xl w-20 h-16 shadow-lg"/>
              </div>
              <h4 className="text-xl font-bold text-darkblue mb-2">
                Guided Meditations
              </h4>
              <p className="text-darkblue text-sm">
                Calm your mind with guided sessions designed to reduce stress and
                increase focus.
              </p>
            </div>

                <div 
         
            className="bg-backg rounded-2xl shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl border-2 border-darkblue hover:border-darkblue cursor-pointer"
          >
            <div className="w-16 h-20 mx-auto mb-4">

           <img src={Quiz}  
              alt="Mental Wellness Check"
className="rounded-3xl w-20 h-16 shadow-lg"/>  

            </div>
            <h4 className="text-xl font-bold text-darkblue mb-2">
              Mental Wellness Check
            </h4>
            <p className="text-darkblue text-sm">
              A short assessment that suggests whether you're doing fine, need extra self-care, or may benefit from talking to someone.
            </p>
          </div>

            <div className="bg-backg rounded-2xl shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl border-2 border-darkblue hover:border-darkblue">
              <div className="w-16 h-20 mx-auto mb-4"
              >

                  <img src={Mood}  
              alt="Mental Wellness Check"
className="rounded-3xl w-20 h-16 shadow-lg"/>    
                
              </div>
              <h4 className="text-xl font-bold text-darkblue mb-2">
                Mood Detection
              </h4>
              <p className="text-darkblue text-sm">
                AI-powered mood tracking helps you identify emotional patterns and triggers.
              </p>
            </div>

            
            <div className="bg-backg rounded-2xl shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl border-2 border-darkblue hover:border-darkblue">
              <div className="w-16 h-20 mx-auto mb-4">
                 <img src={Journal}  
              alt="Mental Wellness Check"
className="rounded-3xl w-20 h-16 shadow-lg"/>    
              </div>
              <h4 className="text-xl font-bold text-darkblue mb-2">
                Daily Journal
              </h4>
              <p className="text-darkblue text-sm">
                Reflect on your thoughts and track your emotional growth through daily entries
              </p>
            </div>

          
            <div  onClick={() => navigate("/chat")}  className="bg-backg rounded-2xl shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl border-2 border-darkblue hover:border-darkblue">
              <div className="w-16 h-20 mx-auto mb-4">
                 <img src={ai}  
              alt="Mental Wellness Check"
className="rounded-3xl w-20 h-16 shadow-lg"/>    
              </div>
              <h4 className="text-xl font-bold text-darkblue mb-2">
                AI Companion
              </h4>
              <p className="text-darkblue text-sm">
                Chat with our AI-powered Therapist for real-time emotional support.
              </p>
            </div>

        
            <div className="bg-backg rounded-2xl shadow-md p-6 text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl border-2 border-darkblue hover:border-darkblue">
              <div className="w-16 h-20 mx-auto mb-4">
                <img src={Community}  
              alt="Mental Wellness Check"
className="rounded-3xl w-20 h-16 shadow-lg"/>    
              </div>
              <h4 className="text-xl font-bold text-darkblue mb-2">
                Community Space
              </h4>
              <p className="text-darkblue text-sm">
                Connect with others, share your experiences, and grow together.
              </p>
            </div>
          </div>
        </section>
      </main>

   
      <section className="py-16 space-y-20 px-6 md:px-20 ">
        
     
<div className="flex flex-col md:flex-row items-center mx-20 ">
  <div className="md:w-1/2 mx-10">
    <h3 className="text-4xl font-bold mb-2 leading-relaxed">
      Your feelings are valid.<br/> Your journey is important.
    </h3>
    <span className="text-darkblue text-4xl font-bold mb-3">Welcome to your </span> <br/> 
    <span className="text-lightgreen text-4xl font-bold mb-3 leading-relaxed"> SAFE SPACE.</span>
  </div>
  <div className="md:w-1/2">
    <img
      src={Shape}
      alt="Meditation"
      className="rounded-4xl w-140 shadow-lg"
    />
  </div>
</div>


        
        <div className="flex flex-col md:flex-row-reverse items-center mx-20">
          <div className="md:w-1/2 mx-5">
            <h3 className="text-4xl font-bold mb-2 leading-relaxed">
              Your trusted companion for {" "}
              <span className="text-[#5CB8A5]">Mental Wellbeing.</span>
            
            <span className="text-darkblue text-4xl font-bold mb-2 ">
              {" "}Find peace, build resilience, and connect with a supportive community.
            </span>
            </h3>
          </div>
          <div className="md:w-1/2">
            <img
              src={Mountain}
              alt="Nature Calm"
               className="rounded-4xl w-140 shadow-lg"
            />
          </div>
        </div>
      </section>


      
    </div>
    
    
 </>
  );
}


