import Vehicle from "../models/Vehicle.js";

// ➕ Add new vehicle
export const addVehicle = async (req, res) => {
  try {
    const { name, type, mileage, fuelType } = req.body;
    
    // Check for required fields manually before Mongoose
    if (!name || name.trim() === "") {
        return res.status(400).json({ message: "Vehicle name is required." });
    }
    
    const newVehicle = await Vehicle.create({
      user: req.user,
      name,
      type: type || "Car", // Default to Car if type is missing, to pass model validation
      mileage,
      fuelType,
    });

    res.status(201).json(newVehicle);
  } catch (error) {
    if (error.name === 'ValidationError') {
        return res.status(400).json({ message: "Invalid vehicle data: " + error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// 📋 Get all vehicles for logged-in user
export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ user: req.user }).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update a vehicle
export const updateVehicle = async (req, res) => {
  try {
    // Basic check for required name field if it's being updated to an empty string
    if (req.body.name !== undefined && req.body.name.trim() === "") {
        return res.status(400).json({ message: "Vehicle name cannot be empty." });
    }

    const vehicle = await Vehicle.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.json(vehicle);
  } catch (error) {
    if (error.name === 'ValidationError') {
      if (error.errors.name) {
          return res.status(400).json({ message: "Vehicle name is required." });
      }
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete a vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 
