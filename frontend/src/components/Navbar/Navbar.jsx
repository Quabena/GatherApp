import React from "react";
import { Link } from "react-router-dom";
import { FiUser, FiLogIn } from "react-icons/fi";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          GatherApp
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link to="/" className="text-gray-600 hover:text-blue-600">
            Home
          </Link>
          <Link to="/" className="text-gray-600 hover:text-blue-600">
            Explore
          </Link>
          <Link to="/dashboard" className="text-gray-600 hover:text-blue-600">
            Dashboard
          </Link>
          <Link to="/search" className="text-gray-600 hover:text-blue-600">
            Search
          </Link>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/auth"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Sign In
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
