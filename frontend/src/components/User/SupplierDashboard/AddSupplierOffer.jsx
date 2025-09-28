import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function AddSupplierOffer() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pricePerUnit: "",
    quantityOffered: "",
    deliveryDate: ""
  });

  const [displayPrice, setDisplayPrice] = useState("");
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!token) {
      toast.error("Please login to access this page.");
      navigate("/UserLogin");
    }
  }, [token, navigate]);

  // Format price with thousand separators and two decimal places
  const formatPrice = (value) => {
    // Remove all non-digit characters except decimal point
    const cleanValue = value.replace(/[^\d.]/g, '');
    
    // Split into integer and decimal parts
    const parts = cleanValue.split('.');
    let integerPart = parts[0];
    let decimalPart = parts[1] || '';
    
    // Format integer part with thousand separators
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Limit decimal part to 2 digits
    if (decimalPart.length > 2) {
      decimalPart = decimalPart.substring(0, 2);
    }
    
    // Combine parts
    if (decimalPart) {
      return `${integerPart}.${decimalPart}`;
    }
    return integerPart;
  };

  // Parse formatted price back to raw number for form data
  const parsePrice = (formattedValue) => {
    return formattedValue.replace(/,/g, '');
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    
    // Allow empty value or format the input
    if (value === "") {
      setDisplayPrice("");
      setFormData(prev => ({ ...prev, pricePerUnit: "" }));
      setErrors(prev => ({ ...prev, pricePerUnit: "" }));
      return;
    }
    
    const formattedValue = formatPrice(value);
    setDisplayPrice(formattedValue);
    
    // Update form data with raw numeric value (without commas)
    const rawValue = parsePrice(formattedValue);
    setFormData(prev => ({ ...prev, pricePerUnit: rawValue }));
    setErrors(prev => ({ ...prev, pricePerUnit: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Use special handler for price field
    if (name === "pricePerUnit") {
      handlePriceChange(e);
      return;
    }
    
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (formData.pricePerUnit === "" || Number(formData.pricePerUnit) < 0)
      newErrors.pricePerUnit = "Price must be ≥ 0";
    if (formData.quantityOffered === "" || Number(formData.quantityOffered) < 1)
      newErrors.quantityOffered = "Quantity must be ≥ 1";
    if (formData.deliveryDate && new Date(formData.deliveryDate) < new Date())
      newErrors.deliveryDate = "Delivery date cannot be in the past";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const token = localStorage.getItem("token"); 
      const response = await axios.post(
        "http://localhost:5001/api/offer/", 
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Offer submitted successfully!", { 
        onClose: () => navigate("/SupplierDashboard") 
      });

      setFormData({ title: "", description: "", pricePerUnit: "", quantityOffered: "", deliveryDate: "" });
      setDisplayPrice("");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error submitting offer");
    }
  };

  const handleClose = () => {
    navigate("/SupplierDashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/UserLogin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      
      {/* Navbar - Fixed at top */}
      <nav className="w-full bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <img
                src="/ReBuy.png"
                alt="ReBuy.lk Logo"
                className="w-10 h-10 object-contain rounded-lg"
              />
              <h1 className="text-xl font-bold">ReBuy.lk</h1>
            </div>
            {token && (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition-all duration-200"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content - Centered with proper spacing */}
      <main className="flex-1 flex justify-center items-start py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-2xl rounded-2xl p-6 sm:p-8 w-full max-w-md border border-blue-200 transform hover:shadow-blue-200/50 transition-all duration-300 relative">
          
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-blue-400 hover:text-blue-600 transition-colors duration-200 p-2 rounded-full hover:bg-blue-50"
            title="Close"
          >
            <FaTimes className="text-xl" />
          </button>

          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Add Supplier Offer
            </h2>
            <p className="text-blue-600 mt-2 text-sm sm:text-base">Fill in the details below to create your offer</p>
          </div>
          
          <form onSubmit={handleSubmit} noValidate>
            {/* Title */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-blue-900 text-sm sm:text-base">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 text-sm sm:text-base ${
                  errors.title 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                    : "border-blue-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
                placeholder="Enter offer title"
              />
              {errors.title && <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.title}
              </p>}
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-blue-900 text-sm sm:text-base">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className={`w-full px-3 sm:px-4 py-2 sm:py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 text-sm sm:text-base ${
                  errors.description 
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                    : "border-blue-200 focus:border-blue-500 focus:ring-blue-100"
                }`}
                placeholder="Describe your offer in detail"
              />
              {errors.description && <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.description}
              </p>}
            </div>

            {/* Price */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-blue-900 text-sm sm:text-base">
                Price per Unit (Rs.) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-semibold text-sm sm:text-base">Rs</span>
                <input
                  type="text"
                  name="pricePerUnit"
                  value={displayPrice}
                  onChange={handlePriceChange}
                  className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 text-sm sm:text-base ${
                    errors.pricePerUnit 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                      : "border-blue-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.pricePerUnit && <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.pricePerUnit}
              </p>}
            </div>

            {/* Quantity */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-blue-900 text-sm sm:text-base">
                Quantity Offered <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-blue-600 font-semibold text-sm sm:text-base">#</span>
                <input
                  type="number"
                  name="quantityOffered"
                  value={formData.quantityOffered}
                  onChange={handleChange}
                  className={`w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 text-sm sm:text-base ${
                    errors.quantityOffered 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                      : "border-blue-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                  placeholder="Enter quantity"
                  min="1"
                />
              </div>
              {errors.quantityOffered && <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.quantityOffered}
              </p>}
            </div>

            {/* Delivery Date */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-blue-900 text-sm sm:text-base">Delivery Date (Optional)</label>
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-blue-600">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                  className={`w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-3 border-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-4 text-sm sm:text-base ${
                    errors.deliveryDate 
                      ? "border-red-500 focus:border-red-500 focus:ring-red-100" 
                      : "border-blue-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                />
              </div>
              {errors.deliveryDate && <p className="text-red-500 text-xs sm:text-sm mt-1 flex items-center">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {errors.deliveryDate}
              </p>}
            </div>

            <div className="flex space-x-3 sm:space-x-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-3 sm:py-4 sm:px-4 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-3 sm:py-4 sm:px-4 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                Submit Offer
                <svg className="w-4 h-4 sm:w-5 sm:h-5 inline-block ml-1 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer - Fixed at bottom */}
      <footer className="bg-blue-200 text-blue-900 shadow-md mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center">
            <p className="text-sm sm:text-base">&copy; 2025 ReBuy.lk. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}