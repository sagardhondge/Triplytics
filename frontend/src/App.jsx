import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Vehicles from "./pages/vehicles";
import Costs from "./pages/Costs";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Wrapper for default route
function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate to={user ? "/dashboard" : "/login"} replace />;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes wrapped by ProtectedRoute */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/vehicles" element={<ProtectedRoute><Vehicles /></ProtectedRoute>} />
        <Route path="/costs" element={<ProtectedRoute><Costs /></ProtectedRoute>} />
        
        {/* Catch-all 404 */}
        <Route path="*" element={<div className="flex justify-center items-center h-screen bg-gray-900 text-red-500 text-xl font-semibold">404 | Page Not Found</div>} />
      </Routes>
    </AuthProvider>
  );
}

export default App;