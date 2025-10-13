import React, { useState } from "react";
import { Wallet, ChevronDown, ChevronUp, X } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAppContext } from "../context/AppContext";

const Costs = () => {
  const { 
    vehicles, 
    expenses, 
    loading, 
    error,
    addExpense,
    updateExpense,
    deleteExpense
  } = useAppContext();

  // ----------------------------- LOCAL STATE -----------------------------
  const [fuelEntries, setFuelEntries] = useState([
    { id: Date.now(), type: "", litres: "", pricePerLitre: "" },
  ]);

  const [showFuel, setShowFuel] = useState(true);
  const [showExpense, setShowExpense] = useState(true);

  // ----------------------------- FUEL HANDLERS -----------------------------
  const handleFuelChange = (id, e) => {
    const { name, value } = e.target;
    setFuelEntries((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [name]: value } : f))
    );
  };

  const addFuelEntry = () => {
    setFuelEntries([
      ...fuelEntries,
      { id: Date.now(), type: "", litres: "", pricePerLitre: "" },
    ]);
  };

  const removeFuelEntry = (id) => {
    setFuelEntries(fuelEntries.filter((f) => f.id !== id));
  };

  // ----------------------------- CALCULATIONS -----------------------------
  const totalFuel = fuelEntries.reduce(
    (acc, f) => acc + Number(f.litres || 0),
    0
  );

  const fuelCost = fuelEntries.reduce(
    (acc, f) => acc + Number(f.litres || 0) * Number(f.pricePerLitre || 0),
    0
  );

  const avgFuelPrice = fuelCost / (totalFuel || 1);

  const totalFuelUsed = expenses.reduce((acc, e) => {
    const vehicle = vehicles.find((v) => v.name === e.vehicle);
    if (vehicle && e.distance && vehicle.mileage) {
      return acc + Number(e.distance) / Number(vehicle.mileage);
    }
    return acc;
  }, 0);

  // ----------------------------- EXPENSE HANDLERS -----------------------------
  const handleExpenseChange = (id, e) => {
    const { name, value } = e.target;
    const updatedFields = { [name]: value };

    // Update state immediately for responsive UI
    const updatedEntries = expenses.map((exp) =>
      exp._id === id ? { ...exp, ...updatedFields } : exp
    );

    // Call the context function to update the global state
    // We will update the global state and then the backend on blur
    // updateExpense(id, updatedFields);
  };
  
  // This function is triggered on blur to save changes to the backend
  const saveExpenseEntry = async (expense) => {
      // The updateExpense function is now handled by the context hook
      updateExpense(expense._id, expense);
  };

  const addExpenseEntry = () => {
    // Call the addExpense function from useAppContext
    addExpense({
      title: "New Trip",
      date: new Date().toISOString().split("T")[0],
      vehicle: vehicles[0]?._id || "",
      platform: "",
      amount: 0,
      category: "Other",
      notes: "",
    });
  };

  const removeExpenseEntry = (id) => {
    // Call the deleteExpense function from useAppContext
    deleteExpense(id);
  };

  // ----------------------------- TOTAL COST -----------------------------
  const totalExpense = expenses.reduce((acc, e) => {
    // Note: fuelCost and others are not in the Expense model
    const totalTripCost = Number(e.amount || 0);
    return acc + totalTripCost;
  }, 0);
  
  // Conditionally render based on loading and error state
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

  // ----------------------------- UI -----------------------------
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
            <h2 className="text-2xl font-semibold text-gray-200 mb-4">Summary</h2>
            <div className="bg-gray-700/50 p-6 rounded-xl shadow-inner grid md:grid-cols-3 gap-4 border border-gray-700">
              <p>
                Total Rides Logged:{" "}
                <span className="font-bold text-cyan-300">
                  {expenses.length}
                </span>
              </p>
              <p>
                Total Fuel Purchased (L):{" "}
                <span className="font-bold">{totalFuel.toFixed(2)}</span>
              </p>
              <p>
                Total Fuel Cost:{" "}
                <span className="text-cyan-300 font-extrabold">
                  ₹ {fuelCost.toFixed(2)}
                </span>
              </p>
              <p>
                Estimated Fuel Used (L):{" "}
                <span className="font-bold">{totalFuelUsed.toFixed(2)}</span>
              </p>
              <p>
                Remaining Fuel (L):{" "}
                <span className="text-green-400 font-extrabold">
                  {(totalFuel - totalFuelUsed).toFixed(2)}
                </span>
              </p>
              <p>
                Total Trip Costs:{" "}
                <span className="text-red-400 font-extrabold">
                  ₹ {totalExpense.toFixed(2)}
                </span>
              </p>
            </div>
          </section>

          {/* ===================== FUEL SECTION ===================== */}
          <section className="mb-10">
            <div
              className="flex items-center justify-between cursor-pointer border-t border-cyan-500/30 pt-6 mb-4"
              onClick={() => setShowFuel(!showFuel)}
            >
              <h2 className="text-2xl font-semibold text-gray-200">
                Fuel Entries
              </h2>
              {showFuel ? (
                <ChevronUp className="text-cyan-400" />
              ) : (
                <ChevronDown className="text-cyan-400" />
              )}
            </div>

            {showFuel && (
              <>
                {fuelEntries.map((f) => (
                  <div
                    key={f.id}
                    className="grid md:grid-cols-6 gap-4 mb-4 items-center bg-gray-700/30 p-4 rounded-xl"
                  >
                    <select
                      name="type"
                      value={f.type}
                      onChange={(e) => handleFuelChange(f.id, e)}
                      className="p-3 border rounded-xl bg-gray-700 border-gray-600 text-white"
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
                      value={f.litres}
                      onChange={(e) => handleFuelChange(f.id, e)}
                      className="p-3 border rounded-xl bg-gray-700 border-gray-600 text-white"
                    />

                    <input
                      type="number"
                      name="pricePerLitre"
                      placeholder="Price per Litre ₹"
                      value={f.pricePerLitre}
                      onChange={(e) => handleFuelChange(f.id, e)}
                      className="p-3 border rounded-xl bg-gray-700 border-gray-600 text-white"
                    />

                    <p className="flex items-center font-semibold text-cyan-300">
                      Total: ₹
                      {(Number(f.litres) * Number(f.pricePerLitre) || 0).toFixed(2)}
                    </p>

                    <button
                      onClick={() => removeFuelEntry(f.id)}
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

          {/* ===================== TRIP / EXPENSE SECTION ===================== */}
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
                {expenses.length > 0 ? (
                  expenses.map((e) => (
                    <div
                      key={e._id}
                      className="grid md:grid-cols-8 gap-4 mb-4 bg-gray-700/30 p-4 rounded-xl"
                    >
                      <input
                        type="date"
                        name="date"
                        value={e.date ? new Date(e.date).toISOString().split('T')[0] : ''}
                        onChange={(ev) => {
                            const updatedFields = { date: ev.target.value };
                            updateExpense(e._id, updatedFields);
                        }}
                        className="p-3 border rounded-xl bg-gray-700 border-gray-600 text-white"
                      />

                      <select
                        name="vehicle"
                        value={e.vehicle || ""}
                        onChange={(ev) => {
                            const updatedFields = { vehicle: ev.target.value };
                            updateExpense(e._id, updatedFields);
                        }}
                        className="p-3 border rounded-xl bg-gray-700 border-gray-600 text-white"
                      >
                        <option value="">Select Vehicle</option>
                        {(vehicles || []).map((v) => (
                          <option key={v._id} value={v._id}>
                            {v.name}
                          </option>
                        ))}
                      </select>

                      <input
                        type="text"
                        name="title"
                        placeholder="Trip Title (e.g., Uber Trip)"
                        value={e.title || ""}
                        onChange={(ev) => {
                            const updatedFields = { title: ev.target.value };
                            updateExpense(e._id, updatedFields);
                        }}
                        className="p-3 border rounded-xl bg-gray-700 border-gray-600 text-white"
                      />

                      <input
                        type="number"
                        name="amount"
                        placeholder="Amount (₹)"
                        value={e.amount || ""}
                        onChange={(ev) => {
                            const updatedFields = { amount: ev.target.value };
                            updateExpense(e._id, updatedFields);
                        }}
                        className="p-3 border rounded-xl bg-gray-700 border-gray-600 text-white"
                      />

                      <select
                        name="category"
                        value={e.category || ""}
                        onChange={(ev) => {
                            const updatedFields = { category: ev.target.value };
                            updateExpense(e._id, updatedFields);
                        }}
                        className="p-3 border rounded-xl bg-gray-700 border-gray-600 text-white"
                      >
                        <option value="">Category</option>
                        <option value="Fuel">Fuel</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Toll">Toll</option>
                        <option value="Parking">Parking</option>
                        <option value="Other">Other</option>
                      </select>

                      <input
                        type="text"
                        name="notes"
                        placeholder="Notes"
                        value={e.notes || ""}
                        onChange={(ev) => {
                            const updatedFields = { notes: ev.target.value };
                            updateExpense(e._id, updatedFields);
                        }}
                        className="p-3 border rounded-xl bg-gray-700 border-gray-600 text-white"
                      />

                      <div className="flex items-center justify-center">
                        <button
                          onClick={() => removeExpenseEntry(e._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all w-full"
                        >
                          <X className="w-5 h-5 mx-auto" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-400 italic">
                    No trips added yet. Add from Dashboard or click below.
                  </p>
                )}

                <button
                  onClick={addExpenseEntry}
                  className="mt-2 bg-cyan-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-cyan-700 transition-all"
                >
                  + Add Trip Entry
                </button>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Costs;