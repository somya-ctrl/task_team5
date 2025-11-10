import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Man from "../assets/man.jpg"
import Woman from "../assets/woman.jpg"
import Logp from "../assets/logp.jpg"


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

 const images = [Man, Woman, Logp];

const [currentImg, setCurrentImg] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentImg(prev => (prev + 1) % images.length);
  }, 4000);
  return () => clearInterval(interval);
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const nameRegex = /^[A-Za-z ]+$/;
    if (!nameRegex.test(formData.name.trim())) {
      setError("Name should only contain letters and spaces.");
      return;
    }

    const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email that starts with a letter.");
      return;
    }

    const allowedDomainRegex = /^[A-Za-z0-9._%+-]+@gmail\.com$/;
    if (!allowedDomainRegex.test(formData.email)) {
      setError("Only Gmail addresses are allowed.");
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
    <div className="min-h-screen w-full flex bg-backg overflow-hidden">

      
      <div className="hidden md:block w-1/2 h-screen p-5">
        <img
          src={images[currentImg]}
          alt="auth-img"
          className="w-full h-195 object-cover transition-all duration-700"
        />
      </div>

      
      <div className="flex items-center justify-between w-full md:w-1/2 p-6 relative">


        <div className="z-10 bg-blend-color text-darkblue p-8  w-full max-w-xl">

          <h1 className="text-3xl font-bold mb-2">
            Join us <br />
            <span>Create your account</span>
          </h1>

          <p className="text-darkblue text-lg font-bold mt-3 mb-6">Its nice to see you again.</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input type="text" placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-6 py-2 rounded-md bg-white-200 border border-lightgreen text-darkblue placeholder-darkblue focus:outline-none focus:ring-2 focus:ring-pinkGlow"
              required
            />

            <input type="email" placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-md bg-white-200 border border-lightgreen text-darkblue placeholder-darkblue focus:outline-none focus:ring-2 focus:ring-pinkGlow"
              required
            />

            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 rounded-md bg-white-200 border border-lightgreen text-darkblue placeholder-darkblue focus:outline-none focus:ring-2 focus:ring-pinkGlow"
                required
              />
             <span

className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-darkblue"
  onClick={() => setShowPassword(!showPassword)}

>
  {showPassword ? <FaEye size={20}/>   :  <FaEyeSlash size={20}/> }
</span>

            </div>

            <div className="relative">
              <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 rounded-md bg-white-200 border border-lightgreen text-darkblue placeholder-darkblue focus:outline-none focus:ring-2 focus:ring-pinkGlow"
                required
              />
            <span
  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-darkblue"
  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
>
  {showConfirmPassword ?<FaEye size={20}/>   : <FaEyeSlash size={20}/>  }
</span>

            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button type="submit" disabled={loading}
              className="w-full py-2 mt-2 bg-lightgreen text-white font-semibold rounded-md hover:bg-pinkGlow transition">
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <p className="mt-6 text-center text-darkblue">
            Already have an account?{" "}
            <Link to="/login" className="text-pinkGlow hover:underline">Log In</Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Register;
