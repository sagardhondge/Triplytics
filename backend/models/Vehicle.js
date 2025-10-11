import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  make: { type: String, required: true },
  model: { type: String },
  licensePlate: { type: String, required: true },
  fuelType: { type: String },
  mileage: { type: Number },
}, { timestamps: true });

export default mongoose.model("Vehicle", vehicleSchema);
