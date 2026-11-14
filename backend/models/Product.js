
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },

    description: {
      type: String,
      default: ""
    },

    type: {
      type: String,
      required: true,
      enum: [
        "Electronics",
        "Furniture",
        "Clothing",
        "Groceries",
        "Home Appliances",
        "Sports",
        "Books",
        "Accessories",
        "Other"
      ]
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },

    costPrice: {
      type: Number,
      required: true,
      min: 0
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0
    },

    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0
    },

    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// SKU must be unique within each organization
productSchema.index(
  { organizationId: 1, sku: 1 },
  { unique: true }
);

module.exports = mongoose.model("Product", productSchema);
