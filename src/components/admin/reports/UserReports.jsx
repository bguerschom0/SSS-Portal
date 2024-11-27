import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../../../firebase/config';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { formatDate } from '../../../utils/dateUtils';

const UserReports = () => {
  const [userReports, setUserReports] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserReports();
  }, []);

  const fetchUserReports = async () => {
    try {
      const q = query(collection(db, 'user_logs'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const reports = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUserReports(reports);
    } catch (error) {
      setError('Error fetching user reports');
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm p-8 w-full max-w-4xl"
      >
        <h2 className="text-2xl font-bold mb-4">User Reports</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left pb-4">Timestamp</th>
                <th className="text-left pb-4">User</th>
                <th className="text-left pb-4">Action</th>
                <th className="text-left pb-4">Resource</th>
              </tr>
            </thead>
            <tbody>
              {userReports.map((report) => (
                <tr key={report.id} className="border-t">
                  <td className="py-4">{formatDate(report.timestamp.toDate())}</td>
                  <td>{report.user}</td>
                  <td>{report.action}</td>
                  <td>{report.resource}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default UserReports;
