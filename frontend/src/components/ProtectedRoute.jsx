// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // Show nothing (or a loader) while checking auth status
  if (loading) return <div className="text-center mt-20">Loading...</div>;

  // If user is not logged in, redirect to login page
  if (!user) return <Navigate to="/login" replace />;

  // If logged in, render the child component (the protected page)
  return children;
};

export default ProtectedRoute;
