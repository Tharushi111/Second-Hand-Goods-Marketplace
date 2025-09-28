import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
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

  const navigate = useNavigate(); // for redirect after success

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

  // Frontend validation
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Stock Name is required";
    if (!category.trim()) newErrors.category = "Category is required";
    if (quantity === "" || quantity < 0) newErrors.quantity = "Quantity must be 0 or more";
    if (reorderLevel === "" || reorderLevel < 0) newErrors.reorderLevel = "Reorder Level must be 0 or more";
    if (unitPrice === "" || unitPrice < 0) newErrors.unitPrice = "Unit Price must be 0 or more";
    if (!supplierId) newErrors.supplierId = "Please select a supplier";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return toast.error("Please fix errors before submitting");
  
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5001/api/admin/auth/stocks/",
        {
          name,
          category,
          quantity: Number(quantity),
          reorderLevel: Number(reorderLevel),
          unitPrice: Number(unitPrice),
          description,
          supplierId,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("Response:", res.data); 
  
      toast.success("Stock added successfully!", {
        position: "top-center",
        autoClose: 1500,
      });
      
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
            onChange={(e) => setQuantity(e.target.value)}
            onKeyDown={(e) => {
              if (["e", "E", "+", "-"].includes(e.key)) {
                e.preventDefault(); 
              }
            }}
            placeholder="0"
            min="0"
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
            onChange={(e) => setReorderLevel(e.target.value)}
            className={`w-full p-2 border rounded ${errors.reorderLevel ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.reorderLevel && <p className="text-red-500 text-sm">{errors.reorderLevel}</p>}
        </div>

        {/* Unit Price */}
        <div>
          <label>Unit Price (Rs)*</label>
          <input
            type="number"
            value={unitPrice}
            onChange={(e) => setUnitPrice(e.target.value)}
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
