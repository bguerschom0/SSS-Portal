import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Plus, Edit, Trash2, AlertCircle, Search } from 'lucide-react';
import { db } from '../../../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const AccessGroups = () => {
  const [groups, setGroups] = useState([]);
  const [accessLevels, setAccessLevels] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    accessLevelId: '',
    members: [],
    validFrom: '',
    validUntil: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchGroups();
    fetchAccessLevels();
  }, []);

  const fetchGroups = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'access_groups'));
      const groupsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGroups(groupsData);
    } catch (error) {
      console.error('Error fetching groups:', error);
    }
  };

  const fetchAccessLevels = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'access_levels'));
      const levels = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAccessLevels(levels);
    } catch (error) {
      console.error('Error fetching access levels:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'access_groups'), {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      setShowAddModal(false);
      setFormData({
        name: '',
        description: '',
        accessLevelId: '',
        members: [],
        validFrom: '',
        validUntil: ''
      });
      fetchGroups();
    } catch (error) {
      setError('Error creating access group');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (groupId) => {
    if (window.confirm('Are you sure you want to delete this access group?')) {
      try {
        await deleteDoc(doc(db, 'access_groups', groupId));
        fetchGroups();
      } catch (error) {
        console.error('Error deleting group:', error);
      }
    }
  };

  const filteredGroups = groups.filter(group =>
    group.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search access groups..."
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
        >
          <Plus className="h-5 w-5" />
          <span>Add Group</span>
        </button>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((group) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{group.name}</h3>
                  <p className="text-sm text-gray-500">
                    {group.members?.length || 0} members
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  onClick={() => {/* Handle edit */}}
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button 
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  onClick={() => handleDelete(group.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">{group.description}</p>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700">Access Level</h4>
                <p className="text-sm text-gray-600">
                  {accessLevels.find(level => level.id === group.accessLevelId)?.name || 'N/A'}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Validity Period</h4>
                <div className="text-sm text-gray-600">
                  <p>From: {new Date(group.validFrom).toLocaleDateString()}</p>
                  <p>Until: {new Date(group.validUntil).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Add Access Group</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Access Level</label>
                <select
                  value={formData.accessLevelId}
                  onChange={(e) => setFormData({...formData, accessLevelId: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  <option value="">Select Access Level</option>
                  {accessLevels.map((level) => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Valid From</label>
                  <input
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({...formData, validFrom: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Valid Until</label>
                  <input
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({...formData, validUntil: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AccessGroups;
