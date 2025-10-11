import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { addVehicle, getVehicles, deleteVehicle } from "../controllers/vehicleController.js";

const router = express.Router();

router.route("/")
  .get(protect, getVehicles)
  .post(protect, addVehicle);

router.route("/:id")
  .delete(protect, deleteVehicle);

export default router;
