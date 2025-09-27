// src/User/OrderConfirmation.js
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaPrint, FaEnvelope, FaHome, FaShoppingBag } from "react-icons/fa";
import Navbar from "../User/UserNavbar";
import Footer from "../User/UserFooter";

const OrderConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { orderId } = location.state || {};

  // If no order ID, redirect to home
  if (!orderId) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center py-8 px-4">
        <div className="max-w-2xl w-full">
          <div className="text-center bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-green-500 text-5xl" />
            </div>
            
            {/* Success Message */}
            <h1 className="text-4xl font-bold text-green-900 mb-4">
              Order Confirmed!
            </h1>
            <p className="text-green-700 text-lg mb-2">
              Thank you for your purchase!
            </p>
            <p className="text-gray-600 mb-8">
              Your order has been successfully placed and is being processed.
            </p>

            {/* Order Details */}
            <div className="bg-green-50 rounded-2xl p-6 mb-8 border border-green-200">
              <h2 className="text-2xl font-bold text-green-900 mb-4 flex items-center justify-center gap-2">
                <FaShoppingBag className="text-green-600" />
                Order Details
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-800 font-medium">Order ID:</span>
                  <span className="text-green-900 font-bold text-lg">#{orderId}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-800 font-medium">Status:</span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                    Confirmed
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-800 font-medium">Order Date:</span>
                  <span className="text-green-900">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-green-800 font-medium">Estimated Delivery:</span>
                  <span className="text-green-900">
                    {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">What's Next?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <FaEnvelope className="text-blue-500 text-2xl mx-auto mb-2" />
                  <p className="text-blue-800 text-sm">You'll receive an email confirmation shortly</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
                  <FaPrint className="text-yellow-500 text-2xl mx-auto mb-2" />
                  <p className="text-yellow-800 text-sm">Save your order details for reference</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-2xl border border-purple-200">
                  <FaShoppingBag className="text-purple-500 text-2xl mx-auto mb-2" />
                  <p className="text-purple-800 text-sm">Track your order in your account</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/productListing")}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:from-green-700 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <FaShoppingBag />
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/HomePage")}
                className="bg-gradient-to-r from-gray-100 to-blue-100 text-gray-800 px-8 py-3 rounded-full font-semibold hover:from-gray-200 hover:to-blue-200 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <FaHome />
                Go Home
              </button>
            </div>

            {/* Support Message */}
            <div className="mt-8 p-4 bg-gray-50 rounded-2xl border border-gray-200">
              <p className="text-gray-600 text-sm">
                Need help? Contact our support team at{" "}
                <a href="mailto:support@example.com" className="text-blue-600 hover:underline">
                  support@example.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmation;