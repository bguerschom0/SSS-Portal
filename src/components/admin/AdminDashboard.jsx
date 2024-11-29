import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, User, ChevronDown, FileText, UserCheck, Settings,
  Bell, Clock, Shield, Users, Key, UserPlus, Building2,
  Lock, BadgeCheck, BarChart
} from 'lucide-react';
import { db, auth } from '../../firebase/config';
import { collection, getDocs } from 'firebase/firestore';
import { getUserRole } from '../../models/userRoles';
import StakeHolder from '../dashboard/StakeHolder';
import BackgroundCheck from '../dashboard/BackgroundCheck';
import BadgeRequest from '../dashboard/BadgeRequest';
import AccessRequest from '../dashboard/AccessRequest';
import Attendance from '../dashboard/Attendance';
import VisitorsManagement from '../dashboard/VisitorsManagement';
import UserContent from './users/UserContent';
import { useTheme } from '../../contexts/ThemeContext';
import { themeColors, darkModeClasses, lightModeClasses } from '../../styles/theme';
import TopNavigation from '../shared/TopNavigation';

const menuItems = [
  {
    icon: Users,
    text: 'User Management',
    subItems: ['View Users', 'Add User', 'User Permissions'],
    path: 'users'
  },
  {
    icon: Shield,
    text: 'Role Management',
    subItems: ['View Roles', 'Create Role', 'Role Permissions'],
    path: 'roles'
  },
  {
    icon: Building2,
    text: 'Department Management',
    subItems: ['View Departments', 'Add Department'],
    path: 'departments'
  },
  {
    icon: Lock,
    text: 'Access Control',
    subItems: ['Access Levels', 'Access Groups', 'Access Policies'],
    path: 'access'
  },
  {
    icon: FileText,
    text: 'Stake Holder Request',
    subItems: ['New Request', 'Update', 'Pending'],
    path: 'stakeholder'
  },
  {
    icon: UserCheck,
    text: 'Background Check Request',
    subItems: ['New Request', 'Update', 'Pending'],
    path: 'background'
  },
  {
    icon: BadgeCheck,
    text: 'Badge Request',
    subItems: ['New Request', 'Pending'],
    path: 'badge'
  },
  {
    icon: Key,
    text: 'Access Request',
    subItems: ['New Request', 'Update', 'Pending'],
    path: 'access_request'
  },
  {
    icon: Users,
    text: 'Attendance',
    subItems: ['New Request', 'Update', 'Pending'],
    path: 'attendance'
  },
  {
    icon: UserPlus,
    text: 'Visitors Management',
    subItems: ['New Request', 'Update', 'Pending'],
    path: 'visitors'
  },
  {
    icon: BarChart,
    text: 'Reports',
    subItems: ['SHR Report', 'BCR Report', 'BR Report', 'Access Report', 'Attendance Report', 'Visitors Report'],
    path: 'reports'
  }
];

