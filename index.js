const express= require('express');
const cors = require("cors");
const session = require("express-session");
const passport = require("./auth/google");
require('dotenv').config();
const mongoose = require('mongoose');
const {connectmongoDB} = require('./connect');
const userRoutes = require('./routes/user');
const app = express();
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials:true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
}));


app.use(passport.initialize());
app.use(passport.session());
app.use('/', userRoutes);
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "http://localhost:5173/dashboard", // frontend after success
    failureRedirect: "http://localhost:5173/login",     // frontend after fail
  })
);

// Optional: logout
app.get("/auth/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});


const PORT = process.env.PORT;



connectmongoDB(process.env.MONGO_URI);

app.get('/', (req, res) => {
    res.send('Hello, guys!');
});
app.listen(PORT ,()=>{
    console.log(`Server is running on port ${PORT}`);
});