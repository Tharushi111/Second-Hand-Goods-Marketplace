import React, { useState, useEffect } from "react";
import { 
  FaUserCircle, 
  FaFacebook, 
  FaInstagram, 
  FaTwitter, 
  FaSearch, 
  FaShoppingCart,
  FaArrowRight,
  FaDollarSign,
  FaCheckCircle,
  FaHandshake,
  FaBars,
  FaTimes,
  FaStar
} from "react-icons/fa";
import { Link } from "react-router-dom";

// Your existing image imports
import laptopImg from "../../assets/categories/laptop.jpg";
import mobileImg from "../../assets/categories/mobile.jpg";
import tvImg from "../../assets/categories/TV.png";
import othersImg from "../../assets/categories/others.jpg";
import logoImg from "../../assets/ReBuy.png";
import heroImg from "../../assets/hero-image.jpg";

const HomePage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  const categories = [
    { name: "Laptops & Computers", img: laptopImg, items: "1,240 products" },
    { name: "Mobile Phones", img: mobileImg, items: "980 products" },
    { name: "Televisions", img: tvImg, items: "560 products" },
    { name: "Others", img: othersImg, items: "2,140 products" },
  ];

  const features = [
    { 
      title: "Affordable Prices", 
      description: "Get the best deals and save money with our budget-friendly prices.",
      icon: <FaDollarSign className="text-blue-600 text-2xl" />
    },
    { 
      title: "Quality Products", 
      description: "We ensure every product is in great condition before selling.",
      icon: <FaCheckCircle className="text-blue-600 text-2xl" />
    },
    { 
      title: "Trusted Suppliers", 
      description: "Work with reliable suppliers for a safe and trusted experience.",
      icon: <FaHandshake className="text-blue-600 text-2xl" />
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Frequent Buyer",
      text: "I've saved over $2,000 buying refurbished electronics from ReBuy. The quality is always excellent!",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Electronics Seller",
      text: "As a seller, ReBuy has provided me with a reliable platform to reach customers who value quality used goods.",
      rating: 4
    },
    {
      name: "Emma Rodriguez",
      role: "First-time Buyer",
      text: "I was hesitant at first, but the verification process and warranty made me feel confident in my purchase.",
      rating: 5
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to render star ratings
  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar 
        key={i} 
        className={i < rating ? "text-yellow-400" : "text-gray-300"} 
        size={14} 
      />
    ));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Navbar */}
      <header className={`bg-gradient-to-r from-blue-900 to-blue-800 shadow-lg sticky top-0 z-50 transition-all duration-300 ${scrollPosition > 50 ? 'py-2' : 'py-4'} border-b border-blue-700`}>
        <div className="container mx-auto flex items-center justify-between px-6">
          {/* Logo and Brand Name - Removed circle and made logo bigger */}
          <Link to="/" className="flex items-center space-x-3">
            <img
              src={logoImg}
              alt="ReBuy.lk Logo"
              className="h-12 w-12 object-contain" // Increased size and removed rounded-full
            />
            <span className="text-white text-2xl font-bold tracking-wide">
              ReBuy.lk
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-blue-200 hover:text-white text-lg font-medium transition-colors">
              Home
            </Link>
            <Link to="/productListing" className="text-blue-200 hover:text-white text-lg font-medium transition-colors">
              Products
            </Link>
            <Link to="/ContactUs" className="text-blue-200 hover:text-white text-lg font-medium transition-colors">
              Contact Us
            </Link>
            <Link to="/AboutUs" className="text-blue-200 hover:text-white text-lg font-medium transition-colors">
              About Us
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
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-blue-200 text-xl focus:outline-none"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-800 px-6 py-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-blue-200 hover:text-white transition-colors" onClick={toggleMenu}>
                Home
              </Link>
              <Link to="/productListing" className="text-blue-200 hover:text-white transition-colors" onClick={toggleMenu}>
                Products
              </Link>
              <Link to="/ContactUs" className="text-blue-200 hover:text-white transition-colors" onClick={toggleMenu}>
                Contact Us
              </Link>
              <Link to="/AboutUs" className="text-blue-200 hover:text-white transition-colors" onClick={toggleMenu}>
                About Us
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

      {/* Hero Section with Background Image */}
      <section 
        className="relative h-screen-80 flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(15, 23, 42, 0.8)), url(${heroImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 animate-fade-in">
            Buy & Sell <span className="text-blue-300">Second-Hand</span> Goods
          </h1>
          <p className="text-xl md:text-2xl text-blue-200 max-w-2xl mx-auto mb-10">
            Find the best deals on quality second-hand products from trusted sellers.
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for products, brands, categories..."
              className="w-full p-4 pl-5 pr-12 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 shadow-lg"
            />
            <button className="absolute right-2 top-2 bg-blue-700 text-white p-3 rounded-full hover:bg-blue-600 transition-colors">
              <FaSearch />
            </button>
          </div>

          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <button className="bg-blue-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-blue-600 transition-all transform hover:-translate-y-1 flex items-center">
              Explore Products <FaArrowRight className="ml-2" />
            </button>
            <button className="bg-white text-blue-800 px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-all transform hover:-translate-y-1">
              Start Selling
            </button>
          </div>
        </div>
        
        {/* Animated wave divider */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="fill-current text-white">
            <path d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
          </svg>
        </div>
      </section>

      {/* Categories Section - White Background */}
      <section className="container mx-auto px-6 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Browse through our wide range of categories to find exactly what you're looking for</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden group border border-gray-200"
            >
              <div className="relative overflow-hidden h-48">
                <img
                  src={category.img}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transform transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="text-white text-sm">{category.items}</span>
                </div>
              </div>
              <div className="p-5 text-center">
                <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <button className="mt-3 text-blue-600 flex items-center justify-center w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Browse <FaArrowRight className="ml-1 text-sm" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section - Blue Background */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-16 border-y border-blue-700">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="p-6 transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-4xl font-bold mb-2">10,000+</h3>
              <p className="text-blue-200">Happy Customers</p>
            </div>
            <div className="p-6 transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-4xl font-bold mb-2">5,000+</h3>
              <p className="text-blue-200">Products Available</p>
            </div>
            <div className="p-6 transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-4xl font-bold mb-2">98%</h3>
              <p className="text-blue-200">Satisfaction Rate</p>
            </div>
            <div className="p-6 transform hover:scale-105 transition-transform duration-300">
              <h3 className="text-4xl font-bold mb-2">24/7</h3>
              <p className="text-blue-200">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - White Background with Dark Blue Cards */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose ReBuy</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">We provide the best experience for buying and selling second-hand goods</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-2 text-white"
              >
                <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:bg-blue-600 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">
                  {feature.title}
                </h3>
                <p className="text-blue-200">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - White Background */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Customers Say</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Hear from our satisfied customers about their experience with ReBuy</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                    <FaUserCircle className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                    <p className="text-blue-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Blue Background */}
      <section className="py-16 bg-gradient-to-r from-blue-800 to-blue-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Ready to Find Your Next Deal?</h2>
          <p className="text-blue-200 max-w-2xl mx-auto mb-8">Join thousands of satisfied customers who have found great products at amazing prices</p>
          <div className="flex flex-wrap justify-center gap-4">
            <button className="bg-white text-blue-800 px-8 py-4 rounded-full font-semibold shadow-lg hover:bg-gray-100 transition-all transform hover:-translate-y-1">
              Start Shopping Now
            </button>
            <button className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-800 transition-all transform hover:-translate-y-1">
              Become a Seller
            </button>
          </div>
        </div>
      </section>

      {/* Footer - Blue Background */}
      <footer className="bg-gradient-to-b from-blue-900 to-blue-950 text-white">
        <div className="container mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand section */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src={logoImg}
                alt="ReBuy.lk Logo"
                className="h-12 w-12 object-contain" // Removed circular border
              />
              <span className="text-2xl font-bold">ReBuy.lk</span>
            </div>
            <p className="text-blue-300 mb-4">
              Your trusted marketplace for second-hand goods. Buy, sell, and save!
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="#" className="text-blue-300 hover:text-white transition-colors">
                <FaTwitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-blue-300 hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/productListing" className="text-blue-300 hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/ContactUs" className="text-blue-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/AboutUs" className="text-blue-300 hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Categories</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-blue-300 hover:text-white transition-colors">Laptops & Computers</a></li>
              <li><a href="#" className="text-blue-300 hover:text-white transition-colors">Mobile Phones</a></li>
              <li><a href="#" className="text-blue-300 hover:text-white transition-colors">Televisions</a></li>
              <li><a href="#" className="text-blue-300 hover:text-white transition-colors">Other Electronics</a></li>
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
              <button className="bg-blue-700 hover:bg-blue-600 px-4 py-2 rounded-r-lg transition-colors">
                Subscribe
              </button>
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

      {/* Add some custom styles for animations */}
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 1s ease-out forwards;
          }
          .h-screen-80 {
            height: 80vh;
            min-height: 600px;
          }
        `}
      </style>
    </div>
  );
};

export default HomePage;