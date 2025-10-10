import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const SupplierReplies = ({ token }) => {
  const [reorderRequests, setReorderRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all reorder requests with replies
  const fetchReplies = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:5001/api/reorders",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Filter only requests that have replies
      const requestsWithReplies = data.filter(req => req.replies && req.replies.length > 0);
      setReorderRequests(requestsWithReplies);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch replies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, []);

  if (loading) return (
    <div className="flex justify-center items-center min-h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold">Supplier Replies</h1>
              <p className="text-blue-100 mt-1">Review all supplier responses to your reorder requests</p>
            </div>
          </div>
        </div>

        {/* Content */}
        {reorderRequests.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No replies yet</h3>
            <p className="text-gray-500">Suppliers haven't replied to any of your reorder requests yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
              <h2 className="text-xl font-bold text-white">Reorder Request Replies</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700 uppercase tracking-wider">Request Title</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700 uppercase tracking-wider">Replies</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reorderRequests.map(req => (
                    <tr key={req._id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{req.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{req.quantity}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {req.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          req.priority === 'high' 
                            ? 'bg-red-100 text-red-800'
                            : req.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {req.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2 max-w-md">
                          {req.replies.map((rep, index) => (
                            <div 
                              key={index} 
                              className="bg-blue-50 rounded-lg p-3 border border-blue-200"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <div className="flex items-center space-x-1">
                                  <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                  <span className="text-xs font-medium text-gray-700">Supplier:</span>
                                  <span className="text-xs text-gray-900">{rep.supplierId}</span>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {new Date(rep.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <div className="bg-white rounded p-2 border border-gray-200">
                                <p className="text-xs text-gray-600 leading-relaxed">{rep.reply}</p>
                              </div>
                              <div className="text-right mt-1">
                                <span className="text-xs text-gray-400">
                                  {new Date(rep.createdAt).toLocaleTimeString()}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierReplies;