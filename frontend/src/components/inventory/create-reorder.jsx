import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxes, faPaperPlane, faSpinner } from '@fortawesome/free-solid-svg-icons';
import toast from "react-hot-toast";

function ReorderRequestForm({ onSubmit }) {
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
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.quantity || form.quantity <= 0) newErrors.quantity = "Quantity must be greater than 0";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      if (onSubmit) {
        await onSubmit(form);
      }

      toast.success("Reorder request created successfully", {
        position: "top-center", // <-- show at top center
      });
      setForm({
        title: "",
        quantity: "",
        category: "",
        priority: "Normal",
        description: ""
      });
    } catch (err) {
        toast.error(err?.message || "Failed to create reorder request", {
            position: "top-center", // <-- show at top center
        });
    } finally {
      setIsSubmitting(false);
    }
  };

  const setPriority = (level) => setForm({ ...form, priority: level });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
        
        {/* Header */}
        <div className="bg-[#A2C3E8] p-6 rounded-t-xl text-center flex flex-col items-center">
          <FontAwesomeIcon icon={faBoxes} size="2x" className="mb-2 text-black" />
          <h2 className="text-2xl text-black">Create Reorder Request</h2>
          <p className="text-sm opacity-90 text-black">
            Fill in the details to request new stock from suppliers.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Ex: Need 20 Smart TVs"
              className={`w-full pl-4 pr-4 py-3 border rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ${errors.title ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Quantity & Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="quantity"
                value={form.quantity}
                onChange={handleChange}
                placeholder="Ex: 20"
                className={`w-full pl-4 pr-4 py-3 border rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 ${errors.quantity ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.quantity && <p className="text-red-500 text-sm mt-1">{errors.quantity}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className={`w-full pl-4 pr-4 py-3 border rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 appearance-none ${errors.category ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select Category</option>
                <option value="Laptops">Laptops</option>
                <option value="Mobile Phones">Mobile Phones</option>
                <option value="Televisions">Televisions</option>
                <option value="Accessories">Accessories</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Priority <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Low", "Normal", "High"].map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setPriority(level)}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter full details (brand, model, specs, etc.)"
              className={`w-full pl-4 pr-4 py-3 border rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition duration-200 h-32 ${errors.description ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition duration-200 flex items-center justify-center space-x-2 ${
                isSubmitting 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-[#78aae3] hover:bg-[#587fb8]"
              }`}
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faPaperPlane} />
                  <span>Create Request</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ReorderRequestForm;
