import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Vehicles from "./pages/Vehicles"; // corrected
import Costs from "./pages/Costs";       // corrected
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const handleUnknownRoute = () => {
    alert("Something went wrong, please try again!");
  };

  return (
    <AuthProvider>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vehicles"
          element={
            <ProtectedRoute>
              <Vehicles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/costs"
          element={
            <ProtectedRoute>
              <Costs />
            </ProtectedRoute>
          }
        />

        {/* Catch-all route for unknown paths */}
        <Route
          path="*"
          element={
            <div
              className="flex justify-center items-center h-screen text-red-600 text-xl font-semibold"
              onLoad={handleUnknownRoute}
            >
              Something went wrong, please try again!
            </div>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
