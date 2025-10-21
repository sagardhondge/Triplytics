import Vehicle from "../models/Vehicle.js";

export const getVehicles = async (req, res) => {
  const vehicles = await Vehicle.find({ user: req.user._id });
  res.json(vehicles);
};

export const addVehicle = async (req, res) => {
  const { vehicleName, vehicleNumber, type } = req.body;
  const vehicle = await Vehicle.create({ user: req.user._id, vehicleName, vehicleNumber, type });
  res.status(201).json(vehicle);
};

export const updateVehicle = async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle || vehicle.user.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: "Vehicle not found or unauthorized" });
  }
  const updated = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deleteVehicle = async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);
  if (!vehicle || vehicle.user.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: "Vehicle not found or unauthorized" });
  }
  await vehicle.deleteOne();
  res.json({ message: "Vehicle deleted" });
};
