// src/pages/Dashboard.jsx
import { useState } from "react";
import Navbar from "../components/Navbar";
import AddExpenseModal from "../components/AddExpenseModal";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSaveExpenses = (newExpenses) => {
    setExpenses([...expenses, ...newExpenses]);
  };

  const totalProfit = (period) => {
    const now = new Date();
    let filtered = expenses;

    if (period === "daily") {
      filtered = expenses.filter(
        (e) => new Date(e.date).toDateString() === now.toDateString()
      );
    } else if (period === "weekly") {
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      filtered = expenses.filter((e) => new Date(e.date) >= weekStart);
    } else if (period === "monthly") {
      filtered = expenses.filter(
        (e) => new Date(e.date).getMonth() === new Date().getMonth()
      );
    } else if (period === "annual") {
      filtered = expenses.filter(
        (e) => new Date(e.date).getFullYear() === new Date().getFullYear()
      );
    }

    return filtered.reduce((sum, e) => sum + Number(e.fare || 0), 0);
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
          {["daily", "weekly", "monthly", "annual"].map((period) => (
            <div
              key={period}
              className="bg-white shadow-lg rounded-xl p-6 border-l-4 border-blue-500"
            >
              <h2 className="text-gray-500 font-medium capitalize">
                {period} Profit
              </h2>
              <p className="text-2xl font-bold mt-2">₹{totalProfit(period)}</p>
            </div>
          ))}
        </div>

        {/* Quick Add Ride/Expense Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all"
          >
            + Add Ride / Expense
          </button>
        </div>

        {/* AddExpenseModal */}
        <AddExpenseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveExpenses}
        />

        {/* Expense Table */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-xl p-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Platform</th>
                <th className="px-4 py-2 text-left">Fare (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {expenses.map((e, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-2">{e.date}</td>
                  <td className="px-4 py-2">{e.platform}</td>
                  <td className="px-4 py-2">{e.fare}</td>
                </tr>
              ))}
              {expenses.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-4 text-gray-500">
                    No expenses yet. Add a ride or expense!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
