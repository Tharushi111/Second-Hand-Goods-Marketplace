import Stock from "../models/Stock.js";
import User from "../models/User.js";

// GET ALL STOCKS
export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find()
      .populate("supplier", "username email role company phone")
      .sort({ createdAt: -1 });

    // Always return an array (even if empty)
    const formattedStocks = Array.isArray(stocks)
      ? stocks.map(stock => ({
          ...stock._doc, // spread document fields
          unitPriceDisplay: stock.unitPrice != null ? `Rs ${stock.unitPrice.toLocaleString()}` : "N/A",
          totalPriceDisplay: stock.totalPrice != null ? `Rs ${stock.totalPrice.toLocaleString()}` : "N/A",
          updatedAtDisplay: stock.updatedAt ? stock.updatedAt.toLocaleString() : "N/A",
        }))
      : [];

    res.status(200).json(formattedStocks);
  } catch (err) {
    console.error("Error fetching stocks:", err);
    res.status(500).json({ message: "Failed to fetch stocks", error: err.message });
  }
};

// GET SINGLE STOCK BY ID
export const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id)
      .populate("supplier", "username email role company phone");

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    res.status(200).json({
      ...stock._doc,
      unitPriceDisplay: stock.unitPrice != null ? `Rs ${stock.unitPrice.toLocaleString()}` : "N/A",
      totalPriceDisplay: stock.totalPrice != null ? `Rs ${stock.totalPrice.toLocaleString()}` : "N/A",
      updatedAtDisplay: stock.updatedAt ? stock.updatedAt.toLocaleString() : "N/A",
    });
  } catch (err) {
    console.error("Error fetching stock by ID:", err);
    res.status(500).json({ message: "Failed to fetch stock", error: err.message });
  }
};

// CREATE NEW STOCK
export const createStock = async (req, res) => {
  try {
    const { name, category, quantity, reorderLevel, description, unitPrice, supplierId } = req.body;

    if (!name || !category || quantity == null || reorderLevel == null || unitPrice == null || !supplierId) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }
    if (quantity < 0) return res.status(400).json({ message: "Quantity cannot be negative" });
    if (unitPrice < 0) return res.status(400).json({ message: "Unit price cannot be negative" });
    if (reorderLevel < 0) return res.status(400).json({ message: "Reorder level cannot be negative" });

    const supplier = await User.findOne({ _id: supplierId, role: "supplier" });
    if (!supplier) return res.status(400).json({ message: "Invalid supplier ID or user is not a supplier" });

    const newStock = new Stock({ name, category, quantity, reorderLevel, description, unitPrice, supplier: supplierId });
    const savedStock = await newStock.save();
    const populatedStock = await savedStock.populate("supplier", "username email role company phone");

    res.status(201).json({ message: "Stock created successfully", stock: populatedStock });
  } catch (err) {
    console.error("Error creating stock:", err);
    res.status(500).json({ message: "Failed to create stock", error: err.message });
  }
};

// UPDATE EXISTING STOCK
export const updateStock = async (req, res) => {
  try {
    const { name, category, quantity, reorderLevel, description, unitPrice, supplierId } = req.body;

    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    if (supplierId) {
      const supplier = await User.findOne({ _id: supplierId, role: "supplier" });
      if (!supplier) return res.status(400).json({ message: "Invalid supplier ID or user is not a supplier" });
      stock.supplier = supplierId;
    }

    stock.name = name || stock.name;
    stock.category = category || stock.category;
    stock.quantity = quantity != null ? quantity : stock.quantity;
    stock.reorderLevel = reorderLevel != null ? reorderLevel : stock.reorderLevel;
    stock.description = description || stock.description;
    stock.unitPrice = unitPrice != null ? unitPrice : stock.unitPrice;

    const updatedStock = await stock.save();
    const populatedStock = await updatedStock.populate("supplier", "username email role company phone");

    res.status(200).json({ message: "Stock updated successfully", stock: populatedStock });
  } catch (err) {
    console.error("Error updating stock:", err);
    res.status(500).json({ message: "Failed to update stock", error: err.message });
  }
};

// DELETE STOCK
export const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    await stock.deleteOne();
    res.status(200).json({ message: "Stock deleted successfully" });
  } catch (err) {
    console.error("Error deleting stock:", err);
    res.status(500).json({ message: "Failed to delete stock", error: err.message });
  }
};

// PLACEHOLDER FOR PAYMENT & ORDER FLOW
export const handleSuccessfulPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    res.status(200).json({ message: "Stock will be updated when payment integration is complete" });
  } catch (err) {
    console.error("Error handling successful payment:", err);
    res.status(500).json({ message: "Error handling successful payment", error: err.message });
  }
};

export const handleOrderCancellation = async (req, res) => {
  try {
    const { orderId } = req.body;
    res.status(200).json({ message: "Stock will be restored when cancellation integration is complete" });
  } catch (err) {
    console.error("Error handling order cancellation:", err);
    res.status(500).json({ message: "Error handling order cancellation", error: err.message });
  }
};
