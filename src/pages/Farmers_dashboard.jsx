import React from "react";
import OnboardingTour from "../components/OnboardingTour.jsx";
import { Link } from "../Router.jsx";
import { usePageLogic } from "../usePageLogic.js";
import { initialize as inline_1 } from "../legacy/logic/Farmers_dashboard_1.js";
import { initialize as inline_2 } from "../legacy/logic/Farmers_dashboard_2.js";
import { initialize as inline_3 } from "../legacy/logic/Farmers_dashboard_3.js";
import { initialize as external_Farmers_dashboard_4 } from "../legacy/logic/Farmers_dashboard_external_4.js";

const title = "FarmRoute Dashboard";
const bodyClass = "bg-gray-100";
const logicOrder = [["inline", "inline_1", ""], ["inline", "inline_2", ""], ["inline", "inline_3", ""], ["external-module", "external_Farmers_dashboard_4", ""]];
const initializers = {"inline_1": inline_1, "inline_2": inline_2, "inline_3": inline_3, "external_Farmers_dashboard_4": external_Farmers_dashboard_4};

export default function FarmersDashboardPage() {
  const handleClick = usePageLogic({ title, logicOrder, initializers });
  return <div className={bodyClass} onClick={handleClick}>

<div id="loading-screen" className="fixed inset-0 bg-white z-50 flex items-center justify-center font-semibold text-gray-600">
    <div className="text-center">
        <i className="fa-solid fa-circle-notch fa-spin text-3xl text-green-700 mb-2"></i>
        <p>Verifying session security details...</p>
    </div>
</div>

<div className="flex h-screen">
    <aside id="side-bar" className="md:w-64 w-full bg-green-950 text-white flex flex-col h-screen shrink-0 z-50 fixed inset-y-0 left-0 max-md:hidden">

            <div className="px-6 py-2 items-center justify-between flex border-b border-green-900">
                <img className="h-16" src="../assets/logo3.png" alt="FarmRoute Logo" />

                <button id="closeside-btn" className="md:hidden text-2xl text-gray-300 hover:text-white p-2">
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            <nav className="flex-1 mt-6 overflow-y-auto">

                <Link to="/Farmers/dashboard.html" className="flex items-center gap-3 bg-green-700 mx-4 px-4 py-3 rounded-lg mb-2">
                    <i className="fa-solid fa-house"></i>
                    Dashboard
                </Link>

                <Link to="/Farmers/listings.html" className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg hover:bg-green-800 mb-2">
                    <i className="fa-solid fa-box-open"></i>
                    My Listings
                </Link>

                <Link to="/Farmers/messages.html" className="flex items-center justify-between px-4 py-3 mx-4 rounded-lg hover:bg-green-800 mb-2">
                    <div className="flex items-center gap-3">
                        <i className="fa-regular fa-message"></i>
                        Messages
                    </div>

                    <span id="message-notification-badge" className="bg-green-500 text-xs px-2 py-1 rounded-full hidden">0</span>
                </Link>
                <Link to="/Farmers/payment.html" className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg hover:bg-green-800 mb-2">
                    <i className="fa-solid fa-wallet"></i>
                    Payments
                </Link>
                <Link to="/Farmers/profile.html" className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg hover:bg-green-800 mb-2">
                    <i className="fa-regular fa-user"></i>
                    Profile
                </Link>

                <div className="px-4 mb-4">
                    <Link to="/Farmers/add_produce.html" className="flex items-center gap-2 w-full  hover:bg-green-800  font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-sm text-sm">
                        <i className="fa-solid fa-plus text-base"></i>
                        List New Produce
                    </Link>
                </div>

            </nav>

            <div className="p-4 border-t border-green-900">
                <button id="logout-btn" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-800 text-left text-gray-300 hover:text-white transition">
                    <i className="fa-solid fa-right-from-bracket"></i>
                    Logout
                </button>
            </div>

    </aside>
    <main className="flex-1 h-screen overflow-y-auto md:ml-64 md:w-[calc(100%-16rem)]">

        <header className="bg-white h-20 px-4 sm:px-8 flex items-center justify-between border-b sticky top-0 z-30">

            <div className="flex items-center gap-4 min-w-0">
                <button id="side-btn" className="text-2xl md:hidden">
                    <i className="fa-solid fa-bars"></i>
                </button>
                <div className="hidden sm:block">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Farmer Workspace</p>
                    <h1 className="text-lg font-bold text-gray-900">Dashboard</h1>
                </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">

                <OnboardingTour role="farmer" />

                <button className="relative text-xl">
                    <i className="fa-regular fa-message"></i>

                    <span id="header-message-notification-badge" className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-5 h-5 px-1 rounded-full hidden items-center justify-center">0</span>
                </button>

                <button className="text-xl" data-legacy-click={"window.location.href='notifications.html'"} aria-label="Notifications">
                    <i className="fa-regular fa-bell"></i>
                </button>

                <div className="flex items-center gap-3 min-w-0">

                    <img id="user-avatar" alt="Profile picture" className="w-10 h-10 rounded-full object-cover hidden" />

                    <div>
                        <h4 id="user-display-name" className="font-semibold">
                            Loading...
                        </h4>
                        <p id="user-display-role" className="text-sm text-gray-500 capitalize">
                            ...
                        </p>
                    </div>

                    <i className="fa-solid fa-chevron-down text-sm text-gray-500"></i>

                </div>

            </div>

        </header>

        <section className="p-8">

            <div className="flex justify-between items-center mb-8">

                <h2 className="text-3xl font-bold">
                    Dashboard Overview
                </h2>

                <label className="sr-only" htmlFor="dashboard-month-filter">View deliveries by month</label>
                <select id="dashboard-month-filter" aria-label="View deliveries by month" className="border rounded-lg px-4 py-2 bg-white">
                    <option value="">Loading delivery months…</option>
                </select>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

                <div className="bg-white rounded-2xl border p-6 shadow-sm">
                    <h3 className="text-gray-700 font-medium mb-6">Completed Deliveries</h3>
                    <div className="flex items-center justify-between">
                        <h2 id="metric-completed" className="text-5xl font-bold">0</h2>
                        <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                            <i className="fa-solid fa-circle-check text-green-600 text-2xl"></i>
                        </div>
                    </div>
                    <Link to="/Farmers/listings.html" className="text-green-700 mt-6 block font-medium">View completed</Link>
                </div>

                <div className="bg-white rounded-2xl border p-6 shadow-sm">
                    <h3 className="text-gray-700 font-medium mb-6">Active Shipments</h3>
                    <div className="flex items-center justify-between">
                        <h2 id="metric-active" className="text-5xl font-bold">0</h2>
                        <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
                            <i className="fa-solid fa-truck text-blue-600 text-2xl"></i>
                        </div>
                    </div>
                    <Link to="/Farmers/listings.html" className="text-green-700 mt-6 block font-medium">View all shipments</Link>
                </div>

                <div className="bg-white rounded-2xl border p-6 shadow-sm">
                    <h3 className="text-gray-700 font-medium mb-6">Pending Matches</h3>
                    <div className="flex items-center justify-between">
                        <h2 id="metric-pending" className="text-5xl font-bold">0</h2>
                        <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center">
                            <i className="fa-solid fa-clock text-amber-600 text-2xl"></i>
                        </div>
                    </div>
                    <Link to="/Farmers/listings.html" className="text-green-700 mt-6 block font-medium">View pending</Link>
                </div>

                <div className="bg-white rounded-2xl border p-6 shadow-sm">
                    <h3 className="text-gray-700 font-medium mb-6">Active Listings</h3>
                    <div className="flex items-center justify-between">
                        <h2 id="metric-listings" className="text-5xl font-bold">0</h2>
                        <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center">
                            <i className="fa-solid fa-box text-purple-600 text-2xl"></i>
                        </div>
                    </div>
                    <Link to="/Farmers/listings.html" className="text-green-700 mt-6 block font-medium">View listings</Link>
                </div>

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                <div className="xl:col-span-2 bg-white rounded-2xl border p-6">

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">
                            Recent Deliveries
                        </h2>
                    </div>

                    <div className="grid grid-cols-4 gap-4 px-2 pb-3 text-xs font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100">
                        <div>Item Details</div>
                        <div>Route Segment</div>
                        <div>Evaluated Value</div>
                        <div className="text-right">Status</div>
                    </div>

                    <div id="recent-shipments-container" className="divide-y divide-gray-100">
                        <p className="text-gray-500 py-6 text-center">Loading recent activity updates...</p>
                    </div>

                    <div className="text-center mt-8">
                        <Link to="/Farmers/listings.html" className="inline-block border-2 border-green-600 text-green-600 px-8 py-3 rounded-xl hover:bg-green-600 hover:text-white transition font-medium">
                            View all shipments
                        </Link>
                    </div>

                </div>

                <div className="space-y-6">
                    <div id="shelf-life-card" className="bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-950 rounded-2xl border border-emerald-800 p-6 text-white shadow-xl relative overflow-hidden group">
                        
                        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(34,197,94,0)_95%,rgba(34,197,94,0.15)_98%,rgba(34,197,94,0)_100%)] bg-[length:100%_24px] animate-[pulse_3s_infinite]"></div>
                        
                        <div className="flex justify-between items-start relative z-10">
                            <div>
                                <span className="bg-green-500/20 text-green-400 text-xs font-mono px-2.5 py-1 rounded-full border border-green-500/30 uppercase tracking-widest">
                                    <i className="fa-solid fa-camera mr-1 animate-pulse"></i> Gemini Photo Analysis
                                </span>
                                <h2 className="text-xl font-bold mt-3 tracking-tight">
                                    AI Shelf-Life Diagnostics
                                </h2>
                            </div>
                            <div id="diagnostics-pulse" className="flex h-3 w-3 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                            </div>
                        </div>

                        <div className="mt-6 bg-black/40 border border-green-900/60 rounded-xl p-4 flex items-center gap-4 relative">
                            <div id="diagnostics-image-frame" className="w-16 h-16 bg-red-950/50 border border-red-500/40 rounded-lg flex items-center justify-center text-3xl relative overflow-hidden shadow-inner shadow-red-500/10 shrink-0">
                                <div className="absolute top-0 left-0 w-full h-0.5 bg-red-500 opacity-80 shadow-[0_0_8px_#ef4444] animate-[bounce_2s_infinite]"></div>
                                🍅
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                    <h3 id="diagnostics-product-name" className="text-lg font-bold tracking-wide truncate">Scanning listings...</h3>
                                    <span id="diagnostics-severity" className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-1.5 rounded border border-amber-500/30">ANALYZING</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-0.5">Batch ID: <span id="diagnostics-batch-id" className="font-mono text-green-400">#FR-PENDING</span></p>
                                <div className="w-full bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
                                    <div id="diagnostics-risk-bar" className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-1.5 rounded-full transition-all duration-500" style={{width: "12%"}}></div>
                                </div>
                            </div>
                        </div>

                        <label htmlFor="diagnostics-listing-select" className="relative z-10 block mt-4 text-xs font-semibold text-gray-300">Choose a listing to inspect</label>
                        <select id="diagnostics-listing-select" className="relative z-10 mt-1 w-full rounded-lg bg-gray-900 border border-green-900 text-white text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
                            <option value="">Loading your listings…</option>
                        </select>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                <p className="text-xs text-gray-400">Estimated Shelf Life</p>
                                <p id="diagnostics-shelf-life" className="text-xl font-bold text-amber-300 mt-1">Analyzing</p>
                            </div>
                            <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                <p className="text-xs text-gray-400">Routing Mode</p>
                                <p id="diagnostics-routing-mode" className="text-sm font-bold text-amber-400 mt-1.5 flex items-center gap-1.5">
                                    <i className="fa-solid fa-circle-notch fa-spin text-xs"></i> Checking
                                </p>
                            </div>
                        </div>

                        <p id="diagnostics-summary" className="text-xs text-gray-400/90 mt-5 leading-relaxed bg-green-950/30 p-3 rounded-lg border border-green-900/30 italic">
                            Choose an active listing and run a Gemini assessment of its photo and listing details.
                        </p>

                        <div className="mt-4 relative z-10">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Priority queue</p>
                                <span id="diagnostics-model-status" className="text-[10px] text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-full">Gemini ready</span>
                            </div>
                            <div id="diagnostics-alert-list" className="space-y-2">
                                <p className="text-xs text-gray-500 border border-white/5 rounded-lg p-3 bg-white/5">Waiting for farmer listings...</p>
                            </div>
                        </div>

                        <Link to="/Farmers/listings.html" className="text-green-400 hover:text-green-300 font-semibold text-sm mt-5 inline-flex items-center gap-2 transition relative z-10 group-hover:translate-x-1 duration-200">
                            Review listings <i className="fa-solid fa-arrow-right text-xs"></i>
                        </Link>
                        <button id="run-diagnostics-btn" className="mt-3 relative z-10 text-xs font-semibold text-white/90 bg-white/10 hover:bg-white/15 border border-white/10 px-3 py-2 rounded-lg transition">
                            Analyze selected listing
                        </button>
                    </div>
                </div>

            </div>    
        </section>

    </main>

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
    
