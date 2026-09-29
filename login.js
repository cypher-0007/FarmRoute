  import { auth, db } from "./backend/firebaseConfig.js"; 
        import { 
            createUserWithEmailAndPassword, 
            signInWithEmailAndPassword, 
            updateProfile,
            onAuthStateChanged,
            GoogleAuthProvider,
            getRedirectResult,
            signInWithRedirect,
            signOut
        } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
        import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

        let isCreatingAccount = false;
        let isHandlingGoogleRedirect = true;
        const GOOGLE_SIGNUP_STORAGE_KEY = "farmroute.googleSignup";
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
            if (user && !isCreatingAccount && !isHandlingGoogleRedirect) {
                redirectUserByRole(user.uid);
            }
        });

        function googleErrorMessage(error) {
            const messages = {
                "auth/unauthorized-domain": "This website has not been authorized for Google sign-in yet.",
                "auth/popup-blocked": "Google sign-in was blocked. Please try again.",
                "auth/account-exists-with-different-credential": "This email is already associated with another sign-in method. Log in with that method first."
            };
            return messages[error.code] || "Google sign-in could not be completed. Please try again.";
        }

        async function beginGoogleSignIn(mode) {
            try {
                if (mode === "signup") {
                    const role = normalizeRole(document.getElementById("user-role").value);
                    const phone = document.getElementById("signup-phone").value.trim();
                    const name = document.getElementById("signup-name").value.trim();

                    if (!role || !phone) {
                        showAppModal("Choose Farmer or Driver and enter your phone number before continuing with Google.", "Complete Your Profile");
                        return;
                    }

                    sessionStorage.setItem(GOOGLE_SIGNUP_STORAGE_KEY, JSON.stringify({ role, phone, name }));
                } else {
                    sessionStorage.removeItem(GOOGLE_SIGNUP_STORAGE_KEY);
                }

                await signInWithRedirect(auth, googleProvider);
            } catch (error) {
                console.error("Google sign-in error:", error);
                showAppModal(googleErrorMessage(error), "Google Sign-in");
            }
        }

        async function completeGoogleSignIn() {
            let handledRedirectResult = false;
            try {
                const result = await getRedirectResult(auth);
                // Redirect state can be unavailable after Firebase restores a
                // session. In that case, use the restored Google user so the
                // selected Farmer/Driver role can still be saved to Firestore.
                const user = result?.user || auth.currentUser;
                const signedInWithGoogle = user?.providerData?.some((provider) => provider.providerId === "google.com");
                if (!user || !signedInWithGoogle) return;
                handledRedirectResult = true;

                const profileRef = doc(db, "users", user.uid);
                const existingProfile = await getDoc(profileRef);

                if (!existingProfile.exists()) {
                    const savedSignup = sessionStorage.getItem(GOOGLE_SIGNUP_STORAGE_KEY);
                    const signup = savedSignup ? JSON.parse(savedSignup) : null;

                    if (!signup?.role || !signup?.phone) {
                        await signOut(auth);
                        switchTab("signup");
                        showAppModal("New Google users need to choose a role and add a phone number before signing in.", "Complete Your Profile");
                        return;
                    }

                    await setDoc(profileRef, {
                        uid: user.uid,
                        name: signup.name || user.displayName || "FarmRoute User",
                        email: user.email || "",
                        phone: signup.phone,
                        role: signup.role,
                        authProvider: "google.com",
                        createdAt: new Date().toISOString()
                    });
                    sessionStorage.removeItem(GOOGLE_SIGNUP_STORAGE_KEY);
                }

                await redirectUserByRole(user.uid);
            } catch (error) {
                console.error("Google redirect error:", error);
                showAppModal(googleErrorMessage(error), "Google Sign-in");
            } finally {
                isHandlingGoogleRedirect = false;
                if (auth.currentUser && !handledRedirectResult) redirectUserByRole(auth.currentUser.uid);
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

                let user;
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    user = userCredential.user;
                } catch (authError) {
                    // A previous signup may have created the Auth account but failed
                    // before its Firestore profile was saved. Let that same user resume.
                    if (authError.code !== "auth/email-already-in-use") throw authError;

                    const existingCredential = await signInWithEmailAndPassword(auth, email, password);
                    user = existingCredential.user;
                    const existingProfile = await getDoc(doc(db, "users", user.uid));
                    if (existingProfile.exists()) throw authError;
                }

                await updateProfile(user, { displayName: name });

                await setDoc(doc(db, "users", user.uid), {
                    uid: user.uid,
                    name: name,
                    email: email,
                    phone: phone,
                    role: role,
                    createdAt: new Date().toISOString()
                });

                isCreatingAccount = false;
                await redirectUserByRole(user.uid);

            } catch (error) {
                isCreatingAccount = false; 
                console.error("Signup error:", error);
                const signupMessages = {
                    "auth/email-already-in-use": "An account already uses this email. Try logging in instead.",
                    "auth/invalid-email": "Enter a valid email address.",
                    "auth/weak-password": "Choose a stronger password (at least 6 characters).",
                    "auth/operation-not-allowed": "Email and password sign-up is disabled in Firebase Authentication. Enable it in Firebase Console > Authentication > Sign-in method.",
                    "auth/unauthorized-domain": "This website domain is not authorized for Firebase Authentication. Add it in Firebase Console > Authentication > Settings > Authorized domains.",
                    "auth/invalid-api-key": "The Firebase API key is invalid. Check the web app configuration in backend/firebaseConfig.js.",
                    "permission-denied": "The account was created, but Firestore denied saving its profile. Check the Firestore rules for users/{uid}.",
                    "firestore/permission-denied": "The account was created, but Firestore denied saving its profile. Check the Firestore rules for users/{uid}."
                };
                showAppModal(signupMessages[error.code] || `${error.message}${error.code ? ` (${error.code})` : ""}`, "Signup Failed");
            }
        });

        // LOGIN FLOW
        document.getElementById('login-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;

            try {
                await signInWithEmailAndPassword(auth, email, password);
            } catch (error) {
                console.error("Login error:", error);
                showAppModal(error.message, "Login Failed");
            }
        });

        document.getElementById("google-login-btn").addEventListener("click", () => beginGoogleSignIn("login"));
        document.getElementById("google-signup-btn").addEventListener("click", () => beginGoogleSignIn("signup"));
        completeGoogleSignIn();
