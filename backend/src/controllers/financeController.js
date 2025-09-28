import Finance from "../models/finance.js";

// Add entry
export const addFinance = async (req, res) => {
  try {
    const { type, amount, description } = req.body;
    const entry = new Finance({ type, amount, description });
    await entry.save();
    res.status(201).json({ message: "Entry added", entry });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all entries
export const getFinances = async (req, res) => {
  try {
    const entries = await Finance.find().sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};