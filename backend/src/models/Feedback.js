import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  email: { type: String, required: true },       
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true },   
  createdAt: { type: Date, default: Date.now } 
});

// Export the model
export default mongoose.model("Feedback", feedbackSchema);