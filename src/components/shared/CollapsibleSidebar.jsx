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
  UserPlus,
  Shield,
  Building2,
  Lock
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
