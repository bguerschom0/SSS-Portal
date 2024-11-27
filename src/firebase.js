
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase configuration (you'll get this from Firebase console)
  apiKey: "AIzaSyD6R4Lw5Yw0BCkyR-qv6UXNnJvKq-SKWEk",
  authDomain: "sss-portal-63e5f.firebaseapp.com",
  projectId: "sss-portal-63e5f",
  storageBucket: "sss-portal-63e5f.firebasestorage.app",
  messagingSenderId: "441365546127",
  appId: "1:441365546127:web:51ae9f9588f8782d0a5cfa"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Collection reference
export const stakeholderCollection = 'stakeholder_requests';
