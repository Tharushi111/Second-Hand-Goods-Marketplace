import express from "express";
import { addFeedback, getFeedbacks, updateFeedback, deleteFeedback } from "../controllers/feedbackController.js";
import { verifyToken, requireRole } from "../middleware/auth.js";
import { verifyAdminToken, requireAdminRole } from '../middleware/adminAuth.js';

const router = express.Router();

// Add new feedback (only logged-in users)
router.post("/", verifyToken, addFeedback);

// Get all feedback (public)
router.get("/", getFeedbacks);

// Update feedback by id (only logged-in users)
router.put("/:id", verifyToken, updateFeedback);

// Delete feedback (only admin)
router.delete("/:id", verifyAdminToken, requireAdminRole('admin', 'super_admin'), deleteFeedback);

export default router;


