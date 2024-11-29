import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase/config';

export const useCurrentUser = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        const userRoleDoc = await getDoc(doc(db, 'user_roles', user.uid));
        if (userRoleDoc.exists()) {
          setCurrentUserRole(userRoleDoc.data().role);
        } else {
          setCurrentUserRole('user'); // default role if not found
        }
      } else {
        setCurrentUser(null);
        setCurrentUserRole(null);
      }
    });

    return unsubscribe;
  }, []);

  return { currentUser, currentUserRole };
};
