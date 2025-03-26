import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = ({ setShowSearch }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img
            src="/images/logo.png"
            alt="GatherApp Logo"
            className="h-10 w-auto"
          />
          <span className="text-3xl font-extrabold text-blue-600">
            GatherApp
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-lg">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition">
            Home
          </Link>
          <Link
            to="/explore"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Explore
          </Link>
          <Link
            to="/dashboard"
            className="text-gray-700 hover:text-blue-600 transition"
          >
            Dashboard
          </Link>
          <Link
            to="/search"
            className="text-gray-700 hover:text-blue-600 transition"
            onMouseEnter={() => setShowSearch(true)}
          >
            Search
          </Link>
        </div>

        {/* Auth Button */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            to="/auth"
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-2xl text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-md py-4">
          <div className="flex flex-col space-y-4 px-6">
            <Link
              to="/"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Home
            </Link>
            <Link
              to="/explore"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Explore
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600 transition"
            >
              Dashboard
            </Link>
            <Link
              to="/search"
              className="text-gray-700 hover:text-blue-600 transition text-left"
              onMouseEnter={() => setShowSearch(true)}
            >
              Search
            </Link>
            <Link
              to="/auth"
              className="bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
