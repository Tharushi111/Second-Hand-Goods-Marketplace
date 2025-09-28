import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FaComment, FaStar, FaUser, FaCalendar, FaTrash, FaSync } from "react-icons/fa";
import { toast } from "react-hot-toast";

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch all feedbacks on mount
  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Admin token not found. Please log in again.");
        return;
      }
  
      const res = await axios.get("http://localhost:5001/api/feedback", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setFeedbacks(res.data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err.response || err.message);
      toast.error("Failed to fetch feedback. Please try again later.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  
  

  // Manual refresh function
  const handleRefresh = () => {
    setRefreshing(true);
    fetchFeedbacks();
  };

  // Delete feedback with confirmation
const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this feedback?"
  );
  if (!confirmDelete) return;

  try {
    await axios.delete(`http://localhost:5001/api/feedback/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });
    setFeedbacks(feedbacks.filter((f) => f._id !== id));
    toast.success("Feedback deleted successfully!");
  } catch (err) {
    console.error(err);
    toast.error("Delete failed. Admin only!");
  }
};

  // Render star rating
  const renderStars = (rating) => {
    return (
      <div className="flex justify-center items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <FaStar
            key={i}
            className={`w-4 h-4 transition-transform duration-200 ${
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300 fill-current"
            }`}
          />
        ))}
        <span className="ml-2 text-sm font-semibold text-gray-700">
          ({rating}.0)
        </span>
      </div>
    );
  };

  // Calculate stats
  const totalReviews = feedbacks.length;
  const averageRating = feedbacks.length > 0 
    ? (feedbacks.reduce((acc, fb) => acc + fb.rating, 0) / feedbacks.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section - Updated Design */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="p-3 bg-blue-500 rounded-xl mr-4">
                <FaComment className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Customer Feedback</h1>
                <p className="text-gray-600 mt-1">Manage and review customer feedback</p>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mt-3">
              <span>{feedbacks.length} reviews</span>
            </div>
          </div>

          <div className="flex gap-3 mt-4 lg:mt-0">
            <motion.button
              onClick={handleRefresh}
              disabled={refreshing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center bg-gray-100 text-gray-700 px-4 py-3 rounded-xl border border-gray-200 hover:bg-gray-200 transition-all disabled:opacity-50"
            >
              <FaSync className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards Grid - Updated Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 mb-8">
          <StatCard 
            title="Total Reviews" 
            value={totalReviews} 
            icon={FaComment} 
            color="blue" 
            loading={loading}
            description="All customer feedback"
            trend="total"
          />
          <StatCard 
            title="Average Rating" 
            value={averageRating} 
            icon={FaStar} 
            color="green" 
            loading={loading}
            description="Overall satisfaction score"
            trend="up"
          />
        </div>

        {/* Feedback Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"
        >
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-blue-600">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider border-r border-blue-500">
                      <div className="flex items-center space-x-2">
                        <FaUser className="text-white text-sm" />
                        <span>User</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-white uppercase tracking-wider border-r border-blue-500">
                      <div className="flex items-center space-x-2">
                        <FaComment className="text-white text-sm" />
                        <span>Review</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider border-r border-blue-500">
                      <div className="flex items-center justify-center space-x-2">
                        <FaStar className="text-white text-sm" />
                        <span>Rating</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider border-r border-blue-500">
                      <div className="flex items-center justify-center space-x-2">
                        <FaCalendar className="text-white text-sm" />
                        <span>Date</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-white uppercase tracking-wider">
                      <div className="flex items-center justify-center space-x-2">
                        <FaTrash className="text-white text-sm" />
                        <span>Actions</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {feedbacks.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <FaComment className="text-gray-300 text-4xl mb-3" />
                          <p className="text-xl font-semibold text-gray-600 mb-2">No feedback available</p>
                          <p className="text-gray-500">Customer feedback will appear here once submitted</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    feedbacks.map((fb) => (
                      <tr key={fb._id} className="hover:bg-blue-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="bg-blue-100 rounded-full p-2 mr-3">
                              <FaUser className="text-blue-600 text-sm" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">{fb.name}</div>
                              <div className="text-sm text-gray-500">Customer</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-md">{fb.comment}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStars(fb.rating)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                          <div className="bg-gray-100 rounded-lg py-1 px-3 inline-block">
                            {new Date(fb.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <motion.button
                            onClick={() => handleDelete(fb._id)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                          >
                            <FaTrash className="w-4 h-4 mr-2" />
                            Delete
                          </motion.button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Enhanced StatCard Component with increased font size
const StatCard = ({ title, value, icon: Icon, color, loading, description, trend }) => {
  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
    red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" }
  };

  const trendIcons = {
    up: <FaStar className="text-green-500 text-lg" />,
    down: <FaComment className="text-red-500 text-lg" />,
    warning: <FaComment className="text-yellow-500 text-lg" />,
    total: <FaComment className="text-blue-500 text-lg" />
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`p-6 rounded-xl border-2 ${colors.border} ${colors.bg} transition-all duration-300 hover:shadow-lg`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-lg ${colors.bg} ${colors.text}`}>
          <Icon className="text-2xl" />
        </div>
        <div className="text-4xl font-bold text-gray-800">
          {loading ? (
            <div className="animate-pulse bg-gray-300 h-10 w-20 rounded"></div>
          ) : (
            value
          )}
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-700 text-lg mb-2">{title}</h3>
      <div className="flex items-center justify-between">
        <p className="text-base text-gray-500">{description}</p>
        {trendIcons[trend]}
      </div>
    </motion.div>
  );
};