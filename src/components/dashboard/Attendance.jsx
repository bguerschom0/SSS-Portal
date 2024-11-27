
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText
} from 'lucide-react';
import PageLayout from '../shared/PageLayout';
const Attendance = ({ onNavigate, subItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentDate] = useState(new Date().toLocaleDateString());
  const [currentTime] = useState(new Date().toLocaleTimeString());
  const renderContent = () => {
    switch (subItem) {
      case 'New Request':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">New Attendance Entry</h2>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 text-emerald-700">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm">Make sure to verify employee badge before recording attendance.</p>
                </div>
              </div>
              {/* Current Date and Time Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm text-gray-500">Current Date</p>
                    <p className="font-medium text-gray-700">{currentDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm text-gray-500">Current Time</p>
                    <p className="font-medium text-gray-700">{currentTime}</p>
                  </div>
                </div>
              </div>
              {/* Attendance Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-700">Employee Information</h3>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Badge ID</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Scan or enter badge ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Entry Type</label>
                    <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="">Select entry type</option>
                      <option value="in">Check In</option>
                      <option value="out">Check Out</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">Notes</label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      rows="3"
                      placeholder="Add any additional notes"
                    ></textarea>
                  </div>
                </div>
                {/* Quick Status Display */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-700">Status Overview</h3>
                  
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        <span className="text-sm text-gray-600">Present Today</span>
                      </div>
                      <span className="text-sm font-medium">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <XCircle className="h-5 w-5 text-red-500" />
                        <span className="text-sm text-gray-600">Absent Today</span>
                      </div>
                      <span className="text-sm font-medium">0</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm text-gray-600">Late Today</span>
                      </div>
                      <span className="text-sm font-medium">0</span>
                    </div>
                  </div>
                  {/* Quick Actions */}
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                      Record Attendance
                    </button>
                    <button className="w-full px-4 py-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors">
                      Scan Badge
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Update':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Update Attendance Record</h2>
              
              <div className="flex items-center space-x-4 mb-6">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter badge ID or employee name"
                />
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                  Search Records
                </button>
              </div>
              {/* Calendar View Placeholder */}
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <Calendar className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">Calendar view will be displayed here</p>
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
                  placeholder="Search pending records..."
                  className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Export</span>
                </button>
                <button 
                  onClick={() => setFilterOpen(!filterOpen)}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                >
                  <Filter className="h-5 w-5" />
                  <span>Filter</span>
                </button>
              </div>
            </div>
            {filterOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm p-4"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Date Range</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="">Select range</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="">All Status</option>
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Department</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="">All Departments</option>
                      <option value="it">IT</option>
                      <option value="hr">HR</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold">Attendance Records</h2>
              </div>
              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-3">Employee ID</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Check In</th>
                      <th className="pb-3">Check Out</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr>
                      <td className="py-3" colSpan="7">
                        No records found
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
            <h2 className="text-lg font-semibold mb-4">Attendance Management</h2>
            <p className="text-gray-600">Select an action from the sidebar to get started.</p>
          </div>
        );
    }
  };
  return (
    <PageLayout
      title="Attendance"
      icon={Users}
      activePage="attendance"
      onNavigate={onNavigate}
    >
      {renderContent()}
    </PageLayout>
  );
};
export default Attendance;