import React, { useState } from "react";
import { useAppContext } from "../context/AppContext"; // Import context to get vehicle ID

const getTodayDate = () => {
    const today = new Date();
    // Uses toISOString and splits to get the "YYYY-MM-DD" part
    return today.toISOString().split('T')[0];
};

const AddExpenseModal = ({ isOpen, onClose, onSave }) => {
  const { profile } = useAppContext(); // Get profile for vehicle ID
  
  const [entryType, setEntryType] = useState("single"); // single or multiple
  
  // 🚨 FIX 1: Initial state must include the mandatory 'distance' field
  const defaultEntry = { platform: "", fare: "", distance: "", date: getTodayDate() };
  
  const [rideData, setRideData] = useState(defaultEntry);
  const [multipleData, setMultipleData] = useState([defaultEntry]);

  if (!isOpen) return null;

  const handleChange = (e, index = null) => {
    const { name, value } = e.target;
    if (entryType === "single") {
      setRideData({ ...rideData, [name]: value });
    } else {
      const temp = [...multipleData];
      // 🚨 FIX: Safely merge update into the specific index object
      temp[index] = { ...temp[index], [name]: value }; 
      setMultipleData(temp);
    }
  };

  const addMoreRows = () => setMultipleData([...multipleData, defaultEntry]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const vehicleId = profile?.vehicle?._id;

    // 🚨 FIX 2: Data preparation now includes distance and explicit zeros for detailed fields
    const prepareEntry = (d) => ({
      title: d.platform,
      amount: Number(d.fare),
      distance: Number(d.distance) || 0, // Mandatory short field
      date: d.date,
      vehicle: vehicleId,
      // Mandatory zeros for optional detailed fields (as this is the SHORT entry modal)
      extraExpenses: 0, 
      otherExpenses: 0, 
    });

    let entries;
    // 🚨 FIX 3: Filter condition updated to require all mandatory fields (platform, fare, date, distance)
    if (entryType === "single") {
      entries = [rideData].filter(d => d.fare && d.date && d.distance && d.platform);
    } else {
      entries = multipleData.filter(d => d.fare && d.date && d.distance && d.platform);
    }
    
    if (entries.length === 0) {
        // Use a simple alert since custom modal is too complex for this exchange
        alert("Please fill in all mandatory fields: Date, Platform, Fare, and Distance.");
        return;
    }

    onSave(entries.map(prepareEntry));
    
    // Reset state using the updated defaultEntry
    setRideData(defaultEntry);
    setMultipleData([defaultEntry]);
    
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
              <div key={idx} className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Date Input */}
                <input
                  type="date"
                  name="date"
                  value={data.date}
                  onChange={(e) => handleChange(e, idx)}
                  className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-700 text-white placeholder-gray-400"
                  placeholder="dd-mm-yyyy"
                  required
                />
                {/* Platform Input */}
                <input
                  type="text"
                  name="platform"
                  placeholder="Platform"
                  value={data.platform}
                  onChange={(e) => handleChange(e, idx)}
                  className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-700 text-white placeholder-gray-400"
                  required
                />
                {/* Fare Input */}
                <input
                  type="number"
                  name="fare"
                  placeholder="Fare (₹)"
                  value={data.fare}
                  onChange={(e) => handleChange(e, idx)}
                  className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-700 text-white placeholder-gray-400"
                  required
                />
                {/* 🚨 FIX 4: ADDED Distance input field */}
                <input
                  type="number"
                  name="distance"
                  placeholder="Distance (km)"
                  value={data.distance}
                  onChange={(e) => handleChange(e, idx)}
                  className="p-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-gray-700 text-white placeholder-gray-400"
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
