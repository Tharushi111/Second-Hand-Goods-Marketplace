import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaShoppingCart, FaEye, FaCartPlus, FaBolt, FaTimes, FaFilter, FaSort } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewProduct, setViewProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/products")
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching products:", err);
        toast.error("Failed to load products");
        setLoading(false);
      });
  }, []);

  let filtered = products
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

  const handleAddToCart = (product) => {
    toast.success(`${product.stock?.name || "Product"} added to cart!`);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <Toaster position="top-right" />

      {/* Main Content */}
      <div className="flex flex-col items-center">
        {/* Header */}
        <div className="mb-8 text-center max-w-3xl w-full">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-800 mb-2">Our Products</h1>
          <p className="text-gray-600">Discover amazing products at great prices</p>
        </div>

        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-stretch mb-6 gap-4 bg-white p-4 rounded-2xl shadow-lg w-full max-w-7xl">
          {/* Search */}
          <div className="flex items-center bg-gray-100 px-4 py-3 rounded-xl w-full md:w-2/5 transition-all duration-300 focus-within:ring-2 ring-indigo-300">
            <FaSearch className="text-gray-500 mr-2" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full placeholder-gray-400"
            />
          </div>

          {/* Filters */}
          <div className={`${showFilters ? 'flex' : 'hidden'} md:flex flex-col md:flex-row items-stretch gap-3 w-full md:w-3/5`}>
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaFilter className="text-gray-400" />
              </div>
              <select
                className="border rounded-xl px-3 py-2.5 pl-10 w-full appearance-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">All Categories</option>
                {[...new Set(products.map((p) => p.category))].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FaSort className="text-gray-400" />
              </div>
              <select
                className="border rounded-xl px-3 py-2.5 pl-10 w-full appearance-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="">Sort by</option>
                <option value="low-high">Price: Low → High</option>
                <option value="high-low">Price: High → Low</option>
              </select>
            </div>

            <div className="relative flex items-center justify-center bg-indigo-50 rounded-xl px-4 hover:bg-indigo-100 transition-colors cursor-pointer">
              <FaShoppingCart className="text-2xl text-indigo-600" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
                0
              </span>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center w-full max-w-7xl">
          <p className="text-gray-600">
            Showing <span className="font-semibold">{filtered.length}</span> products
          </p>
          {(search || category || sort) && (
            <button
              onClick={() => {
                setSearch("");
                setCategory("");
                setSort("");
              }}
              className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64 w-full max-w-7xl">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-indigo-200 h-12 w-12 mb-4"></div>
              <div className="h-4 bg-indigo-200 rounded w-32"></div>
            </div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow w-full max-w-7xl">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full max-w-7xl">
            {filtered.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={`http://localhost:5001/${product.image}`}
                    alt={product.stock?.name || product.description}
                    className="h-52 w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                    {product.stock?.name || "Unnamed Product"}
                  </h3>

                  <div className="mt-auto">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xl font-bold text-indigo-600">Rs. {product.price}</span>
                      {product.price < 1000 && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Great Deal
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewProduct(product)}
                        className="flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg border border-indigo-500 text-indigo-600 hover:bg-indigo-50 text-sm transition-colors"
                      >
                        <FaEye className="text-xs" /> 
                        <span className="hidden sm:inline">View</span>
                      </button>
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 flex items-center justify-center bg-indigo-600 text-white px-2 py-2 rounded-lg hover:bg-indigo-700 text-sm transition-colors"
                      >
                        <FaCartPlus className="text-xs" /> 
                        <span className="hidden sm:inline">Add</span>
                      </button>
                      <button className="flex-1 flex items-center justify-center bg-amber-500 text-white px-2 py-2 rounded-lg hover:bg-amber-600 text-sm transition-colors">
                        <FaBolt className="text-xs" /> 
                        <span className="hidden sm:inline">Buy</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setViewProduct(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500 bg-gray-100 hover:bg-gray-200 rounded-full p-1 transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>

            <div className="mb-5">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mb-2">
                {viewProduct.category}
              </span>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {viewProduct.stock?.name || "Unnamed Product"}
              </h2>
            </div>

            <img
              src={`http://localhost:5001/${viewProduct.image}`}
              alt={viewProduct.stock?.name || viewProduct.description}
              className="w-full h-64 object-cover rounded-xl mb-5 shadow"
            />

            <p className="text-gray-700 mb-5 leading-relaxed">
              {viewProduct.description}
            </p>

            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-indigo-600">
                Rs.{viewProduct.price}
              </p>
              <button
                onClick={() => handleAddToCart(viewProduct)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <FaCartPlus /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListing;
