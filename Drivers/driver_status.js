import { auth, db } from "../backend/firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const ONLINE_TEXT = "Online - Visible to Farmers";
const OFFLINE_TEXT = "Go Online";

function showNoticeModal(message) {
    const modal = document.createElement("div");
    modal.className = "fixed inset-0 z-[80] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm";
    modal.innerHTML = `
        <div class="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl">
            <div class="w-14 h-14 rounded-full bg-red-100 text-red-600 mx-auto mb-4 flex items-center justify-center text-xl">
                <i class="fa-solid fa-circle-xmark"></i>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">Availability Update Failed</h3>
            <p class="text-gray-500 text-sm mb-6 leading-relaxed"></p>
            <button class="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-semibold text-sm">Dismiss</button>
        </div>`;
    modal.querySelector("p").textContent = message;
    modal.querySelector("button").addEventListener("click", () => modal.remove());
    document.body.appendChild(modal);
}

function findOnlineButton() {
    return document.getElementById("go-online-btn") || document.getElementById("online-toggle-btn");
}

function setButtonVisual(button, isOnline) {
    if (!button) return;

    const label = document.getElementById("online-label");
    if (label) {
        label.textContent = isOnline ? ONLINE_TEXT : OFFLINE_TEXT;
    } else {
        button.innerHTML = `
            <i class="fa-solid fa-circle text-xs ${isOnline ? "text-emerald-500 animate-pulse" : ""}"></i>
            ${isOnline ? ONLINE_TEXT : OFFLINE_TEXT}
        `;
    }

    button.dataset.online = String(isOnline);
    button.classList.toggle("bg-gray-700", isOnline);
    button.classList.toggle("hover:bg-gray-600", isOnline);
    button.classList.toggle("text-white", isOnline);
    button.classList.toggle("bg-green-600", !isOnline && button.id === "go-online-btn");
    button.classList.toggle("hover:bg-green-500", !isOnline && button.id === "go-online-btn");
}

async function saveDriverAvailability(user, isOnline) {
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
        isOnline,
        availableNow: isOnline,
        lastAvailabilityChangeAt: serverTimestamp()
    }, { merge: true });
    await updateDoc(userRef, {
        "driverPreferences.availableNow": isOnline
    });
}

export function syncDriverOnlineToggle() {
    const button = findOnlineButton();
    if (!button) return;

    let currentUser = null;

    onAuthStateChanged(auth, async (user) => {
        currentUser = user;
        if (!user) return;

        try {
            const userSnap = await getDoc(doc(db, "users", user.uid));
            const data = userSnap.exists() ? userSnap.data() : {};
            const profileOnline = data.driverPreferences?.availableNow;
            setButtonVisual(button, Boolean(data.isOnline ?? data.availableNow ?? profileOnline));
        } catch (err) {
            console.error("Driver availability lookup failed:", err);
        }
    });

    button.addEventListener("click", async () => {
        if (!currentUser) return;
        const nextOnlineState = button.dataset.online !== "true";
        setButtonVisual(button, nextOnlineState);

        try {
            await saveDriverAvailability(currentUser, nextOnlineState);
        } catch (err) {
            console.error("Driver availability save failed:", err);
            setButtonVisual(button, !nextOnlineState);
            showNoticeModal("Could not update your driver availability. Please try again.");
        }
    });
}

syncDriverOnlineToggle();
