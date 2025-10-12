import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  addVehicle,
  getVehicles,
  deleteVehicle,
  updateVehicle, // 1. Import the new function
} from "../controllers/vehicleController.js";

const router = express.Router();

router.route("/")
  .get(protect, getVehicles)
  .post(protect, addVehicle);

router.route("/:id")
  .delete(protect, deleteVehicle)
  .put(protect, updateVehicle); // 2. Add the PUT route for updates

export default router;