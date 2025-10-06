import React, { useState } from "react";
import Navbar from "../components/Navbar";

// Mock user data for initial state
const MOCK_PROFILE_DATA = {
  driverName: "Arjun Sharma",
  email: "arjun.sharma@example.com",
  phone: "98765 43210",
  city: "Mumbai",
  vehicleMake: "Maruti Suzuki Dzire",
  licensePlate: "MH 01 AB 1234",
  registrationDate: "2020-05-15",
};

const Profile = () => {
  const [profile, setProfile] = useState(MOCK_PROFILE_DATA);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // In a real application, you would send profile data to the backend here
    console.log("Saving profile data:", profile);
    setIsEditing(false);
    // You could add a success message notification here
  };

  const renderInputField = (label, name, type = "text") => (
    <div className="mb-4">
      <label className="block text-gray-300 text-sm font-semibold mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={profile[name]}
        onChange={handleChange}
        disabled={!isEditing}
        required
        className={`w-full p-3 rounded-lg text-white transition-all duration-200 ${
          isEditing
            ? "bg-gray-700 border border-cyan-500/50 focus:ring-2 focus:ring-cyan-400"
            : "bg-gray-700/50 border border-gray-700 cursor-default"
        }`}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      
      <div className="pt-24 px-6 md:px-12 py-10">
        <h1 className="text-4xl font-extrabold text-cyan-300 mb-8 border-b border-cyan-500/30 pb-3">
          Driver Profile
        </h1>

        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSave}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-200">Personal Details</h2>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-md ${
                  isEditing
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-cyan-600 hover:bg-cyan-700 text-gray-900"
                }`}
              >
                {isEditing ? "Cancel Edit" : "Edit Profile"}
              </button>
            </div>

            {/* Profile Card Layout */}
            <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-cyan-500/20 mb-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                {renderInputField("Driver Name", "driverName")}
                {renderInputField("Phone Number", "phone", "tel")}
                {renderInputField("Email Address", "email", "email")}
                {renderInputField("City/Operating Area", "city")}
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-200 mb-6 border-t border-cyan-500/30 pt-6">
              Vehicle Information
            </h2>
             {/* Vehicle Card Layout */}
            <div className="bg-gray-800/80 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-cyan-500/20 mb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
                    {renderInputField("Vehicle Make/Model", "vehicleMake")}
                    {renderInputField("License Plate No.", "licensePlate")}
                    {renderInputField("Registration Date", "registrationDate", "date")}
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
    </div>
  );
};

export default Profile;
