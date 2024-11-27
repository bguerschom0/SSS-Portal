// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config/firebase';
import { checkPermission } from './services/firestore-structure';

// Components
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import WelcomePage from './components/dashboard/WelcomePage';
import AdminPage from './components/admin/AdminPage';

// Auth Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Session timeout duration (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('welcome');
  const [currentSubItem, setCurrentSubItem] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Check session timeout
  useEffect(() => {
    if (user) {
      const checkSession = setInterval(() => {
        if (Date.now() - lastActivity > SESSION_TIMEOUT) {
          handleLogout();
          alert('Session expired. Please login again.');
        }
      }, 1000);

      return () => clearInterval(checkSession);
    }
  }, [user, lastActivity]);

  // Activity tracking
  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    window.addEventListener('mousemove', updateActivity);
    window.addEventListener('keypress', updateActivity);
    window.addEventListener('click', updateActivity);

    return () => {
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keypress', updateActivity);
      window.removeEventListener('click', updateActivity);
    };
  }, []);

  // Restore last page on refresh
  useEffect(() => {
    if (user) {
      const savedPage = localStorage.getItem('currentPage');
      const savedSubItem = localStorage.getItem('currentSubItem');
      
      if (savedPage) {
        setCurrentPage(savedPage);
      }
      if (savedSubItem) {
        setCurrentSubItem(JSON.parse(savedSubItem));
      }
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem('currentPage');
      localStorage.removeItem('currentSubItem');
      setCurrentPage('welcome');
      setCurrentSubItem(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleNavigate = async (page, subItem = null) => {
    try {
      if (page !== 'welcome' && page !== 'admin') {
        const hasPermission = await checkPermission(user.uid, page, subItem);
        if (!hasPermission && user?.role !== 'admin') {
          alert('You do not have permission to access this page');
          return;
        }
      }

      localStorage.setItem('currentPage', page);
      if (subItem) {
        localStorage.setItem('currentSubItem', JSON.stringify(subItem));
      } else {
        localStorage.removeItem('currentSubItem');
      }

      setCurrentPage(page);
      setCurrentSubItem(subItem);
      setLastActivity(Date.now());
    } catch (error) {
      console.error('Navigation error:', error);
      alert('Error accessing page');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={user ? <Navigate to="/" replace /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/" replace /> : <RegisterPage />} 
      />
      <Route
        path="*"
        element={user ? renderPage() : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
