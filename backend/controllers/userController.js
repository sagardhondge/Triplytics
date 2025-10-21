import User from "../models/User.js";

// GET /users/me
export const getMe = async (req, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /users/me
export const updateMe = async (req, res) => {
  try {
    const updates = req.body;
    Object.assign(req.user, updates);
    await req.user.save();
    res.json(req.user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};
