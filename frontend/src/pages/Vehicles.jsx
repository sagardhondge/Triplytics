// src/pages/Vehicles.jsx
import React, { useState } from "react";
import { Truck, PlusCircle } from "lucide-react";

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([
    { id: Date.now(), name: "", type: "", mileage: "", fuelType: "" },
  ]);

  // --- Handle vehicle input changes ---
  const handleChange = (id, e) => {
    setVehicles((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [e.target.name]: e.target.value } : v))
    );
  };

  // --- Add new vehicle ---
  const addVehicle = () => {
    setVehicles([
      ...vehicles,
      { id: Date.now(), name: "", type: "", mileage: "", fuelType: "" },
    ]);
  };

  // --- Remove vehicle ---
  const removeVehicle = (id) => {
    setVehicles(vehicles.filter((v) => v.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold text-green-700 mb-8 flex items-center gap-3">
          <Truck className="text-green-600" size={30} /> Vehicle Management
        </h1>

        {vehicles.map((v) => (
          <div key={v.id} className="grid md:grid-cols-5 gap-4 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Vehicle Name"
              value={v.name}
              onChange={(e) => handleChange(v.id, e)}
              className="p-3 border rounded-xl"
            />
            <select
              name="type"
              value={v.type}
              onChange={(e) => handleChange(v.id, e)}
              className="p-3 border rounded-xl"
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
              className="p-3 border rounded-xl"
            />
            <select
              name="fuelType"
              value={v.fuelType}
              onChange={(e) => handleChange(v.id, e)}
              className="p-3 border rounded-xl"
            >
              <option value="">Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="CNG">CNG</option>
              <option value="Electricity">Electricity</option>
            </select>
            <button
              onClick={() => removeVehicle(v.id)}
              className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition-all"
            >
              Remove
            </button>
          </div>
        ))}

        <button
          onClick={addVehicle}
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center gap-2"
        >
          <PlusCircle /> Add Vehicle
        </button>
      </div>
    </div>
  );
};

export default Vehicles;
