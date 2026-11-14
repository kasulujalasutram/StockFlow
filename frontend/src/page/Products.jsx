
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Trash2,
  Plus,
  Package,
  RefreshCw
} from "lucide-react";

import API from "../services/api";

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = user?.role === "admin";

  const categories = [
    "All",
    "Electronics",
    "Furniture",
    "Clothing",
    "Groceries",
    "Home Appliances",
    "Sports",
    "Books",
    "Accessories",
    "Other"
  ];

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await API.get("/products");

      setProducts(response.data.products || []);

    } catch (err) {
      console.error("Fetch products error:", err);

      setError(
        err.response?.data?.message ||
        "Unable to load products."
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product - Admin only
  const handleDelete = async (id) => {
    if (!isAdmin) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await API.delete(`/products/${id}`);

      setProducts((prev) =>
        prev.filter((product) => product._id !== id)
      );

      alert("Product deleted successfully!");

    } catch (err) {
      console.error("Delete product error:", err);

      alert(
        err.response?.data?.message ||
        "Failed to delete product."
      );
    }
  };

  // Search and category filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.sku.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      selectedType === "All" ||
      product.type === selectedType;

    return matchesSearch && matchesType;
  });

  // Stock status
  const getStockStatus = (product) => {
    if (product.quantity === 0) {
      return {
        label: "Out of Stock",
        style: "bg-red-100 text-red-700"
      };
    }

    if (product.quantity <= product.lowStockThreshold) {
      return {
        label: "Low Stock",
        style: "bg-yellow-100 text-yellow-700"
      };
    }

    return {
      label: "In Stock",
      style: "bg-green-100 text-green-700"
    };
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Products
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Manage your organization inventory
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={fetchProducts}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          {isAdmin && (
            <Link
              to="/add-product"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              <Plus size={18} />
              Add Product
            </Link>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4">

        <div className="flex items-center gap-2 border rounded-lg px-3 py-2 flex-1">
          <Search size={19} className="text-gray-400" />

          <input
            type="text"
            placeholder="Search product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full outline-none text-sm"
          />
        </div>

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border rounded-lg px-3 py-2 outline-none text-sm"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex justify-between">
          <span>{error}</span>

          <button onClick={fetchProducts} className="underline">
            Retry
          </button>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-x-auto">

        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading products...
          </div>
        ) : (
          <table className="w-full text-left">

            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-sm font-semibold">Product</th>
                <th className="p-4 text-sm font-semibold">SKU</th>
                <th className="p-4 text-sm font-semibold">Category</th>
                <th className="p-4 text-sm font-semibold">Quantity</th>
                <th className="p-4 text-sm font-semibold">Price</th>
                <th className="p-4 text-sm font-semibold">Status</th>

                {isAdmin && (
                  <th className="p-4 text-sm font-semibold">Action</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y">

              {filteredProducts.map((product) => {
                const status = getStockStatus(product);

                return (
                  <tr key={product._id} className="hover:bg-gray-50">

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg">
                          <Package className="text-blue-600" size={20} />
                        </div>

                        <div>
                          <p className="font-semibold text-gray-800">
                            {product.name}
                          </p>

                          <p className="text-xs text-gray-500">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-sm text-gray-600">
                      {product.sku}
                    </td>

                    <td className="p-4 text-sm text-gray-600">
                      {product.type}
                    </td>

                    <td className="p-4 text-sm font-semibold">
                      {product.quantity}
                    </td>

                    <td className="p-4 text-sm text-gray-700">
                      ₹{Number(product.sellingPrice).toLocaleString("en-IN")}
                    </td>

                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.style}`}>
                        {status.label}
                      </span>
                    </td>

                    {isAdmin && (
                      <td className="p-4">
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete product"
                        >
                          <Trash2 size={19} />
                        </button>
                      </td>
                    )}

                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td
                    colSpan={isAdmin ? 7 : 6}
                    className="p-10 text-center text-gray-500"
                  >
                    No products found.
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        )}

      </div>

      <p className="text-sm text-gray-500">
        Showing {filteredProducts.length} of {products.length} products
      </p>

    </div>
  );
}

export default Products;
