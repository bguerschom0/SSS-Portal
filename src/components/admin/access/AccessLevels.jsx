import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

const AccessLevels = () => {
  const [accessLevels, setAccessLevels] = useState([]);
  const [newAccessLevel, setNewAccessLevel] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAccessLevels();
  }, []);

  const fetchAccessLevels = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'access_levels'));
      const levels = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setAccessLevels(levels);
    } catch (error) {
      setError('Error fetching access levels');
    }
  };

  const addAccessLevel = async () => {
    if (newAccessLevel.trim() === '') return;
    try {
      await addDoc(collection(db, 'access_levels'), {
        name: newAccessLevel,
      });
      setNewAccessLevel('');
      setSuccess('Access level added successfully');
      fetchAccessLevels();
    } catch (error) {
      setError('Error adding access level');
    }
  };

  const deleteAccessLevel = async (id) => {
    try {
      await deleteDoc(doc(db, 'access_levels', id));
      setSuccess('Access level deleted successfully');
      fetchAccessLevels();
    } catch (error) {
      setError('Error deleting access level');
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
        <h2 className="text-2xl font-bold mb-4">Access Levels</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newAccessLevel}
              onChange={(e) => setNewAccessLevel(e.target.value)}
              placeholder="Add new access level"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={addAccessLevel}
              className="bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {accessLevels.map((level) => (
              <li
                key={level.id}
                className="flex items-center justify-between bg-gray-100 p-2 rounded"
              >
                <span>{level.name}</span>
                <button
                  onClick={() => deleteAccessLevel(level.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>
    </div>
  );
};

export default AccessLevels;
