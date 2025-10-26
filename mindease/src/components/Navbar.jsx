import React from 'react'
import { Link } from 'react-router-dom'
import { FaUser } from "react-icons/fa";

const Navbar = () => {
  return (
    <>
    <header className="fixed top-0 left-0 w-full z-50 bg-backg shadow-md border-b-4 border-darkblue ">
  <nav className="max-w-6xl mx-auto px-6 md:px-10 py-5 flex items-center justify-between ">
    <Link to="/" className="text-3xl font-bold flex items-center">
      <span className="text-darkblue">Mind</span>
      <span className="text-aquaGlow">Ease</span>
    </Link>

    <div className="hidden md:flex items-center gap-8 text-sm">
      <Link
        to="/dashboard"
        className="text-darkblue text-lg hover:text-aquaGlow transition font-bold"
      >
        Home
      </Link>
      <Link
        to="/journal"
        className="text-darkblue text-lg hover:text-aquaGlow transition font-bold"
      >
        Journal
      </Link>
      <Link
        to="/meditations"
        className="text-darkblue text-lg hover:text-aquaGlow transition font-bold"
      >
        Meditations
      </Link>
      <Link
        to="/mooddetection"
        className="text-darkblue text-lg hover:text-aquaGlow transition font-bold"
      >
        Mood Detection
      </Link>
       <Link
      to="/profile"
      className="bg-darkblue text-white hover:text-lightgreen transition-colors rounded-full p-2 flex items-center justify-center"
    >
      <FaUser size={30} />
    </Link>
    </div>
  </nav>
</header>

    
    
    </>

  )
}

export default Navbar