import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEdit,
  faTrash,
  faBox,
  faSpinner,
  faTimes,
  faExclamationTriangle,
  faInfoCircle,
  faCalendarAlt,
  faFilePdf,
  faSearch,
  faFilter,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReorderRequests = () => {
  const [reorders, setReorders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // search & filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null); // now using Date object
  const [endDate, setEndDate] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReorders = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/reorders");
        setReorders(res.data);
      } catch (error) {
        console.error("Error fetching reorder requests:", error);
        toast.error("Failed to fetch reorder requests");
      } finally {
        setLoading(false);
      }
    };
    fetchReorders();
  }, []);

  // filtering logic
  const filteredReorders = reorders.filter((order) => {
    const matchSearch = order.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const created = new Date(order.createdAt);
    const matchStart = startDate ? created >= startDate : true;
    const matchEnd = endDate ? created <= endDate : true;
    return matchSearch && matchStart && matchEnd;
  });

  // actions
  const handleView = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdate = (order) => {
    navigate("/inventory/update-reorder", { state: { order } });
  };

  const handleDelete = async (orderId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
  
    try {
      await axios.delete(`http://localhost:5001/api/reorders/${orderId}`);
      
      // Show toast immediately
      toast.success("deleted successfully");
  
      // Update local state
      setReorders((prev) => prev.filter((r) => r._id !== orderId));
  
      
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete");
    }
  };
  
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrder(null);
  };

  // PDF generator for Reorder Requests
  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Add logo on the left
    doc.addImage("/ReBuyLogo.png", "PNG", margin, 15, 25, 25);

    // Company details aligned to the right
    doc.setFontSize(16).setTextColor(40, 103, 178);
    doc.text("ReBuy.lk", pageWidth - margin, 20, { align: "right" });

    doc.setFontSize(10).setTextColor(100, 100, 100);
    doc.text(
      "77A, Market Street, Colombo, Sri Lanka",
      pageWidth - margin,
      27,
      { align: "right" }
    );
    doc.text("Contact: +94 77 321 4567", pageWidth - margin, 34, {
      align: "right",
    });
    doc.text("Email: rebuy@gmail.com", pageWidth - margin, 41, {
      align: "right",
    });

    // Add a decorative line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, 50, pageWidth - margin, 50);

    // Report title with background
    doc.setFillColor(245, 247, 250);
    doc.rect(margin, 55, pageWidth - margin * 2, 10, "F");
    doc.setFontSize(14).setTextColor(40, 103, 178);
    doc.text("Reorder Requests Report", pageWidth / 2, 62, {
      align: "center",
    });

    // Prepare table data
    const tableData = reorders.map((r) => [
      r._id.substring(0, 8) + "...",
      r.title,
      r.quantity,
      r.category,
      r.priority.charAt(0).toUpperCase() + r.priority.slice(1),
      new Date(r.createdAt).toLocaleDateString(),
    ]);

    // Create the table with improved styling
    autoTable(doc, {
      head: [["ID", "Title", "Quantity", "Category", "Priority", "Created At"]],
      body: tableData,
      startY: 70,
      theme: "grid",
      headStyles: {
        fillColor: [40, 103, 178],
        textColor: 255,
        fontStyle: "bold",
        fontSize: 10,
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [220, 220, 220],
        textColor: [50, 50, 50],
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      margin: { left: margin, right: margin },
      columnStyles: {
        0: { cellWidth: 25 }, 
        1: { cellWidth: "auto" }, 
        2: { cellWidth: 20 }, 
        3: { cellWidth: 25 }, 
        4: { cellWidth: 25 }, 
        5: { cellWidth: 25 }, 
      },
    });

    // Get the final Y position after the table
    const finalY = doc.lastAutoTable.finalY + 10;

    // Add summary information
    const highPriorityCount = reorders.filter((r) => r.priority === "high").length;
    const mediumPriorityCount = reorders.filter((r) => r.priority === "medium").length;
    const lowPriorityCount = reorders.filter((r) => r.priority === "low").length;

    doc.setFontSize(10).setTextColor(40, 103, 178);
    doc.text("Summary", margin, finalY);

    doc.setFontSize(9).setTextColor(80, 80, 80);
    doc.text(`Total Requests: ${reorders.length}`, margin, finalY + 7);
    doc.text(`High Priority: ${highPriorityCount}`, margin + 40, finalY + 7);
    doc.text(`Medium Priority: ${mediumPriorityCount}`, margin + 80, finalY + 7);
    doc.text(`Low Priority: ${lowPriorityCount}`, margin + 120, finalY + 7);

    // Footer with generation date and page info
    doc.setFontSize(8).setTextColor(150, 150, 150);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
      margin,
      pageHeight - 10
    );
    doc.text("Page 1 of 1", pageWidth - margin, pageHeight - 10, {
      align: "right",
    });

    // Save the PDF
    doc.save("Reorder_Requests_Report.pdf");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FontAwesomeIcon
          icon={faSpinner}
          className="animate-spin text-4xl text-blue-500 mr-3"
        />
        <p className="ml-4 text-gray-600">Loading reorder requests...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Title */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Reorder Requests
        </h1>
        <p className="text-gray-600">
          Manage and track all inventory reorder requests
        </p>
      </div>

      {/* Filters + PDF */}
      <div className="mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          {/* Search */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faSearch} className="mr-2" />
              Search by Title
            </label>
            <input
              type="text"
              placeholder="Enter product title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Date filter with react-datepicker */}
          <div className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FontAwesomeIcon icon={faFilter} className="mr-2 text-gray-600" />
              Filter by Date Range
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Start Date */}
              <div className="relative flex-1">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Start Date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="absolute right-3 top-3 text-gray-500"
                />
              </div>

              <span className="self-center text-gray-500 hidden sm:block">
                to
              </span>

              {/* End Date */}
              <div className="relative flex-1">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  placeholderText="End Date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <FontAwesomeIcon
                  icon={faCalendarAlt}
                  className="absolute right-3 top-3 text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* PDF button */}
          <button
            onClick={generatePDF}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center justify-center transition-colors"
          >
            <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
            Export PDF
          </button>
        </div>
      </div>
      {/* Results count */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-gray-600">
          Showing {filteredReorders.length} of {reorders.length} requests
        </p>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-indigo-50">
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Title</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Quantity</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Category</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Priority</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Description</th>
                <th className="px-6 py-4 text-left font-semibold text-gray-700">Created At</th>
                <th className="px-6 py-4 text-center font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredReorders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-blue-50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {order.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                      {order.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-sm">
                      {order.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        order.priority === "High"
                          ? "bg-red-100 text-red-800"
                          : order.priority === "Normal"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={
                          order.priority === "High"
                            ? faExclamationTriangle
                            : faInfoCircle
                        }
                        className="mr-1"
                      />
                      {order.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 max-w-xs text-gray-600 truncate">
                    {order.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex justify-center space-x-3">
                      <button
                        onClick={() => handleView(order)}
                        className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors"
                        title="View details"
                      >
                        <FontAwesomeIcon icon={faEye} />
                      </button>
                      <button
                        onClick={() => handleUpdate(order)}
                        className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-green-100 transition-colors"
                        title="Edit request"
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                      <button
                        onClick={() => handleDelete(order._id, order.title)}
                        className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                        title="Delete request"
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReorders.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="text-gray-300 mb-4">
              <FontAwesomeIcon icon={faBox} className="text-5xl" />
            </div>
            <p className="text-gray-500 text-lg">No reorder requests found</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredReorders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 space-y-2 sm:space-y-0">
              <h3 className="font-semibold text-gray-900 text-base break-words">
                {order.title}
              </h3>
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium self-start ${
                  order.priority === "High"
                    ? "bg-red-100 text-red-800"
                    : order.priority === "Normal"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                <FontAwesomeIcon
                  icon={
                    order.priority === "High" ? faExclamationTriangle : faInfoCircle
                  }
                  className="mr-1"
                />
                {order.priority}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Quantity:</span>
                <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-medium text-xs">
                  {order.quantity}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Category:</span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs">
                  {order.category}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Created:</span>
                <span className="text-sm text-gray-600">
                  <FontAwesomeIcon icon={faCalendarAlt} className="mr-1" />
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3 line-clamp-2 break-words">
              {order.description}
            </p>

            <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => handleView(order)}
                className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100 transition-colors"
                title="View details"
              >
                <FontAwesomeIcon icon={faEye} />
              </button>
              <button
                onClick={() => handleUpdate(order)}
                className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-green-100 transition-colors"
                title="Edit request"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button
                onClick={() => handleDelete(order._id, order.title)}
                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100 transition-colors"
                title="Delete request"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        ))}

        {filteredReorders.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-300 mb-4">
              <FontAwesomeIcon icon={faBox} className="text-4xl" />
            </div>
            <p className="text-gray-500">No reorder requests found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Modal for viewing full details */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Reorder Request Details
                </h2>
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
                  <p className="mt-1 text-lg font-medium text-gray-900">
                    {selectedOrder.title}
                  </p>
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
                  <p
                    className={`mt-1 text-lg font-medium ${
                      selectedOrder.priority === "High"
                        ? "text-red-600"
                        : selectedOrder.priority === "Normal"
                        ? "text-yellow-600"
                        : "text-green-600"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={
                        selectedOrder.priority === "High"
                          ? faExclamationTriangle
                          : faInfoCircle
                      }
                      className="mr-2"
                    />
                    {selectedOrder.priority}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Full Description
                  </h3>
                  <p className="mt-2 p-4 bg-gray-50 rounded-lg text-gray-700">
                    {selectedOrder.description}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">
                    Created At
                  </h3>
                  <p className="mt-1 text-gray-700">
                    <FontAwesomeIcon icon={faCalendarAlt} className="mr-2" />
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors flex items-center"
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