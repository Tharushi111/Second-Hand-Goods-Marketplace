import express from "express";
import { verifyToken, requireRole } from "../middleware/auth.js";

import {
  createReorderRequest,
  getAllReorderRequests,
  getReorderRequestById,
  updateReorderRequest,
  deleteReorderRequest,
  addReply,
  getAllReplies
} from "../controllers/ReorderRequestController.js";

const router = express.Router();
router.post("/", createReorderRequest);
router.get("/", getAllReorderRequests);
router.get("/:id", getReorderRequestById);
router.put("/:id", updateReorderRequest);
router.delete("/:id", deleteReorderRequest);
router.post("/:id/reply", verifyToken, addReply);

router.get("/replies", verifyToken, requireRole("admin"), getAllReplies);



export default router;
