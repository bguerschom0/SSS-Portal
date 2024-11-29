import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, ChevronLeft, ChevronRight, Search } from 'lucide-react';

const ModernSidebar = ({ currentPage, onNavigate, isVisible = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Don't render if not visible (on dashboard pages)
  if (!isVisible) return null;

  return (
    <>
      {/* Sliding Panel Indicator */}
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: isOpen ? -100 : 0 }}
        className="fixed left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-emerald-600 to-emerald-500 z-40"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="h-full w-full flex flex-col items-center justify-center space-y-4 text-white"
        >
          {/* Animated Dots */}
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
                ease: "easeInOut"
              }}
              className="w-2 h-2 rounded-full bg-white"
            />
          ))}
          
          {/* Menu Text */}
          <motion.span
            className="text-xs font-medium writing-mode-vertical whitespace-nowrap transform rotate-180"
            style={{ writingMode: 'vertical-rl' }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Click to navigate
          </motion.span>
        </button>
      </motion.div>

      {/* Main Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-lg z-50"
            >
              <div className="h-full flex flex-col">
                {/* Header */}
                <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
                  <h2 className="font-semibold">Navigation</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 hover:bg-white/10 rounded-full"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Quick navigation..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    />
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Current: {currentPage}
                  </div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto p-4">
                  {/* Links rendered based on current page context */}
                  <div className="space-y-2">
                    {['New Request', 'Update', 'Pending'].map((action, index) => (
                      <motion.button
                        key={action}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          onNavigate(action);
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-emerald-50 group transition-colors"
                      >
                        <span className="text-gray-700 group-hover:text-emerald-600">
                          {action}
                        </span>
                        <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-emerald-600" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50">
                  <div className="text-xs text-gray-500 flex items-center justify-between">
                    <span>Press ESC to close</span>
                    <span>⌘K for quick search</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ModernSidebar;
