import express from "express";
import { createPaymentIntent } from "../controllers/stripeController.js";
import { updateOrderPaymentStatus } from "../controllers/orderController.js"; 
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

router.post("/create-payment-intent", verifyToken, createPaymentIntent);
router.post("/update-payment-status", verifyToken, updateOrderPaymentStatus); 

export default router;