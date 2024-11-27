import { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { PERMISSIONS, getUserRole } from '../../models/userRoles';
import { motion } from 'framer-motion';
import { Settings, Users, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('users');

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
        updatedAt: new Date()
      });
      await fetchUsers();
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'users':
        return (
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">User Management</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left">
                      <th className="pb-4">User</th>
                      <th className="pb-4">Role</th>
                      <th className="pb-4">Permissions</th>
                      <th className="pb-4">Actions</th>
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
                        <td>
                          <button className="px-4 py-2 text-emerald-600 hover:bg-emerald-50 rounded-lg">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
        
      case 'roles':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Role Management</h2>
            {/* Role management content */}
          </div>
        );

      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">System Settings</h2>
            {/* Settings content */}
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTab('users')}
            className={`p-4 rounded-lg flex items-center space-x-3 ${
              selectedTab === 'users' 
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-gray-600 hover:bg-emerald-50'
            }`}
          >
            <Users className="h-5 w-5" />
            <span>User Management</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTab('roles')}
            className={`p-4 rounded-lg flex items-center space-x-3 ${
              selectedTab === 'roles'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-gray-600 hover:bg-emerald-50'
            }`}
          >
            <Shield className="h-5 w-5" />
            <span>Role Management</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedTab('settings')}
            className={`p-4 rounded-lg flex items-center space-x-3 ${
              selectedTab === 'settings'
                ? 'bg-emerald-500 text-white'
                : 'bg-white text-gray-600 hover:bg-emerald-50'
            }`}
          >
            <Settings className="h-5 w-5" />
            <span>Settings</span>
          </motion.button>
        </div>

        {renderContent()}
      </div>
    </div>
  );
};

export default AdminDashboard;
