import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "",
};

// Required keys check
const requiredKeys = ["apiKey", "authDomain", "projectId", "appId"];
const missingKeys = requiredKeys.filter((k) => !firebaseConfig[k]);

export const isFirebaseConfigured = missingKeys.length === 0;

if (!isFirebaseConfigured) {
  console.error(
    `[Firebase] Missing configuration keys: ${missingKeys.join(", ")}. ` +
      `Create a ".env.local" (copy ".env.example") and fill the VITE_FIREBASE_* values, then restart the dev server.`
  );
}

let app;
let analytics;
let auth;
let db;

if (isFirebaseConfigured) {
  app = initializeApp(firebaseConfig);

  try {
    if (typeof window !== "undefined" && firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
    }
  } catch (e) {
    console.warn("Firebase analytics not initialized:", e);
  }

  auth = getAuth(app);
  db = getFirestore(app);
} else {
  console.warn(
    "Firebase not initialized: missing configuration. Authentication and Firestore are disabled."
  );
}

/* 🔥 EXPORTS REQUIRED BY GUARD DASHBOARD */
export {
  app,
  auth,
  db,
  analytics,
  serverTimestamp,
  Timestamp,
};

export default app;
