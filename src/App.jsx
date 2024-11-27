
import React, { useState } from 'react';
import LoginPage from './components/auth/LoginPage';
import WelcomePage from './components/dashboard/WelcomePage';
import StakeHolder from './components/dashboard/StakeHolder';
import BackgroundCheck from './components/dashboard/BackgroundCheck';
import BadgeRequest from './components/dashboard/BadgeRequest';
import Reports from './components/dashboard/Reports';
import AccessRequest from './components/dashboard/AccessRequest';
import Attendance from './components/dashboard/Attendance';
import VisitorsManagement from './components/dashboard/VisitorsManagement';
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('welcome');
  const [username, setUsername] = useState('');
  const [currentSubItem, setCurrentSubItem] = useState(null);
  const handleLoginSuccess = (user) => {
    setUsername(user);
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername('');
    setCurrentPage('welcome');
    setCurrentSubItem(null);
  };
  const handleNavigate = (page, subItem = null) => {
    setCurrentPage(page);
    setCurrentSubItem(subItem);
  };
  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }
  const renderPage = () => {
    switch (currentPage) {
      case 'stakeholder':
        return <StakeHolder onNavigate={handleNavigate} subItem={currentSubItem} />;
      case 'background':
        return <BackgroundCheck onNavigate={handleNavigate} subItem={currentSubItem} />;
      case 'badge':
        return <BadgeRequest onNavigate={handleNavigate} subItem={currentSubItem} />;
      case 'reports':
        return <Reports onNavigate={handleNavigate} subItem={currentSubItem} />;
      case 'access':
        return <AccessRequest onNavigate={handleNavigate} subItem={currentSubItem} />;
      case 'attendance':
        return <Attendance onNavigate={handleNavigate} subItem={currentSubItem} />;
      case 'visitors':
        return <VisitorsManagement onNavigate={handleNavigate} subItem={currentSubItem} />;
      default:
        return (
          <WelcomePage 
            username={username} 
            onLogout={handleLogout}
            onNavigate={handleNavigate}
          />
        );
    }
  };
  return (
    <div>
      {renderPage()}
    </div>
  );
}
export default App;
