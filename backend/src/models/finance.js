import mongoose from "mongoose";

const financeSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Income", "Expense"],
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: [0, "Amount must be positive"]
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Finance", financeSchema);