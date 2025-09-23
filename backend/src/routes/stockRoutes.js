import express from "express";
import {
  getAllStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
  handleSuccessfulPayment,
  handleOrderCancellation
} from "../controllers/stockController.js";

const router = express.Router();

// Public routes
router.get("/", getAllStocks);
router.get("/:id", getStockById);
router.post("/", createStock);
router.put("/:id", updateStock);
router.delete("/:id", deleteStock);

// Placeholder routes for future order/payment integration
router.post("/payment-success", handleSuccessfulPayment); // reduce stock after successful payment
router.post("/order-cancel", handleOrderCancellation);    // restore stock when order cancelled

export default router;
