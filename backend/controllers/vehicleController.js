import Vehicle from "../models/Vehicle.js";

export const addVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create({ ...req.body, user: req.user });
    res.status(201).json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ user: req.user });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ message: "Vehicle not found" });
    if (vehicle.user.toString() !== req.user) return res.status(401).json({ message: "Not authorized" });

    await vehicle.deleteOne();
    res.json({ message: "Vehicle removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
