import React, { useState, useEffect, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

const withRouteMonitoring = (WrappedComponent, componentName) => {
  return function MonitoredComponent(props) {
    useEffect(() => {
      console.log(`Rendering component: ${componentName}`);
      return () => {
        console.log(`Unmounting component: ${componentName}`);
      };
    }, []);

    try {
      return <WrappedComponent {...props} />;
    } catch (error) {
      console.error(`Error in ${componentName}:`, error);
      throw error;
    }
  };
};

const LoginPage = React.lazy(() => import('./components/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./components/auth/RegisterPage'));
const WelcomePage = React.lazy(() => import('./components/dashboard/WelcomePage'));
const AdminPage = React.lazy(() => import('./components/dashboard/AdminPage'));

function App() {
  useEffect(() => {
    console.log('App component mounted');

    const logRouteChange = () => {
      console.log('Route changed:', window.location.pathname);
    };
    window.addEventListener('popstate', logRouteChange);

    return () => window.removeEventListener('popstate', logRouteChange);
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        }>
          <Routes>
            <Route 
              path="/login" 
              element={
                <ErrorBoundary componentName="LoginRoute">
                  <LoginPage />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/register"
              element={
                <ErrorBoundary componentName="RegisterRoute">
                  <RegisterPage />
                </ErrorBoundary>
              }
            />
            <Route 
              path="/dashboard"
              element={
                <ErrorBoundary componentName="DashboardRoute">
                  <WelcomePage />
                </ErrorBoundary>
              }
            />
            <Route 
              path="/admin"
              element={
                <ErrorBoundary componentName="AdminRoute">
                  <AdminPage />
                </ErrorBoundary>
              }
            />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.group(`Error in ${this.props.componentName}`);
    console.error('Error:', error);
    console.error('Component Stack:', errorInfo.componentStack);
    console.groupEnd();
  }

  render() {
    if (this.state.hasError) {
      return <div>Error loading {this.props.componentName}</div>;
    }
    return this.props.children;
  }
}

export default App;
