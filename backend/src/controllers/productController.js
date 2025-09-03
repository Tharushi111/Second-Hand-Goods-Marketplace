import Product from "../models/product.js";
import Stock from "../models/Stock.js";

// Add product
export const addProduct = async (req, res) => {
  try {
    const { stockId, description, price } = req.body;
    const image = req.file ? req.file.path : null;

    if (!image) return res.status(400).json({ message: "Product image is required" });

    // Fetch stock details
    const stockItem = await Stock.findById(stockId);
    if (!stockItem) return res.status(400).json({ message: "Invalid stock selected" });

    const newProduct = new Product({
      stock: stockItem._id,
      category: stockItem.category, // auto from stock
      description,
      price,
      image,
    });

    await newProduct.save();

    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { stockId, description, price } = req.body;
    const image = req.file ? req.file.path : null;

    let updateData = { description, price };
    if (stockId) {
      const stockItem = await Stock.findById(stockId);
      if (!stockItem) return res.status(400).json({ message: "Invalid stock selected" });
      updateData.stock = stockItem._id;
      updateData.category = stockItem.category; // auto from stock
    }
    if (image) updateData.image = image;

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated", product: updatedProduct });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("stock");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("stock");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};