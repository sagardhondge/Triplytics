// src/pages/Costs.jsx
import React, { useState } from "react";
import { Wallet, ChevronDown, ChevronUp } from "lucide-react";

const Costs = ({ vehicles = [] }) => {
  // --- State ---
  const [fuelEntries, setFuelEntries] = useState([
    { id: Date.now(), type: "", litres: "", pricePerLitre: "" },
  ]);

  const [expenseEntries, setExpenseEntries] = useState([
    {
      id: Date.now(),
      date: new Date().toISOString().slice(0, 10),
      vehicle: "",
      tripName: "",
      distance: "",
      amount: "",
      others: "",
      platform: "",
    },
  ]);

  const [showFuel, setShowFuel] = useState(true);
  const [showExpense, setShowExpense] = useState(true);

  // --- Fuel Entries ---
  const handleFuelChange = (id, e) => {
    setFuelEntries((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [e.target.name]: e.target.value } : f))
    );
  };

  const addFuelEntry = () => {
    setFuelEntries([...fuelEntries, { id: Date.now(), type: "", litres: "", pricePerLitre: "" }]);
  };

  const removeFuelEntry = (id) => {
    setFuelEntries(fuelEntries.filter((f) => f.id !== id));
  };

  // --- Expense Entries ---
  const handleExpenseChange = (id, e) => {
    setExpenseEntries((prev) =>
      prev.map((exp) => (exp.id === id ? { ...exp, [e.target.name]: e.target.value } : exp))
    );
  };

  const addExpenseEntry = () => {
    setExpenseEntries([
      ...expenseEntries,
      {
        id: Date.now(),
        date: new Date().toISOString().slice(0, 10),
        vehicle: "",
        tripName: "",
        distance: "",
        amount: "",
        others: "",
        platform: "",
      },
    ]);
  };

  const removeExpenseEntry = (id) => {
    setExpenseEntries(expenseEntries.filter((e) => e.id !== id));
  };

  // --- Calculations ---
  const totalFuel = fuelEntries.reduce((acc, f) => acc + Number(f.litres || 0), 0);
  const fuelCost = fuelEntries.reduce(
    (acc, f) => acc + Number(f.litres || 0) * Number(f.pricePerLitre || 0),
    0
  );

  // Calculate remaining fuel based on trips
  const totalFuelUsed = expenseEntries.reduce((acc, e) => {
    const vehicle = vehicles.find((v) => v.name === e.vehicle);
    if (vehicle && e.distance && vehicle.mileage) {
      return acc + Number(e.distance) / Number(vehicle.mileage);
    }
    return acc;
  }, 0);

  // Total expense after subtracting fuel used cost
  const totalExpense = expenseEntries.reduce((acc, e) => {
    const vehicle = vehicles.find((v) => v.name === e.vehicle);
    let fuelUsed = 0;
    if (vehicle && e.distance && vehicle.mileage) {
      fuelUsed = Number(e.distance) / Number(vehicle.mileage);
    }
    // Use average fuel price
    const avgFuelPrice =
      fuelEntries.reduce((sum, f) => sum + Number(f.litres || 0) * Number(f.pricePerLitre || 0), 0) /
      (totalFuel || 1);
    const fuelCostForTrip = fuelUsed * avgFuelPrice;
    return acc + Number(e.amount || 0) + Number(e.others || 0) - fuelCostForTrip;
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-8 flex items-center gap-3">
          <Wallet className="text-blue-600" size={30} /> Cost Management
        </h1>

        {/* --- Summary Section --- */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Summary</h2>
          <div className="bg-blue-50 p-6 rounded-2xl shadow-inner grid md:grid-cols-2 gap-4">
            <p>Total Rides: <span className="font-bold">{expenseEntries.length}</span></p>
            <p>Total Fuel (Litres): <span className="font-bold">{totalFuel.toFixed(2)}</span></p>
            <p>Fuel Cost: <span className="text-blue-700 font-extrabold">₹ {fuelCost.toFixed(2)}</span></p>
            <p>Remaining Fuel: <span className="text-green-700 font-extrabold">{(totalFuel - totalFuelUsed).toFixed(2)} L</span></p>
            <p>Total Expense (after fuel deduction): <span className="text-red-600 font-extrabold">₹ {totalExpense.toFixed(2)}</span></p>
          </div>
        </section>

        {/* --- Fuel Section --- */}
        <section className="mb-10">
          <div
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => setShowFuel(!showFuel)}
          >
            <h2 className="text-2xl font-semibold text-gray-800">Fuel Entries</h2>
            {showFuel ? <ChevronUp /> : <ChevronDown />}
          </div>
          {showFuel &&
            fuelEntries.map((f) => (
              <div key={f.id} className="grid md:grid-cols-5 gap-4 mb-4">
                <select
                  name="type"
                  value={f.type}
                  onChange={(e) => handleFuelChange(f.id, e)}
                  className="p-3 border rounded-xl"
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
                  className="p-3 border rounded-xl"
                />
                <input
                  type="number"
                  name="pricePerLitre"
                  placeholder="Price per Litre ₹"
                  value={f.pricePerLitre}
                  onChange={(e) => handleFuelChange(f.id, e)}
                  className="p-3 border rounded-xl"
                />
                <p className="flex items-center font-semibold">
                  Total: ₹ {(Number(f.litres) * Number(f.pricePerLitre) || 0).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFuelEntry(f.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-all"
                >
                  Remove
                </button>
              </div>
            ))}
          {showFuel && (
            <button
              onClick={addFuelEntry}
              className="mt-2 bg-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-all"
            >
              + Add Fuel Entry
            </button>
          )}
        </section>

        {/* --- Expense Section --- */}
        <section className="mb-10">
          <div
            className="flex items-center justify-between cursor-pointer mb-4"
            onClick={() => setShowExpense(!showExpense)}
          >
            <h2 className="text-2xl font-semibold text-gray-800">Expense Entries</h2>
            {showExpense ? <ChevronUp /> : <ChevronDown />}
          </div>
          {showExpense &&
            expenseEntries.map((e) => (
              <div key={e.id} className="grid md:grid-cols-6 gap-4 mb-4">
                <input
                  type="date"
                  name="date"
                  value={e.date}
                  onChange={(ev) => handleExpenseChange(e.id, ev)}
                  className="p-3 border rounded-xl"
                />
                <select
                  name="vehicle"
                  value={e.vehicle}
                  onChange={(ev) => handleExpenseChange(e.id, ev)}
                  className="p-3 border rounded-xl"
                >
                  <option value="">Select Vehicle</option>
                  {(vehicles || []).map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  name="tripName"
                  placeholder="Trip Name"
                  value={e.tripName}
                  onChange={(ev) => handleExpenseChange(e.id, ev)}
                  className="p-3 border rounded-xl"
                />
                <input
                  type="number"
                  name="distance"
                  placeholder="Distance (km)"
                  value={e.distance}
                  onChange={(ev) => handleExpenseChange(e.id, ev)}
                  className="p-3 border rounded-xl"
                />
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount ₹"
                  value={e.amount}
                  onChange={(ev) => handleExpenseChange(e.id, ev)}
                  className="p-3 border rounded-xl"
                />
                <input
                  type="text"
                  name="platform"
                  placeholder="Platform"
                  value={e.platform}
                  onChange={(ev) => handleExpenseChange(e.id, ev)}
                  className="p-3 border rounded-xl"
                />
                <button
                  onClick={() => removeExpenseEntry(e.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-all col-span-full md:col-span-1"
                >
                  Remove
                </button>
              </div>
            ))}
          {showExpense && (
            <button
              onClick={addExpenseEntry}
              className="mt-2 bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition-all"
            >
              + Add Expense Entry
            </button>
          )}
        </section>
      </div>
    </div>
  );
};

export default Costs;
