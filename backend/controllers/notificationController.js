import Expense from "../models/Expense.js";

export const getUpcomingReminders = async (req, res) => {
  try {
    const userId = req.user;
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    const reminders = await Expense.find({
      user: userId,
      nextServiceDate: { $gte: today, $lte: nextWeek }
    }).sort({ nextServiceDate: 1 });

    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
