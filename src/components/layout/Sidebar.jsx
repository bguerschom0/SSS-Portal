import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Home, FileText, UserCheck, BadgeCheck, BarChart, ChevronDown, Key, Users, UserPlus, Shield, Menu } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const MenuItem = ({ icon, text, path, subItems, isActive, onItemClick, hasPermission }) => {
  const [isOpen, setIsOpen] = useState(false);
  const allowedSubItems = subItems?.filter(item => hasPermission(text.toLowerCase().replace(/\s+/g, ''), item.toLowerCase().replace(/\s+/g, '')));
  if (!allowedSubItems?.length) return null;

  return (
    <div className="mb-1">
      <button onClick={() => subItems ? setIsOpen(!isOpen) : onItemClick(path)} className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'}`}>
        {icon && <icon className="h-5 w-5 mr-3" />}
        <span className="flex-1 text-left text-sm font-medium">{text}</span>
        {subItems && <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />}
      </button>
      {isOpen && subItems && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="pl-11 py-1 space-y-1">
          {allowedSubItems.map((item, index) => (
            <button key={index} onClick={() => onItemClick(path, item)} className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors">
              {item}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const navigate = useNavigate();
  const { userProfile, hasPermission, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = useMemo(() => [
    { icon: Home, text: 'Dashboard', path: 'dashboard' },
    { icon: FileText, text: 'Stake Holder Request', path: 'stakeholder', subItems: ['New', 'Update', 'Pending'] },
    { icon: UserCheck, text: 'Background Check Request', path: 'background', subItems: ['New', 'Update', 'Pending'] },
    { icon: BadgeCheck, text: 'Badge Request', path: 'badge', subItems: ['New', 'Pending'] },
    { icon: Key, text: 'Access Request', path: 'access', subItems: ['New', 'Update', 'Pending'] },
    { icon: Users, text: 'Attendance', path: 'attendance', subItems: ['New', 'Update', 'Pending'] },
    { icon: UserPlus, text: 'Visitors Management', path: 'visitors', subItems: ['New', 'Update', 'Pending'] },
    { icon: BarChart, text: 'Reports', path: 'reports', subItems: ['SHR', 'BCR', 'BR', 'Access', 'Attendance', 'Visitors'] },
    ...(isAdmin() ? [{ icon: Shield, text: 'Admin Dashboard', path: 'admin' }] : [])
  ], [isAdmin]);

  const handleNavigate = (path, subItem) => {
    navigate(`/${path}/${subItem?.toLowerCase().replace(/\s+/g, '-')}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md">
        <Menu className="h-6 w-6 text-gray-600" />
      </button>
      <div className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className={`fixed inset-y-0 left-0 w-64 bg-white transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Sidebar content */}
        </div>
      </div>
      <div className="hidden lg:block fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
        {/* Sidebar content */}
      </div>
    </>
  );
};

export default Sidebar;
