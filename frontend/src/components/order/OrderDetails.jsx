import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Package, 
  CreditCard, 
  CheckCircle,
  Calendar,
  DollarSign,
  ShoppingCart,
  Home,
  MapPin,
  Phone
} from "lucide-react";

const API_BASE_URL = "http://localhost:5001";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("adminToken");

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Rs. 0.00';
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
    }).format(price).replace('LKR', 'Rs.');
  };

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrder(res.data);
    } catch (err) {
      console.error("Failed to fetch order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
            <ShoppingCart className="text-red-400" size={40} />
          </div>
          <p className="text-gray-800 text-lg font-medium mb-2">Order not found</p>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:text-blue-800 transition-colors"
          >
            Go back to orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Back to Orders</span>
          </button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <h2 className="text-2xl font-semibold text-gray-700">Order Details</h2>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">{order.orderNumber}</div>
              <div className="text-sm text-gray-500">Order Reference</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Customer Information */}
          <div className="xl:col-span-1 space-y-6">
            {/* Customer Information Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <User className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Customer Information</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                  <User className="text-blue-600" size={20} />
                  <div>
                    <div className="font-semibold text-gray-900">{order.customer.username}</div>
                    <div className="text-sm text-gray-600">Username</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                  <Mail className="text-blue-600" size={20} />
                  <div>
                    <div className="font-semibold text-gray-900">{order.customer.email}</div>
                    <div className="text-sm text-gray-600">Email Address</div>
                  </div>
                </div>

                {order.customer.phone && (
                  <div className="flex items-center gap-4 p-3 bg-blue-50 rounded-lg">
                    <Phone className="text-blue-600" size={20} />
                    <div>
                      <div className="font-semibold text-gray-900">{order.customer.phone}</div>
                      <div className="text-sm text-gray-600">Phone Number</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <MapPin className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Delivery Information</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Home className="text-gray-400" size={18} />
                  <span className="text-gray-700">{order.address?.line1 || 'N/A'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="text-gray-400" size={18} />
                  <span className="text-gray-700">
                    {order.address?.city || 'N/A'}, {order.address?.postalCode || 'N/A'}
                  </span>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                  <div className="font-medium text-green-800">
                    {order.deliveryMethod === 'store' ? 'Store Pickup' : 
                     order.deliveryMethod === 'home' ? 'Home Delivery' : 
                     'Different Address'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Details */}
          <div className="xl:col-span-2 space-y-6">
            {/* Order Items Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Package className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Order Items</h3>
              </div>
              
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <img
                      src={`${API_BASE_URL}/${item.image}`}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover border-2 border-white shadow-sm"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0iI0YzRjRGNiIvPgo8cGF0aCBkPSJNMzIgNDBMMjQgNDhINDBMMzIgNDBaIiBmaWxsPSIjOEU5MEEwIi8+Cjx0ZXh0IHg9IjMyIiB5PSIzMCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzhFOTBBMCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIj5JbWFnZTwvdGV4dD4KPC9zdmc+";
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-lg">{item.name}</div>
                      <div className="text-gray-600 mt-1">Quantity: {item.quantity}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <DollarSign size={16} className="text-green-600" />
                        <span className="font-medium text-gray-900">
                          {formatPrice(item.price)} × {item.quantity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment & Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <CreditCard className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Payment & Status</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Payment Method</div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <CreditCard className="text-blue-600" size={20} />
                      <span className="font-semibold text-blue-700">
                        {order.paymentMethod === 'online' ? 'Online Payment' : 'Bank Transfer'}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-600 mb-2">Order Status</div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <CheckCircle className="text-green-600" size={20} />
                      <span className="font-semibold text-green-700 capitalize">
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-6 text-white">
                  <div className="text-sm opacity-90 mb-1">Total Amount</div>
                  <div className="text-3xl font-bold mb-4">{formatPrice(order.total)}</div>
                  
                  <div className="flex items-center gap-2 text-sm opacity-90">
                    <Calendar size={16} />
                    <span>
                      Order placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Active Windows Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Active Windows</h3>
          <div className="text-gray-600">
            <p>Check out the following instructions:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Review order details carefully</li>
              <li>Update order status as needed</li>
              <li>Contact customer if required</li>
              <li>Process payment verification</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}