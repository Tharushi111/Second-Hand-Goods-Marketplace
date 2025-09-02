import express from "express";
import multer from "multer";
import * as productController from "../controllers/productController.js"; // note .js extension

const router = express.Router();

// Setup multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to store images
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.post("/", upload.single("image"), productController.addProduct);
router.get("/", productController.getProducts);
router.get("/:id", productController.getProductById);
router.put("/:id", upload.single("image"), productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;