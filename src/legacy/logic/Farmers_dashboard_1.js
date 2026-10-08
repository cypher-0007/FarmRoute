import { auth, db } from "../../../backend/firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, getDoc, collection, query, where, onSnapshot, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export function initialize() {
const LOGIN_PAGE_URL = "../login.html";

    const nameEl = document.getElementById("user-display-name");
    const roleEl = document.getElementById("user-display-role");
    const avatarEl = document.getElementById("user-avatar");
    const messageBadgeEl = document.getElementById("message-notification-badge");
    const headerMessageBadgeEl = document.getElementById("header-message-notification-badge");
    const loadingScreen = document.getElementById("loading-screen");
    const recentContainer = document.getElementById("recent-shipments-container");
    const diagnosticsProductName = document.getElementById("diagnostics-product-name");
    const diagnosticsSeverity = document.getElementById("diagnostics-severity");
    const diagnosticsBatchId = document.getElementById("diagnostics-batch-id");
    const diagnosticsRiskBar = document.getElementById("diagnostics-risk-bar");
    const diagnosticsShelfLife = document.getElementById("diagnostics-shelf-life");
    const diagnosticsRoutingMode = document.getElementById("diagnostics-routing-mode");
    const diagnosticsSummary = document.getElementById("diagnostics-summary");
    const diagnosticsImageFrame = document.getElementById("diagnostics-image-frame");
    const diagnosticsPulse = document.getElementById("diagnostics-pulse");
    const runDiagnosticsBtn = document.getElementById("run-diagnostics-btn");
    const diagnosticsAlertList = document.getElementById("diagnostics-alert-list");
    const diagnosticsModelStatus = document.getElementById("diagnostics-model-status");
    const diagnosticsListingSelect = document.getElementById("diagnostics-listing-select");

    // Metric DOM Elements
    const completedEl = document.getElementById("metric-completed");
    const activeEl = document.getElementById("metric-active");
    const pendingEl = document.getElementById("metric-pending");
    const listingsEl = document.getElementById("metric-listings");
    const dashboardMonthFilter = document.getElementById("dashboard-month-filter");
    let farmerProducts = [];

    function deliveryDateMillis(data) {
        const value = data.deliveredAt || data.completedAt || data.updatedAt || data.createdAt;
        if (!value) return null;
        if (typeof value.toDate === "function") return value.toDate().getTime();
        if (typeof value === "object" && value.seconds) return value.seconds * 1000;
        const parsed = new Date(value).getTime();
        return Number.isNaN(parsed) ? null : parsed;
    }

    function updateDashboardMetrics() {
        if (!dashboardMonthFilter) return;
        const selectedMonth = dashboardMonthFilter.value;
        const monthProducts = farmerProducts.filter(({ data }) => {
            if (selectedMonth === "all") return true;
            const millis = deliveryDateMillis(data);
            return millis !== null && new Date(millis).toISOString().slice(0, 7) === selectedMonth;
        });
        const countStatus = (statuses) => monthProducts.filter(({ data }) => statuses.includes(data.status || "Searching")).length;
        if (completedEl) completedEl.innerText = String(countStatus(["Delivered"]));
        if (activeEl) activeEl.innerText = String(countStatus(["Matched", "In Transit", "Driver Delivered"]));
        if (pendingEl) pendingEl.innerText = String(countStatus(["Searching"]));
        if (listingsEl) listingsEl.innerText = String(monthProducts.filter(({ data }) => data.status !== "Delivered").length);
    }

    function renderRecentDeliveries() {
        if (!recentContainer) return;
        const recentRows = farmerProducts
            .filter(({ data }) => data.status === "Delivered")
            .sort((a, b) => (deliveryDateMillis(b.data) || 0) - (deliveryDateMillis(a.data) || 0))
            .slice(0, 4);
        recentContainer.innerHTML = "";
        if (!recentRows.length) {
            recentContainer.innerHTML = `<p class="text-gray-500 py-6 text-center">No recent deliveries yet.</p>`;
            return;
        }

        recentRows.forEach(({ data }) => {
            const productName = data.name || "Unnamed Crop";
            const weight = data.weight || "0";
            const unit = data.unit || "kg";
            const routeFrom = data.routeFrom || data.location || "Unknown";
            const routeTo = data.routeTo || data.destination || "Marketplace";
            const price = data.price ? Number(data.price).toLocaleString() : "0";
            const imageSrc = getProductImage(data);
            const deliveredAtMillis = deliveryDateMillis(data);
            const deliveredOn = deliveredAtMillis === null
                ? "date unavailable"
                : new Date(deliveredAtMillis).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
            recentContainer.insertAdjacentHTML("beforeend", `
                <div class="grid grid-cols-4 items-center gap-4 py-5 border-b last:border-0 px-2">
                    <div class="flex items-center gap-4 min-w-0"><img src="${imageSrc}" alt="" class="w-16 h-16 rounded-xl object-cover border shrink-0"><div class="min-w-0"><h3 class="font-semibold text-base text-gray-800 truncate">${productName}</h3><p class="text-gray-500 text-sm">${weight} ${unit}</p></div></div>
                    <div class="min-w-0"><h4 class="font-medium text-gray-800 truncate">${routeFrom} → ${routeTo}</h4><p class="text-gray-400 text-xs">Delivered ${deliveredOn}</p></div>
                    <div class="min-w-0"><h4 class="font-semibold text-lg text-gray-900">₦${price}</h4><p class="text-gray-400 text-xs">Total value evaluated</p></div>
                    <div class="text-right"><span class="bg-green-100 text-green-700 px-4 py-1.5 rounded-lg text-xs font-semibold inline-block text-center min-w-[100px]">Delivered</span></div>
                </div>`);
        });
    }

    dashboardMonthFilter?.addEventListener("change", updateDashboardMetrics);

    function hideLoading() {
        if (loadingScreen) loadingScreen.classList.add("hidden");
    }

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

    function updateMessageBadges(count) {
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
        onSnapshot(chatsQuery, (snapshot) => {
            updateMessageBadges(getMessageNotificationCount(snapshot, userId));
        }, (err) => {
            console.error("Message notification sync failed:", err);
            updateMessageBadges(0);
        });
    }

    // Fallback dictionary for crop images
    const fallbackImages = {
        "tomatoes": "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200",
        "pepper": "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200",
        "yam": "https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=200",
        "maize": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200",
        "corn": "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200"
    };

    let cachedDiagnosticsProducts = [];
    let scoredDiagnosticsProducts = [];
    const geminiDiagnosticsCache = new Map();
    let diagnosticsRenderToken = 0;

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

    function getProductImage(data) {
        let imageSrc = (data.images && data.images.length > 0) ? data.images[0] : data.imageUrl;
        const cleanKey = (data.name || "").toLowerCase().trim();

        if (!imageSrc) {
            for (const key in fallbackImages) {
                if (cleanKey.includes(key)) {
                    imageSrc = fallbackImages[key];
                    break;
                }
            }
        }

        return imageSrc || "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=200";
    }

    function getUploadedProductImage(data) {
        return (data.images && data.images.length > 0) ? data.images[0] : (data.imageUrl || "");
    }

    function dateToMillis(value) {
        if (!value) return Date.now();
        if (typeof value.toDate === "function") return value.toDate().getTime();
        if (value.seconds) return value.seconds * 1000;
        const parsed = new Date(value).getTime();
        return Number.isNaN(parsed) ? Date.now() : parsed;
    }

    function setModelStatus(text, tone = "emerald") {
        if (!diagnosticsModelStatus) return;
        const toneClasses = {
            emerald: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
            amber: "text-amber-300 bg-amber-500/10 border-amber-500/20",
            red: "text-red-300 bg-red-500/10 border-red-500/20"
        };
        diagnosticsModelStatus.textContent = text;
        diagnosticsModelStatus.className = `text-[10px] border px-2 py-1 rounded-full ${toneClasses[tone] || toneClasses.emerald}`;
    }

    async function analyzeShelfLife(product) {
        const data = product.data;
        const imageSrc = getUploadedProductImage(data);
        const listing = {
            name: data.name || "Produce",
            category: data.category || "",
            harvestDate: data.harvestDate ? new Date(dateToMillis(data.harvestDate)).toISOString().slice(0, 10) : null,
            description: data.description || "",
            status: data.status || "Searching",
            quantity: data.quantity ?? null,
            unit: data.unit || "",
            location: data.location || "",
            routeFrom: data.routeFrom || "",
            routeTo: data.routeTo || ""
        };
        const cacheKey = JSON.stringify([product.id, listing, imageSrc]);
        let analysisPromise = geminiDiagnosticsCache.get(cacheKey);
        if (!analysisPromise) {
            analysisPromise = fetch("/api/shelf-life", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ listing, imageUrl: imageSrc || null })
            }).then(async response => {
                const result = await response.json().catch(() => ({}));
                if (!response.ok) throw new Error(result.error || "Gemini shelf-life analysis failed.");
                return result;
            });
            geminiDiagnosticsCache.set(cacheKey, analysisPromise);
        }
        let analysis;
        try {
            analysis = await analysisPromise;
        } catch (error) {
            geminiDiagnosticsCache.delete(cacheKey);
            console.error(`Gemini analysis failed for ${data.name || product.id}:`, error);
            return { ...product, data, imageSrc: getProductImage(data), riskScore: 50, severity: "URGENT", remainingHours: null, estimatedShelfLife: "Analysis unavailable", routeMode: "Review listing", insight: "Gemini could not analyze this listing. Retry the analysis." , analysisError: true };
        }
        const riskScore = Math.max(0, Math.min(100, Number(analysis.riskScore) || 0));
        const severity = riskScore >= 78 ? "CRITICAL" : riskScore >= 55 ? "URGENT" : riskScore >= 32 ? "WATCH" : "STABLE";

        return {
            ...product,
            data,
            riskScore,
            severity,
            estimatedShelfLife: analysis.estimatedShelfLife,
            remainingHours: null,
            routeMode: analysis.routingMode,
            storageAdvice: analysis.storageAdvice,
            imageSrc: getProductImage(data),
            imageLabel: analysis.condition,
            priorityReason: analysis.recommendation,
            insight: analysis.summary,
            recommendation: analysis.recommendation
        };
    }

    function renderPriorityQueue(scoredProducts) {
        if (!diagnosticsAlertList) return;
        const priorityProducts = scoredProducts
            .filter(item => !item.analysisError && ["CRITICAL", "URGENT", "WATCH"].includes(item.severity))
            .sort((a, b) => b.riskScore - a.riskScore)
            .slice(0, 3);

        if (priorityProducts.length === 0) {
            const failed = scoredProducts.some(item => item.analysisError);
            diagnosticsAlertList.innerHTML = failed
                ? `<p class="text-xs text-amber-300 border border-amber-500/10 rounded-lg p-3 bg-amber-500/5">Gemini could not assess some listings. Retry analysis before relying on their shelf-life estimates.</p>`
                : `<p class="text-xs text-emerald-300 border border-emerald-500/10 rounded-lg p-3 bg-emerald-500/5">No produce needs priority shipping right now.</p>`;
            return;
        }

        const borderClasses = {
            CRITICAL: "border-red-500/30 bg-red-500/10",
            URGENT: "border-amber-500/30 bg-amber-500/10",
            WATCH: "border-yellow-500/20 bg-yellow-500/10"
        };

        diagnosticsAlertList.innerHTML = priorityProducts.map(item => {
            const data = item.data;
            return `
                <div class="flex items-center gap-3 rounded-lg border ${borderClasses[item.severity]} p-2">
                    <img src="${escapeAttr(item.imageSrc)}" alt="${escapeAttr(data.name || "Produce")}" class="w-10 h-10 rounded-lg object-cover border border-white/10 shrink-0">
                    <div class="min-w-0 flex-1">
                        <div class="flex items-center gap-2 min-w-0">
                            <p class="text-sm font-semibold truncate">${escapeHTML(data.name || "Produce Cargo")}</p>
                            <span class="text-[10px] font-mono text-white/80">${item.severity}</span>
                        </div>
                        <p class="text-[11px] text-gray-400 truncate">${escapeHTML(item.estimatedShelfLife)} remaining | ${escapeHTML(item.imageLabel)} | risk ${item.riskScore}%</p>
                        <p class="text-[11px] text-gray-500 truncate">${escapeHTML(item.priorityReason)}</p>
                    </div>
                </div>
            `;
        }).join("");
    }

    async function renderShelfLifeDiagnostics(products) {
        const renderToken = ++diagnosticsRenderToken;
        const activeProducts = products.filter(item => (item.data.status || "Searching") !== "Delivered");

        if (activeProducts.length === 0) {
            if (diagnosticsProductName) diagnosticsProductName.textContent = "No active produce";
            if (diagnosticsSeverity) {
                diagnosticsSeverity.textContent = "CLEAR";
                diagnosticsSeverity.className = "text-[10px] bg-green-500/20 text-green-300 font-mono px-1.5 rounded border border-green-500/30";
            }
            if (diagnosticsBatchId) diagnosticsBatchId.textContent = "#FR-NONE";
            if (diagnosticsRiskBar) diagnosticsRiskBar.style.width = "8%";
            if (diagnosticsShelfLife) {
                diagnosticsShelfLife.textContent = "No risk";
                diagnosticsShelfLife.className = "text-xl font-bold text-green-300 mt-1";
            }
            if (diagnosticsRoutingMode) diagnosticsRoutingMode.innerHTML = `<i class="fa-solid fa-check text-xs"></i> Standby`;
            if (diagnosticsSummary) diagnosticsSummary.textContent = "No active produce listings need shelf-life intervention right now.";
            if (diagnosticsImageFrame) diagnosticsImageFrame.innerHTML = `<i class="fa-solid fa-seedling text-green-300"></i>`;
            renderPriorityQueue([]);
            return;
        }

        if (diagnosticsSummary) diagnosticsSummary.textContent = "Sending listing details and photos to Gemini for shelf-life and routing assessment...";
        if (diagnosticsAlertList) diagnosticsAlertList.innerHTML = `<p class="text-xs text-gray-500 border border-white/5 rounded-lg p-3 bg-white/5">Gemini is assessing active listings...</p>`;

        const scoredProducts = (await Promise.all(activeProducts.map(analyzeShelfLife))).sort((a, b) => b.riskScore - a.riskScore);
        if (renderToken !== diagnosticsRenderToken) return;
        scoredDiagnosticsProducts = scoredProducts;
        const selectedId = diagnosticsListingSelect?.value;
        const selectedProduct = scoredProducts.find(item => item.id === selectedId);
        const highestRisk = selectedProduct || scoredProducts[0];
        const data = highestRisk.data;
        const imageSrc = highestRisk.imageSrc || getProductImage(data);
        const severityClasses = {
            CRITICAL: "text-[10px] bg-red-500/20 text-red-400 font-mono px-1.5 rounded border border-red-500/30",
            URGENT: "text-[10px] bg-amber-500/20 text-amber-300 font-mono px-1.5 rounded border border-amber-500/30",
            WATCH: "text-[10px] bg-yellow-500/20 text-yellow-300 font-mono px-1.5 rounded border border-yellow-500/30",
            STABLE: "text-[10px] bg-green-500/20 text-green-300 font-mono px-1.5 rounded border border-green-500/30"
        };

        if (diagnosticsProductName) diagnosticsProductName.textContent = data.name || "Produce Cargo";
        if (diagnosticsSeverity) {
            diagnosticsSeverity.textContent = highestRisk.severity;
            diagnosticsSeverity.className = severityClasses[highestRisk.severity];
        }
        if (diagnosticsBatchId) diagnosticsBatchId.textContent = `#FR-${highestRisk.id.substring(0, 6).toUpperCase()}`;
        if (diagnosticsRiskBar) diagnosticsRiskBar.style.width = `${Math.max(8, highestRisk.riskScore)}%`;
        if (diagnosticsShelfLife) {
            diagnosticsShelfLife.textContent = highestRisk.estimatedShelfLife;
            diagnosticsShelfLife.className = `text-xl font-bold mt-1 ${highestRisk.severity === "CRITICAL" ? "text-red-400" : highestRisk.severity === "URGENT" ? "text-amber-300" : "text-green-300"}`;
        }
        if (diagnosticsRoutingMode) {
            const icon = highestRisk.severity === "CRITICAL" ? "fa-bolt-lightning animate-bounce" : highestRisk.severity === "URGENT" ? "fa-route" : "fa-shield-halved";
            diagnosticsRoutingMode.innerHTML = `<i class="fa-solid ${icon} text-xs"></i> ${escapeHTML(highestRisk.routeMode)}`;
        }
        if (diagnosticsSummary) {
            diagnosticsSummary.textContent = `${highestRisk.insight} ${highestRisk.recommendation || ""}`;
        }
        if (diagnosticsImageFrame) {
            diagnosticsImageFrame.innerHTML = `
                <div class="absolute top-0 left-0 w-full h-0.5 bg-red-500 opacity-80 shadow-[0_0_8px_#ef4444] animate-[bounce_2s_infinite]"></div>
                <img src="${escapeAttr(imageSrc)}" alt="${escapeAttr(data.name || "Produce")}" class="w-full h-full object-cover">
            `;
        }
        if (diagnosticsPulse) {
            const pulseClasses = {
                CRITICAL: ["bg-red-400", "bg-red-500"],
                URGENT: ["bg-amber-400", "bg-amber-500"],
                WATCH: ["bg-yellow-400", "bg-yellow-500"],
                STABLE: ["bg-green-400", "bg-green-500"]
            }[highestRisk.severity] || ["bg-green-400", "bg-green-500"];
            diagnosticsPulse.innerHTML = `
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full ${pulseClasses[0]} opacity-75"></span>
                <span class="relative inline-flex rounded-full h-3 w-3 ${pulseClasses[1]}"></span>
            `;
        }
        renderPriorityQueue(scoredProducts);
        const failedCount = scoredProducts.filter(item => item.analysisError).length;
        setModelStatus(failedCount ? `Gemini unavailable (${failedCount})` : "Gemini analysis complete", failedCount ? "red" : "emerald");
    }

    diagnosticsListingSelect?.addEventListener("change", () => {
        const selected = scoredDiagnosticsProducts.find(item => item.id === diagnosticsListingSelect.value);
        if (!selected) return;
        const severityClasses = {
            CRITICAL: "text-[10px] bg-red-500/20 text-red-400 font-mono px-1.5 rounded border border-red-500/30",
            URGENT: "text-[10px] bg-amber-500/20 text-amber-300 font-mono px-1.5 rounded border border-amber-500/30",
            WATCH: "text-[10px] bg-yellow-500/20 text-yellow-300 font-mono px-1.5 rounded border border-yellow-500/30",
            STABLE: "text-[10px] bg-green-500/20 text-green-300 font-mono px-1.5 rounded border border-green-500/30"
        };
        if (diagnosticsProductName) diagnosticsProductName.textContent = selected.data.name || "Produce Cargo";
        if (diagnosticsSeverity) {
            diagnosticsSeverity.textContent = selected.severity;
            diagnosticsSeverity.className = severityClasses[selected.severity];
        }
        if (diagnosticsBatchId) diagnosticsBatchId.textContent = `#FR-${selected.id.substring(0, 6).toUpperCase()}`;
        if (diagnosticsRiskBar) diagnosticsRiskBar.style.width = `${Math.max(8, selected.riskScore)}%`;
        if (diagnosticsShelfLife) {
            diagnosticsShelfLife.textContent = selected.estimatedShelfLife;
            diagnosticsShelfLife.className = `text-xl font-bold mt-1 ${selected.severity === "CRITICAL" ? "text-red-400" : selected.severity === "URGENT" ? "text-amber-300" : "text-green-300"}`;
        }
        const icon = selected.severity === "CRITICAL" ? "fa-bolt-lightning animate-bounce" : selected.severity === "URGENT" ? "fa-route" : "fa-shield-halved";
        if (diagnosticsRoutingMode) diagnosticsRoutingMode.innerHTML = `<i class="fa-solid ${icon} text-xs"></i> ${escapeHTML(selected.routeMode)}`;
        if (diagnosticsSummary) diagnosticsSummary.textContent = `${selected.insight} ${selected.recommendation || ""}`;
        if (diagnosticsImageFrame) diagnosticsImageFrame.innerHTML = `<img src="${escapeAttr(selected.imageSrc)}" alt="${escapeAttr(selected.data.name || "Produce")}" class="w-full h-full object-cover">`;
    });

    function refreshDiagnosticsListingOptions() {
        if (!diagnosticsListingSelect) return;
        const current = diagnosticsListingSelect.value;
        const active = cachedDiagnosticsProducts.filter(item => (item.data.status || "Searching") !== "Delivered");
        diagnosticsListingSelect.innerHTML = active.length
            ? `<option value="">Select a listing</option>${active.map(item => `<option value="${escapeAttr(item.id)}">${escapeHTML(item.data.name || "Produce")} · ${escapeHTML(item.data.status || "Searching")}</option>`).join("")}`
            : `<option value="">No active listings found</option>`;
        if (active.some(item => item.id === current)) diagnosticsListingSelect.value = current;
    }

    runDiagnosticsBtn?.addEventListener("click", async () => {
        const product = cachedDiagnosticsProducts.find(item => item.id === diagnosticsListingSelect?.value);
        if (!product) {
            if (diagnosticsSummary) diagnosticsSummary.textContent = "Choose one of your active listings before running the detector.";
            diagnosticsListingSelect?.focus();
            return;
        }
        runDiagnosticsBtn.disabled = true;
        runDiagnosticsBtn.classList.add("opacity-60", "cursor-wait");
        runDiagnosticsBtn.textContent = "Analyzing…";
        setModelStatus("Gemini analyzing", "amber");
        if (diagnosticsSummary) diagnosticsSummary.textContent = "Sending all listing details and its photo to Gemini for reassessment…";
        try {
            const imageSrc = getUploadedProductImage(product.data);
            const listing = {
                name: product.data.name || "Produce",
                category: product.data.category || "",
                harvestDate: product.data.harvestDate ? new Date(dateToMillis(product.data.harvestDate)).toISOString().slice(0, 10) : null,
                description: product.data.description || "",
                status: product.data.status || "Searching",
                quantity: product.data.quantity ?? null,
                unit: product.data.unit || "",
                location: product.data.location || "",
                routeFrom: product.data.routeFrom || "",
                routeTo: product.data.routeTo || ""
            };
            const cacheKey = JSON.stringify([product.id, listing, imageSrc]);
            geminiDiagnosticsCache.delete(cacheKey);
            const updated = await analyzeShelfLife(product);
            scoredDiagnosticsProducts = scoredDiagnosticsProducts.map(item => item.id === product.id ? updated : item)
                .sort((a, b) => b.riskScore - a.riskScore);
            const selected = scoredDiagnosticsProducts.find(item => item.id === product.id);
            diagnosticsProductName.textContent = selected.data.name || "Produce";
            diagnosticsSeverity.textContent = selected.severity;
            diagnosticsBatchId.textContent = `#FR-${product.id.substring(0, 6).toUpperCase()}`;
            diagnosticsRiskBar.style.width = `${Math.max(8, selected.riskScore)}%`;
            diagnosticsShelfLife.textContent = selected.estimatedShelfLife;
            diagnosticsRoutingMode.textContent = selected.routeMode;
            diagnosticsSummary.textContent = `${selected.insight} ${selected.recommendation || ""}`;
            renderPriorityQueue(scoredDiagnosticsProducts);
            setModelStatus(selected.analysisError ? "Scan failed" : "Gemini analysis complete", selected.analysisError ? "red" : "emerald");
        } catch (error) {
            console.error("Shelf-life Gemini scan failed:", error);
            if (diagnosticsSummary) diagnosticsSummary.textContent = "We could not analyze this listing right now. Please try again.";
            setModelStatus("Scan failed", "red");
        } finally {
            runDiagnosticsBtn.disabled = false;
            runDiagnosticsBtn.classList.remove("opacity-60", "cursor-wait");
            runDiagnosticsBtn.textContent = "Analyze selected listing";
        }
    });

    onAuthStateChanged(auth, async (user) => {
        if (!user) {
            window.location.href = LOGIN_PAGE_URL;
            return;
        }

        nameEl.innerText = user.displayName || "FarmRoute User";
        roleEl.innerText = "Farmer"; 
        hideLoading();
        listenForMessageNotifications(user.uid);

        try {
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (userDocSnap.exists()) {
                const userData = userDocSnap.data();
                if (userData.name) nameEl.innerText = userData.name;
                if (userData.role) roleEl.innerText = userData.role;
                updateHeaderAvatar(userData.profilePictureUrl);
            }
        } catch (err) {
            console.error("Firestore profile fetch failed:", err);
        }

        // --- REALTIME TARGETED COUNT LISTENERS ---
        const productsRef = collection(db, "products");

        const allFarmerProductsQuery = query(
            productsRef, 
            where("farmerId", "==", user.uid)
        );

        // --- Snapshot Streams ---

        onSnapshot(allFarmerProductsQuery, (snapshot) => {
            let activeCount = 0;
            const diagnosticsProducts = [];
            farmerProducts = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                diagnosticsProducts.push({ id: doc.id, data });
                farmerProducts.push({ id: doc.id, data });
                if (data.status !== "Delivered") {
                    activeCount++;
                }
            });
            if (listingsEl) listingsEl.innerText = activeCount;
            cachedDiagnosticsProducts = diagnosticsProducts;
        const dashboardMonths = [...new Set(farmerProducts
                .map(({ data }) => deliveryDateMillis(data))
                .filter((millis) => millis !== null)
                .map((millis) => new Date(millis).toISOString().slice(0, 7)))].sort().reverse();
            const previousSelection = dashboardMonthFilter?.value;
            if (dashboardMonthFilter) {
                dashboardMonthFilter.innerHTML = `<option value="all">All time</option>${dashboardMonths.map((month) => `<option value="${month}">${new Date(`${month}-02T00:00:00`).toLocaleDateString([], { month: "long", year: "numeric" })}</option>`).join("")}`;
                if (previousSelection === "all" || dashboardMonths.includes(previousSelection)) dashboardMonthFilter.value = previousSelection;
            }
            if (dashboardMonths.length && (!dashboardMonthFilter?.value || dashboardMonthFilter.value === "all")) {
                dashboardMonthFilter.value = previousSelection === "all" ? "all" : dashboardMonths[0];
            }
            updateDashboardMetrics();
            renderRecentDeliveries();
            refreshDiagnosticsListingOptions();
            renderShelfLifeDiagnostics(cachedDiagnosticsProducts);
        }, (err) => console.error("All products query failed:", err));

        // The month filter updates all four metric cards from the complete snapshot.

        // Delivery counts and history are rendered from the complete farmer snapshot above.


        // --- DYNAMIC RECENT SHIPPED/LISTED ITEMS STREAM ---
        const recentQuery = query(
            productsRef,
            where("farmerId", "==", user.uid),
            limit(4)
        );

        onSnapshot(recentQuery, (snapshot) => {
            renderRecentDeliveries();
            return;
            if (!recentContainer) return;
            recentContainer.innerHTML = "";

            if (snapshot.empty) {
                recentContainer.innerHTML = `<p class="text-gray-500 py-6 text-center">No shipments or listings recorded yet.</p>`;
                return;
            }

            snapshot.forEach((docSnap) => {
                const data = docSnap.data();
                
                const productName = data.name || "Unnamed Crop";
                const weight = data.weight || "0";
                const unit = data.unit || "kg";
                const routeFrom = data.routeFrom || data.location || "Unknown";
                const routeTo = data.routeTo || "Marketplace";
                const price = data.price ? Number(data.price).toLocaleString() : "0";
                const currentStatus = data.status || "Searching";

                let badgeClass = "bg-purple-100 text-purple-700";
                if (currentStatus === "Delivered") badgeClass = "bg-green-100 text-green-700";
                if (currentStatus === "In Transit") badgeClass = "bg-blue-100 text-blue-700";
                if (currentStatus === "Searching") badgeClass = "bg-amber-100 text-amber-700";

                const imageSrc = getProductImage(data);

                // CHANGED: Converted parent container from raw Flexbox to standard 4-column Grid structure
                const itemHtml = `
                    <div class="grid grid-cols-4 items-center gap-4 py-5 border-b last:border-0 px-2">
                        <div class="flex items-center gap-4 min-w-0">
                            <img src="${imageSrc}" class="w-16 h-16 rounded-xl object-cover border shrink-0">
                            <div class="min-w-0">
                                <h3 class="font-semibold text-base text-gray-800 truncate">${productName}</h3>
                                <p class="text-gray-500 text-sm">${weight} ${unit}</p>
                            </div>
                        </div>
                        <div class="min-w-0">
                            <h4 class="font-medium text-gray-800 truncate">${routeFrom} → ${routeTo}</h4>
                            <p class="text-gray-400 text-xs">Managed Entry Route</p>
                        </div>
                        <div class="min-w-0">
                            <h4 class="font-semibold text-lg text-gray-900">₦${price}</h4>
                            <p class="text-gray-400 text-xs">Total value evaluated</p>
                        </div>
                        <div class="text-right">
                            <span class="${badgeClass} px-4 py-1.5 rounded-lg text-xs font-semibold inline-block text-center min-w-[100px]">
                                ${currentStatus}
                            </span>
                        </div>
                    </div>
                `;
                recentContainer.insertAdjacentHTML("beforeend", itemHtml);
            });
        }, (err) => {
            console.error("Recent items list listener failed:", err);
        });

    });

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
