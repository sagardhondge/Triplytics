// src/components/Navbar.jsx
import { useState } from "react";
import { Menu, X, Car, User, Home, Wallet, Settings, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/dashboard", icon: <Home size={20} />, color: "from-pink-500 via-red-500 to-yellow-500" },
    { name: "Profile", path: "/profile", icon: <User size={20} />, color: "from-purple-500 via-indigo-500 to-blue-500" },
    // { name: "Vehicles", path: "/vehicles", icon: <Car size={20} />, color: "from-green-400 via-lime-400 to-teal-400" },
    { name: "Costs", path: "/costs", icon: <Wallet size={20} />, color: "from-orange-400 via-yellow-400 to-red-400" },
    // { name: "Settings", path: "/settings", icon: <Settings size={20} />, color: "from-blue-400 via-cyan-400 to-teal-400" },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-md fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">Triplytics</h1>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r ${link.color} text-white font-semibold hover:scale-105 transition-all`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg font-semibold transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-gray-800 py-4 space-y-4 px-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block text-white hover:text-yellow-300 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-semibold"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}
