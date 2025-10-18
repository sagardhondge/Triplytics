import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: false,
    },
    title: {
      type: String,
      required: true, // Required, must map to frontend 'platform' field
      trim: true,
    },
    amount: {
      type: Number,
      required: true, // Required, must map to frontend 'fare' field
    },
    category: {
      type: String,
      enum: ["Fuel", "Maintenance", "Toll", "Parking", "Other"],
      default: "Other",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
    },
    nextServiceDate: { 
        type: Date
    },
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema); 
