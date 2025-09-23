import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Doughnut, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from "chart.js";
import {
  FaWarehouse,
  FaClock,
  FaFileExport,
  FaBoxes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaBell,
  FaBan,
  FaExclamationCircle,
  FaListOl,
  FaChartPie,
  FaChartBar,
  FaLayerGroup,
  FaSearch,
  FaTag,
  FaCubes,
  FaArrowDown,
  FaInfoCircle,
  FaSync
} from "react-icons/fa";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const InventoryDashboard = () => {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);

  // Fetch stocks data
  const fetchStocks = async () => {
    try {
      const res = await fetch("http://localhost:5001/api/stock");
      const data = await res.json();
      setStocks(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching stock data:", error);
      toast.error("Failed to fetch inventory data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStocks();
    
    // Set up live updates every 30 seconds
    const interval = setInterval(fetchStocks, 30000);
    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const handleRefresh = () => {
    setRefreshing(true);
    fetchStocks();
  };

  // Process data for charts and displays (preserve duplicate categories)
  const processInventoryData = () => {
    const totalItems = stocks.reduce((sum, stock) => sum + stock.quantity, 0);
    
    // Count items by status
    const outOfStockItems = stocks.filter((s) => s.quantity === 0).length;
    const lowStockItems = stocks.filter((s) => s.quantity > 0 && s.quantity <= s.reorderLevel).length;
    const inStockItems = stocks.length - outOfStockItems - lowStockItems;
    
    // Get all categories (including duplicates for accurate representation)
    const allCategories = stocks.map((s) => s.category);
    
    // Group by category for bar chart (include all occurrences)
    const categoryQuantities = {};
    stocks.forEach(stock => {
      categoryQuantities[stock.category] = (categoryQuantities[stock.category] || 0) + stock.quantity;
    });
    
    const lowStockList = stocks.filter((s) => s.quantity === 0 || s.quantity <= s.reorderLevel);
    
    return {
      totalItems,
      outOfStockItems,
      lowStockItems,
      inStockItems,
      allCategories,
      categoryQuantities,
      lowStockList
    };
  };

  const {
    totalItems,
    outOfStockItems,
    lowStockItems,
    inStockItems,
    allCategories,
    categoryQuantities,
    lowStockList
  } = processInventoryData();

  // Generate PDF Report
  const generatePDF = () => {
    const doc = new jsPDF();
    const margin = 15;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header with logo
    try {
      doc.addImage("/ReBuyLogo.png", "PNG", margin, 15, 40, 40);
    } catch (e) {
      // Fallback if logo not found
      doc.setFillColor(240, 240, 240);
      doc.rect(margin, 15, 40, 40, 'F');
      doc.setFontSize(10).setTextColor(150, 150, 150);
      doc.text("ReBuy Logo", margin + 20, 35, { align: "center" });
    }

    // Company info
    doc.setFontSize(16).setTextColor(40, 103, 178);
    doc.text("ReBuy.lk Inventory Report", pageWidth / 2, 30, { align: "center" });
    
    doc.setFontSize(10).setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 40, { align: "center" });
    doc.text(`Total Items Tracked: ${stocks.length}`, pageWidth / 2, 50, { align: "center" });

    let startY = 70;

    // Summary Statistics
    doc.setFontSize(12).setTextColor(40, 40, 40);
    doc.text("Inventory Summary", margin, startY);
    
    autoTable(doc, {
      startY: startY + 10,
      head: [['Metric', 'Count']],
      body: [
        ['Total Items', totalItems],
        ['In Stock Items', inStockItems],
        ['Low Stock Items', lowStockItems],
        ['Out of Stock Items', outOfStockItems],
        ['Total Categories', Object.keys(categoryQuantities).length],
      ],
      theme: 'grid',
      headStyles: { fillColor: [40, 103, 178] },
      margin: { left: margin, right: margin }
    });

    // Detailed Inventory Table
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.text("Detailed Inventory", margin, finalY);
    
    autoTable(doc, {
      startY: finalY + 10,
      head: [['Product Name', 'Category', 'Quantity', 'Reorder Level', 'Status']],
      body: stocks.map(stock => {
        const status = stock.quantity === 0 ? 'Out of Stock' : 
                      stock.quantity <= stock.reorderLevel ? 'Low Stock' : 'In Stock';
        return [
          stock.name,
          stock.category,
          stock.quantity,
          stock.reorderLevel,
          status
        ];
      }),
      theme: 'grid',
      headStyles: { fillColor: [40, 103, 178] },
      margin: { left: margin, right: margin },
      styles: { fontSize: 8 },
      pageBreak: 'auto'
    });

    doc.save(`inventory_report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Chart Data Configurations
  const doughnutData = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      {
        label: "Stock Status",
        data: [inStockItems, lowStockItems, outOfStockItems],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const doughnutOptions = {
    cutout: "65%",
    plugins: { 
      legend: { 
        position: "bottom", 
        labels: { 
          boxWidth: 12, 
          font: { size: 11 },
          padding: 15
        } 
      } 
    },
    maintainAspectRatio: false,
  };

  const barData = {
    labels: Object.keys(categoryQuantities),
    datasets: [{
      label: "Quantity by Category", 
      data: Object.values(categoryQuantities), 
      backgroundColor: [
        "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
        "#06B6D4", "#84CC16", "#F97316", "#EC4899", "#6B7280"
      ],
      borderRadius: 6,
      borderWidth: 1,
      borderColor: "#ffffff"
    }],
  };

  const barOptions = {
    responsive: true,
    plugins: { 
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Quantity: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: { 
      y: { 
        beginAtZero: true, 
        grid: { display: true, color: "rgba(0,0,0,0.1)" },
        title: {
          display: true,
          text: 'Quantity'
        }
      }, 
      x: { 
        grid: { display: false },
        ticks: {
          maxRotation: 45,
          minRotation: 45
        }
      } 
    },
  };

  // Status badge component
  const StatusBadge = ({ quantity, reorderLevel }) => {
    if (quantity === 0) {
      return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">Out of Stock</span>;
    } else if (quantity <= reorderLevel) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Low Stock</span>;
    } else {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">In Stock</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
        >
          <div className="flex-1">
            <div className="flex items-center mb-2">
              <div className="p-3 bg-blue-500 rounded-xl mr-4">
                <FaWarehouse className="text-white text-2xl" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Inventory Dashboard</h1>
                <p className="text-gray-600 mt-1">Real-time inventory monitoring and analytics</p>
              </div>
            </div>
            
            <div className="flex items-center text-sm text-gray-500 mt-3">
              <FaClock className="text-gray-400 mr-2" />
              <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <span className="mx-2">•</span>
              <span>{stocks.length} items tracked</span>
              <span className="mx-2">•</span>
              <span>{Object.keys(categoryQuantities).length} categories</span>
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
              <FaSync className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
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

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <StatCard 
            title="Total Items" 
            value={totalItems.toLocaleString()} 
            icon={FaBoxes} 
            color="blue" 
            loading={loading}
            description="Sum of all inventory quantities"
            trend="total"
          />
          <StatCard 
            title="In Stock" 
            value={inStockItems} 
            icon={FaCheckCircle} 
            color="green" 
            loading={loading}
            description="Adequate stock levels"
            trend="up"
          />
          <StatCard 
            title="Low Stock" 
            value={lowStockItems} 
            icon={FaExclamationTriangle} 
            color="yellow" 
            loading={loading}
            description="Needs reordering soon"
            trend="warning"
          />
          <StatCard 
            title="Out of Stock" 
            value={outOfStockItems} 
            icon={FaTimesCircle} 
            color="red" 
            loading={loading}
            description="Immediate action needed"
            trend="down"
          />
        </div>

        {/* Stock Alerts Section */}
        {lowStockList.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 mb-8 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <div className="flex items-center mb-3 sm:mb-0">
                <div className="p-2 bg-red-100 rounded-lg mr-3">
                  <FaBell className="text-red-500 text-lg animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-red-800">Stock Alerts Requiring Attention</h2>
                  <p className="text-red-600 text-sm">Immediate action recommended for these items</p>
                </div>
              </div>
              <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                {lowStockList.length} alert{lowStockList.length !== 1 ? 's' : ''}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lowStockList.slice(0, 6).map((item) => (
                <motion.div 
                  key={item._id} 
                  whileHover={{ y: -2 }}
                  className="flex justify-between items-center bg-white p-3 rounded-lg border border-red-100 hover:shadow-md transition-all"
                >
                  <div className="flex items-center min-w-0">
                    <div className={`p-2 rounded-full mr-3 ${
                      item.quantity === 0 ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-500'
                    }`}>
                      {item.quantity === 0 ? <FaBan /> : <FaExclamationCircle />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium text-gray-800 truncate">{item.name}</div>
                      <div className="text-xs text-gray-500 flex items-center">
                        <FaTag className="mr-1" />
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-3">
                    <div className={`font-semibold ${
                      item.quantity === 0 ? "text-red-600" : "text-yellow-600"
                    }`}>
                      {item.quantity === 0 ? "Out of Stock" : `${item.quantity} left`}
                    </div>
                    <div className="text-xs text-gray-500">Reorder at: {item.reorderLevel}</div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {lowStockList.length > 6 && (
              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">
                  +{lowStockList.length - 6} more items need attention
                </span>
              </div>
            )}
          </motion.div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Stock Distribution Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="xl:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaChartPie className="text-blue-500 mr-2" /> 
                Stock Distribution
              </h2>
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
            <div className="h-64">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </motion.div>

          {/* Category Quantity Chart */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                <FaChartBar className="text-blue-500 mr-2" /> 
                Inventory by Category
              </h2>
              <span className="text-sm text-gray-500">
                {Object.keys(categoryQuantities).length} categories
              </span>
            </div>
            <div className="h-64">
              <Bar data={barData} options={barOptions} />
            </div>
          </motion.div>
        </div>

        {/* Inventory Table Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center mb-3 sm:mb-0">
                <FaLayerGroup className="text-blue-500 mr-2" /> 
                Full Inventory List
                <span className="ml-2 bg-gray-100 text-gray-600 text-sm px-2 py-1 rounded-full">
                  {stocks.length} items
                </span>
              </h2>
              
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search inventory..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reorder Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stocks.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{item.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <FaTag className="text-gray-400 mr-2 text-sm" />
                        <span className="text-gray-700">{item.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-gray-900">{item.quantity}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{item.reorderLevel}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge quantity={item.quantity} reorderLevel={item.reorderLevel} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {stocks.length === 0 && !loading && (
            <div className="text-center py-12">
              <FaBoxes className="text-gray-300 text-4xl mx-auto mb-3" />
              <p className="text-gray-500">No inventory items found</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Enhanced StatCard Component
const StatCard = ({ title, value, icon: Icon, color, loading, description, trend }) => {
  const colorMap = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
    green: { bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-600", border: "border-yellow-200" },
    red: { bg: "bg-red-50", text: "text-red-600", border: "border-red-200" }
  };

  const trendIcons = {
    up: <FaArrowDown className="text-green-500 transform rotate-180" />,
    down: <FaArrowDown className="text-red-500" />,
    warning: <FaExclamationTriangle className="text-yellow-500" />,
    total: <FaCubes className="text-blue-500" />
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
        <div className="text-2xl font-bold text-gray-800">
          {loading ? (
            <div className="animate-pulse bg-gray-300 h-8 w-16 rounded"></div>
          ) : (
            value
          )}
        </div>
      </div>
      
      <h3 className="font-semibold text-gray-700 mb-1">{title}</h3>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{description}</p>
        {trendIcons[trend]}
      </div>
    </motion.div>
  );
};

export default InventoryDashboard;