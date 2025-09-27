import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { 
  FaStar, FaUser, FaCalendarAlt, FaPaperPlane, FaRegSmile,
  FaClock, FaEdit, FaSave, FaTimes, FaHeart, FaComments,
  FaQuoteLeft, FaQuoteRight, FaRocket, FaMagic, FaLock
} from "react-icons/fa";
import Navbar from "../User/UserNavbar";
import Footer from "../User/UserFooter";

export default function FeedbackPage() {
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [feedbacks, setFeedbacks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", rating: 5, comment: "", email: "" });
  const [likedFeedbacks, setLikedFeedbacks] = useState(new Set());

  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const currentUserEmail = user?.email || null;
  const isLoggedIn = !!token && !!currentUserEmail;

  // Fetch feedbacks
  useEffect(() => {
    axios.get("http://localhost:5001/api/feedback")
      .then(res => setFeedbacks(res.data))
      .catch(err => console.error(err));
  }, []);

  // Submit new feedback (only if logged in)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) return alert("Please log in to submit feedback");

    setIsSubmitting(true);
    try {
      const res = await axios.post(
        "http://localhost:5001/api/feedback",
        { ...form, email: currentUserEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbacks([res.data, ...feedbacks]);
      setForm({ name: "", rating: 5, comment: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update feedback (only owner)
  const handleUpdate = async (id) => {
    if (!isLoggedIn) return alert("Please log in to edit feedback");

    try {
      const res = await axios.put(
        `http://localhost:5001/api/feedback/${id}`,
        { ...editForm, email: currentUserEmail },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFeedbacks(feedbacks.map(f => f._id === id ? res.data : f));
      setEditingId(null);
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert("You can only edit your own feedback");
      } else {
        console.error(err);
      }
    }
  };

  // Delete feedback (only owner)
  const handleDelete = async (id) => {
    if (!isLoggedIn) return alert("Please log in to delete feedback");
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;

    try {
      await axios.delete(`http://localhost:5001/api/feedback/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeedbacks(feedbacks.filter(f => f._id !== id));
    } catch (err) {
      if (err.response && err.response.status === 403) {
        alert("You can only delete your own feedback");
      } else {
        console.error(err);
      }
    }
  };

  // Toggle like
  const handleLike = (feedbackId) => {
    const newLiked = new Set(likedFeedbacks);
    if (newLiked.has(feedbackId)) {
      newLiked.delete(feedbackId);
    } else {
      newLiked.add(feedbackId);
    }
    setLikedFeedbacks(newLiked);
  };

  // Star rating component
  const StarRating = ({ rating, size = "text-lg", editable, onChange }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type={editable ? "button" : "span"}
          onClick={editable ? () => onChange(star) : undefined}
          className={`${size} transition-all duration-200 ${
            star <= rating 
              ? "text-yellow-400 drop-shadow-lg" 
              : "text-gray-300 hover:text-yellow-200"
          } ${editable ? "hover:scale-125 transform" : ""}`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-sm font-medium text-blue-700 bg-gradient-to-r from-blue-100 to-blue-50 px-3 py-1 rounded-full border border-blue-200">
        {rating}.0
      </span>
    </div>
  );

  // Stats for the header
  const stats = {
    total: feedbacks.length,
    average: feedbacks.reduce((acc, f) => acc + parseInt(f.rating), 0) / feedbacks.length || 0,
    fiveStar: feedbacks.filter(f => parseInt(f.rating) === 5).length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <Navbar />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative py-16 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto">
          
          {/* Enhanced Header with Stats */}
          <motion.div 
            initial={{ opacity: 0, y: -30 }} 
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-full shadow-lg mb-6">
              <FaMagic className="mr-3" />
              <span className="font-semibold">Customer Feedback Portal</span>
            </div>
            
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-6">
              Share Your Experience
            </h1>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Your feedback helps us improve and serve you better. Join our community of valued customers.
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.total}</div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.average.toFixed(1)}</div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100"
              >
                <div className="text-3xl font-bold text-blue-600 mb-2">{stats.fiveStar}</div>
                <div className="text-sm text-gray-600">5-Star Reviews</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Feedback Form - Only for logged-in users */}
          {isLoggedIn ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2 }} 
              className="mb-16"
            >
              <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-blue-100 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/10 to-blue-500/10 rounded-full translate-y-12 -translate-x-12"></div>
                
                <div className="flex items-center mb-8 relative z-10">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FaRocket className="text-white text-2xl" />
                  </div>
                  <div className="ml-6">
                    <h3 className="text-3xl font-bold text-gray-900">Share Your Feedback</h3>
                    <p className="text-gray-600 mt-1">Your opinion matters to us</p>
                  </div>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <label className="flex text-sm font-semibold text-gray-800 mb-4 items-center">
                        <FaUser className="mr-3 text-blue-500 text-lg" /> 
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                        className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 transition-all duration-300 bg-white/50 backdrop-blur-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="flex text-sm font-semibold text-gray-800 mb-4 items-center">
                        <FaStar className="mr-3 text-yellow-500 text-lg" /> 
                        Your Rating
                      </label>
                      <StarRating 
                        rating={form.rating} 
                        editable 
                        onChange={(star) => setForm({ ...form, rating: star })} 
                        size="text-2xl" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="flex text-sm font-semibold text-gray-800 mb-4 items-center">
                      <FaComments className="mr-3 text-blue-500 text-lg" /> 
                      Your Feedback
                    </label>
                    <div className="relative">
                      <FaQuoteLeft className="absolute top-4 left-4 text-blue-200 text-xl z-10" />
                      <textarea
                        placeholder="Tell us about your experience..."
                        value={form.comment}
                        onChange={(e) => setForm({ ...form, comment: e.target.value })}
                        required
                        rows="4"
                        className="w-full px-12 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 transition-all duration-300 resize-none bg-white/50 backdrop-blur-sm relative"
                      />
                      <FaQuoteRight className="absolute bottom-4 right-4 text-blue-200 text-xl" />
                    </div>
                  </div>
                  
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {isSubmitting ? (
                      <FaClock className="animate-spin mr-3 text-lg" />
                    ) : (
                      <FaPaperPlane className="mr-3 text-lg group-hover:translate-x-1 transition-transform" />
                    )}
                    Submit Feedback
                  </motion.button>
                </form>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center mb-12"
            >
              <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-8 py-4 rounded-2xl shadow-lg inline-flex items-center">
                <FaLock className="mr-3" />
                <span className="font-semibold">Please log in to share your feedback</span>
              </div>
            </motion.div>
          )}

          {/* Feedback List - Single Column */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-8"
          >
            {feedbacks.length > 0 ? feedbacks.map((feedback, index) => (
              <motion.div 
                key={feedback._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-lg p-8 border border-blue-100 hover:shadow-xl transition-all duration-300 relative group"
              >
                {/* Decorative corner */}
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-tr-3xl"></div>
                
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {feedback.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-gray-900">{feedback.name}</h4>
                      <StarRating rating={parseInt(feedback.rating)} size="text-lg" />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500 flex items-center">
                      <FaCalendarAlt className="mr-2" />
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="relative mb-6">
                  <FaQuoteLeft className="text-blue-200 text-2xl mb-2" />
                  <p className="text-gray-700 text-lg leading-relaxed pl-2">{feedback.comment}</p>
                </div>

                {/* Action Buttons - Only show edit for owner */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <button
                    onClick={() => handleLike(feedback._id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                      likedFeedbacks.has(feedback._id)
                        ? "text-blue-500 bg-blue-50"
                        : "text-gray-500 hover:text-blue-500 hover:bg-blue-50"
                    }`}
                  >
                    <FaHeart className={likedFeedbacks.has(feedback._id) ? "fill-current" : ""} />
                    <span>Like</span>
                  </button>

                  {/* Edit button - Only show if user is logged in and owns this feedback */}
                  {isLoggedIn && currentUserEmail === feedback.email && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingId(feedback._id);
                          setEditForm({
                            name: feedback.name,
                            rating: parseInt(feedback.rating),
                            comment: feedback.comment,
                            email: feedback.email
                          });
                        }}
                        className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                      >
                        <FaEdit />
                        <span>Edit</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Edit Form - Only show when editing */}
                {editingId === feedback._id && (
                  <div className="mt-6 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                    <h5 className="font-bold text-lg text-blue-800 mb-4">Edit Your Feedback</h5>
                    <div className="space-y-4">
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your Name"
                      />
                      <div>
                        <label className="block text-sm font-medium text-blue-700 mb-2">Rating</label>
                        <StarRating 
                          rating={editForm.rating} 
                          editable 
                          onChange={(star) => setEditForm({ ...editForm, rating: star })} 
                        />
                      </div>
                      <textarea
                        value={editForm.comment}
                        onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                        rows="3"
                        className="w-full px-4 py-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Your Feedback"
                      />
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleUpdate(feedback._id)}
                          className="bg-blue-500 text-white px-6 py-2 rounded-xl hover:bg-blue-600 transition-colors"
                        >
                          Save Changes
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="bg-gray-300 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-400 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )) : (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-12 shadow-lg border border-blue-100">
                  <FaRegSmile className="text-6xl text-blue-300 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-600 mb-2">No Feedback Yet</h3>
                  <p className="text-gray-500">Be the first to share your experience!</p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}