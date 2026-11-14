
const express = require("express");
const router = express.Router();

const {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const {
  protect,
  adminOnly
} = require("../middleware/authMiddleware");

// Get all products - Admin and User
router.get("/", protect, getProducts);

// Get single product - Admin and User
router.get("/:id", protect, getProductById);

// Add product - Admin only
router.post("/", protect, adminOnly, addProduct);

// Update product - Admin only
router.put("/:id", protect, adminOnly, updateProduct);

// Delete product - Admin only
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;
