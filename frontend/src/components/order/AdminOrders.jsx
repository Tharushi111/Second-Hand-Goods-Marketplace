import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { 
  Search, 
  Download, 
  Eye, 
  X, 
  RefreshCw,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Image as ImageIcon,
  User,
  Mail,
  Phone,
  Hash,
  CreditCard,
  Banknote,
  ChevronDown,
  ChevronUp
} from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slipType, setSlipType] = useState("");
  const [expandedRows, setExpandedRows] = useState(new Set());
  const navigate = useNavigate();

  const token = localStorage.getItem("adminToken");
  const API_BASE_URL = "http://localhost:5001";

  const statusConfig = {
    pending: { 
      color: "bg-blue-50 text-blue-700 border border-blue-200", 
      icon: Clock,
      label: "Pending"
    },
    transfer_pending: { 
      color: "bg-amber-50 text-amber-700 border border-amber-200", 
      icon: AlertCircle,
      label: "Transfer Pending"
    },
    confirmed: { 
      color: "bg-green-50 text-green-700 border border-green-200", 
      icon: CheckCircle,
      label: "Confirmed"
    },
    shipped: { 
      color: "bg-purple-50 text-purple-700 border border-purple-200", 
      icon: Truck,
      label: "Shipped"
    },
    delivered: { 
      color: "bg-emerald-50 text-emerald-700 border border-emerald-200", 
      icon: CheckCircle,
      label: "Delivered"
    },
    cancelled: { 
      color: "bg-red-50 text-red-700 border border-red-200", 
      icon: X,
      label: "Cancelled"
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Rs. 0.00';
    
    return new Intl.NumberFormat('en-LK', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const fetchOrders = async () => {
    if (!token) {
      toast.error("Admin token not found");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
      setFilteredOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      toast.error(err.response?.data?.message || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;

    if (searchTerm) {
      result = result.filter(order => 
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      result = result.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(result);
  }, [searchTerm, statusFilter, orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API_BASE_URL}/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated successfully!");
      fetchOrders();
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleViewSlip = (slipUrl) => {
    if (!slipUrl) {
      toast.error("No payment slip available");
      return;
    }

    let imageUrl = slipUrl;
    
    if (slipUrl && !slipUrl.startsWith('http')) {
      imageUrl = `${API_BASE_URL}${slipUrl.startsWith('/') ? slipUrl : '/' + slipUrl}`;
    }
    
    const isImage = /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(slipUrl);
    const isPdf = /\.pdf$/i.test(slipUrl);
    
    setSlipType(isImage ? "image" : isPdf ? "pdf" : "unknown");
    setSelectedSlip(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSlip(null);
    setSlipType("");
  };

  const toggleRowExpand = (orderId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedRows(newExpanded);
  };

  const getSlipFileName = (url) => {
    if (!url) return "payment-slip";
    return url.split('/').pop() || "payment-slip";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-25 to-blue-50 p-4">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
              Order Management
            </h1>
            <p className="text-blue-700/70 text-sm">Manage and track customer orders</p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 text-sm"
          >
            <RefreshCw size={16} />
            Refresh
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-blue-100 p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" size={18} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 text-sm"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-blue-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 text-sm min-w-[150px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="transfer_pending">Transfer Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-sm border border-blue-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <RefreshCw className="animate-spin text-blue-600" size={32} />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                <Hash className="text-blue-400" size={32} />
              </div>
              <p className="text-blue-800/70 font-medium">No orders found</p>
              <p className="text-blue-600/60 text-sm mt-1">
                {orders.length === 0 ? "No orders have been placed yet" : "Try adjusting your search or filters"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900 text-xs uppercase tracking-wider w-8">
                      {/* Expand column */}
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900 text-xs uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900 text-xs uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900 text-xs uppercase tracking-wider">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-blue-900 text-xs uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900 text-xs uppercase tracking-wider">
                      Slip
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900 text-xs uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-blue-900 text-xs uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100/50">
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status]?.icon || Clock;
                    const hasPaymentSlip = order.paymentSlip?.url && order.paymentMethod === "bank";
                    const isExpanded = expandedRows.has(order._id);
                    
                    return (
                      <>
                        {/* Main Row */}
                        <tr key={order._id} className="hover:bg-blue-25/30 transition-all duration-150 group">
                          <td className="px-4 py-3">
                            <button
                              onClick={() => toggleRowExpand(order._id)}
                              className="p-1 hover:bg-blue-100 rounded transition-colors"
                            >
                              {isExpanded ? (
                                <ChevronUp size={14} className="text-blue-600" />
                              ) : (
                                <ChevronDown size={14} className="text-blue-600" />
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Hash size={14} className="text-blue-500" />
                                <span className="font-semibold text-blue-900">{order.orderNumber}</span>
                              </div>
                              <div className="text-xs text-blue-600/70">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </div>
                              <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig[order.status]?.color}`}>
                                <StatusIcon size={10} />
                                {statusConfig[order.status]?.label}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <User size={12} className="text-blue-500" />
                                <span className="font-medium text-blue-900">{order.customer?.username}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail size={12} className="text-blue-500" />
                                <span className="text-blue-700/80 text-xs">{order.customer?.email}</span>
                              </div>
                              {order.customer?.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone size={12} className="text-blue-500" />
                                  <span className="text-blue-700/80 text-xs">{order.customer.phone}</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {order.paymentMethod === "online" ? (
                                <CreditCard size={14} className="text-green-600" />
                              ) : (
                                <Banknote size={14} className="text-blue-600" />
                              )}
                              <span className={`text-xs font-medium px-2 py-1 rounded ${
                                order.paymentMethod === "online" 
                                  ? "bg-green-50 text-green-700 border border-green-200" 
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}>
                                {order.paymentMethod === "online" ? "Online" : "Bank"}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="font-bold text-blue-900">Rs. {formatPrice(order.total)}</span>
                          </td>
                          <td className="px-4 py-3">
                            {order.paymentMethod === "bank" ? (
                              hasPaymentSlip ? (
                                <button
                                  onClick={() => handleViewSlip(order.paymentSlip.url)}
                                  className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-2 py-1 rounded text-xs hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-sm"
                                >
                                  <Eye size={12} />
                                  View Slip
                                </button>
                              ) : (
                                <span className="text-red-600 text-xs bg-red-50 px-2 py-1 rounded border border-red-200">
                                  No Slip
                                </span>
                              )
                            ) : (
                              <span className="text-blue-800/90 text-xs bg-blue-25 px-2 py-1 rounded border border-blue-100">
                                Credit/Debit Cart
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className={`border border-blue-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-blue-500 focus:border-transparent bg-white/80 w-28 ${
                                order.status === "pending" ? "bg-blue-50 text-blue-700" :
                                order.status === "transfer_pending" ? "bg-amber-50 text-amber-700" :
                                order.status === "confirmed" ? "bg-green-50 text-green-700" :
                                order.status === "shipped" ? "bg-purple-50 text-purple-700" :
                                order.status === "delivered" ? "bg-emerald-50 text-emerald-700" :
                                "bg-red-50 text-red-700"
                              }`}
                            >
                              <option value="pending" className="bg-blue-50 text-blue-700">Pending</option>
                              <option value="transfer_pending" className="bg-amber-50 text-amber-700">Transfer Pending</option>
                              <option value="confirmed" className="bg-green-50 text-green-700">Confirmed</option>
                              <option value="shipped" className="bg-purple-50 text-purple-700">Shipped</option>
                              <option value="delivered" className="bg-emerald-50 text-emerald-700">Delivered</option>
                              <option value="cancelled" className="bg-red-50 text-red-700">Cancelled</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => navigate(`/admin/orders/${order._id}`)}
                              className="flex items-center gap-1 bg-gradient-to-r from-blue-500 to-blue-900 text-white px-2 py-1 rounded text-xs hover:from-blue-600 hover:to-blue-800 transition-all duration-200 shadow-sm"
                            >
                              <Hash size={12} />
                              Details
                            </button>
                          </td>
                        </tr>

                        {/* Expanded Row */}
                        {isExpanded && (
                          <tr className="bg-blue-25/20 border-b border-blue-100">
                            <td colSpan={8} className="px-4 py-3">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                {/* Delivery Info */}
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-blue-900 text-xs uppercase tracking-wide">Delivery Info</h4>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span className="text-blue-700/80">Method:</span>
                                      <span className="font-medium text-blue-900 capitalize">{order.deliveryMethod}</span>
                                    </div>
                                    {order.address && order.deliveryMethod !== "store" && (
                                      <>
                                        <div className="flex justify-between">
                                          <span className="text-blue-700/80">Address:</span>
                                          <span className="font-medium text-blue-900 text-right">{order.address.line1}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-blue-700/80">City:</span>
                                          <span className="font-medium text-blue-900">{order.address.city}</span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-blue-900 text-xs uppercase tracking-wide">Order Items</h4>
                                  <div className="space-y-1 max-h-20 overflow-y-auto">
                                    {order.items?.map((item, index) => (
                                      <div key={index} className="flex justify-between items-center py-1 px-2 bg-white/50 rounded border border-blue-100">
                                        <div className="flex items-center gap-2">
                                          {item.image && (
                                            <img
                                              src={`http://localhost:5001/${item.image}`}
                                              alt={item.name}
                                              className="w-6 h-6 object-cover rounded"
                                              onError={(e) => {
                                                e.target.src = 'https://via.placeholder.com/24x24?text=No+Image';
                                              }}
                                            />
                                          )}
                                          <span className="font-medium text-blue-900 text-xs">{item.name}</span>
                                        </div>
                                        <div className="text-right">
                                          <span className="text-blue-700 text-xs">Qty: {item.quantity}</span>
                                          <div className="text-blue-900 font-medium text-xs">Rs. {formatPrice(item.price * item.quantity)}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Additional Info */}
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-blue-900 text-xs uppercase tracking-wide">Additional Info</h4>
                                  <div className="space-y-1">
                                    <div className="flex justify-between">
                                      <span className="text-blue-700/80">Subtotal:</span>
                                      <span className="font-medium text-blue-900">Rs. {formatPrice(order.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-blue-700/80">Delivery:</span>
                                      <span className="font-medium text-blue-900">
                                        {order.deliveryCharge === 0 ? "FREE" : `Rs. ${formatPrice(order.deliveryCharge)}`}
                                      </span>
                                    </div>
                                    {order.notes && (
                                      <div>
                                        <span className="text-blue-700/80">Notes:</span>
                                        <p className="text-blue-900 text-xs mt-1">{order.notes}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Payment Slip Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-blue-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full border border-blue-200">
            <div className="flex items-center justify-between p-4 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-xl">
              <div className="flex items-center gap-2">
                {slipType === "pdf" ? 
                  <FileText className="text-blue-600" size={20} /> : 
                  <ImageIcon className="text-cyan-600" size={20} />
                }
                <h3 className="text-lg font-semibold text-blue-900">
                  Payment Slip - {getSlipFileName(selectedSlip)}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="text-blue-400 hover:text-blue-600 transition-colors p-1 hover:bg-blue-100 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-auto flex items-center justify-center bg-blue-25/30">
              {selectedSlip ? (
                slipType === "pdf" ? (
                  <div className="text-center p-6">
                    <div className="w-16 h-16 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="text-blue-600" size={32} />
                    </div>
                    <p className="text-blue-800 mb-4">PDF payment slip</p>
                    <a
                      href={selectedSlip}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
                    >
                      <Download size={16} />
                      Open PDF
                    </a>
                  </div>
                ) : (
                  <img
                    src={selectedSlip}
                    alt="Payment Slip"
                    className="max-w-full max-h-[50vh] rounded-lg shadow-md border-4 border-white"
                  />
                )
              ) : (
                <div className="text-center text-blue-400">
                  <ImageIcon className="mx-auto mb-2 text-blue-400" size={40} />
                  <p>No payment slip available</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 p-4 border-t border-blue-100 bg-blue-50/50">
              {selectedSlip && (
                <a
                  href={selectedSlip}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200"
                >
                  <Download size={16} />
                  Download
                </a>
              )}
              <button
                onClick={closeModal}
                className="px-4 py-2 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;