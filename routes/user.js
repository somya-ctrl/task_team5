const express = require('express');
const router = express.Router();
const { createUser, login, verifyToken, submitquiz, getQuizResult,createquiz,createstudentquiz,createJournal,getUserJournals, editUser,refreshaccesstoken,logout,submitStudentQuiz,getStuResult,saveProfession} = require('../controllers/user');
const { getGoogleAuthURL, handleGoogleCallback } = require('../auth/google');

router.post('/signup', createUser);
router.post('/login', login);
router.post('/saveProfession', verifyToken, saveProfession);
router.get('/auth/google', getGoogleAuthURL);
router.get('/auth/google/callback', handleGoogleCallback);


router.get('/auth/google/error', (req, res) => {
  res.status(400).json({ error: 'Google auth failed' });
});
router.get("/quiz",createquiz);
router.post("/submit",verifyToken, submitquiz);
router.get("/result",verifyToken, getQuizResult);
router.get("/studentquiz", createstudentquiz);
router.post("/stuquizsubmit", verifyToken, submitStudentQuiz);
router.get("/sturesult", verifyToken, getStuResult);
router.post('/journal', verifyToken, createJournal);
router.get('/getjournal', verifyToken, getUserJournals);
router.put('/edit', verifyToken, editUser);
router.post("/refresh-token", refreshaccesstoken);
router.post("/logout", logout);


module.exports = router;