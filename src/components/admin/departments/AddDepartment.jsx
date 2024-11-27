import React, { useState } from 'react';
import { db } from '../../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

const AddDepartment = () => {
  const [departmentName, setDepartmentName] = useState('');
  const [departmentDescription, setDepartmentDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const addDepartment = async () => {
    if (departmentName.trim() === '') return;

    try {
      await addDoc(collection(db, 'departments'), {
        name: departmentName,
        description: departmentDescription,
        createdAt: new Date(),
      });
      setDepartmentName('');
      setDepartmentDescription('');
      setSuccess('Department added successfully');
    } catch (error) {
      setError('Error adding department');
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Add Department</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <form onSubmit={(e) => {
          e.preventDefault();
          addDepartment();
        }} className="space-y-4">
          <div>
            <label htmlFor="department-name" className="block text-sm font-medium">
              Department Name
            </label>
            <input
              type="text"
              id="department-name"
              value={departmentName}
              onChange={(e) => setDepartmentName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="department-description" className="block text-sm font-medium">
              Department Description
            </label>
            <textarea
              id="department-description"
              value={departmentDescription}
              onChange={(e) => setDepartmentDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600"
          >
            Add Department
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AddDepartment;
