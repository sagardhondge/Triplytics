import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createTrip, getTrips } from "../controllers/tripController.js";

const router = express.Router();

router.post("/", protect, createTrip);
router.get("/", protect, getTrips);

export default router;
