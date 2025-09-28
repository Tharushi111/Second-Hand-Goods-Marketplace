import express from "express";
import {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
  clearCart,
  generateQuotation,
} from "../controllers/cartController.js";

import { verifyToken } from "../middleware/auth.js"; 

const router = express.Router();

router.get("/", verifyToken, getCart);
router.post("/add", verifyToken, addToCart);
router.put("/update/:productId", verifyToken, updateQuantity);
router.delete("/remove/:productId", verifyToken, removeItem);
router.delete("/clear", verifyToken, clearCart);
router.get("/quotation", verifyToken, generateQuotation);

export default router;