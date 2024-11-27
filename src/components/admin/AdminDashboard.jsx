import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  User, 
  ChevronDown,
  FileText, 
  UserCheck, 
  Settings,
  Bell,
  Clock,
  Shield,
  Users,
  Key,
  UserPlus,
  Building2,
  LockKeyhole
} from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { PERMISSIONS, getUserRole } from '../../models/userRoles';

const menuItems = [
  {
    icon: Users,
    text: 'User Management',
    subItems: ['View Users', 'Add User', 'User Permissions'],
    path: 'users',
    color: 'blue'
  },
  {
    icon: Shield,
    text: 'Role Management',
    subItems: ['View Roles', 'Create Role', 'Role Permissions'],
    path: 'roles',
    color: 'purple'
  },
  {
    icon: Building2,
    text: 'Department Management',
    subItems: ['View Departments', 'Add Department'],
    path: 'departments',
    color: 'emerald'
  },
  {
    icon: LockKeyhole,
    text: 'Access Control',
    subItems: ['Access Levels', 'Access Groups', 'Access Policies'],
    path: 'access',
    color: 'orange'
  },
  {
    icon: FileText,
    text: 'System Reports',
    subItems: ['User Reports', 'Access Reports', 'Audit Logs'],
    path: 'reports',
    color: 'indigo'
  },
  {
    icon: Settings,
    text: 'System Settings',
    subItems: ['General Settings', 'Security Settings', 'Email Settings'],
    path: 'settings',
    color: 'gray'
  }
];

const AdminDashboard = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedSubItem, setSelectedSubItem] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchUsers();
    return () => clearInterval(timer);
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = [];
      
      for (const doc of querySnapshot.docs) {
        const userData = doc.data();
        const roleData = await getUserRole(doc.id);
        usersData.push({
          id: doc.id,
          ...userData,
          ...roleData
        });
      }
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserPermissions = async (userId, permissions) => {
    try {
      const userRoleRef = doc(db, 'user_roles', userId);
      const userRoleDoc = await getDoc(userRoleRef);

      if (!userRoleDoc.exists()) {
        await setDoc(userRoleRef, {
          role: 'user',
          permissions,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } else {
        await updateDoc(userRoleRef, {
          permissions,
          updatedAt: serverTimestamp()
        });
      }
      
      await fetchUsers();
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  const handleCardClick = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderContent = () => {
    if (!selectedCard) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer group"
              onClick={() => handleCardClick(index)}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 bg-${item.color}-50 rounded-lg group-hover:bg-${item.color}-100 transition-colors`}>
                    <item.icon className={`h-6 w-6 text-${item.color}-600`} />
                  </div>
                  <motion.div
                    animate={{ rotate: expandedCard === index ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-emerald-600" />
                  </motion.div>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.text}</h3>
                <p className="text-sm text-gray-500">
                  {item.subItems.length} actions available
                </p>
              </div>

              <AnimatePresence>
                {expandedCard === index && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t border-gray-100 bg-gray-50"
                  >
                    <div className="p-4 space-y-1">
                      {item.subItems.map((subItem, subIndex) => (
                        <motion.button
                          key={subIndex}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCard(item.path);
                            setSelectedSubItem(subItem);
                          }}
                          whileHover={{ x: 4 }}
                          className={`w-full text-left text-sm px-4 py-2 rounded-lg
                                   text-gray-600 hover:text-${item.color}-600
                                   hover:bg-${item.color}-50 transition-colors`}
                        >
                          {subItem}
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      );
    }

    // Render specific content based on selectedCard and selectedSubItem
    switch (selectedCard) {
      case 'users':
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">{selectedSubItem}</h2>
              <button
                onClick={() => setSelectedCard(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Back
              </button>
            </div>
            
            {selectedSubItem === 'User Permissions' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-4">User</th>
                      <th className="pb-4">Role</th>
                      <th className="pb-4">Permissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id} className="border-t">
                        <td className="py-4">{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(PERMISSIONS).map(([key, value]) => (
                              <label key={key} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={user.permissions?.includes(value)}
                                  onChange={(e) => {
                                    const newPermissions = e.target.checked
                                      ? [...(user.permissions || []), value]
                                      : (user.permissions || []).filter(p => p !== value);
                                    updateUserPermissions(user.id, newPermissions);
                                  }}
                                  className="mr-2"
                                />
                                {key}
                              </label>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Add other user management content based on selectedSubItem */}
          </div>
        );
      // Add cases for other cards (roles, departments, etc.)
      default:
        return (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">{selectedSubItem}</h2>
              <button
                onClick={() => setSelectedCard(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                Back
              </button>
            </div>
            <p>Content for {selectedSubItem}</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 right-0 left-0 h-16 bg-white shadow-sm z-50">
        <div className="h-full px-6 mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img 
              src="/logo.png"
              alt="Logo"
              className="h-8 w-auto"
            />
          </div>

          <div className="flex items-center space-x-6">
            {/* Time Display */}
            <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-lg">
              <Clock className="h-4 w-4 text-emerald-600" />
              <span className="text-sm font-medium text-gray-600">
                {currentTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true
                })}
              </span>
            </div>

            {/* Notifications */}
            <motion.div 
              className="relative cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="h-5 w-5 text-gray-500 hover:text-emerald-600 transition-colors" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full">
                  {notifications}
                </span>
              )}
            </motion.div>

            {/* Settings */}
            <motion.div
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Settings className="h-5 w-5 text-gray-500 hover:text-emerald-600 transition-colors" />
            </motion.div>

            {/* Divider */}
            <div className="h-6 w-px bg-gray-200" />

            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">Administrator</span>
                  <span className="text-xs text-gray-500">Admin Panel</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-24 px-6 pb-8">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-black p-8 mb-8"
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-black text-lg">
              Manage users, roles, and system settings
            </p>
          </div>
        </motion.div>

        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
