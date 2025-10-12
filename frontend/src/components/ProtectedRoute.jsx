import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AppContextProvider } from "../context/AppContext"; // Import AppContextProvider

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // or a spinner while loading
  if (!user) return <Navigate to="/login" replace />;

  return <AppContextProvider>{children}</AppContextProvider>;
};

export default ProtectedRoute;