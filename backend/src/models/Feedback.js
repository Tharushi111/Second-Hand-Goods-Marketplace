import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true },      // User's name
  rating: { type: Number, min: 1, max: 5, required: true }, // Rating 1-5
  comment: { type: String, required: true },   // Review/comment text
  createdAt: { type: Date, default: Date.now } // Timestamp for creation
});

// Export the model
export default mongoose.model("Feedback", feedbackSchema);
