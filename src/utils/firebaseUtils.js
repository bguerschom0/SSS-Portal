import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

export const getUserPermissions = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'user_roles', userId));
    
    if (!userDoc.exists()) {
      return {
        role: 'user',
        permissions: []
      };
    }

    const userData = userDoc.data();
    const permissions = Array.isArray(userData.permissions) 
      ? userData.permissions 
      : Object.values(userData.permissions || {}).filter(p => typeof p === 'string');

    return {
      role: userData.role || 'user',
      permissions: permissions
    };
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    return {
      role: 'user',
      permissions: []
    };
  }
};

export const updateUserPermissions = async (userId, permissions) => {
  try {
    await updateDoc(doc(db, 'user_roles', userId), {
      permissions: Array.isArray(permissions) ? permissions : []
    });
    return true;
  } catch (error) {
    console.error('Error updating permissions:', error);
    return false;
  }
};
