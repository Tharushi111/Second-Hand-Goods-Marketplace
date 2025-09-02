import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Inventory from "./components/inventory/inventory.jsx";
import { Toaster } from "react-hot-toast";
import ProductTable from "./components/product/products.jsx";
import AddProductForm from "./components/product/addProduct.jsx";
import UpdateProductForm from "./components/product/UpdateProductForm.jsx"; // import the update form

function AppWrapper() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route path="/" element={<h2 className="text-2xl font-bold">Home Page</h2>} />
            <Route path="/users" element={<h2 className="text-2xl font-bold">Users Page</h2>} />
            <Route path="/orders" element={<h2 className="text-2xl font-bold">Orders Page</h2>} />

            {/* Products table with navigation to AddProductForm or UpdateProductForm */}
            <Route
              path="/product"
              element={<ProductTable navigateToaddProduct={(id) => {
                if (id) navigate(`/product/update/${id}`);
                else navigate("/product/add");
              }} />}
            />

            {/* Add Product Form */}
           <Route path="/add-product" element={<AddProductForm />} />


            {/* Update Product Form with dynamic id */}
           <Route path="/update-product/:id" element={<UpdateProductForm />} />

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
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}

export default AppWrapper;
