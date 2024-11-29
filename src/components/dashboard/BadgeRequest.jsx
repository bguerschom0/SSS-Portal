
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Search, Filter, Upload, AlertCircle } from 'lucide-react';
import PageLayout from '../shared/PageLayout';
const BadgeRequest = ({ onNavigate, subItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const renderContent = () => {
    switch (subItem) {
      case 'New Request':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">New Badge Request</h2>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 text-emerald-700">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm">Employee must have completed background check before requesting a badge.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Employee Information */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-700">Employee Information</h3>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter employee ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter full name"
                    />
                  </div>
                </div>
                {/* Photo Upload */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-700">Badge Photo</h3>
                  
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Drag and drop your photo here, or click to browse
                    </p>
                    <button className="mt-4 px-4 py-2 text-sm text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors">
                      Upload Photo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Pending':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search pending badge requests..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
              >
                <Filter className="h-5 w-5" />
                <span>Filter</span>
              </button>
            </div>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Badge Type</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="">All Types</option>
                      <option value="employee">Employee</option>
                      <option value="contractor">Contractor</option>
                      <option value="visitor">Visitor</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold">Pending Badge Requests</h2>
              </div>
              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-3">Badge ID</th>
                      <th className="pb-3">Employee</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr>
                      <td className="py-3" colSpan="5">
                        No pending requests found
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Badge Requests</h2>
            <p className="text-gray-600">Select an action from the sidebar to get started.</p>
          </div>
        );
    }
  };
  return (
    <PageLayout
      title="Badge Request"
      icon={BadgeCheck}
      activePage="badge"
      onNavigate={onNavigate}
    >
      {renderContent()}
    </PageLayout>
  );
};
export default BadgeRequest;