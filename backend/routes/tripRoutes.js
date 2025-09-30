import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/something", protect, (req, res) => {
  res.json({ message: "Trip data only for logged in users" });
});

export default router;
