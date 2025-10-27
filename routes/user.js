// const express = require('express');
// const router = express.Router();
// const { createUser, login, verifyToken } = require('../controllers/user');

// // User signup
// router.post('/signup', createUser);

// // User login
// router.post('/login', login);



// module.exports = router;
const express = require('express');
const router = express.Router();
const passport = require('passport');
const { createUser, login, verifyToken } = require('../controllers/user');

// Debug middleware to log auth requests
const debugAuth = (req, res, next) => {
    console.log('Auth route hit:', req.method, req.path);
    console.log('Headers:', req.headers);
    next();
};

// Local authentication routes
router.post('/signup', createUser);
router.post('/login', login);

// Google OAuth routes
router.get('/auth/google', debugAuth,
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        prompt: 'select_account'
    })
);

router.get('/auth/google/callback', debugAuth,
    passport.authenticate('google', {
        failureRedirect: '/auth/google/error',
        successRedirect: 'http://localhost:5173/dashboard'
    })
);

// Error handling route
router.get('/auth/google/error', (req, res) => {
    res.status(401).json({
        error: 'Authentication failed',
        message: req.session?.messages
    });
});

// Protected route example
router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Access granted', user: req.user });
});

// Logout route
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.json({ message: 'Logged out successfully' });
    });
});

module.exports = router;
