import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import toast from "react-hot-toast";
import axios from "axios";
import logo from "../../assets/ReBuyLogo.png";

export default function StockReport() {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reportDate] = useState(new Date());

  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  // Fetch stock data from backend
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:5001/api/admin/auth/stocks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStocks(res.data);
      } catch (err) {
        console.error("Error fetching stocks:", err);
        toast.error("Failed to load stock data", { position: "top-center" });
      } finally {
        setIsLoading(false);
      }
    };
    fetchStocks();
  }, []);

  // Summary calculations
  const totalProducts = stocks.length;
  const totalValue = stocks.reduce((sum, s) => sum + s.quantity * s.unitPrice, 0);
  const inStock = stocks.filter((s) => s.quantity > s.reorderLevel).length;
  const lowStock = stocks.filter((s) => s.quantity > 0 && s.quantity <= s.reorderLevel).length;
  const outOfStock = stocks.filter((s) => s.quantity === 0).length;

  const categorySummary = stocks.reduce((acc, s) => {
    const cat = s.category;
    if (!acc[cat]) acc[cat] = { total: 0, value: 0, items: 0 };
    acc[cat].total += s.quantity;
    acc[cat].value += s.quantity * s.unitPrice;
    acc[cat].items += 1;
    return acc;
  }, {});

  const getStockStatus = (quantity, reorderLevel) => {
    if (quantity === 0) return { text: "Out of Stock", color: "text-red-600", bg: "bg-red-50", border: "border-red-200" };
    if (quantity <= reorderLevel) return { text: "Low Stock", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" };
    return { text: "In Stock", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" };
  };

  // PDF download with company logo and details
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;

    // Blue color palette
    const blueDark = [30, 64, 175];    // Dark blue for headers
    const blueMedium = [59, 130, 246]; // Medium blue for accents
    const blueLight = [219, 234, 254]; // Light blue for backgrounds
    const blueText = [37, 99, 235];    // Blue for text

    // Company details
    const companyDetails = {
      name: "ReBuy.lk",
      address: "77A, Market Street, Colombo, Sri Lanka",
      contact: "+94 77 321 4567",
      email: "rebuy@gmail.com"
    };

    // Add logo image on left side
    doc.addImage(logo, 'PNG', margin, 10, 25, 25);
    
    // Company details on right side
    doc.setFontSize(10);
    doc.setTextColor(...blueDark);
    doc.setFont(undefined, 'bold');
    doc.text(companyDetails.name, pageWidth - margin, 15, { align: "right" });
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'normal');
    doc.text(companyDetails.address, pageWidth - margin, 20, { align: "right" });
    doc.text(`Contact: ${companyDetails.contact}`, pageWidth - margin, 25, { align: "right" });
    doc.text(`Email: ${companyDetails.email}`, pageWidth - margin, 30, { align: "right" });

    // Report title and date in center
    doc.setFontSize(14);
    doc.setTextColor(...blueDark);
    doc.setFont(undefined, 'bold');
    doc.text("STOCK INVENTORY REPORT", pageWidth / 2, 45, { align: "center" });
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'normal');
    doc.text(`Generated: ${reportDate.toLocaleDateString()} ${reportDate.toLocaleTimeString()}`, pageWidth / 2, 50, { align: "center" });

    // Separator line
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, 55, pageWidth - margin, 55);

    // Executive summary with blue accents
    doc.setFontSize(12);
    doc.setTextColor(...blueDark);
    doc.setFont(undefined, 'bold');
    doc.text("EXECUTIVE SUMMARY", margin, 70);
    doc.setFontSize(9);
    doc.setTextColor(...blueText);
    doc.setFont(undefined, 'normal');
    
    const summaryData = [
      [`Total Products: ${totalProducts}`, `Total Inventory Value: Rs.${formatCurrency(totalValue)}`],
      [`Items In Stock: ${inStock}`, `Low Stock Items: ${lowStock}`],
      [`Out of Stock: ${outOfStock}`, `Report Date: ${reportDate.toLocaleDateString()}`],
    ];
    
    let yPos = 80;
    summaryData.forEach((row) => {
      doc.text(row[0], margin, yPos);
      doc.text(row[1], pageWidth / 2, yPos);
      yPos += 6;
    });

    // Category summary table with blue theme
    autoTable(doc, {
      startY: yPos + 10,
      head: [["Category", "Items", "Total Quantity", "Total Value"]],
      body: Object.entries(categorySummary).map(([category, data]) => [
        category,
        data.items.toString(),
        data.total.toString(),
        `Rs.${formatCurrency(data.value)}`,
      ]),
      styles: { 
        fontSize: 8,
        textColor: blueText,
        cellPadding: 2,
      },
      headStyles: { 
        fillColor: blueDark,
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: blueLight,
      },
      margin: { left: margin, right: margin },
      theme: 'grid',
    });

    // Detailed stock table with blue theme
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 10,
      head: [["Name", "Category", "Quantity", "Reorder Level", "Status", "Unit Price", "Total Value"]],
      body: stocks.map((s) => [
        s.name.length > 20 ? s.name.substring(0, 20) + '...' : s.name,
        s.category,
        s.quantity.toString(),
        s.reorderLevel.toString(),
        s.quantity === 0 ? "Out of Stock" : s.quantity <= s.reorderLevel ? "Low Stock" : "In Stock",
        `Rs.${formatCurrency(s.unitPrice)}`,
        `Rs.${formatCurrency(s.quantity * s.unitPrice)}`,
      ]),
      styles: { 
        fontSize: 7,
        textColor: blueText,
        cellPadding: 2,
      },
      headStyles: { 
        fillColor: blueDark,
        textColor: 255,
        fontStyle: 'bold',
        fontSize: 8,
      },
      alternateRowStyles: {
        fillColor: blueLight,
      },
      margin: { left: margin, right: margin },
      theme: 'grid',
      pageBreak: 'auto',
    });

    // Add footer with page numbers
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Page ${i} of ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
      doc.text(
        `Confidential - ${companyDetails.name}`,
        pageWidth - margin,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'right' }
      );
    }

    doc.save(`stock_report_${companyDetails.name}_${reportDate.toISOString().split("T")[0]}.pdf`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        {/* Executive Summary with blue theme */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Executive Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">Total Products</p>
              <p className="text-2xl font-bold text-blue-900">{totalProducts}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
              <p className="text-sm text-blue-800 font-medium">Total Value</p>
              <p className="text-2xl font-bold text-blue-900">Rs.{formatCurrency(totalValue)}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-700 font-medium">Low Stock Items</p>
              <p className="text-2xl font-bold text-blue-900">{lowStock}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg border border-blue-300">
              <p className="text-sm text-blue-800 font-medium">Out of Stock</p>
              <p className="text-2xl font-bold text-blue-900">{outOfStock}</p>
            </div>
          </div>
        </div>

        {/* Category Summary */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Category Summary</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-700">Category</th>
                  <th className="px-4 py-2 text-center font-medium text-gray-700">Items</th>
                  <th className="px-4 py-2 text-center font-medium text-gray-700">Total Quantity</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-700">Total Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(categorySummary).map(([cat, data], i) => (
                  <tr key={cat} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-medium text-gray-900">{cat}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{data.items}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{data.total}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">Rs.{formatCurrency(data.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detailed Stock Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Detailed Stock Listing</h2>
          <span className="text-sm text-gray-600">{stocks.length} items</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Product Name</th>
                <th className="px-4 py-3 text-left font-medium text-gray-700">Category</th>
                <th className="px-4 py-3 text-center font-medium text-gray-700">Quantity</th>
                <th className="px-4 py-3 text-center font-medium text-gray-700">Reorder Level</th>
                <th className="px-4 py-3 text-center font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Unit Price</th>
                <th className="px-4 py-3 text-right font-medium text-gray-700">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock, i) => {
                const status = getStockStatus(stock.quantity, stock.reorderLevel);
                return (
                  <tr key={stock._id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-4 py-3 font-medium text-gray-900">{stock.name}</td>
                    <td className="px-4 py-3 text-gray-700">{stock.category}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{stock.quantity}</td>
                    <td className="px-4 py-3 text-center text-gray-900">{stock.reorderLevel}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color} ${status.border}`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right text-gray-900">Rs.{formatCurrency(stock.unitPrice)}</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      Rs.{formatCurrency(stock.quantity * stock.unitPrice)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Download PDF */}
      <div className="flex justify-center">
        <motion.button
          onClick={handleDownloadPDF}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>Download PDF Report</span>
        </motion.button>
      </div>
    </div>
  );
}