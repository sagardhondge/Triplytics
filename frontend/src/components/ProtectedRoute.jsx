// This is your original ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // or a spinner while loading
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;