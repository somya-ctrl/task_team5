import React from 'react'
import axios from "axios";
import { useState } from 'react';


const MiniQuizzes = () => {
  const [answers, setAnswers] = useState({
    age: "",
    gender: "",
    country: "",
    selfEmployed: "",
    familyHistory: "",
    employees: "",
    remoteWork: "",
    techCompany: "",
    mentalHealthBenefits: "",
    healthOptionsAvailable: "",
    wellnessProgram: "",
    encourageHelp: "",
    confidentiality: "",
    negativeConsequences: "",
    physicalHealthImpact: "",
    talkCoworkers: "",
    talkSupervisor: "",
    discussMHInterview: "",
    discussPHInterview: "",
    equality: "",
    unfairTreatment: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  for (const key in answers) {
    if (answers[key] === "") {
      alert(`Please answer all questions before submitting.`);
      return;
    }
  }

  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to submit the quiz.");
    return;
  }

  setLoading(true);

  const orderedAnswers = [
    Number(answers.age), 
    answers.gender,
    answers.country,
    answers.selfEmployed,
    answers.familyHistory,
    answers.employees,
    answers.remoteWork,
    answers.techCompany,
    answers.mentalHealthBenefits,
    answers.healthOptionsAvailable,
    answers.wellnessProgram,
    answers.encourageHelp,
    answers.confidentiality,
    answers.negativeConsequences,
    answers.physicalHealthImpact,
    answers.talkCoworkers,
    answers.talkSupervisor,
    answers.discussMHInterview,
    answers.discussPHInterview,
    answers.equality,
    answers.unfairTreatment
  ];

  try {
    
    await axios.post(
      "https://mindease-backend-cyvy.onrender.com/submit",
      { answers: orderedAnswers },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        }
      }
    );

    
    const resultResponse = await axios.get(
      "https://mindease-backend-cyvy.onrender.com/result",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setResult(resultResponse.data);
  } catch (error) {
    console.error("Submit/Result Error:", error.response?.data || error);
    alert("Error submitting or fetching result.");
  }

  setLoading(false);
};


  return (
    <>
    <div className="min-h-screen bg-backg flex flex-col items-center py-30">
      
      <h1 className="text-3xl md:text-4xl font-bold text-darkblue mb-2 leading-relaxed">
        Mental Wellness Assessment
      </h1>
      <p className="text-darkblue mb-10 text-center font-bold  text-xl px-4">
        Take your time and answer honestly. There are no right or wrong answers.
      </p>


      
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-10 w-full max-w-xl px-6"
      >

      {/* Questions Section */}
      <div className="flex flex-col gap-10 w-full max-w-xl px-6">
        {/* Question 1 */}
        <div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
          <h2 className="text-darkblue font-semibold mb-3">Question 1 of 21</h2>
          <p className="text-darkblue mb-6">What is your age?</p>
         <input
            type="number"
            name="age"
            value={answers.age}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-20 py-2 focus:outline-none"
          />
        </div>

        {/* Question 2 */}
        <div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
          <h2 className="text-darkblue font-semibold mb-3">Question 2 of 21</h2>
          <p className="text-darkblue mb-6">What is your Gender?</p>
         <select
            name="gender"
            value={answers.gender}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
            <option value="" disabled >--Select--</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Question 3 */}
        <div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
          <h2 className="text-darkblue font-semibold mb-3">Question 3 of 21</h2>
          <p className="text-darkblue mb-6">What is your Country?</p>
           <input
            type="text"
            name="country"
            value={answers.country}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          />
        </div>

{/* Question 4 */}
<div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
  <h2 className="text-darkblue font-semibold mb-3">Question 4 of 21</h2>
  <p className="text-darkblue mb-6">Are you Self employed?</p>
  <select
            name="selfEmployed"
            value={answers.selfEmployed}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
            <option value="" disabled>--Select--</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
</div>


<div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
  <h2 className="text-darkblue font-semibold mb-3">Question 5 of 21</h2>
  <p className="text-darkblue mb-6">Does anyone in your family have a history of mental illness?</p>
 <select
            name="familyHistory"
            value={answers.familyHistory}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
    <option value="" disabled >--Select--</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
  
  </select>
</div>


<div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
  <h2 className="text-darkblue font-semibold mb-3">Question 6 of 21</h2>
  <p className="text-darkblue mb-6">How many employees work in your company?</p>
 <select
            name="employees"
            value={answers.employees}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
    <option value="" disabled>--Select--</option>
    <option value="1-5">1-5</option>
    <option value="6-25">6-25</option>
    <option value="26-100">26-100</option>

     <option value="100-500">100-500</option>

      <option value="500-1000">500-1000</option>

      <option value="More than 1000">More than 1000</option>
  </select>
</div>


<div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
  <h2 className="text-darkblue font-semibold mb-3">Question 7 of 21</h2>
  <p className="text-darkblue mb-6">Do you work remotely (from home)?</p>
  <select
            name="remoteWork"
            value={answers.remoteWork}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
    <option value="" disabled >--Select--</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
    
  </select>
</div>


<div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
  <h2 className="text-darkblue font-semibold mb-3">Question 8 of 21</h2>
  <p className="text-darkblue mb-6">Is your company a tech company?</p>
 <select
            name="techCompany"
            value={answers.techCompany}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
    <option value="" disabled >--Select--</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
    
  </select>
</div>


<div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
  <h2 className="text-darkblue font-semibold mb-3">Question 9 of 21</h2>
  <p className="text-darkblue mb-6">Does your employer provide mental health benefits?</p>
  <select
            name="mentalHealthBenefits"
            value={answers.mentalHealthBenefits}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
    <option value="" disabled>--Select--</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
    <option value="Don't Know">Don't Know</option>

  </select>
</div>


