import { auth, db } from "../../../backend/firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, collection, query, where, onSnapshot, updateDoc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { createNotification } from "../../../backend/notificationService.js";

export function initialize() {
const LOGIN_PAGE_URL = "../login.html";

        function showNoticeModal(message, title = "FarmRoute Notice", type = "error") {
            const modal = document.createElement("div");
            modal.className = "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm";
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

        const nameEl = document.getElementById("user-display-name");
        const roleEl = document.getElementById("user-display-role");
        const avatarEl = document.getElementById("user-avatar");
        const loadsWrapper = document.getElementById("loads-wrapper");
        const searchInput = document.getElementById("search-input");
        const sortFilter = document.getElementById("sort-filter");

        let cachedLoads = [];
        let currentDriverName = "Logistics Driver";
        const selectedLoadId = new URLSearchParams(window.location.search).get("loadId");

        function normalizeStatus(status) {
            return String(status || "").trim().toLowerCase();
        }

        function isOpenLoad(load) {
            const status = normalizeStatus(load.status);
            return !status || ["searching", "available", "open"].includes(status);
        }

        function getProfileAvatar(profile) {
            return profile?.profilePictureUrl || profile?.profilePictureURL || profile?.photoURL || profile?.avatarUrl || profile?.avatar || "";
        }

        function updateHeaderAvatar(src) {
            if (!avatarEl || !src) return;
            avatarEl.src = src;
        }

        const fallbackImages = {
            tomatoes: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200",
            pepper: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200",
            yam: "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=200",
            maize: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200",
            default: "https://images.unsplash.com/photo-1595855759920-86582396756a?w=200"
        };

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

            currentDriverName = user.displayName || "Logistics Driver";
            nameEl.innerText = currentDriverName;
            roleEl.innerText = "Driver";
            updateHeaderAvatar(user.photoURL);
            listenForMessageNotifications(user.uid);

            try {
                const userDocSnap = await getDoc(doc(db, "users", user.uid));
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    if (userData.name) {
                        currentDriverName = userData.name;
                        nameEl.innerText = userData.name;
                    }
                    if (userData.role) roleEl.innerText = userData.role;
                    updateHeaderAvatar(getProfileAvatar(userData) || user.photoURL);
                }
            } catch (err) {
                console.error("Firestore driver profile profile payload failure:", err);
            }

            // Keep the query narrow so Firestore rules can authorize marketplace reads.
            const q = query(collection(db, "products"), where("status", "==", "Searching"));
            onSnapshot(q, (snapshot) => {
                cachedLoads = [];
                snapshot.forEach((doc) => {
                    const load = { id: doc.id, ...doc.data() };
                    if (isOpenLoad(load)) cachedLoads.push(load);
                });
                renderLoads();
            }, (error) => {
                console.error("Load snapshot syncing failure: ", error);
                loadsWrapper.innerHTML = `<div class="text-center py-6 text-red-500 text-sm">We could not load available loads. Please refresh and try again.</div>`;
            });
        });

        function renderLoads() {
            const searchQuery = searchInput.value.toLowerCase().trim();
            const sortValue = sortFilter.value;

            let filtered = cachedLoads.filter(l => {
                const matchesCrop = (l.name || "").toLowerCase().includes(searchQuery);
                const matchesOrigin = (l.routeFrom || l.location || "").toLowerCase().includes(searchQuery);
                const matchesDest = (l.routeTo || "").toLowerCase().includes(searchQuery);
                return matchesCrop || matchesOrigin || matchesDest;
            });

            if (sortValue === "highest") {
                filtered.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
            } else if (sortValue === "lowest") {
                filtered.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
            }

            if (selectedLoadId) {
                filtered.sort((a, b) => (b.id === selectedLoadId) - (a.id === selectedLoadId));
            }

            if (filtered.length === 0) {
                loadsWrapper.innerHTML = `
                    <div class="text-center py-16 text-gray-500">
                        <i class="fa-solid fa-box-open text-5xl mb-4 block text-gray-300"></i>
                        <p class="font-medium text-base">No active available loads found right now.</p>
                        <p class="text-xs text-gray-400 mt-1">Check back soon for freshly listed routes.</p>
                    </div>`;
                return;
            }

            loadsWrapper.innerHTML = filtered.map(load => {
                const name = load.name || "Unknown Produce";
                const imgKey = name.toLowerCase().trim();

                const imageSrc = (load.images && load.images.length > 0) 
                    ? load.images[0]
                    : (load.imageUrl || fallbackImages[imgKey] || fallbackImages.default);

                const totalPayout = Number(load.price || 0);
                const selectedClass = load.id === selectedLoadId
                    ? "bg-emerald-50/60 border border-emerald-200 rounded-2xl px-4"
                    : "";

                return `
                    <div class="flex flex-col lg:flex-row lg:items-center justify-between py-5 gap-6 ${selectedClass}">
                        <div class="flex items-center gap-4 min-w-[240px]">
                            <img src="${imageSrc}" class="w-16 h-16 rounded-xl object-cover shrink-0 border" alt="${name}">
                            <div class="min-w-0">
                                <h3 class="font-semibold text-lg text-gray-900 truncate">${name}</h3>
                                <div class="flex items-center gap-2 text-sm text-gray-500 font-medium mt-0.5">
                                    <span class="bg-gray-100 px-2 py-0.5 rounded-md text-gray-700 text-xs">${load.quantity || 0} ${load.unit || 'Bags'}</span>
                                    <span class="text-gray-300">•</span>
                                    <span class="text-xs text-gray-400 font-normal">${load.category || 'Produce'}</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center gap-8 flex-1 min-w-0">
                            <div class="flex flex-col space-y-1">
                                <span class="block text-xs font-bold uppercase text-gray-400 tracking-wider">Route Plan</span>
                                <div class="flex items-center gap-2">
                                    <span class="font-bold text-gray-800 text-sm">${load.routeFrom || 'N/A'}</span>
                                    <i class="fa-solid fa-arrow-right text-xs text-gray-400"></i>
                                    <span class="font-bold text-gray-800 text-sm">${load.routeTo || 'Lagos'}</span>
                                </div>
                                <div class="text-xs text-gray-500 space-y-0.5">
                                    <div class="flex items-center gap-1.5">
                                        <i class="fa-solid fa-circle-dot text-emerald-600 text-[10px]"></i>
                                        <span class="truncate max-w-[240px] text-gray-600">
                                            <span class="font-medium text-gray-400">Pick up:</span> ${load.pickupPoint || 'Hub Depot'}
                                        </span>
                                    </div>
                                    <div class="flex items-center gap-1.5">
                                        <i class="fa-solid fa-location-dot text-red-600 text-xs"></i>
                                        <span class="truncate max-w-[240px] text-gray-600">
                                            <span class="font-medium text-gray-400">Drop off:</span> ${load.dropoffPoint || 'Main Market Bay'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="flex items-center justify-between lg:justify-end gap-6 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100">
                            <div class="text-left lg:text-right">
                                <span class="block text-xs font-bold uppercase text-gray-400 tracking-wider mb-0.5">Estimated Payout</span>
                                <h4 class="font-bold text-xl text-emerald-700 tracking-tight">
                                    ₦${totalPayout.toLocaleString()}
                                </h4>
                                <span class="text-[10px] text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md font-medium mt-1 inline-flex items-center gap-1 uppercase tracking-wider">
                                    <i class="fa-regular fa-clock text-xs"></i> Open Offer
                                </span>
                            </div>

                            <div>
                                <button data-id="${load.id}" class="accept-load-btn bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition duration-200 shadow-sm whitespace-nowrap cursor-pointer">
                                    Accept Load
                                </button>
                            </div>
                        </div>
                    </div>
                `;
            }).join("");

            document.querySelectorAll(".accept-load-btn").forEach(button => {
                button.addEventListener("click", (e) => {
                    const loadId = e.target.getAttribute("data-id");
                    handleAcceptLoad(loadId);
                });
            });
        }

        // =======================================================
        // AUTOMATION TASK: RETURN ROOM ID SO WE CAN DEEP LINK IT
        // =======================================================
        async function autoCreateChatRoom(listingId, farmerData, driverData) {
            const roomId = `match_${listingId}`;
            const chatRoomRef = doc(db, "chats", roomId);

            const chatRoomPayload = {
                participants: [farmerData.uid, driverData.uid],
                farmerId: farmerData.uid,
                farmerName: farmerData.name,
                driverId: driverData.uid,
                driverName: driverData.name,
                listingId: listingId,
                lastMessage: "System: Your delivery route is matched! Chat here to coordinate pickup timelines.",
                lastMessageTime: serverTimestamp()
            };

            await setDoc(chatRoomRef, chatRoomPayload, { merge: true });
            return roomId; // Returns room reference key context safely
        }

        async function getUserDisplayName(userId, fallbackName) {
            if (!userId) return fallbackName || "FarmRoute User";

            try {
                const userDocSnap = await getDoc(doc(db, "users", userId));
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    return userData.name || userData.fullName || userData.displayName || fallbackName || "FarmRoute User";
                }
            } catch (error) {
                console.error("Unable to resolve user display name:", error);
            }

            return fallbackName || "FarmRoute User";
        }

        async function handleAcceptLoad(loadId) {
            const currentUser = auth.currentUser;
            let listingClaimed = false;
            let activeChatRoomId = "";
            
            if (!currentUser) {
                showNoticeModal("You must be logged in to accept this load.");
                return;
            }

            const targetButton = document.querySelector(`button[data-id="${loadId}"]`);
            if (targetButton) {
                targetButton.disabled = true;
                targetButton.classList.add("opacity-50", "cursor-not-allowed");
                targetButton.innerText = "Processing...";
            }

            try {
                const loadDocRef = doc(db, "products", loadId);
                const loadDocSnap = await getDoc(loadDocRef);

                if (!loadDocSnap.exists()) {
                    throw new Error("Listing record not found on database query.");
                }

                const loadData = loadDocSnap.data();

                const farmerId = loadData.userId || loadData.farmerId;
                const farmerName = await getUserDisplayName(
                    farmerId,
                    loadData.ownerName || loadData.farmerName || loadData.farmerFullName || loadData.userName || "Farmer"
                );

                if (!farmerId) {
                    throw new Error("Cannot trace listing back to an original owner ID profile record.");
                }

                const payoutAmount = Number(loadData.totalValue || loadData.price || 0);
                const routeFrom = loadData.routeFrom || loadData.location || loadData.pickupPoint || "Pickup";
                const routeTo = loadData.routeTo || loadData.destination || loadData.dropoffPoint || "Delivery";

                // 1. Update listing document properties across Firestore channels
                await updateDoc(loadDocRef, {
                    status: "Matched",
                    driverId: currentUser.uid,
                    driverName: currentDriverName,
                    matchedAt: serverTimestamp(),
                    updatedAt: serverTimestamp(),
                    paymentStatus: "escrow"
                });
                listingClaimed = true;

                const listingCode = `FR-${loadId.slice(0, 8).toUpperCase()}`;
                await Promise.all([
                    createNotification(db, farmerId, {
                        recipientRole: "farmer",
                        type: "shipment",
                        title: `Listing ${listingCode} matched with a driver`,
                        body: `${currentDriverName} accepted ${loadData.name || "your listing"}. It is awaiting pickup and delivery.`,
                        href: "listings.html",
                        relatedId: listingCode
                    }),
                    createNotification(db, currentUser.uid, {
                        recipientRole: "driver",
                        type: "listing",
                        title: `You accepted listing ${listingCode}`,
                        body: `${loadData.name || "Produce load"} is now in your active trips and awaiting pickup.`,
                        href: "active_trips.html",
                        relatedId: listingCode
                    })
                ]);

                // Create the conversation as soon as the listing is matched. The payment
                // ledger is supplementary and must not prevent farmer-driver messaging.
                activeChatRoomId = await autoCreateChatRoom(
                    loadId,
                    { uid: farmerId, name: farmerName },
                    { uid: currentUser.uid, name: currentDriverName }
                );

                await setDoc(doc(db, "payments", loadId), {
                    loadId,
                    productId: loadId,
                    driverId: currentUser.uid,
                    driverName: currentDriverName,
                    farmerId,
                    farmerName,
                    productName: loadData.name || loadData.productName || "Produce Load",
                    routeFrom,
                    routeTo,
                    pickupPoint: loadData.pickupPoint || routeFrom,
                    dropoffPoint: loadData.dropoffPoint || routeTo,
                    amount: payoutAmount,
                    status: "escrow",
                    paymentStatus: "escrow",
                    reference: loadData.escrowPaymentRef || `FR-${loadId.slice(0, 8).toUpperCase()}`,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }, { merge: true });

                showNoticeModal("Load accepted successfully! Opening message session with your farmer.", "Load Accepted", "success");

                // Append URL Query parameter to cleanly open this chat inside messages view
                setTimeout(() => {
                    window.location.href = `messages.html?chatId=${activeChatRoomId}`;
                }, 700);

            } catch (error) {
                console.error("Failed to accept load configuration assignment:", error);

                // The product update above is the actual claim. Payment and chat setup are
                // follow-up records, so their failure must not report a successfully claimed
                // load as unavailable.
                if (listingClaimed) {
                    showNoticeModal(
                        activeChatRoomId
                            ? "Load accepted successfully! Opening message session with your farmer."
                            : "Load accepted successfully. It is now in your active trips.",
                        "Load Accepted",
                        "success"
                    );
                    setTimeout(() => {
                        window.location.href = activeChatRoomId
                            ? `messages.html?chatId=${activeChatRoomId}`
                            : "active_trips.html";
                    }, 700);
                    return;
                }

                showNoticeModal("Could not claim this load. It may have been modified or accepted by another transport driver.");
                
                if (targetButton) {
                    targetButton.disabled = false;
                    targetButton.classList.remove("opacity-50", "cursor-not-allowed");
                    targetButton.innerText = "Accept Load";
                }
            }
        }

        searchInput.addEventListener("input", renderLoads);
        sortFilter.addEventListener("change", renderLoads);

        const sideBtn = document.getElementById("side-btn");
        const closeSideBtn = document.getElementById("closeside-btn");
        const sideBar = document.getElementById("side-bar");

        if (sideBtn && sideBar) {
            sideBtn.addEventListener("click", () => sideBar.classList.remove("max-md:hidden"));
        }
        if (closeSideBtn && sideBar) {
            closeSideBtn.addEventListener("click", () => sideBar.classList.add("max-md:hidden"));
        }

        document.getElementById("logout-btn")?.addEventListener("click", () => {
            signOut(auth)
                .then(() => { window.location.href = LOGIN_PAGE_URL; })
                .catch((err) => console.error(err));
        });
  return {};
}
