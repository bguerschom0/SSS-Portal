import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Menu, Search, ArrowLeft } from 'lucide-react';

const PersistentSidebar = ({ items, currentPage, onNavigate, userPermissions, isDashboard }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showHint, setShowHint] = useState(true); // Show hint for new users

  // Don't show sidebar on dashboard
  if (isDashboard) return null;

  const filteredItems = items.filter(item => 
    userPermissions?.includes(item.path) || item.isAdmin
  ).filter(item =>
    item.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show hint for first-time users
  useEffect(() => {
    const hasSeenHint = localStorage.getItem('sidebarHintSeen');
    if (!hasSeenHint) {
      setTimeout(() => {
        setShowHint(true);
        localStorage.setItem('sidebarHintSeen', 'true');
      }, 2000);
    }
  }, []);

  return (
    <>
      {/* Sidebar Indicator */}
      <motion.div
        className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50"
        animate={{ x: isOpen ? '-100%' : '0%' }}
      >
        <motion.button
          className="bg-emerald-500 text-white p-2 rounded-r-lg shadow-lg"
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </motion.button>

        {/* Hint tooltip */}
        <AnimatePresence>
          {showHint && !isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="absolute left-full top-0 ml-2 whitespace-nowrap bg-black text-white text-sm px-3 py-1 rounded"
            >
              Click to navigate pages
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Sidebar */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? '0%' : '-100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 bottom-0 w-64 bg-white shadow-lg z-40"
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-gray-800">Navigation</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>

          {/* Search and Current Page */}
          <div className="p-4 space-y-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search pages..."
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm"
              />
            </div>
            <div className="text-sm">
              <span className="text-gray-500">Current:</span>
              <span className="ml-2 font-medium text-emerald-600">{currentPage}</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      currentPage.includes(item.text)
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      onNavigate(item.path);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm font-medium">{item.text}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                    {item.subItems && (
                      <div className="mt-1 ml-8 text-xs text-gray-500">
                        {item.subItems.join(' • ')}
                      </div>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default PersistentSidebar;
