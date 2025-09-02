import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import InventoryNavbar from "./InventoryNavbar.jsx";
import ReorderRequestForm from "./create-reorder.jsx";
import UpdateReorderForm from "./update-reorder.jsx";
import ReorderRequests from "./reorders.jsx";
import AddStockForm from "./add.jsx";
import StockProducts from "./products.jsx";
import axios from "axios";
import InventoryDashboard from "./dashboard.jsx";

const InventoryPage = () => {

  // Handler to submit reorder form data to backend
  const handleReorderSubmit = async (formData) => {
    try {
      await axios.post("http://localhost:5001/api/reorders", formData);
    } catch (err) {
      throw err; // re-throw so form spinner stops
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen">
      {/* Top Navigation */}
      <InventoryNavbar />

      {/* Sub Routes */}
      <div className="flex-1 p-6">
        <Routes>
          {/* Default route → redirect to dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<InventoryDashboard />} />
          <Route path="products" element={<StockProducts />} />
          <Route path="add" element={<AddStockForm />} />
          <Route path="reorders" element={<ReorderRequests />} />
          <Route path="create-reorder" element={<ReorderRequestForm onSubmit={handleReorderSubmit} />} />
          <Route path="update-reorder" element={<UpdateReorderForm />} />
          <Route path="reports" element={<h2 className="text-xl font-bold">📑 Stock Reports</h2>} />
        </Routes>
      </div>
    </div>
  );
};

export default InventoryPage;
