import React, { useState, useEffect } from "react";
import { Truck, PlusCircle, Trash2 } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAppContext } from "../context/AppContext";

const ALL_FUEL_TYPES = ["Petrol", "Diesel", "CNG", "Electricity"];

const Vehicles = () => {
  const { 
    vehicles, 
    loading, 
    error, 
    addVehicle,
    updateVehicle,
    deleteVehicle
  } = useAppContext();

  // The local loading and error states are no longer needed, handled by context
  // const [loading, setLoading] = useState(false);
  // const [error, setError] = useState("");

  const handleChange = (id, e) => {
    const { name, value } = e.target;
    // Call the context update function
    updateVehicle(id, { [name]: value });
  };

  const handleFuelChange = (id, fuelType) => {
    const vehicle = vehicles.find(v => v._id === id);
    if (!vehicle) return;

    const currentFuels = Array.isArray(vehicle.fuelType) ? vehicle.fuelType : [];
    const updatedFuels = currentFuels.includes(fuelType)
      ? currentFuels.filter((f) => f !== fuelType)
      : [...currentFuels, fuelType];

    // Call the context update function
    updateVehicle(id, { fuelType: updatedFuels });
  };
  
  const handleAddVehicle = () => {
    // Call the context add function
    addVehicle({
      name: "New Vehicle",
      type: "Car",
      mileage: 0,
      fuelType: [],
    });
  };

  const handleRemoveVehicle = (id) => {
    // Call the context delete function
    deleteVehicle(id);
  };
  
  // Conditionally render based on loading and error state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-cyan-300 text-xl font-semibold">
        Loading vehicles...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-red-500 text-xl font-semibold">
        Error: Failed to load vehicles.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="pt-24 px-6 md:px-12 py-10 max-w-5xl mx-auto">
        <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-cyan-500/20">
          <h1 className="text-3xl font-extrabold text-cyan-300 mb-6 flex items-center gap-3">
            <Truck className="text-cyan-400" size={30} /> Vehicle Management
          </h1>

          {vehicles.map((v) => (
            <div
              key={v._id}
              className="grid grid-cols-6 gap-4 mb-4 p-4 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all items-center"
            >
              <input
                type="text"
                name="name"
                placeholder="Vehicle Name"
                value={v.name}
                onChange={(e) => handleChange(v._id, e)}
                className="p-3 border rounded-lg bg-gray-700 border-gray-600 focus:ring-cyan-500 col-span-2"
              />
              <select
                name="type"
                value={v.type}
                onChange={(e) => handleChange(v._id, e)}
                className="p-3 border rounded-lg bg-gray-700 border-gray-600 focus:ring-cyan-500 col-span-1"
              >
                <option value="">Type</option>
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Truck">Truck</option>
              </select>
              <input
                type="number"
                name="mileage"
                placeholder="Mileage (km/L)"
                min={0}
                value={v.mileage}
                onChange={(e) => handleChange(v._id, e)}
                className="p-3 border rounded-lg bg-gray-700 border-gray-600 focus:ring-cyan-500 col-span-1"
              />

              <div className="relative col-span-1">
                <details className="dropdown w-full">
                  <summary className="p-3 border rounded-lg bg-gray-700 border-gray-600 hover:border-cyan-500 focus:ring-cyan-500 cursor-pointer text-sm">
                    {Array.isArray(v.fuelType) && v.fuelType.length > 0
                      ? v.fuelType.join(", ")
                      : "Select Fuel(s)"}
                  </summary>
                  <ul className="absolute z-10 w-full mt-1 bg-gray-700 rounded-lg shadow-xl p-2 border border-cyan-500/50">
                    {ALL_FUEL_TYPES.map((fuel) => (
                      <li
                        key={fuel}
                        className="flex items-center p-2 hover:bg-gray-600 rounded-md cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          id={`fuel-${v._id}-${fuel}`}
                          checked={v.fuelType?.includes(fuel) || false}
                          onChange={() => {
                            handleFuelChange(v._id, fuel);
                          }}
                          className="mr-2 h-4 w-4 text-cyan-500 bg-gray-800 border-gray-600 rounded focus:ring-cyan-500"
                        />
                        <label
                          htmlFor={`fuel-${v._id}-${fuel}`}
                          className="text-gray-200 text-sm"
                        >
                          {fuel}
                        </label>
                      </li>
                    ))}
                  </ul>
                </details>
              </div>

              <button
                onClick={() => handleRemoveVehicle(v._id)}
                className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-all col-span-1 flex items-center justify-center gap-1 font-semibold"
              >
                <Trash2 size={18} /> Remove
              </button>
            </div>
          ))}

          <button
            onClick={handleAddVehicle}
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