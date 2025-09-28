import React from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = () => {
  const navigate = useNavigate();

  const adminData = JSON.parse(localStorage.getItem("adminData") || "{}");
  const username = adminData.username || "Admin";

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminData");

    // Show logout success toast
    toast.success("Logged out successfully!", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

    // Navigate to login page
    setTimeout(() => {
      navigate("/admin/login");
    }, 500);
  };

  return (
    <>
    <ToastContainer />
      <header className="bg-white shadow-lg px-4 sm:px-6 py-3 flex items-center justify-between w-full border-b border-gray-100">
        <div className="flex items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Admin Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
            </div>
            <span className="font-medium text-gray-700">{username}</span>
          </div>

          <button
            onClick={handleLogout}
            aria-label="Logout"
            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow hover:shadow-md flex items-center"
          >
            Logout
          </button>
        </div>
      </header>
    </>
  );
};

export default Navbar;
