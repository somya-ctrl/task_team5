import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Result() {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const profession = (user?.profession || localStorage.getItem("profession"))?.toLowerCase();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setLoading(false);
      setResult(null);
      setError("You must be logged in to view results.");
      return;
    }

    const submitStudentQuizAndFetchResult = async () => {
      try {
        const answers = JSON.parse(localStorage.getItem("studentAnswers") || "[]");
        const keys = [
          "anxiety_level", "self_esteem", "mental_health_history", "depression",
          "headache", "blood_pressure", "sleep_quality", "breathing_problem",
          "noise_level", "living_conditions", "safety", "basic_needs",
          "academic_performance", "study_load", "teacher_student_relationship",
          "future_career_concerns", "social_support", "peer_pressure",
          "extracurricular_activities", "bullying"
        ];

        if (answers.length === 0) {
          setError("No quiz answers found. Please take the quiz first.");
          setLoading(false);
          return;
        }

        if (answers.length !== keys.length) {
          setError(`Expected ${keys.length} answers but got ${answers.length}.`);
          setLoading(false);
          return;
        }

        // Validate and build payload
        const formattedData = {};
        for (let i = 0; i < keys.length; i++) {
          const val = answers[i];
          if (val === undefined || val === null || val === "") {
            setError(`Missing or empty answer for "${keys[i]}".`);
            setLoading(false);
            return;
          }
          const numVal = Number(val);
          if (isNaN(numVal)) {
            setError(`Answer for "${keys[i]}" is not a valid number.`);
            setLoading(false);
            return;
          }
          formattedData[keys[i]] = numVal;
        }

        // Submit answers
        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/stuquizsubmit`,
          formattedData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Fetch result
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/sturesult`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setResult({
          stress_level: res.data.result.stress_level,
          stress_score: res.data.result.stress_score,
          recommendation: res.data.result.recommendation,
        });
      } catch (err) {
        console.error("Error submitting or fetching student result:", err);
        setError("Failed to submit quiz or fetch results. Please try again.");
        setResult(null);
      } finally {
        setLoading(false);
      }
    };

    const fetchResult = async () => {
      try {
        if (profession === "student") {
          await submitStudentQuizAndFetchResult();
        } else {
          const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/result`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setResult(res.data.result);
          setError(null);
        }
      } catch (err) {
        console.error("Error fetching result:", err);
        setError("Failed to fetch result. Please try again.");
        setResult(null);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [profession]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-backg">
        <p className="text-lg text-darkblue">Loading Result...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-backg px-4 text-center max-w-lg mx-auto">
        <p className="text-red-600 text-lg mb-4">{error}</p>
        <button
          onClick={() => navigate(profession === "student" ? "/miniquiz" : "/dashboard")}
          className="px-6 py-2 bg-lightgreen text-white rounded-lg hover:bg-aquaGlow transition"
        >
          {profession === "student" ? "Take Quiz" : "Go to Dashboard"}
        </button>
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
        <h2 className="text-2xl font-bold mb-2 text-darkblue">Your Mental Wellness Result</h2>
        <div className="w-20 h-1 bg-lightgreen mx-auto rounded-full mb-6" />
        {profession === "student" ? (
          <>
            <p className="text-lg font-semibold text-darkblue mb-3">{result.stress_level}</p>
            <div className="bg-lightgrey py-3 rounded-xl text-darkblue font-semibold text-lg mb-6">
              Score: {result.stress_score}
            </div>
            <p className="text-md text-gray-700 mb-4">{result.recommendation}</p>
          </>
        ) : (
          <>
            <p className="text-lg font-semibold text-darkblue mb-3">{result.score_text}</p>
            <p className="text-md text-gray-700 mb-4">{result.prediction}</p>
            <div className="bg-lightgrey py-3 rounded-xl text-darkblue font-semibold text-lg mb-6">
              Score: {result.score}
            </div>
          </>
        )}
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
