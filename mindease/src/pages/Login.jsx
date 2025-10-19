import React from 'react';
import { Link } from 'react-router-dom';


const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-darkBase relative overflow-hidden">
    
      <div className="absolute w-96 h-96 bg-pinkGlow rounded-full blur-3xl opacity-30 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-aquaGlow rounded-full blur-3xl opacity-30 bottom-10 right-10 animate-pulse"></div>

      <div className="z-10 bg-deepPurple text-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-white">Mind</span>
          <span className="text-aquaGlow">Ease</span>
        </h1>
        <p className="mb-6 text-softGold">Welcome back to your safe place.</p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1" htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded bg-darkBase border border-softGold text-white placeholder-softGold focus:outline-none focus:ring-2 focus:ring-aquaGlow"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm mb-1" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 rounded bg-darkBase border border-softGold text-white placeholder-softGold focus:outline-none focus:ring-2 focus:ring-aquaGlow"
              placeholder="••••••••"
            />
          </div>
        
          <button
            type="submit"
            className="w-full bg-aquaGlow hover:bg-pinkGlow transition-colors text-white py-2 rounded font-semibold"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-softGold">
          Don't have an account?{' '}
         <Link to="/register" className="text-pinkGlow hover:underline">Sign Up</Link>

        </p>
      </div>
    </div>
  );
};

export default Login;
