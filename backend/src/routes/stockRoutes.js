import express from "express";
import { addStock, getAllStock, updateStock, deleteStock } from "../controllers/stockController.js";

const router = express.Router();

// Add new stock
router.post("/", addStock);

// Get all stock items
router.get("/", getAllStock);

// Update stock by ID
router.put("/:id", updateStock);

// Delete stock by ID
router.delete("/:id", deleteStock);

export default router;
