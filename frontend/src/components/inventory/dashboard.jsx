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
    const interval = setInterval(fetchStocks, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const handlePdfDownload = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Inventory Report", 14, 15);
    autoTable(doc, {
      head: [["Product", "Category", "Quantity", "Reorder Level", "Status"]],
      body: stocks.map((stock) => {
        let status = "In Stock";
        if (stock.quantity === 0) status = "Out of Stock";
        else if (stock.quantity <= stock.reorderLevel) status = "Low Stock";
        return [
          stock.productName,
          stock.category,
          stock.quantity,
          stock.reorderLevel,
          status,
        ];
      }),
    });
    doc.save("Inventory_Report.pdf");
  };

  // Stats
  const totalItems = stocks.reduce((sum, stock) => sum + stock.quantity, 0);
  const outOfStockItems = stocks.filter((s) => s.quantity === 0).length;
  const lowStockItems = stocks.filter(
    (s) => s.quantity > 0 && s.quantity <= s.reorderLevel
  ).length;
  const categories = [...new Set(stocks.map((s) => s.category))];

  // Low Stock Alert list
  const lowStockList = stocks.filter(
    (s) => s.quantity === 0 || s.quantity <= s.reorderLevel
  );

  // Doughnut Chart
  const doughnutData = {
    labels: stocks.map((s) => s.productName),
    datasets: [
      {
        label: "Stock Quantity",
        data: stocks.map((s) => s.quantity),
        backgroundColor: [
          "#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
          "#EC4899", "#06B6D4", "#84CC16", "#F97316", "#6366F1"
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Inventory Dashboard
            </h1>
            <p className="text-gray-500 mt-1">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={handlePdfDownload}
            className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <i className="fas fa-file-pdf text-red-500 mr-2"></i>
            Export PDF
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <StatCard
            title="Total Items"
            value={totalItems}
            icon="fa-boxes"
            color="blue"
          />
          <StatCard
            title="In Stock"
            value={stocks.length - outOfStockItems - lowStockItems}
            icon="fa-check-circle"
            color="green"
          />
          <StatCard
            title="Low Stock"
            value={lowStockItems}
            icon="fa-exclamation-triangle"
            color="yellow"
          />
          <StatCard
            title="Out of Stock"
            value={outOfStockItems}
            icon="fa-times-circle"
            color="red"
          />
        </div>

        {/* Low Stock Alerts */}
        {lowStockList.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <h2 className="text-lg font-semibold text-red-700 mb-3">
              ⚠️ Low Stock Alerts
            </h2>
            <ul className="space-y-2">
              {lowStockList.map((s) => (
                <li
                  key={s._id}
                  className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm border border-gray-100"
                >
                  <span className="font-medium text-gray-800">
                    {s.productName} ({s.category})
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-md font-semibold ${
                      s.quantity === 0
                        ? "bg-red-100 text-red-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {s.quantity === 0
                      ? "Out of Stock"
                      : `Low Stock (${s.quantity})`}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stock Table */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Stock Overview
            </h2>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left border-b border-gray-200">
                      <th className="pb-3 text-sm font-medium text-gray-500">
                        Product
                      </th>
                      <th className="pb-3 text-sm font-medium text-gray-500">
                        Category
                      </th>
                      <th className="pb-3 text-sm font-medium text-gray-500">
                        Quantity
                      </th>
                      <th className="pb-3 text-sm font-medium text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {stocks.map((s) => {
                      let status = "In Stock",
                        color = "bg-green-50 text-green-600",
                        icon = "fa-check-circle";

                      if (s.quantity === 0) {
                        status = "Out of Stock";
                        color = "bg-red-50 text-red-600";
                        icon = "fa-times-circle";
                      } else if (s.quantity <= s.reorderLevel) {
                        status = "Low Stock";
                        color = "bg-yellow-50 text-yellow-600";
                        icon = "fa-exclamation-triangle";
                      }

                      return (
                        <tr
                          key={s._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-4">{s.productName}</td>
                          <td className="py-4 text-gray-500">{s.category}</td>
                          <td className="py-4 font-semibold">{s.quantity}</td>
                          <td className="py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
                            >
                              <i className={`fas ${icon} mr-1`}></i>
                              {status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Charts */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Stock Distribution
              </h2>
              <div className="h-72">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
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

// Small stat card component
const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
    <div className="flex items-center">
      <div
        className={`p-3 rounded-lg bg-${color}-50 text-${color}-500 text-xl`}
      >
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="ml-4">
        <h2 className="text-gray-500 text-sm font-medium">{title}</h2>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  </div>
);

export default InventoryDashboard;
