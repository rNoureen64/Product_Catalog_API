const express = require("express");

const {
  registerUser,
  loginUser,
  getCurrentUser
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");

const {
  registerValidation,
  loginValidation
} = require("../middleware/authValidation");

const router = express.Router();

router.post(
  "/register",
  registerValidation,
  registerUser
);

router.post(
  "/login",
  loginValidation,
  loginUser
);

router.get(
  "/me",
  protect,
  getCurrentUser
);

module.exports = router;