const Product = require("../models/Product");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      stock,
      brand,
      image
    } = req.body;

    const product = await Product.create({
      name,
      description,
      category,
      price,
      stock,
      brand,
      image
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to create product",
      error: error.message
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(
      Math.max(Number(req.query.limit) || 10, 1),
      100
    );

    const skip = (page - 1) * limit;

    const {
      search,
      category,
      minPrice,
      maxPrice
    } = req.query;

    const filter = {
      isActive: true
    };

    if (search) {
      filter.$text = {
        $search: search.trim()
      };
    }

    if (category) {
      filter.category = category.toLowerCase().trim();
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};

      if (minPrice !== undefined) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice !== undefined) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const [products, totalProducts] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalProducts / limit);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
      error: error.message
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "description",
      "category",
      "price",
      "stock",
      "brand",
      "image"
    ];

    const updateData = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one valid product field is required for update"
      });
    }

    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        isActive: true
      },
      updateData,
      {
        returnDocument: "after",
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to update product",
      error: error.message
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        isActive: true
      },
      {
        isActive: false
      },
      {
        returnDocument: "after"
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Failed to delete product",
      error: error.message
    });
  }
};

const getProductAnalytics = async (req, res) => {
  try {
    const analytics = await Product.aggregate([
      {
        $match: {
          isActive: true
        }
      },
      {
        $facet: {
          overview: [
            {
              $group: {
                _id: null,
                totalProducts: {
                  $sum: 1
                },
                averagePrice: {
                  $avg: "$price"
                },
                totalStock: {
                  $sum: "$stock"
                },
                minimumPrice: {
                  $min: "$price"
                },
                maximumPrice: {
                  $max: "$price"
                }
              }
            },
            {
              $project: {
                _id: 0,
                totalProducts: 1,
                averagePrice: {
                  $round: ["$averagePrice", 2]
                },
                totalStock: 1,
                minimumPrice: 1,
                maximumPrice: 1
              }
            }
          ],

          categoryBreakdown: [
            {
              $group: {
                _id: "$category",
                productCount: {
                  $sum: 1
                },
                averagePrice: {
                  $avg: "$price"
                },
                totalStock: {
                  $sum: "$stock"
                }
              }
            },
            {
              $project: {
                _id: 0,
                category: "$_id",
                productCount: 1,
                averagePrice: {
                  $round: ["$averagePrice", 2]
                },
                totalStock: 1
              }
            },
            {
              $sort: {
                productCount: -1
              }
            }
          ]
        }
      }
    ]);

    res.status(200).json({
      success: true,
      message: "Product analytics fetched successfully",
      data: analytics[0]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch product analytics",
      error: error.message
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductAnalytics
};