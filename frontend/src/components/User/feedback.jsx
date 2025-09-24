import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  FaStar, 
  FaUser, 
  FaCalendarAlt, 
  FaPaperPlane, 
  FaRegSmile,
  FaClock,
  FaEdit,
  FaSave,
  FaTimes
} from "react-icons/fa";

export default function FeedbackPage() {
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [feedbacks, setFeedbacks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null); // Track which feedback is being edited
  const [editForm, setEditForm] = useState({ name: "", rating: 5, comment: "" });

  // Fetch feedbacks
  useEffect(() => {
    axios.get("http://localhost:5001/api/feedback")
      .then(res => setFeedbacks(res.data))
      .catch(err => console.error(err));
  }, []);

  // Handle new feedback submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await axios.post("http://localhost:5001/api/feedback", form);
      setFeedbacks([res.data, ...feedbacks]);
      setForm({ name: "", rating: 5, comment: "" });
      setTimeout(() => setIsSubmitting(false), 1000);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  // Handle feedback update
  const handleUpdate = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5001/api/feedback/${id}`, editForm);
      setFeedbacks(feedbacks.map(f => f._id === id ? res.data : f));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    }
  };

  // Star rating display component
  const StarRating = ({ rating, size = "text-lg", editable, onChange }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type={editable ? "button" : "span"}
          onClick={editable ? () => onChange(star) : undefined}
          className={`${size} ${star <= rating ? "text-blue-500" : "text-gray-300"} ${editable ? "hover:scale-110 transition-transform" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-left mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-bold text-gray-900 mb-4"
          >
            Feedback
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-700 max-w-2xl leading-relaxed"
          >
            Share your valuable experience and discover what our community is saying about our services
          </motion.p>
        </div>

        {/* Feedback Form */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 mb-12 border border-gray-200/60 backdrop-blur-sm"
        >
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <FaRegSmile className="text-white text-xl" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">Share Your Experience</h3>
              <p className="text-gray-600">Your feedback helps us improve</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Your Name</label>
                <div className="relative">
                  <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 bg-gray-50/50"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">Your Rating</label>
                <StarRating 
                  rating={form.rating} 
                  editable 
                  onChange={(star) => setForm({ ...form, rating: star })} 
                  size="text-3xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">Your Feedback</label>
              <textarea
                placeholder="Tell us about your experience..."
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
                required
                rows="5"
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-300 resize-none bg-gray-50/50"
              ></textarea>
            </div>

            <motion.button 
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <FaClock className="mr-3 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <FaPaperPlane className="mr-3" />
                  Share Your Feedback
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Feedback List */}
        <div className="space-y-8">
          {feedbacks.map((feedback) => (
            <motion.div
              key={feedback._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-lg p-8 border border-gray-200/60"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl">
                    {feedback.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    {editingId === feedback._id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="border-2 border-gray-300 rounded-xl px-3 py-1 mb-2 focus:outline-none focus:border-blue-500"
                      />
                    ) : (
                      <h4 className="text-xl font-bold text-gray-900 mb-1">{feedback.name}</h4>
                    )}

                    {editingId === feedback._id ? (
                      <StarRating 
                        rating={editForm.rating} 
                        editable 
                        onChange={(star) => setEditForm({ ...editForm, rating: star })}
                      />
                    ) : (
                      <StarRating rating={parseInt(feedback.rating)} size="text-xl" />
                    )}
                  </div>
                </div>

                <div className="text-right flex flex-col items-end space-y-2">
                  <span className="text-sm text-gray-500 flex items-center">
                    <FaCalendarAlt className="mr-2 text-blue-500" />
                    {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>

                  {editingId === feedback._id ? (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleUpdate(feedback._id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-blue-600"
                      >
                        <FaSave /> <span>Save</span>
                      </button>
                      <button 
                        onClick={() => setEditingId(null)}
                        className="bg-gray-300 text-gray-800 px-3 py-1 rounded-lg flex items-center space-x-1 hover:bg-gray-400"
                      >
                        <FaTimes /> <span>Cancel</span>
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setEditingId(feedback._id);
                        setEditForm({
                          name: feedback.name,
                          rating: feedback.rating,
                          comment: feedback.comment
                        });
                      }}
                      className="text-blue-500 hover:underline flex items-center space-x-1 text-sm"
                    >
                      <FaEdit /> <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>

              {editingId === feedback._id ? (
                <textarea
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  rows="4"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 mb-4"
                />
              ) : (
                <p className="text-gray-700 text-lg">{feedback.comment}</p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
