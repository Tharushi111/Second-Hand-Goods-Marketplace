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
  FaTimes,
  FaHeart,
  FaComments
} from "react-icons/fa";
import Navbar from "../User/UserNavbar";
import Footer from "../User/UserFooter";

export default function FeedbackPage() {
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [feedbacks, setFeedbacks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null); 
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
          className={`${size} transition-all duration-200 ${
            star <= rating 
              ? "text-yellow-400 drop-shadow-lg" 
              : "text-gray-300"
          } ${editable ? "hover:scale-125 transform hover:text-yellow-300" : ""}`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-sm font-medium text-blue-700 bg-blue-100 px-2 py-1 rounded-full">
        {rating}.0
      </span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <Navbar />
      
      <div className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Section */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent mb-8">
              Customer Feedback
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Share your valuable experience and discover what our community is saying
            </p>
          </motion.div>

          {/* Feedback Form Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-blue-100/50 backdrop-blur-sm">
              <div className="flex items-center mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaRegSmile className="text-white text-2xl" />
                </div>
                <div className="ml-4">
                  <h3 className="text-2xl font-bold text-gray-900">Share Your Experience</h3>
                  <p className="text-gray-600">Your feedback helps us improve</p>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex text-sm font-semibold text-gray-800 mb-3 items-center">
                      <FaUser className="mr-2 text-blue-500" />
                      Your Name
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 transition-all duration-300 bg-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex text-sm font-semibold text-gray-800 mb-3 items-center">
                      <FaStar className="mr-2 text-blue-500" />
                      Your Rating
                    </label>
                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                      <StarRating 
                        rating={form.rating} 
                        editable 
                        onChange={(star) => setForm({ ...form, rating: star })} 
                        size="text-2xl"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex text-sm font-semibold text-gray-800 mb-3 items-center">
                    <FaComments className="mr-2 text-blue-500" />
                    Your Feedback
                  </label>
                  <textarea
                    placeholder="Tell us about your experience... What did you love? How can we improve?"
                    value={form.comment}
                    onChange={(e) => setForm({ ...form, comment: e.target.value })}
                    required
                    rows="4"
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 transition-all duration-300 resize-none bg-white"
                  ></textarea>
                </div>

                <motion.button 
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitting ? 0.98 : 0.95 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center group"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <FaClock className="mr-3" />
                      </motion.div>
                      Sharing Your Feedback...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane className="mr-3 group-hover:translate-x-1 transition-transform" />
                      Share Your Feedback
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>

          {/* Feedback List Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl shadow-2xl p-6 mb-8 text-white"
          >
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <FaHeart className="text-2xl text-white" />
                <div>
                  <h2 className="text-2xl font-bold">Community Feedback</h2>
                  <p className="text-blue-100">{feedbacks.length} heartfelt reviews</p>
                </div>
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
                <span className="font-semibold">⭐ {feedbacks.length > 0 ? 
                  (feedbacks.reduce((acc, f) => acc + parseInt(f.rating), 0) / feedbacks.length).toFixed(1) 
                  : '5.0'} average rating</span>
              </div>
            </div>
          </motion.div>

          {/* Feedback List */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6 mb-12"
          >
            {feedbacks.map((feedback, index) => (
              <motion.div
                key={feedback._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg p-8 border border-blue-100/50 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6 space-y-4 lg:space-y-0">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                      {feedback.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      {editingId === feedback._id ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="border-2 border-blue-200 rounded-xl px-4 py-2 mb-2 focus:outline-none focus:border-blue-500 font-bold text-lg w-full lg:w-auto"
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

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between lg:justify-end lg:space-x-4 space-y-2 sm:space-y-0">
                    <span className="text-sm text-gray-500 flex items-center bg-blue-50 px-3 py-1 rounded-full w-fit">
                      <FaCalendarAlt className="mr-2 text-blue-500" />
                      {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>

                    {editingId === feedback._id ? (
                      <div className="flex space-x-2">
                        <motion.button 
                          onClick={() => handleUpdate(feedback._id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-blue-600 transition-colors shadow-lg"
                        >
                          <FaSave /> <span>Save</span>
                        </motion.button>
                        <motion.button 
                          onClick={() => setEditingId(null)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-xl flex items-center space-x-2 hover:bg-gray-300 transition-colors"
                        >
                          <FaTimes /> <span>Cancel</span>
                        </motion.button>
                      </div>
                    ) : (
                      <motion.button 
                        onClick={() => {
                          setEditingId(feedback._id);
                          setEditForm({
                            name: feedback.name,
                            rating: parseInt(feedback.rating),
                            comment: feedback.comment
                          });
                        }}
                        whileHover={{ scale: 1.05 }}
                        className="text-blue-500 hover:text-blue-700 flex items-center space-x-2 text-sm bg-blue-50 px-3 py-2 rounded-xl group-hover:bg-blue-100 transition-colors w-fit"
                      >
                        <FaEdit /> <span>Edit Feedback</span>
                      </motion.button>
                    )}
                  </div>
                </div>

                {editingId === feedback._id ? (
                  <textarea
                    value={editForm.comment}
                    onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-3 border-2 border-blue-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 mb-4 resize-none"
                  />
                ) : (
                  <p className="text-gray-700 text-lg leading-relaxed bg-blue-50/50 rounded-2xl p-6 border border-blue-100">
                    {feedback.comment}
                  </p>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* Empty State */}
          {feedbacks.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-3xl shadow-lg border border-blue-100 mb-12"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <FaComments className="text-blue-400 text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No feedback yet</h3>
              <p className="text-gray-600 mb-6">Be the first to share your experience!</p>
              <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full mx-auto"></div>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
