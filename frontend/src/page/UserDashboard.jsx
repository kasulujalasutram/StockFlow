
import { useEffect, useState } from "react";
import { AlertTriangle, Package, Boxes, RefreshCw } from "lucide-react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import API from "../services/api";

function UserDashboard() {
  const [dashboard, setDashboard] = useState({
    totalProducts: 0,
    totalQuantity: 0,
    lowStockCount: 0,
    inventoryValue: 0,
    recentProducts: [],
    lowStockProducts: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/dashboard");
      setDashboard(response.data.dashboard);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const stats = [
    {
      title: "Total Products",
      value: dashboard.totalProducts,
      icon: Package,
    },
    {
      title: "Total Stock",
      value: dashboard.totalQuantity,
      icon: Boxes,
    },
    {
      title: "Low Stock Items",
      value: dashboard.lowStockCount,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar
        role="user"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-64">
        <Navbar
          title="User Dashboard"
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Welcome Back!
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                View your organization's inventory overview.
              </p>
            </div>

            <button
              onClick={fetchDashboard}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm">
              Loading dashboard...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-slate-500">
                          {item.title}
                        </p>
                        <div className="rounded-lg bg-indigo-50 p-3 text-indigo-600">
                          <Icon size={21} />
                        </div>
                      </div>

                      <h2 className="mt-4 text-3xl font-bold text-slate-800">
                        {item.value.toLocaleString()}
                      </h2>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                  <div className="border-b border-slate-100 p-5">
                    <h2 className="font-semibold text-slate-800">
                      Recent Products
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Recently added inventory items
                    </p>
                  </div>

                  {dashboard.recentProducts.length === 0 ? (
                    <p className="p-5 text-sm text-slate-500">
                      No products available.
                    </p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 text-slate-500">
                          <tr>
                            <th className="px-5 py-3">Product</th>
                            <th className="px-5 py-3">SKU</th>
                            <th className="px-5 py-3">Quantity</th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {dashboard.recentProducts.map((product) => (
                            <tr key={product._id}>
                              <td className="px-5 py-4 font-medium text-slate-800">
                                {product.name}
                              </td>
                              <td className="px-5 py-4 text-slate-500">
                                {product.sku}
                              </td>
                              <td className="px-5 py-4 font-medium text-slate-700">
                                {product.quantity}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                <section className="overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm">
                  <div className="border-b border-slate-100 p-5">
                    <h2 className="font-semibold text-slate-800">
                      Low Stock Alerts
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Products that need restocking
                    </p>
                  </div>

                  {dashboard.lowStockProducts.length === 0 ? (
                    <p className="p-5 text-sm text-slate-500">
                      No low-stock products. Everything looks good!
                    </p>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {dashboard.lowStockProducts.map((product) => (
                        <div
                          key={product._id}
                          className="flex items-center justify-between gap-3 p-5"
                        >
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-800">
                              {product.name}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              SKU: {product.sku}
                            </p>
                          </div>

                          <span className="shrink-0 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                            {product.quantity} left
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default UserDashboard;
