import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import AdminLogin from "./components/adminLogin.jsx";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Inventory from "./components/inventory/inventory.jsx";
import ProductTable from "./components/product/products.jsx";
import AddProductForm from "./components/product/addProduct.jsx";
import UpdateProductForm from "./components/product/UpdateProductForm.jsx";
import { Toaster } from "react-hot-toast";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin/login";

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for all pages except login */}
      {!isLoginPage && <Sidebar />}

      {/* Main content area */}
      <div className="flex flex-col flex-1 h-screen">
        {/* Navbar */}
        {!isLoginPage && <Navbar />}

        {/* Scrollable content */}
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            {/* Public Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <h2 className="text-2xl font-bold">Home Page</h2>
                </PrivateRoute>
              }
            />

            <Route
              path="/users"
              element={
                <PrivateRoute>
                  <h2 className="text-2xl font-bold">Users Page</h2>
                </PrivateRoute>
              }
            />

            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <h2 className="text-2xl font-bold">Orders Page</h2>
                </PrivateRoute>
              }
            />

            <Route
              path="/product"
              element={
                <PrivateRoute>
                  <ProductTable />
                </PrivateRoute>
              }
            />
            <Route
              path="/add-product"
              element={
                <PrivateRoute>
                  <AddProductForm />
                </PrivateRoute>
              }
            />
            <Route
              path="/update-product/:id"
              element={
                <PrivateRoute>
                  <UpdateProductForm />
                </PrivateRoute>
              }
            />

            <Route
              path="/inventory/*"
              element={
                <PrivateRoute>
                  <Inventory />
                </PrivateRoute>
              }
            />

            {/* Other Pages */}
            <Route
              path="/suppliers"
              element={
                <PrivateRoute>
                  <h2 className="text-2xl font-bold">Suppliers Page</h2>
                </PrivateRoute>
              }
            />
            <Route
              path="/finance"
              element={
                <PrivateRoute>
                  <h2 className="text-2xl font-bold">Finance Page</h2>
                </PrivateRoute>
              }
            />
            <Route
              path="/delivery"
              element={
                <PrivateRoute>
                  <h2 className="text-2xl font-bold">Delivery Page</h2>
                </PrivateRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <PrivateRoute>
                  <h2 className="text-2xl font-bold">Feedback Page</h2>
                </PrivateRoute>
              }
            />
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
