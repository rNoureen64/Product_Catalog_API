const { body, query, param, validationResult } = require("express-validator");

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((error) => ({
        field: error.path,
        message: error.msg
      }))
    });
  }

  next();
};

const productBodyValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),

  body("category")
    .trim()
    .notEmpty()
    .withMessage("Product category is required")
    .isIn([
      "electronics",
      "clothing",
      "home",
      "beauty",
      "sports",
      "books",
      "groceries",
      "other"
    ])
    .withMessage("Invalid product category"),

  body("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0"),

  body("stock")
    .notEmpty()
    .withMessage("Stock quantity is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be a whole number greater than or equal to 0"),

  body("brand")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Brand name cannot exceed 100 characters"),

  body("image")
    .optional()
    .trim()
    .isURL()
    .withMessage("Image must be a valid URL"),

  handleValidationErrors
];

const productUpdateValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Product name must be between 2 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Description must be between 10 and 500 characters"),

  body("category")
    .optional()
    .trim()
    .isIn([
      "electronics",
      "clothing",
      "home",
      "beauty",
      "sports",
      "books",
      "groceries",
      "other"
    ])
    .withMessage("Invalid product category"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a number greater than or equal to 0"),

  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a whole number greater than or equal to 0"),

  body("brand")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Brand name cannot exceed 100 characters"),

  body("image")
    .optional()
    .trim()
    .isURL()
    .withMessage("Image must be a valid URL"),

  handleValidationErrors
];

const productQueryValidation = [
  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search must be between 1 and 100 characters"),

  query("category")
    .optional()
    .trim()
    .isIn([
      "electronics",
      "clothing",
      "home",
      "beauty",
      "sports",
      "books",
      "groceries",
      "other"
    ])
    .withMessage("Invalid product category"),

  query("minPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum price must be a valid positive number"),

  query("maxPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum price must be a valid positive number"),

  query("maxPrice")
    .custom((maxPrice, { req }) => {
      if (
        maxPrice !== undefined &&
        req.query.minPrice !== undefined &&
        Number(maxPrice) < Number(req.query.minPrice)
      ) {
        throw new Error("Maximum price must be greater than or equal to minimum price");
      }

      return true;
    }),

  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  handleValidationErrors
];

const productIdValidation = [
  param("id")
    .isMongoId()
    .withMessage("Invalid product ID"),

  handleValidationErrors
];

module.exports = {
  productBodyValidation,
  productUpdateValidation,
  productQueryValidation,
  productIdValidation
};