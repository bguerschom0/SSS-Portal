import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';

const PageLayout = ({ children, title, icon: Icon, activePage, onNavigate }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Sidebar */}
      <Sidebar activePage={activePage} onNavigate={onNavigate} />

      {/* Main Content */}
      <div className="ml-64 min-h-screen">
        {/* Top Bar */}
        <div className="h-16 bg-white shadow-sm">
          <div className="h-full px-6 flex items-center">
            <div className="flex items-center space-x-3">
              {Icon && (
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Icon className="h-5 w-5 text-emerald-600" />
                </div>
              )}
              <h1 className="text-xl font-semibold text-gray-800">{title}</h1>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
};

export default PageLayout;