import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAppContext } from "../context/AppContext";

const Profile = () => {
  const { profile, updateProfile, loading, error } = useAppContext();
  const [localProfile, setLocalProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // 🚨 FIX 1: Safely initialize localProfile from the nested backend structure
    if (profile) {
      setLocalProfile({
        // Personal Details (Top Level)
        driverName: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        city: profile.city || "",
        
        // Vehicle Information (Nested under profile.vehicle)
        vehicleMake: profile.vehicle?.name || "", // Maps to vehicle.name
        licensePlate: profile.vehicle?.licensePlate || "",
        registrationDate: profile.vehicle?.registrationDate ? new Date(profile.vehicle.registrationDate).toISOString().split('T')[0] : "",
        mileage: profile.vehicle?.mileage || "", // 🚨 NEW FIELD: Initialize mileage
        fuelTypes: profile.vehicle?.fuelEntries?.map(f => f.type) || [], // Assuming fuelTypes are now just strings from fuelEntries
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, selectedOptions } = e.target;

    // Handle Fuel Types (Multi-Select)
    if (name === "fuelTypes") {
      const types = Array.from(selectedOptions).map((opt) => opt.value);
      setLocalProfile((prev) => ({ ...prev, fuelTypes: types }));
      return;
    }
    
    setLocalProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // 🚨 FIX 2: Transform the flat localProfile state back to the nested backend structure
    const updates = {
      name: localProfile.driverName,
      email: localProfile.email,
      phone: localProfile.phone,
      city: localProfile.city,
      vehicle: {
        name: localProfile.vehicleMake,
        licensePlate: localProfile.licensePlate,
        registrationDate: localProfile.registrationDate,
        mileage: Number(localProfile.mileage) || 0, // 🚨 NEW FIELD: Send mileage as a number
        // NOTE: The fuelEntries schema requires { type: string, litres: number, pricePerLitre: number }. 
        // This simple save only sends the type string, so we map it correctly.
        fuelEntries: localProfile.fuelTypes.map(type => ({ type })),
      },
    };
    
    await updateProfile(updates);
    setIsEditing(false);
  };

  if (loading || !localProfile) return <p className="text-white text-center mt-20">Loading profile...</p>;
  if (error) return <p className="text-red-500 text-center mt-20">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="pt-24 px-6 md:px-12 py-10 max-w-4xl mx-auto">
        <form onSubmit={handleSave}>
          {/* Personal Details */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-200">Personal Details</h2>
            <button
              type="button"
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                isEditing ? "bg-red-600 hover:bg-red-700 text-white" : "bg-cyan-600 hover:bg-cyan-700 text-gray-900"
              }`}
            >
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>

          <div className="bg-gray-800/80 p-8 rounded-xl shadow-2xl border border-cyan-500/20 mb-10 grid md:grid-cols-2 gap-6">
            {/* 🚨 UPDATED: Map to correct localProfile keys */}
            {["driverName", "email", "phone", "city"].map((field) => (
              <div key={field}>
                <label className="block text-gray-300 text-sm font-semibold mb-1">{field}</label>
                <input
                  type="text"
                  name={field}
                  value={localProfile[field] || ""}
                  disabled={!isEditing}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg ${
                    isEditing ? "bg-gray-700 border border-cyan-500/50" : "bg-gray-700/50 border border-gray-700 cursor-default"
                  }`}
                  required
                />
              </div>
            ))}
          </div>

          {/* Vehicle Info + Mileage */}
          <h2 className="text-2xl font-bold text-gray-200 mb-6 border-t border-cyan-500/30 pt-6">
            Vehicle Information (Mileage: km/L)
          </h2>
          {/* 🚨 UPDATED Grid for 4 fields */}
          <div className="bg-gray-800/80 p-8 rounded-xl shadow-2xl border border-cyan-500/20 mb-10 grid md:grid-cols-4 gap-6">
            
            {/* Vehicle Make/Model */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-1">vehicleMake</label>
              <input
                type="text"
                name="vehicleMake"
                value={localProfile.vehicleMake || ""}
                disabled={!isEditing}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg ${isEditing ? "bg-gray-700 border border-cyan-500/50" : "bg-gray-700/50 border border-gray-700 cursor-default"}`}
                required
              />
            </div>

            {/* License Plate */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-1">licensePlate</label>
              <input
                type="text"
                name="licensePlate"
                value={localProfile.licensePlate || ""}
                disabled={!isEditing}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg ${isEditing ? "bg-gray-700 border border-cyan-500/50" : "bg-gray-700/50 border border-gray-700 cursor-default"}`}
                required
              />
            </div>
            
            {/* Registration Date */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-1">registrationDate</label>
              <input
                type="date"
                name="registrationDate"
                value={localProfile.registrationDate || ""}
                disabled={!isEditing}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg ${isEditing ? "bg-gray-700 border border-cyan-500/50" : "bg-gray-700/50 border border-gray-700 cursor-default"}`}
                required
              />
            </div>
            
            {/* 🚨 NEW FIELD: Mileage */}
            <div>
              <label className="block text-gray-300 text-sm font-semibold mb-1">Mileage (km/L)</label>
              <input
                type="number"
                name="mileage"
                placeholder="e.g., 18.5"
                value={localProfile.mileage || ""}
                disabled={!isEditing}
                onChange={handleChange}
                className={`w-full p-3 rounded-lg ${isEditing ? "bg-gray-700 border border-cyan-500/50" : "bg-gray-700/50 border border-gray-700 cursor-default"}`}
                required
              />
            </div>
            
            {/* Fuel Types Multi-Select */}
            <div className="md:col-span-4">
              <label className="block text-gray-300 text-sm font-semibold mb-1">Fuel Types</label>
              <select
                name="fuelTypes"
                multiple
                value={localProfile.fuelTypes || []}
                disabled={!isEditing}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-gray-700 border border-cyan-500 text-white min-h-[100px]"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="Electricity">Electricity</option>
              </select>
              <p className="text-gray-400 text-sm mt-1">Hold Ctrl (Cmd on Mac) to select multiple fuel types.</p>
            </div>
          </div>

          {isEditing && (
            <div className="text-right mt-6">
              <button
                type="submit"
                className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 transition-all duration-300"
              >
                Save Changes
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;