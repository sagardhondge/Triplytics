import { useState } from "react";
import Navbar from "../components/Navbar";
import DashboardBg from "../assets/Dashboard.png";
import AddExpenseModal from "../components/AddExpenseModal";
import { useAppContext } from "../context/AppContext";

const Dashboard = () => {
  // 🚨 CORRECTED: Now imports 'profile' for vehicle/fuel data access.
  const { expenses, profile, loading, error, addExpense } = useAppContext();
  
  const [showModal, setShowModal] = useState(false);
  
  const handleOpenModal = () => setShowModal(true);
  
  // This handles saving data from the Short Entry Modal
  const handleModalSave = (entries) => entries.forEach(entry => addExpense(entry));

  // 🚨 NEW FUNCTION: Accesses fuel cost from the single embedded vehicle (profile.vehicle)
  const getVehicleFuelCost = () => {
    const vehicle = profile?.vehicle; 
    if (!vehicle || !vehicle.fuelEntries) return 0;
    
    // Calculates total fuel cost based on entries
    return vehicle.fuelEntries.reduce(
      (sum, f) => sum + Number(f.litres || 0) * Number(f.pricePerLitre || 0),
      0
    );
  };

  // 🚨 CORRECTED: Includes Half-Annual period and full profit calculation
  const totalProfit = (period) => {
    if (!expenses || !Array.isArray(expenses)) return 0;

    const now = new Date();
    let filtered = expenses;
    const currentYear = new Date().getFullYear();

    // 1. Filter expenses based on the selected period
    if (period === "daily") {
      filtered = expenses.filter(
        (e) => new Date(e.date).toDateString() === now.toDateString()
      );
    } else if (period === "weekly") {
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      filtered = expenses.filter((e) => new Date(e.date) >= weekStart);
    } else if (period === "monthly") {
      filtered = expenses.filter(
        (e) => new Date(e.date).getMonth() === new Date().getMonth() && new Date(e.date).getFullYear() === currentYear
      );
    } else if (period === "half-annual") { // 🚨 ADDED: Half-Year period
        const halfYearStart = new Date();
        halfYearStart.setMonth(new Date().getMonth() - 5); 
        filtered = expenses.filter((e) => new Date(e.date) >= halfYearStart);
    } else if (period === "annual") {
      filtered = expenses.filter(
        (e) => new Date(e.date).getFullYear() === currentYear
      );
    }

    // 2. Get the fuel cost for the single vehicle
    const vehicleFuelCost = getVehicleFuelCost();

    // 3. Calculate profit: Income - Fuel Cost - Trip Expenses
    return filtered.reduce((sum, e) => {
      const fare = Number(e.amount || 0);
      const tripSpecificExpenses = Number(e.extraExpenses || 0) + Number(e.otherExpenses || 0);
      const totalTripCost = vehicleFuelCost + tripSpecificExpenses;
      
      return sum + fare - totalTripCost;
    }, 0).toFixed(2); // Format to 2 decimal places
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-cyan-300 text-xl font-semibold">
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-red-500 text-xl font-semibold">
        Error: Failed to load data.
      </div>
    );
  }

  // 🚨 MODIFIED: Periods array now includes 'half-annual'
  const periods = [
    { key: "daily", label: "Daily Profit" },
    { key: "weekly", label: "Weekly Profit" },
    { key: "monthly", label: "Monthly Profit" },
    { key: "half-annual", label: "Half-Year Profit" },
    { key: "annual", label: "Annual Profit" },
  ];

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          {periods.map((period) => (
            <div
              key={period.key}
              className="bg-gradient-to-br from-cyan-500/30 to-green-500/30 backdrop-blur-md border border-cyan-400/40 rounded-xl p-6 shadow-lg hover:shadow-cyan-400/30 transition-all"
            >
              <h2 className="text-gray-300 font-medium capitalize">
                {period.label}
              </h2>
              <p className="text-2xl font-bold text-cyan-300 mt-2 drop-shadow-[0_0_5px_#00ffff]">
                ₹{totalProfit(period.key)}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Trip Entry (Short Entry) */}
        <div className="bg-gray-800/60 border border-cyan-500/30 p-6 rounded-xl mb-10 shadow-lg">
          <h2 className="text-xl font-semibold text-cyan-300 mb-4">
            Quick Trip Entry
          </h2>
          <button
            onClick={handleOpenModal}
            className="mt-4 bg-cyan-500 hover:bg-green-500 text-gray-900 font-semibold px-6 py-2 rounded-xl transition-all"
          >
            + Add Short Trip
          </button>
          <p className="mt-3 text-gray-400 text-sm">
            Need **detailed entries**? <a href="/costs" className="text-cyan-400 underline">Go to Costs Page →</a>
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
                <th className="px-6 py-3 text-left font-semibold">Distance (km)</th>
                {/* 🚨 REMOVED: Inaccurate 'Fuel (L)' column */}
              </tr>
            </thead>
            <tbody>
              {expenses && expenses.length > 0 ? (
                expenses.map((e, idx) => (
                  <tr
                    key={e._id || idx}
                    className="hover:bg-cyan-500/10 border-b border-cyan-500/10"
                  >
                    <td className="px-6 py-3">{new Date(e.date).toLocaleDateString()}</td>
                    <td className="px-6 py-3">{e.title}</td>
                    <td className="px-6 py-3 text-cyan-300 font-medium">₹{e.amount}</td>
                    {/* 🚨 CORRECTED: Displaying the distance field */}
                    <td className="px-6 py-3 text-cyan-200">{e.distance || 0}</td> 
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

      <AddExpenseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleModalSave}
      />
    </div>
  );
};

export default Dashboard;