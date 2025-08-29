import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faEye, 
  faEdit, 
  faTrash, 
  faBox, 
  faSpinner, 
  faTimes,
  faExclamationTriangle,
  faInfoCircle,
  faCalendarAlt
} from '@fortawesome/free-solid-svg-icons';
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ReorderRequests = () => {
  const [reorders, setReorders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReorders = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/reorders"); 
        setReorders(res.data);
      } catch (error) {
        console.error("Error fetching reorder requests:", error);
        toast.error("Failed to fetch reorder requests", { position: "top-center" });
      } finally {
        setLoading(false);
      }
    };
    fetchReorders();
  }, []);

  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdate = (order) => {
    navigate("/inventory/update-reorder", { state: { order } });
  };
  

  const handleDelete = async (orderId, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await axios.delete(`http://localhost:5001/api/reorders/${orderId}`);
        setReorders(prev => prev.filter(r => r._id !== orderId));
        toast.success(`"${title}" deleted successfully`, { position: "top-center" });
      } catch (err) {
        console.error(err);
        toast.error(`Failed to delete "${title}"`, { position: "top-center" });
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FontAwesomeIcon icon={faSpinner} className="animate-spin text-4xl text-blue-500 mr-3" />
        <p className="ml-4 text-gray-600">Loading reorder requests...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reorder Requests</h1>
          <p className="text-gray-600">Manage and track all inventory reorder requests</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                  <th className="px-6 py-4 text-left font-semibold">Title</th>
                  <th className="px-6 py-4 text-left font-semibold">Quantity</th>
                  <th className="px-6 py-4 text-left font-semibold">Category</th>
                  <th className="px-6 py-4 text-left font-semibold">Priority</th>
                  <th className="px-6 py-4 text-left font-semibold">Description</th>
                  <th className="px-6 py-4 text-left font-semibold">Created At</th>
                  <th className="px-6 py-4 text-center font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reorders.map((order) => (
                  <tr key={order._id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{order.title}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">{order.quantity}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800">{order.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        order.priority === "High" ? "bg-red-100 text-red-800"
                        : order.priority === "Normal" ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                      }`}>
                        <FontAwesomeIcon icon={order.priority === "High" ? faExclamationTriangle : faInfoCircle} className="mr-2" />
                        {order.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs text-gray-600 truncate">{order.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center space-x-3">
                        <button onClick={() => handleView(order)} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100">
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button onClick={() => handleUpdate(order)} className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-green-100">
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button onClick={() => handleDelete(order._id, order.title)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {reorders.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-2">
                <FontAwesomeIcon icon={faBox} className="text-5xl" />
              </div>
              <p className="text-gray-500 text-lg">No reorder requests found</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal for viewing full details */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Reorder Request Details</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                >
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Title</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">{selectedOrder.title}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Quantity</h3>
                  <p className="mt-1 text-lg font-medium text-blue-600">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100">
                      {selectedOrder.quantity}
                    </span>
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {selectedOrder.category}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                  <p className={`mt-1 text-lg font-medium ${
                    selectedOrder.priority === "High" 
                      ? "text-red-600" 
                      : selectedOrder.priority === "Normal" 
                        ? "text-yellow-600" 
                        : "text-green-600"
                  }`}>
                    <FontAwesomeIcon 
                      icon={selectedOrder.priority === "High" ? faExclamationTriangle : faInfoCircle} 
                      className="mr-2" 
                    />
                    {selectedOrder.priority}
                  </p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Full Description</h3>
                  <p className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-700">{selectedOrder.description}</p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                  <p className="mt-1 text-gray-700">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button 
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-2" />
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReorderRequests;
