import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db } from '../../../firebase/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { PERMISSIONS } from '../../../models/userRoles';

const RolePermissions = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [rolePermissions, setRolePermissions] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'roles'));
      const rolesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        permissions: doc.data().permissions || [],
      }));
      setRoles(rolesData);
    } catch (error) {
      setError('Error fetching roles');
    }
  };

  const selectRole = (role) => {
    setSelectedRole(role);
    setRolePermissions(role.permissions);
  };

  const updateRolePermissions = async () => {
    try {
      await updateDoc(doc(db, 'roles', selectedRole.id), {
        permissions: rolePermissions,
      });
      setSuccess('Role permissions updated successfully');
      fetchRoles();
    } catch (error) {
      setError('Error updating role permissions');
    }
  };

  const togglePermission = (permission) => {
    if (rolePermissions.includes(permission)) {
      setRolePermissions(rolePermissions.filter((p) => p !== permission));
    } else {
      setRolePermissions([...rolePermissions, permission]);
    }
  };

  return (
    <div className="flex justify-center items-center h-full">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-xl shadow-sm p-8 w-full max-w-4xl"
      >
        <h2 className="text-2xl font-bold mb-4">Role Permissions</h2>
        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left pb-4">Role</th>
                  <th className="text-left pb-4">Permissions</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr
                    key={role.id}
                    className={`border-t cursor-pointer ${
                      selectedRole?.id === role.id ? 'bg-emerald-100' : ''
                    }`}
                    onClick={() => selectRole(role)}
                  >
                    <td className="py-4">{role.name}</td>
                    <td>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((permission) => (
                          <span
                            key={permission}
                            className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                          >
                            {permission}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedRole && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Permissions for {selectedRole.name}</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(PERMISSIONS).map((permission) => (
                  <label key={permission} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={rolePermissions.includes(PERMISSIONS[permission])}
                      onChange={() => togglePermission(PERMISSIONS[permission])}
                      className="mr-2"
                    />
                    {permission}
                  </label>
                ))}
              </div>
              <button
                onClick={updateRolePermissions}
                className="w-full bg-emerald-500 text-white py-2 px-4 rounded hover:bg-emerald-600"
              >
                Save Permissions
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default RolePermissions;
