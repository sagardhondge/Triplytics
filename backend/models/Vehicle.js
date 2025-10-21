import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    vehicleName: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    type: { type: String, default: "Car" },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
