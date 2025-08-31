import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Stock name is required"],
    trim: true,
    maxlength: [100, "Stock name cannot exceed 100 characters"]
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity cannot be negative"],
    default: 0
  },
  reorderLevel: {
    type: Number,
    required: [true, "Reorder level is required"],
    min: [0, "Reorder level cannot be negative"],
    default: 0
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description cannot exceed 500 characters"]
  },
  // Supplier part commented out
  // supplier: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Supplier"
  // },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;
