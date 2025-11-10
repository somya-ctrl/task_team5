import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Result() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  axios.get(`${import.meta.env.VITE_API_BASE_URL}/result`, {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token")
    }
  })
    .then((res) => {
      console.log("API RES:", res.data);
      setResult(res.data.result);  
    })
    .catch((err) => {
      console.log(err);
      setResult(null);
    })
    .finally(() => setLoading(false));
}, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-backg">
        <p className="text-lg text-darkblue">Loading Result...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-backg">
        <p className="text-lg text-red-600">No result found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-backg flex flex-col items-center py-50 px-4">

      <div className="bg-white rounded-2xl shadow-md max-w-xl w-full p-8 text-center border border-lightgrey">
        
        <h2 className="text-2xl font-bold mb-2 text-darkblue">
          Your Mental Wellness Result
        </h2>

        <div className="w-20 h-1 bg-lightgreen mx-auto rounded-full mb-6" />

        <p className="text-lg font-semibold text-darkblue mb-3">
          {result.score_text}
        </p>

        <p className="text-md text-gray-700 mb-4">
          {result.prediction}
        </p>

        <div className="bg-lightgrey py-3 rounded-xl text-darkblue font-semibold text-lg mb-6">
          Score: {result.score}
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="px-6 py-2 bg-lightgreen hover:bg-aquaGlow text-white rounded-lg transition duration-200"
        >
          Go to Dashboard
        </button>

      </div>

      <p className="mt-6 text-sm text-gray-600 max-w-md text-center">
        Thank you for completing the assessment
      </p>

    </div>
  );
}
