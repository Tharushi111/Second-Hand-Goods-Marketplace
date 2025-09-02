import Stock from "../models/Stock.js";

// Get all stocks
export const getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ createdAt: -1 });
    res.json(stocks);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stocks", error: err.message });
  }
};

// Get single stock by ID
export const getStockById = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });
    res.json(stock);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stock", error: err.message });
  }
};

// Create new stock
export const createStock = async (req, res) => {
  try {
    const { name, category, quantity, reorderLevel, description } = req.body;

    if (!name || !category || quantity == null || reorderLevel == null) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const newStock = new Stock({
      name,
      category,
      quantity,
      reorderLevel,
      description,
      // supplier: req.body.supplier // Supplier part commented
    });

    const savedStock = await newStock.save();
    res.status(201).json(savedStock);
  } catch (err) {
    res.status(500).json({ message: "Failed to create stock", error: err.message });
  }
};

// Update stock
export const updateStock = async (req, res) => {
  try {
    const { name, category, quantity, reorderLevel, description } = req.body;
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    stock.name = name || stock.name;
    stock.category = category || stock.category;
    stock.quantity = quantity != null ? quantity : stock.quantity;
    stock.reorderLevel = reorderLevel != null ? reorderLevel : stock.reorderLevel;
    stock.description = description || stock.description;
    // stock.supplier = req.body.supplier || stock.supplier; // Supplier part commented

    const updatedStock = await stock.save();
    res.json(updatedStock);
  } catch (err) {
    res.status(500).json({ message: "Failed to update stock", error: err.message });
  }
};

// Delete stock
export const deleteStock = async (req, res) => {
  try {
    const stock = await Stock.findById(req.params.id);
    if (!stock) return res.status(404).json({ message: "Stock not found" });

    await stock.deleteOne();
    res.json({ message: "Stock deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete stock", error: err.message });
  }
};
