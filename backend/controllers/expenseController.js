import Expense from "../models/Expense.js";

// ➕ Add Expense
export const addExpense = async (req, res) => {
  try {
    const expense = await Expense.create({ ...req.body, user: req.user });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📋 Get All Expenses for Logged-in User
export const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🧾 Get Single Expense by ID
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, user: req.user });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✏️ Update Expense
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndUpdate(
      { _id: req.params.id, user: req.user },
      req.body,
      { new: true }
    );
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ❌ Delete Expense
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, user: req.user });
    if (!expense) return res.status(404).json({ message: "Expense not found" });
    res.json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
