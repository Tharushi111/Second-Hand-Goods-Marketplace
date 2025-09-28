import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String },
});


const paymentSlipSchema = new mongoose.Schema(
  {
    filename: { type: String },
    url: { type: String }, 
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,  
    },

    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    items: { type: [orderItemSchema], required: true },
    subtotal: { type: Number, required: true, min: 0 },
    deliveryCharge: { type: Number, required: true, min: 0, default: 0 },
    total: { type: Number, required: true, min: 0 },

    
    customer: {
      username: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String }, 
    },

    address: {
      line1: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, default: "Sri Lanka" },
    },

    deliveryMethod: {
      type: String,
      enum: ["home", "different", "store"],
      default: "home",
    },
    notes: { type: String },

    paymentMethod: {
      type: String,
      enum: ["online", "bank", "cash_on_delivery"],
      required: true,
    },
    paymentSlip: paymentSlipSchema,

    status: {
      type: String,
      enum: [
        "pending",
        "transfer_pending",
        "confirmed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    history: [
      {
        status: { type: String },
        updatedAt: { type: Date, default: Date.now },
        note: { type: String },
        updatedBy: { type: String },
      },
    ],
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${count + 1}`;
  }

  if (this.isModified("status")) {
    const lastHistory = this.history[this.history.length - 1];

    if (!lastHistory || lastHistory.status !== this.status) {
      this.history.push({
        status: this.status,
        updatedAt: new Date(),
        note: `Status changed to ${this.status}`,
        updatedBy: "system",
      });
    }
  }

  next();
});

orderSchema.virtual("summary").get(function () {
  return {
    orderNumber: this.orderNumber,
    customer: this.customer.username,
    total: this.total,
    status: this.status,
  };
});

export default mongoose.model("Order", orderSchema);