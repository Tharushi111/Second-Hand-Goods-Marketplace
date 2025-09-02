import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export default function StockReport() {
  const [stocks, setStocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetch("http://localhost:5001/api/stock")
      .then((res) => res.json())
      .then((data) => {
        setStocks(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stock data:", err);
        setIsLoading(false);
      });
  }, []);

  // Summary calculations
  const totalProducts = stocks.length;
  const inStock = stocks.filter((s) => s.quantity > 10).length;
  const lowStock = stocks.filter((s) => s.quantity > 0 && s.quantity <= 10).length;
  const outOfStock = stocks.filter((s) => s.quantity === 0).length;

  const categoryTotals = stocks.reduce((acc, s) => {
    const cat = s.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + s.quantity;
    return acc;
  }, {});
// Export PDF
const handleDownloadPDF = () => {
  const doc = new jsPDF();
  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let currentY = 40;

  // Add logo on the left
  try {
    doc.addImage("/ReBuyLogo.png", "PNG", margin, 15, 30, 30);
  } catch (e) {
    console.log("Logo not found, proceeding without it");
  }

  // Company details on the right
  doc.setFontSize(16).setTextColor(40, 103, 178);
  doc.text("ReBuy.lk", pageWidth - margin, 20, { align: "right" });
  
  doc.setFontSize(10).setTextColor(100, 100, 100);
  doc.text("123 Main Street, Colombo, Sri Lanka", pageWidth - margin, 27, { align: "right" });
  doc.text("Contact: +94 77 123 4567", pageWidth - margin, 34, { align: "right" });
  doc.text("Email: info@rebuy.lk", pageWidth - margin, 41, { align: "right" });

  // Add a decorative line separator
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, 50, pageWidth - margin, 50);

  // Report title
  doc.setFontSize(18).setTextColor(40, 40, 40);
  doc.setFont(undefined, "bold");
  doc.text("Stock Summary Report", pageWidth / 2, 65, { align: "center" });
  
  doc.setFontSize(12).setFont(undefined, "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, pageWidth / 2, 75, { align: "center" });

  // First table - Stock Metrics
  autoTable(doc, {
    startY: 85,
    head: [["Metric", "Value"]],
    body: [
      ["Total Products", totalProducts],
      ["In Stock (>10)", inStock],
      ["Low Stock (1-10)", lowStock],
      ["Out of Stock", outOfStock],
    ],
    theme: "grid",
    headStyles: {
      fillColor: [40, 103, 178],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 11,
      cellPadding: 4,
      lineColor: [220, 220, 220]
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    },
    margin: { left: margin, right: margin },
    didDrawPage: function(data) {
      // Add a title above the table
      doc.setFontSize(14).setTextColor(40, 103, 178);
      doc.text("Stock Overview", margin, 80);
    }
  });

  // Second table - Category Totals
  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 20,
    head: [["Category", "Total Units"]],
    body: Object.entries(categoryTotals).map(([cat, qty]) => [cat, qty]),
    theme: "grid",
    headStyles: {
      fillColor: [40, 103, 178],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 11,
      cellPadding: 4,
      lineColor: [220, 220, 220]
    },
    alternateRowStyles: {
      fillColor: [245, 247, 250]
    },
    margin: { left: margin, right: margin },
    didDrawPage: function(data) {
      // Add a title above the table
      doc.setFontSize(14).setTextColor(40, 103, 178);
      doc.text("Inventory by Category", margin, doc.lastAutoTable.finalY + 10);
    }
  });

  // Add summary statistics at the bottom with adequate spacing
  const finalY = doc.lastAutoTable.finalY + 30; // Increased spacing here
  
  if (finalY < pageHeight - 80) { // Increased minimum space requirement
    doc.setFontSize(12).setTextColor(40, 103, 178);
    doc.text("Quick Summary", margin, finalY);
    
    doc.setFontSize(10).setTextColor(80, 80, 80);
    const inStockPercent = ((inStock / totalProducts) * 100).toFixed(1);
    const lowStockPercent = ((lowStock / totalProducts) * 100).toFixed(1);
    const outOfStockPercent = ((outOfStock / totalProducts) * 100).toFixed(1);
    
    doc.text(`In Stock: ${inStock} (${inStockPercent}%)`, margin + 5, finalY + 15);
    doc.text(`Low Stock: ${lowStock} (${lowStockPercent}%)`, margin + 5, finalY + 30);
    doc.text(`Out of Stock: ${outOfStock} (${outOfStockPercent}%)`, margin + 5, finalY + 45);
    
    // Add decorative line above footer with more spacing
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, finalY + 60, pageWidth - margin, finalY + 60);
    
    // Footer with increased spacing from content
    doc.setFontSize(8).setTextColor(150, 150, 150);
    doc.text(`Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 
             margin, finalY + 75);
    doc.text("Page 1 of 1", pageWidth - margin, finalY + 75, { align: "right" });
  } else {
    // If there's not enough space, add a new page for the summary and footer
    doc.addPage();
    
    // Summary on new page
    doc.setFontSize(12).setTextColor(40, 103, 178);
    doc.text("Quick Summary", margin, 40);
    
    doc.setFontSize(10).setTextColor(80, 80, 80);
    const inStockPercent = ((inStock / totalProducts) * 100).toFixed(1);
    const lowStockPercent = ((lowStock / totalProducts) * 100).toFixed(1);
    const outOfStockPercent = ((outOfStock / totalProducts) * 100).toFixed(1);
    
    doc.text(`In Stock: ${inStock} (${inStockPercent}%)`, margin + 5, 55);
    doc.text(`Low Stock: ${lowStock} (${lowStockPercent}%)`, margin + 5, 70);
    doc.text(`Out of Stock: ${outOfStock} (${outOfStockPercent}%)`, margin + 5, 85);
    
    // Add decorative line above footer
    doc.setDrawColor(200, 200, 200);
    doc.line(margin, 100, pageWidth - margin, 100);
    
    // Footer with proper spacing
    doc.setFontSize(8).setTextColor(150, 150, 150);
    doc.text(`Report generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 
             margin, 115);
    doc.text("Page 2 of 2", pageWidth - margin, 115, { align: "right" });
  }

  doc.save("stock_summary_report.pdf");
};
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  const cardHover = {
    scale: 1.02,
    transition: { duration: 0.2 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      {/* Header */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-slate-800 mb-3">
          Stock Summary Dashboard
        </h1>
        <p className="text-slate-600 text-lg">Comprehensive overview of inventory status</p>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-600">Total Products</h2>
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-indigo-600">{totalProducts}</p>
              <div className="mt-2 h-1 w-16 bg-indigo-200 rounded-full"></div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-600">In Stock</h2>
                <div className="p-2 bg-green-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-green-600">{inStock}</p>
              <div className="mt-2 h-1 w-16 bg-green-200 rounded-full"></div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-600">Low Stock</h2>
                <div className="p-2 bg-amber-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-amber-600">{lowStock}</p>
              <div className="mt-2 h-1 w-16 bg-amber-200 rounded-full"></div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={cardHover}
              className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-600">Out of Stock</h2>
                <div className="p-2 bg-red-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              </div>
              <p className="text-3xl font-bold text-red-600">{outOfStock}</p>
              <div className="mt-2 h-1 w-16 bg-red-200 rounded-full"></div>
            </motion.div>
          </motion.div>

          {/* Category Totals */}
          <motion.div
            className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-10"
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <h2 className="text-xl font-semibold text-slate-800 mb-6 pb-3 border-b border-slate-100 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Stock by Category
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(categoryTotals).map(([cat, qty], i) => (
                <motion.div
                  key={i}
                  className="flex justify-between items-center p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200"
                  whileHover={{ x: 5 }}
                >
                  <span className="font-medium text-slate-700">{cat}</span>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-semibold">
                    {qty} units
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Export Button */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.button
              onClick={handleDownloadPDF}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center mx-auto"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(99, 102, 241, 0.4)" }}
              whileTap={{ scale: 0.95 }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download PDF Report
            </motion.button>
          </motion.div>
        </>
      )}
    </div>
  );
}