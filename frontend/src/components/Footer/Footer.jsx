import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 z-50">
      <div className="container mx-auto px-4 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <Link className="space-y-3" to="/home">
            <h2 className="text-xl font-bold text-white">GatherApp</h2>
            <p className="text-sm">Find. Connect. Experience.</p>
          </Link>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-2 md:items-center">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-1 inline-block">
              <li className="inline-block ml-4">
                <a href="/home" className="hover:text-white">
                  Home
                </a>
              </li>
              <li className="inline-block ml-4">
                <a href="/explore" className="hover:text-white">
                  Explore
                </a>
              </li>
              <li className="inline-block ml-4">
                <a href="/dashboard" className="hover:text-white">
                  Dashboard
                </a>
              </li>
              <li className="inline-block ml-4">
                <a href="/#about" className="hover:text-white">
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="flex flex-col md:items-end">
            <h3 className="text-lg font-semibold text-white">Follow Us</h3>
            <div className="flex space-x-4 mt-2">
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-facebook text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-x text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-instagram text-xl"></i>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-700 mt-6 pt-4 text-center text-sm">
          © {new Date().getFullYear()} GatherApp. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
