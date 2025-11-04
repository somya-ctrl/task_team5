require('dotenv').config();
const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);


const getGoogleAuthURL = (req, res) => {
  console.log("OAuth Redirect URI used:", process.env.GOOGLE_REDIRECT_URI);

  try {
    const url = client.generateAuthUrl({
      access_type: 'offline',
      prompt: 'consent',
      scope: [ 'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    });
    console.log('Redirecting to Google auth URL');
    return res.redirect(url);
  } catch (err) {
    console.error('getGoogleAuthURL error:', err);
    return res.status(500).send('Failed to start Google auth');
  }
};


const handleGoogleCallback = async (req, res) => {
  const code = req.query.code;
  console.log('handleGoogleCallback query:', req.query);

  if (!code) {
    return res.status(400).send('Missing code');
  }

  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: client, version: 'v2' });
    const { data } = await oauth2.userinfo.get();
      if (!data || !data.email) {
      console.error('No email in Google profile', data);
      return res.status(400).send('Google profile incomplete');
    }
   

  
    let user = await User.findOne({ googleId: data.id }) || await User.findOne({ email: data.email });
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-12);
      const hashed = await bcrypt.hash(randomPassword, 10);
      user = new User({
        name: data.name || data.email,
        email: data.email,
        password: hashed,
        googleId: data.id
      });
      await user.save();
      console.log('Created user for google account:', user.email);
    } else if (!user.googleId) {
      user.googleId = data.id;
      await user.save();
      console.log('Linked googleId to existing user:', user.email);
    }
    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // const frontendRedirect = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/success?token=${token}`;
    const photo = data.picture || '';


  const frontendRedirect = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/auth/google/callback?`+`token=${token}&name=${encodeURIComponent(user.name)}&email=${encodeURIComponent(user.email)}&photo=${encodeURIComponent(photo)}`;

    return res.redirect(frontendRedirect);
  } catch (error) {
    console.error('handleGoogleCallback error:', error);
    return res.status(500).send('Google callback processing failed');
  }
};

module.exports = { getGoogleAuthURL, handleGoogleCallback };
