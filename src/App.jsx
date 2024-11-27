import { useState, useEffect } from 'react';
import { auth } from './firebase/config';
import { getUserRole } from './models/userRoles';
import LoginPage from './components/auth/LoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/dashboard/WelcomePage';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader className="h-8 w-8 text-emerald-500" />
        </motion.div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginPage />;
  }

  return userRole?.role === 'admin' ? (
    <AdminDashboard />
  ) : (
    <UserDashboard userRole={userRole} />
  );
}

export default App;
