const bcrypt = require('bcrypt');
const axios = require("axios");

let lastResult = null; 
const User = require('../models/user');
const Quiz = require('../models/quiz');
const questions = require('../questions/ques');
const jwt = require('jsonwebtoken');
async function createUser(req, res) {
   
    try {
        const user = new User(req.body);
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}
async function login (req,res){
    try{
        const{email,password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            return res.status(404).json({error:'User not found'});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({error:'Invalid credentials'});
        }
         const token = jwt.sign(
          { id: user._id, email: user.email },
           process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );
        res.status(200).json({message:'Login successful', token,
        user: { id: user._id, name: user.name, email: user.email }});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
const createquiz = async (req, res) => {
  try {
    res.json({
      success: true,
      count: questions.length,
      questions: questions
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load questions" });
  }
};

const submitquiz = async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Answers array is required" });
    }
    const inputData = {
      Age: answers[0],
      Gender: answers[1],
      Country: answers[2],
      self_employed: answers[3],
      family_history: answers[4],
      no_employees: answers[5],
      remote_work: answers[6],
      tech_company: answers[7],
      benefits: answers[8],
      care_options: answers[9],
      wellness_program: answers[10],
      seek_help: answers[11],
      anonymity: answers[12],
      mental_health_consequence: answers[13],
      phys_health_consequence: answers[14],
      coworkers: answers[15],
      supervisor: answers[16],
      mental_health_interview: answers[17],
      phys_health_interview: answers[18],
      mental_vs_physical: answers[19],
      obs_consequence: answers[20],
    };

    
    const mlResponse = await axios.post("https://mental-health-treatment-api.onrender.com/predict", inputData);

    const { prediction, probability, score_text } = mlResponse.data;

    
    if (prediction === undefined || probability === undefined) {
      return res.status(500).json({ error: "Invalid response from ML API" });
    }

    
    const score = Math.round(probability * 100); // convert 0.812 → 81
    const userId = req.user.id;
    const quizzes = new Quiz({
      user: userId,
      answers,
      prediction,
      probability,
      score_text,
      score,
    });
    await quizzes.save();

    
    
    global.lastResult = { prediction, probability, score_text, score };

    res.json({
      success: true,
      message: "Quiz submitted successfully",
      result: {
        prediction,
        probability,
        score_text,
        score,

      },
    });
  } catch (error) {
    console.error("Error in submitQuiz:", error.message);
    res.status(500).json({ error: "Server or ML model error" });
  }
};

async function getQuizResult(req, res) {
  try {
    const userId = req.user.id;

    
    const quizzes = await Quiz.find({ user: userId })
      .sort({ createdAt: -1 })
      .select("answers prediction probability score_text score createdAt");

  
    const formatted = quizzes.map((quiz) => {
      const a = quiz.answers; // array
      return {
        _id: quiz._id,
        createdAt: quiz.createdAt,
        prediction: quiz.prediction,
        probability: quiz.probability,
        score_text: quiz.score_text,
        score: quiz.score,
        inputData: {
          Age: a[0],
          Gender: a[1],
          Country: a[2],
          self_employed: a[3],
          family_history: a[4],
          no_employees: a[5],
          remote_work: a[6],
          tech_company: a[7],
          benefits: a[8],
          care_options: a[9],
          wellness_program: a[10],
          seek_help: a[11],
          anonymity: a[12],
          mental_health_consequence: a[13],
          phys_health_consequence: a[14],
          coworkers: a[15],
          supervisor: a[16],
          mental_health_interview: a[17],
          phys_health_interview: a[18],
          mental_vs_physical: a[19],
          obs_consequence: a[20],
        },
      };
    });

    res.json({ success: true, quizzes: formatted });
  } catch (error) {
    console.error("Error fetching result:", error.message);
    res.status(500).json({ error: "Server error" });
  }
}


module.exports = { createUser, login, verifyToken, submitquiz, getQuizResult,createquiz }; 