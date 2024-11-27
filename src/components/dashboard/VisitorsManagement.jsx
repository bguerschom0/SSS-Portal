import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, 
  Search, 
  Filter, 
  Calendar,
  Clock,
  AlertCircle,
  Camera,
  Printer,
  FileText,
  User,
  Phone,
  Mail,
  Building2,
  UserCheck
} from 'lucide-react';
import PageLayout from '../shared/PageLayout';
const VisitorsManagement = ({ onNavigate, subItem }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentDate] = useState(new Date().toLocaleDateString());
  const [currentTime] = useState(new Date().toLocaleTimeString());
  const [capturePhoto, setCapturePhoto] = useState(false);
  const renderContent = () => {
    switch (subItem) {
      case 'New Request':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">New Visitor Registration</h2>
              
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2 text-emerald-700">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm">Please ensure all visitor information is accurate and verified with a valid ID.</p>
                </div>
              </div>
              {/* Current Date and Time Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Calendar className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm text-gray-500">Visit Date</p>
                    <p className="font-medium text-gray-700">{currentDate}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-lg">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm text-gray-500">Check-in Time</p>
                    <p className="font-medium text-gray-700">{currentTime}</p>
                  </div>
                </div>
              </div>
              {/* Visitor Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Visitor Information */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-700 flex items-center space-x-2">
                    <User className="h-5 w-5 text-emerald-600" />
                    <span>Visitor Information</span>
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter visitor's full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="tel"
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Enter phone number"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="email"
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Enter email address"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                          type="text"
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="Enter company name"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Visit Details */}
                <div className="space-y-4">
                  <h3 className="text-md font-medium text-gray-700 flex items-center space-x-2">
                    <UserCheck className="h-5 w-5 text-emerald-600" />
                    <span>Visit Details</span>
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Visit</label>
                      <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="">Select purpose</option>
                        <option value="meeting">Meeting</option>
                        <option value="interview">Interview</option>
                        <option value="delivery">Delivery</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Host Employee</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter host employee name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Expected Duration</label>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="time"
                          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                        <input
                          type="time"
                          className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>
                    {/* Photo Capture Section */}
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">Visitor Photo</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        {capturePhoto ? (
                          <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </div>
                        ) : (
                          <button
                            onClick={() => setCapturePhoto(true)}
                            className="w-full py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center justify-center space-x-2"
                          >
                            <Camera className="h-5 w-5" />
                            <span>Capture Photo</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="mt-6 flex justify-end space-x-3">
                <button className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center space-x-2">
                  <Printer className="h-5 w-5" />
                  <span>Print Badge</span>
                </button>
                <button className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                  Register Visitor
                </button>
              </div>
            </div>
          </div>
        );
      case 'Update':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Update Visitor Information</h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Enter visitor ID or name"
                />
                <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
                  Search
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
                  placeholder="Search visitors..."
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
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="">All Status</option>
                      <option value="checked-in">Checked In</option>
                      <option value="checked-out">Checked Out</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Purpose</label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500">
                      <option value="">All Purposes</option>
                      <option value="meeting">Meeting</option>
                      <option value="interview">Interview</option>
                      <option value="delivery">Delivery</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold">Visitor Records</h2>
              </div>
              <div className="p-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-3">Visitor ID</th>
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Company</th>
                      <th className="pb-3">Host</th>
                      <th className="pb-3">Check In</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr>
                      <td className="py-3" colSpan="7">
                        No visitors found
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
            <h2 className="text-lg font-semibold mb-4">Visitors Management</h2>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today's Visitors</p>
                    <p className="text-2xl font-semibold text-emerald-600">0</p>
                  </div>
                  <UserPlus className="h-8 w-8 text-emerald-500" />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Checked In</p>
                    <p className="text-2xl font-semibold text-blue-600">0</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-semibold text-yellow-600">0</p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-500" />
                </div>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Visits</p>
                    <p className="text-2xl font-semibold text-purple-600">0</p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-500" />
                </div>
              </div>
            </div>
            {/* Quick Actions */}
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-700">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => onNavigate('visitors', 'New Request')}
                  className="p-4 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                      <UserPlus className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">New Visitor</p>
                      <p className="text-sm text-gray-500">Register a new visitor</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => onNavigate('visitors', 'Update')}
                  className="p-4 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                      <UserCheck className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">Check-out Visitor</p>
                      <p className="text-sm text-gray-500">Process visitor departure</p>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => onNavigate('visitors', 'Pending')}
                  className="p-4 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-800">View Records</p>
                      <p className="text-sm text-gray-500">Access visitor history</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
            // ... (continuing from the previous default case)
            {/* Recent Visitors */}
            <div className="mt-6">
              <h3 className="text-md font-medium text-gray-700 mb-4">Recent Visitors</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-sm text-gray-500">
                      <th className="pb-3">Visitor</th>
                      <th className="pb-3">Company</th>
                      <th className="pb-3">Host</th>
                      <th className="pb-3">Check In</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600">
                    <tr>
                      <td className="py-3" colSpan="5">
                        No recent visitors
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
    }
  };
  return (
    <PageLayout
      title="Visitors Management"
      icon={UserPlus}
      activePage="visitors"
      onNavigate={onNavigate}
    >
      <div className="space-y-6">
        {/* Notification Bar - Can be shown conditionally */}
        {false && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-emerald-500" />
              <p className="text-emerald-700">New visitor has checked in</p>
            </div>
          </motion.div>
        )}
        {/* Main Content */}
        {renderContent()}
        {/* Action Modals */}
        <AnimatePresence>
          {capturePhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Capture Photo</h3>
                <div className="bg-gray-100 h-48 rounded-lg flex items-center justify-center mb-4">
                  <Camera className="h-12 w-12 text-gray-400" />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setCapturePhoto(false)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    Capture
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Print Badge Preview Modal */}
        <AnimatePresence>
          {false && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            >
              <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                <h3 className="text-lg font-semibold mb-4">Visitor Badge Preview</h3>
                <div className="border rounded-lg p-4 mb-4">
                  <div className="space-y-2">
                    <img 
                      src="/placeholder-photo.jpg" 
                      alt="Visitor"
                      className="w-24 h-24 rounded-full mx-auto mb-2"
                    />
                    <div className="text-center">
                      <p className="font-semibold">Visitor Name</p>
                      <p className="text-sm text-gray-500">Company Name</p>
                      <p className="text-sm text-gray-500">Valid Until: {currentDate}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors flex items-center space-x-2"
                  >
                    <Printer className="h-5 w-5" />
                    <span>Print Badge</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
};
export default VisitorsManagement;
