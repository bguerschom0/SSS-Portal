import React, { useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';
import { PERMISSIONS } from '../../../models/userRoles';

const UserPermissions = ({ users, fetchUsers }) => {
  const [error, setError] = useState('');

  const updateUserPermissions = async (userId, permissions) => {
    try {
      const userRoleRef = doc(db, 'user_roles', userId);
      const userRoleDoc = await getDoc(userRoleRef);

      if (userRoleDoc.exists()) {
        await updateDoc(userRoleRef, {
          permissions,
          updatedAt: new Date()
        });
        await fetchUsers();
      } else {
        setError('User role not found');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="overflow-x-auto">
      {error && <div className="text-red-500">{error}</div>}
      <table className="w-full">
        <thead>
          <tr className="text-left">
            <th className="pb-4">User</th>
            <th className="pb-4">Role</th>
            <th className="pb-4">Permissions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="py-4">{user.email}</td>
              <td>{user.role}</td>
              <td>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(PERMISSIONS).map(([key, value]) => (
                    <label key={key} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={user.permissions?.includes(value)}
                        onChange={(e) => {
                          const newPermissions = e.target.checked
                            ? [...(user.permissions || []), value]
                            : (user.permissions || []).filter(p => p !== value);
                          updateUserPermissions(user.id, newPermissions);
                        }}
                        className="mr-2"
                      />
                      {key}
                    </label>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserPermissions;
