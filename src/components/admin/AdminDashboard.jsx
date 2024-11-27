import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronDown,
    FileText, 
    Settings,
    Bell,
    Clock,
    Shield,
    Users,
    Building2,
    Lock,
    User,
    LogOut
  } from 'lucide-react';
  
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { PERMISSIONS, getUserRole } from '../../models/userRoles';

// Import the remaining components
import ViewUsers from './users/ViewUsers';
import AddUser from './users/AddUser';
import UserPermissions from './users/UserPermissions';
import ViewRoles from './roles/ViewRoles';
import CreateRole from './roles/CreateRole';
import RolePermissions from './roles/RolePermissions';
import ViewDepartments from './departments/ViewDepartments';
import AddDepartment from './departments/AddDepartment';
import AccessLevels from './access/AccessLevels';
import AccessGroups from './access/AccessGroups';
import AccessPolicies from './access/AccessPolicies';
import UserReports from './reports/UserReports';
import AccessReports from './reports/AccessReports';
import AuditLogs from './reports/AuditLogs';
import GeneralSettings from './settings/GeneralSettings';
import SecuritySettings from './settings/SecuritySettings';
import EmailSettings from './settings/EmailSettings';

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
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
};

const handleLogout = async () => {
    try {
      await auth.signOut();
      // Add your navigation logic here
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };
  

  const handleCardClick = (index, path, subItem) => {
    setExpandedCard(expandedCard === index ? null : index);
    setSelectedCard(path);
    setSelectedSubItem(subItem);
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
              onClick={() => handleCardClick(index, item.path, item.subItems[0])}
            >
              {/* ... (rest of the card content remains the same) */}
            </motion.div>
          ))}
        </div>
      );
    }

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
            {selectedSubItem === 'View Users' && <ViewUsers />}
            {selectedSubItem === 'Add User' && <AddUser />}
            {selectedSubItem === 'User Permissions' && <UserPermissions />}
          </div>
        );
      case 'roles':
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
            {selectedSubItem === 'View Roles' && <ViewRoles />}
            {selectedSubItem === 'Create Role' && <CreateRole />}
            {selectedSubItem === 'Role Permissions' && <RolePermissions />}
          </div>
        );
      case 'departments':
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
            {selectedSubItem === 'View Departments' && <ViewDepartments />}
            {selectedSubItem === 'Add Department' && <AddDepartment />}
          </div>
        );
      case 'access':
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
            {selectedSubItem === 'Access Levels' && <AccessLevels />}
            {selectedSubItem === 'Access Groups' && <AccessGroups />}
            {selectedSubItem === 'Access Policies' && <AccessPolicies />}
          </div>
        );
      case 'reports':
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
            {selectedSubItem === 'User Reports' && <UserReports />}
            {selectedSubItem === 'Access Reports' && <AccessReports />}
            {selectedSubItem === 'Audit Logs' && <AuditLogs />}
          </div>
        );
      case 'settings':
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
            {selectedSubItem === 'General Settings' && <GeneralSettings />}
            {selectedSubItem === 'Security Settings' && <SecuritySettings />}
            {selectedSubItem === 'Email Settings' && <EmailSettings />}
          </div>
        );
      default:
        return null;
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
            <span className="text-xl font-semibold text-gray-800">Admin Portal</span>
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
