import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../../firebase/config';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { formatDate } from '../../../utils/dateUtils';

const AccessReports = () => {
  const [accessReports, setAccessReports] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAccessReports();
  }, []);

  const fetchAccessReports = async () => {
    try {
      const q = query(collection(db, 'access_logs'), where('timestamp', '>', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)));
      const querySnapshot = await getDocs(q);
      const reports = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAccessReports(reports);
    } catch (error) {
      setError('Error fetching access reports');
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
        <h2 className="text-2xl font-bold mb-4">Access Reports</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left pb-4">Timestamp</th>
                <th className="text-left pb-4">User</th>
                <th className="text-left pb-4">Action</th>
                <th className="text-left pb-4">Resource</th>
                <th className="text-left pb-4">Access Level</th>
                <th className="text-left pb-4">Access Group</th>
              </tr>
            </thead>
            <tbody>
              {accessReports.map((report) => (
                <tr key={report.id} className="border-t">
                  <td className="py-4">{formatDate(report.timestamp.toDate())}</td>
                  <td>{report.user}</td>
                  <td>{report.action}</td>
                  <td>{report.resource}</td>
                  <td>{report.accessLevel}</td>
                  <td>{report.accessGroup}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AccessReports;
