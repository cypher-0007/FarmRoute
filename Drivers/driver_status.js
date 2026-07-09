import { auth, db } from "../backend/firebaseConfig.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, serverTimestamp, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const ONLINE_TEXT = "Online - Visible to Farmers";
const OFFLINE_TEXT = "Go Online";

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
            alert("Could not update your driver availability. Please try again.");
        }
    });
}

syncDriverOnlineToggle();
