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

  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Supplier is required"]
  },

  // Unit price for each item
  unitPrice: {
    type: Number,
    required: [true, "Unit price is required"],
    min: [0, "Unit price cannot be negative"],
    validate: {
      validator: function (value) {
        return Number.isFinite(value);
      },
      message: "Unit price must be a valid number"
    }
  },

  // Total price = quantity * unitPrice (auto-calculated)
  totalPrice: {
    type: Number,
    min: [0, "Total price cannot be negative"],
    default: 0
  },

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Automatically calculate total price before saving
stockSchema.pre("save", function (next) {
  this.totalPrice = this.quantity * this.unitPrice;
  next();
});

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;
