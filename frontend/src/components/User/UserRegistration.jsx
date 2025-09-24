import React, { useState } from "react";
import Navbar from "./UserNavbar";
import Footer from "./UserFooter";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "buyer",
    company: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("http://localhost:5001/api/user/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Registration failed");

      setMessage({ type: "success", text: data.message });
      setFormData({
        username: "",
        email: "",
        password: "",
        role: "buyer",
        company: "",
        phone: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100">
      {/* Navbar at top */}
      <Navbar />

      {/* Registration card centered */}
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-blue-100/30">
          <div className="text-center">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Register
            </h2>
            <p className="mt-3 text-blue-600/80 font-medium">
              Create your account in seconds
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-10 space-y-6">
            {message && (
              <div
                className={`rounded-xl p-4 text-center font-medium shadow-lg border-l-4 ${
                  message.type === "success"
                    ? "bg-blue-50 text-blue-700 border-blue-500"
                    : "bg-red-50 text-red-700 border-red-500"
                }`}
              >
                <div className="flex items-center justify-center space-x-2">
                  <span>{message.text}</span>
                </div>
              </div>
            )}

            <div className="space-y-5">
              <div className="relative">
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                  required
                  className="block w-full pl-4 pr-4 py-3 border border-blue-200 rounded-2xl placeholder-blue-400/70 text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200/50 focus:border-blue-400 transition-all duration-300 bg-white/80"
                />
                <span className="absolute right-3 top-3 text-red-500 text-sm">*</span>
              </div>
              
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email address"
                  required
                  className="block w-full pl-4 pr-4 py-3 border border-blue-200 rounded-2xl placeholder-blue-400/70 text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200/50 focus:border-blue-400 transition-all duration-300 bg-white/80"
                />
                <span className="absolute right-3 top-3 text-red-500 text-sm">*</span>
              </div>
              
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  minLength={6}
                  className="block w-full pl-4 pr-4 py-3 border border-blue-200 rounded-2xl placeholder-blue-400/70 text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200/50 focus:border-blue-400 transition-all duration-300 bg-white/80"
                />
                <span className="absolute right-3 top-3 text-red-500 text-sm">*</span>
              </div>
              
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="block w-full pl-4 pr-4 py-3 border border-blue-200 rounded-2xl text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200/50 focus:border-blue-400 transition-all duration-300 appearance-none bg-white/80"
                >
                  <option value="buyer">Buyer</option>
                  <option value="supplier">Supplier</option>
                </select>
                <span className="absolute right-3 top-3 text-red-500 text-sm">*</span>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  required
                  className="block w-full pl-4 pr-4 py-3 border border-blue-200 rounded-2xl placeholder-blue-400/70 text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200/50 focus:border-blue-400 transition-all duration-300 bg-white/80"
                />
                <span className="absolute right-3 top-3 text-red-500 text-sm">*</span>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                  className="block w-full pl-4 pr-4 py-3 border border-blue-200 rounded-2xl placeholder-blue-400/70 text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200/50 focus:border-blue-400 transition-all duration-300 bg-white/80"
                />
                <span className="absolute right-3 top-3 text-red-500 text-sm">*</span>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  required
                  className="block w-full pl-4 pr-4 py-3 border border-blue-200 rounded-2xl placeholder-blue-400/70 text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200/50 focus:border-blue-400 transition-all duration-300 bg-white/80"
                />
                <span className="absolute right-3 top-3 text-red-500 text-sm">*</span>
              </div>
              
              {formData.role === "buyer" && (
                <div className="relative">
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Postal Code"
                    required
                    className="block w-full pl-4 pr-4 py-3 border border-blue-200 rounded-2xl placeholder-blue-400/70 text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200/50 focus:border-blue-400 transition-all duration-300 bg-white/80"
                  />
                  <span className="absolute right-3 top-3 text-red-500 text-sm">*</span>
                </div>
              )}
              
              {formData.role === "supplier" && (
                <div className="space-y-5 border-l-4 border-blue-300 pl-4 ml-2 bg-blue-50/50 p-4 rounded-2xl">
                  <div className="relative">
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Company Name"
                      required
                      className="block w-full pl-4 pr-4 py-3 border border-blue-200 rounded-2xl placeholder-blue-400/70 text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200/50 focus:border-blue-400 transition-all duration-300 bg-white/80"
                    />
                    <span className="absolute right-3 top-3 text-red-500 text-sm">*</span>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone (+947XXXXXXXX)"
                      required
                      className="block w-full pl-4 pr-4 py-3 border border-blue-200 rounded-2xl placeholder-blue-400/70 text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200/50 focus:border-blue-400 transition-all duration-300 bg-white/80"
                    />
                    <span className="absolute right-3 top-3 text-red-500 text-sm">*</span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-sm text-blue-600/70 text-center">
              <span className="text-red-500">*</span> Required fields
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-lg font-bold rounded-2xl text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 shadow-2xl disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Get Started"}
            </button>
          </form>

          <div className="text-center mt-8">
            <p className="text-blue-600/70 text-sm">
              Already have an account?{" "}
              <a href="/UserLogin" className="font-semibold text-blue-700 hover:text-blue-900">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Footer at bottom */}
      <Footer />
    </div>
  );
}