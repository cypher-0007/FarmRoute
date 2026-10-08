import { auth, db } from "../../../backend/firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, updateDoc, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { createNotification } from "../../../backend/notificationService.js";

export function initialize() {
const LOGIN_PAGE_URL = "../login.html";

    function showNoticeModal(message, title = "FarmRoute Notice", type = "error") {
        const modal = document.createElement("div");
        modal.className = "fixed inset-0 z-[80] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm";
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl">
                <div class="w-14 h-14 rounded-full ${type === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"} mx-auto mb-4 flex items-center justify-center text-xl">
                    <i class="fa-solid ${type === "error" ? "fa-circle-xmark" : "fa-circle-check"}"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">${title}</h3>
                <p class="text-gray-500 text-sm mb-6 leading-relaxed"></p>
                <button class="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-semibold text-sm">Dismiss</button>
            </div>`;
        modal.querySelector("p").textContent = message;
        modal.querySelector("button").addEventListener("click", () => modal.remove());
        document.body.appendChild(modal);
    }

    function showConfirmModal(message, title = "Confirm Action") {
        return new Promise((resolve) => {
            const modal = document.createElement("div");
            modal.className = "fixed inset-0 z-[80] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm";
            modal.innerHTML = `
                <div class="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl">
                    <div class="w-14 h-14 rounded-full bg-amber-100 text-amber-600 mx-auto mb-4 flex items-center justify-center text-xl">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <h3 class="text-lg font-bold text-gray-900 mb-2">${title}</h3>
                    <p class="text-gray-500 text-sm mb-6 leading-relaxed"></p>
                    <div class="grid grid-cols-2 gap-3">
                        <button data-result="cancel" class="py-3 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-semibold text-sm">Cancel</button>
                        <button data-result="confirm" class="py-3 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl font-semibold text-sm">Confirm</button>
                    </div>
                </div>`;
            modal.querySelector("p").textContent = message;
            modal.addEventListener("click", (event) => {
                const button = event.target.closest("[data-result]");
                if (!button) return;
                const confirmed = button.dataset.result === "confirm";
                modal.remove();
                resolve(confirmed);
            });
            document.body.appendChild(modal);
        });
    }
    const nameEl = document.getElementById("user-display-name");
    const roleEl = document.getElementById("user-display-role");
    const avatarEl = document.getElementById("user-avatar");
    const messageBadgeEl = document.getElementById("message-notification-badge");
    const notificationBadgeEl = document.getElementById("header-notification-badge");
    const loadingScreen = document.getElementById("loading-screen");
    const paymentsContainer = document.getElementById("payments-history-container");
    const paymentsBadge = document.getElementById("payments-badge");
    let currentUserId = null;
    let notificationReadState = { read: [], dismissed: [] };
    let ownListingSnapshot = null;
    let chatNotificationSnapshot = null;

    // Drawer Modal Elements
    const detailDrawer = document.getElementById("detail-drawer");
    const drawerOverlay = document.getElementById("drawer-overlay");
    const closeDrawerBtn = document.getElementById("close-drawer-btn");
    
    const modalOrderId = document.getElementById("modal-order-id");
    const modalPrice = document.getElementById("modal-price");
    const modalStatusBadge = document.getElementById("modal-status-badge");
    const modalCargoImage = document.getElementById("modal-cargo-image");
    const modalCargoFallback = document.getElementById("modal-cargo-fallback");
    const modalDriverImage = document.getElementById("modal-driver-image");
    const modalDriverFallback = document.getElementById("modal-driver-fallback");
    const modalCropName = document.getElementById("modal-crop-name");
    const modalWeight = document.getElementById("modal-weight");
    const modalDriverName = document.getElementById("modal-driver-name");
    const modalOrigin = document.getElementById("modal-origin");
    const modalDestination = document.getElementById("modal-destination");
    const actionCancelBtn = document.getElementById("action-cancel-btn");
    const actionReleaseBtn = document.getElementById("action-release-btn");

    // Warning Modal Elements
    const warningModal = document.getElementById("warning-modal");
    const warningCancelBtn = document.getElementById("warning-cancel-btn");
    const warningConfirmBtn = document.getElementById("warning-confirm-btn");
    const countdownTimer = document.getElementById("countdown-timer");

    // PIN Modal Elements
    const pinModal = document.getElementById("pin-modal");
    const pinCancelBtn = document.getElementById("pin-cancel-btn");
    const pinSubmitBtn = document.getElementById("pin-submit-btn");
    const pinErrorMsg = document.getElementById("pin-error-msg");
    const pinInputs = document.querySelectorAll("#pin-input-wrapper input");

    // Configuration Settings
    const TRANSACTION_SECURE_PIN = "123456";
    let targetedDocId = null;
    let countdownInterval = null;

    function hideLoading() {
        if (loadingScreen) loadingScreen.classList.add("hidden");
    }

    function updateHeaderAvatar(profilePictureUrl) {
        if (!avatarEl || !profilePictureUrl) return;
        avatarEl.src = profilePictureUrl;
        avatarEl.classList.remove("hidden");
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
        if (!messageBadgeEl) return;
        if (count > 0) {
            messageBadgeEl.textContent = count > 99 ? "99+" : String(count);
            messageBadgeEl.classList.remove("hidden");
        } else {
            messageBadgeEl.classList.add("hidden");
        }
    }

    function updateNotificationBadge() {
        if (!notificationBadgeEl || !currentUserId) return;
        let channels = {};
        try { channels = JSON.parse(localStorage.getItem("farmroute:notification-channels") || "{}"); } catch { channels = {}; }
        const read = new Set(notificationReadState.read || []);
        const dismissed = new Set(notificationReadState.dismissed || []);
        let unread = 0;
        if (channels.shipments !== false && ownListingSnapshot) {
            ownListingSnapshot.forEach((productSnap) => {
                const data = productSnap.data();
                const status = data.status || "Searching";
                const key = status === "Delivered"
                    ? `shipment-${productSnap.id}-delivered`
                    : status === "In Transit"
                        ? `shipment-${productSnap.id}-in-transit`
                        : `shipment-${productSnap.id}-searching`;
                if (!read.has(key) && !dismissed.has(key)) unread++;
            });
        }
        if (channels.messages !== false && chatNotificationSnapshot) {
            chatNotificationSnapshot.forEach((roomSnap) => {
                const data = roomSnap.data();
                const counts = data.unreadCounts || data.unreadBy || data.unread || {};
                if (Number(counts[currentUserId] || 0) > 0) {
                    const key = `message-${roomSnap.id}`;
                    if (!read.has(key) && !dismissed.has(key)) unread++;
                }
            });
        }
        notificationBadgeEl.textContent = unread > 99 ? "99+" : String(unread);
        notificationBadgeEl.classList.toggle("hidden", unread === 0);
        notificationBadgeEl.classList.toggle("flex", unread > 0);
    }

    window.addEventListener("storage", (event) => {
        if (event.key === `farmroute:notifications:${currentUserId}` || event.key === "farmroute:notification-channels") {
            try { notificationReadState = JSON.parse(localStorage.getItem(`farmroute:notifications:${currentUserId}`)) || { read: [], dismissed: [] }; } catch { notificationReadState = { read: [], dismissed: [] }; }
            updateNotificationBadge();
        }
    });

    function listenForMessageNotifications(userId) {
        const chatsQuery = query(collection(db, "chats"), where("participants", "array-contains", userId));
        onSnapshot(chatsQuery, (snapshot) => {
            chatNotificationSnapshot = snapshot;
            updateMessageBadge(getMessageNotificationCount(snapshot, userId));
            updateNotificationBadge();
        }, (err) => {
            console.error("Message notification sync failed:", err);
            updateMessageBadge(0);
        });
    }

    // PIN Input management: Auto-focus jumping utilities
    pinInputs.forEach((input, index) => {
        input.addEventListener("input", (e) => {
            if (e.target.value.length >= 1 && index < pinInputs.length - 1) {
                pinInputs[index + 1].focus();
            }
        });
        input.addEventListener("keydown", (e) => {
            if (e.key === "Backspace" && e.target.value.length === 0 && index > 0) {
                pinInputs[index - 1].focus();
            }
        });
    });

    function clearPinInputs() {
        pinInputs.forEach(input => input.value = "");
        pinErrorMsg.classList.add("hidden");
    }

    function openModalDrawer(payload) {
        targetedDocId = payload.id;
        modalOrderId.innerText = `#FR-${payload.orderId}`;
        modalPrice.innerText = `₦${payload.price}`;
        modalStatusBadge.innerText = payload.currentStatus;
        setModalImage(modalCargoImage, modalCargoFallback, payload.productImage);
        setModalImage(modalDriverImage, modalDriverFallback, payload.driverImage);
        modalCropName.innerText = payload.cropName;
        modalWeight.innerText = `${payload.weight} ${payload.unit} total allocation`;
        modalDriverName.innerText = payload.driverName;
        modalOrigin.innerText = payload.routeFrom;
        modalDestination.innerText = payload.routeTo;

        modalStatusBadge.className = "bg-white/20 px-2.5 py-0.5 rounded-full font-semibold text-xs";

        if (payload.currentStatus === "Delivered") {
            actionReleaseBtn.disabled = true;
            actionCancelBtn.disabled = true;
            actionReleaseBtn.className = "w-full bg-gray-100 text-gray-400 py-3 px-4 rounded-xl font-bold text-sm cursor-not-allowed text-center col-span-2";
            actionReleaseBtn.innerText = "Payment Complete";
            actionCancelBtn.classList.add("hidden");
        } else if (payload.currentStatus === "Awaiting Payment") {
            actionCancelBtn.classList.remove("hidden");
            actionCancelBtn.disabled = false;
            actionReleaseBtn.disabled = false;
            modalStatusBadge.classList.add("bg-amber-500", "text-white");
            actionCancelBtn.className = "w-full bg-white border border-gray-200 text-gray-500 py-3 px-4 rounded-xl font-bold text-sm hover:bg-gray-50 transition";
            actionReleaseBtn.className = "w-full bg-green-700 hover:bg-green-800 text-white py-3 px-4 rounded-xl font-bold text-sm transition shadow-md";
            actionReleaseBtn.innerText = "Release Payment";
        } else {
            actionCancelBtn.classList.remove("hidden");
            actionCancelBtn.disabled = false;
            actionReleaseBtn.disabled = true; 
            actionCancelBtn.className = "w-full bg-white border border-gray-200 text-red-600 py-3 px-4 rounded-xl font-bold text-sm hover:bg-red-50 transition";
            actionReleaseBtn.className = "w-full bg-gray-200 text-gray-400 py-3 px-4 rounded-xl font-bold text-sm cursor-not-allowed text-center";
            actionReleaseBtn.innerText = "Awaiting Delivery";
        }

        detailDrawer.classList.remove("hidden");
    }

    function setModalImage(imageEl, fallbackEl, source) {
        if (!imageEl || !fallbackEl) return;
        imageEl.onerror = () => {
            imageEl.classList.add("hidden");
            fallbackEl.classList.remove("hidden");
        };
        if (!source) {
            imageEl.removeAttribute("src");
            imageEl.classList.add("hidden");
            fallbackEl.classList.remove("hidden");
            return;
        }
        imageEl.onload = () => {
            imageEl.classList.remove("hidden");
            fallbackEl.classList.add("hidden");
        };
        imageEl.src = source;
    }

    function closeModalDrawer() {
        detailDrawer.classList.add("hidden");
        targetedDocId = null;
    }

    closeDrawerBtn.addEventListener("click", closeModalDrawer);
    drawerOverlay.addEventListener("click", closeModalDrawer);

    // Initial Safe Status Updater Logic 
    async function updateEscrowStatus(newStatus) {
        if (!targetedDocId) return;
        try {
            const docRef = doc(db, "products", targetedDocId);
            const listingSnapshot = await getDoc(docRef);
            const listingData = listingSnapshot.exists() ? listingSnapshot.data() : {};
            await updateDoc(docRef, { status: newStatus });
            if (newStatus === "Cancelled") {
                const listingCode = `FR-${targetedDocId.slice(0, 8).toUpperCase()}`;
                await Promise.all([
                    createNotification(db, listingData.farmerId || auth.currentUser?.uid, {
                        recipientRole: "farmer",
                        type: "shipment",
                        title: `Listing ${listingCode} was cancelled`,
                        body: `${listingData.name || "Your listing"} was removed from active delivery matching.`,
                        href: "listings.html",
                        relatedId: listingCode
                    }),
                    createNotification(db, listingData.driverId, {
                        recipientRole: "driver",
                        type: "shipment",
                        title: `Listing ${listingCode} was cancelled`,
                        body: `${listingData.name || "The load"} was cancelled by the farmer. Check your active trips for updates.`,
                        href: "active_trips.html",
                        relatedId: listingCode
                    })
                ]);
            }
            closeModalDrawer();
        } catch (error) {
            console.error("Escrow execution failure:", error);
            showNoticeModal("Error altering database entry status.");
        }
    }

    // Trigger 5-Second Warning Pop-up Sequence
    actionReleaseBtn.addEventListener("click", () => {
        if (!targetedDocId) return;
        
        warningModal.classList.remove("hidden");
        warningConfirmBtn.disabled = true;
        warningConfirmBtn.className = "flex-1 bg-gray-200 text-gray-400 py-3 rounded-xl font-semibold text-sm cursor-not-allowed transition";
        
        let secondsLeft = 5;
        countdownTimer.innerText = secondsLeft;

        clearInterval(countdownInterval);
        countdownInterval = setInterval(() => {
            secondsLeft--;
            countdownTimer.innerText = secondsLeft;
            if (secondsLeft <= 0) {
                clearInterval(countdownInterval);
                warningConfirmBtn.disabled = false;
                warningConfirmBtn.className = "flex-1 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold text-sm transition shadow-sm";
            }
        }, 1000);
    });

    warningCancelBtn.addEventListener("click", () => {
        clearInterval(countdownInterval);
        warningModal.classList.add("hidden");
    });

    // Step-down directly to PIN collection wrapper from confirmation modal interface
    warningConfirmBtn.addEventListener("click", () => {
        warningModal.classList.add("hidden");
        clearPinInputs();
        pinModal.classList.remove("hidden");
        setTimeout(() => pinInputs[0].focus(), 100);
    });

    pinCancelBtn.addEventListener("click", () => {
        pinModal.classList.add("hidden");
    });

    // The listing payment is already held in escrow. The PIN only authorizes its release.
    pinSubmitBtn.addEventListener("click", async () => {
        let enteredPin = "";
        pinInputs.forEach(input => enteredPin += input.value);

        if (enteredPin === TRANSACTION_SECURE_PIN) {
            pinModal.classList.add("hidden");
            await finalizeDatabaseTransactionRecord(targetedDocId);
        } else {
            pinErrorMsg.classList.remove("hidden");
            pinInputs.forEach(input => {
                input.value = "";
                input.classList.add("border-red-500", "focus:ring-red-600");
            });
            pinInputs[0].focus();
        }
    });

    // Finalize the escrow authorization without opening a second payment checkout.
    async function finalizeDatabaseTransactionRecord(targetId) {
        try {
            const documentPointer = doc(db, "products", targetId);
            const listingSnapshot = await getDoc(documentPointer);
            const listingData = listingSnapshot.exists() ? listingSnapshot.data() : {};
            await updateDoc(documentPointer, {
                status: "Delivered",
                paymentStatus: "released",
                isEscrowReleased: true,
                paymentAuthorizedAt: new Date(),
                fundsCapturedAt: new Date()
            });
            const listingCode = `FR-${targetId.slice(0, 8).toUpperCase()}`;
            await Promise.all([
                createNotification(db, listingData.farmerId || auth.currentUser?.uid, {
                    recipientRole: "farmer",
                    type: "payment",
                    title: `Payment released for listing ${listingCode}`,
                    body: `Escrow for ${listingData.name || "your delivery"} has been authorized and the delivery is complete.`,
                    href: "payment.html",
                    relatedId: listingCode
                }),
                createNotification(db, listingData.driverId, {
                    recipientRole: "driver",
                    type: "payment",
                    title: `Payout released for listing ${listingCode}`,
                    body: `The farmer authorized escrow for ${listingData.name || "your delivery"}. Review your payment ledger for the payout.`,
                    href: "payments.html",
                    relatedId: listingCode
                })
            ]);
            closeModalDrawer();
            showNoticeModal("The escrow payment has been authorized for the driver.", "Payment Released", "success");
        } catch (databaseWriteError) {
            console.error("Firestore balance lifecycle settlement mutation exception structural context error:", databaseWriteError);
            showNoticeModal("Payment recorded, but database updates failed. Please notify Support with reference ID.");
        }
    }

    actionCancelBtn.addEventListener("click", async () => {
        if (await showConfirmModal("Authorize immediate cancellation?")) {
            updateEscrowStatus("Cancelled");
        }
    });

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = LOGIN_PAGE_URL;
        return;
    }

    currentUserId = user.uid;
    try { notificationReadState = JSON.parse(localStorage.getItem(`farmroute:notifications:${user.uid}`)) || { read: [], dismissed: [] }; } catch { notificationReadState = { read: [], dismissed: [] }; }
    nameEl.innerText = user.displayName || "FarmRoute User";
    hideLoading();
    listenForMessageNotifications(user.uid);

    try {
        const userDocSnap = await getDoc(doc(db, "users", user.uid));
        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.name) nameEl.innerText = userData.name;
            if (userData.role) roleEl.innerText = userData.role;
            updateHeaderAvatar(userData.profilePictureUrl);
        }
    } catch (err) {
        console.error("Firestore profile fetch failed:", err);
    }

    const productsRef = collection(db, "products");
    const paymentsQuery = query(productsRef, where("farmerId", "==", user.uid));

    // Cache driver names and profile images so each driver is fetched once.
    const driverCache = {};

    onSnapshot(paymentsQuery, async (snapshot) => {
        ownListingSnapshot = snapshot;
        updateNotificationBadge();
        if (!paymentsContainer) return;

        paymentsContainer.innerHTML = "";
        let awaitingPaymentCount = 0;

        if (snapshot.empty) {
            paymentsContainer.innerHTML = `
                <p class="text-gray-400 py-12 text-center text-sm">
                    No recorded ledger items found.
                </p>
            `;
            return;
        }

        window.cachedPayments = {};

        for (const docSnap of snapshot.docs) {

            const data = docSnap.data();
            const id = docSnap.id;
            const orderId = id.substring(0, 7).toUpperCase();

            const cropName = data.name || "Produce Cargo";
            const weight = data.quantity || data.weight || "0";
            const unit = data.unit || "kg";
            const routeFrom = data.routeFrom || data.location || "Farm Station";
            const routeTo = data.routeTo || "Hub";
            // `price` is the rate per unit. Payments must use the full listing value.
            const quantity = Number(data.quantity || data.weight || 0);
            const unitPrice = Number(data.price || 0);
            const storedTotalValue = Number(data.totalValue);
            const paymentAmount = Number.isFinite(storedTotalValue) && storedTotalValue > 0
                ? storedTotalValue
                : quantity * unitPrice;
            const price = paymentAmount.toLocaleString();

            let rawStatus = data.status || "Matched";

            // -----------------------------
            // Fetch Driver Name
            // -----------------------------
            let driverName = "Verified Transporter";
            let driverImage = "";

            if (data.driverId) {

                if (driverCache[data.driverId]) {

                    driverName = driverCache[data.driverId].name;
                    driverImage = driverCache[data.driverId].image;

                } else {

                    try {

                        const driverRef = doc(db, "users", data.driverId);
                        const driverSnap = await getDoc(driverRef);

                        if (driverSnap.exists()) {

                            const driverData = driverSnap.data();

                            driverName =
                                driverData.name ||
                                driverData.fullName ||
                                driverData.displayName ||
                                "Verified Transporter";
                            driverImage = driverData.profilePictureUrl || driverData.profilePictureURL || driverData.photoURL || driverData.avatarUrl || driverData.avatar || "";
                            driverCache[data.driverId] = { name: driverName, image: driverImage };

                        }

                    } catch (err) {

                        console.error("Error fetching driver:", err);

                    }

                }

            }

            const driverSubaccount = data.driverSubaccount || "";

            let badgeStyle = "bg-gray-50 text-gray-700 border-gray-100";
            let statusLabel = rawStatus;
            let descriptionText = "Secure Escrow Locked";

            if (
                rawStatus === "Driver Delivered" ||
                rawStatus === "Awaiting Payment"
            ) {

                rawStatus = "Awaiting Payment";
                awaitingPaymentCount++;

                badgeStyle =
                    "bg-amber-50 text-amber-700 border-amber-200 animate-pulse";

                statusLabel = "Awaiting Payment";
                descriptionText = "Driver arrived at hub";

            } else if (rawStatus === "Delivered") {

                badgeStyle =
                    "bg-green-50 text-green-700 border-green-100";

                statusLabel = "Payment Complete";
                descriptionText = "Released successfully";

            } else if (
                rawStatus === "Matched" ||
                rawStatus === "In Transit"
            ) {

                badgeStyle =
                    "bg-blue-50 text-blue-700 border-blue-100";

                statusLabel = "Matched";
                descriptionText = "Cargo en route";
            }

            const productImage = (Array.isArray(data.images) && data.images[0]) || data.imageUrl || data.photoURL || "";

            window.cachedPayments[id] = {
                id,
                orderId,
                cropName,
                weight,
                unit,
                routeFrom,
                routeTo,
                driverName,
                price,
                currentStatus: rawStatus,
                productImage,
                driverImage,
                driverSubaccount
            };

            const cardHtml = `
                <div class="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex justify-between items-center">
                    <div>
                        <span class="${badgeStyle} text-xs font-bold px-2.5 py-1 rounded-full border">
                            ${statusLabel}
                        </span>

                        <h3 class="font-bold text-gray-900 mt-2">
                            #FR-${orderId} (${cropName})
                        </h3>

                        <p class="text-xs text-gray-400 mt-0.5">
                            ${descriptionText} • Driver: ${driverName}
                        </p>
                    </div>

                    <div class="text-right">
                        <h2 class="text-xl font-black text-gray-900">
                            ₦${price}
                        </h2>

                        <button
                            onclick="openDrawerFromEvent('${id}')"
                            class="mt-2 text-xs bg-gray-50 border border-gray-200 text-gray-700 px-3 py-1.5 rounded-xl font-bold hover:bg-gray-100 transition">

                            View Details

                        </button>
                    </div>
                </div>
            `;

            paymentsContainer.insertAdjacentHTML("beforeend", cardHtml);
        }

        if (awaitingPaymentCount > 0) {
            paymentsBadge.innerText = awaitingPaymentCount;
            paymentsBadge.classList.remove("hidden");
        } else {
            paymentsBadge.classList.add("hidden");
        }

    });
});

    window.openDrawerFromEvent = function(id) {
        if(window.cachedPayments && window.cachedPayments[id]) {
            openModalDrawer(window.cachedPayments[id]);
        }
    };

    document.getElementById("side-btn")?.addEventListener("click", () => {
        document.getElementById("side-bar")?.classList.remove("max-md:hidden");
    });

    document.getElementById("closeside-btn")?.addEventListener("click", () => {
        document.getElementById("side-bar")?.classList.add("max-md:hidden");
    });

    document.getElementById("logout-btn")?.addEventListener("click", async () => {
        try {
            await signOut(auth);
            window.location.href = LOGIN_PAGE_URL;
        } catch (error) {
            console.error("Signout error:", error);
            showNoticeModal("Unable to log out. Please try again.");
        }
    });
  return {};
}
