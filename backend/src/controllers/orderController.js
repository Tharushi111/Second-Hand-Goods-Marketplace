import Order from "../models/Order.js";
import Stock from "../models/Stock.js";

// Get All Orders (User) 
export const getAllOrdersForUser = async (req, res) => {
  try {
    // Filter by logged-in user
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.product"); 

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get Order By ID 
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "username email phone address city country");

    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload Bank Slip 
export const uploadBankSlip = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!req.file) {
      return res.status(400).json({ message: "No slip uploaded" });
    }

    order.paymentSlip = {
      filename: req.file.filename,
      url: `/uploads/slips/${req.file.filename}`,
    };

    // Only update to transfer_pending if slip uploaded
    order.status = "transfer_pending";

    order.history.push({
      status: "transfer_pending",
      updatedAt: new Date(),
      note: "Bank slip uploaded",
      updatedBy: "customer",
    });

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id).populate("items.product");

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Update order status and history
    order.status = status;
    order.history.push({
      status,
      updatedAt: new Date(),
      note: `Status changed to ${status}`,
      updatedBy: "admin",
    });

    // 🔹 When order is confirmed, automatically update stock quantities
    if (status === "confirmed") {
      for (const item of order.items) {
        // find product's related stock
        const product = item.product;

        if (product && product.stock) {
          const stock = await Stock.findById(product.stock);
          if (stock) {
            // reduce quantity
            stock.quantity -= item.quantity;
            if (stock.quantity < 0) stock.quantity = 0; // avoid negatives
            await stock.save();
          }
        }
      }
    }

    // 🔹 (Optional) if order is cancelled, restore stock
    if (status === "cancelled") {
      for (const item of order.items) {
        const product = item.product;
        if (product && product.stock) {
          const stock = await Stock.findById(product.stock);
          if (stock) {
            stock.quantity += item.quantity;
            await stock.save();
          }
        }
      }
    }

    await order.save();
    res.json({ message: "Order status updated successfully", order });
  } catch (err) {
    console.error("Error updating order status:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get ALL Orders for Admin (FIXED - returns both online and bank payments)
export const getSlipOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find({})  // Remove the paymentSlip filter
      .sort({ createdAt: -1 })
      .populate("user", "username email phone address city country"); 

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update order status after successful Stripe payment
export const updateOrderPaymentStatus = async (req, res) => {
  try {
    const { orderId } = req.body;
    
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update order status to confirmed for successful online payments
    order.status = "confirmed";
    order.history.push({
      status: "confirmed",
      updatedAt: new Date(),
      note: "Payment completed via Stripe",
      updatedBy: "system",
    });

    await order.save();

    res.json({ 
      message: "Order payment status updated successfully", 
      order 
    });
  } catch (err) {
    console.error("Error updating payment status:", err);
    res.status(500).json({ message: err.message });
  }
};