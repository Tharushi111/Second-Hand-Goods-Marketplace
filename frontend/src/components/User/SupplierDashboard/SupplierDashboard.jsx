import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SupplierOfferList from "./SupplierOfferList";
import { 
  FaBoxOpen, 
  FaExclamationTriangle, 
  FaCheckCircle, 
  FaClock,
  FaShippingFast,
  FaDollarSign,
  FaChartLine,
  FaReply,
  FaBell,
  FaCalendarAlt,
  FaTag
} from "react-icons/fa";

export default function SupplierDashboard() {
  const [activePage, setActivePage] = useState("supplierHome");
  const [supplier, setSupplier] = useState({
    username: "",
    email: "",
    company: "",
    phone: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [reorderRequests, setReorderRequests] = useState([]);
  const [replyText, setReplyText] = useState({});
  const [stats, setStats] = useState({
    totalRequests: 0,
    highPriority: 0,
    replied: 0,
    pending: 0
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch supplier profile
  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await axios.get("http://localhost:5001/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSupplier(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile");
      console.error("Profile fetch error:", error.response || error);
    } finally {
      setLoadingProfile(false);
    }
  };

  // Fetch reorder requests
  const fetchReorderRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/reorders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReorderRequests(res.data);
      
      // Calculate stats
      const highPriorityCount = res.data.filter(req => req.priority === "High").length;
      const repliedCount = res.data.filter(req => req.replies && req.replies.length > 0).length;
      
      setStats({
        totalRequests: res.data.length,
        highPriority: highPriorityCount,
        replied: repliedCount,
        pending: res.data.length - repliedCount
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch reorder requests");
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please log in first");
      navigate("/UserLogin");
      return;
    }
    fetchProfile();
    fetchReorderRequests();

    // Polling every 15 seconds to get updates
    const interval = setInterval(fetchReorderRequests, 15000);
    return () => clearInterval(interval);
  }, [token, navigate]);

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:5001/api/user/profile",
        { ...supplier },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Profile updated successfully");
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
      console.error("Update error:", error.response || error);
    }
  };

  // Delete account
  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account?")) return;
    try {
      await axios.delete("http://localhost:5001/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Account deleted successfully");
      localStorage.removeItem("token");
      navigate("/register");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
      console.error("Delete error:", error.response || error);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully");
    navigate("/UserLogin");
  };

  // Handle reply submission
  const handleReply = async (requestId) => {
    if (!replyText[requestId] || replyText[requestId].trim() === "") {
      toast.error("Reply cannot be empty");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5001/api/reorders/${requestId}/reply`,
        { reply: replyText[requestId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Reply sent successfully");
      setReplyText({ ...replyText, [requestId]: "" });
      fetchReorderRequests(); // Refresh to update stats
    } catch (err) {
      console.error(err);
      toast.error("Failed to send reply");
    }
  };

  // Get priority icon and color
  const getPriorityInfo = (priority) => {
    switch (priority) {
      case "High":
        return { icon: FaExclamationTriangle, color: "text-red-500", bg: "bg-red-50", border: "border-red-200" };
      case "Normal":
        return { icon: FaClock, color: "text-yellow-500", bg: "bg-yellow-50", border: "border-yellow-200" };
      case "Low":
        return { icon: FaCheckCircle, color: "text-green-500", bg: "bg-green-50", border: "border-green-200" };
      default:
        return { icon: FaClock, color: "text-gray-500", bg: "bg-gray-50", border: "border-gray-200" };
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg">
        <div className="flex items-center space-x-3">
        <img
            src="/ReBuy.png"
            alt="ReBuy.lk Logo"
            className="w-12 h-12 object-contain rounded-lg"
          />
          <h1 className="text-xl font-bold">ReBuy.lk Supplier Portal</h1>
        </div>
        {token && (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        )}
      </nav>

      {/* Main container */}
      <div className="flex flex-1 px-8 py-8 gap-8 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-xl border border-blue-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                  <span className="text-2xl font-bold text-white">
                    {supplier.username ? supplier.username.charAt(0).toUpperCase() : "S"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold truncate">{supplier.username || "Supplier"}</h3>
                  <p className="text-blue-100 text-sm truncate">{supplier.email || "supplier@example.com"}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-xs text-blue-200">Supplier Account</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="p-4">
              <nav className="space-y-2">
                <div
                  className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activePage === "supplierHome"
                      ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600 shadow-md"
                      : "text-gray-600 hover:bg-gray-50 hover:shadow-sm"
                  }`}
                  onClick={() => setActivePage("supplierHome")}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activePage === "supplierHome" ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <FaChartLine className={`w-5 h-5 ${activePage === "supplierHome" ? "text-blue-600" : "text-gray-400"}`} />
                  </div>
                  <div>
                    <span className="font-medium">Dashboard</span>
                    <p className="text-xs text-gray-400">Supplier overview</p>
                  </div>
                </div>

                <div
                  className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activePage === "profile"
                      ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600 shadow-md"
                      : "text-gray-600 hover:bg-gray-50 hover:shadow-sm"
                  }`}
                  onClick={() => setActivePage("profile")}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activePage === "profile" ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <FaBell className={`w-5 h-5 ${activePage === "profile" ? "text-blue-600" : "text-gray-400"}`} />
                  </div>
                  <div>
                    <span className="font-medium">Profile</span>
                    <p className="text-xs text-gray-400">Manage your account</p>
                  </div>
                </div>

                <div
                  className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activePage === "supplyOffers"
                      ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600 shadow-md"
                      : "text-gray-600 hover:bg-gray-50 hover:shadow-sm"
                  }`}
                  onClick={() => setActivePage("supplyOffers")}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activePage === "supplyOffers" ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <FaBoxOpen className={`w-5 h-5 ${activePage === "supplyOffers" ? "text-blue-600" : "text-gray-400"}`} />
                  </div>
                  <div>
                    <span className="font-medium">Supply Offers</span>
                    <p className="text-xs text-gray-400">Manage your offers</p>
                  </div>
                </div>
              </nav>

              {/* Stats */}
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Company</span>
                  <span className="text-sm font-bold text-blue-600 truncate">{supplier.company || "Not set"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Phone</span>
                  <span className="text-xs text-gray-500">{supplier.phone || "Not provided"}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Supplier Home - Enhanced Dashboard */}
          {activePage === "supplierHome" && (
            <div className="space-y-6">
              {/* Welcome Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold mb-2">Welcome back, {supplier.username || "Supplier"}! </h2>
                    <p className="text-blue-100">Here's what's happening with your reorder requests today</p>
                  </div>
                  <div className="bg-white/20 p-3 rounded-full">
                    <FaShippingFast className="w-8 h-8" />
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-lg border border-blue-100 p-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Requests</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">{stats.totalRequests}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <FaBoxOpen className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-green-600 font-medium">
                    <span>All active requests</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-red-100 p-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600">High Priority</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">{stats.highPriority}</p>
                    </div>
                    <div className="bg-red-100 p-3 rounded-full">
                      <FaExclamationTriangle className="w-6 h-6 text-red-600" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-red-600 font-medium">
                    <span>Requires immediate attention</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-green-100 p-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Replied</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">{stats.replied}</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <FaCheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-green-600 font-medium">
                    <span>Requests responded</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg border border-yellow-100 p-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pending</p>
                      <p className="text-2xl font-bold text-gray-800 mt-1">{stats.pending}</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <FaClock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-yellow-600 font-medium">
                    <span>Awaiting your response</span>
                  </div>
                </div>
              </div>

              {/* Reorder Requests Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Reorder Requests</h3>
                    <p className="text-gray-600">Manage incoming product requests from ReBuy</p>
                  </div>
                  <div className="bg-blue-50 px-3 py-1 rounded-full text-sm font-medium text-blue-600">
                    {reorderRequests.length} Active
                  </div>
                </div>

                {reorderRequests.length === 0 ? (
                  <div className="text-center py-12">
                    <FaBoxOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-500 mb-2">No reorder requests</h4>
                    <p className="text-gray-400">All requests are processed. Check back later for new opportunities.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reorderRequests.map((request) => {
                      const PriorityIcon = getPriorityInfo(request.priority).icon;
                      const priorityColor = getPriorityInfo(request.priority).color;
                      const priorityBg = getPriorityInfo(request.priority).bg;
                      const priorityBorder = getPriorityInfo(request.priority).border;
                      
                      return (
                        <div
                          key={request._id}
                          className={`border-l-4 ${priorityBorder} bg-gradient-to-r from-white to-blue-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-5`}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center space-x-3">
                              <div className={`p-2 rounded-lg ${priorityBg}`}>
                                <PriorityIcon className={`w-5 h-5 ${priorityColor}`} />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-800 text-lg">{request.title}</h4>
                                <div className="flex items-center space-x-4 mt-1">
                                  <span className="flex items-center text-sm text-gray-600">
                                    <FaTag className="w-3 h-3 mr-1 text-blue-500" />
                                    {request.category}
                                  </span>
                                  <span className="flex items-center text-sm text-gray-600">
                                    <FaDollarSign className="w-3 h-3 mr-1 text-green-500" />
                                    Qty: {request.quantity}
                                  </span>
                                  <span className="flex items-center text-sm text-gray-500">
                                    <FaCalendarAlt className="w-3 h-3 mr-1" />
                                    {new Date(request.createdAt).toLocaleDateString()}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${priorityBg} ${priorityColor}`}>
                              {request.priority} Priority
                            </span>
                          </div>
                          
                          <p className="text-gray-700 mb-4 pl-2 border-l-2 border-blue-200">{request.description}</p>

                          {/* Reply Section */}
                          <div className="bg-gray-50 rounded-lg p-4 mt-3">
                            <div className="flex items-center space-x-2 mb-3">
                              <FaReply className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium text-gray-700">Quick Reply</span>
                            </div>
                            <div className="flex flex-col md:flex-row gap-3">
                              <input
                                type="text"
                                placeholder="Type your offer or response..."
                                value={replyText[request._id] || ""}
                                onChange={(e) =>
                                  setReplyText({ ...replyText, [request._id]: e.target.value })
                                }
                                className="flex-1 border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                              />
                              <button
                                onClick={() => handleReply(request._id)}
                                className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                              >
                                Send Reply
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Profile Section */}
          {activePage === "profile" && (
            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Supplier Profile</h2>
              {loadingProfile ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <input
                      type="text"
                      value={supplier.username}
                      onChange={(e) => setSupplier({ ...supplier, username: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                    <input
                      type="email"
                      value={supplier.email}
                      onChange={(e) => setSupplier({ ...supplier, email: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                    <input
                      type="text"
                      value={supplier.company}
                      onChange={(e) => setSupplier({ ...supplier, company: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                    <input
                      type="text"
                      value={supplier.phone}
                      onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>
                  <input
                    type="text"
                    value={supplier.address}
                    onChange={(e) => setSupplier({ ...supplier, address: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your address"
                    required
                  />

                  <div className="flex justify-between pt-6 border-t border-gray-200">
                    <button type="submit" className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-8 py-3 rounded-xl hover:from-blue-600 hover:to-indigo-600 transition-all duration-200 shadow-md hover:shadow-lg">
                      Save Changes
                    </button>
                    <button type="button" onClick={handleDeleteAccount} className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-3 rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg">
                      Delete Account
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Supply Offers*/}
          {activePage === "supplyOffers" && (
            <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-6 w-full overflow-hidden">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Supply Offers</h2>
                <p className="text-gray-600">Manage your product supply offers</p>
              </div>
              <div className="w-full">
                <SupplierOfferList />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-400 to-indigo-400 shadow-lg p-4 text-center text-white">
        <div className="max-w-7xl mx-auto">
          &copy; 2025 ReBuy.lk Supplier Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}