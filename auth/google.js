const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
require('dotenv').config();
const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL'
];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});
// const User = require("../models/User"); // Adjust the path as necessary
// Add this before passport.use() to debug
// console.log('Environment variables:', {
//   clientID: process.env.GOOGLE_CLIENT_ID?.substring(0, 5) + '...',
//   callbackURL: process.env.GOOGLE_CALLBACK_URL,
//   secretExists: !!process.env.GOOGLE_CLIENT_SECRET
// });
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("Google profile:", profile);
        // TODO: find or create user in MongoDB
        const user = await User.findOrCreate({ googleId: profile.id });
        return done(null, profile);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

module.exports = passport;
