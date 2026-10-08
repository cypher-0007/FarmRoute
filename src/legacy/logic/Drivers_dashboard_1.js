import { auth, db } from "../../../backend/firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
        doc,
        getDoc,
        collection,
        query,
        where,
        onSnapshot
    } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export function initialize() {
const LOGIN_PAGE_URL = "../login.html";

    const nameEl = document.getElementById("user-display-name");
    const roleEl = document.getElementById("user-display-role");
    const avatarEl = document.getElementById("user-avatar");
    const loadingScreen = document.getElementById("loading-screen");

    // Dashboard metric elements
    const activeTripsEl = document.getElementById("metric-active-trips");
    const availLoadsEl = document.getElementById("metric-avail-loads");
    const monthlyEarningsEl = document.getElementById("metric-monthly-earnings");
    const completedCountEl = document.getElementById("metric-completed-count");
    const earningsPeriodLabel = document.getElementById("earnings-period-label");
    const driverMonthFilter = document.getElementById("driver-month-filter");
    const escrowAmountEl = document.getElementById("metric-pending-escrow");
    const escrowCountEl = document.getElementById("metric-escrow-count");
    const recentTripsContainer = document.getElementById("recent-trips-container");
    const nearbyLoadsContainer = document.getElementById("nearby-loads-container");
    const priorityPickupsContainer = document.getElementById("priority-pickups-container");
    let driverTrips = [];

    function tripDeliveryMillis(trip) {
        const value = trip.deliveredAt || trip.completedAt || trip.updatedAt || trip.createdAt;
        if (!value) return null;
        if (typeof value.toDate === "function") return value.toDate().getTime();
        if (typeof value === "object" && value.seconds) return value.seconds * 1000;
        const parsed = new Date(value).getTime();
        return Number.isNaN(parsed) ? null : parsed;
    }

    function populateDriverMonthFilter() {
        if (!driverMonthFilter) return;
        const months = [...new Set(driverTrips
            .filter(isCompletedTrip)
            .map(tripDeliveryMillis)
            .filter((millis) => millis !== null)
            .map((millis) => new Date(millis).toISOString().slice(0, 7)))].sort().reverse();
        const previousSelection = driverMonthFilter.value;
        driverMonthFilter.innerHTML = `<option value="all">All time</option>${months.map((month) => `<option value="${month}">${new Date(`${month}-02T00:00:00`).toLocaleDateString([], { month: "long", year: "numeric" })}</option>`).join("")}`;
        if (previousSelection === "all" || months.includes(previousSelection)) driverMonthFilter.value = previousSelection;
        else driverMonthFilter.value = months[0] || "all";
    }

    const fallbackImages = {
        tomatoes: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200",
        pepper: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200",
        yam: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=200",
        maize: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200",
        corn: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200",
        default: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200"
    };

    const shelfLifeProfiles = [
        { label: "Tomatoes", keys: ["tomato", "tomatoes"], baseHours: 72, sensitivity: 1.3 },
        { label: "Fresh pepper", keys: ["pepper", "habanero", "chilli", "chili"], baseHours: 96, sensitivity: 1.15 },
        { label: "Leafy vegetables", keys: ["leaf", "lettuce", "spinach", "ugu", "vegetable", "greens", "cabbage"], baseHours: 36, sensitivity: 1.55 },
        { label: "Okra", keys: ["okra"], baseHours: 48, sensitivity: 1.35 },
        { label: "Banana or plantain", keys: ["banana", "plantain"], baseHours: 120, sensitivity: 1.05 },
        { label: "Mango", keys: ["mango"], baseHours: 120, sensitivity: 1.1 },
        { label: "Cucumber", keys: ["cucumber"], baseHours: 120, sensitivity: 1.1 },
        { label: "Maize or corn", keys: ["maize", "corn"], baseHours: 168, sensitivity: 0.85 },
        { label: "Root crops", keys: ["yam", "potato", "cassava"], baseHours: 336, sensitivity: 0.7 },
        { label: "General produce", keys: [], baseHours: 120, sensitivity: 1 }
    ];

    let driverAreaKeywords = [];
    let driverMatchPreferences = {};

    function hideLoading() {
        if (loadingScreen) loadingScreen.classList.add("hidden");
    }

    function escapeHTML(text) {
        const div = document.createElement("div");
        div.textContent = text ?? "";
        return div.innerHTML;
    }

    function escapeAttr(text) {
        return String(text ?? "")
            .replace(/&/g, "&amp;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");
    }

    function updateHeaderAvatar(profilePictureUrl) {
        if (!avatarEl || !profilePictureUrl) return;
        avatarEl.src = profilePictureUrl;
        avatarEl.classList.remove("hidden");
    }

    function getDriverAreaKeywords(userData = {}) {
        const preferences = userData.driverPreferences || {};
        const usualRouteTerms = Array.isArray(preferences.usualRoutes)
            ? preferences.usualRoutes.flatMap(route => [route.from, route.to])
            : [];

        const fields = [
            userData.location,
            userData.city,
            userData.state,
            userData.address,
            userData.baseLocation,
            preferences.baseLocation,
            userData.currentLocation,
            userData.routeFrom,
            userData.routeTo,
            userData.operatingArea,
            ...usualRouteTerms
        ];

        return fields
            .filter(Boolean)
            .flatMap(value => String(value).split(/[,\-]/))
            .map(value => value.trim().toLowerCase())
            .filter(value => value.length > 2);
    }

    function loadMatchesDriverArea(load) {
        const routeText = [
            load.routeFrom,
            load.location,
            load.pickupPoint,
            load.routeTo,
            load.destination,
            load.dropoffPoint
        ].filter(Boolean).join(" ").toLowerCase();

        const capacity = Number(driverMatchPreferences.capacityKg || 0);
        const minPayout = Number(driverMatchPreferences.minimumPayout || 0);
        const loadWeight = Number(load.quantity || load.weight || 0);
        const payout = Number(load.totalValue || load.price || 0);

        const capacityOk = !capacity || !loadWeight || loadWeight <= capacity;
        const payoutOk = !minPayout || payout >= minPayout;
        const routeOk = driverAreaKeywords.length === 0 || driverAreaKeywords.some(area => routeText.includes(area));

        return capacityOk && payoutOk && routeOk;
    }

    function normalizeStatus(status) {
        return String(status || "").trim().toLowerCase();
    }

    function isOpenLoad(load) {
        const status = normalizeStatus(load.status);
        return !status || ["searching", "available", "open"].includes(status);
    }

    function isActiveTrip(trip) {
        return ["matched", "in transit", "driver delivered"].includes(normalizeStatus(trip.status));
    }

    function isCompletedTrip(trip) {
        return normalizeStatus(trip.status) === "delivered";
    }

    function getProductImage(data) {
        const directImage = Array.isArray(data.images) && data.images.length > 0 ? data.images[0] : data.imageUrl;
        if (directImage) return directImage;
        const key = `${data.name || ""} ${data.category || ""}`.toLowerCase();
        const fallbackKey = Object.keys(fallbackImages).find(item => key.includes(item));
        return fallbackImages[fallbackKey] || fallbackImages.default;
    }

    function dateToMillis(value) {
        if (!value) return Date.now();
        if (typeof value.toDate === "function") return value.toDate().getTime();
        if (value.seconds) return value.seconds * 1000;
        const parsed = new Date(value).getTime();
        return Number.isNaN(parsed) ? Date.now() : parsed;
    }

    function getShelfProfile(data) {
        const key = `${data.name || ""} ${data.category || ""}`.toLowerCase();
        return shelfLifeProfiles.find(profile => profile.keys.some(item => key.includes(item))) || shelfLifeProfiles[shelfLifeProfiles.length - 1];
    }

    function analyzePriorityLoad(load) {
        const profile = getShelfProfile(load);
        const ageHours = Math.max(0, (Date.now() - dateToMillis(load.harvestDate || load.createdAt)) / 36e5);
        const hasImage = (Array.isArray(load.images) && load.images.length > 0) || Boolean(load.imageUrl);
        const imagePressure = hasImage ? 0 : 10;
        const routePressure = `${load.routeFrom || load.location || ""} ${load.routeTo || ""}`.length > 35 ? 6 : 0;
        const remainingHours = Math.max(0, Math.round(profile.baseHours - (ageHours * profile.sensitivity) - imagePressure - routePressure));
        const riskScore = Math.min(100, Math.max(0, Math.round(100 - ((remainingHours / profile.baseHours) * 100))));
        let severity = "WATCH";
        if (riskScore >= 78 || remainingHours <= 24) severity = "CRITICAL";
        else if (riskScore >= 55 || remainingHours <= 48) severity = "URGENT";

        return {
            ...load,
            profileLabel: profile.label,
            remainingHours,
            riskScore,
            severity,
            priorityReason: `${profile.label} freshness window is closing${hasImage ? "" : "; photo missing"}`
        };
    }

    function formatMoney(value) {
        return `₦${Number(value || 0).toLocaleString()}`;
    }

    function formatQuantity(data) {
        return `${data.quantity || data.weight || 0} ${data.unit || "kg"}`;
    }

    function formatShelfLife(hours) {
        if (hours <= 0) return "Expired risk";
        if (hours < 48) return `${hours}h left`;
        return `${Math.round(hours / 24)} days left`;
    }

    function availableLoadUrl(loadId) {
        return `available_loads.html?loadId=${encodeURIComponent(loadId)}`;
    }

    function getStatusClass(status) {
        if (status === "Delivered") return "bg-green-100 text-green-700";
        if (status === "In Transit") return "bg-blue-100 text-blue-700";
        if (status === "Driver Delivered") return "bg-amber-100 text-amber-700";
        return "bg-purple-100 text-purple-700";
    }

    function renderRecentTrips(trips) {
        if (!recentTripsContainer) return;
        const selectedMonth = driverMonthFilter?.value || "all";
        const recentTrips = trips
            .filter(isCompletedTrip)
            .filter((trip) => {
                if (selectedMonth === "all") return true;
                const millis = tripDeliveryMillis(trip);
                return millis !== null && new Date(millis).toISOString().slice(0, 7) === selectedMonth;
            })
            .sort((a, b) => tripDeliveryMillis(b) - tripDeliveryMillis(a));
        const earnings = recentTrips.reduce((total, trip) => total + Number(trip.totalValue || trip.price || 0), 0);
        if (monthlyEarningsEl) monthlyEarningsEl.innerText = formatMoney(earnings);
        if (completedCountEl) completedCountEl.innerText = `Across ${recentTrips.length} completed trips`;
        if (earningsPeriodLabel) {
            earningsPeriodLabel.textContent = selectedMonth === "all"
                ? "Earnings All Time"
                : `Earnings · ${new Date(`${selectedMonth}-02T00:00:00`).toLocaleDateString([], { month: "long", year: "numeric" })}`;
        }

        if (recentTrips.length === 0) {
            recentTripsContainer.innerHTML = `<p class="text-gray-500 py-8 text-center text-sm">No completed deliveries for this period.</p>`;
            return;
        }

        recentTripsContainer.innerHTML = recentTrips.map(trip => {
            const imageSrc = getProductImage(trip);
            const routeFrom = trip.routeFrom || trip.location || "Pickup";
            const routeTo = trip.routeTo || trip.destination || "Delivery";
            const status = trip.status || "Matched";
            return `
                <div class="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center py-5">
                    <div class="flex items-center gap-4 min-w-0">
                        <img src="${escapeAttr(imageSrc)}" alt="${escapeAttr(trip.name || "Produce")}" class="w-16 h-16 rounded-xl object-cover border shrink-0">
                        <div class="min-w-0">
                            <h3 class="font-semibold text-lg truncate">${escapeHTML(trip.name || "Produce Load")}</h3>
                            <p class="text-gray-500 text-sm">${escapeHTML(formatQuantity(trip))}</p>
                        </div>
                    </div>
                    <div class="min-w-0">
                        <h4 class="font-medium truncate">${escapeHTML(routeFrom)} → ${escapeHTML(routeTo)}</h4>
                        <p class="text-gray-500 text-sm truncate">${escapeHTML(trip.dropoffPoint || trip.pickupPoint || "Route assigned")}</p>
                        <p class="text-gray-400 text-xs">Delivered ${tripDeliveryMillis(trip) === null ? "date unavailable" : new Date(tripDeliveryMillis(trip)).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</p>
                    </div>
                    <div>
                        <h4 class="font-semibold text-xl">${formatMoney(trip.totalValue || trip.price)}</h4>
                        <p class="text-gray-500 text-sm">total payout</p>
                    </div>
                    <div class="lg:text-right">
                        <span class="${getStatusClass(status)} px-4 py-2 rounded-lg text-sm font-semibold inline-block">${escapeHTML(status === "Driver Delivered" ? "Awaiting Payment" : status)}</span>
                    </div>
                </div>
            `;
        }).join("");
    }

    driverMonthFilter?.addEventListener("change", () => renderRecentTrips(driverTrips));

    function renderNearbyLoads(loads) {
        if (!nearbyLoadsContainer) return;
        const nearbyLoads = loads
            .filter(loadMatchesDriverArea)
            .sort((a, b) => dateToMillis(b.createdAt) - dateToMillis(a.createdAt))
            .slice(0, 4);

        if (nearbyLoads.length === 0) {
            nearbyLoadsContainer.innerHTML = `<p class="text-gray-500 py-6 text-center text-sm">No recently listed loads found in your area.</p>`;
            return;
        }

        nearbyLoadsContainer.innerHTML = nearbyLoads.map(load => {
            const routeFrom = load.routeFrom || load.location || "Pickup";
            const routeTo = load.routeTo || load.destination || "Delivery";
            return `
                <div class="py-4 flex items-start justify-between gap-3">
                    <div class="min-w-0">
                        <h3 class="font-semibold text-base text-gray-900 truncate">${escapeHTML(load.name || "Produce Load")}</h3>
                        <p class="text-gray-500 text-sm mt-1 truncate">${escapeHTML(routeFrom)} → ${escapeHTML(routeTo)}</p>
                        <p class="text-xs text-gray-400 mt-1">${escapeHTML(formatQuantity(load))} listed recently</p>
                    </div>
                    <a href="${availableLoadUrl(load.id)}" class="shrink-0 text-xs font-semibold bg-green-700 hover:bg-green-800 text-white px-3 py-2 rounded-lg transition">Accept</a>
                </div>
            `;
        }).join("");
    }

    function renderPriorityPickups(loads) {
        if (!priorityPickupsContainer) return;
        const priorityLoads = loads
            .filter(loadMatchesDriverArea)
            .map(analyzePriorityLoad)
            .filter(load => load.severity === "CRITICAL" || load.severity === "URGENT")
            .sort((a, b) => b.riskScore - a.riskScore)
            .slice(0, 5);

        if (priorityLoads.length === 0) {
            priorityPickupsContainer.innerHTML = `<p class="text-gray-500 py-6 text-center text-sm">No urgent perishable pickups in your area right now.</p>`;
            return;
        }

        const severityClass = {
            CRITICAL: "bg-red-50 text-red-700 border-red-200",
            URGENT: "bg-amber-50 text-amber-700 border-amber-200"
        };

        priorityPickupsContainer.innerHTML = priorityLoads.map(load => {
            const imageSrc = getProductImage(load);
            const routeFrom = load.routeFrom || load.location || "Pickup";
            const routeTo = load.routeTo || load.destination || "Delivery";
            return `
                <div class="border ${load.severity === "CRITICAL" ? "border-red-100 bg-red-50/30" : "border-amber-100 bg-amber-50/30"} rounded-xl p-3">
                    <div class="flex gap-3">
                        <img src="${escapeAttr(imageSrc)}" alt="${escapeAttr(load.name || "Produce")}" class="w-14 h-14 rounded-xl object-cover border shrink-0">
                        <div class="min-w-0 flex-1">
                            <div class="flex items-center justify-between gap-2">
                                <h3 class="font-semibold text-gray-900 truncate">${escapeHTML(load.name || "Priority Load")}</h3>
                                <span class="${severityClass[load.severity]} border text-[10px] font-bold px-2 py-1 rounded-full">${load.severity}</span>
                            </div>
                            <p class="text-xs text-gray-500 mt-1 truncate">${escapeHTML(routeFrom)} → ${escapeHTML(routeTo)}</p>
                            <p class="text-xs text-gray-600 mt-1">${escapeHTML(formatShelfLife(load.remainingHours))} · ${escapeHTML(load.priorityReason)}</p>
                        </div>
                    </div>
                    <a href="${availableLoadUrl(load.id)}" class="mt-3 inline-flex w-full justify-center bg-green-700 hover:bg-green-800 text-white text-sm font-semibold py-2 rounded-lg transition">Choose pickup</a>
                </div>
            `;
        }).join("");
    }

    const messageBadgeEl = document.getElementById("message-notification-badge");
    const headerMessageBadgeEl = document.getElementById("header-message-notification-badge");

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

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = LOGIN_PAGE_URL;
            return;
        }

        nameEl.innerText = user.displayName || "FarmRoute Driver";
        roleEl.innerText = "Driver";
        updateHeaderAvatar(user.photoURL);
        hideLoading();
        listenForMessageNotifications(user.uid);

        try {

            // ================= USER PROFILE =================
            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (userDoc.exists()) {
                const userData = userDoc.data();

                if (userData.name)
                    nameEl.innerText = userData.name;

                if (userData.role)
                    roleEl.innerText = userData.role;

                updateHeaderAvatar(userData.profilePictureUrl);
                driverMatchPreferences = userData.driverPreferences || {};
                driverAreaKeywords = getDriverAreaKeywords(userData);
            }

            // ================= RECENT TRIPS =================
            const allDriverTripsQuery = query(
                collection(db, "products"),
                where("driverId", "==", user.uid)
            );

            onSnapshot(allDriverTripsQuery, (snapshot) => {
                driverTrips = [];
                let activeTrips = 0;

                snapshot.forEach((tripDoc) => {
                    const trip = { id: tripDoc.id, ...tripDoc.data() };
                    driverTrips.push(trip);
                    if (isActiveTrip(trip)) activeTrips++;
                });

                activeTripsEl.innerText = activeTrips;
                populateDriverMonthFilter();
                renderRecentTrips(driverTrips);
            }, (err) => {
                console.error("Driver trips listener failed:", err);
                driverTrips = [];
                populateDriverMonthFilter();
                renderRecentTrips([]);
            });

            /*
            // ================= ACTIVE TRIPS =================
            const activeTripsQuery = query(
                collection(db, "products"),
                where("driverId", "==", user.uid),
                where("status", "in", [
                    "Matched",
                    "In Transit",
                    "Driver Delivered"
                ])
            );

            onSnapshot(activeTripsQuery, (snapshot) => {
                activeTripsEl.innerText = snapshot.size;
            });

            // ================= COMPLETED TRIPS + EARNINGS =================
            const completedTripsQuery = query(
                collection(db, "products"),
                where("driverId", "==", user.uid),
                where("status", "==", "Delivered")
            );

            onSnapshot(completedTripsQuery, (snapshot) => {

                let completedTrips = 0;
                let earnings = 0;

                snapshot.forEach((tripDoc) => {
                    completedTrips++;
                    earnings += Number(tripDoc.data().price || 0);
                });

                monthlyEarningsEl.innerText =
                    `₦${earnings.toLocaleString()}`;

                completedCountEl.innerText =
                    `Across ${completedTrips} completed trips`;

            });
            */

            // ================= AVAILABLE LOADS =================
            // Keep the query narrow so Firestore rules can authorize marketplace reads.
            const availableLoadsQuery = query(
                collection(db, "products"),
                where("status", "==", "Searching")
            );

            onSnapshot(availableLoadsQuery, (snapshot) => {
                const loads = [];
                snapshot.forEach((loadDoc) => {
                    const load = { id: loadDoc.id, ...loadDoc.data() };
                    if (isOpenLoad(load)) loads.push(load);
                });
                const nearbyLoads = loads.filter(loadMatchesDriverArea);
                availLoadsEl.innerText = nearbyLoads.length;
                renderNearbyLoads(loads);
                renderPriorityPickups(loads);
            }, (err) => {
                console.error("Available loads listener failed:", err);
                availLoadsEl.innerText = "--";
                renderNearbyLoads([]);
                renderPriorityPickups([]);
            });

            // ================= ESCROW PAYMENTS =================
            const escrowPaymentsQuery = query(
                collection(db, "payments"),
                where("driverId", "==", user.uid),
                where("status", "==", "escrow")
            );

            onSnapshot(escrowPaymentsQuery, (snapshot) => {

                let escrowAmount = 0;

                snapshot.forEach((paymentDoc) => {
                    escrowAmount += Number(paymentDoc.data().amount || 0);
                });

                escrowAmountEl.innerText =
                    `₦${escrowAmount.toLocaleString()}`;

                escrowCountEl.innerText =
                    `${snapshot.size} ${snapshot.size === 1 ? "payout" : "payouts"} waiting for farmer confirmation`;

            });

        } catch (err) {
            console.error("Dashboard realtime metrics error:", err);

            activeTripsEl.innerText = "--";
            availLoadsEl.innerText = "--";
            monthlyEarningsEl.innerText = "₦0";
            completedCountEl.innerText = "Across 0 completed trips";
            escrowAmountEl.innerText = "₦0";
            escrowCountEl.innerText = "0 payouts waiting for farmer confirmation";
        }
    });

    // ================= LOGOUT =================
    const logoutBtn = document.getElementById("logout-btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            signOut(auth)
                .then(() => {
                    window.location.href = LOGIN_PAGE_URL;
                })
                .catch((error) => {
                    console.error("Signout error:", error);
                });
        });
    }
  return {};
}
