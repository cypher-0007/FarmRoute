import { auth, db } from "../../../backend/firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, setDoc, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { watchUserNotifications } from "../../../backend/notificationService.js";

export function initialize() {
const LOGIN_PAGE_URL = "../login.html";

    const nameEl = document.getElementById("user-display-name");
    const roleEl = document.getElementById("user-display-role");
    const avatarEl = document.getElementById("user-avatar");
    const loadingScreen = document.getElementById("loading-screen");
    const messageBadgeEl = document.getElementById("message-notification-badge");
    const headerMessageBadgeEl = document.getElementById("header-message-notification-badge");
    const sidebarNotificationBadge = document.getElementById("sidebar-notification-badge");
    const headerNotificationBadge = document.getElementById("header-notification-badge");
    const unreadPill = document.getElementById("unread-pill");
    const listEl = document.getElementById("notification-list");
    const listTitleEl = document.getElementById("notification-list-title");
    const listSubtitleEl = document.getElementById("notification-list-subtitle");
    const summaryEl = document.getElementById("notification-summary");
    const markAllReadBtn = document.getElementById("mark-all-read-btn");
    const clearAllBtn = document.getElementById("clear-all-btn");
    const pushNotificationsInput = document.getElementById("push-notifications");
    const channelStatusEl = document.getElementById("channel-status");

    const CATEGORY_BY_TYPE = {
        listing: "shipments",
        shipment: "shipments",
        payment: "shipments",
        message: "messages",
        advisory: "advisories"
    };

    const TONES = {
        listing: { icon: "fa-box-open", wrap: "bg-emerald-50 text-emerald-700" },
        shipment: { icon: "fa-truck-fast", wrap: "bg-blue-50 text-blue-600" },
        payment: { icon: "fa-wallet", wrap: "bg-amber-50 text-amber-600" },
        message: { icon: "fa-regular fa-message", wrap: "bg-violet-50 text-violet-600" },
        advisory: { icon: "fa-solid fa-seedling", wrap: "bg-green-50 text-green-700" }
    };

    let currentUserId = null;
    let activeFilter = "all";
    let notifications = [];
    let listingSnapshots = [];
    let chatSnapshots = [];
    let actionNotificationSnapshots = [];
    let readState = loadReadState();
    let enabledChannels = loadChannels();

    function storageKey() {
        return `farmroute:notifications:${currentUserId || "guest"}`;
    }

    function loadReadState() {
        try {
            return JSON.parse(localStorage.getItem(storageKey())) || { read: [], dismissed: [] };
        } catch (error) {
            console.error("Notification state could not be read:", error);
            return { read: [], dismissed: [] };
        }
    }

    function saveReadState() {
        try {
            localStorage.setItem(storageKey(), JSON.stringify(readState));
            window.dispatchEvent(new Event("farmroute:notification-read-state"));
        } catch (error) {
            console.error("Notification state could not be saved:", error);
        }
    }

    function loadChannels() {
        try {
            const stored = JSON.parse(localStorage.getItem("farmroute:notification-channels"));
            return {
                shipments: stored?.shipments !== false,
                messages: stored?.messages !== false,
                advisories: stored?.advisories !== false
            };
        } catch (error) {
            return { shipments: true, messages: true, advisories: true };
        }
    }

    function saveChannels() {
        try {
            localStorage.setItem("farmroute:notification-channels", JSON.stringify(enabledChannels));
        } catch (error) {
            console.error("Notification channels could not be saved:", error);
        }
    }

    function hideLoading() {
        if (loadingScreen) loadingScreen.classList.add("hidden");
    }

    function escapeHTML(text) {
        const div = document.createElement("div");
        div.textContent = text ?? "";
        return div.innerHTML;
    }

    function toMillis(value) {
        if (!value) return 0;
        if (typeof value.toDate === "function") return value.toDate().getTime();
        if (typeof value === "object" && value.seconds) return value.seconds * 1000;
        const parsed = new Date(value).getTime();
        return Number.isNaN(parsed) ? 0 : parsed;
    }

    function activityMillis(data) {
        return toMillis(data.updatedAt) || toMillis(data.statusUpdatedAt) || toMillis(data.deliveredAt)
            || toMillis(data.assignedAt) || toMillis(data.createdAt) || toMillis(data.timestamp);
    }

    function relativeTime(millis) {
        if (!millis) return "Recently";
        const diff = Date.now() - millis;
        if (diff < 0) return "Just now";
        const minute = 60000;
        const hour = 60 * minute;
        const day = 24 * hour;

        if (diff < minute) return "Just now";
        if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
        if (diff < day) return `${Math.floor(diff / hour)}h ago`;
        if (diff < 7 * day) return `${Math.floor(diff / day)}d ago`;
        return new Date(millis).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
    }

    function fullTimestamp(millis) {
        if (!millis) return "No timestamp available";
        return new Date(millis).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    }

    function readDocumentCount(data, userId) {
        const countMap = data.unreadCounts || data.unreadBy || data.unread || {};
        return Number(countMap[userId] || 0);
    }

    function buildShipmentNotifications(products, isDriver) {
        return products.map((productSnap) => {
            const data = productSnap.data();
            const crop = data.name || "Unnamed crop";
            const route = `${data.routeFrom || data.location || "Farm"} → ${data.routeTo || "Marketplace"}`;
            const timestamp = activityMillis(data);
            const status = data.status || "Searching";
            const shared = {
                id: productSnap.id,
                category: "shipments",
                timestamp,
                href: isDriver ? "active_trips.html" : "listings.html"
            };

            if (status === "Delivered") {
                return {
                    ...shared,
                    key: `shipment-${productSnap.id}-delivered`,
                    type: "shipment",
                    title: `${crop} delivered`,
                    body: `Your delivery of ${crop} (${data.weight || data.quantity || "produce"} ${data.unit || "kg"}) completed on ${route}.`,
                    meta: `₦${Number(data.totalValue || data.price || 0).toLocaleString()} settled`
                };
            }

            if (status === "In Transit") {
                return {
                    ...shared,
                    key: `shipment-${productSnap.id}-in-transit`,
                    type: "shipment",
                    title: isDriver ? `Trip started for ${crop}` : `Driver assigned to ${crop}`,
                    body: isDriver
                        ? `Collect ${crop} from ${data.routeFrom || "the pickup point"} and deliver to ${data.routeTo || "the marketplace"}.`
                        : `${crop} is now in transit on ${route}. Track the movement from your listings.`,
                    meta: "In transit"
                };
            }

            if (status === "Matched") {
                return {
                    ...shared,
                    key: `shipment-${productSnap.id}-matched`,
                    type: "shipment",
                    title: `${crop} matched with a driver`,
                    body: `A driver accepted listing ${productSnap.id.slice(0, 8).toUpperCase()}. Delivery is awaiting pickup.`,
                    meta: "Awaiting pickup"
                };
            }

            if (status === "Driver Delivered") {
                return {
                    ...shared,
                    key: `shipment-${productSnap.id}-driver-delivered`,
                    type: "payment",
                    title: `Delivery of ${crop} is awaiting your review`,
                    body: `Listing ${productSnap.id.slice(0, 8).toUpperCase()} reached the delivery hub. Review the delivery to authorize escrow release.`,
                    href: "payment.html",
                    meta: "Awaiting review"
                };
            }

            return {
                ...shared,
                    key: `shipment-${productSnap.id}-searching`,
                    type: "listing",
                    title: `You successfully listed ${crop}`,
                    body: `Listing ${productSnap.id.slice(0, 8).toUpperCase()} is live on ${route} and awaiting a driver match.`,
                meta: "Searching"
            };
        });
    }

    function buildPaymentNotifications(payments) {
        return payments.map((paymentSnap) => {
            const data = paymentSnap.data();
            return {
                key: `payment-${paymentSnap.id}`,
                type: "payment",
                category: "shipments",
                timestamp: activityMillis(data),
                href: "payment.html",
                title: `Payment ${data.status === "Paid" ? "received" : "processed"}`,
                body: `A payment of ₦${Number(data.amount || 0).toLocaleString()} for ${data.productName || data.description || "your delivery"} was recorded.`,
                meta: data.status || "Recorded"
            };
        });
    }

    function buildMessageNotifications(chats, userId, isDriver) {
        return chats.map((roomSnap) => {
            const data = roomSnap.data();
            const unread = readDocumentCount(data, userId);
            if (unread <= 0) return null;
            const sender = isDriver ? (data.farmerName || "A farmer") : (data.driverName || "A driver");
            return {
                key: `message-${roomSnap.id}`,
                type: "message",
                category: "messages",
                timestamp: toMillis(data.lastMessageTime) || 0,
                href: "messages.html",
                title: unread > 1 ? `${unread} new messages from ${sender}` : `New message from ${sender}`,
                body: data.lastMessage || "Open your conversations to read the latest update.",
                meta: unread > 1 ? `${unread} unread` : "Unread"
            };
        }).filter(Boolean);
    }

    function channelIsEnabled(notification) {
        const channel = CATEGORY_BY_TYPE[notification.type] || "shipments";
        return enabledChannels[channel] !== false;
    }

    function visibleNotifications() {
        return notifications
            .filter(channelIsEnabled)
            .filter((item) => !readState.dismissed.includes(item.key))
            .filter((item) => activeFilter !== "unread" || !readState.read.includes(item.key))
            .sort((a, b) => b.timestamp - a.timestamp);
    }

    function unreadCount() {
        return notifications
            .filter(channelIsEnabled)
            .filter((item) => !readState.dismissed.includes(item.key) && !readState.read.includes(item.key))
            .length;
    }

    function updateBadge(element, count) {
        if (!element) return;
        element.textContent = count > 99 ? "99+" : String(count);
        element.classList.toggle("hidden", count === 0);
    }

    function updateMessageBadges(count) {
        [messageBadgeEl, headerMessageBadgeEl].forEach((badge) => {
            if (!badge) return;
            badge.textContent = count > 99 ? "99+" : String(count);
            badge.classList.toggle("hidden", count === 0);
            if (badge === headerMessageBadgeEl) badge.classList.toggle("flex", count > 0);
        });
    }

    function renderSummary() {
        const total = notifications.filter(channelIsEnabled).filter((item) => !readState.dismissed.includes(item.key)).length;
        const unread = unreadCount();
        const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const thisWeek = notifications.filter((item) => channelIsEnabled() && item.timestamp >= weekAgo).length;

        summaryEl.innerHTML = `
            <div class="bg-white rounded-2xl border p-5 shadow-sm">
                <div class="flex items-center justify-between">
                    <h3 class="text-gray-600 font-medium text-sm">Unread</h3>
                    <span class="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
                        <i class="fa-solid fa-envelope text-red-500"></i>
                    </span>
                </div>
                <p class="text-3xl font-bold text-gray-900 mt-4">${unread}</p>
            </div>
            <div class="bg-white rounded-2xl border p-5 shadow-sm">
                <div class="flex items-center justify-between">
                    <h3 class="text-gray-600 font-medium text-sm">This week</h3>
                    <span class="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                        <i class="fa-regular fa-clock text-emerald-600"></i>
                    </span>
                </div>
                <p class="text-3xl font-bold text-gray-900 mt-4">${thisWeek}</p>
            </div>
            <div class="bg-white rounded-2xl border p-5 shadow-sm">
                <div class="flex items-center justify-between">
                    <h3 class="text-gray-600 font-medium text-sm">Total tracked</h3>
                    <span class="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                        <i class="fa-solid fa-layer-group text-blue-600"></i>
                    </span>
                </div>
                <p class="text-3xl font-bold text-gray-900 mt-4">${total}</p>
            </div>`;
    }

    function renderFilters() {
        document.querySelectorAll(".notification-filter").forEach((button) => {
            const isActive = button.dataset.filter === activeFilter;
            button.className = `notification-filter px-3 sm:px-4 py-2 text-sm rounded-md transition ${isActive
                ? "bg-green-700 text-white font-semibold shadow-sm"
                : "text-gray-500 font-medium hover:bg-gray-100 hover:text-gray-900"}`;
        });
    }

    function renderList() {
        const items = visibleNotifications();
        const unread = unreadCount();

        updateBadge(sidebarNotificationBadge, unread);
        updateBadge(headerNotificationBadge, unread);
        if (unreadPill) {
            unreadPill.textContent = `${unread} new`;
            unreadPill.classList.toggle("hidden", unread === 0);
        }

        markAllReadBtn.disabled = unread === 0;
        markAllReadBtn.classList.toggle("opacity-50", unread === 0);
        markAllReadBtn.classList.toggle("cursor-not-allowed", unread === 0);

        renderSummary();
        listTitleEl.textContent = activeFilter === "unread" ? "Unread notifications" : "All notifications";
        listSubtitleEl.textContent = items.length
            ? `${items.length} update${items.length === 1 ? "" : "s"} · updated ${relativeTime(items[0].timestamp)}`
            : "You are all caught up.";

        if (!items.length) {
            listEl.innerHTML = `
                <div class="py-16 px-6 text-center">
                    <div class="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                        <i class="fa-regular fa-bell"></i>
                    </div>
                    <h3 class="font-semibold text-gray-900">${activeFilter === "unread" ? "No unread notifications" : "No notifications yet"}</h3>
                    <p class="text-sm text-gray-400 mt-1 max-w-sm mx-auto leading-relaxed">
                        ${activeFilter === "unread"
                            ? "You have read everything. New shipment and message updates will land here."
                            : "Once you list produce or a driver accepts your load, activity appears here automatically."}
                    </p>
                    <a href="listings.html"
                        class="mt-6 inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 text-sm font-semibold px-4 py-2.5 rounded-xl transition">
                        <i class="fa-solid fa-box-open text-xs"></i>
                        View my listings
                    </a>
                </div>`;
            return;
        }

        listEl.innerHTML = items.map((item) => {
            const tone = TONES[item.type] || TONES.advisory;
            const isRead = readState.read.includes(item.key);
            const iconMarkup = tone.icon.startsWith("fa-regular") || tone.icon.includes(" ")
                ? `<i class="${tone.icon}"></i>`
                : `<i class="fa-solid ${tone.icon}"></i>`;

            return `
                <article data-notification-key="${escapeHTML(item.key)}"
                    class="group flex gap-4 p-5 sm:p-6 transition hover:bg-gray-50/70 cursor-pointer ${isRead ? "" : "bg-emerald-50/40"}">
                    <span class="w-11 h-11 rounded-2xl ${tone.wrap} flex items-center justify-center text-lg shrink-0">
                        ${iconMarkup}
                    </span>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-start justify-between gap-3">
                            <h3 class="font-semibold text-gray-900 text-sm sm:text-base">${escapeHTML(item.title)}</h3>
                            <span class="flex items-center gap-2 shrink-0">
                                ${item.meta ? `<span class="hidden sm:inline bg-gray-100 text-gray-600 text-[11px] font-semibold px-2 py-0.5 rounded-full">${escapeHTML(item.meta)}</span>` : ""}
                                <time class="text-xs text-gray-400 whitespace-nowrap" title="${fullTimestamp(item.timestamp)}">${relativeTime(item.timestamp)}</time>
                            </span>
                        </div>
                        <p class="text-sm text-gray-500 mt-1 leading-relaxed">${escapeHTML(item.body)}</p>
                        <div class="flex items-center gap-4 mt-3">
                            <a href="${escapeHTML(item.href)}" class="text-xs font-semibold text-green-700 hover:underline">Open ${escapeHTML(item.href.replace(".html", ""))}</a>
                            <button type="button" data-dismiss-key="${escapeHTML(item.key)}"
                                class="text-xs font-medium text-gray-400 hover:text-red-600 transition">Dismiss</button>
                            ${isRead ? "" : `<button type="button" data-read-key="${escapeHTML(item.key)}" class="text-xs font-medium text-gray-400 hover:text-green-700 transition">Mark read</button>`}
                        </div>
                    </div>
                    ${isRead ? "" : '<span class="w-2.5 h-2.5 rounded-full bg-green-600 shrink-0 mt-2" aria-label="Unread"></span>'}
                </article>`;
        }).join("");

        listEl.querySelectorAll("[data-read-key]").forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                markAsRead(button.dataset.readKey);
            });
        });

        listEl.querySelectorAll("[data-dismiss-key]").forEach((button) => {
            button.addEventListener("click", (event) => {
                event.stopPropagation();
                dismissNotification(button.dataset.dismissKey);
            });
        });

        listEl.querySelectorAll("[data-notification-key]").forEach((row) => {
            row.addEventListener("click", () => {
                const notification = notifications.find((item) => item.key === row.dataset.notificationKey);
                if (!notification) return;
                markAsRead(notification.key);
                window.location.href = notification.href;
            });
        });
    }

    function render() {
        renderFilters();
        renderList();
    }

    function markAsRead(key) {
        if (readState.read.includes(key)) return;
        readState.read.push(key);
        saveReadState();
        render();
    }

    function dismissNotification(key) {
        if (!readState.dismissed.includes(key)) readState.dismissed.push(key);
        if (!readState.read.includes(key)) readState.read.push(key);
        saveReadState();
        render();
    }

    function markAllAsRead() {
        const pending = notifications
            .filter(channelIsEnabled)
            .filter((item) => !readState.read.includes(item.key))
            .map((item) => item.key);

        if (!pending.length) return;
        readState.read = Array.from(new Set([...readState.read, ...pending]));
        saveReadState();
        render();
    }

    function clearAllNotifications() {
        const active = notifications.filter(channelIsEnabled).map((item) => item.key);
        if (!active.length) return;
        readState.dismissed = Array.from(new Set([...readState.dismissed, ...active]));
        saveReadState();
        render();
    }

    document.querySelectorAll(".notification-filter").forEach((button) => {
        button.addEventListener("click", () => {
            activeFilter = button.dataset.filter;
            render();
        });
    });

    markAllReadBtn.addEventListener("click", markAllAsRead);
    clearAllBtn.addEventListener("click", clearAllNotifications);

    document.querySelectorAll("[data-channel]").forEach((input) => {
        input.checked = enabledChannels[input.dataset.channel] !== false;
        input.addEventListener("change", () => {
            enabledChannels[input.dataset.channel] = input.checked;
            saveChannels();
            render();
        });
    });

    pushNotificationsInput.addEventListener("change", async () => {
        if (!currentUserId) return;
        try {
            await setDoc(doc(db, "users", currentUserId), { pushNotifications: pushNotificationsInput.checked }, { merge: true });
            showChannelStatus(pushNotificationsInput.checked ? "Push notifications enabled." : "Push notifications paused.", false);
        } catch (error) {
            console.error("Push notification preference failed:", error);
            pushNotificationsInput.checked = !pushNotificationsInput.checked;
            showChannelStatus("We could not save that preference. Please try again.", true);
        }
    });

    function showChannelStatus(message, isError) {
        if (!channelStatusEl) return;
        channelStatusEl.textContent = message;
        channelStatusEl.className = `text-xs mt-4 ${isError ? "text-red-500" : "text-emerald-700"}`;
        channelStatusEl.classList.remove("hidden");
    }

    function listenForMessageNotifications(userId) {
        const chatsQuery = query(collection(db, "chats"), where("participants", "array-contains", userId));
        onSnapshot(chatsQuery, (snapshot) => {
            let total = 0;
            snapshot.forEach((roomSnap) => {
                total += readDocumentCount(roomSnap.data(), userId);
            });
            updateMessageBadges(total);
        }, (err) => {
            console.error("Message notification sync failed:", err);
            updateMessageBadges(0);
        });
    }

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = LOGIN_PAGE_URL;
            return;
        }

        currentUserId = user.uid;
        readState = loadReadState();
        watchUserNotifications(db, user.uid, (docs) => {
            actionNotificationSnapshots = docs;
            rebuildNotifications(user.uid);
        }, (error) => console.error("Action notification listener failed:", error));
        nameEl.innerText = user.displayName || "FarmRoute User";
        roleEl.innerText = "Farmer";
        hideLoading();
        listenForMessageNotifications(user.uid);

        try {
            const userDocSnap = await getDoc(doc(db, "users", user.uid));
            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                if (userData.name) nameEl.innerText = userData.name;
                if (userData.role) roleEl.innerText = userData.role;
                pushNotificationsInput.checked = userData.pushNotifications !== false;
                if (userData.profilePictureUrl) {
                    avatarEl.src = userData.profilePictureUrl;
                    avatarEl.classList.remove("hidden");
                }
            }
        } catch (error) {
            console.error("Firestore profile fetch failed:", error);
        }

        const productsRef = collection(db, "products");
        const ownListingsQuery = query(productsRef, where("farmerId", "==", user.uid));

        onSnapshot(ownListingsQuery, (snapshot) => {
            listingSnapshots = snapshot.docs;
            rebuildNotifications(user.uid);
        }, (err) => console.error("Listing notification listener failed:", err));

        const chatsQuery = query(collection(db, "chats"), where("participants", "array-contains", user.uid));

        onSnapshot(chatsQuery, (snapshot) => {
            chatSnapshots = snapshot.docs;
            rebuildNotifications(user.uid);
        }, (err) => console.error("Chat notification listener failed:", err));
    });

    function rebuildNotifications(userId) {
        const actionListingCodes = new Set(actionNotificationSnapshots.map((snapshot) => snapshot.data().relatedId).filter(Boolean));
        const shipmentNotifications = buildShipmentNotifications(listingSnapshots, false)
            .filter((item) => !actionListingCodes.has(`FR-${String(item.id).slice(0, 8).toUpperCase()}`));
        notifications = [
            ...actionNotificationSnapshots.map((snapshot) => {
                const data = snapshot.data();
                return {
                    key: `event-${snapshot.id}`,
                    type: data.type || "shipment",
                    category: CATEGORY_BY_TYPE[data.type] || "shipments",
                    timestamp: toMillis(data.createdAt) || Date.now(),
                    href: data.href || "listings.html",
                    title: data.title || "FarmRoute update",
                    body: data.body || "There is a new update on your account.",
                    meta: data.relatedId ? `#${data.relatedId}` : ""
                };
            }),
            ...shipmentNotifications,
            ...buildMessageNotifications(chatSnapshots, userId, false)
        ];
        render();
    }

    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            signOut(auth).then(() => {
                window.location.href = LOGIN_PAGE_URL;
            }).catch((error) => {
                console.error("Signout error:", error);
            });
        });
    }
  return {};
}
