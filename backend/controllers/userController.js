// controllers/userController.js
import User from "../models/User.js";

// GET /users/me
export const getMe = async (req, res) => {
  try {
    // Sends the authenticated user's profile, including the nested 'vehicle' and 'mileage'.
    res.json(req.user); 
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /users/me - Handles all profile and single vehicle updates
export const updateMe = async (req, res) => {
  try {
    const updates = req.body;
    
    // Mongoose handles updating both top-level fields and nested subdocument fields (like vehicle.mileage)
    Object.assign(req.user, updates); 
    
    // Attempt to save the changes
    await req.user.save();
    
    res.json(req.user); // Send the updated user object back
  } catch (err) {
    // 🚨 ENHANCED ERROR HANDLING: Catches Mongoose validation errors
    if (err.name === 'ValidationError') {
       // Send a 400 Bad Request if validation fails (e.g., trying to save a string to a Number field)
       return res.status(400).json({ 
           message: "Validation failed during profile update. Check data types and required fields.", 
           error: err.message 
       });
    }
    
    console.error("Profile update failed:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};