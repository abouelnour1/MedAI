
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { User, AuthContextType, AppSettings, TFunction } from '../../types';
import { auth, db } from '../../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';

const SETTINGS_DOC_ID = 'app_settings';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync user state with Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await syncUserData(firebaseUser);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const syncUserData = async (firebaseUser: FirebaseUser) => {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      try {
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const firestoreData = userDocSnap.data();
            setUser({ 
                id: firebaseUser.uid, 
                emailVerified: firebaseUser.emailVerified,
                email: firebaseUser.email || '',
                ...firestoreData 
            } as User);
          } else {
              // Handle case where auth exists but firestore doc doesn't
              const newUser: User = {
                  id: firebaseUser.uid,
                  username: firebaseUser.email?.split('@')[0] || 'User',
                  role: 'premium', // Default role
                  aiRequestCount: 0,
                  lastRequestDate: new Date().toISOString().split('T')[0],
                  status: 'pending',
                  emailVerified: firebaseUser.emailVerified,
                  email: firebaseUser.email || ''
              };
              await setDoc(userDocRef, newUser);
              setUser(newUser);
          }
      } catch (e) {
          console.error("Error fetching user profile:", e);
          // Fallback
          setUser({
              id: firebaseUser.uid,
              username: firebaseUser.email?.split('@')[0] || 'User',
              role: 'premium',
              aiRequestCount: 0,
              lastRequestDate: new Date().toISOString().split('T')[0],
              status: 'pending',
              emailVerified: firebaseUser.emailVerified,
              email: firebaseUser.email || ''
          });
      }
      setIsLoading(false);
  };

  const login = useCallback(async (username: string, password: string): Promise<void> => {
    let email = username.trim().toLowerCase();
    // Allow login with just username (for legacy or convenience) assuming fake domain
    if (!email.includes('@')) {
        // Note: This assumes legacy users or specific domain logic. 
        // For verified email flow, explicit email is better, but we keep this for backward compat.
        email = `${email}@medai.sa`; 
    }

    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        console.error("Login error:", error);
        let errorMessage = 'خطأ في تسجيل الدخول. تأكد من البريد الإلكتروني وكلمة المرور.';
        if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
             errorMessage = 'اسم المستخدم أو كلمة المرور غير صحيحة.';
        } else if (error.code === 'auth/too-many-requests') {
             errorMessage = 'تم تعليق الدخول مؤقتاً بسبب تكرار المحاولة. حاول لاحقاً.';
        }
        throw new Error(errorMessage);
    }
  }, []);

  const register = useCallback(async (firstName: string, lastName: string, email: string, password: string): Promise<void> => {
    const cleanEmail = email.trim().toLowerCase();
    const fullName = `${firstName.trim()} ${lastName.trim()}`;

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
      
      // Send Verification Email
      await sendEmailVerification(userCredential.user);

      const newUser: User = {
        id: userCredential.user.uid,
        username: fullName, // Storing Full Name as username
        role: 'premium',
        aiRequestCount: 0,
        lastRequestDate: new Date().toISOString().split('T')[0],
        status: 'pending',
        emailVerified: false, // Initially false
        email: cleanEmail
      };
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
      
      // Update local state immediately to reflect the new user
      setUser(newUser);

    } catch (error: any) {
        console.error("Registration error:", error);
        if (error.code === 'auth/email-already-in-use') {
            throw new Error('البريد الإلكتروني هذا مسجل بالفعل.');
        }
        throw new Error('فشل إنشاء الحساب. ' + error.message);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
        await signOut(auth);
        setUser(null);
    } catch (error) {
        console.error("Logout error:", error);
    }
  }, []);

  const resendVerificationEmail = useCallback(async () => {
    if (auth.currentUser && !auth.currentUser.emailVerified) {
        try {
            await sendEmailVerification(auth.currentUser);
        } catch (e) {
            console.error("Error sending verification email", e);
            throw e;
        }
    }
  }, []);

  const reloadUser = useCallback(async () => {
    if (auth.currentUser) {
        await auth.currentUser.reload();
        // Force sync
        await syncUserData(auth.currentUser);
    }
  }, []);
  
  const requestAIAccess = useCallback(async (callback: () => void, t: TFunction) => {
    if (!user) {
        alert(t('loginRequired'));
        return;
    }

    // Allow admins bypass even if email not verified (though they should verify)
    // Enforce email verification for others
    if (user.role !== 'admin' && !user.emailVerified) {
        alert(t('emailVerificationRequired'));
        return;
    }
    
    if (user.role === 'admin') {
        callback();
        return;
    }
    
    if (user.role === 'premium') {
        if (user.status === 'pending') {
            alert(t('aiAccessPendingError'));
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        let currentUserState = { ...user };
        
        if (currentUserState.lastRequestDate !== today) {
            currentUserState.aiRequestCount = 0;
            currentUserState.lastRequestDate = today;
        }
        
        // Optimistic update
        currentUserState.aiRequestCount += 1;
        setUser(currentUserState);
        
        // Update in Firestore
        try {
             const userRef = doc(db, 'users', user.id);
            await updateDoc(userRef, {
                aiRequestCount: currentUserState.aiRequestCount,
                lastRequestDate: currentUserState.lastRequestDate
            });
        } catch (e) {
            console.error("Failed to update usage stats", e);
            // Silent fail, allow usage
        }
        callback();
    }
  }, [user]);

  // Admin functions
  const getAllUsers = useCallback(() => {
    return [] as User[]; 
  }, []);

  const updateUser = useCallback(async (updatedUser: User) => {
    try {
        const userRef = doc(db, 'users', updatedUser.id);
        await updateDoc(userRef, { ...updatedUser });
        if (user && user.id === updatedUser.id) {
            setUser(updatedUser);
        }
    } catch (e) {
        console.error("Error updating user:", e);
    }
  }, [user]);

  const deleteUser = useCallback(async (userId: string) => {
    try {
        await deleteDoc(doc(db, 'users', userId));
    } catch (e) {
        console.error("Error deleting user:", e);
    }
  }, []);

  const getSettings = useCallback((): AppSettings => {
    return { aiRequestLimit: 10, isAiEnabled: true };
  }, []);

  const updateSettings = useCallback(async (settings: AppSettings) => {
    try {
        const settingsRef = doc(db, 'settings', SETTINGS_DOC_ID);
        await setDoc(settingsRef, settings, { merge: true });
    } catch (e) {
        console.error("Error saving settings:", e);
    }
  }, []);


  const value = { 
      user, 
      login, 
      register, 
      logout, 
      requestAIAccess, 
      resendVerificationEmail, 
      reloadUser,
      isLoading, 
      getAllUsers, 
      updateUser, 
      deleteUser, 
      getSettings, 
      updateSettings 
    };

  return (
    <AuthContext.Provider value={value}>
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
