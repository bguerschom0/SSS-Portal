import { useState, useEffect } from 'react';
import { auth } from './firebase/config';
import { getUserRole } from './models/userRoles';
import LoginPage from './components/auth/LoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/dashboard/UserDashboard';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const roleData = await getUserRole(user.uid);
        setUserRole(roleData);
        setIsLoggedIn(true);
      } else {
        setUserRole(null);
        setIsLoggedIn(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return userRole?.role === 'admin' ? <AdminDashboard /> : <UserDashboard userRole={userRole} />;
}

export default App;
