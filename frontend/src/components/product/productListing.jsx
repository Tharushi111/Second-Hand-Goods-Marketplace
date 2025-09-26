import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaSearch,
  FaShoppingCart,
  FaEye,
  FaCartPlus,
  FaBolt,
  FaTimes,
  FaFilter,
  FaSort,
  FaStar,
  FaPlus,
  FaMinus
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);
  const [viewProduct, setViewProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [cart, setCart] = useState([]);
  const [showCartPreview, setShowCartPreview] = useState(false);

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

  // Filter + Sort
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

  // Add to Cart
  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem) {
      toast.error("Product already in cart!");
      return;
    }

    setCart([...cart, { ...product, quantity: 1 }]);
    toast.success(`${product.stock?.name || "Product"} added to cart!`);
  };

  // Update cart item quantity
  const updateCartQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    setCart(cart.map(item => 
      item._id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  // Remove from cart
  const removeFromCart = (id) => {
    setCart(cart.filter(item => item._id !== id));
    toast.success("Item removed from cart");
  };

  // Calculate total price
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Buy Now
  const handleBuyNow = (product) => {
    if (product.stock?.quantity === 0) {
      toast.error("This product is out of stock");
      return;
    }
    toast.success(`Proceeding to buy ${product.stock?.name || "Product"}!`);
    // Navigate to checkout page if needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <Toaster position="top-right" />

      {/* Main Content */}
      <div className="flex flex-col items-center max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center w-full">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-800 mb-3">
            Discover Amazing Products
          </h1>
          <p className="text-lg text-blue-600 max-w-2xl mx-auto">
            Find the perfect second-hand items at unbeatable prices 
          </p>
        </div>

        {/* Top Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-5 rounded-2xl shadow-lg w-full">
          {/* Search */}
          <div className="flex items-center bg-blue-50 px-5 py-3 rounded-xl w-full md:w-2/5 transition-all duration-300 focus-within:ring-2 ring-blue-500 focus-within:shadow-md">
            <FaSearch className="text-blue-500 mr-3 text-lg" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent outline-none w-full placeholder-blue-400 text-lg"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row items-stretch gap-3 w-full md:w-3/5">
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
            <div className="relative">
              <button 
                onClick={() => setShowCartPreview(!showCartPreview)}
                className="flex items-center justify-center bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl p-3 hover:from-blue-600 hover:to-blue-800 transition-all duration-300 cursor-pointer h-full shadow-md"
              >
                <FaShoppingCart className="text-2xl text-white" />
                {cart.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-6 w-6 flex items-center justify-center rounded-full font-bold shadow-sm">
                    {cart.length}
                  </span>
                )}
              </button>

              {/* Cart Preview */}
              {showCartPreview && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl z-50 border border-blue-100">
                  <div className="p-4 border-b border-blue-100">
                    <h3 className="font-semibold text-blue-800">Your Cart ({cart.length})</h3>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {cart.length === 0 ? (
                      <div className="p-6 text-center text-blue-600">
                        Your cart is empty
                      </div>
                    ) : (
                      <>
                        {cart.map(item => (
                          <div key={item._id} className="p-4 border-b border-blue-50 flex items-center">
                            <img 
                              src={`http://localhost:5001/${item.image}`} 
                              alt={item.stock?.name}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="ml-3 flex-1">
                              <h4 className="text-sm font-medium text-blue-900 truncate">
                                {item.stock?.name || "Product"}
                              </h4>
                              <p className="text-blue-600 font-semibold">Rs. {item.price}</p>
                            </div>
                            <div className="flex items-center">
                              <button 
                                onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                                className="text-blue-500 p-1 rounded-full hover:bg-blue-50"
                              >
                                <FaMinus size={12} />
                              </button>
                              <span className="mx-2 text-sm font-medium text-blue-800">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                                className="text-blue-500 p-1 rounded-full hover:bg-blue-50"
                              >
                                <FaPlus size={12} />
                              </button>
                            </div>
                            <button 
                              onClick={() => removeFromCart(item._id)}
                              className="ml-3 text-red-500 hover:text-red-700"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  
                  {cart.length > 0 && (
                    <div className="p-4 border-t border-blue-100">
                      <div className="flex justify-between mb-4">
                        <span className="font-semibold text-blue-800">Total:</span>
                        <span className="font-bold text-blue-600">Rs. {cartTotal.toFixed(2)}</span>
                      </div>
                      <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300 font-medium shadow-md">
                        Checkout
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center w-full">
          <p className="text-blue-700">
            Showing <span className="font-semibold text-blue-800">{filtered.length}</span> products
          </p>
          {(search || category || sort) && (
            <button
              onClick={() => {
                setSearch("");
                setCategory("");
                setSort("");
              }}
              className="text-blue-600 hover:text-blue-800 flex items-center font-medium"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Product Grid */}
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
            <h3 className="text-2xl font-semibold text-blue-800 mb-2">
              No products found
            </h3>
            <p className="text-blue-600">
              Try adjusting your search or filter criteria
            </p>
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
                    <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => setViewProduct(product)}
                        className="bg-white text-blue-700 rounded-full p-3 transform translate-y-4 group-hover:translate-y-0 transition-transform shadow-md"
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
                          Rs. {product.price}
                        </span>
                        <div className="flex items-center">
                          <div className="flex text-amber-400 mr-1">
                            <FaStar size={12} />
                            <FaStar size={12} />
                            <FaStar size={12} />
                            <FaStar size={12} />
                            <FaStar size={12} />
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

      {/* View Modal */}
      {viewProduct && (
        <div className="fixed inset-0 bg-blue-900 bg-opacity-70 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setViewProduct(null)}
              className="absolute top-4 right-4 z-10 text-blue-500 hover:text-red-500 bg-white rounded-full p-2 shadow-md transition-colors"
            >
              <FaTimes className="text-lg" />
            </button>

            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <img
                  src={`http://localhost:5001/${viewProduct.image}`}
                  alt={viewProduct.stock?.name || viewProduct.description}
                  className="w-full h-72 md:h-full object-cover"
                />
              </div>
              
              <div className="md:w-1/2 p-6">
                <div className="mb-5">
                  <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-3 font-medium">
                    {viewProduct.category}
                  </span>
                  <h2 className="text-2xl font-bold text-blue-900 mb-3">
                    {viewProduct.stock?.name || "Unnamed Product"}
                  </h2>
                  <p className="text-blue-700 mb-5 leading-relaxed">
                    {viewProduct.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      Rs.{viewProduct.price}
                    </p>
                    {viewProduct.stock?.quantity === 0 && (
                      <p className="text-red-500 text-sm mt-1">Out of stock</p>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    <div className="flex text-amber-400 mr-1">
                      <FaStar size={14} />
                      <FaStar size={14} />
                      <FaStar size={14} />
                      <FaStar size={14} />
                      <FaStar size={14} />
                    </div>
                    <span className="text-blue-500 text-sm">(24 reviews)</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleAddToCart(viewProduct)}
                    disabled={viewProduct.stock?.quantity === 0}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300 font-medium ${
                      viewProduct.stock?.quantity === 0
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white shadow-md"
                    }`}
                  >
                    <FaCartPlus /> Add to Cart
                  </button>
                  <button
                    onClick={() => handleBuyNow(viewProduct)}
                    disabled={viewProduct.stock?.quantity === 0}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg transition-all duration-300 font-medium ${
                      viewProduct.stock?.quantity === 0
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white shadow-md"
                    }`}
                  >
                    <FaBolt /> Buy Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListing;