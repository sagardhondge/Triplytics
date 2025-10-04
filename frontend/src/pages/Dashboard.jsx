import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-3xl text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Welcome to Triplytics Dashboard
          </h2>
          <p className="text-gray-600 mb-6 text-lg">
            Hello, <span className="font-semibold">{user?.name || "User"}</span> 👋
          </p>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate("/cost-details")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition"
            >
              View Cost Details
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-medium transition"
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
