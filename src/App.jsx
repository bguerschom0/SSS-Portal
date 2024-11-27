// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config/firebase';
import { checkPermission } from './services/firestore-structure';

// Components
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import WelcomePage from './components/dashboard/WelcomePage';
import AdminPage from './components/dashboard/AdminPage';
import ErrorBoundary from './components/common/ErrorBoundary';

// Auth Context
import { AuthProvider, useAuth } from './contexts/AuthContext';

const SESSION_TIMEOUT = 30 * 60 * 1000;

function AppContent() {
  const { user, loading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('welcome');
  const [currentSubItem, setCurrentSubItem] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [isCheckingPermission, setIsCheckingPermission] = useState(false);

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

  useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    const events = ['mousemove', 'keypress', 'click'];
    events.forEach(event => window.addEventListener(event, updateActivity));
    return () => events.forEach(event => 
      window.removeEventListener(event, updateActivity)
    );
  }, []);

  useEffect(() => {
    if (user) {
      const savedPage = localStorage.getItem('currentPage');
      const savedSubItem = localStorage.getItem('currentSubItem');
      if (savedPage) setCurrentPage(savedPage);
      if (savedSubItem) setCurrentSubItem(JSON.parse(savedSubItem));
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
      setIsCheckingPermission(true);
      
      if (user?.role !== 'admin' && page !== 'welcome' && page !== 'admin') {
        const hasPermission = await checkPermission(user.uid, page, subItem);
        if (!hasPermission) {
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
    } finally {
      setIsCheckingPermission(false);
    }
  };

  const renderPage = () => {
    if (isCheckingPermission) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      );
    }

    switch (currentPage) {
      case 'welcome':
        return <WelcomePage onNavigate={handleNavigate} onLogout={handleLogout} />;
      case 'admin':
        return user?.role === 'admin' ? 
          <AdminPage onNavigate={handleNavigate} onLogout={handleLogout} /> : 
          <Navigate to="/" replace />;
      default:
        return <Navigate to="/" replace />;
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
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
