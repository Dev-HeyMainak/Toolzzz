
import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';

// Your web app's Firebase configuration
// These should be set in your .env.local file
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Log the API key to help with debugging
// console.log('[FirebaseSetup] Attempting to use API Key:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

if (!firebaseConfig.apiKey) {
  console.error(
    '[FirebaseSetup] ERROR: Firebase API Key is missing or undefined. ' +
    'Please ensure NEXT_PUBLIC_FIREBASE_API_KEY is correctly set in your .env.local file ' +
    'and that you have restarted your development server.'
  );
}

let app: FirebaseApp;

// Initialize Firebase
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0]; // Use the already initialized app
}

// Auth is no longer initialized or exported here

export { app };
