import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    validate: {
      validator: function(v) {
        return /^[A-Za-z\s]+$/.test(v); 
      },
      message: props => `${props.value} is not a valid name. Only letters allowed.`
    }
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: {
      values: ["Laptop", "Smartphone", "Tablet", "Accessories", "Other"], 
      message: "{VALUE} is not a valid category"
    }
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: [0, "Quantity cannot be negative"],
    validate: {
      validator: Number.isInteger,
      message: "Quantity must be an integer"
    }
  },
  reorderLevel: {
    type: Number,
    required: [true, "Reorder level is required"],
    min: [0, "Reorder level cannot be negative"],
    validate: {
      validator: Number.isInteger,
      message: "Reorder level must be an integer"
    }
  },
  supplier: {
    type: String,
    required: [true, "Supplier is required"]
  },
  dateAdded: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Stock", stockSchema);
