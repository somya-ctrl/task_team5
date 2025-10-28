import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaSmile } from "react-icons/fa";
import Webcam from "react-webcam";

const MoodDetection = () => {
  const navigate = useNavigate();
  const webcamRef = useRef(null);

  const [cameraActive, setCameraActive] = useState(false);
  const [mood, setMood] = useState("");
  const [loading, setLoading] = useState(false);
  const [captured, setCaptured] = useState(false);
  const [imageData, setImageData] = useState("");

  const handlePredictMood = () => {
    setCameraActive(true);
    setMood("");
    setCaptured(false);
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImageData(imageSrc);
    setCaptured(true);
  };

  const handleRetake = () => {
    setCaptured(false);
    setImageData("");
    setMood("");
  };

  const handleSend = async () => {
    if (!imageData) return alert("Please capture an image first!");

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5000/predict", {
        image: imageData,
      });

      setMood(response.data.mood || "Mood detected");
    } catch (err) {
      console.error("Error sending image:", err);
      alert("Error predicting mood. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-backg text-darkblue flex flex-col items-center py-40 px-6">
      <h1 className="text-3xl md:text-4xl font-bold mb-3 text-center">
        Discover your Mental State
      </h1>
      <p className="text-center text-lg mb-10 max-w-2xl">
        Let our AI powered mood detection help you understand your current emotional state.
      </p>

      <div className="bg-lightgrey rounded-2xl shadow-md p-8 max-w-lg w-full text-center mb-16">
        <div className="text-5xl mb-4">📷</div>
        <h2 className="text-xl font-semibold mb-2">Ready to check your mood?</h2>
        <p className="text-sm mb-6">
          Click the button below to activate your camera and analyze your facial expressions.
        </p>

       
        {!cameraActive && (
          <button
            onClick={handlePredictMood}
            className="bg-lightgreen hover:bg-aquaGlow text-white font-semibold py-2 px-6 rounded-full transition-all duration-300"
          >
            Predict your Mood
          </button>
        )}

        
        {cameraActive && (
          <div className="flex flex-col items-center space-y-4">

           
            {!captured && (
              <Webcam
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                mirrored={true}
                videoConstraints={{ facingMode: "user" }}
                className="rounded-xl shadow-md w-80 mt-6"
              />
            )}

           
            {captured && (
              <>
                <img src={imageData} alt="Captured" className="rounded-xl shadow-md w-80" />

               
                <button
                  onClick={handleRetake}
                  className="bg-gray-400 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300"
                >
                  Retake
                </button>
              </>
            )}

         
            {!captured && (
              <button
                onClick={handleCapture}
                className="bg-aquaGlow hover:bg-lightgreen text-white font-semibold py-2 px-6 rounded-full transition-all duration-300"
              >
                Capture
              </button>
            )}

         
            {captured && (
              <button
                onClick={handleSend}
                disabled={loading}
                className="bg-lightgreen hover:bg-aquaGlow text-white font-semibold py-2 px-6 rounded-full transition-all duration-300"
              >
                {loading ? "Analyzing..." : "Send"}
              </button>
            )}

          
            {mood && (
              <p className="text-lg font-medium text-darkblue mt-4">
                Your detected mood:{" "}
                <span className="font-bold text-pinkGlow">{mood}</span>
              </p>
            )}
          </div>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-center">Take a Moment to Breathe</h2>
      <p className="text-center mb-10">Here are some peaceful images to help calm your mind and lift your spirits</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-40 mb-16 max-w-4xl">
        <div className="bg-lightgrey rounded-2xl overflow-hidden shadow-md">
          <img
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
            alt="Nature peace"
            className="w-full h-56 object-cover"
          />
          <div className="p-4 text-center">
            <h3 className="font-semibold text-lg mb-1">Find peace in nature</h3>
            <p className="text-sm">Nature has a calming effect on our mind and souls</p>
          </div>
        </div>

        <div className="bg-lightgrey rounded-2xl overflow-hidden shadow-md">
          <img
            src="https://images.unsplash.com/photo-1501973801540-537f08ccae7b"
            alt="Sunset hope"
            className="w-full h-56 object-cover"
          />
          <div className="p-4 text-center">
            <h3 className="font-semibold text-lg mb-1">Every sunset brings hope</h3>
            <p className="text-sm">Tomorrow is a new day with new possibilities</p>
          </div>
        </div>
      </div>

      <div className="bg-lightgrey rounded-2xl shadow-md p-8 max-w-lg text-center">
        <FaSmile className="text-5xl text-lightgreen mb-4 mx-auto" />
        <h2 className="text-xl font-semibold mb-2">You are not alone</h2>
        <p className="text-sm mb-6">
          Remember, it's okay to not be okay sometimes. Be gentle with yourself.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/meditations")}
            className="border-2 border-aquaGlow text-aquaGlow hover:bg-aquaGlow hover:text-white font-semibold py-2 px-5 rounded-full transition-all duration-300"
          >
            Explore Meditations
          </button>
          <button className="border-2 border-lightgreen text-lightgreen hover:bg-lightgreen hover:text-white font-semibold py-2 px-5 rounded-full transition-all duration-300">
            Talk to Community
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoodDetection;
