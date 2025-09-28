// src/components/UserPrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const UserPrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token"); // buyer/supplier token
  const role = localStorage.getItem("role");   // "buyer" or "supplier"

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default UserPrivateRoute;
