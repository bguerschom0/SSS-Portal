import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home,
  FileText, 
  UserCheck, 
  BadgeCheck, 
  BarChart,
  ChevronDown,
  Key,
  Users,
  UserPlus
} from 'lucide-react';
const MenuItem = ({ icon: Icon, text, subItems, isActive, onItemClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors
                   ${isActive ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'}`}
      >
        <Icon className="h-5 w-5 mr-3" />
        <span className="flex-1 text-left text-sm font-medium">{text}</span>
        {subItems && (
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 
            ${isOpen ? 'transform rotate-180' : ''}`} />
        )}
      </button>
      {isOpen && subItems && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pl-11 py-1 space-y-1"
        >
          {subItems.map((item, index) => (
            <button
              key={index}
              onClick={() => onItemClick(text, item)}
              className="w-full text-left px-3 py-2 text-sm text-gray-600 
                       hover:text-emerald-600 hover:bg-emerald-50 rounded-md
                       transition-colors"
            >
              {item}
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};
const Sidebar = ({ activePage, onNavigate }) => {
  const menuItems = [
    {
      icon: Home,
      text: 'Dashboard',
      path: 'welcome'
    },
    {
      icon: FileText,
      text: 'Stake Holder Request',
      path: 'stakeholder',
      subItems: ['New Request', 'Update', 'Pending']
    },
    {
      icon: UserCheck,
      text: 'Background Check Request',
      path: 'background',
      subItems: ['New Request', 'Update', 'Pending']
    },
    {
      icon: BadgeCheck,
      text: 'Badge Request',
      path: 'badge',
      subItems: ['New Request', 'Pending']
    },
    {
      icon: Key,
      text: 'Access Request',
      path: 'access',
      subItems: ['New Request', 'Update', 'Pending']
    },
    {
      icon: Users,
      text: 'Attendance',
      path: 'attendance',
      subItems: ['New Request', 'Update', 'Pending']
    },
    {
      icon: UserPlus,
      text: 'Visitors Management',
      path: 'visitors',
      subItems: ['New Request', 'Update', 'Pending']
    },
    {
      icon: BarChart,
      text: 'Reports',
      path: 'reports',
      subItems: ['SHR Report', 'BCR Report', 'BR Report', 'Access Report', 'Attendance Report', 'Visitors Report']
    }
  ];
  return (
    <div className="w-64 bg-white h-full shadow-lg fixed left-0 top-0">
      {/* Logo Section */}
      <div className="h-16 border-b flex items-center px-6">
        <img 
          src="/logo.png"
          alt="Logo"
          className="h-8 w-auto"
        />
      </div>
      {/* Menu Items */}
      <div className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            icon={item.icon}
            text={item.text}
            subItems={item.subItems}
            isActive={activePage === item.path}
            onItemClick={(section, subItem) => {
              if (item.path === 'welcome') {
                onNavigate('welcome');
              } else {
                onNavigate(item.path, subItem);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};
export default Sidebar;
