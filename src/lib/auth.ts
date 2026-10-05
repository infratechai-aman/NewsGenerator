import { auth, isFirebaseConfigured } from './firebase';
import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';

export const signIn = async (email: string, password: string) => {
  if (!isFirebaseConfigured) {
    return {
      user: null,
      error: 'Firebase is not configured. Please set NEXT_PUBLIC_FIREBASE_API_KEY in your Vercel / environment variables.',
    };
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

export const signOut = async () => {
  if (!isFirebaseConfigured) {
    return { error: null };
  }

  try {
    await firebaseSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

export const subscribeToAuthChanges = (callback: (user: User | null) => void) => {
  if (!isFirebaseConfigured) {
    // Immediately invoke with null user so the UI is not stuck on an infinite loading spinner
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
};

