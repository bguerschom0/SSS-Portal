import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { PERMISSIONS } from '../../models/userRoles';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const usersData = [];
      
      for (const doc of querySnapshot.docs) {
        const userData = doc.data();
        const roleData = await getUserRole(doc.id);
        usersData.push({
          id: doc.id,
          ...userData,
          ...roleData
        });
      }
      
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserPermissions = async (userId, permissions) => {
    try {
      const userRoleRef = doc(db, 'user_roles', userId);
      await updateDoc(userRoleRef, {
        permissions,
        updatedAt: serverTimestamp()
      });
      await fetchUsers();
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left pb-4">User</th>
                <th className="text-left pb-4">Role</th>
                <th className="text-left pb-4">Permissions</th>
                <th className="text-left pb-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td className="py-2">{user.email}</td>
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
                                ? [...user.permissions, value]
                                : user.permissions.filter(p => p !== value);
                              updateUserPermissions(user.id, newPermissions);
                            }}
                            className="mr-2"
                          />
                          {key}
                        </label>
                      ))}
                    </div>
                  </td>
                  <td>
                    {/* Add additional actions */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
