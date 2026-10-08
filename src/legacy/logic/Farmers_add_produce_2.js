import { auth, db } from "../../../backend/firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, collection, addDoc, query, where, onSnapshot } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { createNotification } from "../../../backend/notificationService.js";

export function initialize() {
const LOGIN_PAGE_URL = "../login.html";

        // DOM Elements
        const nameEl = document.getElementById("user-display-name");
        const roleEl = document.getElementById("user-display-role");
        const avatarEl = document.getElementById("user-avatar");
        const messageBadgeEl = document.getElementById("message-notification-badge");
        
        // Form & Wizard Navigation Elements
        const form = document.getElementById("produce-listing-form");
        const nextBtn = document.getElementById("next-btn");
        const prevBtn = document.getElementById("prev-btn");
        const progressLine = document.getElementById("progress-line");
        const stepItems = document.querySelectorAll(".step-item");
        
        // Modal Interaction Targets
        const successModal = document.getElementById("success-modal");
        const successModalCard = document.getElementById("success-modal-card");
        const modalCloseBtn = document.getElementById("modal-close-btn");

        const panels = [
            document.getElementById("step-panel-1"),
            document.getElementById("step-panel-2"),
            document.getElementById("step-panel-3")
        ];

        let currentStep = 0; 

        // Cached current user details for Paystack processing
        let currentUserEmail = "";

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

        // Real-time Preview Elements
        const descriptionInput = document.getElementById("description");
        const charCounter = document.getElementById("char-counter");
        
        const prevTitle = document.getElementById("prev-title");
        const prevCat = document.getElementById("prev-cat");
        const prevQty = document.getElementById("prev-qty");
        const prevLoc = document.getElementById("prev-loc");
        const prevDesc = document.getElementById("prev-desc");
        const prevPrice = document.getElementById("prev-price");
        const prevUnit = document.getElementById("prev-unit");

        // Check Authentication State
        onAuthStateChanged(auth, async (user) => {
            if (!user) {
                window.location.href = LOGIN_PAGE_URL;
                return;
            }

            currentUserEmail = user.email || "";
            nameEl.innerText = user.displayName || "FarmRoute User";
            roleEl.innerText = "Farmer"; 
            listenForMessageNotifications(user.uid);

            try {
                const userDocRef = doc(db, "users", user.uid);
                const userDocSnap = await getDoc(userDocRef);
                if (userDocSnap.exists()) {
                    const userData = userDocSnap.data();
                    if (userData.name) nameEl.innerText = userData.name;
                    if (userData.role) roleEl.innerText = userData.role;
                    if (userData.email) currentUserEmail = userData.email;
                    updateHeaderAvatar(userData.profilePictureUrl);
                }
            } catch (err) {
                console.error("Firestore profile fetch failed:", err);
            }
        });

        // Character Counter UI
        if (descriptionInput && charCounter) {
            descriptionInput.addEventListener("input", (e) => {
                charCounter.innerText = `${e.target.value.length}/200`;
                prevDesc.innerText = e.target.value || "Describe your produce quality here...";
            });
        }

        // Live Route Mapping Synchronization Link Engine
        const syncRoutePreview = () => {
            const origin = document.getElementById("location").value.trim() || "Ibadan, Oyo State";
            const destination = document.getElementById("destination").value.trim() || "Lagos State";
            prevLoc.innerText = `${origin} → ${destination}`;
        };

        document.getElementById("productName").addEventListener("input", (e) => prevTitle.innerText = e.target.value || "Fresh Tomatoes");
        document.getElementById("category").addEventListener("change", (e) => prevCat.innerText = e.target.value);
        document.getElementById("location").addEventListener("input", syncRoutePreview);
        document.getElementById("destination").addEventListener("input", syncRoutePreview);
        document.getElementById("pricePerUnit").addEventListener("input", (e) => prevPrice.innerText = e.target.value ? `₦${Number(e.target.value).toLocaleString()}` : "₦0");
        
        const syncQtyAndUnit = () => {
            const qty = document.getElementById("quantity").value || "0";
            const unit = document.getElementById("unit").value;
            prevQty.innerText = `${qty} ${unit} available`;
            prevUnit.innerText = `/ ${unit}`;
        };
        document.getElementById("quantity").addEventListener("input", syncQtyAndUnit);
        document.getElementById("unit").addEventListener("change", syncQtyAndUnit);

        // Multi-Step Wizard Engine
        function updateWizardUI() {
            panels.forEach((panel, idx) => {
                if (idx === currentStep) {
                    panel.classList.remove("hidden");
                } else {
                    panel.classList.add("hidden");
                }
            });

            if (currentStep === 0) {
                prevBtn.classList.add("invisible");
            } else {
                prevBtn.classList.remove("invisible");
                prevBtn.innerText = "Back";
            }

            if (currentStep === panels.length - 1) {
                nextBtn.innerHTML = `<span>Pay Escrow & List</span> <i class="fa-solid fa-credit-card text-xs"></i>`;
            } else {
                const stepTitles = ["Pricing", "Availability"];
                nextBtn.innerHTML = `<span>Next: ${stepTitles[currentStep]}</span> <i class="fa-solid fa-arrow-right text-xs"></i>`;
            }

            const progressWidths = ["0%", "50%", "100%"];
            progressLine.style.width = progressWidths[currentStep];

            stepItems.forEach((item, idx) => {
                const bubble = item.querySelector("div");
                const label = item.querySelector("span");
                if (idx <= currentStep) {
                    bubble.className = "w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm ring-4 ring-emerald-50";
                    label.className = "text-xs font-semibold text-emerald-800 mt-2";
                } else {
                    bubble.className = "w-9 h-9 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm";
                    label.className = "text-xs font-medium text-gray-400 mt-2";
                }
            });
        }

        // Display Custom Modal Popup with transitions
        function showSuccessModal() {
            if (!successModal) {
                window.location.href = "listings.html";
                return;
            }
            
            successModal.classList.remove("hidden");
            setTimeout(() => {
                successModal.classList.remove("opacity-0");
                successModal.classList.add("opacity-100");
                if (successModalCard) {
                    successModalCard.classList.remove("scale-95");
                    successModalCard.classList.add("scale-100");
                }
            }, 20);

            if (modalCloseBtn) {
                modalCloseBtn.addEventListener("click", () => {
                    window.location.href = "listings.html";
                });
            }
        }

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

        // Isolated Firebase Save function execution context
        async function saveProductListing(productPayload) {
            try {
                const listingRef = await addDoc(collection(db, "products"), productPayload);
                const listingCode = `FR-${listingRef.id.slice(0, 8).toUpperCase()}`;
                await createNotification(db, productPayload.farmerId, {
                    recipientRole: "farmer",
                    type: "listing",
                    title: `You successfully listed ${productPayload.name || "your product"}`,
                    body: `Listing ${listingCode} is live and awaiting a driver match.`,
                    href: "listings.html",
                    relatedId: listingCode
                });
                nextBtn.innerText = "Success";
                showSuccessModal();
            } catch (error) {
                console.error("Error creating listing payload: ", error);
                showNoticeModal("Payment was successful, but there was an issue creating your listing. Please contact support with reference: " + productPayload.escrowPaymentRef);
                nextBtn.disabled = false;
                updateWizardUI();
            }
        }

        function readImageAsDataUrl(file) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(new Error("Could not read the selected image."));
                reader.readAsDataURL(file);
            });
        }

        async function uploadListingImages() {
            return Promise.all(selectedImages.map(async (file) => {
                const response = await fetch("/api/upload-image", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ image: await readImageAsDataUrl(file) })
                });
                const result = await response.json();

                if (!response.ok || !result.url) {
                    throw new Error(result.error || "Could not upload an image.");
                }

                return result.url;
            }));
        }

        // Next / Submit Routing Logic
        nextBtn.addEventListener("click", async () => {
            const inputs = panels[currentStep].querySelectorAll("[required], input, select, textarea");
            let valid = true;
            inputs.forEach(input => {
                if (input.hasAttribute("required") && !input.value.trim()) {
                    input.reportValidity();
                    valid = false;
                }
            });

            if (!valid) return;

            if (currentStep < panels.length - 1) {
                currentStep++;
                updateWizardUI();
            } else {
                try {
                    nextBtn.disabled = true;
                    nextBtn.innerText = "Opening Secure Gateway...";

                    // Store image files in ImgBB. Firestore only stores their URLs,
                    // keeping the listing document below Firestore's 1 MiB size limit.
                    nextBtn.innerText = "Uploading Photos...";
                    const imageUrls = await uploadListingImages();

                    const quantity = parseInt(document.getElementById("quantity").value) || 0;
                    const pricePerUnit = parseFloat(document.getElementById("pricePerUnit").value) || 0;
                    const totalProduceValue = quantity * pricePerUnit;

                    // The driver payout is the listing value. FarmRoute's 5% fee is
                    // charged to the farmer separately, so it is never included in
                    // the amount held for the driver.
                    const DELIVERY_COST_NAIRA = totalProduceValue;
                    const PLATFORM_FEE_RATE = 0.05;
                    const PLATFORM_FEE_NAIRA = Math.round(DELIVERY_COST_NAIRA * PLATFORM_FEE_RATE);
                    const totalAmountInNaira = DELIVERY_COST_NAIRA + PLATFORM_FEE_NAIRA;
                    const totalAmountInKobo = totalAmountInNaira * 100;

                    const handler = PaystackPop.setup({
                        key: 'pk_test_a6310c3751a19e50cc40c5b9f9452ef7c00df571', 
                        email: currentUserEmail || "farmer@farmroute.com",
                        amount: totalAmountInKobo,
                        currency: "NGN",
                        callback: function (response) {
                            nextBtn.innerText = "Publishing Listing...";
                            
                            const productPayload = {
                                farmerId: auth.currentUser.uid,
                                name: document.getElementById("productName").value,
                                category: document.getElementById("category").value,
                                unit: document.getElementById("unit").value,
                                description: document.getElementById("description").value,
                                price: pricePerUnit,
                                quantity: quantity,
                                totalValue: totalProduceValue,
                                harvestDate: document.getElementById("harvestDate").value,
                                routeFrom: document.getElementById("location").value,
                                routeTo: document.getElementById("destination").value,
                                pickupPoint: document.getElementById("pickupPoint").value,  
                                dropoffPoint: document.getElementById("dropoffPoint").value, 
                                images: imageUrls,
                                status: "Searching", 
                                
                                platformFeeRate: PLATFORM_FEE_RATE,
                                platformFeePaid: PLATFORM_FEE_NAIRA,
                                deliveryFeeEscrowed: DELIVERY_COST_NAIRA,
                                totalAmountPaid: totalAmountInNaira,
                                
                                escrowPaymentRef: response.reference, 
                                escrowPaid: true,
                                createdAt: new Date()
                            };

                            saveProductListing(productPayload);
                        },
                        onClose: function () {
                            showNoticeModal("Escrow confirmation closed. Total platform execution values must be processed to route goods.");
                            nextBtn.disabled = false;
                            updateWizardUI();
                        }
                    });

                    handler.openIframe();

                } catch (error) {
                    console.error("Payload compiler failure: ", error);
                    showNoticeModal("Failed to initialize system state. Try again.");
                    nextBtn.disabled = false;
                    updateWizardUI();
                }
            }
        });

        prevBtn.addEventListener("click", () => {
            if (currentStep > 0) {
                currentStep--;
                updateWizardUI();
            }
        });

        const logoutBtn = document.getElementById("logout-btn");
        if (logoutBtn) {
            logoutBtn.addEventListener("click", () => {
                signOut(auth)
                    .then(() => { window.location.href = LOGIN_PAGE_URL; })
                    .catch((error) => { console.error("Signout error:", error); });
            });
        }

        // Image Handling State Management
        let selectedImages = [];
        const imageInput = document.getElementById("imageFiles");
        const previewContainer = document.getElementById("image-previews-container");
        const mainPreviewImg = document.querySelector(".relative.bg-emerald-50 img"); 

        function renderPreviews() {
            previewContainer.innerHTML = "";

            if (selectedImages.length === 0 && mainPreviewImg) {
                mainPreviewImg.src = "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600";
                return;
            }

            selectedImages.forEach((file, index) => {
                const reader = new FileReader();
                reader.onload = (event) => {
                    if (index === 0 && mainPreviewImg) {
                        mainPreviewImg.src = event.target.result;
                    }

                    const thumbnailMarkup = `
                        <div class="relative rounded-xl border overflow-hidden aspect-square group">
                            <img src="${event.target.result}" class="w-full h-full object-cover">
                            <button type="button" data-index="${index}" class="remove-img-btn absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition shadow">
                                <i class="fa-solid fa-xmark"></i>
                            </button>
                        </div>
                    `;
                    previewContainer.insertAdjacentHTML("beforeend", thumbnailMarkup);
                };
                reader.readAsDataURL(file);
            });
        }

        if (imageInput) {
            imageInput.addEventListener("change", (e) => {
                const files = Array.from(e.target.files);
                files.forEach(file => {
                    if (file.type.startsWith("image/")) {
                        selectedImages.push(file);
                    }
                });
                imageInput.value = ""; 
                renderPreviews();
            });
        }

        previewContainer.addEventListener("click", (e) => {
            const removeBtn = e.target.closest(".remove-img-btn");
            if (!removeBtn) return;
            
            const indexToRemove = parseInt(removeBtn.getAttribute("data-index"));
            selectedImages.splice(indexToRemove, 1);
            renderPreviews();
        });

        document.getElementById("side-btn")?.addEventListener("click", () => {
            document.getElementById("side-bar")?.classList.remove("max-md:hidden");
        });

        document.getElementById("closeside-btn")?.addEventListener("click", () => {
            document.getElementById("side-bar")?.classList.add("max-md:hidden");
        });
  return {};
}
