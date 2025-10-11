import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["Car", "Bike", "Truck"],
      required: true,
    },
    mileage: {
      type: Number,
      default: 0,
    },
    fuelType: {
      type: [String],
      enum: ["Petrol", "Diesel", "CNG", "Electricity"],
      default: [],
    },
  },
  { timestamps: true }
);

export default mongoose.model("Vehicle", vehicleSchema);
