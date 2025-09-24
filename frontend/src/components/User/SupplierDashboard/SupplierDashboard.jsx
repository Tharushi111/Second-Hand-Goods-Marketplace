import React, { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function SupplierDashboard() {
  const [activePage, setActivePage] = useState("supplierHome");
  const [supplier, setSupplier] = useState({
    username: "",
    email: "",
    company: "",
    phone: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

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

  useEffect(() => {
    if (!token) {
      toast.error("Please log in first");
      navigate("/UserLogin");
      return;
    }
    fetchProfile();
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

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Toaster position="top-center" />

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white shadow-md">
        <div className="flex items-center space-x-3">
          <img
            src="/ReBuy.png"
            alt="ReBuy.lk Logo"
            className="w-12 h-12 object-contain rounded-lg"
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
      </nav>


      {/* Main container */}
      <div className="flex flex-1 px-8 py-8 gap-8 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <aside className="w-80 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
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
                      ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setActivePage("supplierHome")}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activePage === "supplierHome" ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <svg className={`w-5 h-5 ${activePage === "supplierHome" ? "text-blue-600" : "text-gray-400"}`} 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Dashboard</span>
                    <p className="text-xs text-gray-400">Supplier overview</p>
                  </div>
                </div>

                <div
                  className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activePage === "profile"
                      ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setActivePage("profile")}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activePage === "profile" ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <svg className={`w-5 h-5 ${activePage === "profile" ? "text-blue-600" : "text-gray-400"}`} 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Profile</span>
                    <p className="text-xs text-gray-400">Manage your account</p>
                  </div>
                </div>

                <div
                  className={`flex items-center space-x-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                    activePage === "supplyOffers"
                      ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setActivePage("supplyOffers")}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activePage === "supplyOffers" ? "bg-blue-100" : "bg-gray-100"
                  }`}>
                    <svg className={`w-5 h-5 ${activePage === "supplyOffers" ? "text-blue-600" : "text-gray-400"}`} 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <span className="font-medium">Supply Offers</span>
                    <p className="text-xs text-gray-400">Manage your offers</p>
                  </div>
                </div>
              </nav>

              {/* Stats */}
              <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
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
          {/* Supplier Home */}
          {activePage === "supplierHome" && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Supplier Dashboard</h2>
              <p className="text-gray-600 mb-6">Welcome to your supplier management portal</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-xl p-6 border border-blue-200 text-center">
                  <p className="text-sm font-medium text-blue-700">Total Offers</p>
                  <p className="text-2xl font-bold text-blue-900">0</p>
                </div>
                <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center">
                  <p className="text-sm font-medium text-green-700">Active Offers</p>
                  <p className="text-2xl font-bold text-green-900">0</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200 text-center">
                  <p className="text-sm font-medium text-purple-700">Pending</p>
                  <p className="text-2xl font-bold text-purple-900">0</p>
                </div>
              </div>
            </div>
          )}

          {/* Profile */}
          {activePage === "profile" && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
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
                  {/* Address */}
                  <input
                    type="text"
                    value={supplier.address}
                    onChange={(e) => setSupplier({ ...supplier, address: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your address"
                    required
                  />

                  <div className="flex justify-between pt-6 border-t border-gray-200">
                    <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl hover:bg-blue-700">
                      Save Changes
                    </button>
                    <button type="button" onClick={handleDeleteAccount} className="bg-red-600 text-white px-8 py-3 rounded-xl hover:bg-red-700">
                      Delete Account
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Supply Offers */}
          {activePage === "supplyOffers" && (
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Supply Offers</h2>
              <p className="text-gray-600 mb-6">This feature is coming soon!</p>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="shadow p-4 text-center mt-auto bg-blue-200 text-blue-900">
        &copy; 2025 ReBuy.lk. All rights reserved.
      </footer>
    </div>
  );
}
