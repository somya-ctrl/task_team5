import React from "react";
import { FaInstagram, FaTwitter } from 'react-icons/fa';
import {Link} from "react-router-dom"

const Footer = () => {
  return (
    <footer className="bg-backg text-darkblue py-10 px-8 md:px-20 relative ">
      <div className="flex flex-col md:flex-row justify-around items-center md:items-start gap-10">

 <div className="absolute top-0 left-0 w-full h-1 bg-darkblue"></div>
        
        
        <div>
        <span className=" text-3xl font-bold">Mind</span>
            <span className="text-aquaGlow text-3xl font-bold">Ease</span>
            
          <div className="  text-darkblue text-sm mt-15 leading-loose">
        © {new Date().getFullYear()} <span className="text-lightgreen">MindEase</span>. All rights reserved.
      </div>
        </div>

     
        <div>
          <h3 className="text-lg font-semibold mb-3 text-darkblue">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm leading-relaxed pt-3">
          <li>
            <Link to="/about" className="hover:text-lightgreen transition ">About Us</Link></li>
            <li>
              <a href="#" className="hover:text-lightgreen transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-lightgreen transition">
                Terms Of Service
              </a>
            </li>
          </ul>
        </div>

        
          <div className="flex justify-center md:justify-start space-x-5 pt-20">
  <a
    href="https://instagram.com"
    target="_blank"
    rel="noopener noreferrer"
    className="text-white hover:text-lightgreen transition-colors bg-darkblue rounded-3xl p-1.75"
  >
    <FaInstagram size={40} />
  </a>
  <a
    href="https://twitter.com"
    target="_blank"
    rel="noopener noreferrer"
    className="text-white hover:text-lightgreen transition-colors bg-darkblue rounded-3xl p-1.5 pt-1.75"
  >
    <FaTwitter size={35} />
  </a>
</div>

     
      </div>

     
    </footer>
  );
};

export default Footer;
