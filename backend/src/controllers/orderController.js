import Order from "../models/Order.js";


//Get All Orders (User) 

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

//Upload Bank Slip 
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

//Update Order Status (Admin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    order.history.push({
      status,
      updatedAt: new Date(),
      note: `Status changed to ${status}`,
      updatedBy: "admin",
    });

    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



//Get Only Slip Orders (Admin)
export const getSlipOrdersForAdmin = async (req, res) => {
  try {
    const orders = await Order.find({
      paymentSlip: { $exists: true, $ne: null },  
    })
      .sort({ createdAt: -1 })
      .populate("user", "username email phone address city country"); 

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};