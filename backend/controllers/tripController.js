import Trip from "../models/Trip.js";

export const createTrip = async (req, res) => {
  try {
    const trip = await Trip.create({ ...req.body, user: req.user.id });
    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user.id });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
