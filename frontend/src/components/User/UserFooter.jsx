import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import logoImg from "../../assets/ReBuy.png";

const Footer = () => {
  const location = useLocation(); // Get current path

  // Helper to check if link is active
  const isActive = (path) => location.pathname === path;

  // Optional: pass category as query param to productListing
  const categoryLink = (category) => `/productListing?category=${category}`;

  return (
    <footer className="bg-gradient-to-b from-blue-900 to-blue-950 text-white mt-auto">
      <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand section */}
        <div className="md:col-span-1">
          <div className="flex items-center space-x-3 mb-4">
            <img src={logoImg} alt="ReBuy.lk Logo" className="h-12 w-12 object-contain" />
            <span className="text-2xl font-bold">ReBuy.lk</span>
          </div>
          <p className="text-blue-300 mb-4">
            Your trusted marketplace for second-hand goods. Buy, sell, and save!
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-blue-300 hover:text-white transition-colors"><FaFacebook size={20} /></a>
            <a href="#" className="text-blue-300 hover:text-white transition-colors"><FaInstagram size={20} /></a>
            <a href="#" className="text-blue-300 hover:text-white transition-colors"><FaTwitter size={20} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to="/HomePage"
                className={`transition-colors ${isActive("/HomePage") ? "text-white font-bold underline" : "text-blue-300 hover:text-white"}`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/productListing"
                className={`transition-colors ${isActive("/productListing") ? "text-white font-bold underline" : "text-blue-300 hover:text-white"}`}
              >
                Products
              </Link>
            </li>
            <li>
              <Link
                to="/ContactUs"
                className={`transition-colors ${isActive("/ContactUs") ? "text-white font-bold underline" : "text-blue-300 hover:text-white"}`}
              >
                Contact Us
              </Link>
            </li>
            <li>
              <Link
                to="/AboutUs"
                className={`transition-colors ${isActive("/AboutUs") ? "text-white font-bold underline" : "text-blue-300 hover:text-white"}`}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                to="/FeedbackPage"
                className={`transition-colors ${isActive("/FeedbackPage") ? "text-white font-bold underline" : "text-blue-300 hover:text-white"}`}
              >
                Feedback
              </Link>
            </li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Categories</h3>
          <ul className="space-y-2">
            <li>
              <Link
                to={categoryLink("Laptops")}
                className={`transition-colors ${location.search.includes("Laptops") ? "text-white font-bold underline" : "text-blue-300 hover:text-white"}`}
              >
                Laptops & Computers
              </Link>
            </li>
            <li>
              <Link
                to={categoryLink("Mobiles")}
                className={`transition-colors ${location.search.includes("Mobiles") ? "text-white font-bold underline" : "text-blue-300 hover:text-white"}`}
              >
                Mobile Phones
              </Link>
            </li>
            <li>
              <Link
                to={categoryLink("TVs")}
                className={`transition-colors ${location.search.includes("TVs") ? "text-white font-bold underline" : "text-blue-300 hover:text-white"}`}
              >
                Televisions
              </Link>
            </li>
            <li>
              <Link
                to={categoryLink("OtherElectronics")}
                className={`transition-colors ${location.search.includes("OtherElectronics") ? "text-white font-bold underline" : "text-blue-300 hover:text-white"}`}
              >
                Other Electronics
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-white">Newsletter</h3>
          <p className="text-blue-300 mb-4">Subscribe to get updates on new products and promotions</p>
          <div className="flex">
            <input 
              type="email" 
              placeholder="Your email" 
              className="bg-blue-800 text-white px-4 py-2 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-blue-400 w-full"
            />
            <button className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-r-lg transition-colors">Subscribe</button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-blue-800">
        <div className="container mx-auto px-6 py-4 text-center text-blue-400 text-sm">
          © {new Date().getFullYear()} ReBuy.lk. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
