import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import {
  FaArrowLeft,
  FaTimes,
  FaBox,
  FaTag,
  FaListOl,
  FaAlignLeft,
  FaSave,
  FaDollarSign,
  FaUsers,
} from "react-icons/fa";

const UpdateProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    quantity: 0,
    unitPrice: 0,
    reorderLevel: 0,
    description: "",
    supplier: "", // this will store supplier ID
  });

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Unauthorized: Please log in again", { position: "top-center" });
        navigate("/admin/login");
        return;
      }

      try {
        const [productRes, suppliersRes] = await Promise.all([
          axios.get(`http://localhost:5001/api/admin/auth/stocks/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5001/api/admin/auth/suppliers", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Ensure all fields are defined to avoid controlled/uncontrolled warnings
        setProduct({
          name: productRes.data.name || "",
          category: productRes.data.category || "",
          quantity: productRes.data.quantity || 0,
          unitPrice: productRes.data.unitPrice || 0,
          reorderLevel: productRes.data.reorderLevel || 0,
          description: productRes.data.description || "",
          supplier: productRes.data.supplier?._id || "",
        });

        setSuppliers(suppliersRes.data || []);
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
        toast.error(err.response?.data?.message || "Failed to load product or suppliers", {
          position: "top-center",
        });

        if (err.response?.status === 401) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const supplierOptions = suppliers.map((s) => ({ value: s._id, label: s.name }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const token = localStorage.getItem("adminToken");
    if (!token) {
      toast.error("Unauthorized: Please log in again", { position: "top-center" });
      navigate("/admin/login");
      return;
    }

    try {
      const payload = { ...product, supplierId: product.supplier };
      await axios.put(`http://localhost:5001/api/admin/auth/stocks/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Show success toast first
      toast.success("Product updated successfully", { position: "top-center" });

      // Delay navigation so toast is visible
      setTimeout(() => {
        navigate("/inventory/products");
      }, 1000);
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Failed to update product", { position: "top-center" });

      if (err.response?.status === 401) {
        localStorage.removeItem("adminToken");
        navigate("/admin/login");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleBack = () => navigate("/inventory/products");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8 px-4">
      <Toaster position="top-center" />
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors mr-4"
            >
              <FaArrowLeft className="mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-gray-800">Update Product</h1>
          </div>
          <button
            onClick={handleBack}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaBox className="mr-2 text-blue-500" /> Product Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  placeholder="Enter product name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaTag className="mr-2 text-blue-500" /> Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={product.category}
                  onChange={handleChange}
                  placeholder="Enter category"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Quantity */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1">Quantity</label>
                  <input
                    type="number"
                    name="quantity"
                    value={product.quantity}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>

                {/* Reorder Level */}
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                    <FaListOl className="mr-2 text-blue-500" /> Reorder Level
                  </label>
                  <input
                    type="number"
                    name="reorderLevel"
                    value={product.reorderLevel}
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              {/* Unit Price */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaDollarSign className="mr-2 text-green-500" /> Unit Price
                </label>
                <input
                  type="number"
                  name="unitPrice"
                  value={product.unitPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              {/* Supplier */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaUsers className="mr-2 text-purple-500" /> Supplier
                </label>
                <Select
                  options={supplierOptions}
                  value={supplierOptions.find((s) => s.value === product.supplier)}
                  onChange={(selected) => setProduct({ ...product, supplier: selected.value })}
                  styles={{
                    control: (base) => ({ ...base, backgroundColor: "white", color: "black" }),
                    singleValue: (base) => ({ ...base, color: "black" }),
                    menu: (base) => ({ ...base, backgroundColor: "white" }),
                    option: (base, { isSelected, isFocused }) => ({
                      ...base,
                      backgroundColor: isSelected ? "#3b82f6" : isFocused ? "#dbeafe" : "white",
                      color: isSelected ? "white" : "black",
                    }),
                  }}
                  placeholder="Select Supplier"
                  isClearable
                />
              </div>

              {/* Description */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <FaAlignLeft className="mr-2 text-blue-500" /> Description
                </label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  placeholder="Enter product description"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  rows={4}
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaSave className="mr-2" />
                      Update Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
