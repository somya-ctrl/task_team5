import React from "react";
import { FaInstagram, FaTwitter,FaFacebook } from 'react-icons/fa';
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-backg text-darkblue py-6 px-6  border-t-3 border-darkblue
    bottom-0 left-0 w-full relative
    md:static md:py-10 md:px-20">

      <div className="flex flex-col md:flex-row justify-start md:justify-around items-start gap-10">

        <div className="absolute top-0 left-0 w-full h-1 bg-darkblue"></div>

        <div>
          <span className="text-4xl font-bold">Mind</span>
          <span className="text-aquaGlow text-4xl font-bold">Ease</span>

          <div className="text-darkblue text-md mt-2 leading-loose">
            © {new Date().getFullYear()} <span className="text-lightgreen">MindEase</span>. All rights reserved.
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3 text-darkblue">Quick Links</h3>
          <ul className="space-y-2 text-sm leading-relaxed pt-1">
            <li><Link to="/about" className="hover:text-lightgreen text-xl transition">About Us</Link></li>
            <li><a href="#" className="hover:text-lightgreen text-xl transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-lightgreen text-xl transition">Terms Of Service</a></li>
          </ul>
        </div>

        <div className="flex space-x-4 pt-2">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-lightgreen transition-colors bg-darkblue rounded-3xl p-2"
          >
            <FaInstagram size={40} />
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-lightgreen transition-colors bg-darkblue rounded-3xl p-2"
          >
            <FaTwitter size={40} />
          </a>

          
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:text-lightgreen transition-colors bg-darkblue rounded-3xl p-2"
          >
            <FaFacebook size={40} />
          </a>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

