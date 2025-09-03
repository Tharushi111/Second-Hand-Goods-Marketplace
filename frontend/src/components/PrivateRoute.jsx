import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  // Check if admin token exists in localStorage
  const adminToken = localStorage.getItem("adminToken");

  // If no token, redirect to login
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  // Else, render the page
  return children;
};

export default PrivateRoute;
