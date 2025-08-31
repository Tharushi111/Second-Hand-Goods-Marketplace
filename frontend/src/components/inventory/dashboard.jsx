import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
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

// Register required components
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

  const handlePdfDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Inventory Report", 14, 15);
    autoTable(doc, {
      head: [["Category", "Quantity", "Reorder Level", "Status"]],
      body: stocks.map((stock) => {
        let status = "In Stock";
        if (stock.quantity === 0) status = "Out of Stock";
        else if (stock.quantity <= stock.reorderLevel) status = "Low Stock";
        return [
          stock.category,
          stock.quantity,
          stock.reorderLevel,
          status,
        ];
      }),
    });
    doc.save("Inventory_Report.pdf");
  };

  // Get status details for a stock item
  const getStatusDetails = (stock) => {
    if (stock.quantity === 0) {
      return {
        status: "Out of Stock",
        color: "bg-red-100 text-red-700",
        icon: "fa-times-circle",
        badgeColor: "bg-red-500"
      };
    } else if (stock.quantity <= stock.reorderLevel) {
      return {
        status: "Low Stock",
        color: "bg-yellow-100 text-yellow-700",
        icon: "fa-exclamation-triangle",
        badgeColor: "bg-yellow-500"
      };
    } else {
      return {
        status: "In Stock",
        color: "bg-green-100 text-green-700",
        icon: "fa-check-circle",
        badgeColor: "bg-green-500"
      };
    }
  };

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
        backgroundColor: [
          "#10B981", 
          "#F59E0B", 
          "#EF4444"
        ],
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
              <i className="fas fa-warehouse text-blue-500 mr-3"></i>
              Inventory Dashboard
            </h1>
            <p className="text-gray-500 mt-2 flex items-center">
              <i className="fas fa-clock text-gray-400 mr-2"></i>
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
          <button
            onClick={handlePdfDownload}
            className="flex items-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-3 rounded-xl shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 mt-4 md:mt-0 group"
          >
            <i className="fas fa-file-export text-white mr-2 group-hover:animate-bounce"></i>
            Export PDF Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Items"
            value={totalItems}
            icon="fas fa-boxes"
            color="blue"
            loading={loading}
            description="All inventory items"
          />
          <StatCard
            title="In Stock"
            value={inStockItems}
            icon="fas fa-check-circle"
            color="green"
            loading={loading}
            description="Adequate stock levels"
          />
          <StatCard
            title="Low Stock"
            value={lowStockItems}
            icon="fas fa-exclamation-triangle"
            color="yellow"
            loading={loading}
            description="Needs reordering soon"
          />
          <StatCard
            title="Out of Stock"
            value={outOfStockItems}
            icon="fas fa-times-circle"
            color="red"
            loading={loading}
            description="Immediate action needed"
          />
        </div>

        {/* Low Stock Alerts */}
        {lowStockList.length > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-2xl p-6 mb-8 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-red-700 flex items-center">
                <i className="fas fa-bell text-red-500 mr-3 text-xl animate-pulse"></i>
                Stock Alerts Requiring Attention
              </h2>
              <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                {lowStockList.length} alert{lowStockList.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lowStockList.map((s) => (
                <div
                  key={s._id}
                  className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                >
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full mr-4 ${s.quantity === 0 ? 'bg-red-100 text-red-500' : 'bg-yellow-100 text-yellow-500'}`}>
                      <i className={`fas ${s.quantity === 0 ? 'fa-ban text-lg' : 'fa-exclamation-circle text-lg'}`}></i>
                    </div>
                    <div>
                      <span className="font-medium text-gray-800 block">{s.category}</span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <i className="fas fa-list-ol mr-1"></i>
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
                    <i className={`fas ${s.quantity === 0 ? 'fa-times mr-1' : 'fa-exclamation mr-1'}`}></i>
                    {s.quantity === 0
                      ? "Out of Stock"
                      : `${s.quantity} remaining`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inventory Cards */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <i className="fas fa-boxes text-blue-500 mr-3"></i>
                Inventory Overview
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
                <i className="fas fa-search fa-3x text-gray-300 mb-4"></i>
                <h3 className="text-lg font-medium text-gray-700">No inventory items found</h3>
                <p className="text-gray-500 mt-1">Inventory will appear here when added</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {stocks.map((stock) => {
                  const statusDetails = getStatusDetails(stock);
                  const progressPercentage = Math.min(100, (stock.quantity / (stock.reorderLevel * 2)) * 100);
                  
                  return (
                    <div key={stock._id} className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-all duration-200">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center">
                          <div className={`p-3 rounded-xl ${statusDetails.color} bg-opacity-20 mr-3`}>
                            <i className={`fas fa-tag ${statusDetails.color.split(' ')[1]}`}></i>
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-800">{stock.category}</h3>
                            <span className="text-xs text-gray-500 flex items-center mt-1">
                              <i className="fas fa-list-ol mr-1"></i>
                              Reorder at: {stock.reorderLevel}
                            </span>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded-full ${statusDetails.color} flex items-center`}>
                          <i className={`fas ${statusDetails.icon} mr-1`}></i>
                          {statusDetails.status}
                        </span>
                      </div>
                      
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm text-gray-600 flex items-center">
                            <i className="fas fa-boxes mr-2"></i>
                            Current Stock
                          </span>
                          <span className="font-semibold">{stock.quantity} units</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${statusDetails.badgeColor}`}
                            style={{ width: `${progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <i className="fas fa-info-circle mr-1"></i>
                        {stock.quantity === 0 ? (
                          <span className="text-red-500">Immediate restocking required</span>
                        ) : stock.quantity <= stock.reorderLevel ? (
                          <span className="text-yellow-600">Needs to be reordered soon</span>
                        ) : (
                          <span className="text-green-600">Stock level is adequate</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Charts */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <i className="fas fa-chart-pie text-blue-500 mr-3"></i>
                Stock Status Distribution
              </h2>
              <div className="h-72">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">In Stock</span>
                  </div>
                  <span className="text-lg font-bold text-green-700">{inStockItems}</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Low Stock</span>
                  </div>
                  <span className="text-lg font-bold text-yellow-700">{lowStockItems}</span>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <span className="text-sm font-medium">Out of Stock</span>
                  </div>
                  <span className="text-lg font-bold text-red-700">{outOfStockItems}</span>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <i className="fas fa-chart-bar text-blue-500 mr-3"></i>
                Inventory by Category
              </h2>
              <div className="h-72">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Enhanced StatCard component
const StatCard = ({ title, value, icon, color, loading, description }) => {
  const colorMap = {
    blue: { 
      bg: "bg-blue-100", 
      text: "text-blue-500", 
      value: "text-blue-700",
      gradient: "from-blue-500 to-blue-600",
      light: "bg-blue-50"
    },
    green: { 
      bg: "bg-green-100", 
      text: "text-green-500", 
      value: "text-green-700",
      gradient: "from-green-500 to-green-600",
      light: "bg-green-50"
    },
    yellow: { 
      bg: "bg-yellow-100", 
      text: "text-yellow-500", 
      value: "text-yellow-700",
      gradient: "from-yellow-500 to-yellow-600",
      light: "bg-yellow-50"
    },
    red: { 
      bg: "bg-red-100", 
      text: "text-red-500", 
      value: "text-red-700",
      gradient: "from-red-500 to-red-600",
      light: "bg-red-50"
    }
  };

  return (
    <div className={`bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-1 ${colorMap[color].light}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-gray-500 text-sm font-medium mb-2 flex items-center">
            <i className={`${icon} ${colorMap[color].text} mr-2`}></i>
            {title}
          </h2>
          {loading ? (
            <div className="h-9 w-16 bg-gray-200 rounded-lg animate-pulse mt-1"></div>
          ) : (
            <p className={`text-3xl font-bold ${colorMap[color].value}`}>{value}</p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color].bg}`}>
          <i className={`${icon} text-xl ${colorMap[color].text}`}></i>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-3">{description}</p>
      <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${colorMap[color].gradient}`}
          style={{ width: `${Math.min(100, (value / 50) * 100)}%` }}
        ></div>
      </div>
    </div>
  );
};

export default InventoryDashboard;