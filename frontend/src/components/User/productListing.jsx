import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaShoppingCart,
  FaEye,
  FaCartPlus,
  FaBolt,
  FaFilter,
  FaSort,
  FaStar,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import Navbar from "../User/UserNavbar";
import Footer from "../User/UserFooter";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewProduct, setViewProduct] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Fetch products and cart count from backend
  useEffect(() => {
    fetchProducts();
    fetchCartCount();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5001/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const fetchCartCount = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:5001/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartCount(res.data.items.length || 0);
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    }
  };

  // Filter + Sort
  const filtered = products
    .filter(
      (p) =>
        p.description.toLowerCase().includes(search.toLowerCase()) &&
        (category ? p.category === category : true)
    )
    .sort((a, b) => {
      if (sort === "low-high") return a.price - b.price;
      if (sort === "high-low") return b.price - a.price;
      return 0;
    });

  // Add to Cart API
  const handleAddToCart = async (product) => {
    if (!token) {
      toast.error("Please login first");
      navigate("/UserLogin");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5001/api/cart/add",
        { productId: product._id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201) {
        toast.success(`${product.stock?.name || "Product"} added to cart!`);
        setCartCount((prevCount) => prevCount + 1); 
      } else {
        toast.error(res.data.message || "Failed to add product");
      }
    } catch (err) {
      console.error("Failed to add to cart:", err.response || err);
      const message =
        err.response?.data?.message ||
        "Failed to add product to cart. Try again later.";
      toast.error(message);
    }
  };

  // Buy Now - directly to checkout with the product
  const handleBuyNow = (product) => {
    if (!token) {
      toast.error("Please login first");
      navigate("/UserLogin");
      return;
    }
    if (product.stock?.quantity === 0) {
      toast.error("This product is out of stock");
      return;
    }

    // Navigate to checkout with the product data
    navigate("/checkout", { state: { product, quantity: 1 } });
  };

  const goToCart = () => {
    navigate("/cart");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <Navbar />

      {/* Top Bar: Search + Filters + Cart */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-5 rounded-2xl shadow-lg w-full max-w-7xl mx-auto">
        {/* Search */}
        <div className="flex items-center bg-blue-50 px-5 py-3 rounded-xl w-full md:w-2/5">
          <FaSearch className="text-blue-500 mr-3 text-lg" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full placeholder-blue-400 text-lg"
          />
        </div>

        {/* Filters + Cart */}
        <div className="flex items-center gap-3 w-full md:w-3/5 justify-end">
          {/* Category Filter */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaFilter className="text-blue-400" />
            </div>
            <select
              className="border border-blue-200 rounded-xl px-4 py-3 pl-10 w-full appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-blue-800"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {[...new Set(products.map((p) => p.category))].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Filter */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaSort className="text-blue-400" />
            </div>
            <select
              className="border border-blue-200 rounded-xl px-4 py-3 pl-10 w-full appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-blue-800"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="low-high">Price: Low → High</option>
              <option value="high-low">Price: High → Low</option>
            </select>
          </div>

          {/* Cart Icon */}
          <button
            onClick={goToCart}
            className="relative bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-3 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 cursor-pointer"
          >
            <FaShoppingCart className="text-2xl text-white" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-6 w-6 flex items-center justify-center rounded-full font-bold shadow-sm">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex flex-col items-center max-w-7xl mx-auto p-4 md:p-6 flex-grow w-full">
        {loading ? (
          <div className="flex justify-center items-center h-96 w-full">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
              <div className="text-blue-600">Loading products...</div>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow w-full border border-blue-100">
            <div className="text-6xl mb-4 text-blue-200">🔍</div>
            <h3 className="text-2xl font-semibold text-blue-800 mb-2">No products found</h3>
            <p className="text-blue-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {filtered.map((product) => {
              const outOfStock = product.stock?.quantity === 0;
              return (
                <div
                  key={product._id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col border border-blue-100"
                >
                  <div className="relative overflow-hidden group">
                    <img
                      src={`http://localhost:5001/${product.image}`}
                      alt={product.stock?.name || product.description}
                      className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                      {product.category}
                    </span>
                    {outOfStock && (
                      <span className="absolute top-3 right-3 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-medium">
                        Out of Stock
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <button
                        onClick={() => setViewProduct(product)}
                        className="bg-white text-blue-700 rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-md pointer-events-auto"
                      >
                        <FaEye className="text-lg" />
                      </button>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-blue-900 mb-2 line-clamp-2 h-14">
                      {product.stock?.name || "Unnamed Product"}
                    </h3>
                    <p className="text-blue-700 text-sm mb-4 line-clamp-2 flex-grow">
                      {product.description}
                    </p>

                    <div className="mt-auto">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xl font-bold text-blue-600">
                          Rs. {product.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <div className="flex items-center">
                          <div className="flex text-amber-400 mr-1">
                            <FaStar size={12} /><FaStar size={12} /><FaStar size={12} /><FaStar size={12} /><FaStar size={12} />
                          </div>
                          <span className="text-xs text-blue-500">(24)</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={outOfStock}
                          className={`flex-1 flex items-center justify-center gap-1 px-2 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                            outOfStock
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-md"
                          }`}
                        >
                          <FaCartPlus className="text-xs" />
                          <span>Add to Cart</span>
                        </button>

                        <button
                          onClick={() => handleBuyNow(product)}
                          disabled={outOfStock}
                          className={`flex-1 flex items-center justify-center gap-1 px-2 py-2.5 rounded-lg text-sm transition-all duration-300 ${
                            outOfStock
                              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                              : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-md"
                          }`}
                        >
                          <FaBolt className="text-xs" />
                          <span>Buy Now</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* View Product Modal */}
      {viewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full relative">
            <button
              onClick={() => setViewProduct(null)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 text-xl font-bold"
            >
              ×
            </button>
            <div className="flex flex-col md:flex-row gap-6">
              <img
                src={`http://localhost:5001/${viewProduct.image}`}
                alt={viewProduct.stock?.name || viewProduct.description}
                className="h-64 md:h-80 w-full md:w-1/2 object-cover rounded-xl"
              />
              <div className="flex flex-col justify-between">
                <h2 className="text-2xl font-bold text-blue-900">
                  {viewProduct.stock?.name || "Unnamed Product"}
                </h2>
                <p className="text-blue-700 mt-2">{viewProduct.description}</p>
                <p className="text-xl font-semibold text-blue-600 mt-4">
                  Rs. {viewProduct.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleAddToCart(viewProduct)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-2 rounded-lg shadow-md"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(viewProduct)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-4 py-2 rounded-lg shadow-md"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default ProductListing;