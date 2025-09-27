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
  FaEnvelope
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from '../../assets/ReBuyLogo.png';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
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
      case "transfer_pending": return "Payment Pending";
      case "confirmed": return "Confirmed";
      case "shipped": return "Shipped";
      case "delivered": return "Delivered";
      case "cancelled": return "Cancelled";
      default: return status;
    }
  };

  const formatPrice = (price) =>
    price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || "0.00";

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
      
      // Company logo image 
      doc.addImage(logo, 'PNG', 10, 10, 20, 20); // x, y, width, height
      
      // Company details - moved slightly to the right to accommodate logo
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
      
      // Delivery info
      doc.text(`Delivery Method: ${order.deliveryMethod === "store" ? "Store Pickup" : 
               order.deliveryMethod === "different" ? "Different Address" : "Home Delivery"}`, 15, 90);
      doc.text(`Payment Method: ${order.paymentMethod === "online" ? "Online Payment" : 
               order.paymentMethod === "bank" ? "Bank Transfer" : "Cash on Delivery"}`, 15, 95);
      
      // Order items table
      const tableColumn = ["Item", "Quantity", "Price", "Total"];
      const tableRows = order.items.map(item => [
        item.name.length > 30 ? item.name.substring(0, 30) + '...' : item.name,
        item.quantity.toString(),
        `Rs. ${formatPrice(item.price)}`,
        `Rs. ${formatPrice(item.price * item.quantity)}`
      ]);
      
      autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 105,
        theme: 'grid',
        styles: { 
          fontSize: 8,
          cellPadding: 2,
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
      doc.text(`Subtotal: Rs. ${formatPrice(order.subtotal)}`, 150, finalY, { align: 'right' });
      doc.text(`Delivery Charge: ${order.deliveryCharge === 0 ? "FREE" : `Rs. ${formatPrice(order.deliveryCharge)}`}`, 150, finalY + 5, { align: 'right' });
      
      doc.setFontSize(12);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(59, 130, 246);
      doc.text(`Total Amount: Rs. ${formatPrice(order.total)}`, 150, finalY + 15, { align: 'right' });
      
      // Footer
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text("Thank you for shopping with ReBuy.lk!", 105, 280, { align: 'center' });
      doc.text("This is a computer-generated invoice.", 105, 285, { align: 'center' });
      
      // Save the PDF
      doc.save(`order-${order.orderNumber}.pdf`);
      
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-blue-800 text-lg font-semibold">Loading your orders</p>
          <p className="text-blue-600 text-sm">Fetching your purchase history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
      {/* Header Section with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-8 px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
            <FaHistory className="text-4xl" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Order History</h1>
          <p className="text-blue-100 text-lg mb-4">Track and manage your purchases with ease</p>
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
            <FaStar className="text-yellow-300" />
            <span className="font-semibold">
              {orders.length} order{orders.length !== 1 ? 's' : ''} found
            </span>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="p-8">
        {orders.length === 0 ? (
          <div className="text-center bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-12 border-2 border-dashed border-blue-200">
            <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <FaShoppingBag className="text-blue-400 text-5xl" />
            </div>
            <h2 className="text-3xl font-bold text-blue-900 mb-4">No Orders Yet</h2>
            <p className="text-blue-600 mb-8 text-lg max-w-md mx-auto">
              Your order history is empty. Start your shopping journey and discover amazing products!
            </p>
            <button
              onClick={() => navigate("/productListing")}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl duration-300"
            >
              Start Shopping Adventure
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {orders.map((order, index) => (
              <div 
                key={order._id} 
                className="bg-gradient-to-br from-white to-blue-50 rounded-2xl border-2 border-blue-100 p-6 hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] group"
                style={{
                  animationDelay: `${index * 100}ms`,
                  animation: 'fadeInUp 0.6s ease-out'
                }}
              >
                <style jsx>{`
                  @keyframes fadeInUp {
                    from {
                      opacity: 0;
                      transform: translateY(30px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                `}</style>
                
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                  {/* Order Basic Info - Takes 2 columns */}
                  <div className="lg:col-span-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
                      <div>
                        <h3 className="text-2xl font-bold text-blue-900 group-hover:text-blue-700 transition-colors">
                          Order #{order.orderNumber}
                        </h3>
                        <p className="text-blue-600 text-sm">{formatDate(order.createdAt)}</p>
                      </div>
                      <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 ${getStatusColor(order.status)} flex items-center gap-2 shadow-sm`}>
                        {getStatusIcon(order.status)}
                        {getStatusText(order.status)}
                      </span>
                    </div>

                    {/* Delivery & Payment Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                        {order.deliveryMethod === "store" ? 
                          <FaStore className="text-blue-500 text-lg" /> : 
                          <FaHome className="text-blue-500 text-lg" />
                        }
                        <div>
                          <p className="text-blue-900 font-semibold text-sm">Delivery</p>
                          <p className="text-blue-700 text-sm capitalize">
                            {order.deliveryMethod === "store" ? "Store Pickup" : 
                             order.deliveryMethod === "different" ? "Different Address" : "Home Delivery"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                        {order.paymentMethod === "online" ? 
                          <FaCreditCard className="text-green-500 text-lg" /> : 
                          <FaMoneyBillWave className="text-green-500 text-lg" />
                        }
                        <div>
                          <p className="text-green-900 font-semibold text-sm">Payment</p>
                          <p className="text-green-700 text-sm capitalize">
                            {order.paymentMethod === "online" ? "Online Payment" : 
                             order.paymentMethod === "bank" ? "Bank Transfer" : "Cash on Delivery"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="flex items-center gap-4 p-3 bg-white rounded-xl border border-blue-200 shadow-sm">
                      <div className="flex -space-x-3">
                        {order.items.slice(0, 4).map((item, idx) => (
                          <div key={idx} className="relative">
                            <img
                              src={`http://localhost:5001/${item.image}`}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg border-2 border-white shadow-md"
                              onError={(e) => {
                                e.target.src = 'https://via.placeholder.com/48x48?text=No+Image';
                              }}
                            />
                            {idx === 3 && order.items.length > 4 && (
                              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                                <span className="text-white text-xs font-bold">+{order.items.length - 4}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-blue-900 font-semibold">
                          {order.items.length} item{order.items.length !== 1 ? 's' : ''} purchased
                        </p>
                        <p className="text-blue-600 text-sm">Total value: Rs. {formatPrice(order.total)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm h-full">
                      <h4 className="font-semibold text-blue-900 mb-3 text-center border-b border-blue-100 pb-2">
                        Order Summary
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700 text-sm">Items:</span>
                          <span className="font-semibold text-blue-900 text-sm">Rs. {formatPrice(order.subtotal)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-700 text-sm">Delivery:</span>
                          <span className={order.deliveryCharge === 0 ? "text-green-600 font-semibold text-sm" : "font-semibold text-blue-900 text-sm"}>
                            {order.deliveryCharge === 0 ? "FREE" : `Rs. ${formatPrice(order.deliveryCharge)}`}
                          </span>
                        </div>
                        <div className="border-t border-blue-200 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-blue-900 font-bold">Total:</span>
                            <span className="text-lg font-bold text-blue-700">Rs. {formatPrice(order.total)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="lg:col-span-1 flex flex-col gap-3 justify-center">
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <FaEye className="text-lg" />
                      View Details
                    </button>
                    
                    <button
                      onClick={() => generatePDF(order)}
                      disabled={downloadingPdf}
                      className="group relative overflow-hidden bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {downloadingPdf ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <FaFilePdf className="text-lg" />
                      )}
                      {downloadingPdf ? 'Generating...' : 'Download PDF'}
                    </button>
                  </div>
                </div>

                {/* Status History Timeline */}
                {order.history && order.history.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-blue-200">
                    <h4 className="text-sm font-semibold text-blue-900 mb-3 flex items-center gap-2">
                      <FaHistory className="text-blue-500" />
                      Status Timeline
                    </h4>
                    <div className="flex overflow-x-auto gap-3 pb-2">
                      {order.history.slice().reverse().map((history, idx) => (
                        <div key={idx} className="flex-shrink-0 bg-gradient-to-r from-blue-50 to-cyan-50 px-3 py-2 rounded-lg border border-blue-200 shadow-sm">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${
                              history.status === 'delivered' ? 'bg-green-500' :
                              history.status === 'shipped' ? 'bg-blue-500' :
                              history.status === 'confirmed' ? 'bg-green-400' :
                              history.status === 'cancelled' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}></span>
                            <span className="font-medium text-blue-900 capitalize text-sm">
                              {history.status.replace('_', ' ')}
                            </span>
                          </div>
                          <span className="text-blue-600 text-xs block mt-1">
                            {new Date(history.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Enhanced Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <style jsx>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.9); }
              to { opacity: 1; transform: scale(1); }
            }
            .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
          `}</style>
          
          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideIn">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 rounded-t-3xl">
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

            <div className="p-6">
              {/* Order Header Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <FaShoppingBag className="text-blue-500" />
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

                <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
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

              {/* Order Items */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <FaShoppingBag className="text-blue-500" />
                  Order Items
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 hover:shadow-md transition-all">
                      <img
                        src={`http://localhost:5001/${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-xl border-2 border-white shadow-sm"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/64x64?text=No+Image';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900">{item.name}</h4>
                        <p className="text-blue-600 text-sm">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-blue-900">Rs. {formatPrice(item.price)}</p>
                        <p className="text-blue-600 text-sm">Total: Rs. {formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing and Status History */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-sm">
                  <h3 className="font-semibold text-blue-900 mb-4">Pricing Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-blue-100">
                      <span className="text-blue-700">Subtotal</span>
                      <span className="font-semibold text-blue-900">Rs. {formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-blue-100">
                      <span className="text-blue-700">Delivery Charge</span>
                      <span className={selectedOrder.deliveryCharge === 0 ? "text-green-600 font-semibold" : "font-semibold text-blue-900"}>
                        {selectedOrder.deliveryCharge === 0 ? "FREE" : `Rs. ${formatPrice(selectedOrder.deliveryCharge)}`}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 pt-4">
                      <span className="text-lg font-bold text-blue-900">Total Amount</span>
                      <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Rs. {formatPrice(selectedOrder.total)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-blue-200 shadow-sm">
                  <h3 className="font-semibold text-blue-900 mb-4">Status History</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedOrder.history && selectedOrder.history.slice().reverse().map((history, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded-lg">
                        <span className="font-medium text-blue-900 capitalize text-sm">
                          {history.status.replace('_', ' ')}
                        </span>
                        <span className="text-blue-600 text-xs">
                          {new Date(history.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {selectedOrder.notes && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
                  <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                    <FaEnvelope className="text-yellow-600" />
                    Order Notes
                  </h4>
                  <p className="text-yellow-800">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => generatePDF(selectedOrder)}
                  disabled={downloadingPdf}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <FaDownload />
                  {downloadingPdf ? 'Generating PDF...' : 'Download Invoice PDF'}
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gradient-to-r from-gray-500 to-gray-600 text-white py-3 rounded-xl font-semibold hover:from-gray-600 hover:to-gray-700 transition-all duration-300"
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