import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

// Admin components
import AdminLogin from "./components/AdminLogin.jsx";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer.jsx";
import Inventory from "./components/inventory/inventory.jsx";
import ProductTable from "./components/product/products.jsx";
import AddProductForm from "./components/product/addProduct.jsx";
import UpdateProductForm from "./components/product/UpdateProductForm.jsx";
import FinancePage from "./components/finance/finance.jsx";
import AllUsers from "./components/users.jsx";
import AdminFeedbackPage from "./components/adminFeedback/adminFeedback.jsx";
import SupplierPage from "./components/supplier/supplier.jsx";
import AdminOrders from "./components/order/AdminOrders.jsx";
import OrderDetails from "./components/order/OrderDetails.jsx";

// User components
import ProductListing from "./components/User/productListing.jsx";
import HomePage from "./components/User/Home.jsx";
import AboutUs from "./components/User/About.jsx";
import ContactUs from "./components/User/Contact.jsx";
import UserLogin from "./components/User/UserLogin.jsx";
import Register from "./components/User/UserRegistration.jsx";
import BuyerDashboard from "./components/User/BuyerDashboard.jsx";
import SupplierDashboard from "./components/User/SupplierDashboard/SupplierDashboard.jsx";
import AddSuplierOffer from "./components/User/SupplierDashboard/AddSupplierOffer.jsx";
import SupplierOfferList from "./components/User/SupplierDashboard/SupplierOfferList.jsx";
import FeedbackPage from "./components/User/feedback.jsx";
import Cart from "./components/order/cart.jsx";
import Checkout from "./components/order/Checkout.jsx";
import OrderConfirmation from "./components/order/OrderConfirmation.jsx";
import OrderHistory from "./components/order/OrderHistory.jsx";

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
    "/AddSupplierOffer",
    "/SupplierOfferList",
    "/FeedbackPage",
    "/cart",
    "/checkout",
    "/order-confirmation",
    "/order-history",
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
            <Route path="/register" element={<Register />} />
            <Route path="/productListing" element={<ProductListing />} />
            <Route path="/HomePage" element={<HomePage />} />
            <Route path="/AboutUs" element={<AboutUs />} />
            <Route path="/ContactUs" element={<ContactUs />} />
            <Route path="/FeedbackPage" element={<FeedbackPage />} />
            <Route path="/AddSupplierOffer" element={<AddSuplierOffer />} />
            <Route path="/SupplierOfferList" element={<SupplierOfferList />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/order-history" element={<OrderHistory />} />

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
                  <AllUsers />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <AdminPrivateRoute>
                  <AdminOrders />
                </AdminPrivateRoute>
              }
            />

            <Route path="/admin/orders/:id" element={<OrderDetails />} />
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
              path="/suppliers/*"
              element={
                <AdminPrivateRoute>
                  <SupplierPage />
                </AdminPrivateRoute>
              }
            />
            <Route
              path="/finance"
              element={
                <AdminPrivateRoute>
                  <FinancePage />
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
                  <AdminFeedbackPage />
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

      {/* Toastify container for general notifications */}
      <ToastContainer
        position="top-center"
        autoClose={1000}
        toastStyle={{ fontFamily: "'Open Sans', sans-serif", fontSize: "16px" }}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      {/* Hot Toast container for specific notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          success: {
            style: {
              background: "linear-gradient(135deg, #1e40af, #0369a1)",
              color: "#ffffff",
              border: "1px solid #1e3a8a",
              boxShadow: "0 4px 12px rgba(30, 64, 175, 0.4)",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#1e40af",
            },
          },
          error: {
            style: {
              background: "linear-gradient(135deg, #dc2626, #b91c1c)",
              color: "#ffffff",
              border: "1px solid #dc2626",
              boxShadow: "0 4px 12px rgba(220, 38, 38, 0.3)",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#dc2626",
            },
          },
          loading: {
            style: {
              background: "linear-gradient(135deg, #4f46e5, #3730a3)",
              color: "#ffffff",
              border: "1px solid #4f46e5",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)",
              textShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
            },
            iconTheme: {
              primary: "#ffffff",
              secondary: "#4f46e5",
            },
          },
          style: {
            fontSize: "15px",
            fontFamily: "'Inter', sans-serif",
            fontWeight: "600", // Increased font weight for better readability
            borderRadius: "12px",
            padding: "14px 22px",
            backdropFilter: "blur(8px)",
          },
        }}
      />
    </div>
  );
}

export default App;
