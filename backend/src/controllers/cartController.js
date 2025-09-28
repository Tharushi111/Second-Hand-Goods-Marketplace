import Cart from "../models/Cart.js";
import Product from "../models/product.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

// Get cart
export const getCart = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const cart = await Cart.findOne({ user: req.user.id }).populate({
      path: "items.product",
      populate: { path: "stock" }
    });

    if (!cart) return res.json({ items: [], totalPrice: 0 });

    const items = cart.items.map((item) => ({
      product: item.product?._id || null,
      name: item.product?.stock?.name || item.name || "Unnamed Product",
      category: item.product?.category || item.category || "General",
      price: item.price || 0,
      image: item.image || "",
      quantity: item.quantity || 1,
    }));

    const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    res.json({ items, totalPrice });
  } catch (err) {
    console.error("getCart error:", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

// Add to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
    if (!productId || !quantity) return res.status(400).json({ message: "Missing productId or quantity" });

    const product = await Product.findById(productId).populate("stock");
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (product.stock.quantity < quantity) {
      return res.status(400).json({ message: `Only ${product.stock.quantity} available` });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) {
      if (product.stock.quantity < existing.quantity + quantity) {
        return res.status(400).json({ message: "Not enough stock" });
      }
      existing.quantity += quantity;
    } else {
      cart.items.push({
        product: product._id,
        name: product.stock?.name || "Unnamed Product",
        category: product.category,
        price: product.price,
        image: product.image,
        quantity,
      });
    }

    await cart.save();
    res.status(201).json({ message: "Item added", cart });
  } catch (err) {
    console.error("addToCart error:", err);
    res.status(500).json({ message: "Failed to add item to cart" });
  }
};

// Update quantity
export const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
    if (!productId || quantity === undefined) return res.status(400).json({ message: "Missing productId or quantity" });

    const product = await Product.findById(productId).populate("stock");
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (quantity < 1) return res.status(400).json({ message: "Quantity must be at least 1" });
    if (quantity > product.stock.quantity) return res.status(400).json({ message: `Only ${product.stock.quantity} available` });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((i) => i.product.toString() === productId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    item.quantity = quantity;
    await cart.save();

    res.json({ message: "Quantity updated", cart });
  } catch (err) {
    console.error("updateQuantity error:", err);
    res.status(500).json({ message: "Failed to update quantity" });
  }
};

// Remove item
export const removeItem = async (req, res) => {
  try {
    const { productId } = req.params;
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });
    if (!productId) return res.status(400).json({ message: "Missing productId" });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const initialLength = cart.items.length;
    cart.items = cart.items.filter((i) => i.product?.toString() !== productId);
    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    await cart.save();
    res.json({ message: "Item removed", cart });
  } catch (err) {
    console.error("removeItem error:", err);
    res.status(500).json({ message: "Failed to remove item" });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = [];
    await cart.save();

    res.json({ message: "Cart cleared", cart });
  } catch (err) {
    console.error("clearCart error:", err);
    res.status(500).json({ message: "Failed to clear cart" });
  }
};

// Generate quotation
export const generateQuotation = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const pdfPath = path.join("uploads", `quotation_${Date.now()}.pdf`);
    const doc = new PDFDocument({ margin: 40, size: "A4" });
    doc.pipe(fs.createWriteStream(pdfPath));

    doc.fontSize(20).text("ReBuy Marketplace", { align: "center" });
    doc.moveDown();

    let total = 0;
    cart.items.forEach((item, i) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;
      doc.text(`${i + 1}. ${item.name} x ${item.quantity} = Rs.${subtotal}`);
    });

    doc.moveDown();
    doc.fontSize(14).text(`Total: Rs.${total}`, { align: "right" });
    doc.end();

    res.json({ message: "Quotation generated", pdf: pdfPath });
  } catch (err) {
    console.error("generateQuotation error:", err);
    res.status(500).json({ message: "Failed to generate quotation" });
  }
};
