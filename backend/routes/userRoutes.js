// routes/userRoutes.js
import express from "express";
import { getMe, updateMe } from "../controllers/userController.js"; 
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

// Profile routes: GET and PUT are sufficient to manage profile and single vehicle
router.route("/me").get(getMe).put(updateMe); 

// 🚨 REMOVED: All /me/vehicles routes
// Since the frontend is ready and the single-vehicle approach is adopted, 
// no further user routes are needed.

export default router;