import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../../hooks/useAuth";
import axios from "axios";
import toast from "react-hot-toast";

const Navbar = ({ setShowSearch }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/auth/logout",
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      logout();
      toast.success("Successfully logged out");
      navigate("/home");
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="bg-white shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/home" className="flex items-center space-x-2">
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
          <Link
            to="/home"
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
            className="text-gray-700 hover:text-blue-600 transition"
            onMouseEnter={() => setShowSearch(true)}
          >
            Search
          </Link>
        </div>

        {/* Auth Section */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FiUser className="text-gray-600" />
                <span className="text-gray-700 font-medium">
                  {user.name || user.email.split("@")[0]}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                <FiLogOut className="text-lg" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Sign In
            </Link>
          )}
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
              to="/home"
              className="text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/explore"
              className="text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              Explore
            </Link>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600 transition"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/search"
              className="text-gray-700 hover:text-blue-600 transition text-left"
              onMouseEnter={() => setShowSearch(true)}
              onClick={() => setMenuOpen(false)}
            >
              Search
            </Link>
            {user ? (
              <>
                <div className="flex items-center space-x-2 py-2 border-t border-gray-100 pt-4">
                  <FiUser className="text-gray-600" />
                  <span className="text-gray-700 font-medium">
                    {user.name || user.email.split("@")[0]}
                  </span>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center justify-center space-x-2 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
                >
                  <FiLogOut />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700 transition"
                onClick={() => setMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