<div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
  <h2 className="text-darkblue font-semibold mb-3">Question 10 of 21</h2>
  <p className="text-darkblue mb-6">Are mental health care options easily available at work?</p>
  <select
            name="healthOptionsAvailable"
            value={answers.healthOptionsAvailable}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
    <option value="" disabled>--Select--</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>

     <option value="Not Sure">Not Sure</option>
   
   
  </select>
</div>



<div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
  <h2 className="text-darkblue font-semibold mb-3">Question 11 of 21</h2>
  <p className="text-darkblue mb-6">Is there a wellness program at your workplace?</p>
  <select
            name="wellnessProgram"
            value={answers.wellnessProgram}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
    <option value="" disabled >--Select--</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
     <option value="Don't Know">Don't Know</option>
  </select>
</div>



<div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
  <h2 className="text-darkblue font-semibold mb-3">Question 12 of 21</h2>
  <p className="text-darkblue mb-6">Does your employer encourage seeking help?</p>
  <select
            name="encourageHelp"
            value={answers.encourageHelp}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
    <option value="" disabled >--Select--</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
    <option value="Don't Know">Don't Know</option>
  </select>
</div>




<div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
  <h2 className="text-darkblue font-semibold mb-3">Question 13 of 21</h2>
  <p className="text-darkblue mb-6">Is mental health treatment kept confidential at your job?</p>
<select
            name="confidentiality"
            value={answers.confidentiality}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
    <option value="" disabled>--Select--</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
    <option value="Don't KNow">Don't Know</option>
  </select>
</div>




<div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
  <h2 className="text-darkblue font-semibold mb-3">Question 14 of 21</h2>
  <p className="text-darkblue mb-6">Would you face negative consequences if you discussed mental health at work?</p>
<select
            name="negativeConsequences"
            value={answers.negativeConsequences}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
    <option value="" disabled >--Select--</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
    <option value="maybe">Maybe</option>
  </select>
</div>

<div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
  <h2 className="text-darkblue font-semibold mb-3">Question 15 of 21</h2>
  <p className="text-darkblue mb-6">Would physical health issues affect your job opportunities?</p>
  <select
            name="physicalHealthImpact"
            value={answers.physicalHealthImpact}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
    <option value="" disabled>--Select--</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
    <option value="maybe">Maybe</option>
  </select>
</div>

<div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
  <h2 className="text-darkblue font-semibold mb-3">Question 16 of 21</h2>
  <p className="text-darkblue mb-6">Can you talk to your coworkers about mental health?</p>
 <select
            name="talkCoworkers"
            value={answers.talkCoworkers}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
    <option value="" disabled >--Select--</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
    <option value="Some of them">Some of them</option>
  </select>
</div>

<div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
  <h2 className="text-darkblue font-semibold mb-3">Question 17 of 21</h2>
  <p className="text-darkblue mb-6">Can you talk to your supervisor about mental health?</p>
 <select
            name="talkSupervisor"
            value={answers.talkSupervisor}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
    <option value="" disabled>--Select--</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
    <option value="Some of them">Some of them</option>
  </select>
</div>

<div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
  <h2 className="text-darkblue font-semibold mb-3">Question 18 of 21</h2>
  <p className="text-darkblue mb-6">Would you discuss mental health in a job interview??</p>
  <select
            name="discussMHInterview"
            value={answers.discussMHInterview}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
    <option value="" disabled >--Select--</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
    <option value="maybe">Maybe</option>
  </select>
</div>

<div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
  <h2 className="text-darkblue font-semibold mb-3">Question 19 of 21</h2>
  <p className="text-darkblue mb-6">Would you discuss physical health in a job interview?</p>
  <select
            name="discussPHInterview"
            value={answers.discussPHInterview}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
    <option value="" disabled >--Select--</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
    <option value="maybe">Maybe</option>
  </select>
</div>

<div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
  <h2 className="text-darkblue font-semibold mb-3">Question 20 of 21</h2>
  <p className="text-darkblue mb-6">Is mental health treated equally to physical health at your workplace?</p>
  <select
            name="equality"
            value={answers.equality}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
    <option value="" disabled >--Select--</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
    <option value="Don't Knnow">Don't Know</option>
  </select>
</div>

<div className="bg-lightgrey rounded-lg shadow-md p-8 text-center border border-lightgreen">
  <h2 className="text-darkblue font-semibold mb-3">Question 21 of 21</h2>
  <p className="text-darkblue mb-6">Have you observed anyone being treated unfairly for mental health issues?</p>
 <select
            name="unfairTreatment"
            value={answers.unfairTreatment}
            onChange={handleChange}
            className="bg-aquaGlow text-darkblue font-medium text-center rounded-md w-40 py-2 focus:outline-none"
          >
    <option value="" disabled >--Select--</option>
    <option value="yes">Yes</option>
    <option value="no">No</option>
  </select>
</div>


 <button
          type="submit"
          className="bg-lightgreen text-white font-bold py-3 px-6 rounded-md hover:bg-aquaGlow transition duration-300"
        >
          {loading ? "Submitting..." : "Submit Answers"}
        </button>

      </div>
      
      </form>

{result && (
  <div className="mt-6 p-4 bg-white border rounded-lg shadow-md text-center">
    <h2 className="text-2xl font-semibold text-blue-700">🧠 Your Mental Wellness Result</h2>

    <p className="text-lg mt-3 font-medium">
      <strong>Prediction:</strong> {result.prediction}
    </p>

    <p className="text-lg mt-2">
      <strong>Score:</strong> {result.score} ({result.score_text})
    </p>

    <p className="text-sm text-gray-600 mt-3">
      Probability: {(result.probability * 100).toFixed(1)}%
    </p>
  </div>
)}


    </div>
    
    </>
  )
}

export default MiniQuizzes;