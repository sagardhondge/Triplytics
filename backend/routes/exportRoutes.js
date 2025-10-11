import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { exportExpensesCSV, exportExpensesPDF } from "../controllers/exportController.js";

const router = express.Router();

router.get("/csv", protect, exportExpensesCSV);
router.get("/pdf", protect, exportExpensesPDF);

export default router;
