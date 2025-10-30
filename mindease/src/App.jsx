import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


import Register from "./pages/Register";
import Login from "./pages/Login";


import Dashboard from "./pages/Dashboard";
import Journal from "./pages/Journal";
import Meditations from "./pages/Meditations";
import MoodDetection from "./pages/MoodDetection";
import Profile from './pages/Profile'
import MiniQuizzes from "./pages/MiniQuizzes";
import Aboutus from "../src/pages/About"

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Main app routes with Navbar + Footer */}
        <Route
          path="/dashboard"
          element={
            <>
              <Navbar />
              <Dashboard />
              <Footer />
            </>
          }
        />
        <Route
          path="/journal"
          element={
            <>
              <Navbar />
              <Journal />
              <Footer />
            </>
          }
        />
        <Route
          path="/meditations"
          element={
            <>
              <Navbar />
              <Meditations />
              <Footer />
            </>
          }
        />
        <Route
          path="/mooddetection"
          element={
            <>
              <Navbar />
              <MoodDetection />
              <Footer />
            </>
          }
        />

  <Route
          path="/profile"
          element={
            <>
              
              <Profile/>
              
            </>
          }
        />


  <Route
          path="/about"
          element={
            <>
              <Navbar />
              <Aboutus/>
              <Footer />
            </>
          }
        />
        <Route
          path="/miniques"
          element={
            <>
              <Navbar/>
              <MiniQuizzes />
              <Footer />
            </>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

