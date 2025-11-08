const express = require('express');
const router = express.Router();
const { createUser, login, verifyToken, submitquiz, getQuizResult,createquiz,createJournal,getUserJournals, editUser,refreshaccesstoken,logout} = require('../controllers/user');
const { getGoogleAuthURL, handleGoogleCallback } = require('../auth/google');

router.post('/signup', createUser);
router.post('/login', login);

router.get('/auth/google', getGoogleAuthURL);
router.get('/auth/google/callback', handleGoogleCallback);


router.get('/auth/google/error', (req, res) => {
  res.status(400).json({ error: 'Google auth failed' });
});
router.get("/quiz",createquiz);
router.post("/submit",verifyToken, submitquiz);
router.get("/result",verifyToken, getQuizResult);
router.post('/journal', verifyToken, createJournal);
router.get('/getjournal', verifyToken, getUserJournals);
router.put('/edit', verifyToken, editUser);
router.post("/refresh-token", refreshaccesstoken);
router.post("/logout", logout);


module.exports = router;