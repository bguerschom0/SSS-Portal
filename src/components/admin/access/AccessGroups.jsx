import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../../firebase/config';
import { collection, getDocs, addDoc, deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';

const AccessGroups = () => {
  const [accessGroups, setAccessGroups] = useState([]);
  const [newAccessGroup, setNewAccessGroup] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [newMember, setNewMember] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAccessGroups();
  }, []);

  const fetchAccessGroups = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'access_groups'));
      const groups = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        members: doc.data().members || [],
      }));
      setAccessGroups(groups);
    } catch (error) {
      setError('Error fetching access groups');
    }
  };

  const addAccessGroup = async () => {
    if (newAccessGroup.trim() === '') return;
    try {
      await addDoc(collection(db, 'access_groups'), {
        name: newAccessGroup,
        members: [],
      });
      setNewAccessGroup('');
      setSuccess('Access group added successfully');
      fetchAccessGroups();
    } catch (error) {
      setError('Error adding access group');
    }
  };

  const deleteAccessGroup = async (id) => {
    try {
      await deleteDoc(doc(db, 'access_groups', id));
      setSuccess('Access group deleted successfully');
      fetchAccessGroups();
    } catch (error) {
      setError('Error deleting access group');
    }
  };

  const selectAccessGroup = async (group) => {
    setSelectedGroup(group);
    try {
      const groupDoc = await getDoc(doc(db, 'access_groups', group.id));
      setGroupMembers(groupDoc.data().members || []);
    } catch (error) {
      setError('Error fetching group members');
    }
  };

  const addMemberToGroup = async () => {
    if (newMember.trim() === '') return;
    try {
      await updateDoc(doc(db, 'access_groups', selectedGroup.id), {
        members: [...groupMembers, newMember],
      });
      setNewMember('');
      setSuccess('Member added to group successfully');
      selectAccessGroup(selectedGroup);
    } catch (error) {
      setError('Error adding member to group');
    }
  };

  const removeMemberFromGroup = async (member) => {
    try {
      await updateDoc(doc(db, 'access_groups', selectedGroup.id), {
        members: groupMembers.filter((m) => m !== member),
      });
      setSuccess('Member removed from group successfully');
      selectAccessGroup(selectedGroup);
    } catch (error) {
      setError('Error removing member from group');
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
        <h2 className="text-2xl font-bold mb-4">Access Groups</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newAccessGroup}
              onChange={(e) => setNewAccessGroup(e.target.value)}
              placeholder="Add new access group"
              className="flex-1 p-2 border rounded"
            />
            <button
              onClick={addAccessGroup}
              className="bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600"
            >
              Add
            </button>
          </div>
          <ul className="space-y-2">
            {accessGroups.map((group) => (
              <li
                key={group.id}
                className={`flex items-center justify-between bg-gray-100 p-2 rounded cursor-pointer ${
                  selectedGroup?.id === group.id ? 'bg-emerald-100' : ''
                }`}
                onClick={() => selectAccessGroup(group)}
              >
                <span>{group.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteAccessGroup(group.id);
                  }}
                  className="text-red-500 hover:text-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
          {selectedGroup && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Members</h3>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMember}
                  onChange={(e) => setNewMember(e.target.value)}
                  placeholder="Add new member"
                  className="flex-1 p-2 border rounded"
                />
                <button
                  onClick={addMemberToGroup}
                  className="bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600"
                >
                  Add
                </button>
              </div>
              <ul className="space-y-2">
                {groupMembers.map((member) => (
                  <li
                    key={member}
                    className="flex items-center justify-between bg-gray-100 p-2 rounded"
                  >
                    <span>{member}</span>
                    <button
                      onClick={() => removeMemberFromGroup(member)}
                      className="text-red-500 hover:text-red-600"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default AccessGroups;
