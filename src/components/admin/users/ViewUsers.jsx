// src/components/admin/users/ViewUsers.jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Trash2, 
  Edit, 
  UserPlus,
  Loader,
  AlertCircle,
  Mail,
  Phone,
  Calendar
} from 'lucide-react';
import { collection, query, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import CollapsibleSidebar from '../../shared/CollapsibleSidebar';

const ViewUsers = ({ onNavigate }) => {
  // State management
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    department: 'all',
    role: 'all',
    status: 'all'
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const userDocs = await getDocs(usersRef);
      
      const usersData = await Promise.all(userDocs.docs.map(async (doc) => {
        const userData = { id: doc.id, ...doc.data() };
        // Get user roles
        const roleDoc = await getDoc(doc(db, 'user_roles', doc.id));
        const roleData = roleDoc.exists() ? roleDoc.data() : { role: 'user' };
        
        return {
          ...userData,
          role: roleData.role,
          permissions: roleData.permissions || []
        };
      }));

      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({
        type: 'error',
        text: 'Failed to fetch users. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      setLoading(true);
      await deleteDoc(doc(db, 'users', userId));
      await deleteDoc(doc(db, 'user_roles', userId));
      await deleteDoc(doc(db, 'permissions', userId));
      
      setMessage({
        type: 'success',
        text: 'User deleted successfully'
      });
      
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      setMessage({
        type: 'error',
        text: 'Failed to delete user. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesDepartment = filters.department === 'all' || user.department === filters.department;
    const matchesRole = filters.role === 'all' || user.role === filters.role;
    const matchesStatus = filters.status === 'all' || user.status === filters.status;

    return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <CollapsibleSidebar activePage="users" onNavigate={onNavigate} />
      
      <div className="transition-all duration-300 ease-in-out pl-16">
        <div className="p-8">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage user accounts, roles, and permissions
              </p>
            </div>

            {/* Action Bar */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Filter className="h-5 w-5 mr-2 text-gray-400" />
                Filters
              </button>

              {/* Add User Button */}
              <button
                onClick={() => onNavigate('users', 'Add User')}
                className="flex items-center justify-center px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
              >
                <UserPlus className="h-5 w-5 mr-2" />
                Add User
              </button>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-6"
                >
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Department
                        </label>
                        <select
                          value={filters.department}
                          onChange={(e) => setFilters({ ...filters, department: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="all">All Departments</option>
                          <option value="IT">IT</option>
                          <option value="HR">HR</option>
                          <option value="Finance">Finance</option>
                          <option value="Operations">Operations</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <select
                          value={filters.role}
                          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="all">All Roles</option>
                          <option value="admin">Admin</option>
                          <option value="user">User</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={filters.status}
                          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="all">All Status</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message Display */}
            <AnimatePresence>
              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`mb-6 p-4 rounded-lg flex items-center ${
                    message.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <span>{message.text}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="min-w-full divide-y divide-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center">
                          <Loader className="h-6 w-6 mx-auto animate-spin text-emerald-500" />
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                  <span className="text-emerald-600 font-medium">
                                    {user.firstName?.[0]}{user.lastName?.[0]}
                                  </span>
                                </div>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {user.department}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col text-sm text-gray-500">
                              <div className="flex items-center">
                                <Mail className="h-4 w-4 mr-1" />
                                {user.email}
                              </div>
                              {user.phoneNumber && (
                                <div className="flex items-center mt-1">
                                  <Phone className="h-4 w-4 mr-1" />
                                  {user.phoneNumber}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status || 'active'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex space-x-3">
                              <button
                                onClick={() => onNavigate('users', 'Edit User', user.id)}
                                className="text-emerald-600 hover:text-emerald-900"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewUsers;
