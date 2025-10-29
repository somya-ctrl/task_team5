const bcrypt = require('bcrypt');
const axios = require("axios");

let lastResult = null; 
const User = require('../models/user');
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
        res.status(200).json({message:'Login successful'});
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
async function submitquiz(req, res) {
   
 try {
    const { answers } = req.body;

    if (!Array.isArray(answers) || answers.length !== 21) {
      return res.status(400).json({ error: "21 answers required." });
    }

    const mlResponse = await axios.post("ml api", { answers });
    const { score } = mlResponse.data;

    let status, suggestion;
    lastResult = { score, status, suggestion };

    res.json({ success: true, message: "Quiz submitted successfully." });
  } catch (error) {
    console.error("Error communicating with ML model:", error.message);
    res.status(500).json({ error: "Server or ML model error" });
  }
};
async function getQuizResult(req, res) {
    try {
    if (!lastResult) {
      return res.status(404).json({ error: "No quiz result found." });
    }

    res.json({
      success: true,
      result: lastResult,
    });
  } catch (error) {
    console.error("Error fetching result:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
module.exports = { createUser, login, verifyToken, submitquiz, getQuizResult };