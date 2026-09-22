const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductAnalytics
} = require("../controllers/productController");

const {
  productBodyValidation,
  productUpdateValidation,
  productQueryValidation,
  productIdValidation
} = require("../middleware/productValidation");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  productBodyValidation,
  createProduct
);

router.get(
  "/",
  productQueryValidation,
  getProducts
);

router.get(
  "/analytics",
  protect,
  getProductAnalytics
);

router.get(
  "/:id",
  productIdValidation,
  getProductById
);

router.put(
  "/:id",
  protect,
  productIdValidation,
  productUpdateValidation,
  updateProduct
);

router.delete(
  "/:id",
  protect,
  productIdValidation,
  deleteProduct
);

module.exports = router;