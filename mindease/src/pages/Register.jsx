import React from 'react';
import { Link } from 'react-router-dom';

const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBase relative overflow-hidden">
     
      <div className="absolute w-96 h-96 bg-pinkGlow rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-aquaGlow rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

     
     <div className="z-10 bg-deepPurple text-white p-8 rounded-xl shadow-lg w-auto max-w-md">
        <h1 className="text-4xl font-bold mb-2 mx-30">
          <span className="text-white">Mind</span>
          <span className="text-aquaGlow">Ease</span>
        </h1>
        <p className="text-softGold text-sm text-center mb-6">Create your account</p>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 rounded-md bg-transparent border border-softGold text-white placeholder-softGold focus:outline-none focus:ring-2 focus:ring-pinkGlow"
          />
          <input
            type="email"
            placeholder="Email address"
            className="w-full px-4 py-2 rounded-md bg-transparent border border-softGold text-white placeholder-softGold focus:outline-none focus:ring-2 focus:ring-pinkGlow"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md bg-transparent border border-softGold text-white placeholder-softGold focus:outline-none focus:ring-2 focus:ring-pinkGlow"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full px-4 py-2 rounded-md bg-transparent border border-softGold text-white placeholder-softGold focus:outline-none focus:ring-2 focus:ring-pinkGlow"
          />

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-aquaGlow text-white font-semibold rounded-md hover:bg-pinkGlow transition"
          >
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-softGold">
          Already have an account?{' '}
          <Link to="/login" className="text-pinkGlow hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
