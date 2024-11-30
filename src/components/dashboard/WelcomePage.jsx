import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, User, ChevronDown, FileText, UserCheck, 
  BadgeCheck, BarChart, Clock, Settings, Bell, Key, 
  Users, UserPlus
} from 'lucide-react';
import { auth, db } from '../../firebase/config';
import { doc, onSnapshot } from 'firebase/firestore';

const PERMISSION_MAPPING = {
  stakeholder: {
    base: 'stakeholder',
    actions: {
      'New Request': 'new_request',
      'Update': 'update',
      'Pending': 'pending'
    }
  },
  background_check: {
    base: 'background_check',
    actions: {
      'New Request': 'new_request',
      'Update': 'update',
      'Pending': 'pending'
    }
  },
  badge_request: {
    base: 'badge_request',
    actions: {
      'New Request': 'new_request',
      'Pending': 'pending'
    }
  },
  access_request: {
    base: 'access_request',
    actions: {
      'New Request': 'new_request',
      'Update': 'update',
      'Pending': 'pending'
    }
  },
  attendance: {
    base: 'attendance',
    actions: {
      'New Request': 'new_request',
      'Update': 'update',
      'Pending': 'pending'
    }
  },
  visitors: {
    base: 'visitors',
    actions: {
      'New Request': 'new_request',
      'Update': 'update',
      'Pending': 'pending'
    }
  }
};

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
    path: 'access_request',
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
  }
];

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

const WelcomePage = ({ username, onLogout, userRole, onNavigate }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedCard, setExpandedCard] = useState(null);
  const [notifications, setNotifications] = useState(0);
  const [userPermissions, setUserPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let unsubscribe = () => {};

    const fetchPermissions = async () => {
      if (!auth.currentUser?.uid) {
        setLoading(false);
        return;
      }

      try {
        unsubscribe = onSnapshot(
          doc(db, 'user_roles', auth.currentUser.uid),
          (docSnapshot) => {
            if (docSnapshot.exists()) {
              const data = docSnapshot.data();
              const permissionsArray = Array.isArray(data?.permissions) 
                ? [...data.permissions] 
                : [];
              console.log('Permissions loaded:', permissionsArray);
              setUserPermissions(permissionsArray);
            } else {
              setUserPermissions([]);
            }
            setLoading(false);
          }
        );
      } catch (error) {
        console.error('Error fetching permissions:', error);
        setUserPermissions([]);
        setLoading(false);
      }
    };

    fetchPermissions();
    return () => unsubscribe();
  }, []);

  const checkUserPermissions = (permissions, menuItem) => {
    const mapping = PERMISSION_MAPPING[menuItem.permission];
    if (!mapping) return [];

    return menuItem.subItems.filter(subItem => {
      const requiredPermission = `${mapping.base}_${mapping.actions[subItem]}`;
      return permissions.includes(requiredPermission);
    });
  };

  const authorizedMenuItems = menuItems.filter(item => {
    const allowedSubItems = checkUserPermissions(userPermissions, item);
    return allowedSubItems.length > 0;
  }).map(item => ({
    ...item,
    subItems: checkUserPermissions(userPermissions, item)
  }));

  const handleCardClick = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleSubItemClick = (path, subItem) => {
    if (onNavigate) {
      onNavigate(path, subItem);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="fixed top-0 right-0 left-0 h-16 bg-white shadow-sm z-50">
        <div className="h-full px-6 mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <span className="text-xl font-semibold text-gray-800">SSS Portal</span>
          </div>

          <div className="flex items-center space-x-6">
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

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    {username?.split('@')[0]}
                  </span>
                  <span className="text-xs text-gray-500">{userRole}</span>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-24 px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-black p-8 mb-8"
        >
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-2">
              {getGreeting()}, {username?.split('@')[0]}!
            </h1>
            <p className="text-black text-lg">
              Select an option below to get started with your tasks
            </p>
          </div>
        </motion.div>

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
                              handleSubItemClick(item.path, subItem);
                            }}
                            whileHover={{ x: 4 }}
                            className="w-full text-left text-sm px-4 py-2 rounded-lg text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
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
