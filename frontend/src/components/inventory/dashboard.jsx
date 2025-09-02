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
  FaInfoCircle
} from "react-icons/fa";

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

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const res = await fetch("http://localhost:5001/api/stock");
        const data = await res.json();
        setStocks(data);
        setLastUpdated(new Date());
        setLoading(false);
      } catch (error) {
        console.error("Error fetching stock data:", error);
        setLoading(false);
      }
    };

    fetchStocks();
    const interval = setInterval(fetchStocks, 10000);
    return () => clearInterval(interval);
  }, []);

  // Stats
  const totalItems = stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  const outOfStockItems = stocks.filter((s) => s.quantity === 0).length;
  const lowStockItems = stocks.filter(
    (s) => s.quantity > 0 && s.quantity <= s.reorderLevel
  ).length;
  const inStockItems = stocks.length - outOfStockItems - lowStockItems;
  const categories = [...new Set(stocks.map((s) => s.category))];

  // Low Stock Alert list
  const lowStockList = stocks.filter(
    (s) => s.quantity === 0 || s.quantity <= s.reorderLevel
  );

  // Doughnut Chart
  const doughnutData = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      {
        label: "Stock Status",
        data: [inStockItems, lowStockItems, outOfStockItems],
        backgroundColor: ["#10B981", "#F59E0B", "#EF4444"],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "70%",
    plugins: {
      legend: {
        position: "right",
        labels: { boxWidth: 12, font: { size: 10 } },
      },
    },
    maintainAspectRatio: false,
  };

  // Bar Chart (by category)
  const categoryData = categories.map((cat) =>
    stocks.filter((s) => s.category === cat)
      .reduce((sum, s) => sum + s.quantity, 0)
  );

  const barData = {
    labels: categories,
    datasets: [
      {
        label: "Quantity by Category",
        data: categoryData,
        backgroundColor: "#3B82F6",
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, grid: { display: false } },
      x: { grid: { display: false } },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-6 bg-white rounded-2xl shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FaWarehouse className="text-blue-500 mr-3" />
              Inventory Dashboard
            </h1>
            <p className="text-gray-500 mt-2 flex items-center">
              <FaClock className="text-gray-400 mr-2" />
              Last updated: {lastUpdated.toLocaleTimeString()}
              {!loading && (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <span className="flex h-2 w-2 relative mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  Live Updates
                </span>
              )}
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-xl shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 mt-4 md:mt-0 group"
          >
            <FaFileExport className="text-white mr-2 group-hover:animate-bounce" />
            Export PDF Report
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Items"
            value={totalItems}
            icon={FaBoxes}
            color="blue"
            loading={loading}
            description="All inventory items"
          />
          <StatCard
            title="In Stock"
            value={inStockItems}
            icon={FaCheckCircle}
            color="green"
            loading={loading}
            description="Adequate stock levels"
          />
          <StatCard
            title="Low Stock"
            value={lowStockItems}
            icon={FaExclamationTriangle}
            color="yellow"
            loading={loading}
            description="Needs reordering soon"
          />
          <StatCard
            title="Out of Stock"
            value={outOfStockItems}
            icon={FaTimesCircle}
            color="red"
            loading={loading}
            description="Immediate action needed"
          />
        </div>

        {/* Low Stock Alerts */}
        {lowStockList.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 mb-8 shadow-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-red-700 flex items-center">
                <FaBell className="text-red-500 mr-3 text-xl animate-pulse" />
                Stock Alerts Requiring Attention
              </h2>
              <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                {lowStockList.length} alert{lowStockList.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lowStockList.map((s) => (
                <motion.div
                  key={s._id}
                  whileHover={{ y: -5 }}
                  className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full mr-4 ${s.quantity === 0 ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-500'}`}>
                      {s.quantity === 0 ? 
                        <FaBan className="text-lg" /> : 
                        <FaExclamationCircle className="text-lg" />
                      }
                    </div>
                    <div>
                      <span className="font-medium text-gray-800 block">{s.category}</span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <FaListOl className="mr-1" />
                        Reorder at: {s.reorderLevel}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-2 text-sm rounded-full font-semibold flex items-center ${
                      s.quantity === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {s.quantity === 0 ? 
                      <FaTimesCircle className="mr-1" /> : 
                      <FaExclamationTriangle className="mr-1" />
                    }
                    {s.quantity === 0
                      ? "Out of Stock"
                      : `${s.quantity} remaining`}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Doughnut Chart */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaChartPie className="text-blue-500 mr-3" />
              Stock Status Distribution
            </h2>
            <div className="h-72">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </motion.div>

          {/* Bar Chart */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaChartBar className="text-blue-500 mr-3" />
              Inventory by Category
            </h2>
            <div className="h-72">
              <Bar data={barData} options={barOptions} />
            </div>
          </motion.div>
        </div>

        {/* Inventory List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-md border border-gray-100"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              <FaLayerGroup className="text-blue-500 mr-3" />
              All Inventory Items
              <span className="ml-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {stocks.length} items
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : stocks.length === 0 ? (
            <div className="text-center py-12">
              <FaSearch className="text-3xl text-gray-300 mb-4 mx-auto" />
              <h3 className="text-lg font-medium text-gray-700">No inventory items found</h3>
              <p className="text-gray-500 mt-1">Inventory will appear here when added</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FaTag className="inline mr-2" />Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FaCubes className="inline mr-2" />Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FaArrowDown className="inline mr-2" />Reorder Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <FaInfoCircle className="inline mr-2" />Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stocks.map((stock) => {
                    let statusColor = "bg-green-100 text-green-800";
                    let StatusIcon = FaCheckCircle;
                    let statusText = "In Stock";

                    if (stock.quantity === 0) {
                      statusColor = "bg-red-100 text-red-800";
                      StatusIcon = FaTimesCircle;
                      statusText = "Out of Stock";
                    } else if (stock.quantity <= stock.reorderLevel) {
                      statusColor = "bg-yellow-100 text-yellow-800";
                      StatusIcon = FaExclamationTriangle;
                      statusText = "Low Stock";
                    }

                    return (
                      <tr key={stock._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FaTag className="text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{stock.category}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{stock.quantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stock.reorderLevel}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColor}`}>
                            <StatusIcon className="mr-1" /> {statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// StatCard component
const StatCard = ({ title, value, icon: Icon, color, loading, description }) => {
  const colorMap = {
    blue: { bg: "bg-blue-100", text: "text-blue-500", value: "text-blue-700", gradient: "from-blue-500 to-blue-600", light: "bg-blue-50" },
    green: { bg: "bg-green-100", text: "text-green-500", value: "text-green-700", gradient: "from-green-500 to-green-600", light: "bg-green-50" },
    yellow: { bg: "bg-yellow-100", text: "text-yellow-500", value: "text-yellow-700", gradient: "from-yellow-500 to-yellow-600", light: "bg-yellow-50" },
    red: { bg: "bg-red-100", text: "text-red-500", value: "text-red-700", gradient: "from-red-500 to-red-600", light: "bg-red-50" }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }} className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 ${colorMap[color].light}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-gray-500 text-sm font-medium mb-2 flex items-center">
            <Icon className={`${colorMap[color].text} mr-2`} />
            {title}
          </h2>
          {loading ? <div className="h-9 w-16 bg-gray-200 rounded-lg animate-pulse mt-1"></div> : <p className={`text-3xl font-bold ${colorMap[color].value}`}>{value}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color].bg}`}>
          <Icon className={`text-xl ${colorMap[color].text}`} />
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-3">{description}</p>
      <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${colorMap[color].gradient}`} style={{ width: `${Math.min(100, (value / 50) * 100)}%` }}></div>
      </div>
    </motion.div>
  );
};

export default InventoryDashboard;

