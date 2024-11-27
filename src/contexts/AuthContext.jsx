import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        setUserProfile(userDoc.exists() ? { uid: user.uid, ...userDoc.data() } : null);
      }
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const hasPermission = (module, action) => userProfile?.permissions?.[module]?.includes(action);
  const isAdmin = () => userProfile?.role === 'admin';

  return (
    <AuthContext.Provider value={{ currentUser, userProfile, hasPermission, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
