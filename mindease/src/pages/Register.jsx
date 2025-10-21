import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "https://mindease-backend-cyvy.onrender.com/users",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );
      console.log("Registration successful:", response.data);
      navigate("/login");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-backg relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-pinkGlow rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-aquaGlow rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      <div className="z-10 bg-contain text-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold mb-2 mx-20">
          <span className="text-white">Mind</span>
          <span className="text-aquaGlow">Ease</span>
        </h1>
        <p className="text-softGold text-sm text-center mb-6">
          Create your account
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 rounded-md bg-transparent border border-softGold text-white placeholder-softGold focus:outline-none focus:ring-2 focus:ring-pinkGlow"
            required
          />
          <input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 rounded-md bg-transparent border border-softGold text-white placeholder-softGold focus:outline-none focus:ring-2 focus:ring-pinkGlow"
            required
          />

          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2 rounded-md bg-transparent border border-softGold text-white placeholder-softGold focus:outline-none focus:ring-2 focus:ring-pinkGlow"
              required
            />
            <span
              className="absolute right-3 top-2/4 -translate-y-2/4 cursor-pointer text-softGold"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>

          
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
              className="w-full px-4 py-2 rounded-md bg-transparent border border-softGold text-white placeholder-softGold focus:outline-none focus:ring-2 focus:ring-pinkGlow"
              required
            />
            <span
              className="absolute right-3 top-2/4 -translate-y-2/4 cursor-pointer text-softGold"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </span>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-aquaGlow text-white font-semibold rounded-md hover:bg-pinkGlow transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-softGold">
          Already have an account?{" "}
          <Link to="/login" className="text-pinkGlow hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;