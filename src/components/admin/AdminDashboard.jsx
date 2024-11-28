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
  Lock,
  BadgeCheck,
  BarChart
} from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../../firebase/config';
import { PERMISSIONS, getUserRole } from '../../models/userRoles';
import UserContent from './users/UserContent';
import ViewUsers from './users/ViewUsers';
import AddUser from './users/AddUser';
import UserPermissions from './users/UserPermissions';

const AdminDashboard = () => {
  const [expandedCard, setExpandedCard] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedCard, setSelectedCard] = useState(null);
  const [selectedSubItem, setSelectedSubItem] = useState(null);

  // Admin-specific cards
  const adminCards = [
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
      icon: Lock,
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

  // Welcome page cards (will show for both admin and permitted users)
  const welcomeCards = [
    {
      icon: FileText,
      text: 'Stake Holder Request',
      subItems: ['New Request', 'Update', 'Pending'],
      path: 'stakeholder',
      color: 'emerald'
    },
    {
      icon: UserCheck,
      text: 'Background Check Request',
      subItems: ['New Request', 'Update', 'Pending'],
      path: 'background',
      color: 'emerald'
    },
    {
      icon: BadgeCheck,
      text: 'Badge Request',
      subItems: ['New Request', 'Pending'],
      path: 'badge',
      color: 'emerald'
    },
    {
      icon: Key,
      text: 'Access Request',
      subItems: ['New Request', 'Update', 'Pending'],
      path: 'access',
      color: 'emerald'
    },
    {
      icon: Users,
      text: 'Attendance',
      subItems: ['New Request', 'Update', 'Pending'],
      path: 'attendance',
      color: 'emerald'
    },
    {
      icon: UserPlus,
      text: 'Visitors Management',
      subItems: ['New Request', 'Update', 'Pending'],
      path: 'visitors',
      color: 'emerald'
    },
    {
      icon: BarChart,
      text: 'Reports',
      subItems: ['SHR Report', 'BCR Report', 'BR Report', 'Access Report', 'Attendance Report', 'Visitors Report'],
      path: 'reports',
      color: 'emerald'
    }
  ];

  // Combine admin and welcome cards
  const allCards = [...adminCards, ...welcomeCards];

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

  // ... rest of your component code (renderContent, etc.) remains the same

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Top Navigation Bar */}
      <div className="fixed top-0 right-0 left-0 h-16 bg-white shadow-sm z-50">
        {/* ... navigation bar content ... */}
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
