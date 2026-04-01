import express from "express";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
  getProductById,
  getAllProductsPublic,
} from "../controllers/productController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();
router.get("/public", getAllProductsPublic);
router.get("/", protect, getProducts);
router.get("/:id", protect, getProductById);
router.post("/", protect, upload.single("image"), createProduct);
router.delete("/:id", protect, deleteProduct);
router.put("/:id", protect, updateProduct);

export default router;
