import React, { useEffect, useState } from "react";
import { FaHome, FaStore, FaMapMarkerAlt, FaCreditCard, FaMoneyBillWave, FaUpload, FaShoppingBag, FaShippingFast, FaLock, FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../User/UserNavbar";
import Footer from "../User/UserFooter";
import { toast } from "react-hot-toast";

const Checkout = () => {
  const [cart, setCart] = useState([]);
  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [slipFile, setSlipFile] = useState(null);
  const [slipPreview, setSlipPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");

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
      console.log("Cart data:", res.data);
      setCart(res.data.items || []);
      
      // Fetch user data
      try {
        const userRes = await axios.get("http://localhost:5001/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);
        setAddress(userRes.data.address || "");
      } catch (userErr) {
        console.error("Failed to fetch user data:", userErr);
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      if (err.response?.status === 401) navigate("/UserLogin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if coming from Buy Now with single product
    if (location.state && location.state.product) {
      const { product, quantity = 1 } = location.state;
      // Create a temporary cart with the single product
      const singleProductCart = [{
        ...product,
        quantity: quantity,
        name: product.stock?.name || product.description,
        price: product.price
      }];
      setCart(singleProductCart);
      
      // Fetch user data only
      if (token) {
        axios.get("http://localhost:5001/api/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then(userRes => {
          setUser(userRes.data);
          setAddress(userRes.data.address || "");
        })
        .catch(userErr => {
          console.error("Failed to fetch user data:", userErr);
        });
      }
      
      setLoading(false);
    } else {
      // Normal cart checkout
      fetchCart();
    }
  }, [location.state]);

  const handleSlipChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.match('image.*') && file.type !== 'application/pdf') {
      toast.error('Please upload an image or PDF file');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size should be less than 5MB');
      return;
    }
    
    setSlipFile(file);
    setSlipPreview(file.type.match('image.*') ? URL.createObjectURL(file) : null);
  };

  const handlePlaceOrder = async () => {
    if (!token) {
      toast.error("Please login first.");
      navigate("/UserLogin");
      return;
    }
    
    if (cart.length === 0) {
      toast.error("Your cart is empty. Please add items before checkout.");
      navigate("/cart");
      return;
    }
    
    if (deliveryMethod === "different" && !address.trim()) {
      toast.error("Please enter delivery address");
      return;
    }
    
    if (paymentMethod === "bank" && !slipFile) {
      toast.error("Please upload payment slip");
      return;
    }

    try {
      setLoading(true);
      
      // Check if it's a single product order (Buy Now)
      const isSingleProduct = location.state && location.state.product;
      
      if (isSingleProduct) {
        // For single product, first add it to cart
        const product = location.state.product;
        const quantity = location.state.quantity || 1;
        
        try {
          await axios.post(
            "http://localhost:5001/api/cart/add",
            { productId: product._id, quantity: quantity },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (addToCartError) {
          console.error("Failed to add product to cart:", addToCartError);
          // Continue with order even if adding to cart fails
        }
      }

      // Prepare the data according to your backend expectations
      const orderData = {
        deliveryMethod: deliveryMethod,
        notes: notes,
        paymentMethod: paymentMethod,
        address: deliveryMethod === "different" ? {
          line1: address,
          city: user?.city || "",
          postalCode: user?.postalCode || "",
          country: user?.country || "Sri Lanka"
        } : undefined
      };

      console.log("Sending order data:", orderData);

      const res = await axios.post("http://localhost:5001/api/checkout/place", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // If payment method is bank and slip file exists, upload slip separately
      if (paymentMethod === "bank" && slipFile) {
        try {
          const slipFormData = new FormData();
          slipFormData.append("slip", slipFile);
          
          await axios.post(`http://localhost:5001/api/checkout/upload-slip/${res.data.orderId}`, slipFormData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          console.log("Slip uploaded successfully");
        } catch (slipError) {
          console.error("Failed to upload slip:", slipError);
          // Continue with order even if slip upload fails
        }
      }

      toast.success("🎉 Order placed successfully! Order ID: " + res.data.orderId);
      
      // Clear cart and navigate to confirmation
      localStorage.removeItem("cart"); 
      navigate("/order-confirmation", { 
        state: { 
          orderId: res.data.orderId,
          orderNumber: res.data.orderNumber,
          status: res.data.status,
          total: res.data.total
        } 
      });
    } catch (err) {
      console.error("Failed to place order:", err);
      console.error("Error details:", err.response?.data);
      toast.error("Failed to place order: " + (err.response?.data?.message));
    } finally {
      setLoading(false);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharge = deliveryMethod === "store" ? 0 : 1300;
  const total = subtotal + deliveryCharge;

  const formatPrice = (price) =>
    price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  if (loading && cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-blue-800 text-lg">Loading checkout...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cart.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center py-8 px-4">
          <div className="text-center bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-12 max-w-md mx-4">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaShoppingBag className="text-blue-400 text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Your cart is empty</h2>
            <p className="text-blue-600 mb-8">Add some items to your cart before checkout</p>
            <button
              onClick={() => navigate("/cart")}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-105 shadow-lg mr-4"
            >
              View Cart
            </button>
            <button
              onClick={() => navigate("/productListing")}
              className="bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 px-8 py-3 rounded-full font-semibold hover:from-blue-200 hover:to-cyan-200 transition-all transform hover:scale-105 shadow-lg"
            >
              Continue Shopping
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">

      <Navbar />
      <div className="flex-grow py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center gap-2 text-blue-700 hover:text-blue-900 transition-colors font-medium mb-4"
            >
              <FaArrowLeft />
              Back to Cart
            </button>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent mb-2">
              Checkout
            </h1>
            <p className="text-blue-600">Complete your purchase securely</p>
            <div className="mt-2 text-sm text-blue-500">
              {cart.length} item{cart.length !== 1 ? 's' : ''} in your cart
              {location.state && location.state.product && (
                <span className="ml-2 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  Quick Buy
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Method Card */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-100 p-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                  <FaShippingFast className="text-blue-500" />
                  Delivery Method
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {[
                    { value: "home", icon: FaHome, label: "Home Delivery", desc: "Deliver to my address" },
                    { value: "different", icon: FaMapMarkerAlt, label: "Different Address", desc: "Deliver to another location" },
                    { value: "store", icon: FaStore, label: "Store Pickup", desc: "Pick up from nearest store" }
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        deliveryMethod === option.value
                          ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                          : "border-blue-200 bg-white hover:border-blue-300 hover:shadow-md"
                      }`}
                      onClick={() => setDeliveryMethod(option.value)}
                    >
                      <option.icon className={`text-2xl mb-2 ${
                        deliveryMethod === option.value ? "text-blue-600" : "text-blue-400"
                      }`} />
                      <h3 className="font-semibold text-blue-900">{option.label}</h3>
                      <p className="text-blue-600 text-sm mt-1">{option.desc}</p>
                    </div>
                  ))}
                </div>

                {deliveryMethod === "different" && (
                  <div className="mt-4">
                    <label className="block text-blue-700 font-medium mb-2">Delivery Address</label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter full delivery address including city and postal code..."
                      className="w-full p-4 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none"
                      rows="3"
                    />
                  </div>
                )}

                {deliveryMethod === "home" && user?.address && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                    <p className="text-blue-700 font-medium">Delivery to your address:</p>
                    <p className="text-blue-900">{user.address}</p>
                  </div>
                )}

                {/* Order Notes */}
                <div className="mt-6">
                  <label className="block text-blue-700 font-medium mb-2">Order Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any special instructions for your order..."
                    className="w-full p-4 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 resize-none"
                    rows="2"
                  />
                </div>
              </div>

              {/* Payment Method Card */}
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-100 p-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                  <FaLock className="text-blue-500" />
                  Payment Method
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {[
                    { value: "online", icon: FaCreditCard, label: "Online Payment", desc: "Pay securely online" },
                    { value: "bank", icon: FaMoneyBillWave, label: "Bank Transfer", desc: "Upload payment slip" }
                  ].map((option) => (
                    <div
                      key={option.value}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                        paymentMethod === option.value
                          ? "border-blue-500 bg-blue-50 shadow-lg scale-105"
                          : "border-blue-200 bg-white hover:border-blue-300 hover:shadow-md"
                      }`}
                      onClick={() => setPaymentMethod(option.value)}
                    >
                      <option.icon className={`text-2xl mb-2 ${
                        paymentMethod === option.value ? "text-blue-600" : "text-blue-400"
                      }`} />
                      <h3 className="font-semibold text-blue-900">{option.label}</h3>
                      <p className="text-blue-600 text-sm mt-1">{option.desc}</p>
                    </div>
                  ))}
                </div>

                {paymentMethod === "bank" && (
                  <div className="mt-4">
                    <label className="block text-blue-700 font-medium mb-2">Upload Payment Slip</label>
                    <div className="border-2 border-dashed border-blue-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors duration-300">
                      <input
                        type="file"
                        onChange={handleSlipChange}
                        accept="image/*,application/pdf"
                        className="hidden"
                        id="slip-upload"
                      />
                      <label htmlFor="slip-upload" className="cursor-pointer">
                        <FaUpload className="text-blue-400 text-3xl mx-auto mb-2" />
                        <p className="text-blue-700 font-medium">Click to upload slip</p>
                        <p className="text-blue-600 text-sm">PNG, JPG, or PDF (Max 5MB)</p>
                      </label>
                    </div>
                    
                    {slipPreview && (
                      <div className="mt-4">
                        <p className="text-blue-700 font-medium mb-2">Slip Preview:</p>
                        <img src={slipPreview} alt="Slip Preview" className="w-48 rounded-xl border-2 border-blue-200 shadow-md" />
                      </div>
                    )}
                    
                    {slipFile && !slipPreview && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-2xl border border-blue-200">
                        <p className="text-blue-700 font-medium">PDF file uploaded: {slipFile.name}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-100 p-6 sticky top-6">
                <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
                  <FaShoppingBag className="text-blue-500" />
                  Order Summary
                </h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item, index) => (
                    <div key={item.product || item._id || index} className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl">
                      <img
                        src={`http://localhost:5001/${item.image}`}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-xl"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/50x50?text=No+Image';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 text-sm">{item.name}</h4>
                        <p className="text-blue-600 text-xs">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-blue-900">Rs. {formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing Breakdown */}
                <div className="space-y-3 border-t border-blue-200 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Subtotal</span>
                    <span className="text-blue-900 font-semibold">Rs. {formatPrice(subtotal)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">Delivery</span>
                    <span className={deliveryCharge === 0 ? "text-green-600 font-semibold" : "text-blue-900 font-semibold"}>
                      {deliveryCharge === 0 ? "FREE" : `Rs. ${formatPrice(deliveryCharge)}`}
                    </span>
                  </div>

                  {deliveryCharge === 0 && (
                    <div className="text-green-600 text-sm bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                      🎉 Free delivery for store pickup!
                    </div>
                  )}

                  <div className="border-t border-blue-200 pt-3">
                    <div className="flex justify-between items-center text-xl">
                      <span className="text-blue-900 font-bold">Total</span>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-900 to-cyan-700 bg-clip-text text-transparent">
                        Rs. {formatPrice(total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 disabled:scale-100 shadow-lg hover:shadow-xl duration-300 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FaLock />
                      Place Order Securely
                    </>
                  )}
                </button>

                {/* Security Badge */}
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 text-blue-600 text-sm">
                    <FaLock className="text-green-500" />
                    100% Secure • SSL Encrypted
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;