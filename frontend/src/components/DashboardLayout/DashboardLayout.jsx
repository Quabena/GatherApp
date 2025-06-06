import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import {
  FiSettings,
  FiCalendar,
  FiStar,
  FiLogOut,
  FiMenu,
  FiX,
  FiActivity,
} from "react-icons/fi";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    alert("Logging out...");
    // Add your logout logic here
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="flex flex-1">
        {/* Sidebar (Desktop & Mobile) */}
        <div
          className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-6 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0 transition-transform duration-300 ease-in-out z-20`}
        >
          {/* Sidebar Header */}
          <div className="flex justify-between items-center mb-8">
            <Link to="/home" className="text-2xl font-bold text-blue-600">
              GatherApp
            </Link>
            {/* Close Button (Mobile) */}
            <button
              className="md:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setSidebarOpen(false)}
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-4">
            <Link
              to="/dashboard/create-event"
              className="flex items-center text-gray-700 hover:text-blue-600 p-3 rounded-lg hover:bg-blue-50 transition duration-200"
            >
              <FiActivity className="mr-3" /> Create Event
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center text-gray-700 hover:text-blue-600 p-3 rounded-lg hover:bg-blue-50 transition duration-200"
            >
              <FiCalendar className="mr-3" /> Upcoming Events
            </Link>
            <Link
              to="/dashboard/past"
              className="flex items-center text-gray-700 hover:text-blue-600 p-3 rounded-lg hover:bg-blue-50 transition duration-200"
            >
              <FiStar className="mr-3" /> Past Events
            </Link>
            <Link
              to="/dashboard/settings"
              className="flex items-center text-gray-700 hover:text-blue-600 p-3 rounded-lg hover:bg-blue-50 transition duration-200"
            >
              <FiSettings className="mr-3" /> Settings
            </Link>
          </nav>

          {/* Logout Button */}
          <button
            className="w-full flex items-center text-red-600 hover:text-red-700 p-3 rounded-lg hover:bg-red-50 mt-10 transition-all duration-200"
            onClick={handleLogout}
          >
            <FiLogOut className="mr-3" /> Log Out
          </button>
        </div>

        {/* Mobile Navigation Button */}
        <button
          className={`fixed top-4 left-4 md:hidden bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-gray-900 transition duration-200 z-10 ${
            sidebarOpen ? "opacity-0" : "opacity-100"
          }`}
          onClick={() => setSidebarOpen(true)}
        >
          <FiMenu size={24} />
        </button>

        {/* Main Content Area */}
        <div className="flex-1 md:ml-64 p-6 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
