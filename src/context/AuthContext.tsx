import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  setPersistence,
  browserLocalPersistence,
} from 'firebase/auth';
import { auth } from '../firebase/config.ts';
import { createUserProfile, getUserProfile } from '../firebase/services.ts';
import { UserProfile } from '../types/index.ts';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Primary platform admin email provided in environment
const ADMIN_EMAILS = ['chandangorai799@gmail.com', 'admin@jewallah.in'];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Configure browser local persistence so students stay logged in
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((err) => {
      console.warn('Could not set auth persistence:', err);
    });
  }, []);

  const refreshProfile = async () => {
    if (auth.currentUser) {
      const profile = await getUserProfile(auth.currentUser.uid);
      if (profile) {
        setUserProfile(profile);
      } else {
        // Synthesize profile from Firebase user info if document not yet created
        const names = (auth.currentUser.displayName || 'Student').split(' ');
        const fallbackProfile: UserProfile = {
          uid: auth.currentUser.uid,
          firstName: names[0] || 'Student',
          lastName: names.slice(1).join(' ') || '',
          phone: auth.currentUser.phoneNumber || '',
          email: auth.currentUser.email || '',
          role: ADMIN_EMAILS.includes(auth.currentUser.email || '') ? 'admin' : 'student',
          createdAt: new Date().toISOString(),
        };
        setUserProfile(fallbackProfile);
      }
    } else {
      setUserProfile(null);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          if (profile) {
            setUserProfile(profile);
          } else {
            const names = (user.displayName || 'Student').split(' ');
            const fallbackProfile: UserProfile = {
              uid: user.uid,
              firstName: names[0] || 'Student',
              lastName: names.slice(1).join(' ') || '',
              phone: user.phoneNumber || '',
              email: user.email || '',
              role: ADMIN_EMAILS.includes(user.email || '') ? 'admin' : 'student',
              createdAt: new Date().toISOString(),
            };
            setUserProfile(fallbackProfile);
          }
        } catch (e) {
          console.warn('Failed loading profile on auth state change:', e);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
    const profile = await getUserProfile(cred.user.uid);
    if (profile) {
      setUserProfile(profile);
    }
  };

  const register = async (data: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
  }) => {
    const cred = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
    const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`;
    
    await updateProfile(cred.user, {
      displayName: fullName,
    });

    const isUserAdmin = ADMIN_EMAILS.includes(data.email.trim().toLowerCase());

    const newProfile: UserProfile = {
      uid: cred.user.uid,
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      phone: data.phone.trim(),
      email: data.email.trim().toLowerCase(),
      role: isUserAdmin ? 'admin' : 'student',
      createdAt: new Date().toISOString(),
    };

    await createUserProfile(newProfile);
    setUserProfile(newProfile);
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const isAdmin = Boolean(
    currentUser &&
      (ADMIN_EMAILS.includes(currentUser.email || '') || userProfile?.role === 'admin')
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        isAdmin,
        login,
        register,
        logout,
        resetPassword,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
