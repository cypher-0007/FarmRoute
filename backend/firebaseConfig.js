// Vite injects VITE_* values from .env at build time. The fallback preserves
// the existing static HTML app until it is migrated to the Vite/React build.
const env = import.meta.env || {};

// 1. Import the specific Firebase SDK modules from the official CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. Your web app's Firebase configuration (Copy/Paste your exact keys here)
const firebaseConfig = {
    apiKey: env.VITE_FIREBASE_API_KEY || "AIzaSyDIbnRsXJNEOrWAGQos1iuZSXlCHwVoB_k",
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || "farmroute-49758.firebaseapp.com",
    projectId: env.VITE_FIREBASE_PROJECT_ID || "farmroute-49758",
    storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || "farmroute-49758.firebasestorage.app",
    messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1067367723341",
    appId: env.VITE_FIREBASE_APP_ID || "1:1067367723341:web:854daaa610d0bc87b80704",
    measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || "G-E71JJ2PKWZ"
  };
// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 4. Initialize the Auth and Database services so they are ready to use
export const auth = getAuth(app);
export const db = getFirestore(app);