const AdminDashboard = ({ user }) => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCard, setSelectedCard] = useState(() => {
    return localStorage.getItem('selectedCard') || null;
  });

  const [selectedSubItem, setSelectedSubItem] = useState(() => {
    return localStorage.getItem('selectedSubItem') || null;
  });

  // Update localStorage when selection changes
  useEffect(() => {
    if (selectedCard) {
      localStorage.setItem('selectedCard', selectedCard);
    } else {
      localStorage.removeItem('selectedCard');
    }
    
    if (selectedSubItem) {
      localStorage.setItem('selectedSubItem', selectedSubItem);
    } else {
      localStorage.removeItem('selectedSubItem');
    }
  }, [selectedCard, selectedSubItem]);
  const { theme, colorScheme } = useTheme();
  const [greetingTime, setGreetingTime] = useState('');

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = await Promise.all(querySnapshot.docs.map(async doc => {
        const userData = doc.data();
        const roleData = await getUserRole(doc.id);
        return {
          id: doc.id,
          ...userData,
          ...roleData
        };
      }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
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
                            setSelectedCard(item.path);
                            setSelectedSubItem(subItem);
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
        </div>
      );
    }

    switch (selectedCard) {
      case 'stakeholder':
        return <StakeHolder onNavigate={setSelectedSubItem} subItem={selectedSubItem} />;
      case 'background':
        return <BackgroundCheck onNavigate={setSelectedSubItem} subItem={selectedSubItem} />;
      case 'badge':
        return <BadgeRequest onNavigate={setSelectedSubItem} subItem={selectedSubItem} />;
      case 'access_request':
        return <AccessRequest onNavigate={setSelectedSubItem} subItem={selectedSubItem} />;
      case 'attendance':
        return <Attendance onNavigate={setSelectedSubItem} subItem={selectedSubItem} />;
      case 'visitors':
        return <VisitorsManagement onNavigate={setSelectedSubItem} subItem={selectedSubItem} />;
      case 'users':
        return <UserContent selectedSubItem={selectedSubItem} users={users} fetchUsers={fetchUsers} />;
      default:
        return null;
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    fetchUsers();
    setGreetingTime(getGreeting());
    return () => clearInterval(timer);
  }, []);

  // Get theme-specific classes
  const getThemeClasses = () => {
    const colors = themeColors[colorScheme];
    const modeClasses = theme === 'dark' ? darkModeClasses : lightModeClasses;
  
    // Add immediate color updates to all themed elements
    document.documentElement.style.setProperty('--theme-color', colors.primary);
  
    return {
      background: `${modeClasses.background} transition-colors duration-200`,
      card: `${modeClasses.card} shadow-sm transition-colors duration-200`,
      cardHover: `${modeClasses.hover} ${colors.hover} transition-colors duration-200`,
      text: modeClasses.text,
      accent: colors.bg,
      accentLight: colors.light,
      border: modeClasses.border
    };
  };

  const themeClasses = getThemeClasses();

  // Enhanced greeting component
  const WelcomeGreeting = () => (
    <div className={`${themeClasses.card} rounded-lg p-8 mb-8`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-4 mb-4">
          <div className={`p-3 ${themeClasses.accentLight} rounded-full`}>
            <User className={`h-8 w-8 ${themeColors[colorScheme].text}`} />
          </div>
          <div>
            <h1 className={`text-3xl font-bold ${themeClasses.text}`}>
              {greetingTime}, {user?.displayName || user?.email?.split('@')[0]}!
            </h1>
            <p className="text-gray-500 mt-1">
              Welcome to your admin dashboard. Here's your overview.
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${themeClasses.card} p-4 rounded-lg border ${themeClasses.border}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <p className={`text-2xl font-semibold ${themeClasses.text}`}>
                  {users.length}
                </p>
              </div>
              <div className={`p-3 ${themeClasses.accentLight} rounded-lg`}>
                <Users className={`h-6 w-6 ${themeColors[colorScheme].text}`} />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${themeClasses.card} p-4 rounded-lg border ${themeClasses.border}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Requests</p>
                <p className={`text-2xl font-semibold ${themeClasses.text}`}>
                  {notifications}
                </p>
              </div>
              <div className={`p-3 ${themeClasses.accentLight} rounded-lg`}>
                <Bell className={`h-6 w-6 ${themeColors[colorScheme].text}`} />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className={`${themeClasses.card} p-4 rounded-lg border ${themeClasses.border}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Sessions</p>
                <p className={`text-2xl font-semibold ${themeClasses.text}`}>
                  {/* Add active sessions count */}
                  12
                </p>
              </div>
              <div className={`p-3 ${themeClasses.accentLight} rounded-lg`}>
                <Shield className={`h-6 w-6 ${themeColors[colorScheme].text}`} />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
</div>
  );

  return (
    <div className={`min-h-screen ${themeClasses.background}`}>
      <TopNavigation user={user} onLogout={handleLogout} />
      

      <main className="transition-all duration-300 pt-24 px-6 pb-8">
        {!selectedCard && <WelcomeGreeting />}

        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );

    return (
      <div className={`min-h-screen ${themeClasses.background} transition-colors duration-200`}>
        <TopNavigation user={user} onLogout={handleLogout} />
        <main className={`transition-all duration-200 pt-24 px-6 pb-8 ${themeClasses.text}`}>
          {!selectedCard && <WelcomeGreeting />}
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    );
};

export default AdminDashboard;
