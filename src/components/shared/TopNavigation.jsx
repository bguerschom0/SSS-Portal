import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Clock, Settings, User, LogOut, ChevronDown, UserCog, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { themeColors, darkModeClasses, lightModeClasses } from '../../styles/theme';

const TopNavigation = ({ user, onLogout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { theme, colorScheme, updateTheme } = useTheme();
  const themeClasses = theme === 'dark' ? darkModeClasses : lightModeClasses;

  const themeOptions = [
    { id: 'dark', name: 'Dark', icon: Moon },
    { id: 'system', name: 'System', icon: Monitor }
  ];

  const colorSchemes = [
    { id: 'emerald', color: 'bg-emerald-500' },
    { id: 'blue', color: 'bg-blue-500' },
    { id: 'purple', color: 'bg-purple-500' },
    { id: 'red', color: 'bg-red-500' }
  ];

  const handleThemeChange = (themeId) => {
    updateTheme(themeId);
    setShowSettings(false);
  };

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`fixed top-0 right-0 left-0 h-16 ${themeClasses.navbar} shadow-sm z-50`}>
      <div className={`h-full px-6 mx-auto flex items-center justify-between ${themeClasses.text}`}>
        {/* Logo and Title */}
        <div className="flex items-center space-x-4">
          <img 
            src="/logo.png"
            alt="Logo"
            className="h-8 w-auto"
          />
          <span className="text-xl font-semibold text-gray-800">SSS Portal</span>
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
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Settings className="h-5 w-5 text-gray-500 hover:text-emerald-600" />
            </motion.button>

            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg py-2 z-50"
                >
                  {/* Theme Selection */}
                  <div className="px-4 py-2">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Theme</h3>
                    <div className="space-y-2">
                      {themeOptions.map(({ id, name, icon: Icon }) => (
                        <button
                          key={id}
                          onClick={() => handleThemeChange(id)}
                          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg ${
                            theme === id ? 'bg-emerald-50 text-emerald-600' : 'hover:bg-gray-50'
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-sm">{name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="border-t my-2" />

                  {/* Color Schemes */}
                  <div className="px-4 py-2">
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Color Scheme</h3>
                    <div className="flex space-x-2">
                      {colorSchemes.map(({ id, color }) => (
                        <button
                          key={id}
                          onClick={() => {/* Handle color scheme change */}}
                          className={`w-6 h-6 rounded-full ${color} transition-transform hover:scale-110`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-200" />

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center space-x-3 focus:outline-none"
            >
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-700">
                    {user?.displayName || user?.email?.split('@')[0]}
                  </span>
                  <span className="text-xs text-gray-500">{user?.role || 'User'}</span>
                </div>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                showProfile ? 'transform rotate-180' : ''
              }`} />
            </button>

            <AnimatePresence>
              {showProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2"
                >
                  <button
                    onClick={() => {/* Handle profile edit */}}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <UserCog className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavigation;
