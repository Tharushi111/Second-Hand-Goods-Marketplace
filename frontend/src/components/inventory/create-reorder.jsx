import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxes, faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

function ReorderRequestForm({ onSuccess }) {
  const [form, setForm] = useState({
    title: "",
    quantity: "",
    category: "",
    priority: "Normal",
    description: ""
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
   
    if (name === "quantity") {
      if (/^\d*$/.test(value)) {
        setForm({ ...form, [name]: value });
      }
    } else {
      setForm({ ...form, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.quantity || Number(form.quantity) <= 0) newErrors.quantity = "Quantity must be greater than 0";
    if (!form.category.trim() || form.category.trim().length < 2) newErrors.category = "Category must be at least 2 characters";
    if (!form.description.trim() || form.description.trim().length < 10) newErrors.description = "Description must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const res = await axios.post("http://localhost:5001/api/reorders", {
        ...form,
        quantity: Number(form.quantity)
      });
      toast.success("Reorder request created successfully!", { position: "top-center" });

      setForm({ title: "", quantity: "", category: "", priority: "Normal", description: "" });
      if (onSuccess) onSuccess(res.data.request); 
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create reorder request", { position: "top-center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const setPriority = (level) => setForm({ ...form, priority: level });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <ToastContainer />
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-t-xl text-center">
          <FontAwesomeIcon icon={faBoxes} size="2x" className="mb-2 text-white" />
          <h2 className="text-2xl text-white">Create Reorder Request</h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">Title*</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              className={`w-full border rounded-lg p-3 bg-white text-black ${errors.title ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Quantity & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Quantity */}
            <div>
              <label className="block mb-1 font-medium">Quantity*</label>
              <input
                type="text"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Ex: 20"
                className={`w-full border rounded-lg p-3 bg-white text-black ${errors.quantity ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block mb-1 font-medium">Category*</label>
              <input
                type="text"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="Ex: Laptops, Headphones"
                className={`w-full border rounded-lg p-3 bg-white text-black ${errors.category ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block mb-1 font-medium">Priority*</label>
            <div className="grid grid-cols-3 gap-2">
              {["Low", "Normal", "High"].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPriority(level)}
                  className={`py-3 px-4 rounded-lg border text-center ${
                    form.priority === level
                      ? level === "Low" ? "bg-green-100 border-green-500 text-green-700"
                      : level === "Normal" ? "bg-yellow-100 border-yellow-500 text-yellow-700"
                      : "bg-red-100 border-red-500 text-red-700"
                      : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">Description*</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter full details"
              className={`w-full border rounded-lg p-3 h-32 bg-white text-black ${errors.description ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-lg text-white font-medium flex justify-center items-center space-x-2 ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
              }`}
            >
              {isSubmitting ? <><FontAwesomeIcon icon={faSpinner} spin /><span>Processing...</span></> 
              : <><FontAwesomeIcon icon={faPaperPlane} /><span>Create Request</span></>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ReorderRequestForm;
