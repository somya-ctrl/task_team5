const express = require('express');
const router = express.Router();
const passport = require('passport');
const { createUser,login } = require('../controllers/user');
router.post('/signup', createUser);
router.post('/login', login);
// Add debug middleware
const debuglog  = (req, res, next) => {
    console.log('Auth Route Hit:', req.path);
    console.log('Session:', req.session);
    next();
};



module.exports = router;