import * as admin from 'firebase-admin';

// Initialize the app if it hasn't been initialized yet
if (!admin.apps.length) {
  try {
    // Use the Firebase Admin credentials from .env.local
    const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error("Missing Firebase Admin credentials in environment variables");
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    
    console.log("Firebase Admin initialized successfully with credentials from env vars");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin:", error);
    // Create a minimal mock for development purposes
    console.warn("Using mock Firebase implementation");
  }
}

// Export mock implementations if Firebase initialization failed
const db = admin.apps.length 
  ? admin.firestore() 
  : {
      collection: () => ({
        add: async () => ({ id: "mock-id-" + Date.now() }),
        doc: () => ({
          get: async () => ({ exists: false, data: () => null }),
          set: async () => {},
          update: async () => {},
          delete: async () => {},
        }),
      }),
    };

const auth = admin.apps.length ? admin.auth() : { /* mock implementation */ };
const storage = admin.apps.length ? admin.storage() : { /* mock implementation */ };

export { db, auth, storage }; 