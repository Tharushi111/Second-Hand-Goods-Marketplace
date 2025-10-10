import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import logoImg from "../../assets/ReBuy.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // ✅ Detect if current route belongs to admin
  const isAdminRoute = location.pathname.toLowerCase().includes("admin");

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isActive = (path) => location.pathname === path;

  const handleProfileClick = () => {
    if (token) {
      navigate("/BuyerDashboard");
    } else {
      navigate("/UserLogin");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/UserLogin");
  };

  return (
    <header
      className={`bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg sticky top-0 z-50 transition-all duration-300 ${
        scrollPosition > 50 ? "py-2" : "py-4"
      } border-b border-blue-700`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <Link to="/HomePage" className="flex items-center space-x-3">
          <img
            src={logoImg}
            alt="ReBuy.lk Logo"
            className="h-12 w-12 object-contain"
          />
          <span className="text-white text-2xl font-bold tracking-wide">
            ReBuy.lk
          </span>
        </Link>

        {/* Navigation Links */}
        {!isAdminRoute && (
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/HomePage"
              className={`text-lg font-medium transition-colors ${
                isActive("/HomePage")
                  ? "text-white underline underline-offset-4"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              Home
            </Link>
            <Link
              to="/productListing"
              className={`text-lg font-medium transition-colors ${
                isActive("/productListing")
                  ? "text-white underline underline-offset-4"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              Products
            </Link>
            <Link
              to="/ContactUs"
              className={`text-lg font-medium transition-colors ${
                isActive("/ContactUs")
                  ? "text-white underline underline-offset-4"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              Contact Us
            </Link>
            <Link
              to="/AboutUs"
              className={`text-lg font-medium transition-colors ${
                isActive("/AboutUs")
                  ? "text-white underline underline-offset-4"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              About Us
            </Link>
            <Link
              to="/FeedbackPage"
              className={`text-lg font-medium transition-colors ${
                isActive("/FeedbackPage")
                  ? "text-white underline underline-offset-4"
                  : "text-blue-200 hover:text-white"
              }`}
            >
              Feedback
            </Link>
          </nav>
        )}

        {/* Right side icons (hidden for Admin) */}
        {!isAdminRoute && (
          <div className="flex items-center space-x-6">
            <div
              className="text-blue-200 text-xl cursor-pointer hover:text-white transition-colors"
              onClick={handleProfileClick}
            >
              <FaUserCircle />
            </div>

            {token ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all duration-200"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/UserLogin"
                className="bg-blue-400 text-white px-4 py-2 rounded-md hover:bg-blue-500 transition-all duration-200"
              >
                Login
              </Link>
            )}

            <button
              className="md:hidden text-blue-200 text-xl focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {!isAdminRoute && isMenuOpen && (
        <div className="md:hidden bg-blue-800 px-6 py-4">
          <div className="flex flex-col space-y-4">
            <Link
              to="/HomePage"
              className={`transition-colors ${
                isActive("/HomePage")
                  ? "text-white font-bold"
                  : "text-blue-200 hover:text-white"
              }`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/productListing"
              className={`transition-colors ${
                isActive("/productListing")
                  ? "text-white font-bold"
                  : "text-blue-200 hover:text-white"
              }`}
              onClick={toggleMenu}
            >
              Products
            </Link>
            <Link
              to="/ContactUs"
              className={`transition-colors ${
                isActive("/ContactUs")
                  ? "text-white font-bold"
                  : "text-blue-200 hover:text-white"
              }`}
              onClick={toggleMenu}
            >
              Contact Us
            </Link>
            <Link
              to="/AboutUs"
              className={`transition-colors ${
                isActive("/AboutUs")
                  ? "text-white font-bold"
                  : "text-blue-200 hover:text-white"
              }`}
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link
              to="/FeedbackPage"
              className={`transition-colors ${
                isActive("/FeedbackPage")
                  ? "text-white font-bold"
                  : "text-blue-200 hover:text-white"
              }`}
              onClick={toggleMenu}
            >
              Feedback
            </Link>

            <div className="pt-4 border-t border-blue-700">
              {token ? (
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-all duration-200"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/UserLogin"
                  className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-all duration-200"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
