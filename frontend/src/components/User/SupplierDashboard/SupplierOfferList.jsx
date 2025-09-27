import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaBox,
  FaCalendarAlt,
  FaSearch,
  FaFilter,
  FaTimes,
  FaEye,
  FaSort,
  FaSortUp,
  FaSortDown
} from "react-icons/fa";

export default function SupplierOfferList() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const navigate = useNavigate();

  // Edit Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    pricePerUnit: "",
    quantityOffered: "",
    deliveryDate: "",
  });

  // Decode JWT to get supplier ID 
  const getSupplierIdFromToken = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return null;
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.id;
    } catch (err) {
      return null;
    }
  };

  const supplierId = getSupplierIdFromToken();

  // Fetch offers
  const fetchOffers = async () => {
    if (!supplierId) {
      toast.error("You must be logged in as a supplier.");
      navigate("/UserLogin");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:5001/api/offer/my-offers",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Filter only the logged-in supplier's offers
      const myOffers = response.data.filter(
        (offer) => offer.supplierId._id === supplierId
      );
      setOffers(response.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        toast.error("Access forbidden. Make sure you are logged in as a supplier.");
        navigate("/UserLogin");
      } else {
        toast.error(err.response?.data?.message || "Error fetching offers");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  //Handle Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this offer?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5001/api/offer/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Offer deleted successfully!");
      setOffers(offers.filter((offer) => offer._id !== id));
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error deleting offer");
    }
  };

  // Handle Open Edit Modal
  const handleEdit = (offer) => {
    setSelectedOffer(offer._id);
    setFormData({
      title: offer.title,
      description: offer.description,
      pricePerUnit: offer.pricePerUnit,
      quantityOffered: offer.quantityOffered,
      deliveryDate: offer.deliveryDate ? offer.deliveryDate.split("T")[0] : "",
    });
    setShowModal(true);
  };

  // Handle Update Offer
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5001/api/offer/${selectedOffer}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Offer updated successfully!");
      setShowModal(false);
      setSelectedOffer(null);
      fetchOffers();
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error updating offer");
    }
  };

  // Handle Create Offer Redirect
  const handleCreateOffer = () => {
    navigate("/AddSupplierOffer");
  };

  // Handle Sorting
  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort offers
  const filteredAndSortedOffers = React.useMemo(() => {
    let filtered = offers.filter(offer => {
      const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           offer.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "All" || offer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  }, [offers, searchTerm, statusFilter, sortConfig]);

  // Get status counts
  const statusCounts = {
    All: offers.length,
    Pending: offers.filter(o => o.status === "Pending").length,
    Approved: offers.filter(o => o.status === "Approved").length,
    Rejected: offers.filter(o => o.status === "Rejected").length,
  };

  //Sort icon component
  const SortIcon = ({ columnKey }) => {
    if (sortConfig.key !== columnKey) {
      return <FaSort className="text-blue-300 ml-1" />;
    }
    return sortConfig.direction === 'ascending' ? 
      <FaSortUp className="text-blue-600 ml-1" /> : 
      <FaSortDown className="text-blue-600 ml-1" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 lg:p-8">
      
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-8">
          <div className="text-center lg:text-left mb-6 lg:mb-0">
            <div className="flex items-center justify-center lg:justify-start space-x-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                <FaBox className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                  My Supplier Offers
                </h1>
                <p className="text-blue-600 text-lg mt-1">
                  Manage your supply offers in table format
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleCreateOffer}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5 flex items-center space-x-2"
          >
            <FaPlus className="text-lg" />
            <span>New Offer</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(statusCounts).map(([status, count]) => (
            <div 
              key={status}
              className={`bg-white rounded-xl p-4 shadow-lg border-l-4 ${
                status === 'All' ? 'border-l-blue-500' :
                status === 'Pending' ? 'border-l-yellow-500' :
                status === 'Approved' ? 'border-l-green-500' : 'border-l-red-500'
              } transition-transform hover:scale-105 cursor-pointer`}
              onClick={() => setStatusFilter(status)}
            >
              <div className="flex justify-between items-center">
                <span className="text-gray-600 text-sm font-medium">{status}</span>
                <span className={`text-lg font-bold ${
                  status === 'All' ? 'text-blue-600' :
                  status === 'Pending' ? 'text-yellow-600' :
                  status === 'Approved' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {count}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className={`h-2 rounded-full ${
                    status === 'All' ? 'bg-blue-500' :
                    status === 'Pending' ? 'bg-yellow-500' :
                    status === 'Approved' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(count / Math.max(1, offers.length)) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 w-full">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
              <input
                type="text"
                placeholder="Search offers by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-blue-50 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-900 placeholder-blue-400"
              />
            </div>
            
            <div className="flex gap-3 w-full lg:w-auto">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-blue-900"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Offers Table */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-600 text-lg">Loading your offers...</p>
          </div>
        ) : filteredAndSortedOffers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaBox className="text-3xl text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-blue-800 mb-3">No Offers Found</h3>
            <p className="text-blue-600 mb-6 max-w-md mx-auto">
              {offers.length === 0 
                ? "You haven't submitted any supplier offers yet. Create your first offer to get started!"
                : "No offers match your current search and filter criteria."
              }
            </p>
            <button
              onClick={handleCreateOffer}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Create Your First Offer
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <tr>
                    <th 
                      className="py-4 px-6 text-left cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                      onClick={() => handleSort('title')}
                    >
                      <div className="flex items-center">
                        Title
                        <SortIcon columnKey="title" />
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left">Description</th>
                    <th 
                      className="py-4 px-6 text-left cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                      onClick={() => handleSort('pricePerUnit')}
                    >
                      <div className="flex items-center">
                        Price/Unit (Rs)
                        <SortIcon columnKey="pricePerUnit" />
                      </div>
                    </th>
                    <th 
                      className="py-4 px-6 text-left cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                      onClick={() => handleSort('quantityOffered')}
                    >
                      <div className="flex items-center">
                        Quantity
                        <SortIcon columnKey="quantityOffered" />
                      </div>
                    </th>
                    <th 
                      className="py-4 px-6 text-left cursor-pointer hover:bg-blue-700 transition-colors duration-200"
                      onClick={() => handleSort('deliveryDate')}
                    >
                      <div className="flex items-center">
                        Delivery Date
                        <SortIcon columnKey="deliveryDate" />
                      </div>
                    </th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-100">
                  {filteredAndSortedOffers.map((offer) => (
                    <tr key={offer._id} className="hover:bg-blue-50 transition-colors duration-200 group">
                      <td className="py-4 px-6">
                        <div className="font-semibold text-blue-900 group-hover:text-blue-700">
                          {offer.title}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="max-w-xs">
                          <p className="text-blue-800 line-clamp-2">{offer.description}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-blue-600">Rs {offer.pricePerUnit}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                          {offer.quantityOffered}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center text-blue-700">
                          <FaCalendarAlt className="mr-2 text-blue-500" />
                          {offer.deliveryDate
                            ? new Date(offer.deliveryDate).toLocaleDateString()
                            : "-"
                          }
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                          offer.status === "Pending"
                            ? "bg-yellow-500"
                            : offer.status === "Approved"
                            ? "bg-green-500"
                            : "bg-red-500"
                        }`}>
                          {offer.status}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex justify-center space-x-2">
                          {offer.status === "Pending" ? (
                            <>
                              <button
                                onClick={() => handleEdit(offer)}
                                className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-lg transition-colors duration-200 group/btn"
                                title="Edit Offer"
                              >
                                <FaEdit className="group-hover/btn:scale-110 transition-transform" />
                              </button>
                              <button
                                onClick={() => handleDelete(offer._id)}
                                className="bg-red-100 hover:bg-red-200 text-red-600 p-2 rounded-lg transition-colors duration-200 group/btn"
                                title="Delete Offer"
                              >
                                <FaTrash className="group-hover/btn:scale-110 transition-transform" />
                              </button>
                            </>
                          ) : (
                            <span className="text-blue-400 text-sm">Read Only</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer */}
            <div className="bg-blue-50 px-6 py-4 border-t border-blue-200">
              <div className="flex justify-between items-center">
                <p className="text-blue-700 text-sm">
                  Showing <span className="font-bold">{filteredAndSortedOffers.length}</span> of{" "}
                  <span className="font-bold">{offers.length}</span> offers
                </p>
                <p className="text-blue-600 text-sm">
                  Sorted by:{" "}
                  <span className="font-bold">
                    {sortConfig.key ? `${sortConfig.key} (${sortConfig.direction})` : 'None'}
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/*Update Offer Modal*/}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Update Offer</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-blue-200 transition-colors duration-200 p-2 rounded-full hover:bg-blue-400"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
              <p className="text-blue-100 mt-1">Update your offer details</p>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Offer title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 text-blue-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Description</label>
                <textarea
                  placeholder="Offer description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 text-blue-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Price (Rs)</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.pricePerUnit}
                    onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 text-blue-900"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    placeholder="Quantity"
                    value={formData.quantityOffered}
                    onChange={(e) => setFormData({ ...formData, quantityOffered: e.target.value })}
                    className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 text-blue-900"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-blue-700 mb-2">Delivery Date</label>
                <input
                  type="date"
                  value={formData.deliveryDate}
                  onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                  className="w-full px-4 py-3 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-blue-50 text-blue-900"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-3 px-4 rounded-xl transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-3 px-4 rounded-xl shadow-lg transition-all duration-200"
                >
                  Update Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}