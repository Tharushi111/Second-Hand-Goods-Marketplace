import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUsers, 
  getUser, 
  updateUser, 
  deleteUser, 
  deleteOwnAccount,
  getProfile, 
  updateProfile,
  getAllSuppliers
} from "../controllers/userController.js";

import { verifyToken, requireRole } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/profile", verifyToken, getProfile);
router.put("/profile", verifyToken, updateProfile);
router.delete("/profile", verifyToken, deleteOwnAccount); // New route for deleting own account

// Admin-only routes (admins login separately)
router.get("/", verifyToken, requireRole('admin', 'super_admin'), getUsers);
router.get("/:id", verifyToken, requireRole('admin', 'super_admin'), getUser);
router.put("/:id", verifyToken, requireRole('admin', 'super_admin'), updateUser);
router.delete("/:id", verifyToken, requireRole('admin', 'super_admin'), deleteUser);

// Admin-only suppliers list
router.get("/suppliers", verifyToken, requireRole("admin"), getAllSuppliers);

export default router;
