const express = require('express');
const router = express.Router();
const { createUser, login, verifyToken } = require('../controllers/user');
const { getGoogleAuthURL, handleGoogleCallback } = require('../auth/google');

router.post('/signup', createUser);
router.post('/login', login);


router.get('/auth/google', getGoogleAuthURL);
router.get('/auth/google/callback', handleGoogleCallback);


router.get('/auth/google/error', (req, res) => {
  res.status(400).json({ error: 'Google auth failed' });
});

module.exports = router;