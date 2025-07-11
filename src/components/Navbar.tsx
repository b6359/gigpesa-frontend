import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  onRegister?: () => void;
  onSignIn?: () => void;
  minimal?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onRegister, onSignIn, minimal = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Don't show on dashboard route
  if (location.pathname === "/dashboard") return null;

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header className="bg-green-700 text-white shadow relative z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/">
          <img
            src="/images/gigpesa-website-logo.png"
            alt="GigPesa Logo"
            className="h-14 w-auto"
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link to="/about-us" className="hover:underline">About</Link>
          <Link to="/referral" className="hover:underline">Referral Program</Link>
          {!minimal && (
            <>
              <button onClick={onSignIn} className="hover:underline">Sign In</button>
              <button onClick={onRegister} className="hover:underline">Register</button>
            </>
          )}
        </nav>

        {/* Menu icon (visible on all sizes for consistency) */}
        <button
          className="md:hidden focus:outline-none"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open navigation menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile/Universal Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Slide-in Menu (Mobile but works across devices) */}
      <div
        className={`fixed top-0 right-0 w-3/4 max-w-xs h-full bg-white text-green-600 transform ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50 shadow-lg`}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={closeMenu}
            aria-label="Close navigation menu"
            className="text-green-700 hover:text-green-900 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 space-y-4 text-sm font-medium">
          <Link to="/about-us" onClick={closeMenu} className="block hover:underline">
            About us
          </Link>
          <Link to="/referral" onClick={closeMenu} className="block hover:underline">
            Referral Program
          </Link>

          {!minimal && (
            <>
              <button
                onClick={() => {
                  closeMenu();
                  onSignIn?.();
                }}
                className="block w-full text-left hover:underline"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  closeMenu();
                  onRegister?.();
                }}
                className="block w-full text-left hover:underline"
              >
                Register
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
