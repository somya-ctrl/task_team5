import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const response = await axios.post(
        "https://mindease-backend-cyvy.onrender.com/login",
        formData
      );
      console.log("Login successful:", response.data);
      
      
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      navigate("/dashboard"); 
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-backg relative overflow-hidden">
      
      <div className="absolute w-96 h-96 bg-pinkGlow rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-aquaGlow rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      
      <div className="z-10 bg-contain text-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-white">Mind</span>
          <span className="text-aquaGlow">Ease</span>
        </h1>
        <p className="mb-6 text-softGold">Welcome back to your safe place.</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm mb-1" htmlFor="email">
              Email address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 rounded bg-darkBase border border-softGold text-white placeholder-softGold focus:outline-none focus:ring-2 focus:ring-aquaGlow"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full px-4 py-2 rounded bg-darkBase border border-softGold text-white placeholder-softGold focus:outline-none focus:ring-2 focus:ring-aquaGlow"
              placeholder="••••••••"
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

        <p className="mt-6 text-center text-softGold">
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
