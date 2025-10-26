const express = require('express');
const router = express.Router();
const { createUser, login, verifyToken } = require('../controllers/user');

// User signup
router.post('/signup', createUser);

// User login
router.post('/login', login);



module.exports = router;
