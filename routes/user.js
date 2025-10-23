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
router.get('/auth/google', 
     (req, res, next) => {
        console.log('Starting Google auth...');
        next();
    },
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/auth/google/callback',
    (req, res, next) => {
        console.log('Google callback received');
        next();
    },
    passport.authenticate('google', {
        successRedirect: 'http://localhost:3000/signup',
        failureRedirect: 'http://localhost:3000/login'
    })
);
router.get('/auth/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

module.exports = router;