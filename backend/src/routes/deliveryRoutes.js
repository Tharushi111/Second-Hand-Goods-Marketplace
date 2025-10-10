import express from "express";
import { verifyAdminToken } from "../middleware/adminAuth.js";
import { getPaidOrdersForAdmin, assignDeliveryMethod } from "../controllers/deliveryController.js";

const router = express.Router();

// Get all paid orders for delivery assignment
router.get("/admin/paid-orders", verifyAdminToken, getPaidOrdersForAdmin);

// Assign delivery method (Uber or PickMe)
router.put("/admin/assign/:id", verifyAdminToken, assignDeliveryMethod);

export default router;
