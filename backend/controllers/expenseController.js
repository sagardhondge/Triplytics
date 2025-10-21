import Expense from "../models/Expense.js";

export const getExpenses = async (req, res) => {
  const expenses = await Expense.find({ user: req.user._id }).populate("vehicle");
  res.json(expenses);
};

export const addExpense = async (req, res) => {
  const expense = await Expense.create({ ...req.body, user: req.user._id });
  res.status(201).json(expense);
};

export const updateExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense || expense.user.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: "Expense not found or unauthorized" });
  }
  const updated = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

export const deleteExpense = async (req, res) => {
  const expense = await Expense.findById(req.params.id);
  if (!expense || expense.user.toString() !== req.user._id.toString()) {
    return res.status(404).json({ message: "Expense not found or unauthorized" });
  }
  await expense.deleteOne();
  res.json({ message: "Expense deleted" });
};
