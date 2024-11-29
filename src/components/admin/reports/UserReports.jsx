import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';
import { Download, Calendar, Users, UserPlus, UserMinus } from 'lucide-react';
import { db } from '../../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

const UserReports = () => {
  const [timeframe, setTimeframe] = useState('week');
  const [userData, setUserData] = useState([]);
  const [userStats, setUserStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    newThisMonth: 0
  });
  const [loading, setLoading] = useState(true);

  // Sample data - replace with actual data from Firebase
  const sampleUserData = [
    { name: 'Mon', users: 20, newUsers: 5, activeUsers: 18 },
    { name: 'Tue', users: 25, newUsers: 7, activeUsers: 22 },
    { name: 'Wed', users: 30, newUsers: 4, activeUsers: 25 },
    { name: 'Thu', users: 28, newUsers: 6, activeUsers: 24 },
    { name: 'Fri', users: 32, newUsers: 8, activeUsers: 28 },
    { name: 'Sat', users: 35, newUsers: 5, activeUsers: 30 },
    { name: 'Sun', users: 40, newUsers: 9, activeUsers: 35 }
  ];

  useEffect(() => {
    fetchUserData();
  }, [timeframe]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Replace with actual Firebase queries
      setUserData(sampleUserData);
      setUserStats({
        total: 150,
        active: 120,
        inactive: 30,
        newThisMonth: 45
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // Implement export functionality
    console.log('Exporting report...');
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <h3 className="text-2xl font-semibold text-gray-900">{userStats.total}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Users</p>
              <h3 className="text-2xl font-semibold text-green-600">{userStats.active}</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <UserPlus className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Inactive Users</p>
              <h3 className="text-2xl font-semibold text-red-600">{userStats.inactive}</h3>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <UserMinus className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg shadow-sm p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">New This Month</p>
              <h3 className="text-2xl font-semibold text-purple-600">{userStats.newThisMonth}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
            <p className="text-sm text-gray-500">User registration and activity trends</p>
          </div>
          <div className="flex space-x-4">
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="year">Last Year</option>
            </select>
            <button
              onClick={exportReport}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
            >
              <Download className="h-5 w-5" />
              <span>Export</span>
            </button>
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3B82F6" name="Total Users" />
              <Line type="monotone" dataKey="activeUsers" stroke="#10B981" name="Active Users" />
              <Line type="monotone" dataKey="newUsers" stroke="#8B5CF6" name="New Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* User Distribution Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">User Distribution by Role</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[
              { role: 'Admin', count: 5 },
              { role: 'Manager', count: 15 },
              { role: 'Employee', count: 80 },
              { role: 'Contractor', count: 30 },
              { role: 'Visitor', count: 20 }
            ]}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default UserReports;
