import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { X } from "lucide-react";
import { useAppContext } from "../context/AppContext";

const Costs = () => {
  const { vehicles, expenses, addExpense, updateExpense, deleteExpense, updateVehicle } = useAppContext();

  const [editingFuel, setEditingFuel] = useState({}); // { vehicleId: true/false }

  const handleFuelChange = (vehicleId, index, field, value) => {
    const vehicle = vehicles.find((v) => v._id === vehicleId);
    if (!vehicle) return;

    const updatedFuelEntries = [...(vehicle.fuelEntries || [])];
    updatedFuelEntries[index] = { ...updatedFuelEntries[index], [field]: value };

    updateVehicle(vehicleId, { fuelEntries: updatedFuelEntries });
  };

  const addFuelEntry = (vehicleId) => {
    const vehicle = vehicles.find((v) => v._id === vehicleId);
    if (!vehicle) return;

    const updatedFuelEntries = [...(vehicle.fuelEntries || []), { type: "", litres: "", pricePerLitre: "" }];
    updateVehicle(vehicleId, { fuelEntries: updatedFuelEntries });
  };

  const removeFuelEntry = (vehicleId, index) => {
    const vehicle = vehicles.find((v) => v._id === vehicleId);
    if (!vehicle) return;

    const updatedFuelEntries = vehicle.fuelEntries.filter((_, i) => i !== index);
    updateVehicle(vehicleId, { fuelEntries: updatedFuelEntries });
  };

  const getFuelCostForVehicle = (vehicleId) => {
    const vehicle = vehicles.find((v) => v._id === vehicleId);
    if (!vehicle?.fuelEntries) return 0;
    return vehicle.fuelEntries.reduce((sum, f) => sum + (Number(f.litres) || 0) * (Number(f.pricePerLitre) || 0), 0);
  };

  if (!vehicles || !expenses) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="pt-24 px-6 md:px-12 py-10 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-cyan-300 mb-6">Detailed Costs</h1>

        {vehicles.map((vehicle) => {
          const fuelCost = getFuelCostForVehicle(vehicle._id);
          const vehicleExpenses = expenses.filter((e) => e.vehicle === vehicle._id);

          return (
            <div key={vehicle._id} className="mb-10 bg-gray-800/70 p-6 rounded-xl shadow-xl border border-cyan-500/20">
              <h2 className="text-2xl font-bold text-cyan-300 mb-4">{vehicle.vehicleMake}</h2>

              {/* Fuel Entries */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-semibold text-gray-200">Fuel Entries</h3>
                  <button
                    onClick={() => addFuelEntry(vehicle._id)}
                    className="bg-cyan-600 px-4 py-2 rounded-xl font-semibold hover:bg-cyan-700 transition-all"
                  >
                    + Add Fuel
                  </button>
                </div>
                {(vehicle.fuelEntries || []).map((f, idx) => (
                  <div key={idx} className="grid md:grid-cols-5 gap-4 mb-2 bg-gray-700/30 p-3 rounded-xl">
                    <input
                      type="text"
                      placeholder="Fuel Type"
                      value={f.type}
                      onChange={(e) => handleFuelChange(vehicle._id, idx, "type", e.target.value)}
                      className="p-2 rounded-xl bg-gray-700 border border-gray-600 text-white"
                    />
                    <input
                      type="number"
                      placeholder="Litres"
                      value={f.litres}
                      onChange={(e) => handleFuelChange(vehicle._id, idx, "litres", e.target.value)}
                      className="p-2 rounded-xl bg-gray-700 border border-gray-600 text-white"
                    />
                    <input
                      type="number"
                      placeholder="Price per Litre ₹"
                      value={f.pricePerLitre}
                      onChange={(e) => handleFuelChange(vehicle._id, idx, "pricePerLitre", e.target.value)}
                      className="p-2 rounded-xl bg-gray-700 border border-gray-600 text-white"
                    />
                    <p className="flex items-center font-semibold text-cyan-300">
                      Total: ₹{((Number(f.litres) || 0) * (Number(f.pricePerLitre) || 0)).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFuelEntry(vehicle._id, idx)}
                      className="bg-red-600 text-white px-2 py-1 rounded-xl hover:bg-red-700 transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ))}
                <p className="mt-2 text-gray-400">Total Fuel Cost: ₹{fuelCost}</p>
              </div>

              {/* Trip Entries */}
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-cyan-500/20 text-cyan-300 uppercase text-sm">
                    <tr>
                      <th className="px-4 py-2">Date</th>
                      <th className="px-4 py-2">Trip</th>
                      <th className="px-4 py-2">Fare (₹)</th>
                      <th className="px-4 py-2">Net Profit (₹)</th>
                      <th className="px-4 py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vehicleExpenses.length > 0 ? (
                      vehicleExpenses.map((e) => (
                        <tr key={e._id} className="hover:bg-cyan-500/10 border-b border-cyan-500/10">
                          <td className="px-4 py-2">{new Date(e.date).toLocaleDateString()}</td>
                          <td className="px-4 py-2">{e.title}</td>
                          <td className="px-4 py-2">₹{e.amount}</td>
                          <td className="px-4 py-2">₹{(Number(e.amount) || 0) - fuelCost}</td>
                          <td className="px-4 py-2">
                            <button
                              onClick={() => deleteExpense(e._id)}
                              className="bg-red-600 px-2 py-1 rounded-xl hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4 text-gray-400 italic">
                          No trips recorded for this vehicle.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Costs;
