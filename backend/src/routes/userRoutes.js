import express from "express";
import { 
  registerUser, 
  loginUser, 
  getUsers, 
  getUser, 
  updateUser, 
  deleteUser, 
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

// Admin-only routes (admins login separately)
router.get("/", verifyToken, requireRole('admin', 'super_admin'), getUsers);
router.get("/:id", verifyToken, requireRole('admin'), getUser);
router.put("/:id", verifyToken, requireRole('admin', 'super_admin'), updateUser);
router.delete("/:id", verifyToken, requireRole('admin', 'super_admin'), deleteUser);


// src/routes/userRoutes.js
router.get("/suppliers", verifyToken, requireRole("admin"), getAllSuppliers);


export default router;
