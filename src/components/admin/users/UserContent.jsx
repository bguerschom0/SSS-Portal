import React, { useState } from 'react';
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, deleteUser } from 'firebase/auth';
import { db, auth } from '../../../firebase/config';
import { motion } from 'framer-motion';
import { Lock, Unlock, Key, UserPlus, Trash } from 'lucide-react';

const UserContent = ({ selectedSubItem, users, fetchUsers }) => {
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const addUser = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
      await setDoc(doc(db, 'user_roles', userCredential.user.uid), {
        role: newUser.role,
        permissions: [],
        isLocked: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      setSuccess('User added successfully');
      setNewUser({ email: '', password: '', role: 'user' });
      fetchUsers();
    } catch (error) {
      setError(error.message);
    }
  };

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

  const deleteUser = async (userId) => {
    try {
      await deleteDoc(doc(db, 'user_roles', userId));
      await deleteUser(auth.currentUser);
      setSuccess('User deleted successfully');
      fetchUsers();
    } catch (error) {
      setError(error.message);
    }
  };

  switch (selectedSubItem) {
    case 'View Users':
      return (
        <div className="overflow-x-auto">
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
                        onClick={() => deleteUser(user.id)}
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

    case 'Add User':
      return (
        <form onSubmit={addUser} className="space-y-6 max-w-md">
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}
          
          <div className="space-y-2">
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Role</label>
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
              className="w-full p-2 border rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button 
            type="submit"
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
          >
            <UserPlus className="h-4 w-4" />
            <span>Add User</span>
          </button>
        </form>
      );

    case 'User Permissions':
      return (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">User Permissions</h2>
            <button
              onClick={() => setSelectedCard(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              Back
            </button>
          </div>
          
          <div className="overflow-x-auto">
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
        </div>
      );

    default:
      return null;
  }
};

export default UserContent;
