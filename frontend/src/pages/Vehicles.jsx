import React from "react";
import { Truck, PlusCircle, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAppContext } from "../context/AppContext";

const ALL_FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electricity"];

const Vehicles = () => {
  const { vehicles, updateVehicles } = useAppContext();

  // --- Handle vehicle input changes (Name, Type, Mileage) ---
  const handleChange = (id, e) => {
    const newVehicles = vehicles.map((v) =>
      v.id === id ? { ...v, [e.target.name]: e.target.value } : v
    );
    updateVehicles(newVehicles); // Update global context state
  };

  // --- Handle Fuel Checkbox Change (for multiple fuel types) ---
  const handleFuelChange = (id, fuelType) => {
    const newVehicles = vehicles.map((v) => {
      if (v.id === id) {
        // Ensure fuelType is an array, defaulting to empty if null/undefined
        const currentFuels = v.fuelType || [];
        
        // Toggle the selected fuel type
        if (currentFuels.includes(fuelType)) {
          // If selected, remove it
          return { ...v, fuelType: currentFuels.filter((f) => f !== fuelType) };
        } else {
          // If not selected, add it
          return { ...v, fuelType: [...currentFuels, fuelType] };
        }
      }
      return v;
    });
    updateVehicles(newVehicles);
  };

  // --- Add new vehicle ---
  const addVehicle = () => {
    updateVehicles([
      ...vehicles,
      // Initialize fuelType as an empty array to support multi-selection
      { id: Date.now(), name: "", type: "", mileage: "", fuelType: [] }, 
    ]);
  };

  // --- Remove vehicle ---
  const removeVehicle = (id) => {
    updateVehicles(vehicles.filter((v) => v.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto pt-32 px-6 md:p-10">
        <h1 className="text-3xl font-extrabold text-cyan-300 mb-8 flex items-center gap-3">
          <Truck className="text-cyan-400" size={30} /> Vehicle Management
        </h1>

        <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-cyan-500/20">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="grid grid-cols-6 gap-4 mb-4 p-4 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all items-center"
            >
              {/* Vehicle Name (Col Span 2) */}
              <input
                type="text"
                name="name"
                placeholder="Vehicle Name"
                value={v.name}
                onChange={(e) => handleChange(v.id, e)}
                className="p-3 border rounded-lg bg-gray-700 border-gray-600 focus:ring-cyan-500 col-span-2"
              />
              {/* Vehicle Type (Col Span 1) */}
              <select
                name="type"
                value={v.type}
                onChange={(e) => handleChange(v.id, e)}
                className="p-3 border rounded-lg bg-gray-700 border-gray-600 focus:ring-cyan-500 col-span-1"
              >
                <option value="">Type</option>
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Truck">Truck</option>
              </select>
              {/* Mileage (Col Span 1) */}
              <input
                type="number"
                name="mileage"
                placeholder="Mileage (km/L)"
                value={v.mileage}
                onChange={(e) => handleChange(v.id, e)}
                className="p-3 border rounded-lg bg-gray-700 border-gray-600 focus:ring-cyan-500 col-span-1"
              />
              
              {/* Fuel Type (Multiple Selection Dropdown) (Col Span 1) */}
              <div className="relative col-span-1">
                {/* Using a <details> element for the custom dropdown/popover effect */}
                <details className="dropdown w-full">
                  <summary className="p-3 border rounded-lg bg-gray-700 border-gray-600 hover:border-cyan-500 focus:ring-cyan-500 cursor-pointer text-sm">
                    {/* FIX: Safely check if v.fuelType is an array before joining, using empty array as fallback */}
                    {Array.isArray(v.fuelType) && v.fuelType.length > 0
                      ? v.fuelType.join(", ")
                      : "Select Fuel(s)"}
                  </summary>
                  <ul className="absolute z-10 w-full mt-1 bg-gray-700 rounded-lg shadow-xl p-2 border border-cyan-500/50">
                    {ALL_FUEL_TYPES.map((fuel) => (
                      <li key={fuel} className="flex items-center p-2 hover:bg-gray-600 rounded-md cursor-pointer">
                        <input
                          type="checkbox"
                          id={`fuel-${v.id}-${fuel}`}
                          checked={v.fuelType && v.fuelType.includes(fuel)}
                          onChange={() => handleFuelChange(v.id, fuel)}
                          className="mr-2 h-4 w-4 text-cyan-500 bg-gray-800 border-gray-600 rounded focus:ring-cyan-500"
                        />
                        <label htmlFor={`fuel-${v.id}-${fuel}`} className="text-gray-200 text-sm">
                          {fuel}
                        </label>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>

              {/* Remove Button (Col Span 1) */}
              <button
                onClick={() => removeVehicle(v.id)}
                className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-all col-span-1 flex items-center justify-center gap-1 font-semibold"
              >
                <Trash2 size={18} /> Remove
              </button>
            </div>
          ))}

          {/* Add Vehicle Button */}
          <button
            onClick={addVehicle}
            className="mt-4 bg-cyan-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-cyan-700 transition-all flex items-center gap-2"
          >
            <PlusCircle /> Add Vehicle
          </button>
        </div>
      </div>
    </div>
  );
};

export default Vehicles;
