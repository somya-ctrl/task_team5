import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { auth, provider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  
const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;


  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");

  // Email must start with a letter + valid format
  const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(formData.email)) {
    setError("Please enter a valid email that starts with a letter.");
    return;
  }

  // Password must have at least one special character
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharRegex.test(formData.password)) {
    setError("Password must contain at least one special character.");
    return;
  }

  // Minimum password length
  if (formData.password.length < 6) {
    setError("Password must be at least 6 characters long.");
    return;
  }

  setLoading(true);

  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/login`,
      formData
    );

    const { user, token } = res.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    navigate("/dashboard");
  } catch (err) {
    setError("Invalid email or password");
  } finally {
    setLoading(false);
  }
};


  
  const handleGoogleLogin = async () => {
    setError("");
    try {
      const result = await signInWithPopup(auth, provider);
      const userData = {
        name: result.user.displayName,
        email: result.user.email,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/dashboard");
    } catch (error) {
      setError("Google Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-backg relative overflow-hidden">
      
      <div className="absolute w-96 h-96 bg-pinkGlow rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-aquaGlow rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      
      <div className="z-10 bg-backg border border-darkblue text-darkblue p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-darkblue">Mind</span>
          <span className="text-lightgreen">Ease</span>
        </h1>
        <p className="mb-6 text-darkblue">Welcome back to your safe place.</p>

        <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
          <div>
            <label className="block text-sm mb-1" htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded bg-blue-200 border border-darkblue text-darkblue placeholder-darkblue focus:outline-none"
              placeholder="you@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 rounded bg-lightgreen border border-darkblue text-darkblue placeholder-darkblue focus:outline-none"
              placeholder="P@ssword"
              required
            />
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-aquaGlow hover:bg-pinkGlow transition-colors text-white py-2 rounded font-semibold"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        
        <div className="flex items-center my-5">
          <div className="flex-grow border-t border-darkblue"></div>
          <span className="mx-3 text-darkblue">OR</span>
          <div className="flex-grow border-t border-darkblue"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          className="w-full border border-darkblue bg-aquaGlow text-white py-2 rounded font-semibold flex items-center justify-center gap-3 hover:bg-pinkGlow  transition"
        >
          <FaGoogle /> Continue with Google
        </button>

        <p className="mt-6 text-center text-darkblue">
          Don't have an account?{" "}
          <Link to="/register" className="text-pinkGlow hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
