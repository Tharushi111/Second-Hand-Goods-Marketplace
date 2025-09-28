import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Pencil, Trash2, Search, Users, Filter, RefreshCw, X, Mail, Phone, Building, User, Shield } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function AllUsers() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Get admin token from localStorage
  const token = localStorage.getItem("adminToken");

  // Fetch all users
  const fetchUsers = async () => {
    if (!token) {
      toast.error("Admin not logged in");
      setUsers([]);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5001/api/user?role=${roleFilter}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const fetchedUsers = res.data?.users || res.data;
      setUsers(Array.isArray(fetchedUsers) ? fetchedUsers : []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const filteredUsers = users.filter(user =>
    user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

 // Delete user
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return;

  if (!token) {
    toast.error("Admin token not found. Please log in again.", { position: "top-center" });
    return;
  }

  try {
    const res = await axios.delete(`http://localhost:5001/api/user/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success(res.data?.message || "User deleted successfully", { position: "top-center" });
    fetchUsers();
  } catch (error) {
    const status = error.response?.status;
    if (status === 403) toast.error("Forbidden: You do not have permission", { position: "top-center" });
    else toast.error(error.response?.data?.message || "Failed to delete user", { position: "top-center" });

    console.error("Delete error:", error.response || error);
  }
};

  // Open update modal
  const handleUpdate = (user) => {
    setSelectedUser(user);
    setShowUpdateModal(true);
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedUser(prev => ({ ...prev, [name]: value }));
  };

  // Submit updated user data
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error("Admin token not found. Please log in again." ,{ position: "top-center" });
      return;
    }
    try {
      const res = await axios.put(
        `http://localhost:5001/api/user/${selectedUser._id}`,
        selectedUser,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(res.data?.message || "User updated successfully" ,{ position: "top-center" });
      setShowUpdateModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user", { position: "top-center" });
      console.error("Update error:", error.response || error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <motion.div className="max-w-7xl mx-auto" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {/* Header Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <Users size={32} className="text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">User Management</h1>
                <p className="text-blue-100 mt-1">Manage all users in the system</p>
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={fetchUsers} className="bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all duration-200 p-3 rounded-xl">
              <RefreshCw size={24} className={loading ? "animate-spin" : ""} />
            </motion.button>
          </div>
        </div>

        {/* Users Table */}
        <motion.div className="bg-white rounded-2xl shadow-lg overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Users List</h2>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm text-white backdrop-blur-sm">{filteredUsers.length} users found</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700 uppercase tracking-wider">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700 uppercase tracking-wider">Phone Number</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700 uppercase tracking-wider">Address</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-blue-700 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-blue-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan="5" className="px-6 py-12 text-center">Loading...</td></tr>
                ) : filteredUsers.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-12 text-center">No users found</td></tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user._id} className="hover:bg-blue-50/50">
                      <td className="px-6 py-4">{user.username}</td>
                      <td className="px-6 py-4">{user.email}</td>
                      <td className="px-6 py-4">{user.phone}</td>
                      <td className="px-6 py-4">{user.address}</td>
                      <td className="px-6 py-4">{user.role}</td>
                      <td className="px-6 py-4">{user.company || "-"}</td>
                      <td className="px-6 py-4 flex justify-center gap-3">
                        <motion.button onClick={() => handleUpdate(user)} className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                          <Pencil size={16} />
                        </motion.button>
                        <motion.button onClick={() => handleDelete(user._id)} className="p-2 bg-red-100 text-red-600 rounded-lg">
                          <Trash2 size={16} />
                        </motion.button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>

      {/* Update Modal */}
      {showUpdateModal && selectedUser && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-xl">
                    <User size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Update User</h2>
                    <p className="text-blue-100 text-sm">Edit user information</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowUpdateModal(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={20} />
                </motion.button>
              </div>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <User size={16} className="mr-2 text-blue-600" />
                  Username
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="username" 
                    value={selectedUser.username} 
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                  <User size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Mail size={16} className="mr-2 text-blue-600" />
                  Email
                </label>
                <div className="relative">
                  <input 
                    type="email" 
                    name="email" 
                    value={selectedUser.email} 
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                  <Mail size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Phone Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Phone size={16} className="mr-2 text-blue-600" />
                  Phone Number
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="phone" 
                    value={selectedUser.phone || ""} 
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Optional"
                  />
                  <Phone size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Address Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Building size={16} className="mr-2 text-blue-600" />
                  Address
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="adress" 
                    value={selectedUser.address || ""} 
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Optional"
                  />
                  <Building size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Role Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Shield size={16} className="mr-2 text-blue-600" />
                  User Role
                </label>
                <div className="relative">
                  <select 
                    name="role" 
                    value={selectedUser.role} 
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="supplier">Supplier</option>
                  </select>
                  <Shield size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Company Field */}
              <div className="space-y-2">
                <label className="flex items-center text-sm font-medium text-gray-700">
                  <Building size={16} className="mr-2 text-blue-600" />
                  Company
                </label>
                <div className="relative">
                  <input 
                    type="text" 
                    name="company" 
                    value={selectedUser.company || ""} 
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Optional"
                  />
                  <Building size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <motion.button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </motion.button>
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
                >
                  Update User
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}