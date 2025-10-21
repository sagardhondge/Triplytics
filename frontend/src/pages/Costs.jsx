import React, { useState } from "react";
import { Wallet, ChevronDown, ChevronUp, X, Plus } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAppContext } from "../context/AppContext";

const getTodayDate = () => new Date().toISOString().split('T')[0];

const Costs = () => {
  const { profile, expenses, loading, error, addExpense, updateProfile, deleteExpense } = useAppContext();
  
  const vehicle = profile?.vehicle; 
  const mileage = Number(vehicle?.mileage || 0); // 🚨 Retrieve Mileage (km/L)

  // NEW STATE: Form data for the direct detailed entry (UNCHANGED)
  const [newEntryForm, setNewEntryForm] = useState({
      date: getTodayDate(),
      platform: "",
      fare: "",
      distance: "",
      extraExpenses: "", 
      otherExpenses: "", 
  });

  // State for accordion visibility (UNCHANGED)
  const [showFuel, setShowFuel] = useState(true);
  const [showExpense, setShowExpense] = useState(true);
  
  const inputClass = "p-3 border rounded-xl bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-cyan-500 transition-all";

  // ----------------------------- FUEL HANDLERS (UNCHANGED) -----------------------------
  const handleFuelChange = (index, field, value) => {
    if (!vehicle) return;
    const updatedFuelEntries = [...(vehicle.fuelEntries || [])];
    updatedFuelEntries[index] = { ...updatedFuelEntries[index], [field]: value };
    updateProfile({ vehicle: { ...vehicle, fuelEntries: updatedFuelEntries } });
  };

  const addFuelEntry = () => {
    if (!vehicle) return;
    const updatedFuelEntries = [...(vehicle.fuelEntries || []), { type: "", litres: "", pricePerLitre: "" }];
    updateProfile({ vehicle: { ...vehicle, fuelEntries: updatedFuelEntries } });
  };

  const removeFuelEntry = (index) => {
    if (!vehicle) return;
    const updatedFuelEntries = vehicle.fuelEntries.filter((_, i) => i !== index);
    updateProfile({ vehicle: { ...vehicle, fuelEntries: updatedFuelEntries } });
  };

  // ----------------------------- ENTRY FORM HANDLER (UNCHANGED) -----------------------------
  const handleNewEntryChange = (e) => {
      const { name, value } = e.target;
      setNewEntryForm(prev => ({ ...prev, [name]: value }));
  };

  const submitNewEntry = (e) => {
      e.preventDefault();
      
      const { platform, fare, distance, date, extraExpenses, otherExpenses } = newEntryForm;
      
      if (!platform || !fare || !distance || !date) {
          alert("Platform, Fare, Date, and Distance are mandatory fields for trip entry.");
          return;
      }
      
      const newExpense = {
          title: platform,
          amount: Number(fare),
          distance: Number(distance),
          date: date,
          vehicle: vehicle?._id || null,
          extraExpenses: Number(extraExpenses) || 0,
          otherExpenses: Number(otherExpenses) || 0,
      };

      addExpense(newExpense);
      
      setNewEntryForm({
          date: getTodayDate(), platform: "", fare: "", distance: "", extraExpenses: "", otherExpenses: ""
      });
  };

  const removeExpenseEntry = (id) => {
    deleteExpense(id);
  };

  // ----------------------------- CALCULATIONS (MILEAGE-BASED) -----------------------------
  const totalLitresPurchased = vehicle?.fuelEntries?.reduce((sum, f) => sum + (Number(f.litres || 0)), 0) || 0;
  const totalFuelCost = vehicle?.fuelEntries?.reduce((sum, f) => sum + (Number(f.litres || 0) * Number(f.pricePerLitre || 0)), 0) || 0;
  
  // 1. Average Price per Litre (₹/L)
  const averageFuelPrice = totalLitresPurchased > 0 ? totalFuelCost / totalLitresPurchased : 0;
  
  const vehicleExpenses = expenses.filter((e) => e.vehicle === vehicle?._id);

  // 2. Calculate TOTAL Estimated Consumption (for the 'Fuel Remaining' summary)
  const totalEstimatedConsumption = vehicleExpenses.reduce((sum, e) => {
    const tripDistance = Number(e.distance || 0);
    if (mileage > 0 && tripDistance > 0) {
      // Fuel Consumed (L) = Distance (km) / Mileage (km/L)
      return sum + (tripDistance / mileage);
    }
    return sum;
  }, 0);
  
  // 3. Summary Totals
  const totalTripIncome = vehicleExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalTripExpenses = vehicleExpenses.reduce((sum, e) => sum + (Number(e.extraExpenses) || 0) + (Number(e.otherExpenses) || 0), 0);
  
  // 4. Total Net Profit (Income - All Costs)
  const totalEstimatedFuelCost = totalEstimatedConsumption * averageFuelPrice;
  const totalNetProfit = totalTripIncome - totalEstimatedFuelCost - totalTripExpenses; 
  
  // 5. Estimated Fuel Remaining
  const fuelRemaining = totalLitresPurchased - totalEstimatedConsumption;


  // ----------------------------- UI RENDERING (UNCHANGED) -----------------------------
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-cyan-300 text-xl font-semibold">
        Loading costs...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-red-500 text-xl font-semibold">
        Error: Failed to load costs data.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="pt-24 px-6 md:px-12 py-10">
        <div className="max-w-7xl mx-auto bg-gray-800/80 backdrop-blur-md rounded-xl shadow-2xl p-8 border border-cyan-500/20">
          <h1 className="text-3xl font-extrabold text-cyan-300 mb-8 flex items-center gap-3">
            <Wallet className="text-cyan-400" size={30} /> Cost Management
          </h1>

          {/* ===================== SUMMARY ===================== */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">{vehicle?.name || "Primary Vehicle"} Summary</h2>
            <div className="bg-gray-700/50 p-6 rounded-xl shadow-inner grid md:grid-cols-4 gap-4 border border-gray-700">
                <p>
                    Total Income:{" "}
                    <span className="font-bold text-cyan-300">
                    ₹ {totalTripIncome.toFixed(2)}
                    </span>
                </p>
                <p>
                    {/* 🚨 UPDATED: Displaying Estimated Cost, not Total Purchased Cost */}
                    Estimated Fuel Cost:{" "}
                    <span className="text-red-400 font-extrabold">
                    ₹ {totalEstimatedFuelCost.toFixed(2)}
                    </span>
                </p>
                <p>
                    Total Other Expenses:{" "}
                    <span className="text-red-400 font-extrabold">
                    ₹ {totalTripExpenses.toFixed(2)}
                    </span>
                </p>
                <p>
                    {/* 🚨 ADDED: Fuel Remaining */}
                    Fuel Remaining (Est.):{" "}
                    <span className={`font-extrabold ${fuelRemaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {fuelRemaining.toFixed(2)} L
                    </span>
                </p>
                <div className="md:col-span-4">
                    <p className="text-xl mt-2">
                        Net Profit:{" "}
                        <span className={`font-extrabold ${totalNetProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        ₹ {totalNetProfit.toFixed(2)}
                        </span>
                    </p>
                </div>
            </div>
          </section>

          {/* ===================== FUEL ENTRIES (UNCHANGED) ===================== */}
          <section className="mb-10">
            <div
              className="flex items-center justify-between cursor-pointer border-t border-cyan-500/30 pt-6 mb-4"
              onClick={() => setShowFuel(!showFuel)}
            >
              <h2 className="text-2xl font-semibold text-gray-200">
                Fuel Entries (Total Purchased Cost: ₹ {totalFuelCost.toFixed(2)})
              </h2>
              {showFuel ? (
                <ChevronUp className="text-cyan-400" />
              ) : (
                <ChevronDown className="text-cyan-400" />
              )}
            </div>

            {showFuel && (
              <>
                {(vehicle?.fuelEntries || []).map((f, index) => (
                  <div
                    key={index}
                    className="grid md:grid-cols-6 gap-4 mb-4 items-center bg-gray-700/30 p-4 rounded-xl"
                  >
                    <select
                      name="type"
                      value={f.type || ""}
                      onChange={(e) => handleFuelChange(index, "type", e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Fuel Type</option>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="CNG">CNG</option>
                      <option value="Electricity">Electricity</option>
                    </select>

                    <input
                      type="number"
                      name="litres"
                      placeholder="Litres"
                      value={f.litres || ""}
                      onChange={(e) => handleFuelChange(index, "litres", e.target.value)}
                      className={inputClass}
                    />

                    <input
                      type="number"
                      name="pricePerLitre"
                      placeholder="Price per Litre ₹"
                      value={f.pricePerLitre || ""}
                      onChange={(e) => handleFuelChange(index, "pricePerLitre", e.target.value)}
                      className={inputClass}
                    />

                    <p className="flex items-center font-semibold text-cyan-300">
                      Total: ₹
                      {(Number(f.litres || 0) * Number(f.pricePerLitre || 0)).toFixed(2)}
                    </p>

                    <button
                      onClick={() => removeFuelEntry(index)}
                      className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all col-span-2 md:col-span-1"
                    >
                      <X className="w-5 h-5 mx-auto" />
                    </button>
                  </div>
                ))}

                <button
                  onClick={addFuelEntry}
                  className="mt-2 bg-cyan-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-cyan-700 transition-all"
                >
                  + Add Fuel Entry
                </button>
              </>
            )}
          </section>

          <section>
            <div
              className="flex items-center justify-between cursor-pointer border-t border-cyan-500/30 pt-6 mb-4"
              onClick={() => setShowExpense(!showExpense)}
            >
              <h2 className="text-2xl font-semibold text-gray-200">
                Trip Entries (Detailed)
              </h2>
              {showExpense ? (
                <ChevronUp className="text-cyan-400" />
              ) : (
                <ChevronDown className="text-cyan-400" />
              )}
            </div>

            {showExpense && (
              <>
                {/* INLINE FORM FOR DETAILED ENTRY (UNCHANGED) */}
                <form onSubmit={submitNewEntry} className="mb-8 p-4 rounded-xl bg-gray-700/50 border border-indigo-500/30">
                    <h3 className="text-xl font-semibold text-indigo-300 mb-4">New Trip Entry</h3>
                    
                    {/* MANDATORY FIELDS */}
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <input type="date" name="date" value={newEntryForm.date} onChange={handleNewEntryChange} className={inputClass} required />
                        <input type="text" name="platform" placeholder="Platform (Mandatory)" value={newEntryForm.platform} onChange={handleNewEntryChange} className={inputClass} required />
                        <input type="number" name="fare" placeholder="Fare/Income (₹) (Mandatory)" value={newEntryForm.fare} onChange={handleNewEntryChange} className={inputClass} required />
                        <input type="number" name="distance" placeholder="Distance (km) (Mandatory)" value={newEntryForm.distance} onChange={handleNewEntryChange} className={inputClass} required />
                    </div>

                    {/* OPTIONAL EXPENSE FIELDS */}
                    <div className="grid md:grid-cols-4 gap-4 mb-4">
                        <input type="number" name="extraExpenses" placeholder="Tolls/Parking (₹) (Optional)" value={newEntryForm.extraExpenses} onChange={handleNewEntryChange} className={inputClass} />
                        <input type="number" name="otherExpenses" placeholder="Other Costs (₹) (Optional)" value={newEntryForm.otherExpenses} onChange={handleNewEntryChange} className={inputClass} />
                        <div className="md:col-span-2 flex justify-end">
                            <button
                                type="submit"
                                className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2"
                            >
                                <Plus size={20} /> Record Trip
                            </button>
                        </div>
                    </div>
                </form>

                {/* TRIP TABLE */}
                {vehicleExpenses.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full">
                            <thead className="bg-cyan-500/20 text-cyan-300 uppercase text-sm">
                                <tr>
                                    <th className="px-4 py-2 text-left">Date</th>
                                    <th className="px-4 py-2 text-left">Platform</th>
                                    <th className="px-4 py-2">Fare (₹)</th>
                                    <th className="px-4 py-2">Dist (km)</th>
                                    <th className="px-4 py-2">Extra (₹)</th>
                                    <th className="px-4 py-2">Other (₹)</th>
                                    <th className="px-4 py-2">Net Profit (₹)</th>
                                    <th className="px-4 py-2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {vehicleExpenses.map((e) => {
                                    const tripExpenses = (e.extraExpenses || 0) + (e.otherExpenses || 0);
                                    const tripDistance = Number(e.distance || 0);
                                    let fuelCostForThisTrip = 0;
                                    
                                    // 🚨 MILEAGE-BASED CALCULATION: Calculate fuel cost for this specific trip
                                    if (mileage > 0 && tripDistance > 0 && averageFuelPrice > 0) {
                                        const fuelConsumed = tripDistance / mileage; 
                                        fuelCostForThisTrip = fuelConsumed * averageFuelPrice;
                                    }

                                    const netProfit = (Number(e.amount) || 0) - fuelCostForThisTrip - tripExpenses;
                                    
                                    return (
                                        <tr key={e._id} className="hover:bg-cyan-500/10 border-b border-cyan-500/10">
                                            <td className="px-4 py-2 text-left">{new Date(e.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-2 text-left">{e.title}</td>
                                            <td className="px-4 py-2">{Number(e.amount).toFixed(2)}</td>
                                            <td className="px-4 py-2">{e.distance || 0}</td>
                                            <td className="px-4 py-2">{e.extraExpenses.toFixed(2)}</td>
                                            <td className="px-4 py-2">{e.otherExpenses.toFixed(2)}</td>
                                            <td className={`px-4 py-2 font-bold ${netProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {netProfit.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2">
                                                <button
                                                    onClick={() => removeExpenseEntry(e._id)}
                                                    className="bg-red-600 px-2 py-1 rounded-xl hover:bg-red-700 text-white text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                  <p className="text-gray-400 italic">
                    No trips added yet. Use the form above!
                  </p>
                )}
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Costs;