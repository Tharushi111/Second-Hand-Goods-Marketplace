import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import Navbar from "./UserNavbar";
import Footer from "./UserFooter";
import OrderHistory from "../order/OrderHistory";

export default function BuyerDashboard() {
  const [activePage, setActivePage] = useState("profile");
  const [user, setUser] = useState({
    username: "",
    email: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch buyer profile
  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const res = await axios.get("http://localhost:5001/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load profile");
      console.error("Profile fetch error:", error.response || error);
    } finally {
      setLoadingProfile(false);
    }
  };

  useEffect(() => {
    if (!token) {
      toast.error("Please log in first");
      navigate("/UserLogin");
      return;
    }
    fetchProfile();
  }, [token]);

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        "http://localhost:5001/api/user/profile",
        { ...user },
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
      const res = await axios.delete("http://localhost:5001/api/user/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(res.data.message || "Account deleted successfully");
      localStorage.removeItem("token");
      navigate("/register");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
      console.error("Delete error:", error.response || error);
    }
  };

  // Render the active page content
  const renderActivePage = () => {
    switch (activePage) {
      case "profile":
        return (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Profile Settings</h2>
                <p className="text-gray-600">Manage your account information and preferences</p>
              </div>
            </div>

            {loadingProfile ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={user.username}
                      onChange={(e) => setUser({ ...user, username: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={user.email}
                      onChange={(e) => setUser({ ...user, email: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <input
                      type="text"
                      placeholder="Enter your street address"
                      value={user.address}
                      onChange={(e) => setUser({ ...user, address: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={user.city}
                      onChange={(e) => setUser({ ...user, city: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                    <input
                      type="text"
                      value={user.country}
                      onChange={(e) => setUser({ ...user, country: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input
                      type="text"
                      value={user.postalCode}
                      onChange={(e) => setUser({ ...user, postalCode: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div className="flex justify-between pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all duration-200"
                  >
                    Delete Account
                  </button>
                </div>
              </form>
            )}
          </div>
        );

      case "orderHistory":
        return <OrderHistory />;

      default:
        return (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to Your Dashboard</h2>
              <p className="text-gray-600">Select an option from the sidebar to get started</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Toast Container - Top Center */}
      <ToastContainer 
        position="top-center"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{
          top: '80px', 
          zIndex: 9999
        }}
      />

      <div className="flex flex-1 px-8 py-8 gap-8 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/30">
                  <span className="text-2xl font-bold text-white">
                    {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold truncate">{user.username || "User"}</h3>
                  <p className="text-blue-100 text-sm truncate">{user.email || "user@example.com"}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    <span className="text-xs text-blue-200">Online</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4">
              <nav className="space-y-2">
                <div
                  className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activePage === "profile"
                      ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setActivePage("profile")}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activePage === "profile" ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${activePage === "profile" ? "text-blue-600" : "text-gray-400"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Profile</span>
                    <p className="text-xs text-gray-400">Manage your account</p>
                  </div>
                </div>

                {/* Order History Sidebar Item */}
                <div
                  className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activePage === "orderHistory"
                      ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setActivePage("orderHistory")}
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activePage === "orderHistory" ? "bg-blue-100" : "bg-gray-100"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${activePage === "orderHistory" ? "text-blue-600" : "text-gray-400"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                      />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Order History</span>
                    <p className="text-xs text-gray-400">View your past orders</p>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {renderActivePage()}
        </main>
      </div>

      <Footer />
    </div>
  );
}