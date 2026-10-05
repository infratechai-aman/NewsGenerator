import * as admin from 'firebase-admin';

let isInitialized = false;

function initAdmin(): admin.app.App | null {
  if (admin.apps.length && admin.apps[0]) {
    return admin.apps[0];
  }

  const serviceAccountVar = process.env.FIREBASE_SERVICE_ACCOUNT;

  try {
    if (serviceAccountVar) {
      // Use service account from environment variable (usually for Vercel/Production)
      const serviceAccount = JSON.parse(serviceAccountVar);
      return admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    } else {
      // Try application default credentials if available
      return admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      });
    }
  } catch (error) {
    if (!isInitialized) {
      console.warn('Firebase admin initialization deferred or credentials not present.');
      isInitialized = true;
    }
    return null;
  }
}

// Proxies for safe lazy access that preserve type signatures and don't fail at import time
export const adminDb = new Proxy({} as admin.firestore.Firestore, {
  get(_, prop) {
    const app = initAdmin();
    if (!app) {
      throw new Error('Firebase Admin Firestore is not configured. Set FIREBASE_SERVICE_ACCOUNT in your environment.');
    }
    const instance = admin.firestore() as any;
    const val = instance[prop];
    return typeof val === 'function' ? val.bind(instance) : val;
  }
});

export const adminStorage = new Proxy({} as admin.storage.Storage, {
  get(_, prop) {
    const app = initAdmin();
    if (!app) {
      throw new Error('Firebase Admin Storage is not configured. Set FIREBASE_SERVICE_ACCOUNT in your environment.');
    }
    const instance = admin.storage() as any;
    const val = instance[prop];
    return typeof val === 'function' ? val.bind(instance) : val;
  }
});

export const adminAuth = new Proxy({} as admin.auth.Auth, {
  get(_, prop) {
    const app = initAdmin();
    if (!app) {
      throw new Error('Firebase Admin Auth is not configured. Set FIREBASE_SERVICE_ACCOUNT in your environment.');
    }
    const instance = admin.auth() as any;
    const val = instance[prop];
    return typeof val === 'function' ? val.bind(instance) : val;
  }
});

