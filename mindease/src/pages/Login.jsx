import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa";

import Man from "../assets/man.jpg";
import Woman from "../assets/woman.jpg";
import Logp from "../assets/logp.jpg";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  
  const images = [Man, Woman, Logp];
  const [currentImg, setCurrentImg] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email that starts with a letter.");
      return;
    }

    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
    if (!specialCharRegex.test(formData.password)) {
      setError("Password must contain at least one special character.");
      return;
    }

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
      Object.keys(localStorage).forEach((k) => {
      if (
        k.startsWith("user-null") ||
        k.startsWith("user-undefined") ||
        k.startsWith("meditation-done") ||
        k.startsWith("journal-done") ||
        k.startsWith("mood-check-done") ||
        k.startsWith("mood-history") ||
        k === "name" ||
        k === "photo"
      ) {
        localStorage.removeItem(k);
      }
    });

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    navigate("/profession");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;

  };

  return (
    <div className="min-h-screen w-full flex bg-backg overflow-hidden">

      
      <div className="hidden md:block w-1/2 h-screen p-5">
        <img
          src={images[currentImg]}
          alt="auth-img"
          className="w-full h-195 object-cover transition-all duration-700"
        />
      </div>

      
      <div className="flex items-center justify-between w-full md:w-1/2 p-6 relative">
        <div className="z-10 text-darkblue p-8 w-full max-w-xl">

          <h1 className="text-3xl font-bold mb-2">
            Welcome back!
            <br />
            <span>Login to your account</span>
          </h1>

          <p className="text-darkblue text-lg font-bold mt-5 mb-10">
            Its nice to see you again.
          </p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="w-full px-4 py-2 rounded-md bg- border border-lightgreen text-darkblue placeholder-darkblue focus:outline-none focus:ring-2 focus:ring-pinkGlow"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full px-4 py-2 rounded-md bg-white-200 border border-lightgreen text-darkblue placeholder-darkblue focus:outline-none focus:ring-2 focus:ring-pinkGlow"
                required
              />

              <span
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-darkblue"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye size={20}/> : <FaEyeSlash size={20}/> }
              </span>
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 mt-2 bg-lightgreen text-white font-semibold rounded-md hover:bg-pinkGlow transition"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          <div className="flex items-center my-5">
            <div className="flex-grow border-t border-darkblue"></div>
            <span className="mx-3 text-darkblue">OR</span>
            <div className="flex-grow border-t border-darkblue"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full border border-darkblue bg-aquaGlow text-white py-2 rounded font-semibold flex items-center justify-center gap-3 hover:bg-pinkGlow transition"
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
    </div>
  );
};

export default Login;
