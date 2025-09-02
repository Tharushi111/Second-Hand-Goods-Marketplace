import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Inventory from "./components/inventory/inventory.jsx";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* Navbar */}
        <Navbar />

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<h2 className="text-2xl font-bold">Home Page</h2>} />
            <Route path="/users" element={<h2 className="text-2xl font-bold">Users Page</h2>} />
            <Route path="/orders" element={<h2 className="text-2xl font-bold">Orders Page</h2>} />
            <Route path="/products" element={<h2 className="text-2xl font-bold">Products Page</h2>} />
            <Route path="/inventory/*" element={<Inventory />} />
            <Route path="/suppliers" element={<h2 className="text-2xl font-bold">Suppliers Page</h2>} />
            <Route path="/finance" element={<h2 className="text-2xl font-bold">Finance Page</h2>} />
            <Route path="/delivery" element={<h2 className="text-2xl font-bold">Delivery Page</h2>} />
            <Route path="/feedback" element={<h2 className="text-2xl font-bold">Feedback Page</h2>} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Toast Notifications */}
      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
}

export default App;
