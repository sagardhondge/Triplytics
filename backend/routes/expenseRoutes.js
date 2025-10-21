import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getExpenses, addExpense, updateExpense, deleteExpense } from "../controllers/expenseController.js";

const router = express.Router();

router.use(authMiddleware);
router.route("/").get(getExpenses).post(addExpense);
router.route("/:id").put(updateExpense).delete(deleteExpense);

export default router;
