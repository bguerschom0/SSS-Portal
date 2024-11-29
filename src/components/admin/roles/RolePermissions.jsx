import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Shield, Save } from 'lucide-react';
import { db } from '../../../firebase/config';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

const RolePermissions = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const permissionGroups = {
    stakeholder: {
      name: 'Stakeholder Management',
      permissions: ['view', 'create', 'update', 'delete']
    },
    background_check: {
      name: 'Background Check',
      permissions: ['view', 'create', 'update', 'delete']
    },
    badge_request: {
      name: 'Badge Request',
      permissions: ['view', 'create', 'update']
    },
    access_request: {
      name: 'Access Request',
      permissions: ['view', 'create', 'update', 'delete']
    },
    attendance: {
      name: 'Attendance',
      permissions: ['view', 'create', 'update', 'delete']
    },
    visitors: {
      name: 'Visitors Management',
      permissions: ['view', 'create', 'update', 'delete']
    },
    reports: {
      name: 'Reports',
      permissions: ['view', 'export']
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'roles'));
      const rolesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRoles(rolesData);
    } catch (error) {
      console.error('Error fetching roles:', error);
    }
  };

  const handlePermissionChange = async (groupKey, permission) => {
    if (!selectedRole) return;

    const newPermissions = selectedRole.permissions || [];
    const permissionKey = `${groupKey}_${permission}`;

    if (newPermissions.includes(permissionKey)) {
      newPermissions.splice(newPermissions.indexOf(permissionKey), 1);
    } else {
      newPermissions.push(permissionKey);
    }

    try {
      await updateDoc(doc(db, 'roles', selectedRole.id), {
        permissions: newPermissions,
        updatedAt: new Date()
      });

      setMessage({ type: 'success', text: 'Permissions updated successfully' });
      fetchRoles();
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating permissions' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Role */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search roles..."
          className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
      </div>

      {/* Role List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {roles
          .filter(role => role.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(role => (
            <div
              key={role.id}
              onClick={() => setSelectedRole(role)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedRole?.id === role.id
                  ? 'border-emerald-500 bg-emerald-50'
                  : 'hover:border-emerald-200'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-emerald-500" />
                <span className="font-medium">{role.name}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{role.description}</p>
            </div>
          ))}
      </div>

      {/* Permissions Grid */}
      {selectedRole && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-medium mb-4">
            Permissions for {selectedRole.name}
          </h3>
          <div className="space-y-6">
            {Object.entries(permissionGroups).map(([groupKey, group]) => (
              <div key={groupKey} className="space-y-2">
                <h4 className="font-medium text-gray-700">{group.name}</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {group.permissions.map(permission => {
                    const permissionKey = `${groupKey}_${permission}`;
                    const isEnabled = selectedRole.permissions?.includes(permissionKey);

                    return (
                      <label
                        key={permissionKey}
                        className="flex items-center space-x-2 p-2 border rounded hover:bg-gray-50"
                      >
                        <input
                          type="checkbox"
                          checked={isEnabled}
                          onChange={() => handlePermissionChange(groupKey, permission)}
                          className="text-emerald-500 rounded focus:ring-emerald-500"
                        />
                        <span className="text-sm capitalize">{permission}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Toast */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${
            message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}
        >
          {message.text}
        </motion.div>
      )}
    </div>
  );
};

export default RolePermissions;
