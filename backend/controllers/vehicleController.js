import Vehicle from "../models/Vehicle.js";

// ➕ Add new vehicle
export const addVehicle = async (req, res) => {
  try {
    const { name, type, mileage, fuelType } = req.body;

    const newVehicle = await Vehicle.create({
      user: req.user,
      name,
      type,
      mileage,
      fuelType,
    });

    res.status(201).json(newVehicle);
  } catch (error) {
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

// ❌ Delete a vehicle
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (vehicle.user.toString() !== req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await vehicle.deleteOne();
    res.json({ message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update a vehicle
export const updateVehicle = async (req, res) => {
  try {
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
    res.status(500).json({ message: error.message });
  }
};