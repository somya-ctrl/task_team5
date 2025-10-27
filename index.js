require("dotenv").config();
console.log("startup env -> GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID ? "[set]" : "[missing]");
console.log("startup env -> GOOGLE_REDIRECT_URI:", process.env.GOOGLE_REDIRECT_URI);

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { connectmongoDB } = require("./connect");
const userRoutes = require("./routes/user");
const { getGoogleAuthURL, handleGoogleCallback } = require("./auth/google");

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://team5-backend.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello, guys!");
});

app.use("/", userRoutes);

// Google OAuth endpoints
app.get("/auth/google", getGoogleAuthURL);
app.get("/auth/google/callback", handleGoogleCallback);

// Optional: token verification route
app.get("/auth/verify", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true, decoded });
  } catch {
    res.status(401).json({ valid: false });
  }
});

const PORT = process.env.PORT || 3000;
connectmongoDB(process.env.MONGO_URI);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
