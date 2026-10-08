import { auth, db } from "../../../backend/firebaseConfig.js";
import { onAuthStateChanged, sendPasswordResetEmail, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, doc, getDoc, onSnapshot, query, setDoc, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export function initialize() {
const pfpInput = document.getElementById("pfp-input");
        const pfpPreview = document.getElementById("pfp-preview");
        const pfpIcon = document.getElementById("pfp-icon");
        const fullNameInput = document.getElementById("profile-fullname");
        const emailInput = document.getElementById("profile-email");
        const phoneInput = document.getElementById("profile-phone");
        const dobInput = document.getElementById("profile-dob");
        const genderInput = document.getElementById("profile-gender");
        const roleInput = document.getElementById("profile-role");
        const bankNameInput = document.getElementById("bank-name");
        const accountNameInput = document.getElementById("account-name");
        const accountNumberInput = document.getElementById("account-number");
        const pushNotificationsInput = document.getElementById("push-notifications");
        const profileForm = document.getElementById("profile-form");
        const saveBtn = document.getElementById("save-changes-btn");
        const logoutBtn = document.getElementById("logout-btn");
        const messageBadgeEl = document.getElementById("message-notification-badge");
        const headerMessageBadgeEl = document.getElementById("header-message-notification-badge");
        const headerAvatarEl = document.getElementById("header-user-avatar");
        const headerNameEl = document.getElementById("header-user-name");
        const headerRoleEl = document.getElementById("header-user-role");

        const notificationModal = document.getElementById("notification-modal");
        const notificationCard = document.getElementById("notification-card");
        const modalIconContainer = document.getElementById("modal-icon-container");
        const modalIcon = document.getElementById("modal-icon");
        const modalTitle = document.getElementById("modal-title");
        const modalMessage = document.getElementById("modal-message");
        const modalCloseBtn = document.getElementById("modal-close-btn");

        // PIN Elements
        const pinNotSetEl = document.getElementById("pin-not-set");
        const pinSetEl = document.getElementById("pin-set");
        const setPinBtn = document.getElementById("set-pin-btn");
        const changePinBtn = document.getElementById("change-pin-btn");

        // Set PIN Modal Elements
        const setPinModal = document.getElementById("set-pin-modal");
        const setPinCloseBtn = document.getElementById("set-pin-close");
        const setPinCancelBtn = document.getElementById("set-pin-cancel-btn");
        const setPinSubmitBtn = document.getElementById("set-pin-submit-btn");
        const setPinErrorEl = document.getElementById("set-pin-error");
        const setPinNewInputs = document.querySelectorAll("#new-pin-input-wrapper input");
        const setPinConfirmInputs = document.querySelectorAll("#confirm-pin-input-wrapper input");

        // Change PIN Modal Elements
        const changePinModal = document.getElementById("change-pin-modal");
        const changePinCloseBtn = document.getElementById("change-pin-close");
        const changePinCancelBtn = document.getElementById("change-pin-cancel-btn");
        const changePinSubmitBtn = document.getElementById("change-pin-submit-btn");
        const changePinCurrentErrorEl = document.getElementById("change-pin-current-error");
        const changePinErrorEl = document.getElementById("change-pin-error");
        const changePinCurrentInputs = document.querySelectorAll("#current-pin-input-wrapper input");
        const changePinNewInputs = document.querySelectorAll("#change-new-pin-input-wrapper input");
        const changePinConfirmInputs = document.querySelectorAll("#change-confirm-pin-input-wrapper input");

        let currentUser = null;
        let base64ImageString = null;
        let userWithdrawalPin = null;

        function showModalAlert(type, title, message) {
            modalIconContainer.className = "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl";
            if (type === "success") {
                modalIconContainer.classList.add("bg-green-100", "text-green-600");
                modalIcon.className = "fa-solid fa-circle-check";
                modalCloseBtn.className = "w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white font-medium rounded-xl transition text-sm";
            } else {
                modalIconContainer.classList.add("bg-red-100", "text-red-600");
                modalIcon.className = "fa-solid fa-circle-xmark";
                modalCloseBtn.className = "w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition text-sm";
            }
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            notificationModal.classList.remove("hidden");
            setTimeout(() => {
                notificationModal.classList.remove("opacity-0");
                notificationCard.classList.remove("scale-95");
            }, 10);
        }

        function hideModalAlert() {
            notificationModal.classList.add("opacity-0");
            notificationCard.classList.add("scale-95");
            setTimeout(() => notificationModal.classList.add("hidden"), 300);
        }

        function updatePfpUI(srcString) {
            pfpPreview.src = srcString;
            pfpPreview.classList.remove("hidden");
            pfpIcon.classList.add("hidden");
            headerAvatarEl.src = srcString;
            headerAvatarEl.classList.remove("hidden");
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
                    badge.classList.remove("hidden");
                    if (badge === headerMessageBadgeEl) badge.classList.add("flex");
                } else {
                    badge.classList.add("hidden");
                    if (badge === headerMessageBadgeEl) badge.classList.remove("flex");
                }
            });
        }

        function listenForMessageNotifications(userId) {
            const chatsQuery = query(collection(db, "chats"), where("participants", "array-contains", userId));
            onSnapshot(chatsQuery, (snapshot) => updateMessageBadge(getMessageNotificationCount(snapshot, userId)), () => updateMessageBadge(0));
        }

        modalCloseBtn.addEventListener("click", hideModalAlert);
        document.getElementById("driver-reset-password-btn").addEventListener("click", async () => {
            if (!currentUser?.email) return showModalAlert("error", "Password Reset Failed", "No email address is available for this account.");
            try {
                await sendPasswordResetEmail(auth, currentUser.email);
                showModalAlert("success", "Check Your Email", `Password reset instructions were sent to ${currentUser.email}. Check your inbox and spam folder.`);
            } catch (error) {
                console.error("Password reset error:", error);
                showModalAlert("error", "Password Reset Failed", "We could not send a password reset email. Please try again.");
            }
        });

        pfpInput.addEventListener("change", (event) => {
            const file = event.target.files[0];
            if (!file) return;
            if (file.size > 2 * 1024 * 1024) {
                showModalAlert("error", "File Too Large", "Your image must be smaller than 2MB.");
                pfpInput.value = "";
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                base64ImageString = reader.result;
                updatePfpUI(base64ImageString);
            };
            reader.readAsDataURL(file);
        });

        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = "../login.html";
                return;
            }

            currentUser = user;
            emailInput.value = user.email || "";
            headerNameEl.textContent = user.displayName || "FarmRoute Driver";
            listenForMessageNotifications(user.uid);

            try {
                const userDocSnap = await getDoc(doc(db, "users", user.uid));
                if (!userDocSnap.exists()) return;

                const userData = userDocSnap.data();
                const bankDetails = userData.bankDetails || {};
                fullNameInput.value = userData.name || "";
                emailInput.value = userData.email || user.email || "";
                phoneInput.value = userData.phone || "";
                dobInput.value = userData.dob || "";
                genderInput.value = userData.gender || "";
                roleInput.value = "Driver";
                bankNameInput.value = bankDetails.bankName || userData.bankName || "";
                accountNameInput.value = bankDetails.accountName || userData.accountName || "";
                accountNumberInput.value = bankDetails.accountNumber || userData.accountNumber || "";
                pushNotificationsInput.checked = userData.pushNotifications !== false;
                headerNameEl.textContent = userData.name || user.displayName || "FarmRoute Driver";
                headerRoleEl.textContent = "Driver";

                // Load withdrawal PIN and update UI
                userWithdrawalPin = userData.withdrawalPin || null;
                updatePinUI();

                if (userData.profilePictureUrl || user.photoURL) {
                    updatePfpUI(userData.profilePictureUrl || user.photoURL);
                }
            } catch (error) {
                showModalAlert("error", "Profile Load Failed", "We could not load your profile. Please refresh and try again.");
            }
        });

        profileForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            if (!currentUser) return;

            const originalText = saveBtn.innerHTML;
            saveBtn.disabled = true;
            saveBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin"></i> Saving changes...`;

            try {
                const payload = {
                    name: fullNameInput.value.trim(),
                    email: emailInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    dob: dobInput.value,
                    gender: genderInput.value,
                    role: "driver",
                    pushNotifications: pushNotificationsInput.checked,
                    bankDetails: {
                        bankName: bankNameInput.value,
                        accountName: accountNameInput.value.trim(),
                        accountNumber: accountNumberInput.value.trim()
                    },
                    updatedAt: new Date()
                };

                if (base64ImageString) payload.profilePictureUrl = base64ImageString;

                await setDoc(doc(db, "users", currentUser.uid), payload, { merge: true });
                showModalAlert("success", "Changes Saved", "Your driver profile and bank details have been updated.");
            } catch (error) {
                showModalAlert("error", "Update Failed", "We could not save your changes. Please try again.");
            } finally {
                saveBtn.disabled = false;
                saveBtn.innerHTML = originalText;
            }
        });

        document.getElementById("side-btn")?.addEventListener("click", () => {
            document.getElementById("side-bar")?.classList.remove("max-md:hidden");
        });

        document.getElementById("closeside-btn")?.addEventListener("click", () => {
            document.getElementById("side-bar")?.classList.add("max-md:hidden");
        });

        logoutBtn.addEventListener("click", async () => {
            await signOut(auth);
            window.location.href = "../login.html";
        });

        // PIN FUNCTIONS
        function updatePinUI() {
            if (userWithdrawalPin) {
                pinNotSetEl.classList.add("hidden");
                pinSetEl.classList.remove("hidden");
            } else {
                pinNotSetEl.classList.remove("hidden");
                pinSetEl.classList.add("hidden");
            }
        }

        function clearPinInputs(inputs) {
            inputs.forEach(input => input.value = "");
            inputs.forEach(input => input.classList.remove("border-red-500", "focus:ring-red-600"));
        }

        function setupPinInputNavigation(inputs) {
            inputs.forEach((input, index) => {
                input.addEventListener("input", (e) => {
                    if (e.target.value.length >= 1 && index < inputs.length - 1) {
                        inputs[index + 1].focus();
                    }
                    validatePinForms();
                });
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Backspace" && e.target.value.length === 0 && index > 0) {
                        inputs[index - 1].focus();
                    }
                });
            });
        }

        function getPinFromInputs(inputs) {
            return Array.from(inputs).map(input => input.value).join("");
        }

        function validatePinForms() {
            const newPin = getPinFromInputs(setPinNewInputs);
            const confirmPin = getPinFromInputs(setPinConfirmInputs);
            const isValid = newPin.length === 6 && newPin === confirmPin;
            setPinSubmitBtn.disabled = !isValid;
            setPinErrorEl.classList.toggle("hidden", newPin === confirmPin || confirmPin.length < 6);
        }

        function validateChangePinForms() {
            const currentPin = getPinFromInputs(changePinCurrentInputs);
            const newPin = getPinFromInputs(changePinNewInputs);
            const confirmPin = getPinFromInputs(changePinConfirmInputs);
            const isValid = currentPin.length === 6 && newPin.length === 6 && newPin === confirmPin;
            changePinSubmitBtn.disabled = !isValid;
            changePinErrorEl.classList.toggle("hidden", newPin === confirmPin || confirmPin.length < 6);
        }

        async function processSetPin() {
            const newPin = getPinFromInputs(setPinNewInputs);
            const confirmPin = getPinFromInputs(setPinConfirmInputs);

            if (newPin !== confirmPin) {
                setPinErrorEl.classList.remove("hidden");
                return;
            }

            const originalText = setPinSubmitBtn.innerHTML;
            setPinSubmitBtn.disabled = true;
            setPinSubmitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin mr-2"></i> Setting PIN...`;

            try {
                await setDoc(doc(db, "users", currentUser.uid), {
                    withdrawalPin: newPin
                }, { merge: true });

                userWithdrawalPin = newPin;
                closeSetPinModal();
                updatePinUI();
                showModalAlert("success", "PIN Set Successfully", "Your withdrawal PIN has been set. You can now withdraw funds from the Payments page.");
            } catch (err) {
                console.error("Set PIN failed:", err);
                showModalAlert("error", "Failed to Set PIN", "We could not set your PIN. Please check your details and try again.");
            } finally {
                setPinSubmitBtn.disabled = false;
                setPinSubmitBtn.innerHTML = originalText;
            }
        }

        async function processChangePin() {
            const currentPin = getPinFromInputs(changePinCurrentInputs);
            const newPin = getPinFromInputs(changePinNewInputs);
            const confirmPin = getPinFromInputs(changePinConfirmInputs);

            if (currentPin !== userWithdrawalPin) {
                changePinCurrentErrorEl.classList.remove("hidden");
                clearPinInputs(changePinCurrentInputs);
                changePinCurrentInputs[0].focus();
                return;
            }

            if (newPin !== confirmPin) {
                changePinErrorEl.classList.remove("hidden");
                return;
            }

            const originalText = changePinSubmitBtn.innerHTML;
            changePinSubmitBtn.disabled = true;
            changePinSubmitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin mr-2"></i> Changing PIN...`;

            try {
                await setDoc(doc(db, "users", currentUser.uid), {
                    withdrawalPin: newPin
                }, { merge: true });

                userWithdrawalPin = newPin;
                closeChangePinModal();
                showModalAlert("success", "PIN Changed Successfully", "Your withdrawal PIN has been updated.");
            } catch (err) {
                console.error("Change PIN failed:", err);
                showModalAlert("error", "Failed to Change PIN", "We could not update your PIN. Please check your current PIN and try again.");
            } finally {
                changePinSubmitBtn.disabled = false;
                changePinSubmitBtn.innerHTML = originalText;
            }
        }

        function openSetPinModal() {
            clearPinInputs(setPinNewInputs);
            clearPinInputs(setPinConfirmInputs);
            setPinErrorEl.classList.add("hidden");
            setPinSubmitBtn.disabled = true;
            setPinModal.classList.remove("hidden");
            setTimeout(() => setPinNewInputs[0].focus(), 100);
        }

        function closeSetPinModal() {
            setPinModal.classList.add("hidden");
            clearPinInputs(setPinNewInputs);
            clearPinInputs(setPinConfirmInputs);
            setPinErrorEl.classList.add("hidden");
        }

        function openChangePinModal() {
            clearPinInputs(changePinCurrentInputs);
            clearPinInputs(changePinNewInputs);
            clearPinInputs(changePinConfirmInputs);
            changePinCurrentErrorEl.classList.add("hidden");
            changePinErrorEl.classList.add("hidden");
            changePinSubmitBtn.disabled = true;
            changePinModal.classList.remove("hidden");
            setTimeout(() => changePinCurrentInputs[0].focus(), 100);
        }

        function closeChangePinModal() {
            changePinModal.classList.add("hidden");
            clearPinInputs(changePinCurrentInputs);
            clearPinInputs(changePinNewInputs);
            clearPinInputs(changePinConfirmInputs);
            changePinCurrentErrorEl.classList.add("hidden");
            changePinErrorEl.classList.add("hidden");
        }

        // PIN EVENT LISTENERS
        setupPinInputNavigation(setPinNewInputs);
        setupPinInputNavigation(setPinConfirmInputs);
        setupPinInputNavigation(changePinCurrentInputs);
        setupPinInputNavigation(changePinNewInputs);
        setupPinInputNavigation(changePinConfirmInputs);

        setPinBtn?.addEventListener("click", openSetPinModal);
        changePinBtn?.addEventListener("click", openChangePinModal);
        setPinCloseBtn?.addEventListener("click", closeSetPinModal);
        setPinCancelBtn?.addEventListener("click", closeSetPinModal);
        setPinSubmitBtn?.addEventListener("click", processSetPin);
        changePinCloseBtn?.addEventListener("click", closeChangePinModal);
        changePinCancelBtn?.addEventListener("click", closeChangePinModal);
        changePinSubmitBtn?.addEventListener("click", processChangePin);

        setPinModal?.addEventListener("click", (e) => {
            if (e.target === setPinModal) closeSetPinModal();
        });
        changePinModal?.addEventListener("click", (e) => {
            if (e.target === changePinModal) closeChangePinModal();
        });
  return {};
}
