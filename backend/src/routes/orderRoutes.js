import express from "express";
import multer from "multer";
import {
  getAllOrdersForUser,
  getSlipOrdersForAdmin,
  getOrderById,
  uploadBankSlip,
  updateOrderStatus,
} from "../controllers/orderController.js";

// Import middlewares
import { verifyToken } from "../middleware/auth.js";
import { verifyAdminToken } from "../middleware/adminAuth.js";

const router = express.Router();

// Multer Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/slips/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });


// Admin Routes
router.get("/admin", verifyAdminToken, getSlipOrdersForAdmin);
router.get("/admin/:id", verifyAdminToken, getOrderById);
router.put("/:id/status", verifyAdminToken, updateOrderStatus);

// User Routes
router.get("/user", verifyToken, getAllOrdersForUser);
router.get("/:id", verifyToken, getOrderById);
router.post("/:id/upload-slip", verifyToken, upload.single("slip"), uploadBankSlip);

export default router;
