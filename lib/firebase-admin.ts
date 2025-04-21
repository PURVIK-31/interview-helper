import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Define service account credentials
const serviceAccount = {
  type: "service_account",
  project_id: "prepwise-f1328",
  private_key_id: "7d5a08d6a4a1c3d9c9d29d8bbd3550d46f598d25",
  private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY 
    ? process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n') 
    : undefined,
  client_email: "firebase-adminsdk-fbsvc@prepwise-f1328.iam.gserviceaccount.com",
  client_id: "102730324020696399722",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40prepwise-f1328.iam.gserviceaccount.com",
  universe_domain: "googleapis.com"
};

// Initialize Firebase Admin SDK
function initAdmin() {
  if (!getApps().length) {
    initializeApp({
      credential: cert(serviceAccount as any),
      projectId: serviceAccount.project_id
    });
  }
  return { 
    db: getFirestore(),
    auth: getAuth()
  };
}

// Export the admin instances
export const { db: adminDb, auth: adminAuth } = initAdmin(); 