import React, { useState } from "react";
import { PlusCircle, Calculator, Wallet } from "lucide-react";

const CostDetails = () => {
  const [quickEntry, setQuickEntry] = useState({
    date: "",
    type: "",
    amount: "",
    notes: "",
  });

  const [detailedEntry, setDetailedEntry] = useState({
    tripName: "",
    start: "",
    end: "",
    distance: "",
    fuelCost: "",
    maintenance: "",
    others: "",
  });

  const [entries, setEntries] = useState([]);

  const handleQuickChange = (e) => {
    setQuickEntry({ ...quickEntry, [e.target.name]: e.target.value });
  };

  const handleDetailedChange = (e) => {
    setDetailedEntry({ ...detailedEntry, [e.target.name]: e.target.value });
  };

  const handleQuickAdd = () => {
    if (!quickEntry.type || !quickEntry.amount) return;
    setEntries([
      ...entries,
      { ...quickEntry, id: Date.now(), category: "Quick" },
    ]);
    setQuickEntry({ date: "", type: "", amount: "", notes: "" });
  };

  const handleDetailedAdd = () => {
    const total =
      Number(detailedEntry.fuelCost || 0) +
      Number(detailedEntry.maintenance || 0) +
      Number(detailedEntry.others || 0);

    if (!detailedEntry.tripName || !total) return;
    setEntries([
      ...entries,
      {
        ...detailedEntry,
        total,
        id: Date.now(),
        category: "Detailed",
      },
    ]);
    setDetailedEntry({
      tripName: "",
      start: "",
      end: "",
      distance: "",
      fuelCost: "",
      maintenance: "",
      others: "",
    });
  };

  // Calculate summary totals
  const totalSpent = entries.reduce((acc, e) => acc + (Number(e.amount) || e.total || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-blue-700 mb-8 flex items-center gap-3">
          <Wallet className="text-blue-600" size={30} /> Cost Management
        </h1>

        {/* Quick Entry Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <PlusCircle className="text-blue-500" /> Quick Entry
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <input
              type="date"
              name="date"
              value={quickEntry.date}
              onChange={handleQuickChange}
              className="p-3 border rounded-xl"
            />
            <select
              name="type"
              value={quickEntry.type}
              onChange={handleQuickChange}
              className="p-3 border rounded-xl"
            >
              <option value="">Select Type</option>
              <option value="Fuel">Fuel</option>
              <option value="Toll">Toll</option>
              <option value="Parking">Parking</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Other">Other</option>
            </select>
            <input
              type="number"
              name="amount"
              placeholder="Amount ₹"
              value={quickEntry.amount}
              onChange={handleQuickChange}
              className="p-3 border rounded-xl"
            />
            <input
              type="text"
              name="notes"
              placeholder="Notes"
              value={quickEntry.notes}
              onChange={handleQuickChange}
              className="p-3 border rounded-xl"
            />
          </div>
          <button
            onClick={handleQuickAdd}
            className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-xl font-semibold hover:bg-blue-700 transition-all"
          >
            Add Entry
          </button>
        </section>

        {/* Detailed Entry Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Calculator className="text-blue-500" /> Detailed Entry
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              name="tripName"
              placeholder="Trip Name"
              value={detailedEntry.tripName}
              onChange={handleDetailedChange}
              className="p-3 border rounded-xl"
            />
            <input
              type="text"
              name="start"
              placeholder="Start Location"
              value={detailedEntry.start}
              onChange={handleDetailedChange}
              className="p-3 border rounded-xl"
            />
            <input
              type="text"
              name="end"
              placeholder="End Location"
              value={detailedEntry.end}
              onChange={handleDetailedChange}
              className="p-3 border rounded-xl"
            />
            <input
              type="number"
              name="distance"
              placeholder="Distance (km)"
              value={detailedEntry.distance}
              onChange={handleDetailedChange}
              className="p-3 border rounded-xl"
            />
            <input
              type="number"
              name="fuelCost"
              placeholder="Fuel Cost ₹"
              value={detailedEntry.fuelCost}
              onChange={handleDetailedChange}
              className="p-3 border rounded-xl"
            />
            <input
              type="number"
              name="maintenance"
              placeholder="Maintenance ₹"
              value={detailedEntry.maintenance}
              onChange={handleDetailedChange}
              className="p-3 border rounded-xl"
            />
            <input
              type="number"
              name="others"
              placeholder="Other Expenses ₹"
              value={detailedEntry.others}
              onChange={handleDetailedChange}
              className="p-3 border rounded-xl"
            />
          </div>
          <button
            onClick={handleDetailedAdd}
            className="mt-4 bg-green-600 text-white py-2 px-6 rounded-xl font-semibold hover:bg-green-700 transition-all"
          >
            Save Detailed Entry
          </button>
        </section>

        {/* Summary Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Summary
          </h2>
          <div className="bg-blue-50 p-6 rounded-2xl shadow-inner">
            <p className="text-xl font-medium text-gray-700">
              Total Entries: <span className="font-bold">{entries.length}</span>
            </p>
            <p className="text-xl font-medium text-gray-700">
              Total Spent:{" "}
              <span className="text-blue-700 font-extrabold">
                ₹ {totalSpent.toFixed(2)}
              </span>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CostDetails;
