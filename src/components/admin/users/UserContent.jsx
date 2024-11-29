import React from 'react';
import { motion } from 'framer-motion';
import ViewUsers from './ViewUsers';
import AddUser from './AddUser';
import CollapsibleSidebar from '../../shared/CollapsibleSidebar';

const UserContent = ({ selectedSubItem }) => {
  const renderContent = () => {
    switch (selectedSubItem) {
      case 'View Users':
        return <ViewUsers />;
      case 'Add User':
        return <AddUser />;
      case 'User Permissions':
        return <div>User Permissions Content</div>;
      default:
        return <ViewUsers />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <CollapsibleSidebar activePage="users" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="transition-all duration-300 ease-in-out pl-16 flex-1"
      >
        <div className="p-8">
          {renderContent()}
        </div>
      </motion.div>
    </div>
  );
};

export default UserContent;
