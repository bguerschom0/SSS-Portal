import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import { Download, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { db } from '../../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';

const AccessReports = () => {
  const [timeframe, setTimeframe] = useState('week');
  const [accessData, setAccessData] = useState([]);
  const [accessStats, setAccessStats] = useState({
    totalAttempts: 0,
    successful: 0,
    denied: 0,
    suspicious: 0
  });
  const [loading, setLoading] = useState(true);

  const COLORS = ['#10B981', '#EF4444', '#F59E0B', '#6366F1'];

  // Sample data - replace with actual Firebase data
  const sampleAccessData = [
    { date: 'Mon', successful: 150, denied: 12, suspicious: 3 },
    { date: 'Tue', successful: 145, denied: 15, suspicious: 2 },
    { date: 'Wed', successful: 160, denied: 10, suspicious: 4 },
    { date: 'Thu', successful: 155, denied: 8, suspicious: 1 },
    { date: 'Fri', successful: 170, denied: 14, suspicious: 5 },
    { date: 'Sat', successful: 140, denied: 11, suspicious: 2 },
    { date: 'Sun', successful: 135, denied: 9, suspicious: 1 }
  ];

  const pieData = [
    { name: 'Main Entrance', value: 400 },
    { name: 'Office Area', value: 300 },
    { name: 'Server Room', value: 100 },
    { name: 'Restricted Areas', value: 200 }
  ];

  useEffect(() => {
    fetchAccessData();
  }, [timeframe]);

  const fetchAccessData = async () => {
    setLoading(true);
    try {
      // Replace with actual Firebase queries
      setAccessData(sampleAccessData);
      setAccessStats({
        totalAttempts: 1000,
        successful: 850,
        denied: 130,
        suspicious: 20
      });
    } catch (error) {
      console.error('Error fetching access data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportReport = () => {
    // Implement export functionality
    console.log('Exporting access report...');
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
              <p className="text-sm text-gray-500">Total Access Attempts</p>
              <h3 className="text-2xl font-semibold text-gray-900">{accessStats.totalAttempts}</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
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
              <p className="text-sm text-gray-500">Successful Access</p>
              <h3 className="text-2xl font-semibold text-green-600">{accessStats.successful}</h3>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
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
              <p className="text-sm text-gray-500">Access Denied</p>
              <h3 className="text-2xl font-semibold text-red-600">{accessStats.denied}</h3>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
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
              <p className="text-sm text-gray-500">Suspicious Activities</p>
              <h3 className="text-2xl font-semibold text-yellow-600">{accessStats.suspicious}</h3>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Access Trends Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">Access Trends</h3>
            <p className="text-sm text-gray-500">Access patterns over time</p>
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
            <LineChart data={accessData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="successful" stroke="#10B981" name="Successful" />
              <Line type="monotone" dataKey="denied" stroke="#EF4444" name="Denied" />
              <Line type="monotone" dataKey="suspicious" stroke="#F59E0B" name="Suspicious" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Access Distribution by Area */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Access Distribution by Area</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AccessReports;
