import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/expenses", expenseRoutes);

app.get("/", (req, res) => res.send("Triplytics Backend is running 🚀"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
