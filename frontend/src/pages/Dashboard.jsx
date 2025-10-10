import { useState } from "react";
import Navbar from "../components/Navbar";
import DashboardBg from "../assets/Dashboard.png";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [newTrip, setNewTrip] = useState({
    date: new Date().toISOString().split("T")[0],
    platform: "",
    fare: "",
    fuel: ""
  });

  const handleAddTrip = () => {
    if (!newTrip.platform || !newTrip.fare) return alert("Please fill all fields!");
    setExpenses([...expenses, newTrip]);
    setNewTrip({
      date: new Date().toISOString().split("T")[0],
      platform: "",
      fare: "",
      fuel: ""
    });
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
      <Navbar />

      <div className="relative w-full h-[350px] md:h-[420px] overflow-hidden">
        <img
          src={DashboardBg}
          alt="Dashboard Overview"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </div>

      <div className="w-full px-6 md:px-12 py-10">
        <h1 className="text-3xl font-bold text-cyan-300 mb-6">Dashboard</h1>

        {/* Summary Cards */}
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

        {/* Quick Trip Entry */}
        <div className="bg-gray-800/60 border border-cyan-500/30 p-6 rounded-xl mb-10 shadow-lg">
          <h2 className="text-xl font-semibold text-cyan-300 mb-4">
            Quick Trip Entry
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="date"
              name="date"
              value={newTrip.date}
              onChange={(e) => setNewTrip({ ...newTrip, date: e.target.value })}
              className="p-3 rounded-xl bg-gray-700 border border-gray-600 text-white"
            />
            <input
              type="text"
              name="platform"
              placeholder="Platform (Ola / Uber)"
              value={newTrip.platform}
              onChange={(e) => setNewTrip({ ...newTrip, platform: e.target.value })}
              className="p-3 rounded-xl bg-gray-700 border border-gray-600 text-white"
            />
            <input
              type="number"
              name="fare"
              placeholder="Fare (₹)"
              value={newTrip.fare}
              onChange={(e) => setNewTrip({ ...newTrip, fare: e.target.value })}
              className="p-3 rounded-xl bg-gray-700 border border-gray-600 text-white"
            />
            <input
              type="number"
              name="fuel"
              placeholder="Fuel Used (L)"
              value={newTrip.fuel}
              onChange={(e) => setNewTrip({ ...newTrip, fuel: e.target.value })}
              className="p-3 rounded-xl bg-gray-700 border border-gray-600 text-white"
            />
          </div>
          <button
            onClick={handleAddTrip}
            className="mt-4 bg-cyan-500 hover:bg-green-500 text-gray-900 font-semibold px-6 py-2 rounded-xl transition-all"
          >
            + Add Trip
          </button>
          <p className="mt-3 text-gray-400 text-sm">
            Need full details? <a href="/costs" className="text-cyan-400 underline">Go to Costs Page →</a>
          </p>
        </div>

        {/* Expense Table */}
        <div className="overflow-x-auto bg-gray-800/70 backdrop-blur-md rounded-xl shadow-xl border border-cyan-500/20">
          <table className="min-w-full">
            <thead className="bg-cyan-500/20 text-cyan-300 uppercase text-sm">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Platform</th>
                <th className="px-6 py-3 text-left font-semibold">Fare (₹)</th>
                <th className="px-6 py-3 text-left font-semibold">Fuel (L)</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length > 0 ? (
                expenses.map((e, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-cyan-500/10 border-b border-cyan-500/10"
                  >
                    <td className="px-6 py-3">{e.date}</td>
                    <td className="px-6 py-3">{e.platform}</td>
                    <td className="px-6 py-3 text-cyan-300 font-medium">₹{e.fare}</td>
                    <td className="px-6 py-3 text-cyan-200">{e.fuel || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-gray-400 italic">
                    No trips yet. Add one above!
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
