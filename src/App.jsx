import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import WelcomePage from './components/dashboard/WelcomePage';
import AdminPage from './components/dashboard/AdminPage';

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
  </div>
);

function App() {
  const { currentUser } = useAuth();

  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            {currentUser ? (
              <>
                <Route path="/dashboard" element={<WelcomePage />} />
                <Route path="/admin" element={<AdminPage />} />
              </>
            ) : (
              <Route path="*" element={<Navigate to="/login" />} />
            )}
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

export default App;
