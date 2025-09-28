import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddStockForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [description, setDescription] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  // Get admin token from localStorage
  const token = localStorage.getItem("adminToken");

  // Fetch all suppliers (admin only)
  const fetchSuppliers = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5001/api/admin/auth/suppliers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuppliers(data);
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to load suppliers");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  // Format number with commas and exactly 2 decimal places
  const formatNumber = (value) => {
    // Remove all non-digit characters except decimal point
    const num = value.replace(/[^\d.]/g, '');
    
    if (num === '') return '';
    
    // Split into integer and decimal parts
    const parts = num.split('.');
    let integerPart = parts[0];
    let decimalPart = parts[1] || '';
    
    // Don't allow integer part to start with 0 if it has more digits
    if (integerPart.length > 1 && integerPart.startsWith('0')) {
      integerPart = integerPart.substring(1);
    }
    
    // Format integer part with commas
    if (integerPart) {
      integerPart = parseInt(integerPart, 10).toLocaleString('en-US');
    }
    
    // Handle decimal part - allow any digits but limit to 2 places
    if (decimalPart !== '') {
      // Limit decimal part to 2 digits
      decimalPart = decimalPart.substring(0, 2);
    } else if (value.includes('.')) {
      // If user typed decimal point but no digits, don't auto-fill
      decimalPart = '';
    }
    
    return decimalPart !== '' ? `${integerPart}.${decimalPart}` : 
           value.includes('.') ? `${integerPart}.` : integerPart;
  };

  // Parse formatted number back to raw number
  const parseFormattedNumber = (formattedValue) => {
    return formattedValue.replace(/,/g, '');
  };

  // Handle unit price change with formatting
  const handleUnitPriceChange = (e) => {
    const rawValue = e.target.value;
    
    // Prevent multiple decimal points
    if ((rawValue.match(/\./g) || []).length > 1) return;
    
    const formattedValue = formatNumber(rawValue);
    setUnitPrice(formattedValue);
  };

  // Handle reorder level change (allow only positive integers, no decimals)
  const handleReorderLevelChange = (e) => {
    const value = e.target.value;
    
    // Allow only numbers (no decimal point)
    const sanitizedValue = value.replace(/[^\d]/g, '');
    
    // If value is not empty, prevent zero and negative values
    if (sanitizedValue !== '') {
      const numericValue = parseInt(sanitizedValue);
      if (numericValue <= 0) return;
    }
    
    setReorderLevel(sanitizedValue);
  };

  // prevent negative values
  const handleQuantityChange = (e) => {
    const value = e.target.value;
    
    // Allow only numbers
    const sanitizedValue = value.replace(/[^\d]/g, '');
    
    // If value is not empty, prevent negative values
    if (sanitizedValue !== '') {
      const numericValue = parseInt(sanitizedValue);
      if (numericValue < 0) return;
    }
    
    setQuantity(sanitizedValue);
  };

  // Frontend validation
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Stock Name is required";
    if (!category.trim()) newErrors.category = "Category is required";
    if (quantity === "" || quantity < 0) newErrors.quantity = "Quantity must be 0 or more";
    
    // Reorder level validation (must be integer greater than 0)
    if (reorderLevel === "" || parseInt(reorderLevel) <= 0) {
      newErrors.reorderLevel = "Reorder Level must be a positive whole number";
    }
    
    // Unit price validation (must be greater than 0)
    const rawUnitPrice = parseFormattedNumber(unitPrice);
    if (unitPrice === "" || parseFloat(rawUnitPrice) <= 0) {
      newErrors.unitPrice = "Unit Price must be greater than 0";
    }
    
    if (!supplierId) newErrors.supplierId = "Please select a supplier";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return toast.error("Please fix errors before submitting");
  
    setLoading(true);
    try {
      // Parse unit price back to raw number before sending
      const rawUnitPrice = parseFormattedNumber(unitPrice);
      
      const res = await axios.post(
        "http://localhost:5001/api/admin/auth/stocks/",
        {
          name,
          category,
          quantity: Number(quantity),
          reorderLevel: Number(reorderLevel),
          unitPrice: Number(rawUnitPrice),
          description,
          supplierId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Response:", res.data); 
  
      toast.success("Stock added successfully!");
      
      // Reset form
      setName("");
      setCategory("");
      setQuantity("");
      setReorderLevel("");
      setUnitPrice("");
      setDescription("");
      setSupplierId("");
      setErrors({});
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to add stock");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-center">Add New Stock</h2>

        {/* Stock Name */}
        <div>
          <label>Stock Name*</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full p-2 border rounded ${errors.name ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
        </div>

        {/* Category */}
        <div>
          <label>Category*</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`w-full p-2 border rounded ${errors.category ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
        </div>

        {/* Quantity */}
        <div>
          <label>Quantity*</label>
          <input
            type="number"
            value={quantity}
            onChange={handleQuantityChange}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", "."].includes(e.key)) {
                e.preventDefault(); 
              }
            }}
            placeholder="0"
            min="0"
            step="1"
            className={`w-full p-2 border rounded ${errors.quantity ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.quantity && <p className="text-red-500 text-sm">{errors.quantity}</p>}
        </div>

        {/* Reorder Level */}
        <div>
          <label>Reorder Level*</label>
          <input
            type="number"
            value={reorderLevel}
            onChange={handleReorderLevelChange}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-", "."].includes(e.key)) {
                e.preventDefault(); 
              }
            }}
            placeholder="0"
            min="1"
            step="1"
            className={`w-full p-2 border rounded ${errors.reorderLevel ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.reorderLevel && <p className="text-red-500 text-sm">{errors.reorderLevel}</p>}
        </div>

        {/* Unit Price */}
        <div>
          <label>Unit Price (Rs)*</label>
          <input
            type="text"
            value={unitPrice}
            onChange={handleUnitPriceChange}
            placeholder="0.00"
            className={`w-full p-2 border rounded ${errors.unitPrice ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.unitPrice && <p className="text-red-500 text-sm">{errors.unitPrice}</p>}
        </div>

        {/* Supplier Dropdown */}
        <div>
          <label>Supplier*</label>
          <select
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            className={`w-full p-2 border rounded ${errors.supplierId ? "border-red-500" : "border-gray-300"}`}
          >
            <option value="">Select Supplier</option>
            {suppliers.map((sup) => (
              <option key={sup._id} value={sup._id}>
                {sup.username}
              </option>
            ))}
          </select>
          {errors.supplierId && <p className="text-red-500 text-sm">{errors.supplierId}</p>}
        </div>

        {/* Description */}
        <div>
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded border-gray-300"
            rows={3}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Stock"}
        </button>
      </form>
    </div>
  );
};

export default AddStockForm;