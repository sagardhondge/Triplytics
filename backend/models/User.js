import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const fuelSchema = new mongoose.Schema({
  type: { type: String, required: true }, // e.g., Petrol, Diesel, CNG
});

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Vehicle Make/Model
  licensePlate: { type: String, required: true },
  registrationDate: { type: Date, required: true },
  fuelTypes: [fuelSchema], // Fuel types used by this vehicle
});

const userSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Driver Name
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String },
  city: { type: String },
  vehicles: [vehicleSchema], // Array of vehicles
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
