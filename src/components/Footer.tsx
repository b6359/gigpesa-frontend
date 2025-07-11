// src/components/Footer.tsx
import { Link } from "react-router-dom";
import { FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";
import { SiTiktok } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="bg-green-700 text-white px-6 py-10 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-center">
        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row sm:justify-center gap-4 text-sm text-white/90 text-center sm:text-left">
          <Link to="/terms" className="hover:underline transition duration-200">
            Terms & Conditions
          </Link>
          <Link to="/privacy" className="hover:underline transition duration-200">
            Privacy Policy
          </Link>
          <Link to="/contact-us" className="hover:underline transition duration-200">
            Contact Us
          </Link>
        </div>

        {/* Social Icons */}
        <div className="flex justify-center gap-4 text-white text-xl">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="hover:text-white/80 transition-transform transform hover:scale-110"
          >
            <FaFacebookF />
          </a>
          <a
            href="https://www.tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="TikTok"
            className="hover:text-white/80 transition-transform transform hover:scale-110"
          >
            <SiTiktok />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="hover:text-white/80 transition-transform transform hover:scale-110"
          >
            <FaLinkedinIn />
          </a>
          <a
            href="https://www.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="hover:text-white/80 transition-transform transform hover:scale-110"
          >
            <FaYoutube />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-xs text-center sm:text-right text-white/80">
          &copy; {new Date().getFullYear()} GigPesa. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
