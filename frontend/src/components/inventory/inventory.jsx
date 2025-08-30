import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import InventoryNavbar from "./InventoryNavbar.jsx";
import ReorderRequestForm from "./create-reorder.jsx";
import UpdateReorderForm from "./update-reorder.jsx";
import ReorderRequests from "./reorders.jsx";
import axios from "axios";
import toast from "react-hot-toast";

const InventoryPage = () => {

  // Handler to submit form data to backend
  const handleReorderSubmit = async (formData) => {
    try {
      await axios.post("http://localhost:5001/api/reorders", formData);
    } catch (err) {
      throw err; // re-throw so form spinner stops
    }
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Navigation */}
      <InventoryNavbar />

      {/* Sub Routes */}
      <div className="flex-1">
        <Routes>
          {/* Default route → redirect to dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<h2 className="text-xl font-bold">📊 Stock Dashboard</h2>} />
          <Route path="products" element={<h2 className="text-xl font-bold">📦 Stock Products</h2>} />
          <Route path="add" element={<h2 className="text-xl font-bold">➕ Add Stock</h2>} />
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
