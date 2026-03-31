import { initializeApp } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

/**
 * Firebase Configuration
 *
 * Get these values from your Firebase Console:
 * 1. Go to https://console.firebase.google.com
 * 2. Select your project
 * 3. Click Settings (gear icon) > Project Settings
 * 4. Under "Your apps", click on your web app to see the config
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Initialize Firestore
export const db = getFirestore(app);

/**
 * Connect to Firebase Emulators in development
 * Uncomment the code below to use local Firebase emulators
 * Make sure to run: firebase emulators:start
 */
if (
  import.meta.env.DEV &&
  import.meta.env.VITE_USE_FIREBASE_EMULATOR === "true"
) {
  try {
    connectAuthEmulator(auth, "http://localhost:9099");
    connectFirestoreEmulator(db, "localhost", 8080);
    console.log("✓ Connected to Firebase emulators");
  } catch (error) {
    // Emulators already connected or error occurred
    console.warn("Firebase emulator connection:", error);
  }
}

export default app;
