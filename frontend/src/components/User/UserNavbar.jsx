import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart, FaUserCircle, FaBars, FaTimes } from "react-icons/fa";
import logoImg from "../../assets/ReBuy.png";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  const location = useLocation(); // Get current path

  useEffect(() => {
    const handleScroll = () => setScrollPosition(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Helper to check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <header className={`bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg sticky top-0 z-50 transition-all duration-300 ${scrollPosition > 50 ? 'py-2' : 'py-4'} border-b border-blue-700`}>
      <div className="container mx-auto flex items-center justify-between px-6">
        {/* Logo */}
        <Link to="/HomePage" className="flex items-center space-x-3">
          <img src={logoImg} alt="ReBuy.lk Logo" className="h-12 w-12 object-contain" />
          <span className="text-white text-2xl font-bold tracking-wide">ReBuy.lk</span>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <Link
            to="/HomePage"
            className={`text-lg font-medium transition-colors ${isActive("/HomePage") ? "text-white underline underline-offset-4" : "text-blue-200 hover:text-white"}`}
          >
            Home
          </Link>
          <Link
            to="/productListing"
            className={`text-lg font-medium transition-colors ${isActive("/productListing") ? "text-white underline underline-offset-4" : "text-blue-200 hover:text-white"}`}
          >
            Products
          </Link>
          <Link
            to="/ContactUs"
            className={`text-lg font-medium transition-colors ${isActive("/ContactUs") ? "text-white underline underline-offset-4" : "text-blue-200 hover:text-white"}`}
          >
            Contact Us
          </Link>
          <Link
            to="/AboutUs"
            className={`text-lg font-medium transition-colors ${isActive("/AboutUs") ? "text-white underline underline-offset-4" : "text-blue-200 hover:text-white"}`}
          >
            About Us
          </Link>
          <Link
            to="/FeedbackPage"
            className={`text-lg font-medium transition-colors ${isActive("/FeedbackPage") ? "text-white underline underline-offset-4" : "text-blue-200 hover:text-white"}`}
          >
            Feedback
          </Link>
        </nav>

        {/* Right side icons */}
        <div className="flex items-center space-x-6">
          <div className="hidden md:block text-blue-200 text-xl cursor-pointer hover:text-white transition-colors">
            <FaShoppingCart />
          </div>
          <div className="text-blue-200 text-xl cursor-pointer hover:text-white transition-colors">
            <FaUserCircle />
          </div>
          <button className="md:hidden text-blue-200 text-xl focus:outline-none" onClick={toggleMenu}>
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-800 px-6 py-4">
          <div className="flex flex-col space-y-4">
            <Link
              to="/HomePage"
              className={`transition-colors ${isActive("/HomePage") ? "text-white font-bold" : "text-blue-200 hover:text-white"}`}
              onClick={toggleMenu}
            >
              Home
            </Link>
            <Link
              to="/productListing"
              className={`transition-colors ${isActive("/productListing") ? "text-white font-bold" : "text-blue-200 hover:text-white"}`}
              onClick={toggleMenu}
            >
              Products
            </Link>
            <Link
              to="/ContactUs"
              className={`transition-colors ${isActive("/ContactUs") ? "text-white font-bold" : "text-blue-200 hover:text-white"}`}
              onClick={toggleMenu}
            >
              Contact Us
            </Link>
            <Link
              to="/AboutUs"
              className={`transition-colors ${isActive("/AboutUs") ? "text-white font-bold" : "text-blue-200 hover:text-white"}`}
              onClick={toggleMenu}
            >
              About Us
            </Link>
            <Link
              to="/FeedbackPage"
              className={`transition-colors ${isActive("/FeedbackPage") ? "text-white font-bold" : "text-blue-200 hover:text-white"}`}
              onClick={toggleMenu}
            >
              Feedback
            </Link>
            <div className="pt-4 border-t border-blue-700">
              <Link to="/cart" className="text-blue-200 hover:text-white transition-colors flex items-center" onClick={toggleMenu}>
                <FaShoppingCart className="mr-2" /> Shopping Cart
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
