import { auth, db } from "../../../backend/firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, doc, getDoc, getDocs, onSnapshot, query, serverTimestamp, setDoc, where } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export function initialize() {
const LOGIN_PAGE_URL = "../login.html";
    const loadingScreen = document.getElementById("loading-screen");
    const form = document.getElementById("route-profile-form");
    const saveStatus = document.getElementById("save-status");
    const nameEl = document.getElementById("user-display-name");
    const avatarEl = document.getElementById("user-avatar");
    const routesList = document.getElementById("routes-list");
    const routeFromInput = document.getElementById("route-from");
    const routeToInput = document.getElementById("route-to");
    const vehicleModelOptions = document.getElementById("vehicle-model-options");
    const capacitySource = document.getElementById("capacity-source");
    const capacityPreview = document.getElementById("capacity-preview");
    const routesPreview = document.getElementById("routes-preview");
    const matchPreview = document.getElementById("match-preview");
    const suggestedLoads = document.getElementById("suggested-loads");
    const suggestedCount = document.getElementById("suggested-count");

    const fields = {
        vehicleModel: document.getElementById("vehicle-model"),
        vehicleType: document.getElementById("vehicle-type"),
        capacityKg: document.getElementById("capacity-kg"),
        baseLocation: document.getElementById("base-location"),
        operatingRadiusKm: document.getElementById("operating-radius"),
        cargoType: document.getElementById("cargo-type"),
        minimumPayout: document.getElementById("minimum-payout"),
        acceptSharedLoads: document.getElementById("accept-shared-loads"),
        hasCooling: document.getElementById("has-cooling"),
        availableNow: document.getElementById("available-now")
    };

    let currentUser = null;
    let usualRoutes = [];

    const vehicleCapacityCatalog = [
        { model: "Bajaj RE / Keke Napep", type: "Motorcycle/Tricycle", capacityKg: 350 },
        { model: "Piaggio Ape", type: "Motorcycle/Tricycle", capacityKg: 500 },
        { model: "Suzuki Carry", type: "Mini Van", capacityKg: 750 },
        { model: "Daihatsu Hijet", type: "Mini Van", capacityKg: 600 },
        { model: "Toyota Hiace", type: "Mini Van", capacityKg: 1200 },
        { model: "Nissan Caravan", type: "Mini Van", capacityKg: 1100 },
        { model: "Toyota Hilux", type: "Pickup Truck", capacityKg: 1000 },
        { model: "Ford Ranger", type: "Pickup Truck", capacityKg: 1000 },
        { model: "Mitsubishi L200", type: "Pickup Truck", capacityKg: 1000 },
        { model: "Nissan Navara", type: "Pickup Truck", capacityKg: 1000 },
        { model: "Isuzu D-Max", type: "Pickup Truck", capacityKg: 1100 },
        { model: "Hyundai H100", type: "Medium Truck", capacityKg: 1300 },
        { model: "Kia K2700", type: "Medium Truck", capacityKg: 1500 },
        { model: "Kia K3000", type: "Medium Truck", capacityKg: 1600 },
        { model: "Mitsubishi Canter", type: "Medium Truck", capacityKg: 3000 },
        { model: "Isuzu NHR", type: "Medium Truck", capacityKg: 2000 },
        { model: "Isuzu NPR", type: "Medium Truck", capacityKg: 3500 },
        { model: "Isuzu NQR", type: "Medium Truck", capacityKg: 5000 },
        { model: "Toyota Dyna", type: "Medium Truck", capacityKg: 3000 },
        { model: "Foton Aumark", type: "Medium Truck", capacityKg: 5000 },
        { model: "Mercedes-Benz 814", type: "Heavy Duty Truck", capacityKg: 5000 },
        { model: "Mercedes-Benz 1117", type: "Heavy Duty Truck", capacityKg: 7000 },
        { model: "MAN Diesel Truck", type: "Heavy Duty Truck", capacityKg: 12000 },
        { model: "Iveco Cargo", type: "Heavy Duty Truck", capacityKg: 10000 },
        { model: "DAF CF", type: "Heavy Duty Truck", capacityKg: 18000 },
        { model: "Volvo FH", type: "Heavy Duty Truck", capacityKg: 25000 },
        { model: "Refrigerated Van", type: "Refrigerated Truck", capacityKg: 1200 },
        { model: "Refrigerated Box Truck", type: "Refrigerated Truck", capacityKg: 3500 }
    ];

    function normalizeVehicleText(value) {
        return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
    }

    function findVehicleCapacity(modelName) {
        const normalized = normalizeVehicleText(modelName);
        if (!normalized) return null;

        return vehicleCapacityCatalog.find(item => normalizeVehicleText(item.model) === normalized)
            || vehicleCapacityCatalog.find(item => {
                const catalogName = normalizeVehicleText(item.model);
                return normalized.includes(catalogName) || catalogName.includes(normalized);
            })
            || vehicleCapacityCatalog.find(item => {
                const terms = normalizeVehicleText(item.model).split(" ").filter(term => term.length > 2);
                return terms.length > 0 && terms.every(term => normalized.includes(term));
            });
    }

    function applyVehicleCapacityEstimate() {
        const match = findVehicleCapacity(fields.vehicleModel.value);
        if (!match) {
            capacitySource.textContent = "No estimate found for that model yet. Enter the carrying limit manually if you know it.";
            capacitySource.className = "text-xs text-amber-600 mt-2";
            return;
        }

        fields.vehicleModel.value = match.model;
        fields.vehicleType.value = match.type;
        fields.capacityKg.value = match.capacityKg;
        capacitySource.textContent = `Estimated from FarmRoute's vehicle catalog: ${match.model} usually carries about ${match.capacityKg.toLocaleString()} kg. You can adjust it.`;
        capacitySource.className = "text-xs text-emerald-700 mt-2";
        updatePreview();
    }

    function hideLoading() {
        loadingScreen?.classList.add("hidden");
    }

    function escapeHTML(text) {
        const div = document.createElement("div");
        div.textContent = text ?? "";
        return div.innerHTML;
    }

    function routeText(route) {
        return `${route.from} -> ${route.to}`;
    }

    function getProfilePayload() {
        return {
            vehicleModel: fields.vehicleModel.value.trim(),
            vehicleType: fields.vehicleType.value,
            capacityKg: Number(fields.capacityKg.value || 0),
            baseLocation: fields.baseLocation.value.trim(),
            operatingRadiusKm: Number(fields.operatingRadiusKm.value || 0),
            usualRoutes,
            cargoType: fields.cargoType.value,
            minimumPayout: Number(fields.minimumPayout.value || 0),
            acceptSharedLoads: fields.acceptSharedLoads.checked,
            hasCooling: fields.hasCooling.checked,
            availableNow: fields.availableNow.checked
        };
    }

    function calculateCompleteness(profile = getProfilePayload()) {
        const routes = Array.isArray(profile.usualRoutes) ? profile.usualRoutes : [];
        const checks = [
            profile.vehicleType,
            profile.vehicleModel,
            profile.capacityKg > 0,
            profile.baseLocation,
            profile.operatingRadiusKm > 0,
            routes.length > 0,
            profile.cargoType,
            profile.minimumPayout > 0,
            profile.availableNow || profile.acceptSharedLoads || profile.hasCooling
        ];
        return Math.round((checks.filter(Boolean).length / checks.length) * 100);
    }

    function renderRoutes() {
        routesPreview.textContent = usualRoutes.length;
        if (usualRoutes.length === 0) {
            routesList.innerHTML = `<p class="text-sm text-gray-500">No usual routes added yet.</p>`;
            return;
        }

        routesList.innerHTML = usualRoutes.map((route, index) => `
            <span class="inline-flex items-center gap-2 bg-emerald-50 text-emerald-800 border border-emerald-100 px-3 py-2 rounded-full text-sm font-semibold">
                <i class="fa-solid fa-route text-xs"></i>
                ${escapeHTML(routeText(route))}
                <button type="button" data-remove-route="${index}" class="text-emerald-700 hover:text-red-600" aria-label="Remove route">
                    <i class="fa-solid fa-xmark"></i>
                </button>
            </span>
        `).join("");
    }

    function updatePreview() {
        const profile = getProfilePayload();
        capacityPreview.textContent = profile.capacityKg > 0 ? `${profile.capacityKg.toLocaleString()} kg` : "0 kg";
        routesPreview.textContent = usualRoutes.length;
        matchPreview.textContent = `${calculateCompleteness(profile)}%`;
    }

    function fillForm(profile = {}) {
        fields.vehicleType.value = profile.vehicleType || "";
        fields.vehicleModel.value = profile.vehicleModel || "";
        fields.capacityKg.value = profile.capacityKg || "";
        fields.baseLocation.value = profile.baseLocation || "";
        fields.operatingRadiusKm.value = profile.operatingRadiusKm || "";
        fields.cargoType.value = profile.cargoType || "";
        fields.minimumPayout.value = profile.minimumPayout || "";
        fields.acceptSharedLoads.checked = Boolean(profile.acceptSharedLoads);
        fields.hasCooling.checked = Boolean(profile.hasCooling);
        fields.availableNow.checked = Boolean(profile.availableNow);
        usualRoutes = Array.isArray(profile.usualRoutes) ? profile.usualRoutes : [];
        renderRoutes();
        updatePreview();
    }

    function showStatus(message, type = "success") {
        saveStatus.textContent = message;
        saveStatus.className = `text-sm font-semibold ${type === "success" ? "text-emerald-700" : "text-red-600"}`;
        saveStatus.classList.remove("hidden");
    }

    function routeMatchesProfile(load, profile) {
        const routes = Array.isArray(profile.usualRoutes) ? profile.usualRoutes : [];
        const routeHaystack = [
            load.routeFrom,
            load.location,
            load.pickupPoint,
            load.routeTo,
            load.destination,
            load.dropoffPoint
        ].filter(Boolean).join(" ").toLowerCase();

        const capacityOk = !profile.capacityKg || Number(load.quantity || load.weight || 0) <= profile.capacityKg;
        const payoutOk = !profile.minimumPayout || Number(load.totalValue || load.price || 0) >= profile.minimumPayout;
        const baseOk = !profile.baseLocation || routeHaystack.includes(profile.baseLocation.toLowerCase().split(",")[0].trim());
        const routeOk = routes.length === 0 || routes.some(route => {
            return routeHaystack.includes(route.from.toLowerCase()) || routeHaystack.includes(route.to.toLowerCase());
        });

        return capacityOk && payoutOk && (baseOk || routeOk);
    }

    function normalizeStatus(status) {
        return String(status || "").trim().toLowerCase();
    }

    function isOpenLoad(load) {
        const status = normalizeStatus(load.status);
        return !status || ["searching", "available", "open"].includes(status);
    }

    async function renderSuggestedLoads(profile = getProfilePayload()) {
        if (!currentUser || !suggestedLoads) return;
        suggestedLoads.innerHTML = `<p class="text-sm text-gray-500 py-4 text-center">Checking available loads...</p>`;

        try {
            const loadsQuery = query(collection(db, "products"), where("status", "==", "Searching"));
            const snapshot = await getDocs(loadsQuery);
            const matches = [];
            snapshot.forEach((loadDoc) => {
                const load = { id: loadDoc.id, ...loadDoc.data() };
                if (isOpenLoad(load) && routeMatchesProfile(load, profile)) matches.push(load);
            });

            suggestedCount.textContent = matches.length;
            if (matches.length === 0) {
                suggestedLoads.innerHTML = `<p class="text-sm text-gray-500 py-4 text-center">No current loads match these preferences yet.</p>`;
                return;
            }

            suggestedLoads.innerHTML = matches.slice(0, 4).map(load => {
                const routeFrom = load.routeFrom || load.location || "Pickup";
                const routeTo = load.routeTo || load.destination || "Delivery";
                const quantity = `${load.quantity || load.weight || 0} ${load.unit || "kg"}`;
                const payout = Number(load.totalValue || load.price || 0).toLocaleString();
                return `
                    <a href="available_loads.html?loadId=${encodeURIComponent(load.id)}" class="block border rounded-xl p-3 hover:border-emerald-200 hover:bg-emerald-50/30 transition">
                        <div class="flex justify-between gap-3">
                            <div class="min-w-0">
                                <h4 class="font-semibold text-sm text-gray-900 truncate">${escapeHTML(load.name || "Produce Load")}</h4>
                                <p class="text-xs text-gray-500 mt-1 truncate">${escapeHTML(routeFrom)} -> ${escapeHTML(routeTo)}</p>
                                <p class="text-xs text-gray-400 mt-1">${escapeHTML(quantity)}</p>
                            </div>
                            <span class="text-xs font-bold text-emerald-700 shrink-0">NGN ${payout}</span>
                        </div>
                    </a>
                `;
            }).join("");
        } catch (err) {
            console.error("Suggested load lookup failed:", err);
            suggestedLoads.innerHTML = `<p class="text-sm text-red-500 py-4 text-center">Could not load suggestions.</p>`;
        }
    }

    document.getElementById("add-route-btn")?.addEventListener("click", () => {
        const from = routeFromInput.value.trim();
        const to = routeToInput.value.trim();
        if (!from || !to) return;

        const exists = usualRoutes.some(route => route.from.toLowerCase() === from.toLowerCase() && route.to.toLowerCase() === to.toLowerCase());
        if (!exists) usualRoutes.push({ from, to });
        routeFromInput.value = "";
        routeToInput.value = "";
        renderRoutes();
        updatePreview();
    });

    vehicleModelOptions.innerHTML = vehicleCapacityCatalog
        .map(item => `<option value="${escapeHTML(item.model)}">${item.type} - ${item.capacityKg} kg</option>`)
        .join("");

    document.getElementById("lookup-capacity-btn")?.addEventListener("click", applyVehicleCapacityEstimate);
    fields.vehicleModel?.addEventListener("change", () => {
        if (!fields.capacityKg.value) applyVehicleCapacityEstimate();
        updatePreview();
    });

    routesList?.addEventListener("click", (event) => {
        const button = event.target.closest("[data-remove-route]");
        if (!button) return;
        usualRoutes.splice(Number(button.dataset.removeRoute), 1);
        renderRoutes();
        updatePreview();
    });

    Object.values(fields).forEach(field => field?.addEventListener("input", updatePreview));
    Object.values(fields).forEach(field => field?.addEventListener("change", updatePreview));

    form?.addEventListener("submit", async (event) => {
        event.preventDefault();
        if (!currentUser) return;

        const profile = getProfilePayload();
        try {
            await setDoc(doc(db, "users", currentUser.uid), {
                driverPreferences: profile,
                vehicleModel: profile.vehicleModel,
                vehicleType: profile.vehicleType,
                capacityKg: profile.capacityKg,
                baseLocation: profile.baseLocation,
                operatingArea: profile.baseLocation,
                routeFrom: profile.usualRoutes[0]?.from || "",
                routeTo: profile.usualRoutes[0]?.to || "",
                availableNow: profile.availableNow,
                updatedAt: serverTimestamp()
            }, { merge: true });

            showStatus("Route profile saved. Future AI matching can now use these driver signals.");
            renderSuggestedLoads(profile);
        } catch (err) {
            console.error("Route profile save failed:", err);
            showStatus("Could not save route profile. Please try again.", "error");
        }
    });

    const messageBadgeEl = document.getElementById("message-notification-badge");

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

    function listenForMessageNotifications(userId) {
        const chatsQuery = query(collection(db, "chats"), where("participants", "array-contains", userId));
        onSnapshot(chatsQuery, (snapshot) => updateMessageBadge(getMessageNotificationCount(snapshot, userId)), () => updateMessageBadge(0));
    }

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = LOGIN_PAGE_URL;
            return;
        }

        currentUser = user;
        nameEl.textContent = user.displayName || "FarmRoute Driver";
        if (user.photoURL) {
            avatarEl.src = user.photoURL;
            avatarEl.classList.remove("hidden");
        }
        listenForMessageNotifications(user.uid);

        try {
            const userSnap = await getDoc(doc(db, "users", user.uid));
            if (userSnap.exists()) {
                const userData = userSnap.data();
                nameEl.textContent = userData.name || userData.fullName || user.displayName || "FarmRoute Driver";
                if (userData.profilePictureUrl || userData.photoURL) {
                    avatarEl.src = userData.profilePictureUrl || userData.photoURL;
                    avatarEl.classList.remove("hidden");
                }
                fillForm(userData.driverPreferences || userData);
                renderSuggestedLoads(userData.driverPreferences || getProfilePayload());
            } else {
                fillForm();
            }
        } catch (err) {
            console.error("Driver profile load failed:", err);
            fillForm();
        } finally {
            hideLoading();
        }
    });

    document.getElementById("logout-btn")?.addEventListener("click", () => {
        signOut(auth).then(() => window.location.href = LOGIN_PAGE_URL);
    });

    document.getElementById("side-btn")?.addEventListener("click", () => {
        document.getElementById("side-bar")?.classList.remove("max-md:hidden");
    });

    document.getElementById("closeside-btn")?.addEventListener("click", () => {
        document.getElementById("side-bar")?.classList.add("max-md:hidden");
    });

    const goOnlineBtn = document.getElementById("go-online-btn");
    const onlineLabel = document.getElementById("online-label");
    let isOnline = false;
    goOnlineBtn?.addEventListener("click", () => {
        isOnline = !isOnline;
        onlineLabel.textContent = isOnline ? "Online - Visible to Farmers" : "Go Online";
        goOnlineBtn.classList.toggle("bg-gray-700", isOnline);
        goOnlineBtn.classList.toggle("hover:bg-gray-600", isOnline);
        goOnlineBtn.classList.toggle("bg-green-600", !isOnline);
        goOnlineBtn.classList.toggle("hover:bg-green-500", !isOnline);
    });
  return {};
}
