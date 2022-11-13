import { onAuthStateChanged } from 'firebase/auth';
import { createContext, useEffect, useState } from 'react';
import { auth } from '../firebase';
import { ContextProps } from './contextProps.types';

export const AuthContext = createContext(auth.currentUser);

export const AuthContextProvider = ({ children }: ContextProps) => {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);

  useEffect(() => {
    const unSub = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
    });

    return () => {
      unSub();
    };
  }, []);

  return (
    <AuthContext.Provider value={currentUser}>{children}</AuthContext.Provider>
  );
};
