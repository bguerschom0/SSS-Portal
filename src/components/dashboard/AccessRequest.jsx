
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Search, Filter, AlertCircle, Lock } from 'lucide-react';
import PageLayout from '../shared/PageLayout';
const AccessRequest = ({ onNavigate, subItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const renderContent = () => {
    switch (subItem) {
      case 'New Request':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">New Access Request</h2>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 text-emerald-700">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm">Valid badge is required for access request approval.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-700">Request Information</h3>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Badge ID</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Enter badge ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Access Level</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="">Select access level</option>
                      <option value="basic">Basic Access</option>
                      <option value="restricted">Restricted Area</option>
                      <option value="confidential">Confidential Area</option>
                    </select>
                  </div>
                </div>
                {/* Access Details */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-700">Access Details</h3>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Duration</label>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="date"
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <input
                        type="date"
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Access Time</label>
                    <div className="grid grid-cols-2 gap-4">
                      <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="">From</option>
                        <option value="24/7">24/7</option>
                        <option value="business">Business Hours</option>
                        <option value="custom">Custom</option>
                      </select>
                      <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="">To</option>
                        <option value="24/7">24/7</option>
                        <option value="business">Business Hours</option>
                        <option value="custom">Custom</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                  Submit Request
                </button>
              </div>
            </div>
          </div>
        );
      case 'Update':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Update Access Request</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter request ID"
                />
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                  Find Request
                </button>
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
                  placeholder="Search pending access requests..."
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
                    <label className="text-sm font-medium text-gray-700">Access Level</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="">All Levels</option>
                      <option value="basic">Basic</option>
                      <option value="restricted">Restricted</option>
                      <option value="confidential">Confidential</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold">Pending Access Requests</h2>
              </div>
              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-3">Request ID</th>
                      <th className="pb-3">Badge ID</th>
                      <th className="pb-3">Access Level</th>
                      <th className="pb-3">Duration</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr>
                      <td className="py-3" colSpan="6">
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
            <h2 className="text-lg font-semibold mb-4">Access Requests</h2>
            <p className="text-gray-600">Select an action from the sidebar to get started.</p>
          </div>
        );
    }
  };
  return (
    <PageLayout
      title="Access Request"
      icon={Key}
      activePage="access"
      onNavigate={onNavigate}
    >
      {renderContent()}
    </PageLayout>
  );
};
export default AccessRequest;