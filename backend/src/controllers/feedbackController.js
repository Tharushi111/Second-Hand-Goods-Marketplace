import Feedback from "../models/Feedback.js";

// Add new feedback
export const addFeedback = async (req, res) => {
  try {
    const { name, rating, comment } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const feedback = new Feedback({ name, rating, comment });
    await feedback.save();

    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all feedback
export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update feedback (edit review)
export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rating, comment } = req.body;

    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { name, rating, comment },
      { new: true, runValidators: true }
    );

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
