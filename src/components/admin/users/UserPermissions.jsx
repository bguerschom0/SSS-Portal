import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Search, AlertCircle } from 'lucide-react';
import { db } from '../../../firebase/config';
import { collection, getDocs, doc, updateDoc, onSnapshot } from 'firebase/firestore';

const UserPermissions = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
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
    reports: ['View Reports', 'Export Reports'],
    user_management: ['View Users', 'User Permissions']
  };

  // Fetch users and their permissions
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersSnap = await getDocs(collection(db, 'users'));
        const rolesSnap = await getDocs(collection(db, 'user_roles'));
        
        const rolesData = {};
        rolesSnap.forEach(doc => {
          rolesData[doc.id] = doc.data();
        });

        const usersData = [];
        usersSnap.forEach(doc => {
          usersData.push({
            id: doc.id,
            ...doc.data(),
            role: rolesData[doc.id]?.role || 'user',
            permissions: rolesData[doc.id]?.permissions || []
          });
        });

        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const handlePermissionChange = async (category, permission) => {
    if (!selectedUser) return;

    if (selectedUser.role === 'admin') {
      setMessage({
        type: 'info',
        text: 'Admins automatically have access to all permissions'
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      return;
    }

    const permissionKey = `${category}_${permission.toLowerCase().replace(' ', '_')}`;
    const currentPermissions = selectedUser.permissions || [];
    const isEnabled = currentPermissions.includes(permissionKey);
    const updatedPermissions = isEnabled
      ? currentPermissions.filter(p => p !== permissionKey)
      : [...currentPermissions, permissionKey];

    try {
      setLoading(true);

      // Update in database
      await updateDoc(doc(db, 'user_roles', selectedUser.id), {
        permissions: updatedPermissions
      });

      // Update local state
      setSelectedUser(prev => ({
        ...prev,
        permissions: updatedPermissions
      }));

      setUsers(prev => 
        prev.map(user => 
          user.id === selectedUser.id 
            ? { ...user, permissions: updatedPermissions }
            : user
        )
      );

      setMessage({
        type: 'success',
        text: `${isEnabled ? 'Revoked' : 'Granted'} ${permission} for ${category}`
      });
    } catch (error) {
      console.error('Error updating permission:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update permission'
      });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const isPermissionEnabled = (category, permission) => {
    if (!selectedUser) return false;
    if (selectedUser.role === 'admin') return true;
    
    const permissionKey = `${category}_${permission.toLowerCase().replace(' ', '_')}`;
    return selectedUser.permissions?.includes(permissionKey);
  };

  const filteredUsers = users.filter(user =>
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <div className="text-sm text-gray-500">
                {user.role === 'admin' ? (
                  <span className="text-purple-600 font-medium">Admin</span>
                ) : (
                  user.role
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="md:col-span-3">
          {selectedUser ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Permissions for {selectedUser.email}
              </h3>

              {selectedUser.role === 'admin' ? (
                <div className="bg-purple-50 text-purple-800 p-4 rounded-lg mb-4">
                  This user is an admin and has full access to all features.
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(permissions).map(([category, perms]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="font-medium text-gray-700 capitalize">
                        {category.replace('_', ' ')}
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {perms.map(permission => (
                          <label
                            key={permission}
                            className={`flex items-center p-2 rounded border transition-colors cursor-pointer
                              ${isPermissionEnabled(category, permission)
                                ? 'bg-emerald-50 border-emerald-200'
                                : 'border-gray-200 hover:bg-gray-50'}`}
                          >
                            <input
                              type="checkbox"
                              checked={isPermissionEnabled(category, permission)}
                              onChange={() => handlePermissionChange(category, permission)}
                              disabled={loading || selectedUser.role === 'admin'}
                              className="text-emerald-500 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">{permission}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
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

      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className={`fixed bottom-4 right-4 p-4 rounded-lg flex items-center space-x-2 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 
            message.type === 'error' ? 'bg-red-50 text-red-800' :
            'bg-purple-50 text-purple-800'
          }`}
        >
          <AlertCircle className="h-5 w-5" />
          <span>{message.text}</span>
        </motion.div>
      )}
    </div>
  );
};

export default UserPermissions;
