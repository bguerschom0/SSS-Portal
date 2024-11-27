import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const CreateRole = () => {
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const createRole = async () => {
    if (roleName.trim() === '') return;

    try {
      await addDoc(collection(db, 'roles'), {
        name: roleName,
        description: roleDescription,
        permissions: [],
        createdAt: new Date(),
      });
      setRoleName('');
      setRoleDescription('');
      setSuccess('Role created successfully');
    } catch (error) {
      setError('Error creating role');
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
        <h2 className="text-2xl font-bold mb-4">Create Role</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <form onSubmit={(e) => {
          e.preventDefault();
          createRole();
        }} className="space-y-4">
          <div>
            <label htmlFor="role-name" className="block text-sm font-medium">
              Role Name
            </label>
            <input
              type="text"
              id="role-name"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label htmlFor="role-description" className="block text-sm font-medium">
              Role Description
            </label>
            <textarea
              id="role-description"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600"
          >
            Create Role
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateRole;
