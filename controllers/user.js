const bcrypt = require('bcrypt');
const RefreshToken = require('../models/refreshToken');
const crypto = require('crypto');
const axios = require("axios");
let lastResult = null;

const User = require('../models/user');
const Quiz = require('../models/quiz');
const Journal = require('../models/journal');
const studentquiz = require('../models/studentquiz');
const questions = require('../questions/ques');

const jwt = require('jsonwebtoken');
const admin = require("firebase-admin");
const { questionnew } = require('../questions/studentques');
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

        const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" } 
    );

    
    const refreshToken = crypto.randomBytes(64).toString("hex");

  
    await RefreshToken.create({
      user: user._id,
      token: refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    });

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
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

    const latestQuiz = await Quiz.findOne({ user: userId })
      .sort({ createdAt: -1 })
      .select("prediction probability score_text score");

    if (!latestQuiz) {
      return res.status(404).json({ success: false, message: "No quiz found" });
    }

    res.json({
      success: true,
      result: {
        prediction: latestQuiz.prediction,
        probability: latestQuiz.probability,
        score_text: latestQuiz.score_text,
        score: latestQuiz.score,
      },
    });
  } catch (error) {
    console.error("Error fetching result:", error.message);
    res.status(500).json({ error: "Server error" });
  }
}
const createstudentquiz = async (req, res) => {
  try {
    res.json({
      success: true,
      count: questionnew.length,
      questions: questionnew
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load questions" });
  }
};


const submitStudentQuiz = async (req, res) => {
  try {
    const answers = req.body;
    if (!answers || Object.keys(answers).length === 0) {
      return res.status(400).json({
        success: false,
        error: "Please provide all quiz answers in JSON format",
      });
    }
    const mlResponse = await axios.post(
      "https://student-stress-api-dvo8.onrender.com/predict", 
      answers,
      { headers: { "Content-Type": "application/json" } }
    );
    res.json(mlResponse.data);

  } catch (error) {
    console.error("Error in submitStudentQuiz:", error.message);
    res.status(500).json({
      success: false,
      error: "Failed to get prediction from ML API",
      details: error.message,
    });
  }
};


async function createJournal(req, res) {
  try {
    const { content,date } = req.body;

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    let parsedDate = new Date(date);
    if (!date || isNaN(parsedDate)) {
      parsedDate = new Date();
    }

    const journal = new Journal({
      user: req.user.id,  
      content,
      date: parsedDate,
    });

    await journal.save();
    res.status(201).json({ success: true, journal });
  } catch (error) {
    console.error('Error creating journal:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};
async function getUserJournals(req, res) {
  try {
    const { date } = req.query; 
    const userId = req.user.id;

    let query = { user: userId };

    
    if (date) {
      
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query.date = { $gte: startOfDay, $lte: endOfDay };
    }

    
    const journals = await Journal.find(query).sort({ date: -1 });

    res.json({
      success: true,
      count: journals.length,
      journals,
      filteredByDate: !!date, 
    });
  } catch (error) {
    console.error('Error fetching journals:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
}

const editUser = async (req, res) => {
  try {
    const { gender, age, phone } = req.body;
    const userId = req.user.id; 

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { gender, age, phone },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Edit user error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
async function refreshaccesstoken(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken)
      return res.status(400).json({ error: "Refresh token is required" });

    const tokenDoc = await RefreshToken.findOne({ token: refreshToken });
    if (!tokenDoc)
      return res.status(403).json({ error: "Invalid refresh token" });

    if (tokenDoc.expiresAt < new Date()) {
      await tokenDoc.deleteOne();
      return res.status(403).json({ error: "Refresh token expired" });
    }

    
    const newAccessToken = jwt.sign(
      { id: tokenDoc.user },
      process.env.JWT_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m" }
    );

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function logout(req, res) {
  try {
    const { refreshToken } = req.body;
    await RefreshToken.deleteOne({ token: refreshToken });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { createUser, login, verifyToken, submitquiz, getQuizResult,createquiz ,createJournal,getUserJournals, editUser, refreshaccesstoken, logout , createstudentquiz,submitStudentQuiz };
