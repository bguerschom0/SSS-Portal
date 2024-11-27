 
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyD6R4Lw5Yw0BCkyR-qv6UXNnJvKq-SKWEk",
  authDomain: "sss-portal-63e5f.firebaseapp.com",
  projectId: "sss-portal-63e5f",
  storageBucket: "sss-portal-63e5f.firebasestorage.app",
  messagingSenderId: "441365546127",
  appId: "1:441365546127:web:51ae9f9588f8782d0a5cfa"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Collection References
export const COLLECTIONS = {
  USERS: 'users',
  ROLES: 'roles',
  PERMISSIONS: 'permissions',
  STAKEHOLDERS: 'stakeholders',
  BACKGROUND_CHECKS: 'background_checks',
  BADGE_REQUESTS: 'badge_requests',
  ACCESS_REQUESTS: 'access_requests',
  ATTENDANCE: 'attendance',
  VISITORS: 'visitors'
};

export default app;
