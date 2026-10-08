import React from "react";
import { Link } from "../Router.jsx";
import { usePageLogic } from "../usePageLogic.js";
import { initialize as inline_1 } from "../legacy/logic/Drivers_payments_1.js";
import { initialize as external_Drivers_payments_2 } from "../legacy/logic/Drivers_payments_external_2.js";
import { initialize as inline_3 } from "../legacy/logic/Drivers_payments_3.js";
import { initialize as external_Drivers_payments_4 } from "../legacy/logic/Drivers_payments_external_4.js";

const title = "FarmRoute - Driver Payments";
const bodyClass = "bg-gray-50 text-gray-800";
const logicOrder = [["inline", "inline_1", ""], ["external-module", "external_Drivers_payments_2", ""], ["inline", "inline_3", ""], ["external-module", "external_Drivers_payments_4", ""]];
const initializers = {"inline_1": inline_1, "external_Drivers_payments_2": external_Drivers_payments_2, "inline_3": inline_3, "external_Drivers_payments_4": external_Drivers_payments_4};

export default function DriversPaymentsPage() {
  const handleClick = usePageLogic({ title, logicOrder, initializers });
  return <div className={bodyClass} onClick={handleClick}>

<div id="loading-screen" className="fixed inset-0 bg-white z-50 flex items-center justify-center font-semibold text-gray-600">
    <div className="text-center">
        <i className="fa-solid fa-circle-notch fa-spin text-3xl text-green-700 mb-2"></i>
        <p>Loading payment ledger...</p>
    </div>
</div>

<div className="flex h-screen overflow-hidden">
    <aside id="side-bar" className="md:w-64 w-full bg-green-950 text-white flex flex-col h-screen shrink-0 z-50 fixed inset-y-0 left-0 max-md:hidden">
        <div className="px-6 py-4 flex items-center justify-between border-b border-green-900/50">
            <div className="flex items-center gap-2">
                <img className="h-14 object-contain" src="../assets/logo3.png" alt="FarmRoute Logo" />
            </div>
            <button id="closeside-btn" className="md:hidden text-2xl text-gray-300 hover:text-white p-2">
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>

        <nav className="flex-1 mt-5 overflow-y-auto px-4 space-y-1">
            <Link to="/Drivers/dashboard.html" className="flex items-center gap-3 hover:bg-green-900/50 hover:text-white text-gray-300 px-4 py-3 rounded-xl font-medium transition">
                <i className="fa-solid fa-house text-lg w-6 text-center"></i> Dashboard
            </Link>
            <Link to="/Drivers/available_loads.html" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-green-900/50 hover:text-white transition">
                <i className="fa-solid fa-boxes-stacked text-lg w-6 text-center"></i> Available Loads
            </Link>
            <Link to="/Drivers/active_trips.html" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-green-900/50 hover:text-white transition">
                <i className="fa-solid fa-truck-fast text-lg w-6 text-center"></i> My Active Trips
            </Link>
            <Link to="/Drivers/messages.html" className="flex items-center justify-between px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-green-900/50 hover:text-white transition">
                <div className="flex items-center gap-3">
                    <i className="fa-regular fa-message text-lg w-6 text-center"></i> Messages
                </div>
                <span id="message-notification-badge" className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-bold hidden">0</span>
            </Link>
            <Link to="/Drivers/payments.html" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold bg-green-700 text-white transition">
                <i className="fa-solid fa-wallet text-lg w-6 text-center"></i> Payments
            </Link>
            <Link to="/Drivers/profile.html" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-green-900/50 hover:text-white transition">
                <i className="fa-regular fa-user text-lg w-6 text-center"></i> Profile
            </Link>
            <Link to="/Drivers/route_planner.html" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-green-900/50 hover:text-white transition">
                <i className="fa-solid fa-route text-lg w-6 text-center"></i> Route Profile
            </Link>

            <div className="pt-2">
                <button id="go-online-btn" className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-500 font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-sm text-sm">
                    <i className="fa-solid fa-circle text-xs"></i>
                    <span id="online-label">Go Online</span>
                </button>
            </div>
        </nav>

        <div className="p-4 border-t border-green-900/50">
            <button id="logout-btn" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-900/50 text-gray-300 hover:text-white font-medium transition text-left">
                <i className="fa-solid fa-right-from-bracket w-6 text-center"></i> Logout
            </button>
        </div>
    </aside>

    <main className="flex-1 min-w-0 flex flex-col overflow-hidden md:ml-64 md:w-[calc(100%-16rem)]">
        <header className="bg-white h-20 px-4 sm:px-8 flex items-center justify-between border-b shrink-0">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <button id="side-btn" className="text-xl text-gray-700 md:hidden p-2">
                    <i className="fa-solid fa-bars"></i>
                </button>
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Payments</h1>
                    <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Track escrow, completed payouts, and trip payment history.</p>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <img id="user-avatar" alt="Profile picture" className="w-10 h-10 rounded-full object-cover hidden" />
                <div className="hidden sm:block">
                    <h4 id="user-display-name" className="font-semibold text-sm leading-tight">Loading...</h4>
                    <p id="user-display-role" className="text-xs text-emerald-600 font-medium">Driver</p>
                </div>
            </div>
        </header>

        <section className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                    <div className="bg-white rounded-2xl border p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-500">Total Paid</p>
                            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center"><i className="fa-solid fa-sack-dollar"></i></span>
                        </div>
                        <h2 id="metric-total-paid" className="text-3xl font-black text-gray-900 mt-4">NGN 0</h2>
                    </div>
                    <div className="bg-white rounded-2xl border p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-500">Pending Escrow</p>
                            <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center"><i className="fa-solid fa-clock-rotate-left"></i></span>
                        </div>
                        <h2 id="metric-pending-escrow" className="text-3xl font-black text-gray-900 mt-4">NGN 0</h2>
                    </div>
                    <div className="bg-white rounded-2xl border p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-500">Awaiting Release</p>
                            <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center"><i className="fa-solid fa-shield-halved"></i></span>
                        </div>
                        <h2 id="metric-awaiting-release" className="text-3xl font-black text-gray-900 mt-4">0</h2>
                    </div>
                    <div className="bg-white rounded-2xl border p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-500">Transactions</p>
                            <span className="w-10 h-10 rounded-xl bg-gray-100 text-gray-700 flex items-center justify-center"><i className="fa-solid fa-receipt"></i></span>
                        </div>
                        <h2 id="metric-transaction-count" className="text-3xl font-black text-gray-900 mt-4">0</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4" id="withdrawal-metrics-section">
                    <div className="bg-white rounded-2xl border p-5 shadow-sm xl:col-span-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-500">Available Balance</p>
                            <span className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center"><i className="fa-solid fa-wallet"></i></span>
                        </div>
                        <h2 id="metric-available-balance" className="text-3xl font-black text-gray-900 mt-4">NGN 0</h2>
                    </div>
                    <div className="bg-white rounded-2xl border p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-semibold text-gray-500">Total Withdrawn</p>
                            <span className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center"><i className="fa-solid fa-money-bill-transfer"></i></span>
                        </div>
                        <h2 id="metric-total-withdrawn" className="text-3xl font-black text-gray-900 mt-4">NGN 0</h2>
                    </div>
                    <div className="bg-white rounded-2xl border p-5 shadow-sm flex items-center justify-center">
                        <button id="withdraw-btn" className="w-full sm:w-auto bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-xl transition flex items-center gap-2" disabled>
                            <i className="fa-solid fa-arrow-down-to-bracket"></i>
                            <span>Withdraw</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border p-4 shadow-sm flex flex-col lg:flex-row gap-3 lg:items-center justify-between">
                    <div className="relative flex-1">
                        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
                        <input id="payment-search" type="text" placeholder="Search crop, route, farmer, status, or reference..." className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700" />
                    </div>
                    <select id="status-filter" className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700">
                        <option value="all">All transactions</option>
                        <option value="paid">Paid</option>
                        <option value="escrow">Pending escrow</option>
                        <option value="awaiting">Awaiting release</option>
                        <option value="transit">In progress</option>
                    </select>
                </div>

                <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b flex items-center justify-between">
                        <div>
                            <h2 className="font-bold text-gray-900">Transaction History</h2>
                            <p className="text-xs text-gray-500 mt-0.5">Live records from accepted trips and payment ledger entries.</p>
                        </div>
                    </div>
                    <div id="payments-list" className="divide-y divide-gray-100">
                        <div className="text-center py-12 text-gray-500">
                            <i className="fa-solid fa-spinner fa-spin text-2xl text-emerald-600 mb-2"></i>
                            <p className="text-sm">Loading transactions...</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
</div>

<div id="payment-drawer" className="fixed inset-0 z-50 hidden">
    <div id="drawer-overlay" className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"></div>
    <aside className="absolute inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl border-l border-gray-100 flex flex-col">
        <div className="p-5 border-b flex items-center justify-between">
            <div>
                <p id="drawer-ref" className="text-xs font-bold text-emerald-700 uppercase tracking-wider">FR-000000</p>
                <h3 id="drawer-title" className="text-lg font-bold text-gray-900 mt-1">Transaction Details</h3>
            </div>
            <button id="drawer-close" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition">
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div id="drawer-content" className="flex-1 overflow-y-auto p-5 space-y-4"></div>
    </aside>
</div>


<div id="withdrawal-modal" className="fixed inset-0 z-[60] hidden flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative z-10 border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-lg font-bold text-gray-900">Withdraw Funds</h3>
                <p className="text-xs text-gray-500 mt-1">Available: <span id="withdraw-available-balance" className="font-semibold text-green-700">NGN 0</span></p>
            </div>
            <button id="withdrawal-close" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition">
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Withdrawal Amount</label>
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">NGN</span>
                    <input id="withdrawal-amount" type="number" min="100" step="100" placeholder="Enter amount" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-10 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700" />
                </div>
                <p className="text-xs text-gray-400 mt-1">Minimum withdrawal: NGN 100</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <button id="withdraw-all-btn" type="button" className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold text-sm transition">All</button>
                <button id="withdraw-half-btn" type="button" className="bg-gray-50 border border-gray-200 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl font-semibold text-sm transition">Half</button>
            </div>
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Withdrawal PIN</label>
                <div className="relative">
                    <input id="withdrawal-pin" type="password" maxLength="6" placeholder="6-digit PIN" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-4 text-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700 text-center tracking-widest" />
                </div>
                <p id="withdrawal-pin-error" className="text-xs font-semibold text-red-500 hidden mt-1">Incorrect PIN. Please try again.</p>
            </div>
            <div id="withdrawal-no-pin" className="bg-amber-50 border border-amber-200 rounded-xl p-3 hidden">
                <p className="text-xs text-amber-700 flex items-center gap-1">
                    <i className="fa-solid fa-triangle-exclamation"></i>
                    You haven't set a withdrawal PIN yet.
                </p>
                <button id="set-pin-from-withdrawal" className="mt-2 text-xs font-semibold text-amber-700 hover:underline">Set Withdrawal PIN</button>
            </div>
        </div>
        <div className="flex gap-3 pt-2">
            <button id="withdrawal-cancel-btn" className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-semibold text-sm transition">Cancel</button>
            <button id="withdrawal-submit-btn" className="flex-1 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold text-sm transition shadow-sm" disabled>
                <i className="fa-solid fa-arrow-down-to-bracket mr-2"></i> Withdraw
            </button>
        </div>
    </div>
</div>


<div id="set-pin-modal" className="fixed inset-0 z-[60] hidden flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative z-10 border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-lg font-bold text-gray-900">Set Withdrawal PIN</h3>
                <p className="text-xs text-gray-500 mt-1">Create a 6-digit PIN for secure withdrawals</p>
            </div>
            <button id="set-pin-close" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition">
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">New PIN</label>
                <div className="flex justify-center gap-2" id="new-pin-input-wrapper">
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                </div>
            </div>
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Confirm PIN</label>
                <div className="flex justify-center gap-2" id="confirm-pin-input-wrapper">
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                </div>
                <p id="set-pin-error" className="text-xs font-semibold text-red-500 hidden mt-1">PINs do not match. Please try again.</p>
            </div>
        </div>
        <div className="flex gap-3 pt-2">
            <button id="set-pin-cancel-btn" className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-semibold text-sm transition">Cancel</button>
            <button id="set-pin-submit-btn" className="flex-1 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold text-sm transition shadow-sm" disabled>
                <i className="fa-solid fa-lock mr-2"></i> Set PIN
            </button>
        </div>
    </div>
</div>


<div id="change-pin-modal" className="fixed inset-0 z-[60] hidden flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative z-10 border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-lg font-bold text-gray-900">Change Withdrawal PIN</h3>
                <p className="text-xs text-gray-500 mt-1">Enter your current PIN, then set a new one</p>
            </div>
            <button id="change-pin-close" className="w-9 h-9 rounded-full bg-gray-50 hover:bg-gray-100 text-gray-600 transition">
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
        <div className="space-y-4">
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Current PIN</label>
                <div className="flex justify-center gap-2" id="current-pin-input-wrapper">
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                </div>
                <p id="change-pin-current-error" className="text-xs font-semibold text-red-500 hidden mt-1">Incorrect current PIN.</p>
            </div>
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">New PIN</label>
                <div className="flex justify-center gap-2" id="change-new-pin-input-wrapper">
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                </div>
            </div>
            <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Confirm New PIN</label>
                <div className="flex justify-center gap-2" id="change-confirm-pin-input-wrapper">
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                    <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
                </div>
                <p id="change-pin-error" className="text-xs font-semibold text-red-500 hidden mt-1">New PINs do not match.</p>
            </div>
        </div>
        <div className="flex gap-3 pt-2">
            <button id="change-pin-cancel-btn" className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-semibold text-sm transition">Cancel</button>
            <button id="change-pin-submit-btn" className="flex-1 bg-green-700 hover:bg-green-800 text-white py-3 rounded-xl font-semibold text-sm transition shadow-sm" disabled>
                <i className="fa-solid fa-lock mr-2"></i> Change PIN
            </button>
        </div>
    </div>
</div>





<div id="ai-chat-widget" style={{position: "fixed", bottom: "20px", right: "20px", zIndex: "1000"}}>
  <button id="chat-toggle" style={{background: "#16a34a", color: "white", border: "none", borderRadius: "50%", width: "56px", height: "56px", fontSize: "24px", cursor: "pointer", boxShadow: "0 4px 12px rgba(22,163,74,0.4)"}} aria-label="Open chat assistant"><i className="fa-regular fa-comments"></i></button>

  <div id="chat-box" style={{display: "none", flexDirection: "column", width: "320px", height: "450px", background: "white", borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)", position: "absolute", bottom: "70px", right: "0", overflow: "hidden", border: "1px solid #e5e7eb"}}>
    <div style={{background: "#16a34a", color: "white", padding: "12px 16px", fontWeight: "600", fontSize: "14px", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
      <span>FarmRoute Assistant</span>
      <button id="chat-close" style={{background: "none", border: "none", color: "white", fontSize: "18px", cursor: "pointer", padding: "0", lineHeight: "1"}}>×</button>
    </div>
    <div id="chat-messages" style={{flex: "1", overflowY: "auto", padding: "12px", fontSize: "13px", display: "flex", flexDirection: "column", gap: "8px"}}></div>
    <div style={{display: "flex", borderTop: "1px solid #f1f1f1", background: "#fafafa", padding: "8px", gap: "8px"}}>
      <input id="chat-input" type="text" placeholder="Ask a question..." style={{flex: "1", border: "1px solid #e5e7eb", borderRadius: "20px", padding: "10px 14px", outline: "none", fontSize: "13px", background: "white"}} />
      <button id="chat-send" style={{background: "#16a34a", color: "white", border: "none", borderRadius: "20px", padding: "0 20px", cursor: "pointer", fontSize: "13px", fontWeight: "500"}}>Send</button>
    </div>
  </div>
</div>


    
</div>;
}
    