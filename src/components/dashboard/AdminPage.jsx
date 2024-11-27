import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userProfile, hasPermission } = useAuth();

  const menuOptions = [
    'stakeholder', 'background', 'badge', 'reports', 'access', 'attendance', 'visitors'
  ];

  useEffect(() => {
    if (userProfile && hasPermission('admin', 'access')) {
      fetchUsers();
    }
  }, [userProfile, hasPermission]);

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

  if (loading || !userProfile || !hasPermission('admin', 'access')) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">User Permissions Management</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          {/* Table content */}
        </table>
      </div>
    </div>
  );
};

export default AdminPage;
