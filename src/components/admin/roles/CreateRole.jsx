import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Shield } from 'lucide-react';
import { db } from '../../../firebase/config';
import { collection, addDoc } from 'firebase/firestore';

const CreateRole = () => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: {
      stakeholder: false,
      background_check: false,
      badge_request: false,
      access_request: false,
      attendance: false,
      visitors: false,
      reports: false
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const selectedPermissions = Object.entries(formData.permissions)
        .filter(([_, value]) => value)
        .map(([key]) => key);

      await addDoc(collection(db, 'roles'), {
        name: formData.name,
        description: formData.description,
        permissions: selectedPermissions,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      setSuccess('Role created successfully');
      setFormData({
        name: '',
        description: '',
        permissions: {
          stakeholder: false,
          background_check: false,
          badge_request: false,
          access_request: false,
          attendance: false,
          visitors: false,
          reports: false
        }
      });
    } catch (error) {
      setError('Error creating role: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permission]: !prev.permissions[permission]
      }
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center space-x-2"
          >
            <AlertCircle className="h-5 w-5" />
            <span>{success}</span>
          </motion.div>
        )}

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Role Name
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows={3}
            required
          />
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Permissions
          </label>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(formData.permissions).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={() => handlePermissionChange(key)}
                  className="h-4 w-4 text-emerald-600 rounded focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700">
                  {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
        >
          <Shield className="h-5 w-5" />
          <span>{loading ? 'Creating Role...' : 'Create Role'}</span>
        </button>
      </form>
    </div>
  );
};

export default CreateRole;
