import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEdit,
  faTrash,
  faFilePdf,
  faBoxOpen,
  faTimes,
  faDownload,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoImg from "../../assets/ReBuyLogo.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";

const StockProducts = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDate, setStartDate] = useState(null); // use Date object
  const [endDate, setEndDate] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/stock");
        setStocks(res.data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch stock products", { position: "top-center" });
      } finally {
        setLoading(false);
      }
    };
    fetchStocks();
  }, []);

  const filteredStocks = stocks.filter((stock) => {
    const matchesCategory = stock.category
      .toLowerCase()
      .includes(categoryFilter.toLowerCase());
    const stockDate = new Date(stock.createdAt);
    const matchesStart = startDate ? stockDate >= startDate : true;
    const matchesEnd = endDate ? stockDate <= endDate : true;
    return matchesCategory && matchesStart && matchesEnd;
  });

  const handleView = (stock) => {
    setSelectedStock(stock);
    setIsModalOpen(true);
  };

  const handleUpdate = (stock) => {
    navigate(`/inventory/update-product/${stock._id}`);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await axios.delete(`http://localhost:5001/api/stock/${id}`);
        setStocks((prev) => prev.filter((s) => s._id !== id));
        toast.success(`"${name}" deleted successfully`, {
          position: "top-center",
        });
      } catch (err) {
        console.error(err);
        toast.error(`Failed to delete "${name}"`, { position: "top-center" });
      }
    }
  };

  // Download single stock as PDF
  const handlePdfDownloadRow = (stock) => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();

    if (logoImg) {
      doc.addImage(logoImg, "PNG", margin, 15, 25, 25);
    }

    doc.setFontSize(16).setTextColor(40, 103, 178);
    doc.text("ReBuy.lk", pageWidth - margin, 20, { align: "right" });

    doc.setFontSize(10).setTextColor(100, 100, 100);
    doc.text("77A, Market Street, Colombo, Sri Lanka", pageWidth - margin, 27, {
      align: "right",
    });
    doc.text("Contact: +94 77 321 4567", pageWidth - margin, 34, {
      align: "right",
    });
    doc.text("Email: rebuy@gmail.com", pageWidth - margin, 41, {
      align: "right",
    });

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, 50, pageWidth - margin, 50);

    doc.setFillColor(245, 247, 250);
    doc.rect(margin, 55, pageWidth - margin * 2, 10, "F");
    doc.setFontSize(14).setTextColor(40, 103, 178);
    doc.text(
      `Stock Details: ${String(stock?.name || "N/A")}`,
      pageWidth / 2,
      62,
      { align: "center" }
    );

    autoTable(doc, {
      startY: 70,
      head: [["Field", "Value"]],
      body: [
        ["Name", String(stock?.name || "N/A")],
        ["Category", String(stock?.category || "N/A")],
        ["Quantity", String(stock?.quantity ?? "0")],
        ["Reorder Level", String(stock?.reorderLevel ?? "0")],
        [
          "Status",
          stock?.quantity === 0
            ? "Out of Stock"
            : stock?.quantity <= (stock?.reorderLevel ?? 0)
            ? "Low Stock"
            : "In Stock",
        ],
        [
          "Created At",
          stock?.createdAt
            ? new Date(stock.createdAt).toLocaleDateString()
            : "N/A",
        ],
        ["Description", String(stock?.description || "N/A")],
      ],
      theme: "grid",
      headStyles: {
        fillColor: [40, 103, 178],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 10,
        cellPadding: 3,
        lineColor: [220, 220, 220],
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      margin: { left: margin, right: margin },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(8).setTextColor(150, 150, 150);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
      margin,
      finalY
    );
    doc.text("Page 1 of 1", pageWidth - margin, finalY, { align: "right" });

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, finalY + 5, pageWidth - margin, finalY + 5);

    const fileName = (stock?.name || "Stock").replace(/\s+/g, "_");
    doc.save(`${fileName}_Stock_Report.pdf`);
  };

  // Download all stocks as PDF
  const handlePdfDownloadTable = () => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();

    if (logoImg) {
      doc.addImage(logoImg, "PNG", margin, 15, 25, 25);
    }

    doc.setFontSize(16).setTextColor(40, 103, 178);
    doc.text("ReBuy.lk", pageWidth - margin, 20, { align: "right" });

    doc.setFontSize(10).setTextColor(100, 100, 100);
    doc.text("77A, Market Street, Colombo, Sri Lanka", pageWidth - margin, 27, {
      align: "right",
    });
    doc.text("Contact: +94 77 321 4567", pageWidth - margin, 34, {
      align: "right",
    });
    doc.text("Email: rebuy@gmail.com", pageWidth - margin, 41, {
      align: "right",
    });

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, 50, pageWidth - margin, 50);

    doc.setFillColor(245, 247, 250);
    doc.rect(margin, 55, pageWidth - margin * 2, 10, "F");
    doc.setFontSize(14).setTextColor(40, 103, 178);
    doc.text("Stock Products Report", pageWidth / 2, 62, { align: "center" });

    const tableData = filteredStocks.map((stock) => [
      String(stock?.name || "N/A"),
      String(stock?.category || "N/A"),
      String(stock?.quantity ?? "0"),
      String(stock?.reorderLevel ?? "0"),
      stock?.quantity === 0
        ? "Out of Stock"
        : stock?.quantity <= (stock?.reorderLevel ?? 0)
        ? "Low Stock"
        : "In Stock",
      stock?.createdAt
        ? new Date(stock.createdAt).toLocaleDateString()
        : "N/A",
    ]);

    autoTable(doc, {
      startY: 70,
      head: [["Name", "Category", "Qty", "Reorder Level", "Status", "Date"]],
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [40, 103, 178],
        textColor: 255,
        fontStyle: "bold",
      },
      styles: {
        fontSize: 9,
        cellPadding: 3,
        lineColor: [220, 220, 220],
      },
      alternateRowStyles: {
        fillColor: [245, 247, 250],
      },
      margin: { left: margin, right: margin },
    });

    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(8).setTextColor(150, 150, 150);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`,
      margin,
      finalY
    );
    doc.text("Page 1 of 1", pageWidth - margin, finalY, { align: "right" });

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, finalY + 5, pageWidth - margin, finalY + 5);

    doc.save("Stock_Products_Report.pdf");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStock(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FontAwesomeIcon
          icon={faBoxOpen}
          className="animate-spin text-4xl text-blue-500 mr-3"
        />
        <p className="ml-4 text-gray-600">Loading stock products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6">
          Stock Products
        </h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <input
              type="text"
              placeholder="Search by Category"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            {/* Start Date */}
            <div className="relative w-full sm:w-auto">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText="Start Date"
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm pointer-events-none"
              />
            </div>

            {/* End Date */}
            <div className="relative w-full sm:w-auto">
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                placeholderText="End Date"
                className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-10"
              />
              <FontAwesomeIcon
                icon={faCalendarAlt}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm pointer-events-none"
              />
            </div>
          </div>

          <button
            onClick={handlePdfDownloadTable}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faDownload} /> Download PDF
          </button>
        </div>

        {/* Table for desktop */}
        <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <th className="px-4 sm:px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold">Category</th>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold">Quantity</th>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold">Reorder Level</th>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-4 sm:px-6 py-3 text-center font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStocks.map((stock) => {
                let statusText = "In Stock";
                let statusClass = "bg-green-100 text-green-800";
                if (stock.quantity === 0) {
                  statusText = "Out of Stock";
                  statusClass = "bg-red-100 text-red-800";
                } else if (stock.quantity <= stock.reorderLevel) {
                  statusText = "Low Stock";
                  statusClass = "bg-yellow-100 text-yellow-800";
                }

                return (
                  <tr key={stock._id} className="hover:bg-blue-50 transition-colors">
                    <td className="px-4 sm:px-6 py-3 font-medium text-gray-900">{stock.name}</td>
                    <td className="px-4 sm:px-6 py-3 text-gray-600">{stock.category}</td>
                    <td className="px-4 sm:px-6 py-3 text-gray-600">{stock.quantity}</td>
                    <td className="px-4 sm:px-6 py-3 text-gray-600">{stock.reorderLevel}</td>
                    <td className="px-4 sm:px-6 py-3">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusClass} whitespace-nowrap`}
                      >
                        {statusText}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3">{new Date(stock.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 sm:px-6 py-3">
                      <div className="flex justify-center space-x-2 sm:space-x-3">
                        <button
                          onClick={() => handleView(stock)}
                          className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button
                          onClick={() => handleUpdate(stock)}
                          className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-green-100"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                          onClick={() => handleDelete(stock._id, stock.name)}
                          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <button
                          onClick={() => handlePdfDownloadRow(stock)}
                          className="text-purple-500 hover:text-purple-700 p-2 rounded-full hover:bg-purple-100"
                        >
                          <FontAwesomeIcon icon={faFilePdf} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Card view for mobile */}
        <div className="md:hidden flex flex-col gap-4">
          {filteredStocks.map((stock) => {
            let statusText = "In Stock";
            let statusClass = "bg-green-100 text-green-800";
            if (stock.quantity === 0) {
              statusText = "Out of Stock";
              statusClass = "bg-red-100 text-red-800";
            } else if (stock.quantity <= stock.reorderLevel) {
              statusText = "Low Stock";
              statusClass = "bg-yellow-100 text-yellow-800";
            }

            return (
              <div key={stock._id} className="bg-white shadow-md rounded-xl p-4 flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-gray-800">{stock.name}</h3>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusClass} whitespace-nowrap`}
                  >
                    {statusText}
                  </span>
                </div>
                <p className="text-gray-600">
                  <span className="font-medium">Category:</span> {stock.category}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Quantity:</span> {stock.quantity}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Reorder Level:</span> {stock.reorderLevel}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(stock.createdAt).toLocaleDateString()}
                </p>
                <div className="flex justify-between mt-2">
                  <button
                    onClick={() => handleView(stock)}
                    className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-blue-100"
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                  <button
                    onClick={() => handleUpdate(stock)}
                    className="text-green-500 hover:text-green-700 p-2 rounded-full hover:bg-green-100"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDelete(stock._id, stock.name)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <button
                    onClick={() => handlePdfDownloadRow(stock)}
                    className="text-purple-500 hover:text-purple-700 p-2 rounded-full hover:bg-purple-100"
                  >
                    <FontAwesomeIcon icon={faFilePdf} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal */}
        {isModalOpen && selectedStock && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full h-full sm:max-w-2xl sm:max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Stock Details</h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">{selectedStock.name}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                    <p className="mt-1 text-lg font-medium text-gray-900">{selectedStock.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Quantity</h3>
                    <p className="mt-1 text-lg font-medium">{selectedStock.quantity}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Reorder Level</h3>
                    <p className="mt-1 text-lg font-medium">{selectedStock.reorderLevel}</p>
                  </div>
                  <div className="md:col-span-2">
                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                    <p className="mt-1 text-gray-700">{selectedStock.description}</p>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 flex justify-end">
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
    </div>
  );
};

export default StockProducts;
