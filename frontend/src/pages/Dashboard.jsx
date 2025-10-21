import { useState } from "react";
import Navbar from "../components/Navbar";
import DashboardBg from "../assets/Dashboard.png";
import AddExpenseModal from "../components/AddExpenseModal";
import { useAppContext } from "../context/AppContext";

const Dashboard = () => {
  const { expenses, vehicles, loading, error, addExpense } = useAppContext();
  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => setShowModal(true);
  const handleModalSave = (entries) => entries.forEach((entry) => addExpense(entry));

  const getFuelCostForVehicle = (vehicleId) => {
    const vehicle = vehicles.find((v) => v._id === vehicleId);
    if (!vehicle || !vehicle.fuelEntries) return 0;
    return vehicle.fuelEntries.reduce(
      (sum, f) => sum + Number(f.litres || 0) * Number(f.pricePerLitre || 0),
      0
    );
  };

  const totalProfit = (period) => {
    if (!expenses || !Array.isArray(expenses)) return 0;

    const now = new Date();
    let filtered = expenses;

    if (period === "daily") {
      filtered = expenses.filter((e) => new Date(e.date).toDateString() === now.toDateString());
    } else if (period === "weekly") {
      const weekStart = new Date();
      weekStart.setDate(now.getDate() - now.getDay());
      filtered = expenses.filter((e) => new Date(e.date) >= weekStart);
    } else if (period === "monthly") {
      filtered = expenses.filter((e) => new Date(e.date).getMonth() === now.getMonth());
    } else if (period === "annual") {
      filtered = expenses.filter((e) => new Date(e.date).getFullYear() === now.getFullYear());
    }

    return filtered.reduce((sum, e) => {
      const fuelCost = getFuelCostForVehicle(e.vehicle);
      return sum + Number(e.amount || 0) - fuelCost;
    }, 0);
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-cyan-300">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="relative w-full h-[350px] md:h-[420px] overflow-hidden">
        <img src={DashboardBg} alt="Dashboard" className="absolute inset-0 w-full h-full object-cover object-center"/>
      </div>

      <div className="w-full px-6 md:px-12 py-10">
        <h1 className="text-3xl font-bold text-cyan-300 mb-6">Dashboard</h1>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {["daily", "weekly", "monthly", "annual"].map((period) => (
            <div key={period} className="bg-gray-800/70 p-6 rounded-xl border border-cyan-400/20">
              <h2 className="text-gray-300 font-medium capitalize">{period} Profit</h2>
              <p className="text-2xl font-bold text-cyan-300 mt-2">₹{totalProfit(period)}</p>
            </div>
          ))}
        </div>

        {/* Quick Entry */}
        <div className="bg-gray-800/60 border border-cyan-500/30 p-6 rounded-xl mb-10 shadow-lg">
          <h2 className="text-xl font-semibold text-cyan-300 mb-4">Quick Trip Entry</h2>
          <button onClick={handleOpenModal} className="mt-4 bg-cyan-500 hover:bg-green-500 text-gray-900 font-semibold px-6 py-2 rounded-xl">
            + Add Trip
          </button>
        </div>

        <AddExpenseModal isOpen={showModal} onClose={() => setShowModal(false)} onSave={handleModalSave}/>
      </div>
    </div>
  );
};

export default Dashboard;
