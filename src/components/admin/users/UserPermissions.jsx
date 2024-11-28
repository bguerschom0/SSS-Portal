import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Search } from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../firebase/config';

const PERMISSION_CATEGORIES = {
  STAKEHOLDER: {
    name: 'Stakeholder Management',
    permissions: ['New Request', 'Update', 'Pending']
  },
  BACKGROUND_CHECK: {
    name: 'Background Check',
    permissions: ['New Request', 'Update', 'Pending']
  },
  BADGE_REQUEST: {
    name: 'Badge Request',
    permissions: ['New Request', 'Pending']
  },
  ACCESS_REQUEST: {
    name: 'Access Request',
    permissions: ['New Request', 'Update', 'Pending']
  },
  ATTENDANCE: {
    name: 'Attendance',
    permissions: ['New Request', 'Update', 'Pending']
  },
  VISITORS: {
    name: 'Visitors Management',
    permissions: ['New Request', 'Update', 'Pending']
  }
};

const UserPermissions = ({ users, fetchUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePermissionChange = async (userId, category, permission, isChecked) => {
    try {
      const userRoleRef = doc(db, 'user_roles', userId);
      const permissionKey = `${
