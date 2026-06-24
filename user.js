import { auth } from "./firebase-config.js";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Grab DOM Elements
const authForm = document.getElementById("auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const formTitle = document.getElementById("form-title");
const mainBtn = document.getElementById("main-btn");
const toggleBtn = document.getElementById("toggle-auth-mode");

let isLoginMode = true; // State tracker to switch between Login and Signup

// Toggle between Sign In and Sign Up mode in the UI
toggleBtn.addEventListener("click", () => {
  isLoginMode = !isLoginMode;
  if (isLoginMode) {
    formTitle.innerText = "Login to FarmRoute";
    mainBtn.innerText = "Sign In";
    toggleBtn.innerText = "Don't have an account? Sign Up";
  } else {
    formTitle.innerText = "Create FarmRoute Account";
    mainBtn.innerText = "Sign Up";
    toggleBtn.innerText = "Already have an account? Log In";
  }
});

// Handle Form Submission
authForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Stop page refresh

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    if (isLoginMode) {
      // 🔐 Firebase Sign In Logic
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      alert(`Welcome back! Logged in as: ${userCredential.user.email}`);
      console.log("User logged in:", userCredential.user);
      
      // Next step: redirect to dashboard here
      // window.location.href = "dashboard.html";

    } else {
      // 📝 Firebase Sign Up Logic
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      alert(`Account created successfully for: ${userCredential.user.email}`);
      console.log("User registered:", userCredential.user);
    }
  } catch (error) {
    console.error("Authentication error:", error.code, error.message);
    alert(`Error: ${error.message}`);
  }
});