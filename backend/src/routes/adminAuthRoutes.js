import { Router } from "express";
import { adminLogin } from "../controllers/adminAuthController.js";
import { verifyAdminToken, requireAdminRole } from "../middleware/adminAuth.js";
import stockRoutes from "./stockRoutes.js"; 
import { getAllSuppliers } from "../controllers/userController.js";

const router = Router();

// Admin login
router.post("/login", adminLogin);

// Get all suppliers for dropdown
router.get(
  "/suppliers", verifyAdminToken, requireAdminRole("super_admin"), getAllSuppliers
);

router.use(
  "/stocks", verifyAdminToken, requireAdminRole("super_admin"), stockRoutes
);

export default router;
