import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUpload, FaBox, FaTag, FaDollarSign, FaAlignLeft } from "react-icons/fa";

export default function AddProductForm() {
  const navigate = useNavigate();
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState("");
  const [formData, setFormData] = useState({
    description: "",
    price: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/stock");
        setStocks(res.data);
      } catch (err) {
        toast.error("Failed to fetch stock items");
      }
    };
    fetchStocks();
  }, []);

  const handleStockChange = (e) => setSelectedStock(e.target.value);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setFormData({ ...formData, image: files[0] });
      if (files[0]) {
        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result);
        reader.readAsDataURL(files[0]);
      } else setImagePreview(null);
    } else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStock) return toast.error("Please select a stock item.");

    setIsSubmitting(true);
    const data = new FormData();
    data.append("stockId", selectedStock);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("image", formData.image);

    try {
      await axios.post("http://localhost:5001/api/products", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Product added successfully!");
      setSelectedStock("");
      setFormData({ description: "", price: "", image: null });
      setImagePreview(null);
      navigate("/product");
    } catch {
      toast.error("❌ Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stockDetails = stocks.find((s) => s._id === selectedStock);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
      {/* ✅ Only Top Center Alerts */}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: { borderRadius: "8px", padding: "16px", color: "#fff", fontWeight: "bold" },
          success: { style: { background: "green" } },
          error: { style: { background: "red" } },
        }}
      />

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <button
            onClick={() => navigate("/product")}
            className="flex items-center text-white hover:text-blue-200 mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Products
          </button>
          <h2 className="text-3xl font-bold">Add New Product</h2>
          <p className="text-blue-100 mt-2">
            Fill in the details to add a new product to your inventory
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-700 flex items-center">
                <FaBox className="mr-2 text-blue-500" /> Select Stock Item
              </label>
              <select
                value={selectedStock}
                onChange={handleStockChange}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                required
              >
                <option value="">-- Select a stock item --</option>
                {stocks.map((stock) => (
                  <option key={stock._id} value={stock._id}>
                    {stock.name} ({stock.category})
                  </option>
                ))}
              </select>
            </div>

            {stockDetails && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2">Selected Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <FaTag className="text-blue-500 mr-2" />
                    <span className="font-semibold">Name:</span>
                    <span className="ml-2">{stockDetails.name}</span>
                  </div>
                  <div className="flex items-center">
                    <FaBox className="text-blue-500 mr-2" />
                    <span className="font-semibold">Category:</span>
                    <span className="ml-2">{stockDetails.category}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-700 flex items-center">
                <FaAlignLeft className="mr-2 text-blue-500" /> Product Description
              </label>
              <textarea
                name="description"
                placeholder="Enter a detailed description of the product..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700 flex items-center">
                  <FaDollarSign className="mr-2 text-blue-500" /> Price
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="w-full pl-8 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-lg font-medium text-gray-700 flex items-center">
                  <FaUpload className="mr-2 text-blue-500" /> Product Image
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="h-24 w-24 object-cover rounded-lg mb-2" />
                      ) : (
                        <>
                          <FaUpload className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">Click to upload or drag and drop</p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="hidden"
                      required
                    />
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
              }`}
            >
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
