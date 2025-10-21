// controllers/expenseController.js
import Expense from "../models/Expense.js";

// GET /expenses
export const getExpenses = async (req, res) => {
  try {
    // 🚨 FIX: Removed .populate("vehicle") to resolve the 500 error.
    const expenses = await Expense.find({ user: req.user._id }); 
    res.status(200).json(expenses);
  } catch (err) {
    console.error("Error fetching expenses:", err);
    res.status(500).json({ message: "Failed to fetch expenses" });
  }
};

// POST /expenses - Updated to include new fields
export const addExpense = async (req, res) => {
  try {
    // 🚨 UPDATED: Destructure all new fields
    const { title, amount, vehicle, date, distance, extraExpenses, otherExpenses } = req.body;

    if (!title || amount === undefined || amount === null) {
      return res.status(400).json({ message: "Title (Platform) and amount (Fare) are required" });
    }

    const expense = await Expense.create({
      title,
      amount,
      vehicle,
      date: date || Date.now(),
      user: req.user._id,
      // Default to 0 if not provided (Short Entry)
      distance: distance || 0,
      extraExpenses: extraExpenses || 0,
      otherExpenses: otherExpenses || 0,
    });

    res.status(201).json(expense);
  } catch (err) {
    console.error("Error adding expense:", err);
    res.status(500).json({ message: "Failed to add expense" });
  }
};

// PUT /expenses/:id - Uses Object.assign to handle all fields
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense || expense.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    Object.assign(expense, req.body);
    await expense.save();

    res.status(200).json(expense);
  } catch (err) {
    console.error("Error updating expense:", err);
    res.status(500).json({ message: "Failed to update expense" });
  }
};

// DELETE /expenses/:id - Remains the same
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense || expense.user.toString() !== req.user._id.toString()) {
      return res.status(404).json({ message: "Expense not found or unauthorized" });
    }

    await expense.deleteOne();
    res.status(200).json({ message: "Expense deleted" });
  } catch (err) {
    console.error("Error deleting expense:", err);
    res.status(500).json({ message: "Failed to delete expense" });
  }
};