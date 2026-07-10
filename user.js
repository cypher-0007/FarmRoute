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

function showAppModal(message, title = "FarmRoute", type = "success") {
  let modal = document.getElementById("app-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "app-modal";
    modal.className = "fixed inset-0 z-50 hidden items-center justify-center bg-black/50 p-4";
    modal.innerHTML = `
      <div class="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
        <div id="app-modal-icon" class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl"></div>
        <h3 id="app-modal-title" class="mb-2 text-lg font-bold text-gray-900"></h3>
        <p id="app-modal-message" class="mb-6 text-sm leading-relaxed text-gray-500"></p>
        <button id="app-modal-close" class="w-full rounded-xl bg-emerald-800 px-4 py-3 text-sm font-semibold text-white">Dismiss</button>
      </div>`;
    document.body.appendChild(modal);
    modal.querySelector("#app-modal-close").addEventListener("click", () => modal.classList.add("hidden"));
  }

  const icon = modal.querySelector("#app-modal-icon");
  icon.className = `mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full text-xl ${type === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`;
  icon.innerHTML = `<i class="fa-solid ${type === "error" ? "fa-circle-xmark" : "fa-circle-check"}"></i>`;
  modal.querySelector("#app-modal-title").textContent = title;
  modal.querySelector("#app-modal-message").textContent = message;
  modal.classList.remove("hidden");
  modal.classList.add("flex");
}

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
      showAppModal(`Welcome back! Logged in as: ${userCredential.user.email}`);
      
      // Next step: redirect to dashboard here
      // window.location.href = "Farmers/dashboard.html";

    } else {
      // 📝 Firebase Sign Up Logic
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      showAppModal(`Account created successfully for: ${userCredential.user.email}`);
    }
  } catch (error) {
    console.error("Authentication error:", error.code, error.message);
    showAppModal(error.message, "Authentication Error", "error");
  }
});
