
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PackagePlus } from "lucide-react";
import API from "../services/api";

function AddProduct() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    description: "",
    type: "",
    quantity: "",
    costPrice: "",
    sellingPrice: "",
    lowStockThreshold: 5
  });

  const categories = [
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

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const productData = {
        ...formData,
        quantity: Number(formData.quantity),
        costPrice: Number(formData.costPrice),
        sellingPrice: Number(formData.sellingPrice),
        lowStockThreshold: Number(formData.lowStockThreshold)
      };

      const response = await API.post(
        "/products",
        productData
      );

      if (response.data.success) {
        alert("Product added successfully!");

        navigate("/products");
      }

    } catch (error) {
      console.error("Add product error:", error);

      alert(
        error.response?.data?.message ||
        "Failed to add product. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-3 rounded-xl">
          <PackagePlus size={28} className="text-blue-600" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Add New Product
          </h2>

          <p className="text-sm text-gray-500">
            Add a product to your organization inventory
          </p>
        </div>
      </div>

      {/* Product Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 md:p-8 rounded-xl shadow-sm space-y-6"
      >

        {/* Product Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Product Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name *
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                required
              />
            </div>

            {/* SKU */}
            <div>
              <label className="block text-sm font-medium mb-2">
                SKU *
              </label>

              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                placeholder="Example: LAP001"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Category *
              </label>

              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                required
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Description
              </label>

              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter product description"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

          </div>
        </div>

        <div className="border-t pt-5">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Inventory Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Quantity *
              </label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                placeholder="Enter quantity"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                required
              />
            </div>

            {/* Low Stock Threshold */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Low Stock Threshold
              </label>

              <input
                type="number"
                name="lowStockThreshold"
                value={formData.lowStockThreshold}
                onChange={handleChange}
                min="0"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
              />
            </div>

            {/* Cost Price */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Cost Price (₹) *
              </label>

              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter cost price"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                required
              />
            </div>

            {/* Selling Price */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Selling Price (₹) *
              </label>

              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter selling price"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                required
              />
            </div>

          </div>
        </div>

        {/* Buttons */}
        <div className="border-t pt-5 flex flex-col sm:flex-row justify-end gap-3">

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg"
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>

        </div>

      </form>
    </div>
  );
}

export default AddProduct;
