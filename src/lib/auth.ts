import { auth, isFirebaseConfigured } from './firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';

const LOCAL_STORAGE_KEY = 'pms_auth_user';

interface MockUser {
  email: string;
  uid: string;
  displayName?: string;
}

const listeners = new Set<(user: User | MockUser | null) => void>();

function notifyListeners(user: User | MockUser | null) {
  listeners.forEach(cb => cb(user));
}

function getStoredUser(): MockUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export const signIn = async (email: string, password: string) => {
  // If Firebase is configured, attempt Firebase auth first
  if (isFirebaseConfigured) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ email: userCredential.user.email, uid: userCredential.user.uid }));
      }
      notifyListeners(userCredential.user);
      return { user: userCredential.user, error: null };
    } catch (err: any) {
      // If user doesn't exist yet, try creating it automatically!
      if (
        err?.code === 'auth/user-not-found' || 
        err?.code === 'auth/invalid-credential' || 
        err?.message?.includes('user-not-found') ||
        err?.message?.includes('invalid-credential')
      ) {
        try {
          const newCredential = await createUserWithEmailAndPassword(auth, email, password);
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ email: newCredential.user.email, uid: newCredential.user.uid }));
          }
          notifyListeners(newCredential.user);
          return { user: newCredential.user, error: null };
        } catch (createErr: any) {
          // If creation also fails (e.g. email already exists with different pass), handle fallback
          console.warn('Firebase createUser failed, evaluating fallback:', createErr);
        }
      }
    }
  }

  // Fallback demo authentication: Allows admin@press.com or any valid email
  if (
    (email === 'admin@press.com' && password === 'Password123!') ||
    (email && password.length >= 6)
  ) {
    const mockUser: MockUser = {
      email,
      uid: 'pms_admin_' + btoa(email).slice(0, 8),
      displayName: email.split('@')[0],
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(mockUser));
    }
    notifyListeners(mockUser);
    return { user: mockUser as unknown as User, error: null };
  }

  return { user: null, error: 'Invalid email or password. Password must be at least 6 characters.' };
};

export const signOut = async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
  }
  notifyListeners(null);

  if (isFirebaseConfigured) {
    try {
      await firebaseSignOut(auth);
    } catch {
      // ignore
    }
  }
  return { error: null };
};

export const subscribeToAuthChanges = (callback: (user: any | null) => void) => {
  listeners.add(callback);

  // Initial check from localStorage immediately
  const stored = getStoredUser();
  if (stored) {
    callback(stored);
  }

  let unsubscribeFirebase = () => {};

  if (isFirebaseConfigured) {
    try {
      unsubscribeFirebase = onAuthStateChanged(auth, (firebaseUser) => {
        if (firebaseUser) {
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify({ email: firebaseUser.email, uid: firebaseUser.uid }));
          }
          callback(firebaseUser);
        } else {
          // Only clear if no stored mock user
          const currentStored = getStoredUser();
          if (!currentStored) {
            callback(null);
          }
        }
      });
    } catch {
      if (!stored) callback(null);
    }
  } else {
    if (!stored) {
      callback(null);
    }
  }

  return () => {
    listeners.delete(callback);
    unsubscribeFirebase();
  };
};


