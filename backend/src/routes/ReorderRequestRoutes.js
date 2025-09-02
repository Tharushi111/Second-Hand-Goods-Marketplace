import express from "express";
import {
  createReorderRequest,
  getAllReorderRequests,
  getReorderRequestById,
  updateReorderRequest,
  deleteReorderRequest
} from "../controllers/ReorderRequestController.js";

const router = express.Router();
router.post("/", createReorderRequest);
router.get("/", getAllReorderRequests);
router.get("/:id", getReorderRequestById);
router.put("/:id", updateReorderRequest);
router.delete("/:id", deleteReorderRequest);

export default router;
