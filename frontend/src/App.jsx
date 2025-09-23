import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

// Admin components
import AdminLogin from "./components/adminLogin.jsx";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer.jsx";
import Inventory from "./components/inventory/inventory.jsx";
import ProductTable from "./components/product/products.jsx";
import AddProductForm from "./components/product/addProduct.jsx";
import UpdateProductForm from "./components/product/UpdateProductForm.jsx";

// User components
import ProductListing from "./components/User/productListing.jsx";
import HomePage from "./components/User/Home.jsx";
import AboutUs from "./components/User/About.jsx";
import ContactUs from "./components/User/Contact.jsx";
import UserLogin from "./components/User/UserLogin.jsx";
import Register from "./components/User/UserRegistration.jsx"; 
import BuyerDashboard from "./components/User/BuyerDashboard.jsx";
import SupplierDashboard from "./components/User/SupplierDashboard.jsx";

// PrivateRoute for admin
const AdminPrivateRoute = ({ children }) => {
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken) return <Navigate to="/admin/login" replace />;
  return children;
};

// PrivateRoute for buyer/supplier
const UserPrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token"); // buyer/supplier token
  const role = localStorage.getItem("role");   // "buyer" or "supplier"

  if (!token) return <Navigate to="/UserLogin" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/UserLogin" replace />;

  return children;
};

function App() {
  const location = useLocation();

  // Routes that should NOT display admin layout
  const noAdminLayoutRoutes = [
    "/admin/login",
    "/register",          
    "/productListing",
    "/HomePage",
    "/AboutUs",
    "/ContactUs",
    "/UserLogin",
    "/BuyerDashboard",
    "/SupplierDashboard",
  ];
  const isNoAdminLayout = noAdminLayoutRoutes.includes(location.pathname);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for admin pages only */}
      {!isNoAdminLayout && <Sidebar />}

      {/* Main content area */}
      <div className="flex flex-col flex-1 h-screen">
        {/* Navbar for admin pages only */}
        {!isNoAdminLayout && <Navbar />}

        {/* Scrollable content */}
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            {/* Public Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/UserLogin" element={<UserLogin />} />
            <Route path="/register" element={<Register />} /> {/* Registration route */}
            <Route path="/productListing" element={<ProductListing />} />
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/AboutUs" element={<AboutUs />} />
            <Route path="/ContactUs" element={<ContactUs />} />

            {/* Buyer & Supplier Dashboards */}
            <Route
              path="/BuyerDashboard"
              element={
                <UserPrivateRoute requiredRole="buyer">
                  <BuyerDashboard />
                </UserPrivateRoute>
              }
            />
            <Route
              path="/SupplierDashboard"
              element={
                <UserPrivateRoute requiredRole="supplier">
                  <SupplierDashboard />
                </UserPrivateRoute>
              }
            />

            {/* Admin Protected Routes */}
            <Route
              path="/"
              element={
                <AdminPrivateRoute>
                  <h2 className="text-2xl font-bold">Admin Home Page</h2>
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/users"
              element={
                <AdminPrivateRoute>
                  <h2 className="text-2xl font-bold">Users Page</h2>
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <AdminPrivateRoute>
                  <h2 className="text-2xl font-bold">Orders Page</h2>
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/product"
              element={
                <AdminPrivateRoute>
                  <ProductTable />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/add-product"
              element={
                <AdminPrivateRoute>
                  <AddProductForm />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/update-product/:id"
              element={
                <AdminPrivateRoute>
                  <UpdateProductForm />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/inventory/*"
              element={
                <AdminPrivateRoute>
                  <Inventory />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/suppliers"
              element={
                <AdminPrivateRoute>
                  <h2 className="text-2xl font-bold">Suppliers Page</h2>
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/finance"
              element={
                <AdminPrivateRoute>
                  <h2 className="text-2xl font-bold">Finance Page</h2>
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/delivery"
              element={
                <AdminPrivateRoute>
                  <h2 className="text-2xl font-bold">Delivery Page</h2>
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/feedback"
              element={
                <AdminPrivateRoute>
                  <h2 className="text-2xl font-bold">Feedback Page</h2>
                </AdminPrivateRoute>
              }
            />

            {/* Redirect unmatched routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        {/* Footer for admin pages only */}
        {!isNoAdminLayout && <Footer />}
      </div>
    </div>
  );
}

export default App;
