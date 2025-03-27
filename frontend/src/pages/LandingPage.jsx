import React from "react";
import { Link } from "react-router-dom";
import {
  FaLinkedin,
  FaArrowRight,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { FiX, FiGithub } from "react-icons/fi";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img
                src="/images/logo.png"
                alt="GatherApp Logo"
                className="h-10 w-auto mr-2"
              />
              <span className="text-2xl font-bold text-blue-600">
                GatherApp
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600">
                Features
              </a>
              <a href="#about" className="text-gray-600 hover:text-blue-600">
                About
              </a>
              <Link
                to="/home"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Launch App
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80"
              alt="Events Cover"
              className="w-full h-[600px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-900/40 flex items-center">
              <div className="max-w-2xl mx-auto text-center px-4">
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Find. Connect. Experience.
                </h1>
                <p className="text-xl text-blue-100 mb-8">
                  Your all-in-one platform for discovering and organizing
                  amazing events
                </p>
                <Link
                  to="/home"
                  className="inline-flex items-center px-8 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Get Started
                  <FaArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Key Features
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="h-48 mb-6 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Event Discovery"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Smart Event Discovery
              </h3>
              <p className="text-gray-600">
                Find events that match your interests with our intelligent
                recommendation system and advanced search filters.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="h-48 mb-6 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Event Management"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Seamless Event Management
              </h3>
              <p className="text-gray-600">
                Create and manage events effortlessly with our intuitive tools,
                from registration to attendee communication.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <div className="h-48 mb-6 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1517457373958-b7bdd4587205?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  alt="Community"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Vibrant Community
              </h3>
              <p className="text-gray-600">
                Connect with like-minded people, share experiences, and build
                lasting relationships through shared interests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            About The Project
          </h2>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-6">
              GatherApp was born from a personal frustration with existing event
              platforms. As someone who loves organizing and attending events, I
              noticed a gap in the market for a platform that truly puts
              community and user experience first.
            </p>

            <p className="text-gray-600 mb-6">
              This project is part of my ALX Portfolio Project, developed over 3
              weeks of intensive coding and user research. It represents not
              just a technical achievement, but a solution to a real-world
              problem I was passionate about solving.
            </p>

            <div className="bg-blue-50 rounded-xl p-8 mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Project Stats
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <FaCalendarAlt className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                  <div className="font-semibold text-gray-900">3 Weeks</div>
                  <div className="text-sm text-gray-600">Development Time</div>
                </div>
                <div className="text-center">
                  <FaUsers className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                  <div className="font-semibold text-gray-900">1000+</div>
                  <div className="text-sm text-gray-600">Beta Users</div>
                </div>
                <div className="text-center">
                  <FaMapMarkerAlt className="w-6 h-6 mx-auto text-blue-600 mb-2" />
                  <div className="font-semibold text-gray-900">50+</div>
                  <div className="text-sm text-gray-600">Cities Covered</div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-6">
              <a
                href="https://github.com/yourusername/gatherapp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <FiGithub className="w-6 h-6" />
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <FaLinkedin className="w-6 h-6" />
              </a>
              <a
                href="https://x.com/ivanzcorbie"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900"
              >
                <FiX className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">
            Built With Love By Evans Adu | ALX Portfolio Project{" "}
            {new Date().getFullYear()}
          </p>
          <div className="mt-4">
            <Link
              to="/explore"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Start Exploring Events →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
