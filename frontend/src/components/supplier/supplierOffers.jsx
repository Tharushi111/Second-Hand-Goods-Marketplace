import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaClipboardList,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaUserTie,
  FaBox,
  FaSync,
  FaSearch,
  FaFilter,
  FaFileExport
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SupplierOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const token = localStorage.getItem("adminToken");

  const fetchOffers = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/offer", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffers(res.data.offers);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to load offers. Please check your connection and try again."
      );
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5001/api/offer/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOffers((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: "Approved" } : o))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to approve offer");
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(
        `http://localhost:5001/api/offer/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOffers((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: "Rejected" } : o))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to reject offer");
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchOffers();
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    doc.setFontSize(20).setTextColor(40, 103, 178);
    doc.text("Supplier Offers Report", pageWidth / 2, 30, { align: "center" });

    doc.setFontSize(10).setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 40, {
      align: "center",
    });
    doc.text(`Total Offers: ${filteredOffers.length}`, pageWidth / 2, 50, {
      align: "center",
    });

    // Offers Table
    autoTable(doc, {
      startY: 60,
      head: [["Title", "Supplier", "Price (Rs)", "Quantity", "Status"]],
      body: filteredOffers.map((offer) => [
        offer.title,
        offer.supplierId?.username || "N/A",
        `Rs ${offer.pricePerUnit}`,
        offer.quantityOffered,
        offer.status,
      ]),
      theme: "grid",
      headStyles: { fillColor: [40, 103, 178] },
      margin: { left: margin, right: margin },
    });

    doc.save(
      `supplier_offers_${new Date().toISOString().split("T")[0]}.pdf`
    );
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const filteredOffers = offers.filter((offer) => {
    const matchesSearch =
      offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.supplierId?.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || offer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const StatusBadge = ({ status }) => {
    const statusConfig = {
      Pending: { color: "bg-yellow-100 text-yellow-800", icon: FaClock },
      Approved: { color: "bg-green-100 text-green-800", icon: FaCheckCircle },
      Rejected: { color: "bg-red-100 text-red-800", icon: FaTimesCircle },
    };

    const config = statusConfig[status] || statusConfig.Pending;
    const Icon = config.icon;

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 w-fit ${config.color}`}
      >
        <Icon className="text-xs" />
        {status}
      </span>
    );
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 text-red-600 p-4 rounded-xl max-w-md">
            {error}
          </div>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="p-3 bg-blue-500 rounded-xl mr-4">
                <FaClipboardList className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Supplier Offers Management
                </h1>
                <p className="text-gray-600 mt-1">
                  Review and manage supplier product offers
                </p>
              </div>
            </div>

            <div className="flex items-center text-sm text-gray-500 mt-3">
              <FaClock className="text-gray-400 mr-2" />
              <span>Total offers: {offers.length}</span>
              <span className="mx-2">•</span>
              <span>
                Pending: {offers.filter((o) => o.status === "Pending").length}
              </span>
              <span className="mx-2">•</span>
              <span>
                Approved: {offers.filter((o) => o.status === "Approved").length}
              </span>
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
              <FaSync className={`mr-2 ${refreshing ? "animate-spin" : ""}`} />
              {refreshing ? "Refreshing..." : "Refresh"}
            </motion.button>

            <motion.button
              onClick={generatePDF}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-xl shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all"
            >
              <FaFileExport className="text-white mr-2" />
              Export PDF
            </motion.button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <StatCard
            title="Total Offers"
            value={offers.length}
            icon={FaClipboardList}
            color="blue"
            description="All supplier offers"
          />
          <StatCard
            title="Pending Review"
            value={offers.filter((o) => o.status === "Pending").length}
            icon={FaClock}
            color="yellow"
            description="Awaiting approval"
          />
          <StatCard
            title="Approved"
            value={offers.filter((o) => o.status === "Approved").length}
            icon={FaCheckCircle}
            color="green"
            description="Accepted offers"
          />
        </div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search offers by title or supplier..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <select
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>

              <button className="flex items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all">
                <FaFilter className="mr-2" />
                Filter
              </button>
            </div>
          </div>
        </motion.div>

        {/* Offers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaClipboardList className="text-blue-500 mr-2" />
                Supplier Offers
                <span className="ml-2 bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                  {filteredOffers.length} offers
                </span>
              </h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOffers.map((offer) => (
                  <tr
                    key={offer._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 text-sm">
                          {offer.title}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <FaBox className="mr-1" />
                          Qty: {offer.quantityOffered}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaUserTie className="text-gray-400 mr-2 text-sm" />
                        <span className="text-gray-900">{offer.supplierId?.username || "N/A"}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="font-medium text-gray-900">
                          Rs {offer.pricePerUnit}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={offer.status} />
                    </td>
                    <td className="px-6 py-4">
                      {offer.status === "Pending" ? (
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleApprove(offer._id)}
                            className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition-all"
                          >
                            Approve
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleReject(offer._id)}
                            className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-all"
                          >
                            Reject
                          </motion.button>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">
                          No actions available
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOffers.length === 0 && (
            <div className="text-center py-12">
              <FaClipboardList className="text-gray-300 text-4xl mx-auto mb-3" />
              <p className="text-gray-500">
                No offers found matching your criteria
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// StatCard Component
const StatCard = ({ title, value, icon: Icon, color, description }) => {
  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
    red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" }
  };

  const colors = colorMap[color] || colorMap.blue;

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className={`p-5 rounded-xl border-2 ${colors.border} ${colors.bg} transition-all duration-300 hover:shadow-lg`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-lg ${colors.bg} ${colors.text}`}>
          <Icon className="text-xl" />
        </div>
        <div className="text-2xl font-bold text-gray-800">{value}</div>
      </div>
      
      <h3 className="font-semibold text-gray-700 mb-1">{title}</h3>
      <p className="text-sm text-gray-500">{description}</p>
    </motion.div>
  );
};

export default SupplierOffers;
