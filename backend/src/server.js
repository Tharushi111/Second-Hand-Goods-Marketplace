import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import dotenv from "dotenv";
import stockRoutes from "./routes/stockRoutes.js";
import reorderRoutes from "./routes/ReorderRequestRoutes.js";
import productRoutes from "./routes/productRoutes.js"; 
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import financeRoutes from "./routes/financeRoutes.js"
import feedbackRoutes from "./routes/feedbackRoutes.js";
import supplierOffer from "./routes/supplierOfferRoutes.js";
import multer from "multer"; 

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads")); 

// Routes
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/reorders", reorderRoutes);
app.use("/api/products", productRoutes);
app.use("/api/user", userRoutes);
app.use("/api/finance", financeRoutes)
app.use("/api/feedback", feedbackRoutes);
app.use("/api/offer", supplierOffer);


// Connect to MongoDB and start server
const PORT = process.env.PORT || 5001;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server started on PORT: ${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
});