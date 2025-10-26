require("dotenv").config();
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Step 1: Redirect user to Google login
const getGoogleAuthURL = (req, res) => {
  const redirectURI = client.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: ["profile", "email"],
  });
  res.redirect(redirectURI);
};

// Step 2: Handle Google callback
const handleGoogleCallback = async (req, res) => {
  const code = req.query.code;

  try {
    const { tokens } = await client.getToken(code);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name } = payload;

    // find or create user
    let user = await User.findOne({ googleId }) || await User.findOne({ email });
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-12);
      const hashed = await bcrypt.hash(randomPassword, 10);
      user = await User.create({ name, email, password: hashed, googleId });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }

    // create JWT for your app
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // redirect to frontend with token (or send JSON)
    const frontendURL = process.env.NODE_ENV === "production"
      ? "https://mindease-frontend.vercel.app"
      : "http://localhost:5173";

    res.redirect(`${frontendURL}/dashboard?token=${token}`);
  } catch (error) {
    console.error("Google auth error:", error);
    res.redirect("/auth/google/error");
  }
};

module.exports = { getGoogleAuthURL, handleGoogleCallback };
