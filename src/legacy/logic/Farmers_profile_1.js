import { auth, db } from "../../../backend/firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export function initialize() {
// DOM Element Cache
        const pfpInput = document.getElementById('pfp-input');
        const pfpPreview = document.getElementById('pfp-preview');
        const pfpIcon = document.getElementById('pfp-icon');

        const fullNameInput = document.getElementById('profile-fullname');
        const emailInput = document.getElementById('profile-email');
        const phoneInput = document.getElementById('profile-phone');
        const dobInput = document.getElementById('profile-dob');
        const genderInput = document.getElementById('profile-gender');
        const roleInput = document.getElementById('profile-role');
        
        const profileForm = document.getElementById('profile-form');
        const saveBtn = document.getElementById('save-changes-btn');
        const logoutBtn = document.getElementById('logout-btn');
        const messageBadgeEl = document.getElementById('message-notification-badge');
        const headerMessageBadgeEl = document.getElementById('header-message-notification-badge');
        const headerAvatarEl = document.getElementById('header-user-avatar');
        const headerNameEl = document.getElementById('header-user-name');
        const headerRoleEl = document.getElementById('header-user-role');

        // Modal Elements Cache
        const notificationModal = document.getElementById('notification-modal');
        const modalIconContainer = document.getElementById('modal-icon-container');
        const modalIcon = document.getElementById('modal-icon');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        const modalCloseBtn = document.getElementById('modal-close-btn');

        let currentUser = null;
        let base64ImageString = null;

        // Custom Modal Alert Presentation Handler
        function showModalAlert(type, title, message) {
            // Clear prior status classes
            modalIconContainer.className = "w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl ";
            
            if (type === 'success') {
                modalIconContainer.classList.add('bg-green-100', 'text-green-600');
                modalIcon.className = "fa-solid fa-circle-check";
                modalCloseBtn.className = "w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-medium rounded-xl transition shadow-sm text-sm";
            } else {
                modalIconContainer.classList.add('bg-red-100', 'text-red-600');
                modalIcon.className = "fa-solid fa-circle-xmark";
                modalCloseBtn.className = "w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition shadow-sm text-sm";
            }

            modalTitle.textContent = title;
            modalMessage.textContent = message;

            // Trigger structural flex and animations transitions
            notificationModal.classList.remove('hidden');
            setTimeout(() => {
                notificationModal.classList.remove('opacity-0');
                notificationModal.querySelector('div').classList.remove('scale-95');
            }, 10);
        }

        // Hide Modal Presentation
        function hideModalAlert() {
            notificationModal.classList.add('opacity-0');
            notificationModal.querySelector('div').classList.add('scale-95');
            setTimeout(() => {
                notificationModal.classList.add('hidden');
            }, 300);
        }

        modalCloseBtn.addEventListener('click', hideModalAlert);
        document.getElementById('farmer-reset-password-btn').addEventListener('click', async () => {
            if (!currentUser?.email) return showModalAlert('error', 'Password Reset Failed', 'No email address is available for this account.');
            try {
                await sendPasswordResetEmail(auth, currentUser.email);
                showModalAlert('success', 'Check Your Email', `Password reset instructions were sent to ${currentUser.email}. Check your inbox and spam folder.`);
            } catch (error) {
                console.error('Password reset error:', error);
                showModalAlert('error', 'Password Reset Failed', 'We could not send a password reset email. Please try again.');
            }
        });

        // Toggle visibility between placeholder icon and the image markup
        function updatePfpUI(srcString) {
            pfpPreview.src = srcString;
            pfpPreview.classList.remove('hidden');
            pfpIcon.classList.add('hidden');
            if (headerAvatarEl) {
                headerAvatarEl.src = srcString;
                headerAvatarEl.classList.remove('hidden');
            }
        }

        function getMessageNotificationCount(snapshot, userId) {
            let unreadTotal = 0;
            let hasUnreadData = false;
            snapshot.forEach((roomSnap) => {
                const room = roomSnap.data();
                if (room.unreadCounts || room.unreadBy || room.unread) hasUnreadData = true;
                const countMap = room.unreadCounts || room.unreadBy || room.unread || {};
                const count = Number(countMap[userId] || 0);
                if (count > 0) unreadTotal += count;
            });
            return unreadTotal;
        }

        function updateMessageBadge(count) {
            [messageBadgeEl, headerMessageBadgeEl].forEach((badge) => {
                if (!badge) return;
                if (count > 0) {
                    badge.textContent = count > 99 ? "99+" : String(count);
                    badge.classList.remove('hidden');
                    if (badge === headerMessageBadgeEl) badge.classList.add('flex');
                } else {
                    badge.classList.add('hidden');
                    if (badge === headerMessageBadgeEl) badge.classList.remove('flex');
                }
            });
        }

        function listenForMessageNotifications(userId) {
            const chatsQuery = query(collection(db, "chats"), where("participants", "array-contains", userId));
            onSnapshot(chatsQuery, (snapshot) => {
                updateMessageBadge(getMessageNotificationCount(snapshot, userId));
            }, (err) => {
                console.error("Message notification sync failed:", err);
                updateMessageBadge(0);
            });
        }

        // 1. Observe Authentication State & Auto-Populate Inputs
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                currentUser = user;
                emailInput.value = user.email || "";
                if (headerNameEl) headerNameEl.textContent = user.displayName || "FarmRoute User";
                listenForMessageNotifications(user.uid);

                try {
                    const userDocRef = doc(db, "users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);

                    if (userDocSnap.exists()) {
                        const userData = userDocSnap.data();

                        fullNameInput.value = userData.name || "";
                        if (headerNameEl) headerNameEl.textContent = userData.name || user.displayName || "FarmRoute User";
                        if (userData.email) emailInput.value = userData.email;
                        phoneInput.value = userData.phone || "";
                        dobInput.value = userData.dob || "";
                        genderInput.value = userData.gender || "";
                        
                        if (userData.role) {
                            const normalizedRole = userData.role.charAt(0).toUpperCase() + userData.role.slice(1).toLowerCase();
                            roleInput.value = normalizedRole;
                            if (headerRoleEl) headerRoleEl.textContent = normalizedRole;
                        }

                        if (userData.profilePictureUrl) {
                            // Support both stored {base64} data URLs and remote URLs
                            updatePfpUI(userData.profilePictureUrl);
                        } else {
                            // Ensure we show something even if userData doesn't contain the field yet
                            // (keeps icon visible)
                            pfpPreview.classList.add('hidden');
                            pfpIcon.classList.remove('hidden');
                        }
                    }
                } catch (error) {
                    console.error("Error retrieving user profile documents:", error);
                }
            } else {
                window.location.href = "../login.html";
            }
        });

        // 2. Handle File Attachment Selection & Convert to Base64 String
        pfpInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                if (file.size > 2 * 1024 * 1024) {
                    showModalAlert('error', 'File Too Large', 'Image boundaries exceeded! Your file must be smaller than 2MB.');
                    pfpInput.value = ""; 
                    return;
                }

                const reader = new FileReader();
                reader.onloadend = () => {
                    base64ImageString = reader.result;
                    updatePfpUI(base64ImageString);
                };
                reader.readAsDataURL(file);
            }
        });

        // 3. Process Profile Changes Form Save Cycle
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!currentUser) return;

            const originalText = saveBtn.innerHTML;
            saveBtn.disabled = true;
            saveBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Saving changes...`;

            try {
                const userProfilePayload = {
                    name: fullNameInput.value.trim(),
                    email: emailInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    dob: dobInput.value,
                    gender: genderInput.value,
                    updatedAt: new Date()
                };

                if (base64ImageString) {
                    userProfilePayload.profilePictureUrl = base64ImageString;
                }

                const userDocRef = doc(db, "users", currentUser.uid);
                await setDoc(userDocRef, userProfilePayload, { merge: true });

                showModalAlert('success', 'Changes Saved', 'Your profile adjustments have been synchronized and updated successfully.');
            } catch (error) {
                console.error("Error syncing profile modifications to database:", error);
                showModalAlert('error', 'Update Failed', 'We could not save your changes. Please try again.');
            } finally {
                saveBtn.disabled = false;
                saveBtn.innerHTML = originalText;
            }
        });

        // 4. Hook Sidebar Logout Trigger Component
        document.getElementById("side-btn")?.addEventListener("click", () => {
            document.getElementById("side-bar")?.classList.remove("max-md:hidden");
        });

        document.getElementById("closeside-btn")?.addEventListener("click", () => {
            document.getElementById("side-bar")?.classList.add("max-md:hidden");
        });

        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                window.location.href = "../login.html";
            } catch (error) {
                console.error("Logout execution error:", error);
            }
        });
  return {};
}
