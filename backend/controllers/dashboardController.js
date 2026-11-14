
const Product = require("../models/Product");
const Organization = require("../models/Organization");

// ==============================
// GET DASHBOARD STATISTICS
// ==============================
const getDashboardStats = async (req, res) => {
  try {
    const organizationId = req.organizationId;

    const [
      organization,
      totalProducts,
      stockSummary,
      lowStockProducts,
      recentProducts
    ] = await Promise.all([

      // Organization details
      Organization.findById(organizationId).select(
        "name organizationCode isActive"
      ),

      // Total products
      Product.countDocuments({ organizationId }),

      // Total quantity and inventory value
      Product.aggregate([
        { $match: { organizationId } },
        {
          $group: {
            _id: null,
            totalQuantity: { $sum: "$quantity" },
            inventoryValue: {
              $sum: {
                $multiply: ["$quantity", "$costPrice"]
              }
            }
          }
        }
      ]),

      // Low stock products
      Product.find({
        organizationId,
        $expr: {
          $lte: ["$quantity", "$lowStockThreshold"]
        }
      }).sort({ quantity: 1 }),

      // Recently added products
      Product.find({ organizationId })
        .sort({ createdAt: -1 })
        .limit(5)
    ]);

    if (!organization) {
      return res.status(404).json({
        success: false,
        message: "Organization not found"
      });
    }

    const summary = stockSummary[0] || {
      totalQuantity: 0,
      inventoryValue: 0
    };

    return res.status(200).json({
      success: true,

      dashboard: {
        organization: {
          name: organization.name,
          organizationCode: organization.organizationCode,
          isActive: organization.isActive
        },

        totalProducts,
        totalQuantity: summary.totalQuantity,
        lowStockCount: lowStockProducts.length,
        inventoryValue: summary.inventoryValue,
        recentProducts,
        lowStockProducts
      }
    });

  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics"
    });
  }
};

module.exports = {
  getDashboardStats
};
