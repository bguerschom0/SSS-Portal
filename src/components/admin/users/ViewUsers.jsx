import React, { useState } from 'react';
import { doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';
import { db, auth } from '../../../firebase/config';
import { Lock, Unlock, Key, Trash } from 'lucide-react';

const ViewUsers = ({ users, fetchUsers }) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const toggleUserLock = async (userId, isLocked) => {
    try {
      await updateDoc(doc(db, 'user_roles', userId), {
        isLocked: !isLocked,
        updatedAt: new Date()
      });
      fetchUsers();
    } catch (error) {
      setError(error.message);
    }
  };

  const resetPassword = async (userId, newPassword) => {
    try {
      await updatePassword(auth.currentUser, newPassword);
      setSuccess('Password updated successfully');
    } catch (error) {
      setError(error.message);
    }
  };

  const deleteUser = async (userId, userEmail) => {
    try {
      await deleteDoc(doc(db, 'user_roles', userId));
      await deleteUser(auth.currentUser);
      setSuccess('User deleted successfully');
      fetchUsers();
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="overflow-x-auto">
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left pb-4">Email</th>
            <th className="text-left pb-4">Role</th>
            <th className="text-left pb-4">Status</th>
            <th className="text-left pb-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t">
              <td className="py-4">{user.email}</td>
              <td>{user.role}</td>
              <td>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  user.isLocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {user.isLocked ? 'Locked' : 'Active'}
                </span>
              </td>
              <td>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleUserLock(user.id, user.isLocked)}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    {user.isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => {
                      const newPassword = prompt('Enter new password:');
                      if (newPassword) resetPassword(user.id, newPassword);
                    }}
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Key className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => deleteUser(user.id, user.email)}
                    className="p-2 rounded-lg hover:bg-gray-100 text-red-500"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewUsers;
