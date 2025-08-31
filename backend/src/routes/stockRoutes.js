import express from "express";
import {
  getAllStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock
} from "../controllers/stockController.js";

const router = express.Router();

// Get all stocks
router.get("/", getAllStocks);

// Get single stock
router.get("/:id", getStockById);

// Create new stock
router.post("/", createStock);

// Update stock
router.put("/:id", updateStock);

// Delete stock
router.delete("/:id", deleteStock);

export default router;
