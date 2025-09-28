import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Doughnut, Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Filler
} from "chart.js";
import {
  FaMoneyBillWave,
  FaPiggyBank,
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaFileExport,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaExchangeAlt,
  FaWallet,
  FaCreditCard,
  FaShoppingCart,
  FaUniversity,
  FaHandHoldingUsd,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimesCircle,
  FaBell,
  FaSearch,
  FaTag,
  FaInfoCircle,
  FaCalendarAlt,
  FaFilter
} from "react-icons/fa";
import jsPDF from "jspdf";

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Filler
);

export default function FinancePage() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ type: "Expense", amount: "", description: "", category: "General" });
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [timeFilter, setTimeFilter] = useState("month");

  // Fetch entries
  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const res = await axios.get("http://localhost:5001/api/finance");
        setEntries(res.data);
        setLastUpdated(new Date());
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchEntries();
    const interval = setInterval(fetchEntries, 30000);
    return () => clearInterval(interval);
  }, []);

  // Add entry
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5001/api/finance", {
        ...form,
        amount: parseFloat(form.amount),
        date: new Date().toISOString()
      });
      setEntries([res.data.entry, ...entries]);
      setForm({ type: "Expense", amount: "", description: "", category: "General" });
    } catch (err) {
      console.error(err);
    }
  };

  // Calculate statistics
  const balance = entries.reduce((acc, item) => {
    return item.type === "Income" ? acc + parseFloat(item.amount) : acc - parseFloat(item.amount);
  }, 0);

  const totalIncome = entries
    .filter(item => item.type === "Income")
    .reduce((acc, item) => acc + parseFloat(item.amount), 0);

  const totalExpenses = entries
    .filter(item => item.type === "Expense")
    .reduce((acc, item) => acc + parseFloat(item.amount), 0);

  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100) : 0;

  // Categories
  const categories = ["Salary", "Freelance", "Investment", "Shopping", "Food", "Transport", "Entertainment", "Bills", "General"];
  const incomeEntries = entries.filter(e => e.type === "Income");
  const expenseEntries = entries.filter(e => e.type === "Expense");

  // Generate PDF Report
