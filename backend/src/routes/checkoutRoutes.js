import express from "express";
import { placeOrder, getCheckoutSummary, uploadSlip } from "../controllers/checkoutController.js";
import { verifyToken } from "../middleware/auth.js"; 

const router = express.Router();

// Checkout Routes
router.get("/summary", verifyToken, getCheckoutSummary);
router.post("/place", verifyToken, placeOrder);
router.post("/upload-slip/:orderId", verifyToken, uploadSlip);

export default router;