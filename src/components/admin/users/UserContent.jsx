import React, { useState } from 'react';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { db, auth } from '../../../firebase/config';
import { motion } from 'framer-motion';
import { Lock, Unlock, Key, UserPlus } from 'lucide-react';

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

    default:
      return null;
  }
};

export default UserContent;
