import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UserPlus, AlertCircle, ChevronLeft } from 'lucide-react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase/config';
import ModernSidebar from '../../shared/ModernSidebar';

const departments = [
  'IT',
  'HR',
  'Finance',
  'Operations',
  'Marketing',
  'Sales',
  'Support',
  'Management'
];

const AddUser = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    firstName: '',
    lastName: '',
    department: '',
    phoneNumber: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Navigation items for ModernSidebar
  const navigationItems = [
    { 
      label: 'Back to Users',
      action: () => onNavigate('users', 'View Users'),
      icon: ChevronLeft
    },
    { 
      label: 'Add User',
      current: true,
      action: () => onNavigate('users', 'Add User'),
      icon: UserPlus
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate form
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );

      const { uid } = userCredential.user;

      // Create user document in Firestore
      await setDoc(doc(db, 'users', uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        department: formData.department,
        phoneNumber: formData.phoneNumber,
        role: formData.role,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Create user role document
      await setDoc(doc(db, 'user_roles', uid), {
        role: formData.role,
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Create permissions document with default access
      await setDoc(doc(db, 'permissions', uid), {
        permissions: {
          stakeholder: { hasAccess: false },
          background_check: { hasAccess: false },
          badge_request: { hasAccess: false },
          access_request: { hasAccess: false },
          attendance: { hasAccess: false },
          visitors: { hasAccess: false }
        },
        updatedAt: new Date()
      });

      setSuccess('User created successfully');
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        firstName: '',
        lastName: '',
        department: '',
        phoneNumber: ''
      });

    } catch (error) {
      console.error('Error creating user:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* ModernSidebar */}
      <ModernSidebar 
        items={navigationItems}
        currentPage="Add New User"
      />

      <div className="ml-6 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Add New User</h1>
            <p className="text-gray-600 mt-1">Create a new user account and set permissions</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-500 p-4 rounded-lg mb-6 flex items-center space-x-2"
              >
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 text-green-500 p-4 rounded-lg mb-6 flex items-center space-x-2"
              >
                <AlertCircle className="h-5 w-5" />
                <span>{success}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                      className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Department *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Role *
                    </label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      required
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Account Security */}
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">Account Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Password *
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      required
                      minLength={6}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Minimum 6 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6">
                <button
                  type="button"
                  onClick={() => onNavigate('users', 'View Users')}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                >
                  {loading ? 'Creating User...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUser;
