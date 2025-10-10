import mongoose from "mongoose";

const reorderRequestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [3, "Title must be at least 3 characters"],
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [1, "Quantity must be at least 1"]
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true,
    minlength: [2, "Category must be at least 2 characters"],
    maxlength: [50, "Category cannot exceed 50 characters"]
  },  
  priority: {
    type: String,
    enum: ["Low", "Normal", "High"],
    default: "Normal"
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    minlength: [10, "Description must be at least 10 characters"],
    maxlength: [500, "Description cannot exceed 500 characters"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  replies: [
  {
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reply: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }
]

});

// Optional: virtual or method to format display text
reorderRequestSchema.methods.summary = function () {
  return `${this.title} (${this.quantity} units) - Priority: ${this.priority}`;
};

export default mongoose.model("ReorderRequest", reorderRequestSchema);
