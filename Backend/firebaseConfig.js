// 1. Import the specific Firebase SDK modules from the official CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 2. Your web app's Firebase configuration (Copy/Paste your exact keys here)
const firebaseConfig = {
    apiKey: "AIzaSyDIbnRsXJNEOrWAGQos1iuZSXlCHwVoB_k",
    authDomain: "farmroute-49758.firebaseapp.com",
    projectId: "farmroute-49758",
    storageBucket: "farmroute-49758.firebasestorage.app",
    messagingSenderId: "1067367723341",
    appId: "1:1067367723341:web:854daaa610d0bc87b80704",
    measurementId: "G-E71JJ2PKWZ"
  };

// 3. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 4. Initialize the Auth and Database services so they are ready to use
export const auth = getAuth(app);
export const db = getFirestore(app);