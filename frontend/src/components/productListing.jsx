import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSearch, FaCartPlus, FaBolt, FaShoppingCart } from "react-icons/fa";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productRes = await axios.get("http://localhost:5001/api/products");
        setProducts(productRes.data);

        // Fetch categories dynamically from stock
        const stockRes = await axios.get("http://localhost:5001/api/stock");
        const uniqueCategories = [
          ...new Set(stockRes.data.map((s) => s.category).filter(Boolean)),
        ].sort();
        setCategories(uniqueCategories);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter products by search & selected category
  let filtered = products.filter(
    (p) =>
      p.description.toLowerCase().includes(search.toLowerCase()) &&
      (category ? p.category === category : true)
  );

  // Sort products
  if (sort === "low-high") filtered.sort((a, b) => a.price - b.price);
  if (sort === "high-low") filtered.sort((a, b) => b.price - a.price);

  return (
    <div className="p-4 md:p-6 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen">
      {/* Top Bar */}
      <div className="flex flex-wrap justify-between items-center mb-6 gap-3">
        <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow w-full sm:w-1/3">
          <FaSearch className="text-gray-500 mr-2" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none w-full"
          />
        </div>

        {/* Category Filter */}
        <select
          className="border rounded-lg px-3 py-2"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat, idx) => (
            <option key={idx} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          className="border rounded-lg px-3 py-2"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort by</option>
          <option value="low-high">Price: Low → High</option>
          <option value="high-low">Price: High → Low</option>
        </select>

        {/* Cart */}
        <div className="relative">
          <FaShoppingCart className="text-2xl sm:text-3xl cursor-pointer text-blue-600" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
            0
          </span>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <p className="text-center text-gray-600">Loading products...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">No products found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md rounded-xl p-3 flex flex-col"
            >
              <div className="h-32 w-full flex items-center justify-center mb-2 overflow-hidden rounded-md bg-gray-100">
                <img
                  src={`http://localhost:5001/${product.image}`}
                  alt={product.name || product.description}
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <h3 className="text-md font-semibold mb-1">
                {product.name || "Unnamed Product"}
              </h3>
              <p className="text-gray-600 text-sm mb-1 truncate">{product.description}</p>
              <p className="text-blue-600 font-semibold text-sm mb-2">Rs. {product.price}</p>

              <div className="flex justify-between mt-auto">
                <button className="flex items-center bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600 text-xs">
                  <FaCartPlus className="mr-1" /> Add
                </button>
                <button className="flex items-center bg-yellow-500 text-white px-2 py-1 rounded-lg hover:bg-yellow-600 text-xs">
                  <FaBolt className="mr-1" /> Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListing;
