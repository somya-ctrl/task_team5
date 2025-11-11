import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-2 w-full z-50 bg-backg shadow-md border-b-4 border-darkblue ">
        <nav className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between">
          <Link to="/dashboard" className="text-4xl font-bold flex items-center">
            <span className="text-darkblue">Mind</span>
            <span className="text-lightgreen">Ease</span>
          </Link>

          
          <div className="hidden md:flex items-center gap-10 text-sm">
            <Link
              to="/dashboard"
              className="text-darkblue text-xl hover:text-aquaGlow transition font-bold"
            >
              Home
            </Link>
            <Link
              to="/journal"
              className="text-darkblue text-xl hover:text-aquaGlow transition font-bold"
            >
              Journal
            </Link>
            <Link
              to="/meditations"
              className="text-darkblue text-xl hover:text-aquaGlow transition font-bold"
            >
              Meditations
            </Link>
            <Link
              to="/chat"
              className="text-darkblue text-xl hover:text-aquaGlow transition font-bold"
            >
              AI Therapist
            </Link>

 <Link
              to="/about"
              className="text-darkblue text-xl hover:text-aquaGlow transition font-bold"
            >
              About us
            </Link>


            <Link
              to="/profile"
              className="bg-darkblue text-white transition-colors rounded-full p-2 flex items-center justify-center ml-1.5"
            >
              <FaUser size={30} />
            </Link>
          </div>

          
          <button
            className="md:hidden text-darkblue text-3xl"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </nav>

        
        {menuOpen && (
          <div className="md:hidden bg-backg border-b-4 border-darkblue shadow-lg py-6 flex flex-col items-center gap-6 text-lg font-semibold">
            <Link
              to="/dashboard"
              className="text-darkblue hover:text-aquaGlow"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/journal"
              className="text-darkblue hover:text-aquaGlow"
              onClick={() => setMenuOpen(false)}
            >
              Journal
            </Link>
            <Link
              to="/meditations"
              className="text-darkblue hover:text-aquaGlow"
              onClick={() => setMenuOpen(false)}
            >
              Meditations
            </Link>
            <Link
              to="/chat"
              className="text-darkblue hover:text-aquaGlow"
              onClick={() => setMenuOpen(false)}
            >
              AI Therapist
            </Link>
            <Link
              to="/profile"
              className="text-darkblue hover:text-aquaGlow flex items-center gap-2"
              onClick={() => setMenuOpen(false)}
            >
              <FaUser /> Profile
            </Link>
          </div>
        )}
      </header>
    </>
  );
};

export default Navbar;
