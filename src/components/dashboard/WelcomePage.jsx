import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, 
  User, 
  ChevronDown,
  FileText, 
  UserCheck, 
  BadgeCheck, 
  BarChart,
  Clock,
  Settings,
  Bell,
  Key,
  Users,
  UserPlus
} from 'lucide-react';
import { auth } from '../../firebase/config';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  }),
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.2
    }
  }
};

const WelcomePage = ({ username, onLogout, userRole }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedCard, setExpandedCard] = useState(null);
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    {
      icon: FileText,
      text: 'Stake Holder Request',
      subItems: ['New Request', 'Update', 'Pending'],
      path: 'stakeholder',
      permission: 'stakeholder'
    },
    {
      icon: UserCheck,
      text: 'Background Check Request',
      subItems: ['New Request', 'Update', 'Pending'],
      path: 'background',
      permission: 'background_check'
    },
    {
      icon: BadgeCheck,
      text: 'Badge Request',
      subItems: ['New Request', 'Pending'],
      path: 'badge',
      permission: 'badge_request'
    },
    {
      icon: Key,
      text: 'Access Request',
      subItems: ['New Request', 'Update', 'Pending'],
      path: 'access',
      permission: 'access_request'
    },
    {
      icon: Users,
      text: 'Attendance',
      subItems: ['New Request', 'Update', 'Pending'],
      path: 'attendance',
      permission: 'attendance'
    },
    {
      icon: UserPlus,
      text: 'Visitors Management',
      subItems: ['New Request', 'Update', 'Pending'],
      path: 'visitors',
      permission: 'visitors'
    },
    {
      icon: BarChart,
      text: 'Reports',
      subItems: ['SHR Report', 'BCR Report', 'BR Report', 'Access Report', 'Attendance Report', 'Visitors Report'],
      path: 'reports',
      permission: 'reports'
    }
  ];

  const handleCardClick = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      onLogout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Filter menu items based on user permissions
  const authorizedMenuItems = menuItems.filter(item => 
    userRole?.permissions?.includes(item.permission)
  );

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
                  <span className="text-sm font-medium text-gray-700">{username}</span>
                  <span className="text-xs text-gray-500">User</span>
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
            <h1 className="text-3xl font-bold mb-2">Welcome back, {username}!</h1>
            <p className="text-black text-lg">
              Select an option below to get started with your tasks
            </p>
          </div>
        </motion.div>

        {/* Menu Grid */}
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="hidden"
            animate="visible"
          >
            {authorizedMenuItems.map((item, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                whileHover="hover"
                onClick={() => handleCardClick(index)}
                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer group"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-emerald-50 rounded-lg group-hover:bg-emerald-100 transition-colors">
                      <item.icon className="h-6 w-6 text-emerald-600" />
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
                              // Handle navigation
                            }}
                            whileHover={{ x: 4 }}
                            className="w-full text-left text-sm px-4 py-2 rounded-lg
                                     text-gray-600 hover:text-emerald-600
                                     hover:bg-emerald-50 transition-colors"
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
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
