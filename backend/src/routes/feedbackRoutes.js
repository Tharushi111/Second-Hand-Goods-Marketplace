import express from "express";
import { addFeedback, getFeedbacks, updateFeedback, deleteFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

//Add new feedback
router.post("/", addFeedback);

//Get all feedback
router.get("/", getFeedbacks);

//Update feedback by id
router.put("/:id", updateFeedback);

//delete feedback
router.delete("/:id", deleteFeedback);

export default router;