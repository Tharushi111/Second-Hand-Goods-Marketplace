import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SupplierNavbar from "./supplierNavbar.jsx";
import SupplierOffers from "./supplierOffers.jsx";
import SupplierReplies from "./supplierReplies.jsx";

const SupplierPage = () => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <SupplierNavbar />
      <div className="flex-1 p-6">
        <Routes>
          <Route index element={<Navigate to="offers" replace />} />
          <Route path="offers" element={<SupplierOffers />} />
          <Route path="replies" element={<SupplierReplies />} />
        </Routes>
      </div>
    </div>
  );
};

export default SupplierPage;
