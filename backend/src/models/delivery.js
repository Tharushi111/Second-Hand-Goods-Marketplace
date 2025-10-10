import mongoose from "mongoose";

const orderHistorySchema = new mongoose.Schema({
  status: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  note: { type: String },
  updatedBy: { type: String }, // e.g., 'admin', 'user'
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    total: { type: Number, required: true },
    paymentMethod: { type: String }, // e.g., 'Credit Card', 'Cash'
    status: {
      type: String,
      enum: ["pending", "paid", "assigned", "delivered", "cancelled"],
      default: "pending",
    },
    deliveryMethod: { type: String, enum: ["Uber", "PickMe"] },
    history: [orderHistorySchema],
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
