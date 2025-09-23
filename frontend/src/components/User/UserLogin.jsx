import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Eye, EyeOff, Mail, Lock, Loader, User, ArrowRight, Shield, LogIn } from "lucide-react";

const UserLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields", { position: "top-center" });
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:5001/api/user/login",
        formData
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success(`Welcome back! Redirecting to ${data.role} dashboard...`, {
        position: "top-center",
        duration: 2000,
      });

      setTimeout(() => {
        navigate(data.role === "supplier" ? "/SupplierDashboard" : "/BuyerDashboard");
      }, 1500);

    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      toast.error(errorMessage, { 
        position: "top-center",
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 px-4 py-8">
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1e40af',
            color: '#fff',
            borderRadius: '12px',
            fontWeight: '500',
          },
        }}
      />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/4 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Header Card */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center shadow-2xl mb-6 transform rotate-3">
            <LogIn className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-3">
            Welcome Back
          </h1>
          <p className="text-blue-600/80 font-medium text-lg">
            Sign in to your account
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-blue-100/50 p-8 sm:p-10 transform hover:translate-y-[-2px] transition-all duration-300">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              {/* Email Field */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-blue-900 mb-3 ml-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-400 group-focus-within:text-blue-600 transition-colors duration-300" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-4 border-2 border-blue-100 rounded-2xl placeholder-blue-400/60 text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200/50 focus:border-blue-400 transition-all duration-300 bg-white/80 group-hover:border-blue-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-semibold text-blue-900 mb-3 ml-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-blue-400 group-focus-within:text-blue-600 transition-colors duration-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-12 pr-12 py-4 border-2 border-blue-100 rounded-2xl placeholder-blue-400/60 text-blue-900 focus:outline-none focus:ring-4 focus:ring-blue-200/50 focus:border-blue-400 transition-all duration-300 bg-white/80 group-hover:border-blue-200"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-blue-400 hover:text-blue-600 transition-all duration-300 hover:bg-blue-50 rounded-lg"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center group cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                  />
                  <div className="w-4 h-4 border-2 border-blue-300 rounded group-hover:border-blue-400 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded opacity-0 group-has-[:checked]:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>
                <span className="ml-2 text-blue-700/90 font-medium group-hover:text-blue-900 transition-colors duration-300">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-blue-600 hover:text-blue-800 font-semibold transition-all duration-300 hover:underline underline-offset-4"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full group relative bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 px-4 rounded-2xl hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:hover:translate-y-0 disabled:hover:shadow-lg overflow-hidden"
            >
              <div className="relative z-10 flex items-center justify-center">
                {loading ? (
                  <>
                    <Loader className="animate-spin mr-3 h-5 w-5" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to your account
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </div>
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </form>

          {/* New User Signup Section */}
          <div className="mt-8 pt-8 border-t border-blue-100">
            <div className="text-center">
              <p className="text-blue-600/80 text-sm font-medium mb-4">
                New to our platform?
              </p>
              <Link
                to="/register"
                className="group w-full inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 text-white py-4 px-6 rounded-2xl hover:from-blue-600 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-green-200/50 transition-all duration-300 font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 overflow-hidden"
              >
                <User className="mr-3 h-5 w-5" />
                Create your account
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              
              {/* Additional signup benefits */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-xs text-blue-600/70">
                <div className="flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
                  Free to join
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
                  Easy setup
                </div>
                <div className="flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mr-1"></div>
                  Instant access
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-blue-600/60 text-xs font-medium mt-6">
          <p>© 2024 Your Company. Protecting your digital journey.</p>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default UserLogin;