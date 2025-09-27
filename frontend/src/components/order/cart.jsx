import React, { useEffect, useState } from "react";
import { FaPlus, FaMinus, FaTimes, FaShoppingBag, FaArrowLeft, FaCreditCard, FaShoppingCart, FaTag, FaShippingFast } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../User/UserNavbar";
import Footer from "../User/UserFooter";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animating, setAnimating] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // Fetch cart from backend
  const fetchCart = async () => {
    if (!token) {
      navigate("/UserLogin");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5001/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data.items || []);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      if (err.response?.status === 401) navigate("/UserLogin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (_id, newQty) => {
    if (!token || newQty < 1) return;
    try {
      setAnimating(_id);
      await axios.put(
        `http://localhost:5001/api/cart/update/${_id}`,
        { quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchCart();
      setTimeout(() => setAnimating(null), 300);
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (_id) => {
    if (!token) return;
    try {
      setAnimating(_id);
      await axios.delete(`http://localhost:5001/api/cart/remove/${_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const shippingFee = total > 5000 ? 0 : 250;
  const finalTotal = total + shippingFee;

  const formatPrice = (price) =>
    price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-700 text-lg font-medium">Loading your cart...</p>
          <p className="text-blue-500 text-sm mt-2">Please wait while we fetch your items</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 bg-white/80 px-6 py-3 rounded-full shadow-lg border border-blue-100 mb-4">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-full">
                <FaShoppingCart className="text-white text-lg" />
              </div>
              <span className="text-blue-800 font-semibold">Shopping Cart</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent mb-2">
              Your Shopping Journey
            </h1>
            <p className="text-blue-600 max-w-md mx-auto">
              {cart.length > 0 ? `You have ${itemsCount} amazing item${itemsCount !== 1 ? 's' : ''} in your cart` : 'Your cart is waiting to be filled'}
            </p>
          </div>

          {/* Main Content */}
          {cart.length === 0 ? (
            /* Empty Cart State - Centered on the page */
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-100 p-12 text-center max-w-md w-full mx-4">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <FaShoppingBag className="text-blue-400 text-5xl" />
                </div>
                <h2 className="text-3xl font-bold text-blue-900 mb-4">Your Cart Feels Lonely</h2>
                <p className="text-blue-600 mb-8 text-lg">Discover amazing products and fill your cart with happiness!</p>
                <button
                  onClick={() => navigate("/productListing")}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl duration-300"
                >
                  Explore Products
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items Section */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.product}
                      className={`bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-blue-100 p-6 transition-all duration-300 ${
                        animating === item.product ? 'scale-95 opacity-60' : 'hover:shadow-xl hover:scale-[1.02]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="relative">
                            <img
                              src={`http://localhost:5001/${item.image}`}
                              alt={item.name}
                              className="w-24 h-24 object-cover rounded-xl shadow-md border-2 border-blue-100"
                            />
                            <div className="absolute -top-2 -right-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow-lg">
                              {item.quantity}
                            </div>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-blue-900 text-xl mb-2">{item.name}</h3>
                            <div className="flex items-center gap-4">
                              <span className="text-blue-700 font-semibold text-lg">Rs. {formatPrice(item.price)}</span>
                              <span className="text-green-600 font-bold text-lg">Rs. {formatPrice(item.price * item.quantity)}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 bg-blue-50 rounded-full p-2 border border-blue-200">
                            <button
                              onClick={() => updateQuantity(item.product, item.quantity - 1)}
                              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-blue-100 transition-all duration-200 border border-blue-200"
                            >
                              <FaMinus className="text-blue-600" />
                            </button>
                            <span className="text-blue-900 font-bold min-w-[30px] text-center text-lg">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product, item.quantity + 1)}
                              className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-blue-100 transition-all duration-200 border border-blue-200"
                            >
                              <FaPlus className="text-blue-600" />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => removeItem(item.product)}
                            className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center hover:bg-red-100 transition-all duration-200 border border-red-200 group"
                          >
                            <FaTimes className="text-red-500 group-hover:text-red-700 transition-colors" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary Section */}
              <div className="lg:col-span-1">
                <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-100 p-6 sticky top-6">
                  <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-2">
                    <FaTag className="text-blue-500" />
                    Order Summary
                  </h3>

                  {/* Pricing Breakdown */}
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700">Subtotal ({itemsCount} items)</span>
                      <span className="text-blue-900 font-semibold">Rs. {formatPrice(total)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-blue-700 flex items-center gap-2">
                        <FaShippingFast className="text-blue-500" />
                        Shipping
                      </span>
                      <span className={shippingFee === 0 ? "text-green-600 font-semibold" : "text-blue-900 font-semibold"}>
                        {shippingFee === 0 ? "FREE" : `Rs. ${formatPrice(shippingFee)}`}
                      </span>
                    </div>

                    {shippingFee === 0 && (
                      <div className="text-green-600 text-sm bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                        🎉 Free shipping on orders over Rs. 5,000!
                      </div>
                    )}

                    <div className="border-t border-blue-200 pt-4">
                      <div className="flex justify-between items-center text-xl">
                        <span className="text-blue-900 font-bold">Total Amount</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent">
                          Rs. {formatPrice(finalTotal)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <button
                      onClick={() => navigate("/checkout")}
                      className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl duration-300 flex items-center justify-center gap-3"
                    >
                      <FaCreditCard />
                      Proceed to Checkout
                    </button>
                    
                    <button
                      onClick={() => navigate("/productListing")}
                      className="w-full bg-gradient-to-r from-blue-100 to-cyan-100 hover:from-blue-200 hover:to-cyan-200 text-blue-800 py-3 px-6 rounded-xl font-semibold transition-all duration-300 border border-blue-200 flex items-center justify-center gap-3"
                    >
                      <FaShoppingBag />
                      Continue Shopping
                    </button>
                  </div>

                  {/* Security Badge */}
                  <div className="mt-6 pt-6 border-t border-blue-200 text-center">
                    <div className="inline-flex items-center gap-2 text-blue-600 text-sm">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      Secure checkout • SSL encrypted
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Back Button - Only show when cart has items */}
          {cart.length > 0 && (
            <div className="text-center mt-8">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 bg-white/80 hover:bg-white text-blue-700 hover:text-blue-900 px-6 py-3 rounded-full font-medium transition-all duration-300 border border-blue-200 shadow-lg hover:shadow-xl"
              >
                <FaArrowLeft />
                Back to Previous Page
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Cart;