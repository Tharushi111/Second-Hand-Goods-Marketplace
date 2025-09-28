import Cart from "../models/Cart.js";
import Product from "../models/product.js";
import Order from "../models/Order.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import User from "../models/User.js";


/* GET /api/checkout/summary
 Returns cart summary (items, subtotal, deliveryCharge, total)*/

export const getCheckoutSummary = async (req, res) => {
  try {
    const cart = await Cart.findOne().populate({
      path: "items.product",
      populate: { path: "stock" },
    });

    if (!cart || cart.items.length === 0) {
      return res.json({
        items: [],
        subtotal: 0,
        deliveryCharge: 0,
        total: 0,
      });
    }

    const items = cart.items.map((i) => ({
      product: i.product._id,
      name: i.product?.stock?.name || i.name || "Unnamed Product",
      price: i.price,
      quantity: i.quantity,
      image: i.image,
    }));

    const subtotal = items.reduce((sum, x) => sum + x.price * x.quantity, 0);
    const deliveryMethod = req.query.deliveryMethod || "home"; 
    const deliveryCharge = deliveryMethod === "store" ? 0 : 1300;
    const total = subtotal + deliveryCharge;

    res.json({ items, subtotal, deliveryCharge, total });
  } catch (err) {
    console.error("Checkout summary error:", err);
    res.status(500).json({ message: "Failed to fetch checkout summary" });
  }
};

/** Order placement
  POST /api/checkout/place*/
export const placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const { deliveryMethod, notes, paymentMethod } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    // get user profile from DB
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // match Order.js
    const customer = {
      username: user.username,
      email: user.email,
      phone: user.phone || "",
    };

    const address = {
      line1:
        deliveryMethod === "home"
          ? user.address
          : deliveryMethod === "different"
          ? req.body.address?.line1 || "Not provided"
          : "Store Pickup",
      city: user.city || "Unknown",
      postalCode: user.postalCode || "00000",
      country: user.country || "Sri Lanka",
    };

    const items = cart.items.map((i) => ({
      product: i.product._id,
      name: i.product?.name || i.name,
      price: i.price,
      quantity: i.quantity,
      image: i.image,
    }));

    const subtotal = items.reduce((sum, x) => sum + x.price * x.quantity, 0);
    const deliveryCharge = deliveryMethod === "store" ? 0 : 1300;
    const total = subtotal + deliveryCharge;
    const order = await Order.create({
      user: user._id,
      items,
      subtotal,
      deliveryCharge,
      total,
      customer,   
      address,
      deliveryMethod: deliveryMethod || "home",
      notes: notes || "",
      paymentMethod,
      status: "pending",
      paymentSlip: null,
    });

    //clear only this user’s cart
    cart.items = [];
    await cart.save();

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: order.status,
      subtotal,
      deliveryCharge,
      total,
    });
  } catch (err) {
    console.error("Place order error:", err);
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
};

/* Slip upload
 POST /api/checkout/upload-slip/:orderId */


const uploadPath = "uploads/slips";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const uploadSlip = [
  multer({ storage }).single("slip"),
  async (req, res) => {
    try {
      const orderId = req.params.orderId;
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // Save slip in DB
      order.paymentSlip = {
        filename: req.file.filename,
        url: `/uploads/slips/${req.file.filename}`,
      };

    
      order.status = "transfer_pending";

      await order.save();

      res.json({
        message: "Slip uploaded successfully",
        slip: order.paymentSlip,
        status: order.status,
      });
    } catch (err) {
      console.error("Upload slip error:", err);
      res.status(500).json({ message: "Failed to upload slip" });
    }
  },
];