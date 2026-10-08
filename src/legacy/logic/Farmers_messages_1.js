import { auth, db } from "../../../backend/firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, query, where, orderBy, addDoc, updateDoc, serverTimestamp, doc, getDoc, getDocs, onSnapshot, limit, increment } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export function initialize() {
const chatThreadsContainer = document.getElementById("chat-threads-container");
        const chatListPanel = document.getElementById("chat-list-panel");
        const chatWindowHeader = document.getElementById("chat-window-header");
        const messageBubblesContainer = document.getElementById("message-bubbles-container");
        const messageInput = document.getElementById("message-input");
        const sendButton = document.getElementById("send-btn");
        const listingInfoDrawer = document.getElementById("listing-info-drawer");
        const listingInfoOverlay = document.getElementById("listing-info-overlay");
        const listingInfoClose = document.getElementById("listing-info-close");
        const listingInfoTitle = document.getElementById("listing-info-title");
        const listingInfoContent = document.getElementById("listing-info-content");

        if (sendButton) sendButton.disabled = true;

        messageInput?.addEventListener("input", () => {
            if (sendButton) sendButton.disabled = messageInput.value.trim() === "";
        });

        const emptyChatState = document.getElementById("empty-chat-state");
        const activeChatState = document.getElementById("active-chat-state");
        const nameEl = document.getElementById("user-display-name");
        const avatarEl = document.getElementById("user-avatar");
        const globalUnreadBadge = document.getElementById("global-unread-badge");

        let activeChatId = null; 
        let unsubscribeMessages = null; 
        let currentUserData = null;
        let currentUserProfile = {};
        const userProfileCache = new Map();
        const activeRooms = new Map();

        function isMobileMessagesLayout() {
            return window.matchMedia("(max-width: 1023px)").matches;
        }

        function syncResponsiveMessagingLayout() {
            if (!chatListPanel || !activeChatState) return;

            if (isMobileMessagesLayout()) {
                chatListPanel.classList.toggle("hidden", Boolean(activeChatId));
                activeChatState.classList.toggle("hidden", !activeChatId);
                emptyChatState?.classList.add("hidden");
                emptyChatState?.classList.remove("lg:flex");
            } else {
                chatListPanel.classList.remove("hidden");
                activeChatState.classList.toggle("hidden", !activeChatId);
                emptyChatState?.classList.toggle("hidden", Boolean(activeChatId));
                emptyChatState?.classList.toggle("lg:flex", !activeChatId);
            }
        }

        function showThreadListOnMobile() {
            if (!isMobileMessagesLayout()) return;
            chatListPanel?.classList.remove("hidden");
            activeChatState?.classList.add("hidden");
            messageInput?.blur();
        }

        window.addEventListener("resize", syncResponsiveMessagingLayout);

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

        function updateGlobalUnreadBadge(count) {
            if (!globalUnreadBadge) return;
            if (count > 0) {
                globalUnreadBadge.textContent = count > 99 ? "99+" : String(count);
                globalUnreadBadge.classList.remove("hidden");
            } else {
                globalUnreadBadge.classList.add("hidden");
            }
        }

        function getInitials(name) {
            return (name || "FR").trim().substring(0, 2).toUpperCase();
        }

        function getProfileName(profile, fallback = "FarmRoute User") {
            return profile?.name || profile?.fullName || profile?.displayName || fallback;
        }

        function getProfileAvatar(profile) {
            return profile?.profilePictureUrl || profile?.profilePictureURL || profile?.photoURL || profile?.avatarUrl || profile?.avatar || "";
        }

        function getRoomAvatar(room, role) {
            return room?.[`${role}Avatar`] || room?.[`${role}ProfilePictureUrl`] || room?.[`${role}ProfilePictureURL`] || room?.[`${role}PhotoURL`] || "";
        }

        function avatarMarkup(src, name, sizeClasses = "w-11 h-11", textClasses = "text-sm") {
            const safeName = escapeHTML(name || "FarmRoute User");
            if (src) {
                return `<img src="${escapeHTML(src)}" alt="${safeName}" class="${sizeClasses} rounded-full object-cover border border-slate-100">`;
            }
            return `<div class="${sizeClasses} bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-700 ${textClasses}">${escapeHTML(getInitials(name))}</div>`;
        }

        async function getUserProfile(userId) {
            if (!userId) return {};
            if (userProfileCache.has(userId)) return userProfileCache.get(userId);

            try {
                const userSnap = await getDoc(doc(db, "users", userId));
                const profile = userSnap.exists() ? userSnap.data() : {};
                userProfileCache.set(userId, profile);
                return profile;
            } catch (err) {
                console.error("Unable to fetch chat participant profile:", err);
                userProfileCache.set(userId, {});
                return {};
            }
        }

        async function enrichRoom(room, userId) {
            const isFarmer = room.farmerId === userId;
            const recipientId = isFarmer ? room.driverId : room.farmerId;
            const recipientProfile = await getUserProfile(recipientId);
            const farmerProfile = await getUserProfile(room.farmerId);
            const driverProfile = await getUserProfile(room.driverId);

            const farmerName = getProfileName(farmerProfile, room.farmerName || "Farmer Owner");
            const driverName = getProfileName(driverProfile, room.driverName || "Driver Partner");
            const recipientName = isFarmer ? driverName : farmerName;

            return {
                ...room,
                isFarmer,
                recipientId,
                recipientName,
                recipientAvatar: getProfileAvatar(recipientProfile) || getRoomAvatar(room, "recipient"),
                farmerName,
                farmerAvatar: getProfileAvatar(farmerProfile) || getRoomAvatar(room, "farmer"),
                driverName,
                driverAvatar: getProfileAvatar(driverProfile) || getRoomAvatar(room, "driver")
            };
        }

        // Dynamic Native Event Delegation for Threads Layout
        chatThreadsContainer?.addEventListener("click", (e) => {
            const threadRow = e.target.closest("[data-room-id]");
            if (!threadRow) return;

            const roomId = threadRow.getAttribute("data-room-id");
            
            switchActiveChat(roomId);
            messageInput?.focus();
        });

        chatWindowHeader?.addEventListener("click", (e) => {
            const backButton = e.target.closest("[data-action='back-to-threads']");
            if (backButton) {
                showThreadListOnMobile();
                return;
            }

            const infoButton = e.target.closest("[data-action='show-listing-info']");
            if (!infoButton || !activeChatId) return;
            openListingInfo(activeChatId);
        });

        listingInfoClose?.addEventListener("click", closeListingInfo);
        listingInfoOverlay?.addEventListener("click", closeListingInfo);

        document.getElementById("closeside-btn")?.addEventListener("click", () => {
            document.getElementById("side-bar").classList.add("max-md:hidden");
        });

        document.getElementById("side-btn")?.addEventListener("click", () => {
            document.getElementById("side-bar").classList.remove("max-md:hidden");
        });

        document.getElementById("logout-btn")?.addEventListener("click", () => {
            signOut(auth).then(() => window.location.href = "../login.html");
        });

        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = "../login.html";
                return;
            }
            currentUserData = user;

            const userTitle = user.displayName || "Farmer Ndlovu";
            if (nameEl) nameEl.innerText = userTitle;

            try {
                const userDocSnap = await getDoc(doc(db, "users", user.uid));
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    currentUserProfile = userData;
                    const profileName = getProfileName(userData, userTitle);
                    if (nameEl) nameEl.innerText = profileName;
                    updateHeaderAvatar(getProfileAvatar(userData) || user.photoURL || "");
                }
            } catch (err) {
                console.error("Firestore profile fetch failed:", err);
            }

            loadChatThreads(user.uid);
        });

        function loadChatThreads(userId) {
            const chatRoomsRef = collection(db, "chats");

            // Firestore requires a composite index for: array-contains + orderBy(lastMessageTime desc)
            // If the index isn't created, Firestore returns an error and no threads load.
            // To keep the UI working even without the index, we query by participants only, then sort locally.
            const threadsQuery = query(chatRoomsRef, where("participants", "array-contains", userId));

            onSnapshot(threadsQuery, async (snapshot) => {
                if (!chatThreadsContainer) return;
                chatThreadsContainer.innerHTML = "";
                updateGlobalUnreadBadge(getMessageNotificationCount(snapshot, userId));

                if (snapshot.empty) {
                    chatThreadsContainer.innerHTML = `<p class="text-slate-400 py-12 text-center text-xs">No active conversations found.</p>`;
                    return;
                }

                // Sort locally by lastMessageTime desc
                const rooms = await Promise.all(snapshot.docs.map(docSnap => enrichRoom({ id: docSnap.id, ...docSnap.data() }, userId)));
                rooms.sort((a, b) => {
                    const aT = a.lastMessageTime;
                    const bT = b.lastMessageTime;
                    const aMs = aT ? (typeof aT.toDate === "function" ? aT.toDate().getTime() : (aT.seconds ? aT.seconds * 1000 : 0)) : 0;
                    const bMs = bT ? (typeof bT.toDate === "function" ? bT.toDate().getTime() : (bT.seconds ? bT.seconds * 1000 : 0)) : 0;
                    return bMs - aMs;
                });

                for (const room of rooms) {
                    const roomId = room.id;
                    activeRooms.set(roomId, room);
                    const recipientName = room.recipientName;
                    const lastMessage = room.lastMessage || "Click to open conversation...";

                    let timestamp = "Just Now";
                    if (room.lastMessageTime) {
                        if (typeof room.lastMessageTime.toDate === "function") {
                            timestamp = room.lastMessageTime.toDate().toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
                        } else if (room.lastMessageTime.seconds) {
                            const date = new Date(room.lastMessageTime.seconds * 1000);
                            timestamp = date.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
                        }
                    }

                    const isSelected = roomId === activeChatId ? 'bg-[#f4fbf7] border border-emerald-100/50' : '';

                    const threadHtml = `
                        <div data-room-id="${roomId}" class="p-3 hover:bg-slate-50 rounded-xl flex gap-3 cursor-pointer transition items-center ${isSelected}">
                            <div class="relative min-w-[2.75rem]">
                                ${avatarMarkup(room.recipientAvatar, recipientName)}
                                <span class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex items-baseline justify-between">
                                    <h4 class="text-sm font-semibold text-slate-800 truncate">${escapeHTML(recipientName)}</h4>
                                    <span class="text-xs text-slate-400">${escapeHTML(timestamp)}</span>
                                </div>
                                <p id="last-msg-${roomId}" class="text-xs text-slate-400 truncate mt-0.5">${escapeHTML(lastMessage)}</p>
                            </div>
                        </div>`;
                    chatThreadsContainer.insertAdjacentHTML("beforeend", threadHtml);
                }
            }, (err) => {
                console.error("Error syncing rooms:", err);
            });
        }

        function switchActiveChat(roomId) {
            activeChatId = roomId;
            const room = activeRooms.get(roomId);
            if (!room) return;
            updateDoc(doc(db, "chats", roomId), { [`unreadCounts.${currentUserData.uid}`]: 0 }).catch((err) => console.error("Could not clear chat unread count:", err));
            const recipientName = room.recipientName;

            emptyChatState?.classList.add("hidden");
            activeChatState?.classList.remove("hidden");
            syncResponsiveMessagingLayout();

            document.querySelectorAll('#chat-threads-container > div').forEach(el => el.classList.remove('bg-[#f4fbf7]', 'border', 'border-emerald-100/50'));
            const dynamicActiveRow = document.querySelector(`[data-room-id="${roomId}"]`);
            dynamicActiveRow?.classList.add('bg-[#f4fbf7]', 'border', 'border-emerald-100/50');

            if (chatWindowHeader) {
                chatWindowHeader.innerHTML = `
                    <div class="flex items-center gap-3 min-w-0">
                        <button data-action="back-to-threads" class="lg:hidden w-9 h-9 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 shrink-0 transition" aria-label="Back to conversations">
                            <i class="fa-solid fa-arrow-left"></i>
                        </button>
                        <div class="relative shrink-0">
                            ${avatarMarkup(room.recipientAvatar, recipientName, "w-10 h-10", "text-xs")}
                            <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div class="min-w-0">
                            <h3 class="font-bold text-slate-900 text-sm truncate">${escapeHTML(recipientName)}</h3>
                            <p class="text-xs text-emerald-600 font-medium">● Online</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3 sm:gap-4 text-slate-600 text-lg shrink-0">
                        <button class="hover:text-slate-900 transition"><i class="fa-solid fa-phone"></i></button>
                        <button class="hover:text-slate-900 transition"><i class="fa-solid fa-video"></i></button>
                        <button data-action="show-listing-info" class="hover:text-slate-900 transition" title="Listing details"><i class="fa-solid fa-circle-info"></i></button>
                    </div>`;
            }

            if (unsubscribeMessages) unsubscribeMessages();
            listenForMessages(roomId);
        }

        function getSenderAvatar(senderId) {
            const room = activeRooms.get(activeChatId);
            if (room?.farmerId === senderId) return { src: room.farmerAvatar, name: room.farmerName };
            if (room?.driverId === senderId) return { src: room.driverAvatar, name: room.driverName };
            if (currentUserData?.uid === senderId) return { src: getProfileAvatar(currentUserProfile) || currentUserData.photoURL || "", name: getProfileName(currentUserProfile, currentUserData.displayName || "You") };
            return { src: "", name: "FarmRoute User" };
        }

        function listenForMessages(roomId) {
            if (!messageBubblesContainer) return;

            const messagesRef = collection(db, "chats", roomId, "messages");
            const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));

            unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
                let collectiveHTML = "";
                
                snapshot.forEach((msgSnap) => {
                    const msg = msgSnap.data();
                    const isMe = msg.senderId === currentUserData.uid;
                    const timeDisplay = msg.timestamp
                        ? (typeof msg.timestamp.toDate === "function"
                            ? msg.timestamp.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                            : new Date(msg.timestamp.seconds * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}))
                        : "Just now";

                    if (isMe) {
                        const senderAvatar = getSenderAvatar(msg.senderId);
                        collectiveHTML += `
                            <div class="flex items-end gap-2 justify-end max-w-[78%] ml-auto">
                                <div class="flex flex-col items-end">
                                    <div class="bg-[#e8f5e9] text-slate-800 text-[14px] p-3.5 rounded-2xl rounded-tr-none leading-relaxed">
                                        ${escapeHTML(msg.text)}
                                    </div>
                                    <div class="flex items-center gap-1 mt-1 text-slate-400 text-[10px]">
                                        <span>${timeDisplay}</span>
                                        <i class="fa-solid fa-check-double text-emerald-500"></i>
                                    </div>
                                </div>
                                ${avatarMarkup(senderAvatar.src, senderAvatar.name, "w-8 h-8", "text-[10px]")}
                            </div>`;
                    } else {
                        const senderAvatar = getSenderAvatar(msg.senderId);
                        collectiveHTML += `
                            <div class="flex items-end gap-2 max-w-[78%]">
                                ${avatarMarkup(senderAvatar.src, senderAvatar.name, "w-8 h-8", "text-[10px]")}
                                <div class="flex flex-col items-start">
                                    <div class="bg-slate-100 text-slate-800 text-[14px] p-3.5 rounded-2xl rounded-tl-none leading-relaxed">
                                        ${escapeHTML(msg.text)}
                                    </div>
                                    <span class="text-[10px] text-slate-400 mt-1">${timeDisplay}</span>
                                </div>
                            </div>`;
                    }
                });

                messageBubblesContainer.innerHTML = collectiveHTML;
                messageBubblesContainer.scrollTop = messageBubblesContainer.scrollHeight;
            });
        }

        function escapeHTML(text) {
            const div = document.createElement("div");
            div.textContent = text;
            return div.innerHTML;
        }

        function getProductIdFromRoom(room) {
            return room.productId || room.listingId || room.productDocId || room.productDocID || room.listingDocId || "";
        }

        async function getListingForRoom(room) {
            const productId = getProductIdFromRoom(room);
            if (productId) {
                const productSnap = await getDoc(doc(db, "products", productId));
                if (productSnap.exists()) return { id: productSnap.id, ...productSnap.data() };
            }

            if (room.product || room.listing || room.productName || room.cropName || room.name) {
                return {
                    ...(room.product || room.listing || {}),
                    name: room.productName || room.cropName || room.name || room.product?.name || room.listing?.name,
                    quantity: room.quantity || room.product?.quantity || room.listing?.quantity,
                    unit: room.unit || room.product?.unit || room.listing?.unit,
                    routeFrom: room.routeFrom || room.location || room.product?.routeFrom || room.listing?.routeFrom,
                    routeTo: room.routeTo || room.destination || room.product?.routeTo || room.listing?.routeTo,
                    pickupPoint: room.pickupPoint || room.product?.pickupPoint || room.listing?.pickupPoint,
                    dropoffPoint: room.dropoffPoint || room.product?.dropoffPoint || room.listing?.dropoffPoint,
                    price: room.price || room.product?.price || room.listing?.price,
                    description: room.description || room.product?.description || room.listing?.description,
                    images: room.images || room.product?.images || room.listing?.images
                };
            }

            if (room.farmerId) {
                const listingQuery = query(collection(db, "products"), where("farmerId", "==", room.farmerId), limit(1));
                const listingSnap = await getDocs(listingQuery);
                if (!listingSnap.empty) {
                    const productSnap = listingSnap.docs[0];
                    return { id: productSnap.id, ...productSnap.data() };
                }
            }

            return null;
        }

        function detailRow(label, value, icon) {
            return `
                <div class="bg-slate-50 border border-slate-100 rounded-xl p-3">
                    <p class="text-[10px] uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                        <i class="${icon}"></i> ${label}
                    </p>
                    <p class="text-sm font-semibold text-slate-800 mt-1 break-words">${escapeHTML(value || "Not specified")}</p>
                </div>
            `;
        }

        async function openListingInfo(roomId) {
            const room = activeRooms.get(roomId);
            if (!room || !listingInfoDrawer || !listingInfoContent) return;

            listingInfoDrawer.classList.remove("hidden");
            listingInfoTitle.textContent = "Loading listing...";
            listingInfoContent.innerHTML = `<p class="text-sm text-slate-400 py-8 text-center">Fetching listing details...</p>`;

            try {
                const listing = await getListingForRoom(room);
                if (!listing) {
                    listingInfoTitle.textContent = "Listing unavailable";
                    listingInfoContent.innerHTML = `<p class="text-sm text-slate-500 py-8 text-center">No listing details are attached to this chat yet.</p>`;
                    return;
                }

                const imageSrc = Array.isArray(listing.images) && listing.images.length > 0
                    ? listing.images[0]
                    : (listing.imageUrl || "");
                const title = listing.name || listing.productName || listing.cropName || "Produce Cargo";
                const unit = listing.unit || "kg";
                const quantity = listing.quantity || listing.weight || "0";
                const price = listing.price ? `₦${Number(listing.price).toLocaleString()} / ${unit}` : "Not specified";

                listingInfoTitle.textContent = title;
                listingInfoContent.innerHTML = `
                    ${imageSrc ? `<img src="${escapeHTML(imageSrc)}" alt="${escapeHTML(title)}" class="w-full aspect-[16/10] object-cover rounded-xl border border-slate-100">` : ""}
                    <div class="grid grid-cols-2 gap-3">
                        ${detailRow("Size", `${quantity} ${unit}`, "fa-solid fa-boxes-stacked")}
                        ${detailRow("Price", price, "fa-solid fa-naira-sign")}
                        ${detailRow("Pickup", listing.pickupPoint || listing.routeFrom || listing.location, "fa-solid fa-location-dot")}
                        ${detailRow("Drop-off", listing.dropoffPoint || listing.routeTo || listing.destination, "fa-solid fa-flag-checkered")}
                        ${detailRow("Route From", listing.routeFrom || listing.location, "fa-solid fa-route")}
                        ${detailRow("Route To", listing.routeTo || listing.destination, "fa-solid fa-map-pin")}
                        ${detailRow("Harvest Date", listing.harvestDate, "fa-regular fa-calendar")}
                        ${detailRow("Status", listing.status || "Active", "fa-solid fa-circle-info")}
                    </div>
                    <div class="bg-white border border-slate-100 rounded-xl p-4">
                        <p class="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Description</p>
                        <p class="text-sm text-slate-700 mt-1 leading-relaxed">${escapeHTML(listing.description || "No description added.")}</p>
                    </div>
                    <div class="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                        <p class="text-[10px] uppercase tracking-wider text-emerald-700 font-bold">Contact Context</p>
                        <p class="text-sm text-slate-700 mt-1">Farmer: <span class="font-semibold">${escapeHTML(room.farmerName)}</span></p>
                        <p class="text-sm text-slate-700 mt-1">Driver: <span class="font-semibold">${escapeHTML(room.driverName)}</span></p>
                    </div>
                `;
            } catch (err) {
                console.error("Listing details fetch failed:", err);
                listingInfoTitle.textContent = "Listing unavailable";
                listingInfoContent.innerHTML = `<p class="text-sm text-red-500 py-8 text-center">Could not load listing details for this chat.</p>`;
            }
        }

        function closeListingInfo() {
            listingInfoDrawer?.classList.add("hidden");
        }

        async function handleMessageDispatch() {
            const textPayload = messageInput.value.trim();
            if (!textPayload || !activeChatId || !currentUserData || !sendButton) return;
            
            sendButton.disabled = true;
            try {
                messageInput.value = ""; 
                await addDoc(collection(db, "chats", activeChatId, "messages"), {
                    senderId: currentUserData.uid,
                    senderName: currentUserData.displayName || "",
                    text: textPayload,
                    timestamp: serverTimestamp()
                });

                const room = activeRooms.get(activeChatId) || {};
                const recipientId = [room.farmerId, room.driverId, ...(room.participants || [])]
                    .find((participantId) => participantId && participantId !== currentUserData.uid);
                const chatUpdate = { lastMessage: textPayload, lastMessageTime: serverTimestamp() };
                if (recipientId) chatUpdate[`unreadCounts.${recipientId}`] = increment(1);
                await updateDoc(doc(db, "chats", activeChatId), chatUpdate);
            } catch (dispatchErr) {
                console.error("Transmission workflow error:", dispatchErr);
            } finally {
                if (sendButton) sendButton.disabled = false;
                messageInput.focus();
            }
        }

        sendButton?.addEventListener("click", handleMessageDispatch);
        messageInput?.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleMessageDispatch();
            }
        });
  return {};
}
