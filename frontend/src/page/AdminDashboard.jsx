
import { useEffect, useState } from "react";
import {
  Package,
  Boxes,
  AlertTriangle,
  IndianRupee,
  RefreshCw
} from "lucide-react";

import API from "../services/api";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalQuantity: 0,
    lowStockCount: 0,
    inventoryValue: 0,
    recentProducts: [],
    lowStockProducts: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Fetch dashboard statistics
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/dashboard");

      setDashboard(response.data.dashboard);

    } catch (err) {
      console.error("Dashboard error:", err);

      setError(
        err.response?.data?.message ||
        "Failed to load dashboard"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Dashboard cards
  const stats = [
    {
      title: "Total Products",
      value: dashboard.totalProducts,
      icon: Package,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Total Stock",
      value: dashboard.totalQuantity,
      icon: Boxes,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Low Stock Products",
      value: dashboard.lowStockCount,
      icon: AlertTriangle,
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      title: "Inventory Value",
      value: `₹${Number(dashboard.inventoryValue).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "bg-green-100 text-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 lg:flex">

      {/* Sidebar */}
      <Sidebar
        role="admin"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 min-w-0">

        {/* Navbar */}
        <Navbar
          title="Admin Dashboard"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-4 md:p-6 space-y-6">

          {/* Welcome Section */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome to StockFlow
              </h2>

              <p className="text-gray-500 mt-1">
                Here's what's happening with your inventory.
              </p>
            </div>

            <button
              onClick={fetchDashboard}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-white border px-4 py-2 rounded-lg hover:bg-gray-50"
            >
              <RefreshCw size={17} />
              Refresh
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
              {error}
            </div>
          )}

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.title}
                  className="bg-white p-5 rounded-xl shadow-sm"
                >
                  <div className="flex justify-between items-center">

                    <div>
                      <p className="text-sm text-gray-500">
                        {stat.title}
                      </p>

                      <h3 className="text-2xl font-bold text-gray-800 mt-2">
                        {loading ? "..." : stat.value}
                      </h3>
                    </div>

                    <div className={`p-3 rounded-xl ${stat.color}`}>
                      <Icon size={25} />
                    </div>

                  </div>
                </div>
              );
            })}

          </div>

          {/* Recent Products */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">

            <div className="p-5 border-b">
              <h3 className="text-lg font-bold text-gray-800">
                Recently Added Products
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                Latest products in your inventory
              </p>
            </div>

            {loading ? (
              <p className="p-6 text-gray-500">
                Loading products...
              </p>
            ) : dashboard.recentProducts.length === 0 ? (
              <p className="p-6 text-gray-500">
                No products added yet.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">

                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-4 text-sm">Product</th>
                      <th className="p-4 text-sm">SKU</th>
                      <th className="p-4 text-sm">Category</th>
                      <th className="p-4 text-sm">Quantity</th>
                      <th className="p-4 text-sm">Selling Price</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y">
                    {dashboard.recentProducts.map((product) => (
                      <tr key={product._id}>
                        <td className="p-4 font-medium text-gray-800">
                          {product.name}
                        </td>

                        <td className="p-4 text-sm text-gray-600">
                          {product.sku}
                        </td>

                        <td className="p-4 text-sm text-gray-600">
                          {product.type}
                        </td>

                        <td className="p-4 text-sm">
                          {product.quantity}
                        </td>

                        <td className="p-4 text-sm">
                          ₹{Number(product.sellingPrice).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}

          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white rounded-xl shadow-sm">

            <div className="p-5 border-b flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" size={22} />

              <h3 className="text-lg font-bold text-gray-800">
                Low Stock Alerts
              </h3>
            </div>

            {loading ? (
              <p className="p-6 text-gray-500">
                Loading alerts...
              </p>
            ) : dashboard.lowStockProducts.length === 0 ? (
              <p className="p-6 text-green-600">
                All products have sufficient stock.
              </p>
            ) : (
              <div className="divide-y">
                {dashboard.lowStockProducts.map((product) => (
                  <div
                    key={product._id}
                    className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {product.name}
                      </p>

                      <p className="text-sm text-gray-500">
                        SKU: {product.sku}
                      </p>
                    </div>

                    <div className="text-sm">
                      <span className="text-red-600 font-semibold">
                        {product.quantity} left
                      </span>

                      <span className="text-gray-500">
                        {" "} / Threshold: {product.lowStockThreshold}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
