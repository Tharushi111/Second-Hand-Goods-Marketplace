import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Truck, Package, Search, RefreshCw, X, User, MapPin } from "lucide-react";
import { toast } from "react-hot-toast";

const Delivery = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const adminToken = localStorage.getItem("adminToken");

  const fetchPaidOrders = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5001/api/orders/admin", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const paidOrders = data.filter(
        (order) => order.paymentMethod && order.status !== "cancelled"
      );

      setOrders(paidOrders);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError(err.message);
      toast.error("Failed to fetch orders: " + err.message, { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaidOrders();
  }, []);

  const assignDelivery = async (orderId, method) => {
    try {
      const res = await fetch(`http://localhost:5001/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          deliveryMethod: method,
          status: "delivered",
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedOrder = await res.json();

      // Update order in state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? updatedOrder : o))
      );

      // Close modal
      setShowModal(false);
      
      // Show confirmation toast
      toast.success(`Order ${updatedOrder.orderNumber} successfully assigned to ${method}`, { position: "top-center" });
    } catch (err) {
      console.error("Failed to assign delivery:", err);
      toast.error("Failed to assign delivery: " + err.message, { position: "top-center" });
    }
  };

  const openAssignModal = (order, method) => {
    setCurrentOrder(order);
    setSelectedMethod(method);
    setShowModal(true);
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter(order =>
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items?.some(item => 
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-2xl">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <motion.div className="max-w-7xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <Truck size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Delivery Management</h1>
                <p className="text-blue-100 mt-1">Manage and assign delivery methods for paid orders</p>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              onClick={fetchPaidOrders} 
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 p-3 rounded-xl"
            >
              <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
            </motion.button>
          </div>
        </div>

        {/* Search and Stats Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
            <div className="flex items-center space-x-4 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search orders by order number, customer, or items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 rounded-xl text-white">
              <span className="font-semibold">{filteredOrders.length} orders found</span>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <motion.div className="bg-white rounded-2xl shadow-lg overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Paid Orders List</h2>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm text-white backdrop-blur-sm">
              {filteredOrders.length} orders
            </span>
          </div>
          
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No paid orders available</h3>
              <p className="text-gray-500">There are currently no paid orders to manage.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700 uppercase tracking-wider">Order Details</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700 uppercase tracking-wider">Items</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700 uppercase tracking-wider">Delivery Method</th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-blue-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 p-2 rounded-lg">
                            <Package size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">#{order.orderNumber}</div>
                            <div className="text-sm text-gray-500">Placed recently</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <User size={16} className="text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{order.customer?.username}</div>
                            <div className="text-sm text-gray-500">{order.customer?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs">
                          {order.items?.map((i) => i.name).join(", ")}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">Rs.{order.total}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {order.deliveryMethod ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <MapPin size={12} className="mr-1" />
                            {order.deliveryMethod}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <MapPin size={12} className="mr-1" />
                            Not assigned
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          <motion.button
                            onClick={() => openAssignModal(order, "Uber")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                          >
                            <Truck size={16} className="mr-2" />
                            Uber
                          </motion.button>
                          <motion.button
                            onClick={() => openAssignModal(order, "PickMe")}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                          >
                            <Truck size={16} className="mr-2" />
                            PickMe
                          </motion.button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Confirmation Modal */}
      {showModal && currentOrder && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <Truck size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Assign Delivery</h2>
                    <p className="text-blue-100 text-sm">Choose delivery method</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Order Information */}
              <div className="bg-blue-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">Order Number:</span>
                  <span className="text-sm font-bold">#{currentOrder.orderNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">Customer:</span>
                  <span className="text-sm">{currentOrder.customer?.username}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">Total Amount:</span>
                  <span className="text-sm font-bold text-green-600">Rs.{currentOrder.total}</span>
                </div>
              </div>

              {/* Delivery Method Selection */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 text-center">Select Delivery Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => assignDelivery(currentOrder._id, "Uber")}
                    className="p-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all flex flex-col items-center space-y-2"
                  >
                    <Truck size={24} />
                    <span className="font-semibold">Uber</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => assignDelivery(currentOrder._id, "PickMe")}
                    className="p-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all flex flex-col items-center space-y-2"
                  >
                    <Truck size={24} />
                    <span className="font-semibold">PickMe</span>
                  </motion.button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  type="button"
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => assignDelivery(currentOrder._id, selectedMethod)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
                >
                  Confirm Assignment
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Delivery;
