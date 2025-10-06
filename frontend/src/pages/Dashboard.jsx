import { useState } from "react";
import Navbar from "../components/Navbar";
import AddExpenseModal from "../components/AddExpenseModal";
import DashboardBg from "../assets/Dashboard.png";

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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <Navbar />

      {/* Full Background Hero */}
      <div className="relative w-full h-[350px] md:h-[420px] overflow-hidden">
        <img
          src={DashboardBg}
          alt="Dashboard Overview"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </div>

      {/* Main Content */}
      <div className="w-full px-6 md:px-12 py-10">
        <h1 className="text-3xl font-bold text-cyan-300 mb-6">Dashboard</h1>

        {/* Profit Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {["daily", "weekly", "monthly", "annual"].map((period) => (
            <div
              key={period} 
              className="bg-gradient-to-br from-cyan-500/30 to-green-500/30 backdrop-blur-md border border-cyan-400/40 rounded-xl p-6 shadow-lg hover:shadow-cyan-400/30 transition-all"
            >
              <h2 className="text-gray-300 font-medium capitalize">
                {period} Profit
              </h2>
              <p className="text-2xl font-bold text-cyan-300 mt-2 drop-shadow-[0_0_5px_#00ffff]">
                ₹{totalProfit(period)}
              </p>
            </div>
          ))}
        </div>

        {/* Add Ride/Expense Button */}
        <div className="flex justify-end mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-cyan-500 to-green-400 hover:from-green-400 hover:to-cyan-500 text-gray-900 font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300"
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
        <div className="overflow-x-auto bg-gray-800/70 backdrop-blur-md rounded-xl shadow-xl border border-cyan-500/20">
          <table className="min-w-full">
            <thead className="bg-cyan-500/20 text-cyan-300 uppercase text-sm">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Platform</th>
                <th className="px-6 py-3 text-left font-semibold">Fare (₹)</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length > 0 ? (
                expenses.map((e, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-cyan-500/10 border-b border-cyan-500/10"
                  >
                    <td className="px-6 py-3 text-black-200">{e.date}</td>
                    <td className="px-6 py-3 text-black-200">{e.platform}</td>
                    <td className="px-6 py-3 text-cyan-300 font-medium">
                      ₹{e.fare}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="text-center py-6 text-gray-400 italic"
                  >
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
