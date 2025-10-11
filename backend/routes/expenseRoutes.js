import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addExpense,
  getExpenses,
  getExpenseById,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";

const router = express.Router();

// All routes are protected
router.route("/")
  .get(protect, getExpenses)
  .post(protect, addExpense);

router.route("/:id")
  .get(protect, getExpenseById)
  .put(protect, updateExpense)
  .delete(protect, deleteExpense);

export default router;
