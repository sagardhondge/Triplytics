import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js"; // for fuel/other cost entries

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);      // Login / Register
app.use("/users", userRoutes);     // Profile, vehicles + fuel types
app.use("/expenses", expenseRoutes); // Cost/fuel entries

app.get("/", (req, res) => res.send("Triplytics Backend is running 🚀"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
