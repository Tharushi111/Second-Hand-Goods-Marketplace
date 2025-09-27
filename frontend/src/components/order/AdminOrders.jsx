import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
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
  Hash
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

  const token = localStorage.getItem("adminToken");
  const API_BASE_URL = "http://localhost:5001";

  // Enhanced status configuration with blue-themed colors
  const statusConfig = {
    pending: { 
      color: "bg-blue-50 text-blue-700 border border-blue-200", 
      icon: Clock,
      label: "Pending"
    },
    transfer_pending: { 
      color: "bg-cyan-50 text-cyan-700 border border-cyan-200", 
      icon: AlertCircle,
      label: "Transfer Pending"
    },
    confirmed: { 
      color: "bg-indigo-50 text-indigo-700 border border-indigo-200", 
      icon: CheckCircle,
      label: "Confirmed"
    },
    shipped: { 
      color: "bg-sky-50 text-sky-700 border border-sky-200", 
      icon: Truck,
      label: "Shipped"
    },
    delivered: { 
      color: "bg-teal-50 text-teal-700 border border-teal-200", 
      icon: CheckCircle,
      label: "Delivered"
    },
    cancelled: { 
      color: "bg-rose-50 text-rose-700 border border-rose-200", 
      icon: X,
      label: "Cancelled"
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Rs. 0.00';
    
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price).replace('LKR', 'Rs.');
  };

  const fetchOrders = async () => {
    if (!token) {
      toast.error("Admin token not found", { position: "top-center" });
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
      toast.error(err.response?.data?.message || "Failed to fetch orders", { position: "top-center" });
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
      toast.success("Status updated successfully!", { position: "top-center" });
      fetchOrders();
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error(err.response?.data?.message || "Failed to update status", { position: "top-center" });
    }
  };

  const handleViewSlip = (slipUrl) => {
    if (!slipUrl) {
      toast.error("No payment slip available", { position: "top-center" });
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

  const getSlipFileName = (url) => {
    if (!url) return "payment-slip";
    return url.split('/').pop() || "payment-slip";
  };

  // Helper function to render customer information
  const renderCustomerInfo = (customer) => {
    if (!customer) return null;

    return (
      <div className="space-y-1">
        {customer.username && (
          <div className="flex items-center gap-2">
            <User size={14} className="text-blue-500" />
            <span className="font-medium text-gray-900">{customer.username}</span>
          </div>
        )}
        {customer.email && (
          <div className="flex items-center gap-2">
            <Mail size={14} className="text-blue-500" />
            <span className="text-sm text-gray-600">{customer.email}</span>
          </div>
        )}
        {customer.phone && (
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-blue-500" />
            <span className="text-sm text-gray-600">{customer.phone}</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-25 to-blue-50 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Order Management
            </h1>
            <p className="text-blue-700/80">Manage orders and view payment slips</p>
          </div>
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
          >
            <RefreshCw size={18} />
            Refresh Orders
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-blue-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" size={20} />
              <input
                type="text"
                placeholder="Search by order #, customer name, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50"
              />
            </div>
            
            <div className="flex gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-blue-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/50 min-w-[160px]"
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
        </div>

        {/* Orders Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <RefreshCw className="animate-spin text-blue-600" size={32} />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
                <Hash className="text-blue-400" size={40} />
              </div>
              <p className="text-blue-800/70 text-lg font-medium">No orders found</p>
              {orders.length === 0 ? (
                <p className="text-blue-600/60">No orders have been placed yet</p>
              ) : (
                <p className="text-blue-600/60">Try adjusting your search or filters</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-cyan-50 border-b border-blue-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      Payment Method
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      Payment Slip
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-blue-900 uppercase tracking-wider">
                      Update Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100/50">
                  {filteredOrders.map((order) => {
                    const StatusIcon = statusConfig[order.status]?.icon || Clock;
                    const hasPaymentSlip = order.paymentSlip?.url && order.paymentMethod === "bank";
                    
                    return (
                      <tr key={order._id} className="hover:bg-blue-25/50 transition-all duration-200 group">
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {order.orderNumber && (
                              <div className="flex items-center gap-2">
                                <Hash size={16} className="text-blue-400" />
                                <p className="font-semibold text-blue-900">{order.orderNumber}</p>
                              </div>
                            )}
                            {order.createdAt && (
                              <p className="text-sm text-blue-700/80">
                                {new Date(order.createdAt).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusConfig[order.status]?.color}`}>
                                <StatusIcon size={12} />
                                {statusConfig[order.status]?.label || order.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {renderCustomerInfo(order.customer)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                            order.paymentMethod === "online" 
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}>
                            {order.paymentMethod === "online" ? "Online Payment" : "Bank Transfer"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-bold text-blue-900 text-lg">{formatPrice(order.total)}</p>
                        </td>
                        <td className="px-6 py-4">
                          {hasPaymentSlip ? (
                            <button
                            onClick={() => handleViewSlip(order.paymentSlip.url)}
                            className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-1.5 rounded-lg hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 text-sm"
                          >
                            <Eye size={14} />
                            View Slip
                          </button>
                          ) : order.paymentMethod === "bank" ? (
                            <span className="text-rose-600 text-sm bg-rose-50 px-3 py-2 rounded-xl border border-rose-200">
                              Slip Not Uploaded
                            </span>
                          ) : (
                            <span className="text-blue-400/70 text-sm bg-blue-25 px-3 py-2 rounded-xl border border-blue-100">
                              Not Applicable
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="border border-blue-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/70 min-w-[140px]"
                          >
                            <option value="pending">Pending</option>
                            <option value="transfer_pending">Transfer Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
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
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] w-full border border-blue-200">
            <div className="flex items-center justify-between p-6 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-t-2xl">
              <div className="flex items-center gap-3">
                {slipType === "pdf" ? 
                  <FileText className="text-blue-500" size={24} /> : 
                  <ImageIcon className="text-cyan-500" size={24} />
                }
                <h3 className="text-lg font-semibold text-blue-900">
                  Bank Payment Slip - {getSlipFileName(selectedSlip)}
                </h3>
              </div>
              <button
                onClick={closeModal}
                className="text-blue-400 hover:text-blue-600 transition-colors p-1 hover:bg-blue-100 rounded-lg"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 max-h-[70vh] overflow-auto flex items-center justify-center bg-blue-25/30">
              {selectedSlip ? (
                slipType === "pdf" ? (
                  <div className="text-center p-8">
                    <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <FileText className="text-blue-500" size={40} />
                    </div>
                    <p className="text-blue-800 mb-4">This is a PDF payment slip</p>
                    <a
                      href={selectedSlip}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
                    >
                      <Download size={16} />
                      Open PDF Slip
                    </a>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={selectedSlip}
                      alt="Bank Payment Slip"
                      className="max-w-full max-h-[60vh] rounded-lg shadow-lg border-4 border-white"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE1MCAyMDBIMjUwTDIwMCAxNTBaIiBmaWxsPSIjOEU5MEEwIi8+Cjx0ZXh0IHg9IjIwMCIgeT0iMTMwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjOEU5MEEwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiPkJhbmsgU2xpcCBub3QgYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K=";
                      }}
                    />
                  </div>
                )
              ) : (
                <div className="text-center text-blue-400 p-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <ImageIcon className="text-blue-400" size={40} />
                  </div>
                  <p className="text-blue-600">No payment slip available</p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-blue-100 bg-blue-50/50 rounded-b-2xl">
              {selectedSlip && (
                <a
                  href={selectedSlip}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-xl hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
                >
                  <Download size={16} />
                  Download {slipType === "pdf" ? "PDF" : "Image"}
                </a>
              )}
              <button
                onClick={closeModal}
                className="px-6 py-2 border border-blue-200 text-blue-700 rounded-xl hover:bg-blue-50 transition-all duration-200"
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