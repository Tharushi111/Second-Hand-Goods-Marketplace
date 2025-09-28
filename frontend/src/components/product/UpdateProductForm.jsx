import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast} from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaUpload, FaBox, FaTag, FaDollarSign, FaAlignLeft, FaSave } from "react-icons/fa";

export default function UpdateProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState("");
  const [formData, setFormData] = useState({
    description: "",
    price: "",
    image: null,
  });
  const [existingImage, setExistingImage] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Format price to 300,000.00 format
  const formatPrice = (price) => {
    return parseFloat(price || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  // Parse price input for formatting
  const formatPriceInput = (value) => {
    // Remove all non-digit characters except decimal point
    let cleanValue = value.replace(/[^\d.]/g, '');
    
    // Ensure only one decimal point
    const decimalCount = (cleanValue.match(/\./g) || []).length;
    if (decimalCount > 1) {
      cleanValue = cleanValue.substring(0, cleanValue.lastIndexOf('.'));
    }
    
    // Split into integer and decimal parts
    const parts = cleanValue.split('.');
    let integerPart = parts[0];
    let decimalPart = parts.length > 1 ? parts[1] : '';
    
    // Limit decimal part to 2 digits
    if (decimalPart.length > 2) {
      decimalPart = decimalPart.slice(0, 2);
    }
    
    // Add commas to integer part (from the right)
    if (integerPart) {
      integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    // Combine parts
    let formattedValue = integerPart;
    if (decimalPart) {
      formattedValue += '.' + decimalPart;
    } else if (cleanValue.includes('.')) {
      // If user typed decimal point but no digits yet
      formattedValue += '.';
    }
    
    return formattedValue;
  };

  const parsePrice = (formattedValue) => {
    // Remove commas and return raw number for backend
    return formattedValue.replace(/,/g, '');
  };

  // Fetch product details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`http://localhost:5001/api/products/${id}`);
        setFormData({
          description: res.data.description,
          price: formatPrice(res.data.price.toString()),
          image: null,
        });
        setSelectedStock(res.data.stock._id);
        if (res.data.image) setExistingImage(res.data.image);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch product details");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Fetch all stocks
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/stock");
        setStocks(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch stock items");
      }
    };
    fetchStocks();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (file) {
        if (!["image/png", "image/jpeg", "image/jpg", "image/gif"].includes(file.type)) {
          toast.error("Only PNG, JPG, JPEG, GIF are allowed");
          return;
        }
        if (file.size > 5 * 1024 * 1024) {
          toast.error("Max image size is 5MB");
          return;
        }
        setFormData({ ...formData, image: file });

        const reader = new FileReader();
        reader.onload = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setFormData({ ...formData, image: null });
        setImagePreview(null);
      }
    } else if (name === "price") {
      // Format price input
      setFormData({ ...formData, [name]: formatPriceInput(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleStockChange = (e) => setSelectedStock(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedStock) {
      toast.error("Please select a stock item");
      return;
    }
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    
    const parsedPrice = parsePrice(formData.price);
    if (!parsedPrice || parsedPrice <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append("stockId", selectedStock);
    data.append("description", formData.description);
    data.append("price", parsedPrice.toString());
    if (formData.image) data.append("image", formData.image);

    try {
      await axios.put(`http://localhost:5001/api/products/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Product updated successfully!");
      navigate("/product");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stockDetails = stocks.find((s) => s._id === selectedStock);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">

      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <button
            onClick={() => navigate("/product")}
            className="flex items-center text-white hover:text-blue-200 mb-4 transition-colors"
          >
            <FaArrowLeft className="mr-2" /> Back to Products
          </button>
          <h2 className="text-3xl font-bold">Update Product</h2>
          <p className="text-blue-100 mt-2">Modify the product details below</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stock dropdown */}
            <div className="space-y-2">
              <label className="flex items-center text-lg font-medium text-gray-700">
                <FaBox className="mr-2 text-blue-500" /> Select Stock Item
              </label>
              <div className="relative">
                <select
                  value={selectedStock}
                  onChange={handleStockChange}
                  className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black appearance-none"
                  required
                >
                  <option value="">-- Select a stock item --</option>
                  {stocks.map((stock) => (
                    <option key={stock._id} value={stock._id}>
                      {stock.name} ({stock.category})
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path>
                  </svg>
                </div>
              </div>
            </div>

            {/* Auto-filled name and category */}
            {stockDetails && (
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <h3 className="font-medium text-blue-800 mb-2">Product Details</h3>
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

            {/* Description */}
            <div className="space-y-2">
              <label className="flex items-center text-lg font-medium text-gray-700">
                <FaAlignLeft className="mr-2 text-blue-500" /> Product Description
              </label>
              <textarea
                name="description"
                placeholder="Enter a detailed description of the product..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                required
              ></textarea>
            </div>

            {/* Price and Image Upload in a grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div className="space-y-2">
                <label className="flex items-center text-lg font-medium text-gray-700">
                  <span className="mr-2 text-blue-500 font-semibold">Rs.</span> Price
                </label>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">Rs.</span>
                  </div>
                  <input
                    type="text"
                    name="price"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full pl-8 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-black"
                    required
                  />
                </div>
                <p className="text-sm text-gray-500">Format: 300,000.00 or 300,000.39</p>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <label className="flex flex-col items-center justify-center text-lg font-medium text-gray-700">
                  <FaUpload className="mr-2 text-blue-500" /> Product Image
                </label>
                <div className="flex flex-col items-center">
                  {(existingImage || imagePreview) && (
                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                      <img
                        src={imagePreview || `http://localhost:5001${existingImage}`}
                        alt="Product preview"
                        className="h-32 w-32 object-cover rounded-lg border"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <FaUpload className="w-8 h-8 mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 5MB)</p>
                      </div>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Leave empty to keep current image</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse md:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate("/product")}
                className="flex items-center justify-center px-6 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex items-center justify-center px-6 py-3 rounded-xl font-semibold text-white transition-all ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Updating Product...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" /> Update Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}