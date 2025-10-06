import React, { useState } from "react";

const getTodayDate = () => {
    const today = new Date();
    // Uses toISOString and splits to get the "YYYY-MM-DD" part
    return today.toISOString().split('T')[0];
};

const AddExpenseModal = ({ isOpen, onClose, onSave }) => {
  const [entryType, setEntryType] = useState("single"); // single or multiple
  
  // --- UPDATED: Initial state now uses getTodayDate() ---
  const [rideData, setRideData] = useState({ platform: "", fare: "", date: getTodayDate() });
  const [multipleData, setMultipleData] = useState([{ platform: "", fare: "", date: getTodayDate() }]);

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

  const addMoreRows = () => setMultipleData([...multipleData, { platform: "", fare: "", date: getTodayDate() }]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (entryType === "single") {
      // Filter out empty rows just in case
      onSave([rideData].filter(d => d.fare && d.date));
      // Reset state for single entry, defaulting date to today
      setRideData({ platform: "", fare: "", date: getTodayDate() });
    } else {
      // Filter out incomplete rows for multiple entry
      onSave(multipleData.filter(d => d.fare && d.date));
      // Reset state for multiple entry, defaulting the first row's date to today
      setMultipleData([{ platform: "", fare: "", date: getTodayDate() }]);
    }
    onClose();
  };
  
  // Map data source to the currently active type for display
  const currentData = entryType === "single" ? [rideData] : multipleData;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 w-full max-w-2xl relative shadow-2xl border border-cyan-500/30 text-white">
        
        {/* Close Button */}
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-cyan-300 transition-colors"
          onClick={onClose}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Entry Type Toggle (Tabs) */}
        <div className="flex bg-gray-700 rounded-lg p-1 w-fit mb-6 mx-auto shadow-inner">
          <button
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
              entryType === "single" 
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/50" 
                : "text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setEntryType("single")}
          >
            Single Entry
          </button>
          <button
            className={`px-6 py-2 rounded-lg font-semibold text-sm transition-all duration-300 ${
              entryType === "multiple" 
                ? "bg-cyan-600 text-white shadow-md shadow-cyan-500/50" 
                : "text-gray-300 hover:bg-gray-600"
            }`}
            onClick={() => setEntryType("multiple")}
          >
            Multiple Entries
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col">
          
          {/* Scrollable Input Area */}
          <div className={`space-y-4 mb-4 ${entryType === "multiple" ? 'max-h-80 overflow-y-auto pr-3' : ''}`}>
            {currentData.map((data, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="date"
                  name="date"
                  value={data.date}
                  onChange={(e) => handleChange(e, idx)}
                  className="p-3 border border-gray-600 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-700 text-white placeholder-gray-400"
                  placeholder="dd-mm-yyyy"
                  required
                />
                <input
                  type="text"
                  name="platform"
                  placeholder="Platform (Ola/Uber/etc.)"
                  value={data.platform}
                  onChange={(e) => handleChange(e, idx)}
                  className="p-3 border border-gray-600 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-700 text-white placeholder-gray-400"
                  required
                />
                <input
                  type="number"
                  name="fare"
                  placeholder="Fare (₹)"
                  value={data.fare}
                  onChange={(e) => handleChange(e, idx)}
                  className="p-3 border border-gray-600 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-700 text-white placeholder-gray-400"
                  required
                />
              </div>
            ))}
          </div>

          {/* Add More Button (visible only for Multiple Entries) */}
          {entryType === "multiple" && (
            <div className="flex justify-start mb-4">
              <button
                type="button"
                className="text-cyan-400 font-semibold hover:underline px-2 py-1 transition-colors"
                onClick={addMoreRows}
              >
                + Add More
              </button>
            </div>
          )}

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-3 rounded-xl font-bold text-lg shadow-xl shadow-cyan-500/50 hover:bg-cyan-700 transition-all duration-300 transform hover:scale-[1.01]"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
