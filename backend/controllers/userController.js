// controllers/userController.js
import User from "../models/User.js";

// GET /users/me
export const getMe = async (req, res) => {
  try {
    // req.user now contains the single 'vehicle' subdocument
    res.json(req.user); 
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /users/me - Handles all profile and single vehicle updates
export const updateMe = async (req, res) => {
  try {
    const updates = req.body;
    
    // Mongoose handles updating nested fields (like vehicle.name)
    Object.assign(req.user, updates); 
    await req.user.save();
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

// 🚨 REMOVED: All multi-vehicle CRUD functions (addVehicle, updateVehicle, deleteVehicle)