import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AddStockForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Frontend validation
  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Stock Name is required";
    if (!category.trim()) newErrors.category = "Category is required";
    if (quantity === "" || quantity < 0) newErrors.quantity = "Quantity must be 0 or more";
    if (reorderLevel === "" || reorderLevel < 0) newErrors.reorderLevel = "Reorder Level must be 0 or more";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before submitting", { position: "top-center" });
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5001/api/stock", {
        name,
        category,
        quantity: Number(quantity),
        reorderLevel: Number(reorderLevel),
        description,
        // supplier: supplierId, // Uncomment when supplier part is ready
      });
      toast.success("Stock added successfully", { position: "top-center" });
      // Clear form
      setName("");
      setCategory("");
      setQuantity("");
      setReorderLevel("");
      setDescription("");
      setErrors({});
    } catch (err) {
      console.error(err);
      toast.error("Failed to add stock", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex justify-center items-center">
      {/* Toast container */}
      <Toaster position="top-center" reverseOrder={false} />

      <div className="w-full max-w-2xl bg-white shadow-lg rounded-xl p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Add New Stock</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Stock Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Stock Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Dell Laptop"
              className={`w-full px-4 py-2 border rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Category <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => {
  
                const lettersOnly = e.target.value.replace(/[^a-zA-Z\s]/g, "");
                setCategory(lettersOnly);
              }}
              placeholder="e.g., Laptop, Mobile"
              className={`w-full px-4 py-2 border rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => {
                
                const numbersOnly = e.target.value.replace(/[^0-9]/g, "");
                setQuantity(numbersOnly);
              }}
              placeholder="e.g., 20"
              className={`w-full px-4 py-2 border rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.quantity ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
          </div>


          {/* Reorder Level */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Reorder Level <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={reorderLevel}
              onChange={(e) => setReorderLevel(e.target.value.replace(/\D/g, ""))} // strips non-digits
              placeholder="e.g., 5"
              className={`w-full px-4 py-2 border rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.reorderLevel ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.reorderLevel && <p className="text-red-500 text-sm mt-1">{errors.reorderLevel}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={4}
            ></textarea>
          </div>

          {/* Supplier (Commented for now) */}
          {/*
          <div>
            <label className="block text-gray-700 font-medium mb-1">Supplier</label>
            <select className="w-full px-4 py-2 border rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Select Supplier</option>
              // Populate options when supplier part is ready
            </select>
          </div>
          */}

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Stock"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStockForm;
