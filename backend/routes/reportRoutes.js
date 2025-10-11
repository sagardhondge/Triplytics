import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMonthlySummary, getCategoryBreakdown } from "../controllers/reportController.js";

const router = express.Router();

router.get("/monthly", protect, getMonthlySummary);
router.get("/category", protect, getCategoryBreakdown);

export default router;
