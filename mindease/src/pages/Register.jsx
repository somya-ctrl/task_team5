import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api"; 

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

  // Name: Only letters & spaces allowed
  const nameRegex = /^[A-Za-z ]+$/;
  if (!nameRegex.test(formData.name.trim())) {
    setError("Name should only contain letters and spaces.");
    return;
  }

  // Email must start with a letter + follow standard email format
  const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!emailRegex.test(formData.email)) {
    setError("Please enter a valid email that starts with a letter.");
    return;
  }

  // Password must contain at least one special character
  const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
  if (!specialCharRegex.test(formData.password)) {
    setError("Password must contain at least one special character.");
    return;
  }

  // Password length
  if (formData.password.length < 6) {
    setError("Password must be at least 6 characters long.");
    return;
  }

  // Confirm password match
  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  try {
    setLoading(true);
    await registerUser({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
    navigate("/login");
  } catch (err) {
    console.log(err.response?.data || err.message);
    setError(err.response?.data?.message || "Registration failed. Try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-backg relative overflow-hidden">
      <div className="absolute w-96 h-96 bg-pinkGlow rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-aquaGlow rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      <div className="z-10 bg-backg text-darkblue p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold mb-2 text-center">
          <span className="text-darkblue">Mind</span>
          <span className="text-lightgreen">Ease</span>
        </h1>
        <p className="text-darkblue text-sm text-center mb-6">
          Create your account
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 rounded-md bg-blue-200 border border-lightgreen text-darkblue placeholder-darkblue focus:outline-none focus:ring-2 focus:ring-pinkGlow"
            required
          />

          <input
            type="email"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 rounded-md bg-blue-200 border border-lightgreen text-darkblue placeholder-darkblue focus:outline-none focus:ring-2 focus:ring-pinkGlow"
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
              className="w-full px-4 py-2 rounded-md bg-blue-200 border border-lightgreen text-darkblue placeholder-darkblue focus:outline-none focus:ring-2 focus:ring-pinkGlow"
              required
            />
            <span
              className="absolute right-3 top-2/4 -translate-y-2/4 cursor-pointer text-darkblue"
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
              className="w-full px-4 py-2 rounded-md bg-blue-200 border border-lightgreen text-darkblue placeholder-darkblue focus:outline-none focus:ring-2 focus:ring-pinkGlow"
              required
            />
            <span
              className="absolute right-3 top-2/4 -translate-y-2/4 cursor-pointer text-darkblue"
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </span>
          </div>

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-2 bg-lightgreen text-white font-semibold rounded-md hover:bg-pinkGlow transition"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-darkblue">
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
