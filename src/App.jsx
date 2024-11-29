import { useState, useEffect } from 'react';
import { auth } from './firebase/config';
import { getUserRole, createUserRole } from './models/userRoles';
import LoginPage from './components/auth/LoginPage';
import AdminDashboard from './components/admin/AdminDashboard';
import WelcomePage from './components/dashboard/WelcomePage';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState(() => {
    return localStorage.getItem('currentView') || 'dashboard';
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        const roleData = await getUserRole(user.uid);
        if (roleData) {
          setUserRole(roleData);
          // Store current view
          localStorage.setItem('currentView', currentView);
        } else {
          const defaultRole = await createUserRole(user.uid, 'user');
          setUserRole(defaultRole);
        }
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setUserRole(null);
        setIsLoggedIn(false);
        localStorage.removeItem('currentView');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false);
      setUserRole(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

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

  return (
    <ThemeProvider>
      {loading ? (
        <LoadingSpinner />
      ) : !isLoggedIn ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : userRole?.role === 'admin' ? (
        <AdminDashboard 
          user={user} 
          initialView={currentView}
          onViewChange={(view) => {
            setCurrentView(view);
            localStorage.setItem('currentView', view);
          }}
        />
      ) : (
        <WelcomePage username={user?.email} onLogout={handleLogout} userRole={userRole} />
      )}
    </ThemeProvider>
  );
}
export default App;
