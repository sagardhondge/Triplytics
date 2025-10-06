import React from "react";
import { Truck, PlusCircle } from "lucide-react";
import Navbar from "../components/Navbar"; // Assuming you need Navbar here
import { useAppContext } from "../context/AppContext";

const Vehicles = () => {
  const { vehicles, updateVehicles } = useAppContext();

  // --- Handle vehicle input changes ---
  const handleChange = (id, e) => {
    const newVehicles = vehicles.map((v) =>
      v.id === id ? { ...v, [e.target.name]: e.target.value } : v
    );
    updateVehicles(newVehicles); // Update global context state
  };

  // --- Add new vehicle ---
  const addVehicle = () => {
    updateVehicles([
      ...vehicles,
      { id: Date.now(), name: "", type: "", mileage: "", fuelType: "" },
    ]);
  };

  // --- Remove vehicle ---
  const removeVehicle = (id) => {
    updateVehicles(vehicles.filter((v) => v.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto pt-24 px-6 md:p-10">
        <h1 className="text-3xl font-extrabold text-cyan-300 mb-8 flex items-center gap-3">
          <Truck className="text-cyan-400" size={30} /> Vehicle Management
        </h1>

        <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-cyan-500/20">
          {vehicles.map((v) => (
            <div key={v.id} className="grid md:grid-cols-5 gap-4 mb-4">
              <input
                type="text"
                name="name"
                placeholder="Vehicle Name"
                value={v.name}
                onChange={(e) => handleChange(v.id, e)}
                className="p-3 border rounded-xl bg-gray-700 border-gray-600 focus:ring-cyan-500"
              />
              <select
                name="type"
                value={v.type}
                onChange={(e) => handleChange(v.id, e)}
                className="p-3 border rounded-xl bg-gray-700 border-gray-600 focus:ring-cyan-500"
              >
                <option value="">Vehicle Type</option>
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Truck">Truck</option>
              </select>
              <input
                type="number"
                name="mileage"
                placeholder="Mileage (km/L)"
                value={v.mileage}
                onChange={(e) => handleChange(v.id, e)}
                className="p-3 border rounded-xl bg-gray-700 border-gray-600 focus:ring-cyan-500"
              />
              <select
                name="fuelType"
                value={v.fuelType}
                onChange={(e) => handleChange(v.id, e)}
                className="p-3 border rounded-xl bg-gray-700 border-gray-600 focus:ring-cyan-500"
              >
                <option value="">Fuel Type</option>
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electricity">Electricity</option>
              </select>
              <button
                onClick={() => removeVehicle(v.id)}
                className="bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 transition-all"
              >
                Remove
              </button>
            </div>
          ))}

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
