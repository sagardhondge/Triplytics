// models/Expense.js
import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // 🚨 Vehicle now refers to the subdocument _id, without a 'ref' to a non-existent model
    vehicle: { type: mongoose.Schema.Types.ObjectId, required: false }, 
    title: { type: String, required: true }, // Platform
    amount: { type: Number, required: true }, // Fare/Income
    date: { type: Date, default: Date.now },
    

    distance: { type: Number, default: 0 },
    extraExpenses: { type: Number, default: 0 }, // e.g., Tolls, Parking
    otherExpenses: { type: Number, default: 0 }, // e.g., Maintenance, Cleaning
  },
  { timestamps: true }
);

export default mongoose.model("Expense", expenseSchema);