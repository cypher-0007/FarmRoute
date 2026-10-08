import { auth, db } from "../../../backend/firebaseConfig.js";
import { 
            createUserWithEmailAndPassword, 
            signInWithEmailAndPassword, 
            signInWithCustomToken,
            sendPasswordResetEmail,
            updateProfile,
            onAuthStateChanged,
            GoogleAuthProvider,
            signInWithPopup,
        } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export function initialize() {
let isCreatingAccount = false;
        let authStateReady = false;
        let isHandlingGoogleSignIn = false;
        const googleProvider = new GoogleAuthProvider();
        googleProvider.setCustomParameters({ prompt: "select_account" });

        function showAppModal(message, title = "FarmRoute", type = "error") {
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

        const normalizeRole = (role) => String(role || "").trim().toLowerCase();
        const normalizePhone = (phone) => String(phone || "").replace(/\D/g, "");
        const phoneAuthEmail = (phone) => `${normalizePhone(phone)}@phone.farmroute.invalid`;

        const getRedirectUrl = (role) => {
            const isGitHubPages = window.location.hostname.includes("github.io");
            const repoPath = isGitHubPages ? `/${window.location.pathname.split('/')[1]}` : "";
            const normalizedRole = normalizeRole(role);
            
            if (normalizedRole === "farmer") {
                return `${window.location.origin}${repoPath}/Farmers/dashboard.html`;
            } else if (normalizedRole === "driver") {
                return `${window.location.origin}${repoPath}/Drivers/dashboard.html`;
            }
            return null;
        };

        async function redirectUserByRole(uid) {
            try {
                const userDocRef = doc(db, "users", uid);
                const userDoc = await getDoc(userDocRef);

                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const role = normalizeRole(userData.role);
                    const targetUrl = getRedirectUrl(role);

                    if (targetUrl) {
                        window.location.href = targetUrl;
                    } else {
                        console.error("Unknown user role profile found:", userData.role);
                        showAppModal("Configured system role is invalid.");
                    }
                } else {
                    console.error("No Firestore document matching current UID found.");
                    showAppModal("Profile setup missing. Please sign up or contact administrator.");
                }
            } catch (error) {
                console.error("Error reading database configuration setup:", error);
                showAppModal("Failed to retrieve your access credentials configuration permissions.");
            }
        }

        // Active Session Checker
        onAuthStateChanged(auth, (user) => {
            const firstAuthState = !authStateReady;
            authStateReady = true;
            if (user && !firstAuthState && !isCreatingAccount && !isHandlingGoogleSignIn) {
                redirectUserByRole(user.uid);
            }
        });

        function googleErrorMessage(error) {
            const messages = {
                "auth/unauthorized-domain": `Add ${window.location.hostname} to Firebase Console > Authentication > Settings > Authorized domains, then try Google sign-in again.`,
                "auth/popup-blocked": "Google sign-in was blocked. Please try again.",
                "auth/account-exists-with-different-credential": "This email is already associated with another sign-in method. Log in with that method first."
            };
            return messages[error.code] || "Google sign-in could not be completed. Please try again.";
        }

        function showGoogleRolePicker(user) {
            return new Promise((resolve) => {
                let modal = document.getElementById("google-role-modal");
                if (!modal) {
                    modal = document.createElement("div");
                    modal.id = "google-role-modal";
                    modal.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4";
                    modal.innerHTML = `
                        <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
                            <div class="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700"><i class="fa-solid fa-seedling text-xl"></i></div>
                            <h3 class="mb-2 text-center text-lg font-bold text-gray-900">Choose your FarmRoute role</h3>
                            <p class="mb-5 text-center text-sm text-gray-500">Select how you’ll use FarmRoute. This will be your assigned role.</p>
                            <div class="grid grid-cols-2 gap-3">
                                <button type="button" data-role="farmer" class="rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 hover:border-emerald-600"><i class="fa-solid fa-wheat-awn mr-2"></i>Farmer</button>
                                <button type="button" data-role="driver" class="rounded-xl border-2 border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 hover:border-emerald-600"><i class="fa-solid fa-truck mr-2"></i>Driver</button>
                            </div>
                        </div>`;
                    document.body.appendChild(modal);
                }
                const finish = async (role) => {
                    modal.remove();
                    try {
                        await setDoc(doc(db, "users", user.uid), {
                            uid: user.uid,
                            name: user.displayName || "FarmRoute User",
                            email: user.email || "",
                            phone: "",
                            role,
                            authProvider: "google.com",
                            createdAt: new Date().toISOString()
                        });
                        resolve(true);
                    } catch (error) {
                        console.error("Google profile setup error:", error);
                        showAppModal("We couldn’t save your role. Please sign in again and retry.", "Profile Setup Failed");
                        resolve(false);
                    }
                };
                modal.querySelectorAll("[data-role]").forEach((button) => button.addEventListener("click", () => finish(button.dataset.role), { once: true }));
            });
        }

        async function beginGoogleSignIn() {
            isHandlingGoogleSignIn = true;
            try {
                const result = await signInWithPopup(auth, googleProvider);
                const user = result.user;
                const profileRef = doc(db, "users", user.uid);
                const existingProfile = await getDoc(profileRef);

                if (!existingProfile.exists()) {
                    const roleSaved = await showGoogleRolePicker(user);
                    if (!roleSaved) return;
                }

                await redirectUserByRole(user.uid);
            } catch (error) {
                console.error("Google sign-in error:", error);
                showAppModal(googleErrorMessage(error), "Google Sign-in");
            } finally {
                isHandlingGoogleSignIn = false;
            }
        }

        // SIGN UP FLOW
        document.getElementById('signup-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const name = document.getElementById('signup-name').value.trim();
            const phone = document.getElementById('signup-phone').value.trim();
            const email = document.getElementById('signup-email').value.trim();
            const password = document.getElementById('signup-password').value;
            const role = normalizeRole(document.getElementById('user-role').value); 

            try {
                isCreatingAccount = true;

                // Firebase email/password auth requires an email identifier. For
                // users who omit email, use a stable internal identifier derived
                // from their phone so they can still sign in with phone/password.
                const authEmail = email || phoneAuthEmail(phone);

                let user;
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, authEmail, password);
                    user = userCredential.user;
                } catch (authError) {
                    // A previous signup may have created the Auth account but failed
                    // before its Firestore profile was saved. Let that same user resume.
                    if (authError.code !== "auth/email-already-in-use") throw authError;

                    const existingCredential = await signInWithEmailAndPassword(auth, authEmail, password);
                    user = existingCredential.user;
                    const existingProfile = await getDoc(doc(db, "users", user.uid));
                    if (existingProfile.exists()) throw authError;
                }

                await updateProfile(user, { displayName: name });

                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    name: name,
                    email: email,
                    phone: normalizePhone(phone),
                    role: role,
                    createdAt: new Date().toISOString()
                });

                isCreatingAccount = false;
                await redirectUserByRole(user.uid);

            } catch (error) {
                isCreatingAccount = false; 
                console.error("Signup error:", error);
                const signupMessages = {
                    "auth/email-already-in-use": "An account already uses this email or phone number. Try logging in instead.",
                    "auth/invalid-email": "Enter a valid email address.",
                "auth/weak-password": "Choose a stronger password (at least 6 characters).",
                "auth/operation-not-allowed": "Email and password sign-up is disabled in Firebase Authentication. Enable it in Firebase Console > Authentication > Sign-in method.",
                    "auth/unauthorized-domain": `Add ${window.location.hostname} to Firebase Console > Authentication > Settings > Authorized domains.`,
                    "auth/invalid-api-key": "The Firebase API key is invalid. Check the web app configuration in backend/firebaseConfig.js.",
                    "permission-denied": "The account was created, but Firestore denied saving its profile. Check the Firestore rules for users/{uid}.",
                    "firestore/permission-denied": "The account was created, but Firestore denied saving its profile. Check the Firestore rules for users/{uid}."
                };
                showAppModal(signupMessages[error.code] || "We could not create your account right now. Please try again.", "Signup Failed");
            }
        });

        // PASSWORD RESET FLOW
        document.getElementById('forgot-password').addEventListener('click', async (event) => {
            event.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            if (!email) {
                showAppModal('Enter your email address above, then select Forgot Password again.', 'Email Required');
                document.getElementById('login-email').focus();
                return;
            }
            try {
                await sendPasswordResetEmail(auth, email);
                showAppModal(`Password reset instructions were sent to ${email}. Check your inbox and spam folder.`, 'Check Your Email', 'success');
            } catch (error) {
                console.error('Password reset error:', error);
                const messages = {
                    'auth/invalid-email': 'Enter a valid email address.',
                    'auth/user-not-found': 'No account was found for that email address.',
                    'auth/too-many-requests': 'Too many attempts. Please wait a while and try again.'
                };
                showAppModal(messages[error.code] || "We could not send a password reset email. Please try again.", 'Password Reset Failed');
            }
        });

        // LOGIN FLOW
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const identifier = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            try {
                let authEmail = identifier;
                if (!identifier.includes('@')) {
                    const phone = normalizePhone(identifier);
                    if (phone.length < 7) {
                        showAppModal("Enter a valid email address or phone number.", "Check Your Login Details");
                        return;
                    }

                    const response = await fetch("/api/phone-login", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ phone, password })
                    });
                    const result = await response.json();
                    if (!response.ok) throw new Error(result.error || "Phone login could not be completed.");
                    await signInWithCustomToken(auth, result.token);
                    return;
                }
                await signInWithEmailAndPassword(auth, authEmail, password);
            } catch (error) {
                console.error("Login error:", error);
                const messages = {
                    "auth/invalid-credential": "Email or password is incorrect. Check both and try again.",
                    "auth/user-not-found": "No account was found for that email. Create an account first.",
                    "auth/wrong-password": "Email or password is incorrect. Check both and try again.",
                    "auth/too-many-requests": "Too many failed attempts. Wait a moment, then try again.",
                    "auth/operation-not-allowed": "Email and password sign-in is disabled in Firebase Authentication. Enable it in Firebase Console > Authentication > Sign-in method.",
                    "auth/unauthorized-domain": `Add ${window.location.hostname} to Firebase Console > Authentication > Settings > Authorized domains.`,
                    "functions/not-found": "Phone login service is not available.",
                    "functions/unavailable": "Phone login service is temporarily unavailable."
                };
                showAppModal(messages[error.code] || `${error.message}${error.code ? ` (${error.code})` : ""}`, "Login Failed");
            }
        });
        document.getElementById("google-login-btn").addEventListener("click", () => beginGoogleSignIn());
        document.getElementById("google-signup-btn").addEventListener("click", () => beginGoogleSignIn());
  return {};
}
