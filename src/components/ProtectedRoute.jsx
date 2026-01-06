import React from "react";
import { Navigate } from "react-router-dom";
import { hasPermission } from "../utils/permissionCheck";

const ProtectedRoute = ({ children, permission }) => {
  const adminData = localStorage.getItem("admin");

  // 1. If no login data exists, redirect to Login
  if (!adminData) {
    return <Navigate to="/" replace />;
  }

  // 2. If a specific permission is required for this route, check it
  if (permission && !hasPermission(permission)) {
    // If they try to bypass via URL, send them back to Dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;
