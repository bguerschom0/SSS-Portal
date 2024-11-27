import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

const AccessPolicies = () => {
  const [accessPolicies, setAccessPolicies] = useState([]);
  const [newAccessPolicy, setNewAccessPolicy] = useState('');
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [policyDetails, setPolicyDetails] = useState({
    name: '',
    description: '',
    accessLevels: [],
    accessGroups: [],
  });
  const [accessLevels, setAccessLevels] = useState([]);
  const [accessGroups, setAccessGroups] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAccessPolicies();
    fetchAccessLevels();
    fetchAccessGroups();
  }, []);

  const fetchAccessPolicies = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'access_policies'));
      const policies = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAccessPolicies(policies);
    } catch (error) {
      setError('Error fetching access policies');
    }
  };

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

  const fetchAccessGroups = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'access_groups'));
      const groups = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setAccessGroups(groups);
    } catch (error) {
      setError('Error fetching access groups');
    }
  };

  const addAccessPolicy = async () => {
    if (newAccessPolicy.trim() === '') return;
    try {
      await addDoc(collection(db, 'access_policies'), {
        name: newAccessPolicy,
        description: '',
        accessLevels: [],
        accessGroups: [],
      });
      setNewAccessPolicy('');
      setSuccess('Access policy added successfully');
      fetchAccessPolicies();
    } catch (error) {
      setError('Error adding access policy');
    }
  };

  const deleteAccessPolicy = async (id) => {
    try {
      await deleteDoc(doc(db, 'access_policies', id));
      setSuccess('Access policy deleted successfully');
      fetchAccessPolicies();
    } catch (error) {
      setError('Error deleting access policy');
    }
  };

  const selectAccessPolicy = async (policy) => {
    setSelectedPolicy(policy);
    try {
      const policyDoc = await getDoc(doc(db, 'access_policies', policy.id));
      setPolicyDetails({
        name: policyDoc.data().name,
        description: policyDoc.data().description,
        accessLevels: policyDoc.data().accessLevels,
        accessGroups: policyDoc.data().accessGroups,
      });
    } catch (error) {
      setError('Error fetching policy details');
    }
  };

  const updateAccessPolicy = async () => {
    try {
      await updateDoc(doc(db, 'access_policies', selectedPolicy.id), {
        name: policyDetails.name,
        description: policyDetails.description,
        accessLevels: policyDetails.accessLevels,
        accessGroups: policyDetails.accessGroups,
      });
      setSuccess('Access policy updated successfully');
      fetchAccessPolicies();
    } catch (error) {
      setError('Error updating access policy');
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
        <h2 className="text-2xl font-bold mb-4">Access Policies</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newAccessPolicy}
              onChange={(e) => setNewAccessPolicy(e.target.value)}
              placeholder="Add new access policy"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={addAccessPolicy}
              className="bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {accessPolicies.map((policy) => (
              <li
                key={policy.id}
                className={`flex items-center justify-between bg-gray-100 p-2 rounded cursor-pointer ${
                  selectedPolicy?.id === policy.id ? 'bg-emerald-100' : ''
                }`}
                onClick={() => selectAccessPolicy(policy)}
              >
                <span>{policy.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAccessPolicy(policy.id);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          {selectedPolicy && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="policy-name" className="block text-sm font-medium">
                  Policy Name
                </label>
                <input
                  type="text"
                  id="policy-name"
                  value={policyDetails.name}
                  onChange={(e) =>
                    setPolicyDetails({ ...policyDetails, name: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="policy-description" className="block text-sm font-medium">
                  Policy Description
                </label>
                <textarea
                  id="policy-description"
                  value={policyDetails.description}
                  onChange={(e) =>
                    setPolicyDetails({ ...policyDetails, description: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Access Levels</label>
                <div className="flex flex-wrap gap-2">
                  {accessLevels.map((level) => (
                    <label key={level.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={policyDetails.accessLevels.includes(level.id)}
                        onChange={(e) => {
                          const newAccessLevels = e.target.checked
                            ? [...policyDetails.accessLevels, level.id]
                            : policyDetails.accessLevels.filter((l) => l !== level.id);
                          setPolicyDetails({ ...policyDetails, accessLevels: newAccessLevels });
                        }}
                        className="mr-2"
                      />
                      {level.name}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium">Access Groups</label>
                <div className="flex flex-wrap gap-2">
                  {accessGroups.map((group) => (
                    <label key={group.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={policyDetails.accessGroups.includes(group.id)}
                        onChange={(e) => {
                          const newAccessGroups = e.target.checked
                            ? [...policyDetails.accessGroups, group.id]
                            : policyDetails.accessGroups.filter((g) => g !== group.id);
                          setPolicyDetails({ ...policyDetails, accessGroups: newAccessGroups });
                        }}
                        className="mr-2"
                      />
                      {group.name}
                    </label>
                  ))}
                </div>
              </div>
              <button
                onClick={updateAccessPolicy}
                className="w-full bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600"
              >
                Save Policy
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AccessPolicies;
