import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const UpdateReorderForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state;

  const [form, setForm] = useState({
    title: order.title,
    quantity: order.quantity,
    category: order.category,
    priority: order.priority,
    description: order.description,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePriority = (level) => setForm({ ...form, priority: level });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.put(`http://localhost:5001/api/reorders/${order._id}`, form);
      toast.success("Reorder request updated successfully!", { position: "top-center" });
      navigate("/inventory/reorders");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update reorder request.", { position: "top-center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 flex justify-center items-center">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl">
        <h2 className="text-2xl text-black mb-6 text-center">Update Reorder Request</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title</label>
            <input 
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 bg-white text-black"
            />
          </div>

          {/* Quantity */}
          <div>
            <label className="block mb-1 font-medium">Quantity</label>
            <input 
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 bg-white text-black"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select 
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 bg-white text-black"
            >
              <option value="" disabled>Select Category</option>
              <option value="Laptops">Laptops</option>
              <option value="Mobile Phones">Mobile Phones</option>
              <option value="Televisions">Televisions</option>
              <option value="Accessories">Accessories</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block mb-1 font-medium">Priority</label>
            <div className="grid grid-cols-3 gap-2">
              {["Low", "Normal", "High"].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handlePriority(level)}
                  className={`py-3 px-4 rounded-lg border transition duration-200 flex items-center justify-center space-x-2 ${
                    form.priority === level 
                      ? level === "Low" ? "bg-green-100 border-green-500 text-green-700"
                        : level === "Normal" ? "bg-yellow-100 border-yellow-500 text-yellow-700"
                        : "bg-red-100 border-red-500 text-red-700"
                      : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span>{level}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded-lg p-3 h-32 focus:ring-2 focus:ring-blue-400 bg-white text-black"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={() => navigate("/inventory/reorders")}
              className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-3 rounded-lg text-white font-medium transition duration-200 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              }`}
            >
              {isSubmitting ? "Saving..." : "Save"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default UpdateReorderForm;
