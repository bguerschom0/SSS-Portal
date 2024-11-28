import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { db } from '../../../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const AccessLevels = () => {
  const [accessLevels, setAccessLevels] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    priority: 0,
    areas: [],
    timeRestriction: 'none'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const areas = [
    'Main Entrance',
    'Office Area',
    'Server Room',
    'Conference Rooms',
    'Research Labs',
    'Storage Areas',
    'Restricted Zones'
  ];

  const timeRestrictions = [
    { value: 'none', label: 'No Restriction' },
    { value: '24/7', label: '24/7 Access' },
    { value: 'business', label: 'Business Hours Only' },
    { value: 'custom', label: 'Custom Schedule' }
  ];

  useEffect(() => {
    fetchAccessLevels();
  }, []);

  const fetchAccessLevels = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'access_levels'));
      const levels = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAccessLevels(levels);
    } catch (error) {
      setError('Error fetching access levels');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'access_levels'), {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      setShowAddModal(false);
      setFormData({
        name: '',
        description: '',
        priority: 0,
        areas: [],
        timeRestriction: 'none'
      });
      fetchAccessLevels();
    } catch (error) {
      setError('Error creating access level');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (levelId) => {
    if (window.confirm('Are you sure you want to delete this access level?')) {
      try {
        await deleteDoc(doc(db, 'access_levels', levelId));
        fetchAccessLevels();
      } catch (error) {
        setError('Error deleting access level');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Access Levels</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
        >
          <Plus className="h-5 w-5" />
          <span>Add Level</span>
        </button>
      </div>

      {/* Access Levels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accessLevels.map((level) => (
          <motion.div
            key={level.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{level.name}</h3>
                  <p className="text-sm text-gray-500">Priority: {level.priority}</p>
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
                  onClick={() => handleDelete(level.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <p className="text-gray-600 text-sm mb-4">{level.description}</p>

            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Accessible Areas</h4>
                <div className="flex flex-wrap gap-2">
                  {level.areas.map((area, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-700">Time Restriction</h4>
                <p className="text-sm text-gray-600">
                  {timeRestrictions.find(t => t.value === level.timeRestriction)?.label}
                </p>
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
            <h3 className="text-lg font-semibold mb-4">Add Access Level</h3>
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
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <input
                  type="number"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                  className="w-full px-4 py-2 border rounded-lg"
                  min={0}
                  max={100}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Areas</label>
                <div className="grid grid-cols-2 gap-2">
                  {areas.map((area) => (
                    <label key={area} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.areas.includes(area)}
                        onChange={(e) => {
                          const newAreas = e.target.checked
                            ? [...formData.areas, area]
                            : formData.areas.filter(a => a !== area);
                          setFormData({...formData, areas: newAreas});
                        }}
                        className="text-emerald-500 rounded"
                      />
                      <span className="text-sm">{area}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Time Restriction</label>
                <select
                  value={formData.timeRestriction}
                  onChange={(e) => setFormData({...formData, timeRestriction: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  {timeRestrictions.map((restriction) => (
                    <option key={restriction.value} value={restriction.value}>
                      {restriction.label}
                    </option>
                  ))}
                </select>
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
                  {loading ? 'Creating...' : 'Create Level'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AccessLevels;
