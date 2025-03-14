import React from "react";
import { Link, Outlet } from "react-router-dom";
import { FiSettings, FiCalendar, FiStar, FiLogOut } from "react-icons/fi";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-sm p-6 hidden md:block">
        <Link to="/">
          <h2 className="text-2xl font-bold text-blue-600 mb-8">GatherApp</h2>
        </Link>
        <nav className="space-y-4">
          <Link
            to="/dashboard"
            className="flex items-center text-gray-600 hover:text-blue-600 p-3 rounded-lg hover:bg-blue-50"
          >
            <FiCalendar className="mr-3" /> Upcoming Events
          </Link>
          <Link
            to="/dashboard/past"
            className="flex items-center text-gray-600 hover:text-blue-600 p-3 rounded-lg hover:bg-blue-50"
          >
            <FiStar className="mr-3" /> Past Events
          </Link>
          <Link
            to="/dashboard/settings"
            className="flex items-center text-gray-600 hover:text-blue-600 p-3 rounded-lg hover:bg-blue-50"
          >
            <FiSettings className="mr-3" /> Settings
          </Link>
          <button className="w-full flex items-center text-red-600 hover:text-red-700 p-3 rounded-lg hover:bg-red-50 mt-8 transition-all duration-200 ease-in-out">
            <FiLogOut className="mr-3" /> Log Out
          </button>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-white shadow-sm p-4">
        <select className="w-full p-2 rounded-lg border border-gray-300">
          <option value="/dashboard">Upcoming Events</option>
          <option value="/dashboard/past">Past Events</option>
          <option value="/dashboard/settings">Settings</option>
        </select>
      </div>

      {/* Main Content */}
      <div className="md:ml-64 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
