 
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  updateDoc, 
  query, 
  where 
} from 'firebase/firestore';
import { db, COLLECTIONS } from '../config/firebase';

// Define page permissions structure
export const PAGE_PERMISSIONS = {
  stakeholder: {
    name: 'Stake Holder Request',
    subPages: ['New Request', 'Update', 'Pending'],
    defaultAccess: false
  },
  background: {
    name: 'Background Check Request',
    subPages: ['New Request', 'Update', 'Pending'],
    defaultAccess: false
  },
  badge: {
    name: 'Badge Request',
    subPages: ['New Request', 'Pending'],
    defaultAccess: false
  },
  access: {
    name: 'Access Request',
    subPages: ['New Request', 'Update', 'Pending'],
    defaultAccess: false
  },
  attendance: {
    name: 'Attendance',
    subPages: ['New Request', 'Update', 'Pending'],
    defaultAccess: false
  },
  visitors: {
    name: 'Visitors Management',
    subPages: ['New Request', 'Update', 'Pending'],
    defaultAccess: false
  },
  reports: {
    name: 'Reports',
    subPages: [
      'SHR Report', 
      'BCR Report', 
      'BR Report', 
      'Access Report', 
      'Attendance Report', 
      'Visitors Report'
    ],
    defaultAccess: false
  }
};

// User Management
export const createNewUser = async (uid, userData) => {
  try {
    // Create main user document
    await setDoc(doc(db, COLLECTIONS.USERS, uid), {
      ...userData,
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Create user permissions
    const defaultPermissions = {};
    Object.keys(PAGE_PERMISSIONS).forEach(pageId => {
      defaultPermissions[pageId] = {
        hasAccess: false,
        subPages: []
      };
    });

    await setDoc(doc(db, COLLECTIONS.PERMISSIONS, uid), {
      permissions: defaultPermissions,
      updatedAt: new Date()
    });

    return true;
  } catch (error) {
    console.error('Error creating new user:', error);
    throw error;
  }
};

// Get user data with permissions
export const getUserData = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, uid));
    const permissionsDoc = await getDoc(doc(db, COLLECTIONS.PERMISSIONS, uid));

    if (!userDoc.exists()) {
      throw new Error('User not found');
    }

    return {
      ...userDoc.data(),
      permissions: permissionsDoc.exists() ? permissionsDoc.data().permissions : {}
    };
  } catch (error) {
    console.error('Error getting user data:', error);
    throw error;
  }
};

// Update user permissions
export const updateUserPermissions = async (uid, permissions) => {
  try {
    await updateDoc(doc(db, COLLECTIONS.PERMISSIONS, uid), {
      permissions,
      updatedAt: new Date()
    });
    return true;
  } catch (error) {
    console.error('Error updating permissions:', error);
    throw error;
  }
};

// Check if user has specific permission
export const checkPermission = async (uid, pageId, subPage = null) => {
  try {
    const userData = await getUserData(uid);
    
    // Admin has all permissions
    if (userData.role === 'admin') return true;

    const pagePermissions = userData.permissions[pageId];
    if (!pagePermissions || !pagePermissions.hasAccess) return false;

    if (subPage) {
      return pagePermissions.subPages.includes(subPage);
    }

    return true;
  } catch (error) {
    console.error('Error checking permission:', error);
    return false;
  }
};
