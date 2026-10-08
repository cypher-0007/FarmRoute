import { auth, db } from "../../../backend/firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, collection, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export function initialize() {
const LOGIN_PAGE_URL = "../login.html";

        const nameEl = document.getElementById("user-display-name");
        const roleEl = document.getElementById("user-display-role");
        const avatarEl = document.getElementById("user-avatar");
        const messageBadgeEl = document.getElementById("message-notification-badge");
        const listingsWrapper = document.getElementById("listings-wrapper");
        const searchInput = document.getElementById("search-input");
        const statusFilter = document.getElementById("status-filter");

        let cachedProducts = [];

        const fallbackImages = {
            tomatoes: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200",
            pepper: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200",
            yam: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=200",
            maize: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200",
            default: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200"
        };

        const statusStyles = {
            "In Transit": "bg-blue-50 text-blue-700 border-blue-200",
            "Matched": "bg-green-50 text-green-700 border-green-200",
            "Pending": "bg-amber-50 text-amber-700 border-amber-200",
            "Searching": "bg-purple-50 text-purple-700 border-purple-200"
        };

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

        function listenForMessageNotifications(userId) {
            const chatsQuery = query(collection(db, "chats"), where("participants", "array-contains", userId));
            onSnapshot(chatsQuery, (snapshot) => {
                updateMessageBadge(getMessageNotificationCount(snapshot, userId));
            }, (err) => {
                console.error("Message notification sync failed:", err);
                updateMessageBadge(0);
            });
        }

        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = LOGIN_PAGE_URL;
                return;
            }

            nameEl.innerText = user.displayName || "FarmRoute User";
            roleEl.innerText = "Farmer";
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
                console.error("Firestore user profile payload retrieval failed:", err);
            }

            const q = query(collection(db, "products"), where("farmerId", "==", user.uid));
            onSnapshot(q, (snapshot) => {
                cachedProducts = [];
                snapshot.forEach((doc) => {
                    cachedProducts.push({ id: doc.id, ...doc.data() });
                });
                renderListings();
            }, (error) => {
                console.error("Listing snapshot sync loop crash: ", error);
                listingsWrapper.innerHTML = `<div class="text-center py-6 text-red-500 text-sm">Failed to sync database logs.</div>`;
            });
        });

        function renderListings() {
            const searchQuery = searchInput.value.toLowerCase().trim();
            const filterValue = statusFilter.value;

            const filtered = cachedProducts.filter(p => {
                const matchesSearch = (p.name || "").toLowerCase().includes(searchQuery);
                const matchesStatus = filterValue === "All" || p.status === filterValue;
                return matchesSearch && matchesStatus;
            });

            if (filtered.length === 0) {
                listingsWrapper.innerHTML = `
                    <div class="text-center py-16 text-gray-500">
                        <i class="fa-solid fa-box-open text-5xl mb-4 block text-gray-300"></i>
                        <p class="font-medium text-base">No matching produce listings found.</p>
                        <p class="text-xs text-gray-400 mt-1">Try modifying your search or filters.</p>
                    </div>`;
                return;
            }

            listingsWrapper.innerHTML = filtered.map(product => {
                const name = product.name || "Unknown Produce";
                const imgKey = name.toLowerCase().trim();

                const imageSrc = (product.images && product.images.length > 0) 
                    ? product.images[0]
                    : (product.imageUrl || fallbackImages[imgKey] || fallbackImages.default);
                const statusClass = statusStyles[product.status] || "bg-gray-100 text-gray-700 border-gray-200";

                const routeFromClean = product.routeFrom || product.location || 'N/A';
                const routeToClean = product.routeTo || 'Lagos';
                const pickup = product.pickupPoint || 'Not Specified';
                const dropoff = product.dropoffPoint || 'Not Specified';

                return `
                    <div class="listing-card group flex flex-col py-5 px-3 hover:bg-gray-50/60 rounded-xl transition-all duration-200 cursor-pointer" data-id="${product.id}">
                        <!-- Visible Core Row -->
                        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 w-full">
                            
                            <!-- Left: Basic Details Segment -->
                            <div class="flex items-center gap-4 min-w-0">
                                <img src="${imageSrc}" class="w-14 h-14 rounded-xl object-cover shrink-0 border border-gray-200 shadow-xs" alt="${name}">
                                <div class="min-w-0">
                                    <div class="flex items-center gap-2">
                                        <h3 class="font-semibold text-base text-gray-900 truncate group-hover:text-emerald-800 transition-colors">${name}</h3>
                                        <i class="fa-solid fa-chevron-down text-[10px] text-gray-400 group-hover:text-emerald-600 transition-transform duration-200 chevron-icon"></i>
                                    </div>
                                    <p class="text-gray-500 text-xs mt-1 flex items-center gap-2">
                                        <span class="font-semibold text-gray-800">${product.quantity || 0} ${product.unit || 'Bags'}</span>
                                        <span class="text-gray-300">|</span>
                                        <span class="text-gray-500 font-normal">${product.category || 'Vegetables'}</span>
                                    </p>
                                </div>
                            </div>

                            <!-- Right: Overview Metrics Info Segment -->
                            <div class="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:items-center gap-8 text-sm ml-0 lg:ml-auto w-full lg:w-auto">
                                <!-- Main Route Path -->
                                <div class="min-w-[160px]">
                                    <span class="block text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1">Route Overview</span>
                                    <div class="flex items-center gap-2 text-gray-700 font-medium text-xs sm:text-sm">
                                        <span class="truncate max-w-[80px]">${routeFromClean}</span>
                                        <i class="fa-solid fa-arrow-right text-[10px] text-gray-400"></i>
                                        <span class="truncate max-w-[80px]">${routeToClean}</span>
                                    </div>
                                </div>
                                <!-- Pricing Summary -->
                                <div class="min-w-[120px]">
                                    <span class="block text-[10px] font-bold uppercase text-gray-400 tracking-wider mb-1">Market Price</span>
                                    <h4 class="font-bold text-base text-emerald-700">
                                        ₦${Number(product.price || 0).toLocaleString()} 
                                        <span class="text-[10px] font-normal text-gray-400">/${(product.unit || 'bag').replace(/s$/, '').toLowerCase()}</span>
                                    </h4>
                                </div>
                                <!-- Status Badge Alignment -->
                                <div class="col-span-2 sm:col-span-1 flex items-center lg:block">
                                    <span class="${statusClass} border px-2.5 py-1 rounded-lg text-[10px] font-semibold inline-flex items-center gap-1.5 uppercase tracking-wide">
                                        <span class="w-1 h-1 rounded-full bg-current"></span>
                                        ${product.status || 'Searching'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Expandable Detailed View Drawer Dropdown -->
                        <div class="details-drawer hidden overflow-hidden mt-4 pt-4 border-t border-gray-100 transition-all duration-300">
                            <div class="bg-gray-50/50 p-4 rounded-xl grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
                                <!-- Pickup Node Point Card -->
                                <div class="flex items-start gap-3 bg-white p-3 rounded-xl border border-gray-200/60 shadow-2xs">
                                    <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                        <i class="fa-solid fa-location-dot text-emerald-600"></i>
                                    </div>
                                    <div class="min-w-0">
                                        <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Pickup Location</span>
                                        <p class="font-medium text-gray-800 break-words">${pickup}</p>
                                    </div>
                                </div>

                                <!-- Drop-off Node Point Card -->
                                <div class="flex items-start gap-3 bg-white p-3 rounded-xl border border-gray-200/60 shadow-2xs">
                                    <div class="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                        <i class="fa-solid fa-route text-blue-600"></i>
                                    </div>
                                    <div class="min-w-0">
                                        <span class="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">Drop-off Destination</span>
                                        <p class="font-medium text-gray-800 break-words">${dropoff}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join("");

            // Assign Accordion Click Event Listeners
            document.querySelectorAll(".listing-card").forEach(card => {
                card.addEventListener("click", (e) => {
                    if (e.target.closest('.details-drawer')) return;

                    const drawer = card.querySelector(".details-drawer");
                    const chevron = card.querySelector(".chevron-icon");
                    
                    if (drawer.classList.contains("hidden")) {
                        drawer.classList.remove("hidden");
                        chevron.classList.add("rotate-180");
                    } else {
                        drawer.classList.add("hidden");
                        chevron.classList.remove("rotate-180");
                    }
                });
            });
        }

        // Search & filter event bindings
        searchInput.addEventListener("input", renderListings);
        statusFilter.addEventListener("change", renderListings);

        // Sidebar responsive viewport handler toggles
        const sideBtn = document.getElementById("side-btn");
        const closeSideBtn = document.getElementById("closeside-btn");
        const sideBar = document.getElementById("side-bar");

        if (sideBtn && sideBar) {
            sideBtn.addEventListener("click", () => sideBar.classList.remove("max-md:hidden"));
        }
        if (closeSideBtn && sideBar) {
            closeSideBtn.addEventListener("click", () => sideBar.classList.add("max-md:hidden"));
        }

        // Account signout action routine
        document.getElementById("logout-btn")?.addEventListener("click", () => {
            signOut(auth)
                .then(() => { window.location.href = LOGIN_PAGE_URL; })
                .catch((err) => console.error("Signout logic caught an exception:", err));
        });
  return {};
}
