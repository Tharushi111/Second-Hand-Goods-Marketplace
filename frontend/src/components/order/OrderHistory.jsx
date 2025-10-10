import React, { useEffect, useState } from "react";
import { 
  FaHistory, 
  FaShoppingBag, 
  FaShippingFast, 
  FaCheckCircle, 
  FaClock, 
  FaTimesCircle,
  FaTruck,
  FaHome,
  FaStore,
  FaCreditCard,
  FaMoneyBillWave,
  FaEye,
  FaFilePdf,
  FaDownload,
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaCalendar
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import companyLogo from '../../assets/ReBuyLogo.png';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrders, setExpandedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    if (!token) {
      navigate("/UserLogin");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5001/api/orders/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      if (err.response?.status === 401) navigate("/UserLogin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return <FaClock className="text-yellow-500" />;
      case "transfer_pending": return <FaClock className="text-orange-500" />;
      case "confirmed": return <FaCheckCircle className="text-green-500" />;
      case "shipped": return <FaTruck className="text-blue-500" />;
      case "delivered": return <FaCheckCircle className="text-green-600" />;
      case "cancelled": return <FaTimesCircle className="text-red-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "transfer_pending": return "bg-orange-100 text-orange-800 border-orange-200";
      case "confirmed": return "bg-green-100 text-green-800 border-green-200";
      case "shipped": return "bg-blue-100 text-blue-800 border-blue-200";
      case "delivered": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "Pending";
      case "transfer_pending": return "Transfer Pending";
      case "confirmed": return "Confirmed";
      case "shipped": return "Shipped";
      case "delivered": return "Delivered";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  };

  const formatPrice = (price) =>
    price?.toLocaleString('en-LK', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }) || "0.00";

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // View Full Details function - Fixed
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const generatePDF = async (order) => {
  setDownloadingPdf(true);
  try {
    const doc = new jsPDF();
    
    // White background for header
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 210, 40, 'F');
    
    // Add company logo image
    doc.addImage(companyLogo, 'PNG', 15, 10, 20, 20);
    
    // Company details - Right side
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99); 
    doc.setFont(undefined, 'normal');
    doc.text("ReBuy.lk", 130, 10);
    doc.text("77A, Market Street, Colombo, Sri Lanka", 130, 15);
    doc.text("Contact: +94 77 321 4567", 130, 20);
    doc.text("Email: rebuy@gmail.com", 130, 25);
    
    // Add a subtle border line
    doc.setDrawColor(200, 200, 200);
    doc.line(10, 40, 200, 40);
    
    // Order title in blue
    doc.setFontSize(16);
    doc.setTextColor(59, 130, 246);
    doc.setFont(undefined, 'bold');
    doc.text(`ORDER INVOICE - ${order.orderNumber}`, 15, 55);
    
    // Order details in dark gray
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.setFont(undefined, 'normal');
    doc.text(`Order Date: ${formatDate(order.createdAt)}`, 15, 65);
    doc.text(`Status: ${getStatusText(order.status)}`, 15, 70);
    doc.text(`Customer: ${order.customer?.username || 'N/A'}`, 15, 75);
    doc.text(`Email: ${order.customer?.email || 'N/A'}`, 15, 80);
    
    // Delivery info - Added at correct position
    doc.text(`Delivery Method: ${order.deliveryMethod === "store" ? "Store Pickup" : 
             order.deliveryMethod === "different" ? "Different Address" : "Home Delivery"}`, 15, 90);
    doc.text(`Payment Method: ${order.paymentMethod === "online" ? "Online Payment" : 
             order.paymentMethod === "bank" ? "Bank Transfer" : "Cash on Delivery"}`, 15, 95);
    
    // Customer address if available
    if (order.address) {
      doc.text(`Delivery Address: ${order.address.line1 || ''}`, 15, 105);
      if (order.address.city || order.address.postalCode) {
        doc.text(`${order.address.city || ''}${order.address.city && order.address.postalCode ? ', ' : ''}${order.address.postalCode || ''}`, 15, 110);
      }
      if (order.address.country) {
        doc.text(`${order.address.country}`, 15, 115);
      }
    }
    
    // Order items table
    const tableColumn = ["Item", "Quantity", "Unit Price (Rs.)", "Total (Rs.)"];
    const tableRows = order.items.map(item => [
      item.name.length > 30 ? item.name.substring(0, 30) + '...' : item.name,
      item.quantity.toString(),
      formatPrice(item.price),
      formatPrice(item.price * item.quantity)
    ]);
    
    // Start table after customer info
    const startY = order.address ? 125 : 105;
    
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: startY,
      theme: 'grid',
      styles: { 
        fontSize: 8,
        cellPadding: 3,
        textColor: [75, 85, 99]
      },
      headStyles: { 
        fillColor: [59, 130, 246],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      },
      margin: { left: 10, right: 10 }
    });
    
    // Pricing summary
    const finalY = doc.lastAutoTable.finalY + 10;
    
    doc.setFontSize(10);
    doc.setTextColor(75, 85, 99);
    doc.text("Pricing Summary:", 15, finalY);
    
    // Subtotal
    doc.text("Subtotal:", 150, finalY, { align: 'right' });
    doc.text(`Rs. ${formatPrice(order.subtotal)}`, 190, finalY, { align: 'right' });
    
    // Delivery Charge
    doc.text("Delivery Charge:", 150, finalY + 5, { align: 'right' });
    if (order.deliveryCharge === 0) {
      doc.setTextColor(34, 197, 94); 
      doc.text("FREE", 190, finalY + 5, { align: 'right' });
      doc.setTextColor(75, 85, 99); 
    } else {
      doc.text(`Rs. ${formatPrice(order.deliveryCharge)}`, 190, finalY + 5, { align: 'right' });
    }
    
    // Total Amount
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.setTextColor(59, 130, 246);
    doc.text("Total Amount:", 150, finalY + 15, { align: 'right' });
    doc.text(`Rs. ${formatPrice(order.total)}`, 190, finalY + 15, { align: 'right' });
    
    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.text("Thank you for shopping with ReBuy.lk!", 105, pageHeight - 20, { align: 'center' });
    doc.text("This is a computer-generated invoice.", 105, pageHeight - 15, { align: 'center' });
    doc.text("For any inquiries, contact: +94 77 321 4567 | rebuy@gmail.com", 105, pageHeight - 10, { align: 'center' });
    
    // Save the PDF
    doc.save(`invoice-${order.orderNumber}.pdf`);
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error generating PDF. Please try again.");
  } finally {
    setDownloadingPdf(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-semibold">Loading your orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">RB</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RedBuy.Ik</h1>
                <p className="text-gray-600">Online Shopping Platform</p>
              </div>
            </div>
            
            
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
          <p className="text-gray-600 text-lg">Track and manage your purchases with ease</p>
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 inline-block">
            <span className="text-blue-800 font-semibold">
              {orders.length} orders found
            </span>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="text-center bg-white rounded-lg shadow-sm border border-gray-200 p-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaShoppingBag className="text-gray-400 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">No Orders Yet</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Your order history is empty. Start shopping to see your orders here.
              </p>
              <button
                onClick={() => navigate("/productListing")}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Order #{order.orderNumber}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(order.status)} flex items-center gap-2`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </span>
                      <button
                        onClick={() => toggleExpand(order._id)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        {expandedOrders.includes(order._id) ? "Hide Details" : "View Details"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Delivery & Payment Info */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Delivery</h4>
                        <div className="flex items-center gap-2 text-gray-700">
                          {order.deliveryMethod === "store" ? 
                            <FaStore className="text-blue-500" /> : 
                            <FaHome className="text-blue-500" />
                          }
                          <span className="capitalize">
                            {order.deliveryMethod === "store" ? "Store Pickup" : 
                             order.deliveryMethod === "different" ? "Different Address" : "Home Delivery"}
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Payment</h4>
                        <div className="flex items-center gap-2 text-gray-700">
                          {order.paymentMethod === "online" ? 
                            <FaCreditCard className="text-green-500" /> : 
                            <FaMoneyBillWave className="text-green-500" />
                          }
                          <span className="capitalize">
                            {order.paymentMethod === "online" ? "Online Payment" : 
                             order.paymentMethod === "bank" ? "Bank Transfer" : "Cash on Delivery"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Items Count & Total */}
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Items</h4>
                        <p className="text-gray-700">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''} purchased
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Total Value</h4>
                        <p className="text-lg font-bold text-blue-600">
                          Rs. {formatPrice(order.total)}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons - Fixed */}
                    <div className="flex flex-col gap-3">
                      <button
                        onClick={() => viewOrderDetails(order)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <FaEye />
                        View Full Details
                      </button>
                      
                      <button
                        onClick={() => generatePDF(order)}
                        disabled={downloadingPdf}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        <FaDownload />
                        Download PDF
                      </button>
                    </div>
                  </div>

                  {/* Status Timeline */}
                  {order.history && order.history.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-semibold text-gray-900 mb-3">Status Timeline</h4>
                      <div className="flex flex-wrap gap-3">
                        {order.history.slice().reverse().map((history, idx) => (
                          <div key={idx} className="bg-gray-50 px-3 py-2 rounded border border-gray-200">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${
                                history.status === 'delivered' ? 'bg-green-500' :
                                history.status === 'shipped' ? 'bg-blue-500' :
                                history.status === 'confirmed' ? 'bg-green-400' :
                                history.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                              }`}></span>
                              <span className="font-medium text-gray-900 capitalize text-sm">
                                {history.status.replace('_', ' ')}
                              </span>
                            </div>
                            <span className="text-gray-600 text-xs block mt-1">
                              {new Date(history.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Expanded Order Items */}
                {expandedOrders.includes(order._id) && (
                  <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <h4 className="font-semibold text-gray-900 mb-4">Order Items</h4>
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center gap-4 p-3 bg-white rounded border border-gray-200">
                          <img
                            src={`http://localhost:5001/${item.image}`}
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded border"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/48x48?text=No+Image";
                            }}
                          />
                          <div className="flex-1">
                            <h5 className="font-medium text-gray-900">{item.name}</h5>
                            <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">Rs. {formatPrice(item.price)}</p>
                            <p className="text-gray-600 text-sm">
                              Total: Rs. {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order Details Modal - Fixed and Enhanced */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">Order Details</h2>
                  <p className="text-blue-100">Complete information about your order</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-blue-200 text-2xl bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all"
                >
                  &times;
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <FaCalendar className="text-blue-500" />
                    Order Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong className="text-blue-700">Order #:</strong> {selectedOrder.orderNumber}</p>
                    <p><strong className="text-blue-700">Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                    <p><strong className="text-blue-700">Status:</strong> 
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <FaShippingFast className="text-green-500" />
                    Delivery & Payment
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><strong className="text-green-700">Delivery:</strong> 
                      <span className="capitalize ml-2">
                        {selectedOrder.deliveryMethod === "store" ? "Store Pickup" : 
                         selectedOrder.deliveryMethod === "different" ? "Different Address" : "Home Delivery"}
                      </span>
                    </p>
                    <p><strong className="text-green-700">Payment:</strong> 
                      <span className="capitalize ml-2">
                        {selectedOrder.paymentMethod === "online" ? "Online Payment" : 
                         selectedOrder.paymentMethod === "bank" ? "Bank Transfer" : "Cash on Delivery"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Information */}
              {selectedOrder.customer && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <FaUser className="text-gray-600" />
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <strong className="text-gray-700">Username:</strong>
                      <p className="text-gray-900">{selectedOrder.customer.username}</p>
                    </div>
                    <div>
                      <strong className="text-gray-700">Email:</strong>
                      <p className="text-gray-900">{selectedOrder.customer.email}</p>
                    </div>
                    {selectedOrder.customer.phone && (
                      <div>
                        <strong className="text-gray-700">Phone:</strong>
                        <p className="text-gray-900">{selectedOrder.customer.phone}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaShoppingBag className="text-blue-500" />
                  Order Items ({selectedOrder.items.length})
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-all">
                      <img
                        src={`http://localhost:5001/${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-sm"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.name}</h4>
                        <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                        <p className="text-gray-700 font-medium">
                          Rs. {formatPrice(item.price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-600 text-lg">
                          Rs. {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing Summary */}
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200 mb-6">
                <h3 className="font-bold text-blue-900 mb-4 text-lg">Pricing Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-blue-700">Subtotal</span>
                    <span className="font-semibold text-blue-900">Rs. {formatPrice(selectedOrder.subtotal)}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-blue-700">Delivery Charge</span>
                    <span className={selectedOrder.deliveryCharge === 0 ? "text-green-600 font-semibold" : "font-semibold text-blue-900"}>
                      {selectedOrder.deliveryCharge === 0 ? "FREE" : `Rs. ${formatPrice(selectedOrder.deliveryCharge)}`}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 pt-4">
                    <span className="text-lg font-bold text-blue-900">Total Amount</span>
                    <span className="text-xl font-bold text-blue-700">
                      Rs. {formatPrice(selectedOrder.total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => generatePDF(selectedOrder)}
                  disabled={downloadingPdf}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FaDownload />
                  {downloadingPdf ? 'Generating PDF...' : 'Download Invoice PDF'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300"
                >
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

export default OrderHistory;