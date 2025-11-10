import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Landing from "./pages/Landing";
import Journal from "./pages/Journal";
import Meditations from "./pages/Meditations";
import MoodDetection from "./pages/MoodDetection";
import Profile from "./pages/Profile";
import MiniQuizzes from "./pages/MiniQuizzes";
import Aboutus from "./pages/About";
import Result from "./pages/Result";
import GoogleCallback from "./pages/GoogleCallback";
import Profession from "./pages/Profession";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";

const PrivateRoute = ({ children }) => {
  const accessToken = localStorage.getItem("accessToken");
  return accessToken ? children : <Navigate to="/login" replace />;
};

const AppWrapper = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBackButton = () => {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        window.history.pushState(null, "", window.location.href);
        navigate("/login", { replace: true });
      }
    };

    window.addEventListener("popstate", handleBackButton);
    return () => window.removeEventListener("popstate", handleBackButton);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/landing" />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/google/callback" element={<GoogleCallback />} />

      <Route
        path="/landing"
        element={
          <>
            <Landing />
            <Footer />
          </>
        }
      />

      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <>
              <Navbar />
              <Dashboard />
              <Footer />
            </>
          </PrivateRoute>
        }
      />

      <Route
        path="/profession"
        element={
          <PrivateRoute>
            <>
              <Profession />
            </>
          </PrivateRoute>
        }
      />

      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <>
              <Chat />
            </>
          </PrivateRoute>
        }
      />

      <Route
        path="/journal"
        element={
          <PrivateRoute>
            <>
              <Navbar />
              <Journal />
              <Footer />
            </>
          </PrivateRoute>
        }
      />

      <Route
        path="/meditations"
        element={
          <PrivateRoute>
            <>
              <Navbar />
              <Meditations />
              <Footer />
            </>
          </PrivateRoute>
        }
      />

      <Route
        path="/mooddetection"
        element={
          <PrivateRoute>
            <>
              <Navbar />
              <MoodDetection />
              <Footer />
            </>
          </PrivateRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <>
              <Profile />
            </>
          </PrivateRoute>
        }
      />

      <Route
        path="/about"
        element={
          <>
            <Navbar />
            <Aboutus />
          </>
        }
      />

      <Route
        path="/miniques"
        element={
          <PrivateRoute>
            <>
              <Navbar />
              <MiniQuizzes />
            </>
          </PrivateRoute>
        }
      />

      <Route
        path="/result"
        element={
          <PrivateRoute>
            <>
              <Navbar />
              <Result />
              <Footer />
            </>
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

const App = () => (
  <Router>
    <AppWrapper />
  </Router>
);

export default App;
