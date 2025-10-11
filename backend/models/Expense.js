import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: "Vehicle" },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

export default mongoose.model("Expense", expenseSchema);
