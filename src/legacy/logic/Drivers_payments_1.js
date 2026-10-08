import { auth, db } from "../../../backend/firebaseConfig.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { collection, doc, getDoc, onSnapshot, query, where, addDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

export function initialize() {
const LOGIN_PAGE_URL = "../login.html";
    const loadingScreen = document.getElementById("loading-screen");
    const listEl = document.getElementById("payments-list");
    const searchEl = document.getElementById("payment-search");
    const statusFilter = document.getElementById("status-filter");
    const nameEl = document.getElementById("user-display-name");
    const roleEl = document.getElementById("user-display-role");
    const avatarEl = document.getElementById("user-avatar");
    const drawer = document.getElementById("payment-drawer");
    const drawerContent = document.getElementById("drawer-content");
    const drawerTitle = document.getElementById("drawer-title");
    const drawerRef = document.getElementById("drawer-ref");

    const metrics = {
        paid: document.getElementById("metric-total-paid"),
        escrow: document.getElementById("metric-pending-escrow"),
        awaiting: document.getElementById("metric-awaiting-release"),
        count: document.getElementById("metric-transaction-count"),
        availableBalance: document.getElementById("metric-available-balance"),
        totalWithdrawn: document.getElementById("metric-total-withdrawn")
    };

    const withdrawalElements = {
        modal: document.getElementById("withdrawal-modal"),
        amountInput: document.getElementById("withdrawal-amount"),
        pinInput: document.getElementById("withdrawal-pin"),
        pinError: document.getElementById("withdrawal-pin-error"),
        noPinSection: document.getElementById("withdrawal-no-pin"),
        availableBalanceEl: document.getElementById("withdraw-available-balance"),
        submitBtn: document.getElementById("withdrawal-submit-btn"),
        cancelBtn: document.getElementById("withdrawal-cancel-btn"),
        closeBtn: document.getElementById("withdrawal-close"),
        allBtn: document.getElementById("withdraw-all-btn"),
        halfBtn: document.getElementById("withdraw-half-btn"),
        setPinFromWithdrawal: document.getElementById("set-pin-from-withdrawal"),
        withdrawBtn: document.getElementById("withdraw-btn")
    };

    const setPinElements = {
        modal: document.getElementById("set-pin-modal"),
        newPinInputs: document.querySelectorAll("#new-pin-input-wrapper input"),
        confirmPinInputs: document.querySelectorAll("#confirm-pin-input-wrapper input"),
        error: document.getElementById("set-pin-error"),
        submitBtn: document.getElementById("set-pin-submit-btn"),
        cancelBtn: document.getElementById("set-pin-cancel-btn"),
        closeBtn: document.getElementById("set-pin-close")
    };

    const changePinElements = {
        modal: document.getElementById("change-pin-modal"),
        currentPinInputs: document.querySelectorAll("#current-pin-input-wrapper input"),
        newPinInputs: document.querySelectorAll("#change-new-pin-input-wrapper input"),
        confirmPinInputs: document.querySelectorAll("#change-confirm-pin-input-wrapper input"),
        currentError: document.getElementById("change-pin-current-error"),
        error: document.getElementById("change-pin-error"),
        submitBtn: document.getElementById("change-pin-submit-btn"),
        cancelBtn: document.getElementById("change-pin-cancel-btn"),
        closeBtn: document.getElementById("change-pin-close")
    };

    const paymentRecords = new Map();
    const tripRecords = new Map();
    const farmerCache = new Map();
    let currentRows = [];
    let userWithdrawalPin = null;
    let userTotalWithdrawn = 0;
    let userAvailableBalance = 0;
    let userData = null;

    function hideLoading() {
        loadingScreen?.classList.add("hidden");
    }

    function escapeHTML(text) {
        const div = document.createElement("div");
        div.textContent = text ?? "";
        return div.innerHTML;
    }

    function money(value) {
        return `NGN ${Number(value || 0).toLocaleString()}`;
    }

    function dateToMillis(value) {
        if (!value) return 0;
        if (typeof value.toDate === "function") return value.toDate().getTime();
        if (value.seconds) return value.seconds * 1000;
        const parsed = new Date(value).getTime();
        return Number.isNaN(parsed) ? 0 : parsed;
    }

    function readableDate(value) {
        const millis = dateToMillis(value);
        if (!millis) return "Not recorded";
        return new Date(millis).toLocaleString([], { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
    }

    function normalizeStatus(rawStatus = "") {
        const status = String(rawStatus || "").toLowerCase();
        // Delivery alone means the farmer still needs to authorize the escrow release.
        if (["paid", "released", "complete", "completed"].some(item => status.includes(item))) return "paid";
        if (status.includes("escrow")) return "escrow";
        if (status.includes("delivered") || status.includes("awaiting")) return "awaiting";
        if (status.includes("matched") || status.includes("transit") || status.includes("searching")) return "transit";
        if (status.includes("cancel")) return "cancelled";
        return "transit";
    }

    function statusMeta(status) {
        const map = {
            paid: { label: "Paid", className: "bg-emerald-50 text-emerald-700 border-emerald-100", icon: "fa-circle-check" },
            escrow: { label: "Pending Escrow", className: "bg-amber-50 text-amber-700 border-amber-200", icon: "fa-lock" },
            awaiting: { label: "Awaiting Release", className: "bg-blue-50 text-blue-700 border-blue-100", icon: "fa-shield-halved" },
            transit: { label: "In Progress", className: "bg-gray-50 text-gray-700 border-gray-200", icon: "fa-truck-fast" },
            cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-100", icon: "fa-ban" }
        };
        return map[status] || map.transit;
    }

    async function getFarmerName(farmerId) {
        if (!farmerId) return "FarmRoute Farmer";
        if (farmerCache.has(farmerId)) return farmerCache.get(farmerId);

        try {
            const userSnap = await getDoc(doc(db, "users", farmerId));
            const data = userSnap.exists() ? userSnap.data() : {};
            const name = data.name || data.fullName || data.displayName || "FarmRoute Farmer";
            farmerCache.set(farmerId, name);
            return name;
        } catch (err) {
            console.error("Farmer lookup failed:", err);
            return "FarmRoute Farmer";
        }
    }

    function buildLedgerRow(id, data) {
        const status = data.isEscrowReleased
            ? "paid"
            : normalizeStatus(data.paymentStatus || data.status);
        return {
            id: `payment-${id}`,
            sourceId: id,
            source: "Payment Ledger",
            reference: data.reference || data.paymentGatewayRef || id.slice(0, 8).toUpperCase(),
            title: data.productName || data.cropName || data.name || "Driver payout",
            routeFrom: data.routeFrom || data.pickupPoint || "Pickup",
            routeTo: data.routeTo || data.dropoffPoint || "Delivery",
            amount: Number(data.amount || data.price || data.totalValue || 0),
            status,
            farmerName: data.farmerName || "FarmRoute Farmer",
            createdAt: data.createdAt || data.updatedAt || data.paidAt,
            rawStatus: data.status || data.paymentStatus || "escrow",
            notes: data.notes || "Payment ledger record"
        };
    }

    async function buildTripRow(id, data) {
        const status = normalizeStatus(data.isEscrowReleased ? "paid" : data.status);
        const farmerName = await getFarmerName(data.farmerId || data.userId);
        return {
            id: `trip-${id}`,
            sourceId: id,
            source: "Trip Record",
            reference: data.paymentGatewayRef || `FR-${id.slice(0, 7).toUpperCase()}`,
            title: data.name || data.productName || "Produce Load",
            routeFrom: data.routeFrom || data.location || data.pickupPoint || "Pickup",
            routeTo: data.routeTo || data.destination || data.dropoffPoint || "Delivery",
            amount: Number(data.totalValue || data.price || 0),
            status,
            farmerName,
            createdAt: data.fundsCapturedAt || data.updatedAt || data.createdAt,
            rawStatus: data.status || "Matched",
            quantity: `${data.quantity || data.weight || 0} ${data.unit || "kg"}`,
            notes: data.isEscrowReleased ? "Escrow released by farmer" : "Trip payment derived from accepted load"
        };
    }

    function mergeRows() {
        const rowsByTripOrPayment = new Map();
        paymentRecords.forEach((row) => rowsByTripOrPayment.set(row.sourceId, row));
        tripRecords.forEach((row) => {
            if (!rowsByTripOrPayment.has(row.sourceId)) rowsByTripOrPayment.set(row.sourceId, row);
        });
        currentRows = Array.from(rowsByTripOrPayment.values())
            .sort((a, b) => dateToMillis(b.createdAt) - dateToMillis(a.createdAt));
        render();
    }

    function updateMetrics(rows) {
        const paidTotal = rows.filter(row => row.status === "paid").reduce((sum, row) => sum + row.amount, 0);
        const escrowTotal = rows.filter(row => row.status === "escrow").reduce((sum, row) => sum + row.amount, 0);
        const awaitingCount = rows.filter(row => row.status === "awaiting").length;
        metrics.paid.textContent = money(paidTotal);
        metrics.escrow.textContent = money(escrowTotal);
        metrics.awaiting.textContent = awaitingCount;
        metrics.count.textContent = rows.length;

        userAvailableBalance = paidTotal - userTotalWithdrawn;
        metrics.availableBalance.textContent = money(Math.max(0, userAvailableBalance));
        metrics.totalWithdrawn.textContent = money(userTotalWithdrawn);
        withdrawalElements.availableBalanceEl.textContent = money(Math.max(0, userAvailableBalance));
        
        const canWithdraw = userAvailableBalance >= 100 && userWithdrawalPin;
        withdrawalElements.withdrawBtn.disabled = !canWithdraw;
        withdrawalElements.withdrawBtn.classList.toggle("opacity-50", !canWithdraw);
        withdrawalElements.withdrawBtn.classList.toggle("cursor-not-allowed", !canWithdraw);
        
        // Update button tooltip/text to show why disabled
        if (!canWithdraw) {
            if (!userWithdrawalPin) {
                withdrawalElements.withdrawBtn.title = "Set a withdrawal PIN in Profile > Security to enable withdrawals";
                withdrawalElements.withdrawBtn.innerHTML = `<i class="fa-solid fa-arrow-down-to-bracket"></i><span>Set PIN First</span>`;
            } else if (userAvailableBalance < 100) {
                withdrawalElements.withdrawBtn.title = `Available balance (${money(userAvailableBalance)}) is below minimum NGN 100`;
                withdrawalElements.withdrawBtn.innerHTML = `<i class="fa-solid fa-arrow-down-to-bracket"></i><span>Balance Too Low</span>`;
            }
        } else {
            withdrawalElements.withdrawBtn.title = "";
            withdrawalElements.withdrawBtn.innerHTML = `<i class="fa-solid fa-arrow-down-to-bracket"></i><span>Withdraw</span>`;
        }
        
        if (userWithdrawalPin) {
            withdrawalElements.noPinSection.classList.add("hidden");
            withdrawalElements.pinInput.parentElement.classList.remove("hidden");
        } else {
            withdrawalElements.noPinSection.classList.remove("hidden");
            withdrawalElements.pinInput.parentElement.classList.add("hidden");
        }
    }

    function filteredRows() {
        const term = searchEl.value.trim().toLowerCase();
        const status = statusFilter.value;
        return currentRows.filter(row => {
            const text = [row.title, row.routeFrom, row.routeTo, row.farmerName, row.reference, row.rawStatus, row.source].join(" ").toLowerCase();
            const termOk = !term || text.includes(term);
            const statusOk = status === "all" || row.status === status;
            return termOk && statusOk;
        });
    }

    function render() {
        updateMetrics(currentRows);
        const rows = filteredRows();
        if (rows.length === 0) {
            listEl.innerHTML = `
                <div class="text-center py-12 text-gray-500">
                    <i class="fa-regular fa-folder-open text-3xl text-gray-300 mb-2"></i>
                    <p class="text-sm">No matching payment records found.</p>
                </div>
            `;
            return;
        }

        listEl.innerHTML = rows.map(row => {
            const meta = statusMeta(row.status);
            return `
                <button data-payment-id="${escapeHTML(row.id)}" class="w-full text-left p-4 sm:p-5 hover:bg-gray-50 transition">
                    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div class="flex items-start gap-4 min-w-0">
                            <span class="w-11 h-11 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
                                <i class="fa-solid ${meta.icon}"></i>
                            </span>
                            <div class="min-w-0">
                                <div class="flex flex-wrap items-center gap-2">
                                    <h3 class="font-bold text-gray-900 truncate">${escapeHTML(row.title)}</h3>
                                    <span class="${meta.className} border text-[11px] font-bold px-2.5 py-1 rounded-full">${meta.label}</span>
                                </div>
                                <p class="text-sm text-gray-500 mt-1 truncate">${escapeHTML(row.routeFrom)} -> ${escapeHTML(row.routeTo)}</p>
                                <p class="text-xs text-gray-400 mt-1">Farmer: ${escapeHTML(row.farmerName)} · ${escapeHTML(row.source)} · ${escapeHTML(readableDate(row.createdAt))}</p>
                            </div>
                        </div>
                        <div class="lg:text-right shrink-0">
                            <p class="font-black text-xl text-gray-900">${money(row.amount)}</p>
                            <p class="text-xs text-gray-400 mt-1">${escapeHTML(row.reference)}</p>
                        </div>
                    </div>
                </button>
            `;
        }).join("");
    }

    function openDrawer(row) {
        const meta = statusMeta(row.status);
        drawerTitle.textContent = row.title;
        drawerRef.textContent = row.reference;
        drawerContent.innerHTML = `
            <div class="rounded-2xl bg-green-950 text-white p-5">
                <p class="text-xs text-green-100 uppercase tracking-wider">Transaction Amount</p>
                <h2 class="text-3xl font-black mt-1">${money(row.amount)}</h2>
                <span class="inline-flex mt-4 ${meta.className} border text-xs font-bold px-3 py-1 rounded-full">${meta.label}</span>
            </div>
            <div class="grid grid-cols-2 gap-3 text-sm">
                <div class="bg-gray-50 border rounded-xl p-3">
                    <p class="text-xs text-gray-400 font-bold uppercase">From</p>
                    <p class="font-semibold text-gray-900 mt-1">${escapeHTML(row.routeFrom)}</p>
                </div>
                <div class="bg-gray-50 border rounded-xl p-3">
                    <p class="text-xs text-gray-400 font-bold uppercase">To</p>
                    <p class="font-semibold text-gray-900 mt-1">${escapeHTML(row.routeTo)}</p>
                </div>
            </div>
            <div class="space-y-3 text-sm">
                <div class="flex justify-between gap-4 border-b pb-3">
                    <span class="text-gray-500">Farmer</span>
                    <span class="font-semibold text-gray-900 text-right">${escapeHTML(row.farmerName)}</span>
                </div>
                <div class="flex justify-between gap-4 border-b pb-3">
                    <span class="text-gray-500">Raw status</span>
                    <span class="font-semibold text-gray-900 text-right">${escapeHTML(row.rawStatus)}</span>
                </div>
                <div class="flex justify-between gap-4 border-b pb-3">
                    <span class="text-gray-500">Date</span>
                    <span class="font-semibold text-gray-900 text-right">${escapeHTML(readableDate(row.createdAt))}</span>
                </div>
                <div class="flex justify-between gap-4">
                    <span class="text-gray-500">Source</span>
                    <span class="font-semibold text-gray-900 text-right">${escapeHTML(row.source)}</span>
                </div>
            </div>
            <div class="bg-gray-50 border rounded-xl p-4 text-sm text-gray-600">${escapeHTML(row.notes)}</div>
        `;
        drawer.classList.remove("hidden");
    }

    function closeDrawer() {
        drawer.classList.add("hidden");
    }

    // WITHDRAWAL FUNCTIONS
    function openWithdrawalModal() {
        if (!userWithdrawalPin) {
            withdrawalElements.noPinSection.classList.remove("hidden");
            withdrawalElements.pinInput.parentElement.classList.add("hidden");
        } else {
            withdrawalElements.noPinSection.classList.add("hidden");
            withdrawalElements.pinInput.parentElement.classList.remove("hidden");
        }
        withdrawalElements.amountInput.value = "";
        withdrawalElements.pinInput.value = "";
        withdrawalElements.pinError.classList.add("hidden");
        withdrawalElements.submitBtn.disabled = true;
        withdrawalElements.modal.classList.remove("hidden");
        setTimeout(() => withdrawalElements.amountInput.focus(), 100);
    }

    function closeWithdrawalModal() {
        withdrawalElements.modal.classList.add("hidden");
        withdrawalElements.amountInput.value = "";
        withdrawalElements.pinInput.value = "";
        withdrawalElements.pinError.classList.add("hidden");
    }

    function validateWithdrawalForm() {
        const amount = Number(withdrawalElements.amountInput.value) || 0;
        const pin = withdrawalElements.pinInput.value;
        const isValid = amount >= 100 && amount <= userAvailableBalance && pin.length === 6 && userWithdrawalPin;
        withdrawalElements.submitBtn.disabled = !isValid;
    }

    async function processWithdrawal() {
        const amount = Number(withdrawalElements.amountInput.value) || 0;
        const pin = withdrawalElements.pinInput.value;

        if (pin !== userWithdrawalPin) {
            withdrawalElements.pinError.classList.remove("hidden");
            withdrawalElements.pinInput.value = "";
            withdrawalElements.pinInput.focus();
            return;
        }

        if (amount < 100 || amount > userAvailableBalance) {
            showModalAlert("error", "Invalid Amount", `Withdrawal amount must be between NGN 100 and NGN ${userAvailableBalance.toLocaleString()}.`);
            return;
        }

        const originalText = withdrawalElements.submitBtn.innerHTML;
        withdrawalElements.submitBtn.disabled = true;
        withdrawalElements.submitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin mr-2"></i> Processing...`;

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            const withdrawalRef = await addDoc(collection(db, "withdrawals"), {
                driverId: user.uid,
                amount: amount,
                status: "processing",
                bankDetails: {
                    bankName: userData?.bankDetails?.bankName || "",
                    accountName: userData?.bankDetails?.accountName || "",
                    accountNumber: userData?.bankDetails?.accountNumber || ""
                },
                createdAt: new Date(),
                processedAt: null
            });

            await setDoc(doc(db, "users", user.uid), {
                totalWithdrawn: (userTotalWithdrawn || 0) + amount,
                lastWithdrawalAt: new Date()
            }, { merge: true });

            closeWithdrawalModal();
            showModalAlert("success", "Withdrawal Requested", `Your withdrawal of ${money(amount)} has been submitted for processing. Funds will be transferred to your bank account within 24 hours.`);
        } catch (err) {
            console.error("Withdrawal failed:", err);
            showModalAlert("error", "Withdrawal Failed", "We could not process your withdrawal. Please check your details and try again.");
        } finally {
            withdrawalElements.submitBtn.disabled = false;
            withdrawalElements.submitBtn.innerHTML = originalText;
        }
    }

    // SET PIN FUNCTIONS
    function openSetPinModal() {
        clearPinInputs(setPinElements.newPinInputs);
        clearPinInputs(setPinElements.confirmPinInputs);
        setPinElements.error.classList.add("hidden");
        setPinElements.submitBtn.disabled = true;
        setPinElements.modal.classList.remove("hidden");
        setTimeout(() => setPinElements.newPinInputs[0].focus(), 100);
    }

    function closeSetPinModal() {
        setPinElements.modal.classList.add("hidden");
        clearPinInputs(setPinElements.newPinInputs);
        clearPinInputs(setPinElements.confirmPinInputs);
        setPinElements.error.classList.add("hidden");
    }

    function clearPinInputs(inputs) {
        inputs.forEach(input => input.value = "");
        inputs.forEach(input => input.classList.remove("border-red-500", "focus:ring-red-600"));
    }

    function setupPinInputNavigation(inputs) {
        inputs.forEach((input, index) => {
            input.addEventListener("input", (e) => {
                if (e.target.value.length >= 1 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
                validatePinForms();
            });
            input.addEventListener("keydown", (e) => {
                if (e.key === "Backspace" && e.target.value.length === 0 && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
    }

    function getPinFromInputs(inputs) {
        return Array.from(inputs).map(input => input.value).join("");
    }

    function validatePinForms() {
        const newPin = getPinFromInputs(setPinElements.newPinInputs);
        const confirmPin = getPinFromInputs(setPinElements.confirmPinInputs);
        const isValid = newPin.length === 6 && newPin === confirmPin;
        setPinElements.submitBtn.disabled = !isValid;
        setPinElements.error.classList.toggle("hidden", newPin === confirmPin || confirmPin.length < 6);
    }

    async function processSetPin() {
        const newPin = getPinFromInputs(setPinElements.newPinInputs);
        const confirmPin = getPinFromInputs(setPinElements.confirmPinInputs);

        if (newPin !== confirmPin) {
            setPinElements.error.classList.remove("hidden");
            return;
        }

        const originalText = setPinElements.submitBtn.innerHTML;
        setPinElements.submitBtn.disabled = true;
        setPinElements.submitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin mr-2"></i> Setting PIN...`;

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            await setDoc(doc(db, "users", user.uid), {
                withdrawalPin: newPin
            }, { merge: true });

            userWithdrawalPin = newPin;
            closeSetPinModal();
            closeWithdrawalModal();
            showModalAlert("success", "PIN Set Successfully", "Your withdrawal PIN has been set. You can now withdraw funds.");
        } catch (err) {
            console.error("Set PIN failed:", err);
            showModalAlert("error", "Failed to Set PIN", "We could not set your PIN. Please check your details and try again.");
        } finally {
            setPinElements.submitBtn.disabled = false;
            setPinElements.submitBtn.innerHTML = originalText;
        }
    }

    // CHANGE PIN FUNCTIONS
    function openChangePinModal() {
        clearPinInputs(changePinElements.currentPinInputs);
        clearPinInputs(changePinElements.newPinInputs);
        clearPinInputs(changePinElements.confirmPinInputs);
        changePinElements.currentError.classList.add("hidden");
        changePinElements.error.classList.add("hidden");
        changePinElements.submitBtn.disabled = true;
        changePinElements.modal.classList.remove("hidden");
        setTimeout(() => changePinElements.currentPinInputs[0].focus(), 100);
    }

    function closeChangePinModal() {
        changePinElements.modal.classList.add("hidden");
        clearPinInputs(changePinElements.currentPinInputs);
        clearPinInputs(changePinElements.newPinInputs);
        clearPinInputs(changePinElements.confirmPinInputs);
        changePinElements.currentError.classList.add("hidden");
        changePinElements.error.classList.add("hidden");
    }

    function validateChangePinForms() {
        const currentPin = getPinFromInputs(changePinElements.currentPinInputs);
        const newPin = getPinFromInputs(changePinElements.newPinInputs);
        const confirmPin = getPinFromInputs(changePinElements.confirmPinInputs);
        const isValid = currentPin.length === 6 && newPin.length === 6 && newPin === confirmPin;
        changePinElements.submitBtn.disabled = !isValid;
        changePinElements.error.classList.toggle("hidden", newPin === confirmPin || confirmPin.length < 6);
    }

    async function processChangePin() {
        const currentPin = getPinFromInputs(changePinElements.currentPinInputs);
        const newPin = getPinFromInputs(changePinElements.newPinInputs);
        const confirmPin = getPinFromInputs(changePinElements.confirmPinInputs);

        if (currentPin !== userWithdrawalPin) {
            changePinElements.currentError.classList.remove("hidden");
            clearPinInputs(changePinElements.currentPinInputs);
            changePinElements.currentPinInputs[0].focus();
            return;
        }

        if (newPin !== confirmPin) {
            changePinElements.error.classList.remove("hidden");
            return;
        }

        const originalText = changePinElements.submitBtn.innerHTML;
        changePinElements.submitBtn.disabled = true;
        changePinElements.submitBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin mr-2"></i> Changing PIN...`;

        try {
            const user = auth.currentUser;
            if (!user) throw new Error("User not authenticated");

            await setDoc(doc(db, "users", user.uid), {
                withdrawalPin: newPin
            }, { merge: true });

            userWithdrawalPin = newPin;
            closeChangePinModal();
            showModalAlert("success", "PIN Changed Successfully", "Your withdrawal PIN has been updated.");
        } catch (err) {
            console.error("Change PIN failed:", err);
            showModalAlert("error", "Failed to Change PIN", "We could not update your PIN. Please check your current PIN and try again.");
        } finally {
            changePinElements.submitBtn.disabled = false;
            changePinElements.submitBtn.innerHTML = originalText;
        }
    }

    function showModalAlert(type, title, message) {
        const modal = document.createElement("div");
        modal.className = "fixed inset-0 z-[80] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm";
        modal.innerHTML = `
            <div class="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl">
                <div class="w-14 h-14 rounded-full ${type === "error" ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"} mx-auto mb-4 flex items-center justify-center text-xl">
                    <i class="fa-solid ${type === "error" ? "fa-circle-xmark" : "fa-circle-check"}"></i>
                </div>
                <h3 class="text-lg font-bold text-gray-900 mb-2">${title}</h3>
                <p class="text-gray-500 text-sm mb-6 leading-relaxed">${message}</p>
                <button class="w-full py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-semibold text-sm">Dismiss</button>
            </div>`;
        modal.querySelector("button").addEventListener("click", () => modal.remove());
        document.body.appendChild(modal);
    }

    listEl.addEventListener("click", (event) => {
        const button = event.target.closest("[data-payment-id]");
        if (!button) return;
        const row = currentRows.find(item => item.id === button.dataset.paymentId);
        if (row) openDrawer(row);
    });

    searchEl.addEventListener("input", render);
    statusFilter.addEventListener("change", render);
    document.getElementById("drawer-close")?.addEventListener("click", closeDrawer);
    document.getElementById("drawer-overlay")?.addEventListener("click", closeDrawer);

    function updateHeaderAvatar(profilePictureUrl) {
        if (!avatarEl || !profilePictureUrl) return;
        avatarEl.src = profilePictureUrl;
        avatarEl.classList.remove("hidden");
    }

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

        nameEl.textContent = user.displayName || "FarmRoute Driver";
        roleEl.textContent = "Driver";
        updateHeaderAvatar(user.photoURL);
        hideLoading();
        listenForMessageNotifications(user.uid);

        try {
            const userSnap = await getDoc(doc(db, "users", user.uid));
            if (userSnap.exists()) {
                userData = userSnap.data();
                nameEl.textContent = userData.name || userData.fullName || user.displayName || "FarmRoute Driver";
                roleEl.textContent = userData.role || "Driver";
                updateHeaderAvatar(userData.profilePictureUrl || userData.photoURL);

                userWithdrawalPin = userData.withdrawalPin || null;
                userTotalWithdrawn = Number(userData.totalWithdrawn || 0);

                // Update withdrawal button state immediately after loading user data
                updateMetrics(currentRows);
            }
        } catch (err) {
            console.error("Driver profile lookup failed:", err);
        }

        const ledgerQuery = query(collection(db, "payments"), where("driverId", "==", user.uid));
        onSnapshot(ledgerQuery, (snapshot) => {
            paymentRecords.clear();
            snapshot.forEach((paymentDoc) => {
                paymentRecords.set(paymentDoc.id, buildLedgerRow(paymentDoc.id, paymentDoc.data()));
            });
            mergeRows();
        }, (err) => {
            console.error("Payment ledger listener failed:", err);
            mergeRows();
        });

        const tripsQuery = query(collection(db, "products"), where("driverId", "==", user.uid));
        onSnapshot(tripsQuery, async (snapshot) => {
            tripRecords.clear();
            const rows = await Promise.all(snapshot.docs.map(tripDoc => buildTripRow(tripDoc.id, tripDoc.data())));
            rows.forEach(row => tripRecords.set(row.sourceId, row));
            mergeRows();
        }, (err) => {
            console.error("Driver trips payment fallback listener failed:", err);
            mergeRows();
        });
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

    // WITHDRAWAL EVENT LISTENERS
    withdrawalElements.withdrawBtn?.addEventListener("click", openWithdrawalModal);
    withdrawalElements.closeBtn?.addEventListener("click", closeWithdrawalModal);
    withdrawalElements.cancelBtn?.addEventListener("click", closeWithdrawalModal);
    withdrawalElements.amountInput?.addEventListener("input", validateWithdrawalForm);
    withdrawalElements.pinInput?.addEventListener("input", validateWithdrawalForm);
    withdrawalElements.submitBtn?.addEventListener("click", processWithdrawal);
    withdrawalElements.allBtn?.addEventListener("click", () => {
        withdrawalElements.amountInput.value = Math.max(0, userAvailableBalance);
        validateWithdrawalForm();
    });
    withdrawalElements.halfBtn?.addEventListener("click", () => {
        withdrawalElements.amountInput.value = Math.floor(Math.max(0, userAvailableBalance) / 2 / 100) * 100;
        validateWithdrawalForm();
    });
    withdrawalElements.setPinFromWithdrawal?.addEventListener("click", () => {
        closeWithdrawalModal();
        openSetPinModal();
    });

    // SET PIN EVENT LISTENERS
    setupPinInputNavigation(setPinElements.newPinInputs);
    setupPinInputNavigation(setPinElements.confirmPinInputs);
    setPinElements.closeBtn?.addEventListener("click", closeSetPinModal);
    setPinElements.cancelBtn?.addEventListener("click", closeSetPinModal);
    setPinElements.submitBtn?.addEventListener("click", processSetPin);

    // CHANGE PIN EVENT LISTENERS
    setupPinInputNavigation(changePinElements.currentPinInputs);
    setupPinInputNavigation(changePinElements.newPinInputs);
    setupPinInputNavigation(changePinElements.confirmPinInputs);
    changePinElements.closeBtn?.addEventListener("click", closeChangePinModal);
    changePinElements.cancelBtn?.addEventListener("click", closeChangePinModal);
    changePinElements.submitBtn?.addEventListener("click", processChangePin);

    // Close modals on overlay click
    withdrawalElements.modal?.addEventListener("click", (e) => {
        if (e.target === withdrawalElements.modal) closeWithdrawalModal();
    });
    setPinElements.modal?.addEventListener("click", (e) => {
        if (e.target === setPinElements.modal) closeSetPinModal();
    });
    changePinElements.modal?.addEventListener("click", (e) => {
        if (e.target === changePinElements.modal) closeChangePinModal();
    });
  return {};
}
