import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { hasPermission } = useAuth();

  const menuOptions = [
    'stakeholder', 'background', 'badge', 'reports', 'access', 'attendance', 'visitors'
  ];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersData = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = async (userId, permission, isChecked) => {
    try {
      const userRef = doc(db, 'users', userId);
      const user = users.find(u => u.id === userId);
      const updatedPermissions = isChecked 
        ? [...(user.permissions || []), permission]
        : (user.permissions || []).filter(p => p !== permission);
      
      await updateDoc(userRef, { permissions: updatedPermissions });
      setUsers(users.map(user => user.id === userId
        ? { ...user, permissions: updatedPermissions }
        : user
      ));
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Permissions Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
              {menuOptions.map(option => (
                <th key={option} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {option}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                {menuOptions.map(option => (
                  <td key={option} className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={(user.permissions || []).includes(option)}
                      onChange={(e) => handlePermissionChange(user.id, option, e.target.checked)}
                      className="form-checkbox h-5 w-5 text-emerald-600"
                      disabled={!hasPermission('admin', option)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
