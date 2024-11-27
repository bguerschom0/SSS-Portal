import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, User, ChevronDown, FileText, UserCheck, BadgeCheck, 
  BarChart, Key, Users, UserPlus
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: i => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" } }),
  hover: { scale: 1.02, transition: { duration: 0.3 } }
};

const SubMenuVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto' }
};

const menuItems = [
  { icon: FileText, text: 'Stake Holder Request', subItems: ['New', 'Update', 'Pending'], path: 'stakeholder', permissions: ['stakeholder_new', 'stakeholder_update', 'stakeholder_pending'] },
  { icon: UserCheck, text: 'Background Check Request', subItems: ['New', 'Update', 'Pending'], path: 'background', permissions: ['background_new', 'background_update', 'background_pending'] },
  { icon: BadgeCheck, text: 'Badge Request', subItems: ['New', 'Pending'], path: 'badge', permissions: ['badge_new', 'badge_pending'] },
  { icon: Key, text: 'Access Request', subItems: ['New', 'Update', 'Pending'], path: 'access', permissions: ['access_new', 'access_update', 'access_pending'] },
  { icon: Users, text: 'Attendance', subItems: ['New', 'Update', 'Pending'], path: 'attendance', permissions: ['attendance_new', 'attendance_update', 'attendance_pending'] },
  { icon: UserPlus, text: 'Visitors Management', subItems: ['New', 'Update', 'Pending'], path: 'visitors', permissions: ['visitors_new', 'visitors_update', 'visitors_pending'] },
  { icon: BarChart, text: 'Reports', subItems: ['SHR', 'BCR', 'BR', 'Access', 'Attendance', 'Visitors'], path: 'reports', permissions: ['report_shr', 'report_bcr', 'report_br', 'report_access', 'report_attendance', 'report_visitors'] }
];

const WelcomePage = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [expandedCard, setExpandedCard] = useState(null);
  const [filteredMenuItems, setFilteredMenuItems] = useState([]);
  const { userProfile, hasPermission, isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (userProfile) {
      if (isAdmin()) {
        setFilteredMenuItems(menuItems);
      } else {
        setFilteredMenuItems(menuItems.filter(item => 
          item.permissions.every(p => hasPermission(item.path, p))
        ));
      }
    }
  }, [userProfile, hasPermission, isAdmin]);

  const handleCardClick = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const handleSubItemClick = (path, subItem) => {
    navigate(`/${path}/${subItem.toLowerCase().replace(/\s+/g, '-')}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
              <div className="ml-4">
                <div className="text-sm text-gray-500">
                  {currentTime.toLocaleDateString()} {currentTime.toLocaleTimeString()}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">Welcome, {userProfile?.email || 'User'}</div>
              <button onClick={() => auth.signOut()} className="flex items-center text-gray-600 hover:text-red-600 transition">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-24">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 py-6 mb-8"
        >
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-2xl font-bold text-white">Welcome to the Portal</h2>
            <p className="text-emerald-50 mt-1">Select an option to get started</p>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-6">
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4" initial="hidden" animate="visible">
            {filteredMenuItems.map((item, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={cardVariants}
                whileHover="hover"
                onClick={() => handleCardClick(index)}
                className="bg-white rounded-lg shadow-sm overflow-hidden cursor-pointer group"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-lg bg-emerald-50 group-hover:bg-emerald-100 transition">
                      <item.icon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <motion.div
                      animate={{ rotate: expandedCard === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-emerald-600" />
                    </motion.div>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">{item.text}</h3>
                  <p className="text-xs text-gray-500">{item.subItems.length} actions available</p>
                </div>

                <AnimatePresence>
                  {expandedCard === index && (
                    <motion.div
                      variants={SubMenuVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="border-t border-gray-100 bg-emerald-50"
                    >
                      <div className="p-3 space-y-1">
                        {item.subItems.map((subItem, subIndex) => (
                          <motion.button
                            key={subIndex}
                            onClick={() => handleSubItemClick(item.path, subItem)}
                            whileHover={{ x: 4 }}
                            className="w-full text-left text-sm px-3 py-2 rounded text-gray-600 hover:text-emerald-600 hover:bg-emerald-100 transition"
                            disabled={!hasPermission(item.path, subItem.toLowerCase().replace(/\s+/g, '_'))}
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
