import express from "express";
import { addFeedback, getFeedbacks, updateFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

// POST- Add new feedback
router.post("/", addFeedback);

// GET - Get all feedback
router.get("/", getFeedbacks);

// PUT - Update feedback by id
router.put("/:id", updateFeedback);

export default router;
