import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUpcomingReminders } from "../controllers/notificationController.js";

const router = express.Router();

router.get("/upcoming", protect, getUpcomingReminders);

export default router;
