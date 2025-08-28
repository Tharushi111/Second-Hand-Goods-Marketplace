import Stock from "../models/Stock.js";

// Get all stock items
export const getAllStock = async (req, res) => {
    try {
      const stock = await Stock.find();
      res.json(stock);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  // Add new stock item
  export const addStock = async (req, res) => {
    try {
      const { name, category, quantity, reorderLevel, supplier } = req.body;
      await Stock.create({ name, category, quantity, reorderLevel, supplier });
      res.status(201).json({ message: "Stock added successfully!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Update stock item
  export const updateStock = async (req, res) => {
    try {
      const { quantity, reorderLevel, supplier } = req.body;
      const stock = await Stock.findById(req.params.id);
      if (!stock) return res.status(404).json({ message: "Stock not found" });
  
      if (quantity !== undefined) stock.quantity = quantity;
      if (reorderLevel !== undefined) stock.reorderLevel = reorderLevel;
      if (supplier !== undefined) stock.supplier = supplier;
  
      await stock.save();
      res.json({ message: "Stock updated successfully!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  // Delete stock item
export const deleteStock = async (req, res) => {
    try {
      const stock = await Stock.findByIdAndDelete(req.params.id);
      if (!stock) return res.status(404).json({ message: "Stock not found" });
  
      res.json({ message: "Stock deleted successfully!" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
