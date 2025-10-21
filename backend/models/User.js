// models/User.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Simplified Vehicle schema to be embedded
const vehicleSchema = new mongoose.Schema({
  name: { type: String, default: "" }, 
  licensePlate: { type: String, default: "" },
  registrationDate: { type: Date },
  // Fuel entries remain as an array of subdocuments for detailed tracking
  fuelEntries: [{ 
    type: { type: String, default: "" },
    litres: { type: Number, default: 0 },
    pricePerLitre: { type: Number, default: 0 },
  }],
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, default: "" },
  city: { type: String, default: "" },
  // 🚨 Change from array to a single embedded object
  vehicle: { type: vehicleSchema, default: {} }, 
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);