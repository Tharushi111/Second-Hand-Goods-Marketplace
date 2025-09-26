import Feedback from "../models/Feedback.js";

// Add new feedback
export const addFeedback = async (req, res) => {
  try {
    const { name, rating, comment, email } = req.body; // include email

    if (!name || !rating || !comment || !email) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const feedback = new Feedback({ name, rating, comment, email });
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

// Update feedback (edit review) - only owner can edit
export const updateFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rating, comment, email } = req.body;

    const feedback = await Feedback.findById(id);
    if (!feedback) return res.status(404).json({ error: "Feedback not found" });

    // Only allow the user who submitted the feedback to edit
    if (feedback.email !== email) {
      return res.status(403).json({ error: "You can only edit your own feedback" });
    }

    feedback.name = name;
    feedback.rating = rating;
    feedback.comment = comment;
    await feedback.save();

    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete feedback
export const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).json({ error: "Feedback not found" });
    }

    res.json({ message: "Feedback deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};