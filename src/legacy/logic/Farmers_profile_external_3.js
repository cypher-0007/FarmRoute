import { auth, db } from "../../../backend/firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, onSnapshot, query, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { watchUserNotifications } from "../../../backend/notificationService.js";

export function initialize() {
function findOrCreateBell() {
    const existingHeaderBadge = document.getElementById("header-notification-badge");
    if (existingHeaderBadge) {
        existingHeaderBadge.parentElement?.classList.add("relative");
        return existingHeaderBadge;
    }

    let bell = document.querySelector('[aria-label="Notifications"]');
    if (!bell) {
        const header = document.querySelector("header");
        const avatar = document.getElementById("user-avatar");
        const userBlock = avatar?.closest(".flex.items-center.gap-3");
        if (!header || !userBlock?.parentElement) return null;
        bell = document.createElement("a");
        bell.href = "notifications.html";
        bell.setAttribute("aria-label", "Notifications");
        bell.className = "relative text-xl text-gray-600 hover:text-green-700 transition w-10 h-10 inline-flex items-center justify-center";
        bell.innerHTML = '<i class="fa-regular fa-bell"></i>';
        userBlock.parentElement.insertBefore(bell, userBlock);
    }

    bell.classList.add("relative", "w-10", "h-10", "rounded-full", "bg-white", "border", "border-gray-100", "text-gray-600", "hover:text-gray-900", "hover:bg-gray-50", "transition", "inline-flex", "items-center", "justify-center");
    const badge = document.createElement("span");
    badge.id = "header-notification-badge";
    badge.className = "absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-green-600 text-white text-[10px] font-bold items-center justify-center hidden";
    badge.textContent = "0";
    bell.appendChild(badge);
    return badge;
}

findOrCreateBell();
const badges = Array.from(document.querySelectorAll("#header-notification-badge, #sidebar-notification-badge"));
let currentUserId = null;
let stopWatching = null;
let currentDocs = [];
let unreadConversationKeys = [];
let generatedNotifications = [];
let stopOtherWatchers = [];

function renderBadge() {
    if (!badges.length) return;
    if (!currentUserId) {
        badges.forEach((item) => item.classList.add("hidden"));
        return;
    }
    let readState = { read: [], dismissed: [] };
    try {
        readState = JSON.parse(localStorage.getItem(`farmroute:notifications:${currentUserId}`)) || readState;
    } catch {}
    const read = new Set(readState.read || []);
    const dismissed = new Set(readState.dismissed || []);
    let channels = {};
    try { channels = JSON.parse(localStorage.getItem("farmroute:notification-channels") || "{}"); } catch {}
    const count = currentDocs.filter((snapshot) => {
        const data = snapshot.data();
        const key = `event-${snapshot.id}`;
        const channel = data.type === "message" ? "messages"
            : data.type === "advisory" ? "advisories"
            : data.type === "payment" && data.recipientRole === "driver" ? "payments" : "shipments";
        return data.read !== true && channels[channel] !== false && !read.has(key) && !dismissed.has(key);
    }).length + generatedNotifications.filter(({ key, channel }) => {
        const relatedId = key.match(/^(?:shipment|trip)-(.+?)-(?:delivered|in-transit|matched|driver-delivered|searching|assigned)$/)?.[1];
        const listingCode = relatedId ? `FR-${relatedId.slice(0, 8).toUpperCase()}` : null;
        const alreadyTracked = listingCode && currentDocs.some((item) => item.data().relatedId === listingCode);
        return !alreadyTracked && channels[channel] !== false && !read.has(key) && !dismissed.has(key);
    }).length + (channels.messages === false ? 0 : unreadConversationKeys.filter((key) => !read.has(key) && !dismissed.has(key)).length);
    badges.forEach((badge) => {
        badge.textContent = count > 99 ? "99+" : String(count);
        badge.classList.toggle("hidden", count === 0);
        if (badge.id === "header-notification-badge") badge.classList.toggle("flex", count > 0);
    });
}

onAuthStateChanged(auth, (user) => {
    stopWatching?.();
    stopOtherWatchers.forEach((stop) => stop());
    stopOtherWatchers = [];
    currentUserId = user?.uid || null;
    currentDocs = [];
    unreadConversationKeys = [];
    generatedNotifications = [];
    if (!currentUserId) {
        renderBadge();
        return;
    }
    stopWatching = watchUserNotifications(db, currentUserId, (docs) => {
        currentDocs = docs;
        renderBadge();
    }, (error) => console.warn("Notification badge sync failed:", error));
    const addWatcher = (ref, onNext) => stopOtherWatchers.push(onSnapshot(ref, onNext, (error) => console.warn("Notification activity sync failed:", error)));
    const chatsQuery = query(collection(db, "chats"), where("participants", "array-contains", currentUserId));
    addWatcher(chatsQuery, (snapshot) => {
        unreadConversationKeys = [];
        snapshot.forEach((room) => {
            const data = room.data();
            const unread = data.unreadCounts || data.unreadBy || data.unread || {};
            if (Number(unread[currentUserId] || 0) > 0) unreadConversationKeys.push(`message-${room.id}`);
        });
        renderBadge();
    });
    addWatcher(query(collection(db, "products"), where("farmerId", "==", currentUserId)), (snapshot) => {
        const generated = snapshot.docs.map((item) => {
            const status = item.data().status || "Searching";
            const suffix = status === "Delivered" ? "delivered"
                : status === "In Transit" ? "in-transit"
                : status === "Matched" ? "matched"
                : status === "Driver Delivered" ? "driver-delivered" : "searching";
            return { key: `shipment-${item.id}-${suffix}`, channel: "shipments" };
        });
        generatedNotifications = [...generatedNotifications.filter((item) => !item.key.startsWith("shipment-")), ...generated];
        renderBadge();
    });
    addWatcher(query(collection(db, "products"), where("driverId", "==", currentUserId)), (snapshot) => {
        const generated = snapshot.docs.map((item) => {
            const status = item.data().status || "Searching";
            const suffix = status === "Delivered" ? "delivered"
                : status === "In Transit" ? "in-transit"
                : status === "Driver Delivered" ? "driver-delivered" : "assigned";
            return { key: `trip-${item.id}-${suffix}`, channel: "shipments" };
        });
        generatedNotifications = [...generatedNotifications.filter((item) => !item.key.startsWith("trip-")), ...generated];
        renderBadge();
    });
    addWatcher(query(collection(db, "payments"), where("driverId", "==", currentUserId)), (snapshot) => {
        const generated = snapshot.docs.map((item) => ({ key: `payment-${item.id}`, channel: "payments" }));
        generatedNotifications = [...generatedNotifications.filter((item) => !item.key.startsWith("payment-")), ...generated];
        renderBadge();
    });
});

window.addEventListener("storage", renderBadge);
window.addEventListener("farmroute:notification-read-state", renderBadge);
  return {};
}
