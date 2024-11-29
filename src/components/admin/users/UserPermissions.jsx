import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, Filter } from 'lucide-react';
import { db } from '../../../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const UserPermissions = ({ users, fetchUsers }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const permissions = {
    stakeholder: ['New Request', 'Update', 'Pending'],
    background_check: ['New Request', 'Update', 'Pending'],
    badge_request: ['New Request', 'Pending'],
    access_request: ['New Request', 'Update', 'Pending'],
    attendance: ['New Request', 'Update', 'Pending'],
    visitors: ['New Request', 'Update', 'Pending'],
    reports: ['View Reports', 'Export Reports']
  };

  const handlePermissionChange = async (category, permission) => {
    if (!selectedUser) return;

    const permissionKey = `${category}_${permission}`;
    const userPermissions = selectedUser.permissions || [];
    const updatedPermissions = userPermissions.includes(permissionKey)
      ? userPermissions.filter(p => p !== permissionKey)
      : [...userPermissions, permissionKey];

    try {
      await updateDoc(doc(db, 'user_roles', selectedUser.id), {
        permissions: updatedPermissions,
        updatedAt: new Date()
      });
      fetchUsers();
      setMessage({ type: 'success', text: 'Permissions updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating permissions' });
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
            className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* User List */}
        <div className="md:col-span-1 space-y-2">
          {filteredUsers.map(user => (
            <button
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                selectedUser?.id === user.id
                  ? 'bg-emerald-50 border-emerald-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-gray-900">{user.email}</div>
              <div className="text-sm text-gray-500">{user.role}</div>
            </button>
          ))}
        </div>

        {/* Permissions Grid */}
        <div className="md:col-span-3">
          {selectedUser ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Permissions for {selectedUser.email}
              </h3>

              <div className="space-y-6">
                {Object.entries(permissions).map(([category, perms]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-medium text-gray-700 capitalize">
                      {category.replace('_', ' ')}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {perms.map(permission => {
                        const permissionKey = `${category}_${permission}`;
                        const isEnabled = selectedUser.permissions?.includes(permissionKey);

                        return (
                          <label
                            key={permission}
                            className={`flex items-center p-2 rounded border
                              ${isEnabled ? 'bg-emerald-50 border-emerald-200' : 'border-gray-200'}
                              hover:bg-emerald-50 transition-colors cursor-pointer`}
                          >
                            <input
                              type="checkbox"
                              checked={isEnabled}
                              onChange={() => handlePermissionChange(category, permission)}
                              className="text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{permission}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {message.text && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-4 rounded-lg ${
                    message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {message.text}
                </motion.div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a User</h3>
              <p className="text-gray-500">Select a user to manage their permissions</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPermissions;
