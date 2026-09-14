import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  signInWithPopup, 
  signOut, 
  onIdTokenChanged 
} from 'firebase/auth';
import { auth, googleAuthProvider } from '../lib/firebase';
import { AdminAccount } from '../types/spmb';
import { StorageService } from '../services/storage';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  adminUser: AdminAccount | null;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<AdminAccount | null>;
  adminLogout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  adminUser: null,
  isAdmin: false,
  signInWithGoogle: async () => {},
  signOutUser: async () => {},
  adminLogin: async () => null,
  adminLogout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null); // In-memory only
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<AdminAccount | null>(() => StorageService.getActiveAdmin());

  // Listen to admin auth events
  useEffect(() => {
    const handleAdminAuthChange = () => {
      setAdminUser(StorageService.getActiveAdmin());
    };
    window.addEventListener('spmb-admin-auth-changed', handleAdminAuthChange);
    return () => window.removeEventListener('spmb-admin-auth-changed', handleAdminAuthChange);
  }, []);

  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          setToken(idToken);

          // Synchronize user profile into Cloud SQL
          const res = await fetch('/api/auth/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${idToken}`,
            },
          }).catch(err => {
            console.warn('Backend sync deferred or running static:', err);
            return null;
          });

          // Check if Google user is an authorized admin
          const emailLower = (currentUser.email || '').toLowerCase();
          const isGoogleAdmin = 
            emailLower === 'hadygruty2@gmail.com' ||
            emailLower.endsWith('@smpn2telukbayur.sch.id') ||
            emailLower.includes('admin');

          if (isGoogleAdmin && !StorageService.getActiveAdmin()) {
            const googleAdminAcc: AdminAccount = {
              id: 'adm-google-' + currentUser.uid.slice(0, 5),
              name: currentUser.displayName || 'Admin Google (' + emailLower + ')',
              email: emailLower,
              role: 'superadmin',
              roleLabel: 'Admin Sistem (Google Auth)',
              assignedJalur: 'semua',
              active: true,
              lastLogin: new Date().toISOString(),
            };
            StorageService.setActiveAdmin(googleAdminAcc);
            setAdminUser(googleAdminAcc);
          }
        } catch (e) {
          console.error('Error fetching ID token:', e);
          setToken(null);
        }
      } else {
        setToken(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error: any) {
      console.error('Google Sign-In error:', error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setToken(null);
      setUser(null);
    } catch (error: any) {
      console.error('Sign-Out error:', error);
      throw error;
    }
  };

  const adminLogin = async (email: string, password: string): Promise<AdminAccount | null> => {
    const authResult = await StorageService.authenticateAdmin(email, password);
    if (authResult) {
      setAdminUser(authResult);
    }
    return authResult;
  };

  const adminLogout = () => {
    StorageService.setActiveAdmin(null);
    setAdminUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      loading, 
      adminUser, 
      isAdmin: !!adminUser,
      signInWithGoogle, 
      signOutUser,
      adminLogin,
      adminLogout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
