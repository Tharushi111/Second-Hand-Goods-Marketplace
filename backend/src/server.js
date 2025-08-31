import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import stockRoutes from "./routes/stockRoutes.js";
import reorderRoutes from "./routes/ReorderRequestRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/stock", stockRoutes);
app.use("/api/reorders", reorderRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
});
