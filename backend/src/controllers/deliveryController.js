import Order from "../models/Order.js";

// Get only paid orders for admin
export const getPaidOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find({
      paymentMethod: { $exists: true, $ne: null },
      status: { $nin: ["cancelled"] }, // exclude cancelled
    })
      .sort({ createdAt: -1 })
      .populate("user", "username email phone");

    res.json(orders);
  } catch (err) {
    console.error("Error fetching paid orders:", err);
    res.status(500).json({ message: err.message });
  }
};

// Assign delivery method (Uber or PickMe)
export const assignDeliveryMethod = async (req, res) => {
  try {
    const { method } = req.body; // "Uber" or "PickMe"
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.deliveryMethod = method;
    order.status = "delivered"; // or "shipped" based on your workflow
    order.history.push({
      status: order.status,
      updatedAt: new Date(),
      note: `Assigned to ${method}`,
      updatedBy: "admin",
    });

    await order.save();
    res.json(order);
  } catch (err) {
    console.error("Error assigning delivery:", err);
    res.status(500).json({ message: err.message });
  }
};
