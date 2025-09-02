import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  stock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock",
    required: [true, "Stock reference is required"],
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: [true, "Description is required"],
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price must be positive"],
  },
  image: {
    type: String, // path or URL
    required: [true, "Product image is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Product", productSchema);
