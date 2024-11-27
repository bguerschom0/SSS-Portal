
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart } from 'lucide-react';
const Reports = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <BarChart className="h-6 w-6 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-semibold text-gray-800">Reports</h1>
          </div>
          <p className="text-gray-600">
            Reports functionality coming soon...
          </p>
        </div>
      </motion.div>
    </div>
  );
};
export default Reports;