const generatePDF = async () => {
  const doc = new jsPDF("p", "pt", "a4");
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 40;

  // === HEADER WITH LOGO and COMPANY DETAILS
  try {
    const logo = await fetch("/ReBuyLogo.png")
      .then(res => res.blob())
      .then(blob => {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      });

    // Logo on the left
    doc.addImage(logo, "PNG", margin, currentY, 70, 70);

    // Company details on the top right corner
    const companyX = pageWidth - margin; // starting from right margin
    doc.setFontSize(18).setTextColor(40, 103, 178).setFont(undefined, "bold");
    doc.text("ReBuy.lk", companyX, currentY + 20, { align: "right" });

    doc.setFontSize(10).setTextColor(80, 80, 80).setFont(undefined, "normal");
    doc.text("77A, Market Street, Colombo, Sri Lanka", companyX, currentY + 40, { align: "right" });
    doc.text("Contact: +94 77 321 4567", companyX, currentY + 55, { align: "right" });
    doc.text("Email: rebuy@gmail.com", companyX, currentY + 70, { align: "right" });
  } catch (error) {
    console.error("Error loading logo:", error);
  }

  currentY += 90;

  // === REPORT TITLE & DATE ===
  doc.setFontSize(20).setTextColor(40, 103, 178).setFont(undefined, "bold");
  doc.text("Financial Report", pageWidth / 2, currentY, { align: "center" });

  doc.setFontSize(12).setTextColor(100, 100, 100).setFont(undefined, "normal");
  const reportDate = new Date().toLocaleString("en-LK", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  doc.text(`Generated: ${reportDate}`, pageWidth / 2, currentY + 20, { align: "center" });

  currentY += 50;

  // === FINANCIAL SUMMARY BOX ===
  doc.setFillColor(235, 245, 255);
  doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 100, 5, 5, "F");
  doc.setDrawColor(40, 103, 178).setLineWidth(1);
  doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 100, 5, 5, "S");

  doc.setFontSize(16).setTextColor(40, 103, 178).setFont(undefined, "bold");
  doc.text("Financial Summary", margin + 15, currentY + 25);

  // Labels
  doc.setFontSize(12).setTextColor(60, 60, 60).setFont(undefined, "bold");
  doc.text("Total Balance:", margin + 30, currentY + 50);
  doc.text("Total Income:", margin + 30, currentY + 70);
  doc.text("Total Expenses:", margin + 280, currentY + 50);
  doc.text("Savings Rate:", margin + 280, currentY + 70);

  // Values
  doc.setTextColor(40, 103, 178).setFont(undefined, "normal");
  doc.text(
    `Rs. ${balance.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    margin + 130,
    currentY + 50
  );
  doc.text(
    `Rs. ${totalIncome.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    margin + 130,
    currentY + 70
  );
  doc.text(
    `Rs. ${totalExpenses.toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    margin + 390,
    currentY + 50
  );
  doc.text(`${savingsRate.toFixed(1)}%`, margin + 390, currentY + 70);

  currentY += 120;

  // === TRANSACTIONS TABLE HEADER ===
  doc.setFillColor(40, 103, 178);
  doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 40, 3, 3, "F");

  doc.setTextColor(255, 255, 255).setFont(undefined, "bold");
  doc.text("Description", margin + 15, currentY + 25);
  doc.text("Amount (Rs.)", margin + 280, currentY + 25);
  doc.text("Type", margin + 420, currentY + 25);
 
  currentY += 50;

  // === TRANSACTIONS TABLE ROWS ===
  entries.slice(0, 25).forEach((entry, index) => {
    if (currentY > 700) {
      doc.addPage();
      currentY = 40;

      // Re-add table header on new page
      doc.setFillColor(40, 103, 178);
      doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 40, 3, 3, "F");
      doc.setTextColor(255, 255, 255).setFont(undefined, "bold");
      doc.text("Description", margin + 15, currentY + 25);
      doc.text("Amount (Rs.)", margin + 280, currentY + 25);
      doc.text("Type", margin + 420, currentY + 25);
      doc.text("Date", margin + 500, currentY + 25);
      currentY += 50;
    }

    // Alternate row background color
    if (index % 2 === 0) {
      doc.setFillColor(245, 247, 250);
      doc.rect(margin, currentY - 5, pageWidth - 2 * margin, 20, "F");
    }

    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);

    // Description
    doc.text(entry.description.substring(0, 40), margin + 15, currentY + 5);

    // Amount with color coding
    if (entry.type === "Income") doc.setTextColor(16, 185, 129); // Green
    else doc.setTextColor(239, 68, 68); // Red

    doc.text(
      `Rs. ${parseFloat(entry.amount).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      margin + 280,
      currentY + 5
    );

    // Type
    doc.setTextColor(50, 50, 50);
    doc.text(entry.type, margin + 420, currentY + 5);

    // Date properly formatted
    const formattedDate = new Date(entry.date).toLocaleDateString("en-LK");
    doc.text(formattedDate, margin + 500, currentY + 5);

    currentY += 20;
  });

  // === FOOTER SUMMARY ===
  if (currentY > 650) {
    doc.addPage();
    currentY = 40;
  }

  currentY += 20;

  doc.setFillColor(240, 245, 255);
  doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 80, 5, 5, "F");
  doc.setDrawColor(200, 220, 240).setLineWidth(1);
  doc.roundedRect(margin, currentY, pageWidth - 2 * margin, 80, 5, 5, "S");

  doc.setFontSize(12).setTextColor(40, 103, 178).setFont(undefined, "bold");
  doc.text("Report Summary", margin + 15, currentY + 20);

  doc.setFontSize(10).setTextColor(80, 80, 80).setFont(undefined, "normal");
  doc.text(`• Total Transactions: ${entries.length}`, margin + 20, currentY + 40);
  doc.text(`• Income Transactions: ${incomeEntries.length}`, margin + 20, currentY + 55);
  doc.text(`• Expense Transactions: ${expenseEntries.length}`, margin + 20, currentY + 70);

  doc.text(
    `• Period: ${
      entries.length > 0
        ? new Date(entries[entries.length - 1].date).toLocaleDateString("en-LK")
        : "N/A"
    } to ${
      entries.length > 0
        ? new Date(entries[0].date).toLocaleDateString("en-LK")
        : "N/A"
    }`,
    margin + 250,
    currentY + 40
  );

  doc.text(
    `• Avg Monthly Income: Rs. ${(
      totalIncome / 6
    ).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    margin + 250,
    currentY + 55
  );

  doc.text(
    `• Avg Monthly Expense: Rs. ${(
      totalExpenses / 6
    ).toLocaleString("en-LK", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    margin + 250,
    currentY + 70
  );

  // === SAVE PDF ===
  doc.save("financial_report.pdf");
};


  // Chart Data
  const doughnutData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        backgroundColor: ['#10B981', '#EF4444'],
        borderWidth: 0,
      },
    ],
  };

  const doughnutOptions = {
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { boxWidth: 12, font: { size: 11 } },
      },
    },
    maintainAspectRatio: false,
  };

  // Monthly trend data
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    income: [3200, 2800, 3500, 4200, 3900, 4500],
    expenses: [2200, 2500, 2800, 2400, 3100, 2700]
  };

  const lineData = {
    labels: monthlyData.labels,
    datasets: [
      {
        label: 'Income',
        data: monthlyData.income,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Expenses',
        data: monthlyData.expenses,
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  // Category-wise spending
  const categorySpending = categories.map(cat => ({
    name: cat,
    amount: expenseEntries
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + parseFloat(e.amount), 0)
  })).filter(cat => cat.amount > 0);

  const barData = {
    labels: categorySpending.map(cat => cat.name),
    datasets: [
      {
        label: 'Spending by Category',
        data: categorySpending.map(cat => cat.amount),
        backgroundColor: '#3B82F6',
        borderRadius: 6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-6 bg-white rounded-2xl shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FaMoneyBillWave className="text-blue-500 mr-3" />
              Financial Dashboard
            </h1>
            <p className="text-gray-500 mt-2 flex items-center">
              <FaClock className="text-gray-400 mr-2" />
              Last updated: {lastUpdated.toLocaleTimeString()}
              {!loading && (
                <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <span className="flex h-2 w-2 relative mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  Live Updates
                </span>
              )}
            </p>
          </div>
          <motion.button
            onClick={generatePDF}
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
            title="Total Balance"
            value={balance}
            icon={FaWallet}
            color={balance >= 0 ? "green" : "red"}
            loading={loading}
            description="Current financial position"
            prefix="Rs. "
          />
          <StatCard
            title="Total Income"
            value={totalIncome}
            icon={FaArrowUp}
            color="green"
            loading={loading}
            description="All income sources"
            prefix="Rs. "
          />
          <StatCard
            title="Total Expenses"
            value={totalExpenses}
            icon={FaArrowDown}
            color="red"
            loading={loading}
            description="All expenditures"
            prefix="Rs. "
          />
          <StatCard
            title="Savings Rate"
            value={savingsRate}
            icon={FaPiggyBank}
            color="blue"
            loading={loading}
            description="Income saved"
            suffix="%"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Income vs Expenses Doughnut */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
              <FaChartPie className="text-blue-500 mr-3" />
              Income vs Expenses
            </h2>
            <div className="h-72">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </motion.div>

          {/* Monthly Trend Line Chart */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-md border border-gray-100"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaChartLine className="text-blue-500 mr-3" />
                Monthly Financial Trend
              </h2>
              <div className="flex space-x-2">
                {['week', 'month', 'quarter', 'year'].map(period => (
                  <button
                    key={period}
                    onClick={() => setTimeFilter(period)}
                    className={`px-3 py-1 text-sm rounded-lg capitalize transition-all ${
                      timeFilter === period 
                        ? "bg-blue-500 text-white" 
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-72">
              <Line data={lineData} options={lineOptions} />
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Transaction Form */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaExchangeAlt className="text-blue-500 mr-2" />
              Add Transaction
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: "Income" })}
                    className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
                      form.type === "Income" 
                        ? "border-green-500 bg-green-50 text-green-700" 
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <FaArrowUp className="mr-2" />
                    Income
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, type: "Expense" })}
                    className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 transition-all ${
                      form.type === "Expense" 
                        ? "border-red-500 bg-red-50 text-red-700" 
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <FaArrowDown className="mr-2" />
                    Expense
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">Rs.</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  placeholder="Enter description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center"
              >
                <FaExchangeAlt className="mr-2" />
                Add Transaction
              </button>
            </form>
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <FaCalendarAlt className="text-blue-500 mr-2" />
                Recent Transactions
                <span className="ml-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                  {entries.length} transactions
                </span>
              </h2>
              <FaFilter className="text-gray-400 cursor-pointer hover:text-gray-600" />
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : entries.length === 0 ? (
              <div className="text-center py-12">
                <FaSearch className="text-3xl text-gray-300 mb-4 mx-auto" />
                <h3 className="text-lg font-medium text-gray-700">No transactions found</h3>
                <p className="text-gray-500 mt-1">Add your first transaction to get started</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {entries.map((e, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className={`p-3 rounded-full mr-4 ${
                      e.type === "Income" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                    }`}>
                      {e.type === "Income" ? <FaArrowUp /> : <FaArrowDown />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{e.description}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <FaTag className="mr-1" size={12} />
                        {e.category} • {new Date(e.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`font-semibold ${e.type === "Income" ? "text-green-600" : "text-red-600"}`}>
                      {e.type === "Income" ? "+" : "-"}Rs.{parseFloat(e.amount).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// StatCard Component
const StatCard = ({ title, value, icon: Icon, color, loading, description, prefix = "", suffix = "" }) => {
  const colorMap = {
    blue: { bg: "bg-blue-100", text: "text-blue-500", value: "text-blue-700", gradient: "from-blue-500 to-blue-600" },
    green: { bg: "bg-green-100", text: "text-green-500", value: "text-green-700", gradient: "from-green-500 to-green-600" },
    yellow: { bg: "bg-yellow-100", text: "text-yellow-500", value: "text-yellow-700", gradient: "from-yellow-500 to-yellow-600" },
    red: { bg: "bg-red-100", text: "text-red-500", value: "text-red-700", gradient: "from-red-500 to-red-600" }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-gray-500 text-sm font-medium mb-2 flex items-center">
            <Icon className={`${colorMap[color].text} mr-2`} />
            {title}
          </h2>
          {loading ? (
            <div className="h-9 w-16 bg-gray-200 rounded-lg animate-pulse mt-1"></div>
          ) : (
            <p className={`text-3xl font-bold ${colorMap[color].value}`}>
              {prefix}{typeof value === 'number' ? value.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}{suffix}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${colorMap[color].bg}`}>
          <Icon className={`text-xl ${colorMap[color].text}`} />
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-3">{description}</p>
      <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${colorMap[color].gradient}`} 
          style={{ width: `${Math.min(100, Math.abs(value) / 1000 * 100)}%` }}
        ></div>
      </div>
    </motion.div>
  );
};