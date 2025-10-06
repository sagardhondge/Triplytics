import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Vehicles from "./pages/Vehicles";
import Costs from "./pages/Costs";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { AppContextProvider } from "./context/AppContext"; // Import the App Context Provider

function App() {
  // Removed handleUnknownRoute function and the use of alert()

  return (
    <AuthProvider>
      {/* AppContextProvider wraps all routes that need access to global data (vehicles/expenses) */}
      <AppContextProvider>
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
                className="flex justify-center items-center h-screen bg-gray-900 text-red-500 text-xl font-semibold"
              >
                404 | Page Not Found. Please check the URL.
              </div>
            }
          />
        </Routes>
      </AppContextProvider>
    </AuthProvider>
  );
}

export default App;
