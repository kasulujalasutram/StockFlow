
const Product = require("../models/Product");

// ==============================
// ADD PRODUCT (ADMIN ONLY)
// ==============================
const addProduct = async (req, res) => {
  try {
    const {
      name,
      sku,
      description,
      type,
      quantity,
      costPrice,
      sellingPrice,
      lowStockThreshold
    } = req.body;

    if (
      !name ||
      !sku ||
      !type ||
      quantity === undefined ||
      costPrice === undefined ||
      sellingPrice === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required product fields"
      });
    }

    if (
      !Number.isFinite(Number(quantity)) ||
      !Number.isFinite(Number(costPrice)) ||
      !Number.isFinite(Number(sellingPrice)) ||
      (lowStockThreshold !== undefined &&
        !Number.isFinite(Number(lowStockThreshold)))
    ) {
      return res.status(400).json({
        success: false,
        message: "Product prices and quantities must be valid numbers"
      });
    }

    if (
      Number(quantity) < 0 ||
      Number(costPrice) < 0 ||
      Number(sellingPrice) < 0 ||
      (lowStockThreshold !== undefined &&
        Number(lowStockThreshold) < 0)
    ) {
      return res.status(400).json({
        success: false,
        message: "Values cannot be negative"
      });
    }

    const normalizedSKU = sku.trim().toUpperCase();

    // Check SKU within the current organization
    const existingProduct = await Product.findOne({
      sku: normalizedSKU,
      organizationId: req.organizationId
    });

    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "SKU already exists in your organization"
      });
    }

    const product = await Product.create({
      name: name.trim(),
      sku: normalizedSKU,
      description,
      type,
      quantity: Number(quantity),
      costPrice: Number(costPrice),
      sellingPrice: Number(sellingPrice),
      lowStockThreshold:
        lowStockThreshold === undefined
          ? 5
          : Number(lowStockThreshold),
      organizationId: req.organizationId,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Product added successfully",
      product
    });

  } catch (error) {
    console.error("Add product error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "SKU already exists in your organization"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to add product"
    });
  }
};

// ==============================
// GET ALL PRODUCTS
// ==============================
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({
      organizationId: req.organizationId
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products"
    });
  }
};

// ==============================
// GET SINGLE PRODUCT
// ==============================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      organizationId: req.organizationId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    console.error("Get product error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product"
    });
  }
};

// ==============================
// UPDATE PRODUCT (ADMIN ONLY)
// ==============================
const updateProduct = async (req, res) => {
  try {
    const allowedFields = [
      "name",
      "sku",
      "description",
      "type",
      "quantity",
      "costPrice",
      "sellingPrice",
      "lowStockThreshold"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update"
      });
    }

    if (updates.name !== undefined) {
      if (typeof updates.name !== "string" || !updates.name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Product name cannot be empty"
        });
      }
      updates.name = updates.name.trim();
    }

    if (updates.sku !== undefined) {
      if (typeof updates.sku !== "string" || !updates.sku.trim()) {
        return res.status(400).json({
          success: false,
          message: "SKU cannot be empty"
        });
      }
      updates.sku = updates.sku.trim().toUpperCase();
    }

    const numericFields = [
      "quantity",
      "costPrice",
      "sellingPrice",
      "lowStockThreshold"
    ];

    for (const field of numericFields) {
      if (updates[field] !== undefined) {
        const value = Number(updates[field]);

        if (!Number.isFinite(value) || value < 0) {
          return res.status(400).json({
            success: false,
            message: `${field} must be a valid non-negative number`
          });
        }

        updates[field] = value;
      }
    }

    const product = await Product.findOneAndUpdate(
      {
        _id: req.params.id,
        organizationId: req.organizationId
      },
      { $set: updates },
      {
        new: true,
        runValidators: true
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product
    });

  } catch (error) {
    console.error("Update product error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "SKU already exists in your organization"
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update product"
    });
  }
};

// ==============================
// DELETE PRODUCT (ADMIN ONLY)
// ==============================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      organizationId: req.organizationId
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });

  } catch (error) {
    console.error("Delete product error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete product"
    });
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct
};
