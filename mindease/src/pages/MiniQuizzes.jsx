import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MiniQuizzes = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/quiz`)
;
        setQuestions(res.data.questions.questions);
      } catch (error) {
        console.error("Failed to load questions:", error);
      }
    };
    fetchQuestions();
  }, []);

  const currentQuestion = questions[currentIndex];

  const handleAnswerChange = (value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[currentIndex] = value;
    setAnswers(updatedAnswers);
  };

  const handleNext = () => {
    if (!answers[currentIndex]) {
      alert("Please answer before continuing.");
      return;
    }
    setCurrentIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (
      answers.length !== questions.length ||
      answers.includes(undefined) ||
      answers.includes("")
    ) {
      alert("Please answer all questions before submitting.");
      return;
    }

    
    const fixedAnswers = [...answers];
    fixedAnswers[0] = Number(fixedAnswers[0]);

    
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to submit.");
      return;
    }

    try {
      console.log("Sending to backend:", fixedAnswers);

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/submit`,
        { answers: fixedAnswers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Submit Success:", response.data);
      navigate("/result", { state: response.data.result });

    } catch (err) {
      console.log("Submit Error:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Submission failed. Try again.");
    }
  };

  if (questions.length === 0)
    return <p className="text-center mt-10 text-lg text-darkblue">Loading...</p>;

  const progressPercent = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-backg flex flex-col items-center pt-50 px-4">

      <div className="w-full max-w-3xl flex justify-between items-center mb-2 px-2">
        <p className="text-lg font-semibold text-darkblue">
          Question {currentIndex + 1} of {questions.length}
        </p>
        <p className="text-md font-semibold text-lightgreen">
          {Math.round(progressPercent)}% Complete
        </p>
      </div>

      <div className="w-full max-w-3xl h-3 bg-lightgrey rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-lightgreen transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-xl p-8 border border-lightgrey">
        <p className="text-xl font-medium text-darkblue mb-6">
          {currentQuestion.questiontext}
        </p>

        {currentQuestion.options ? (
          <div className="space-y-4">
            {currentQuestion.options.map((opt, idx) => (
              <label
                key={idx}
                className={`block border rounded-lg px-4 py-3 cursor-pointer transition
                ${
                  answers[currentIndex] === opt
                    ? "border-lightgreen bg-lightgrey"
                    : "border-lightgrey"
                }`}
              >
                <input
                  type="radio"
                  name="option"
                  value={opt}
                  checked={answers[currentIndex] === opt}
                  onChange={(e) => handleAnswerChange(e.target.value)}
                  className="mr-3 accent-lightgreen"
                />
                {opt}
              </label>
            ))}
          </div>
        ) : (
          <input
            type="text"
            placeholder="Type your answer..."
            value={answers[currentIndex] || ""}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="w-full border border-lightgrey rounded-lg p-3 text-darkblue focus:outline-none focus:ring-2 focus:ring-lightgreen bg-lightgrey"
          />
        )}
      </div>

      <div className="w-full max-w-3xl flex justify-between items-center mt-6">
        {currentIndex > 0 ? (
          <button
            onClick={handleBack}
            className="px-6 py-2 border border-lightgreen text-lightgreen rounded-lg hover:bg-lightgrey transition"
          >
            Previous
          </button>
        ) : (
          <div></div>
        )}

        {currentIndex === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            className="px-6 py-2 bg-lightgreen text-white rounded-lg hover:bg-pinkGlow transition"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="px-6 py-2 bg-lightgreen text-white rounded-lg hover:bg-pinkGlow transition"
          >
            Next
          </button>
        )}
      </div>

      <p className="text-center text-sm text-darkblue mt-8">
        Your responses are confidential and help us provide personalized support.
      </p>
    </div>
  );
};

export default MiniQuizzes;
