import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { getVehicles, addVehicle, updateVehicle, deleteVehicle } from "../controllers/vehicleController.js";

const router = express.Router();

router.use(authMiddleware);
router.route("/").get(getVehicles).post(addVehicle);
router.route("/:id").put(updateVehicle).delete(deleteVehicle);

export default router;
