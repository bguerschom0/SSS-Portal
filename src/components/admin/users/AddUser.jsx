import React, { useState } from 'react';
import { createUserWithEmailAndPassword, updatePassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../../../firebase/config';
import { UserPlus } from 'lucide-react';
import { useCurrentUser } from '../../../hooks/useCurrentUser';

const AddUser = ({ fetchUsers }) => {
  const [newUser, setNewUser] = useState({ email: '', password: '', role: 'user' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { currentUser, currentUserRole } = useCurrentUser();

  const addUser = async (e) => {
    e.preventDefault();

    try {
      // Check if the current user has permission to add new users
      if (currentUserRole !== 'admin') {
        setError('You do not have permission to add new users.');
        return;
      }

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
};

export default AddUser;
