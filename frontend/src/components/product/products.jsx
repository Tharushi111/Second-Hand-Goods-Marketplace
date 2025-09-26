import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEdit, FaTrash, FaFilePdf, FaPlus, FaSearch, FaCalendarAlt, FaTimes } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/ReBuyLogo.png"; 

export default function ProductTable() {
  const [products, setProducts] = useState([]);
  const [searchCategory, setSearchCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [viewProduct, setViewProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/products");
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch products");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`http://localhost:5001/api/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete product");
    }
  };

  // Download PDF
const downloadPDF = (product) => {
  const doc = new jsPDF();

  // Set margins
  const margin = 15;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Add logo on left
  if (logoImg) {
    doc.addImage(logoImg, "PNG", margin, 10, 30, 30);
  }

  // Company info on right - aligned to right margin
  doc.setFontSize(16);
  doc.setTextColor(40, 103, 178);
  doc.text("ReBuy.lk", pageWidth - margin, 15, { align: "right" });

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text("77A, Market Street", pageWidth - margin, 22, { align: "right" });
  doc.text("Colombo, Sri Lanka", pageWidth - margin, 28, { align: "right" });
  doc.text("Contact: +94 77 321 4567", pageWidth - margin, 34, { align: "right" });
  doc.text("Email: rebuy@gmail.com", pageWidth - margin, 40, { align: "right" });

  // Add a decorative line under header
  doc.setDrawColor(200, 200, 200);
  doc.line(margin, 50, pageWidth - margin, 50);

  // Title
  doc.setFontSize(20);
  doc.setTextColor(40, 103, 178);
  doc.text("Product Details", pageWidth / 2, 65, { align: "center" });

  // Product info section with light background
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, 75, pageWidth - margin * 2, 15, 3, 3, "F");
  doc.setTextColor(40, 103, 178);
  doc.setFontSize(12);
  doc.text("Basic Information", margin + 5, 86);

  // Product details
  let currentY = 95;
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);

    // name
  doc.setFont(undefined, "bold");
  doc.text("Name:", margin + 5, currentY);
  doc.setFont(undefined, "normal");
  doc.text(String(product?.stock?.name || ""), margin + 30, currentY); 
  currentY += 8;

  // Category
  doc.setFont(undefined, "bold");
  doc.text("Category:", margin + 5, currentY);
  doc.setFont(undefined, "normal");
  doc.text(String(product?.category || ""), margin + 30, currentY);
  currentY += 8;


  // Description
  doc.setFont(undefined, "bold");
  doc.text("Description:", margin + 5, currentY);
  doc.setFont(undefined, "normal");
  const descriptionText = String(product?.description || "N/A");
  const descriptionLines = doc.splitTextToSize(descriptionText, pageWidth - margin * 2 - 10);
  doc.text(descriptionLines, margin + 35, currentY);
  currentY += descriptionLines.length * 6;

  // Price
  doc.setFont(undefined, "bold");
  doc.text("Price:", margin + 5, currentY);
  doc.setFont(undefined, "normal");
  doc.text(`Rs. ${String(product?.price || "0")}`, margin + 25, currentY);
  currentY += 8;

  // Created date
  doc.setFont(undefined, "bold");
  doc.text("Created:", margin + 5, currentY);
  doc.setFont(undefined, "normal");
  const createdAt = product?.createdAt ? new Date(product.createdAt).toLocaleDateString() : "N/A";
  doc.text(createdAt, margin + 30, currentY);
  currentY += 8;

  // Add footer with page number and generated date
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Generated on ${new Date().toLocaleDateString()}`, margin, pageHeight - 10);
  doc.text("Page 1 of 1", pageWidth - margin, pageHeight - 10, { align: "right" });

  // Save file
  const fileName = (product?.name || "product").replace(/\s+/g, "_");
  doc.save(`${fileName}_details.pdf`);
};

  const filteredProducts = products.filter((p) => {
    const matchesCategory = p.category.toLowerCase().includes(searchCategory.toLowerCase());
    const matchesDate = filterDate ? new Date(p.createdAt).toISOString().slice(0, 10) === filterDate : true;
    return matchesCategory && matchesDate;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 p-6 bg-white rounded-2xl shadow-lg">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <span className="bg-blue-100 text-blue-600 p-3 rounded-2xl mr-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"></path>
                </svg>
              </span>
              Products
            </h1>
            <p className="text-gray-600 mt-2">Manage product catalog with ease</p>
          </div>
          <button
            onClick={() => navigate("/add-product")}
            className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-xl shadow-md hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 mt-4 md:mt-0 group"
          >
            <FaPlus className="mr-2 transition-transform group-hover:rotate-90" />
            Add New Product
          </button>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaSearch className="text-black mr-2" /> Filter Products
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-black" />
              </div>
              <input
                type="text"
                placeholder="Search by category"
                value={searchCategory}
                onChange={(e) => setSearchCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="relative flex-1">
            <DatePicker
              selected={filterDate ? new Date(filterDate) : null}
              onChange={(date) => setFilterDate(date.toISOString().slice(0,10))}
              placeholderText="Select a date"
              className="w-full pr-10 pl-4 py-3 border border-gray-300 rounded-xl bg-white text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          </div>
        </div>

        {/* Products Table Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center">
              Product List
              <span className="ml-3 bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {filteredProducts.length} products
              </span>
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-700 mt-4">No products found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search or filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created At</th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map((product) => (
                    <tr key={product._id} className="hover:bg-blue-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">{product.stock.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{product.category}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-green-600 font-semibold">Rs.{product.price}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(product.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                        <div className="flex justify-center space-x-2">
                          <button onClick={() => setViewProduct(product)} className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors" title="View details">
                            <FaEye />
                          </button>
                          <button onClick={() => navigate(`/update-product/${product._id}`)} className="text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-100 transition-colors" title="Edit product">
                            <FaEdit />
                          </button>
                          <button onClick={() => deleteProduct(product._id)} className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors" title="Delete product">
                            <FaTrash />
                          </button>
                          <button onClick={() => downloadPDF(product)} className="text-purple-600 hover:text-purple-900 p-2 rounded-full hover:bg-purple-100 transition-colors" title="Download PDF">
                            <FaFilePdf />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {viewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
              <h2 className="text-2xl font-bold">{viewProduct.stock.name}</h2>
              <p className="text-blue-100">{viewProduct.category}</p>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-gray-900">{viewProduct.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Price</h3>
                  <p className="mt-1 text-gray-900 font-semibold">Rs.{viewProduct.price}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                  <p className="mt-1 text-gray-900">{new Date(viewProduct.createdAt).toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-6 py-3 flex justify-end">
              <button onClick={() => setViewProduct(null)} className="flex items-center text-blue-600 hover:text-blue-800 font-medium">
                <FaTimes className="mr-1" /> Close
              </button>
            </div>
            
            <button onClick={() => setViewProduct(null)} className="absolute top-4 right-4 text-white hover:text-gray-200">
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
