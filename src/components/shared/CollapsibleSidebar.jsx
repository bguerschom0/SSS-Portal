// src/components/shared/CollapsibleSidebar.jsx
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

const MenuItem = ({ icon: Icon, text, subItems, isActive, onItemClick, isExpanded }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="mb-1 group">
      <button
        onClick={() => {
          if (subItems) {
            setIsOpen(!isOpen);
          } else {
            onItemClick(text);
          }
        }}
        className={`w-full flex items-center px-3 py-2 rounded-lg transition-colors relative
                   ${isActive ? 'bg-emerald-50 text-emerald-600' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-600'}`}
      >
        <Icon className="h-5 w-5" />
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: 'auto' }}
            exit={{ opacity: 0, width: 0 }}
            className="flex-1 ml-3 text-left text-sm font-medium whitespace-nowrap"
          >
            {text}
          </motion.span>
        )}
        {!isExpanded && (
          <div className="absolute left-14 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {text}
          </div>
        )}
        {subItems && isExpanded && (
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 
            ${isOpen ? 'transform rotate-180' : ''}`} />
        )}
      </button>
      {isExpanded && isOpen && subItems && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="pl-9 py-1 space-y-1"
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

const CollapsibleSidebar = ({ activePage, onNavigate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
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
      text: 'User Management',
      path: 'users',
      subItems: ['View Users', 'Add User', 'User Permissions']
    },
    {
      icon: BarChart,
      text: 'Reports',
      path: 'reports',
      subItems: ['SHR Report', 'BCR Report', 'BR Report', 'Access Report']
    }
  ];

  return (
    <div
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      className={`fixed left-0 top-0 h-full bg-white shadow-lg z-50
                 transition-all duration-300 ease-in-out
                 ${isExpanded ? 'w-64' : 'w-16'}`}
    >
      {/* Logo Section */}
      <div className="h-16 border-b flex items-center px-4">
        <img 
          src="/logo.png"
          alt="Logo"
          className="h-8 w-8 object-contain"
        />
        {isExpanded && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="ml-3 font-semibold text-gray-800"
          >
            Your App
          </motion.span>
        )}
      </div>

      {/* Menu Items */}
      <div className="p-3 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
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
            isExpanded={isExpanded}
          />
        ))}
      </div>
    </div>
  );
};

export default CollapsibleSidebar;
