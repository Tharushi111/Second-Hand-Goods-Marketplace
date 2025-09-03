import { Router } from "express";
import { adminLogin } from "../controllers/adminAuthController.js";

const router = Router();

// POST /api/admin/auth/login
router.post("/login", adminLogin);

export default router;
