// src/pages/Dashboard.jsx
import React from "react";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  // Dummy profit data (we will fetch from backend later)
  const profits = {
    daily: 1200,
    weekly: 7800,
    monthly: 32000,
    annual: 380000,
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="pt-24 px-6 md:px-12">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Profit Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-blue-500">
            <h2 className="text-gray-500 font-medium">Daily Profit</h2>
            <p className="text-2xl font-bold mt-2">₹{profits.daily}</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-green-500">
            <h2 className="text-gray-500 font-medium">Weekly Profit</h2>
            <p className="text-2xl font-bold mt-2">₹{profits.weekly}</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-yellow-500">
            <h2 className="text-gray-500 font-medium">Monthly Profit</h2>
            <p className="text-2xl font-bold mt-2">₹{profits.monthly}</p>
          </div>
          <div className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-red-500">
            <h2 className="text-gray-500 font-medium">Annual Profit</h2>
            <p className="text-2xl font-bold mt-2">₹{profits.annual}</p>
          </div>
        </div>

        {/* Quick Add Ride/Expense Button */}
        <div className="flex justify-end">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all">
            + Add Ride / Expense
          </button>
        </div>

        {/* Optional: Recent rides or summary table (to be implemented later) */}
      </div>
    </div>
  );
};

export default Dashboard;
