import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Truck, Package, Search, RefreshCw, X, User, MapPin, CreditCard, Building } from "lucide-react";
import { toast } from "react-hot-toast";

const Delivery = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMethod, setSelectedMethod] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [assigningOrder, setAssigningOrder] = useState(null);
  const [clickedOrders, setClickedOrders] = useState(new Set());

  const adminToken = localStorage.getItem("adminToken");

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

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
      
      // Filter orders that are ready for delivery assignment
      const paidOrders = data.filter(
        (order) => 
          // Include both online and bank payments
          (order.paymentMethod === "online" || order.paymentMethod === "bank") &&
          // Include orders that are confirmed (for bank) or any status that indicates payment is done
          (order.status === "confirmed" || order.status === "transfer_pending") &&
          // Only delivery orders, not store pickups
          order.deliveryMethod !== "store"
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
    setAssigningOrder(orderId);
    
    try {
      const res = await fetch(`http://localhost:5001/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          status: "shipped",
          deliveryMethod: method,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const updatedOrder = await res.json();

      // Update order in state
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, deliveryMethod: method } : o))
      );

      // Mark this order as clicked to disable buttons
      setClickedOrders(prev => new Set(prev.add(orderId)));

      // Close modal
      setShowModal(false);
      setAssigningOrder(null);
      
      // Show confirmation toast
      toast.success(`Order ${updatedOrder.orderNumber} assigned to ${method}`, { position: "top-center" });
    } catch (err) {
      console.error("Failed to assign delivery:", err);
      toast.error("Failed to assign delivery: " + err.message, { position: "top-center" });
      setAssigningOrder(null);
    }
  };

  const openAssignModal = (order, method) => {
    // Only open modal if buttons aren't disabled
    if (clickedOrders.has(order._id) || assigningOrder === order._id) {
      return;
    }
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-full mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-full mx-auto">
        <div className="flex justify-center items-center h-64">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-2xl text-base">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <motion.div className="max-w-full mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-4 mb-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <Truck size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Delivery Management</h1>
                <p className="text-blue-100 text-sm mt-1">Manage and assign delivery methods</p>
              </div>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }} 
              onClick={fetchPaidOrders} 
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 p-2 rounded-lg"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </motion.button>
          </div>
        </div>

        {/* Search and Stats Bar */}
        <div className="bg-white rounded-xl shadow-sm p-3 mb-4">
          <div className="flex flex-col lg:flex-row gap-3 justify-between items-center">
            <div className="flex items-center space-x-3 flex-1 max-w-md">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search delivery orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-1 rounded-lg text-white text-sm">
              <span className="font-semibold">{filteredOrders.length} delivery orders</span>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <motion.div className="bg-white rounded-xl shadow-sm overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-3 flex justify-between items-center">
            <h2 className="text-lg font-bold text-white">Paid Delivery Orders</h2>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm text-white backdrop-blur-sm">
              {filteredOrders.length} orders
            </span>
          </div>
          
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package size={32} className="mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No paid delivery orders</h3>
              <p className="text-gray-500 text-base">No paid delivery orders to manage.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-blue-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Order</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Customer</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Items</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Total</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Payment</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Delivery</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Status</th>
                    <th className="px-3 py-3 text-center text-xs font-semibold text-blue-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="bg-blue-100 p-2 rounded">
                            <Package size={16} className="text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">#{order.orderNumber}</div>
                            <div className="text-gray-500 text-xs">Recently placed</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <div className="bg-blue-100 p-2 rounded">
                            <User size={14} className="text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 text-sm">{order.customer?.username}</div>
                            <div className="text-gray-500 text-xs">{order.customer?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-gray-900 text-sm max-w-[120px] truncate">
                          {order.items?.map((i) => i.name).join(", ")}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="font-bold text-gray-900 text-sm">Rs.{formatPrice(order.total)}</div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          order.paymentMethod === "online" 
                            ? "bg-green-100 text-green-800"
                            : order.paymentMethod === "bank"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          {order.paymentMethod === "online" ? (
                            <CreditCard size={12} className="mr-1" />
                          ) : (
                            <Building size={12} className="mr-1" />
                          )}
                          {order.paymentMethod === "online" ? "Online" : 
                           order.paymentMethod === "bank" ? "Bank" : 
                           order.paymentMethod}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          order.deliveryMethod === "home" 
                            ? "bg-green-100 text-green-800"
                            : order.deliveryMethod === "different"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-gray-100 text-gray-800"
                        }`}>
                          <MapPin size={12} className="mr-1" />
                          {order.deliveryMethod === "home" ? "Home" : 
                           order.deliveryMethod === "different" ? "Different" : 
                           order.deliveryMethod}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {order.deliveryMethod === "Uber" || order.deliveryMethod === "PickMe" ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            <MapPin size={12} className="mr-1" />
                            {order.deliveryMethod}
                          </span>
                        ) : (
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            order.status === "confirmed" 
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            <MapPin size={12} className="mr-1" />
                            {order.status === "confirmed" ? "Ready" : "Pending"}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex justify-center gap-2">
                          <motion.button
                            onClick={() => openAssignModal(order, "Uber")}
                            disabled={clickedOrders.has(order._id) || assigningOrder === order._id || order.deliveryMethod === "Uber" || order.deliveryMethod === "PickMe" || order.status !== "confirmed"}
                            whileHover={{ scale: (clickedOrders.has(order._id) || order.deliveryMethod === "Uber" || order.deliveryMethod === "PickMe" || order.status !== "confirmed") ? 1 : 1.05 }}
                            whileTap={{ scale: (clickedOrders.has(order._id) || order.deliveryMethod === "Uber" || order.deliveryMethod === "PickMe" || order.status !== "confirmed") ? 1 : 0.95 }}
                            className={`inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-lg shadow-sm text-white transition-all ${
                              clickedOrders.has(order._id) || assigningOrder === order._id || order.deliveryMethod === "Uber" || order.deliveryMethod === "PickMe" || order.status !== "confirmed"
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500'
                            }`}
                          >
                            <Truck size={14} className="mr-1" />
                            {assigningOrder === order._id ? '...' : 'Uber'}
                          </motion.button>
                          <motion.button
                            onClick={() => openAssignModal(order, "PickMe")}
                            disabled={clickedOrders.has(order._id) || assigningOrder === order._id || order.deliveryMethod === "Uber" || order.deliveryMethod === "PickMe" || order.status !== "confirmed"}
                            whileHover={{ scale: (clickedOrders.has(order._id) || order.deliveryMethod === "Uber" || order.deliveryMethod === "PickMe" || order.status !== "confirmed") ? 1 : 1.05 }}
                            whileTap={{ scale: (clickedOrders.has(order._id) || order.deliveryMethod === "Uber" || order.deliveryMethod === "PickMe" || order.status !== "confirmed") ? 1 : 0.95 }}
                            className={`inline-flex items-center px-3 py-2 border border-transparent text-xs font-medium rounded-lg shadow-sm text-black transition-all ${
                              clickedOrders.has(order._id) || assigningOrder === order._id || order.deliveryMethod === "Uber" || order.deliveryMethod === "PickMe" || order.status !== "confirmed"
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                            }`}
                          >
                            <Truck size={14} className="mr-1" />
                            {assigningOrder === order._id ? '...' : 'PickMe'}
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
            className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="bg-white/20 p-1.5 rounded-lg">
                    <Truck size={18} />
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
                  className="p-1 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={16} />
                </motion.button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-4 space-y-4">
              {/* Order Information */}
              <div className="bg-blue-50 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">Order:</span>
                  <span className="text-sm font-bold">#{currentOrder.orderNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">Customer:</span>
                  <span className="text-sm">{currentOrder.customer?.username}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">Total:</span>
                  <span className="text-sm font-bold text-green-600">Rs.{formatPrice(currentOrder.total)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">Payment:</span>
                  <span className="text-sm font-medium text-blue-600">
                    {currentOrder.paymentMethod === "online" ? "Online Payment" : 
                     currentOrder.paymentMethod === "bank" ? "Bank Transfer" : 
                     currentOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-700">Delivery Type:</span>
                  <span className="text-sm font-medium text-blue-600">
                    {currentOrder.deliveryMethod === "home" ? "Home Delivery" : 
                     currentOrder.deliveryMethod === "different" ? "Different Location" : 
                     currentOrder.deliveryMethod}
                  </span>
                </div>
              </div>

              {/* Delivery Method Selection */}
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-gray-900 text-center">Select Delivery Method</h3>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => assignDelivery(currentOrder._id, "Uber")}
                    className="p-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-all flex flex-col items-center space-y-1"
                  >
                    <Truck size={18} />
                    <span className="font-semibold text-sm">Uber</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => assignDelivery(currentOrder._id, "PickMe")}
                    className="p-3 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-all flex flex-col items-center space-y-1"
                  >
                    <Truck size={18} />
                    <span className="font-semibold text-sm">PickMe</span>
                  </motion.button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <motion.button
                  type="button"
                  onClick={() => setShowModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => assignDelivery(currentOrder._id, selectedMethod)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all text-sm"
                >
                  Confirm
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