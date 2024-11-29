import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Plus, Edit, Trash2, AlertCircle, Search, Clock } from 'lucide-react';
import { db } from '../../../firebase/config';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';

const AccessPolicies = () => {
  const [policies, setPolicies] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'time-based',
    rules: [],
    priority: 0,
    status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const policyTypes = [
    { value: 'time-based', label: 'Time-Based Access' },
    { value: 'location-based', label: 'Location-Based Access' },
    { value: 'role-based', label: 'Role-Based Access' },
    { value: 'device-based', label: 'Device-Based Access' }
  ];

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'access_policies'));
      const policiesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPolicies(policiesData);
    } catch (error) {
      console.error('Error fetching policies:', error);
    }
  };

  const handleAddRule = () => {
    setFormData(prev => ({
      ...prev,
      rules: [...prev.rules, { condition: '', value: '' }]
    }));
  };

  const handleRemoveRule = (index) => {
    setFormData(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db, 'access_policies'), {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      setShowAddModal(false);
      setFormData({
        name: '',
        description: '',
        type: 'time-based',
        rules: [],
        priority: 0,
        status: 'active'
      });
      fetchPolicies();
    } catch (error) {
      setError('Error creating policy');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (policyId) => {
    if (window.confirm('Are you sure you want to delete this policy?')) {
      try {
        await deleteDoc(doc(db, 'access_policies', policyId));
        fetchPolicies();
      } catch (error) {
        console.error('Error deleting policy:', error);
      }
    }
  };

  const getPolicyTypeIcon = (type) => {
    switch (type) {
      case 'time-based':
        return Clock;
      case 'location-based':
        return Lock;
      case 'role-based':
        return Shield;
      default:
        return Shield;
    }
  };

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
            placeholder="Search policies..."
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600"
        >
          <Plus className="h-5 w-5" />
          <span>Add Policy</span>
        </button>
      </div>

      {/* Policies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies
          .filter(policy => policy.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map((policy) => {
            const PolicyIcon = getPolicyTypeIcon(policy.type);
            return (
              <motion.div
                key={policy.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <PolicyIcon className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">{policy.name}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        policy.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {policy.status}
                      </span>
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
                      onClick={() => handleDelete(policy.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4">{policy.description}</p>

                <div className="space-y-3">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Policy Type</h4>
                    <p className="text-sm text-gray-600 capitalize">
                      {policy.type.replace('-', ' ')}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Rules</h4>
                    <div className="space-y-2 mt-2">
                      {policy.rules?.map((rule, index) => (
                        <div
                          key={index}
                          className="text-sm text-gray-600 bg-gray-50 p-2 rounded"
                        >
                          {rule.condition}: {rule.value}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Priority</h4>
                    <p className="text-sm text-gray-600">{policy.priority}</p>
                  </div>
                </div>
              </motion.div>
            );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-lg max-w-xl w-full p-6"
          >
            <h3 className="text-lg font-semibold mb-4">Add Access Policy</h3>
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
                <label className="block text-sm font-medium text-gray-700">Policy Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                >
                  {policyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Rules</label>
                {formData.rules.map((rule, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={rule.condition}
                      onChange={(e) => {
                        const newRules = [...formData.rules];
                        newRules[index].condition = e.target.value;
                        setFormData({...formData, rules: newRules});
                      }}
                      placeholder="Condition"
                      className="flex-1 px-4 py-2 border rounded-lg"
                    />
                    <input
                      type="text"
                      value={rule.value}
                      onChange={(e) => {
                        const newRules = [...formData.rules];
                        newRules[index].value = e.target.value;
                        setFormData({...formData, rules: newRules});
                      }}
                      placeholder="Value"
                      className="flex-1 px-4 py-2 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveRule(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  + Add Rule
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Priority</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                    className="w-full px-4 py-2 border rounded-lg"
                    min={0}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
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
                  {loading ? 'Creating...' : 'Create Policy'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AccessPolicies;
