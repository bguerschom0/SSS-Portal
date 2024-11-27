import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../../firebase/config';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

const ViewDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'departments'));
      const departmentsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDepartments(departmentsData);
    } catch (error) {
      setError('Error fetching departments');
    }
  };

  const deleteDepartment = async (id) => {
    try {
      await deleteDoc(doc(db, 'departments', id));
      setSuccess('Department deleted successfully');
      fetchDepartments();
    } catch (error) {
      setError('Error deleting department');
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
        <h2 className="text-2xl font-bold mb-4">View Departments</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left pb-4">Name</th>
                <th className="text-left pb-4">Description</th>
                <th className="text-left pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((department) => (
                <tr key={department.id} className="border-t">
                  <td className="py-4">{department.name}</td>
                  <td>{department.description}</td>
                  <td>
                    <button
                      onClick={() => deleteDepartment(department.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default ViewDepartments;
