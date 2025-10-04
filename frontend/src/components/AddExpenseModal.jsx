// src/components/AddExpenseModal.jsx
import React, { useState } from "react";

const AddExpenseModal = ({ isOpen, onClose, onSave }) => {
  const [entryType, setEntryType] = useState("single"); // single or multiple
  const [rideData, setRideData] = useState({ platform: "", fare: "", date: "" });
  const [multipleData, setMultipleData] = useState([{ platform: "", fare: "", date: "" }]);

  if (!isOpen) return null;

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (entryType === "single") {
      setRideData({ ...rideData, [name]: value });
    } else {
      const temp = [...multipleData];
      temp[index][name] = value;
      setMultipleData(temp);
    }
  };

  const addMoreRows = () => setMultipleData([...multipleData, { platform: "", fare: "", date: "" }]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (entryType === "single") {
      onSave([rideData]);
    } else {
      onSave(multipleData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl relative shadow-2xl">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 font-bold"
          onClick={onClose}
        >
          X
        </button>
        <h2 className="text-2xl font-bold mb-4">Add Ride / Expense</h2>

        {/* Entry Type Toggle */}
        <div className="flex gap-4 mb-4">
          <button
            className={`px-4 py-2 rounded-xl font-semibold ${
              entryType === "single" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setEntryType("single")}
          >
            Single Entry
          </button>
          <button
            className={`px-4 py-2 rounded-xl font-semibold ${
              entryType === "multiple" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setEntryType("multiple")}
          >
            Multiple Entries
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {entryType === "single" ? (
            <>
              <input
                type="text"
                name="platform"
                placeholder="Platform (Ola/Uber/Doofer)"
                value={rideData.platform}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="number"
                name="fare"
                placeholder="Fare (₹)"
                value={rideData.fare}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <input
                type="date"
                name="date"
                value={rideData.date}
                onChange={handleChange}
                className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </>
          ) : (
            <>
              {multipleData.map((data, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    name="platform"
                    placeholder="Platform"
                    value={data.platform}
                    onChange={(e) => handleChange(e, idx)}
                    className="p-2 border rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="number"
                    name="fare"
                    placeholder="Fare"
                    value={data.fare}
                    onChange={(e) => handleChange(e, idx)}
                    className="p-2 border rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="date"
                    name="date"
                    value={data.date}
                    onChange={(e) => handleChange(e, idx)}
                    className="p-2 border rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}
              <button
                type="button"
                className="mt-2 text-blue-600 font-semibold hover:underline"
                onClick={addMoreRows}
              >
                + Add More
              </button>
            </>
          )}

          <button
            type="submit"
            className="mt-4 bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
