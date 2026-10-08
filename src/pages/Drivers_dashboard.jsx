import React from "react";
import OnboardingTour from "../components/OnboardingTour.jsx";
import { Link } from "../Router.jsx";
import { usePageLogic } from "../usePageLogic.js";
import { initialize as inline_1 } from "../legacy/logic/Drivers_dashboard_1.js";
import { initialize as inline_2 } from "../legacy/logic/Drivers_dashboard_2.js";
import { initialize as external_Drivers_dashboard_3 } from "../legacy/logic/Drivers_dashboard_external_3.js";
import { initialize as inline_4 } from "../legacy/logic/Drivers_dashboard_4.js";
import { initialize as external_Drivers_dashboard_5 } from "../legacy/logic/Drivers_dashboard_external_5.js";

const title = "FarmRoute Driver Dashboard";
const bodyClass = "bg-gray-100";
const logicOrder = [["inline", "inline_1", ""], ["inline", "inline_2", ""], ["external-module", "external_Drivers_dashboard_3", ""], ["inline", "inline_4", ""], ["external-module", "external_Drivers_dashboard_5", ""]];
const initializers = {"inline_1": inline_1, "inline_2": inline_2, "external_Drivers_dashboard_3": external_Drivers_dashboard_3, "inline_4": inline_4, "external_Drivers_dashboard_5": external_Drivers_dashboard_5};

export default function DriversDashboardPage() {
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

                <Link to="/Drivers/dashboard.html" className="flex items-center gap-3 bg-green-700 mx-4 px-4 py-3 rounded-lg mb-2">
                    <i className="fa-solid fa-house"></i>
                    Dashboard
                </Link>

                <Link to="/Drivers/available_loads.html" className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg hover:bg-green-800 mb-2">
                    <i className="fa-solid fa-boxes-stacked"></i>
                    Available Loads
                </Link>

                <Link to="/Drivers/active_trips.html" className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg hover:bg-green-800 mb-2">
                    <i className="fa-solid fa-truck-fast"></i>
                    My Active Trips
                </Link>

                <Link to="/Drivers/messages.html" className="flex items-center justify-between px-4 py-3 mx-4 rounded-lg hover:bg-green-800 mb-2">
                    <div className="flex items-center gap-3">
                        <i className="fa-regular fa-message"></i>
                        Messages
                    </div>

                    <span id="message-notification-badge" className="bg-green-500 text-xs px-2 py-1 rounded-full hidden">
                        0
                    </span>
                </Link>

                <Link to="/Drivers/payments.html" className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg hover:bg-green-800 mb-2">
                    <i className="fa-solid fa-wallet"></i>
                    Payments
                </Link>

                <Link to="/Drivers/profile.html" className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg hover:bg-green-800 mb-2">
                    <i className="fa-regular fa-user"></i>
                    Profile
                </Link>

                <Link to="/Drivers/route_planner.html" className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg hover:bg-green-800 mb-6">
                    <i className="fa-solid fa-route"></i>
                    Route Profile
                </Link>

                <div className="px-4 mb-4">
                    <button id="go-online-btn" className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-500 font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-sm text-sm">
                        <i className="fa-solid fa-circle text-xs" id="online-dot"></i>
                        <span id="online-label">Go Online</span>
                    </button>
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

        <header className="bg-white h-20 px-4 sm:px-8 flex items-center justify-between border-b">

            <div className="flex items-center gap-4">
                <button id="side-btn" className="text-2xl md:hidden text-gray-700 p-2">
                    <i className="fa-solid fa-bars"></i>
                </button>
                <div className="hidden sm:block">
                    <h1 className="text-xl font-bold text-gray-900">Driver Dashboard</h1>
                    <p className="text-xs text-gray-500">Live trips, nearby loads, and priority perishables.</p>
                </div>
            </div>

            <div className="ml-auto flex items-center gap-4 sm:gap-8">

                <OnboardingTour role="driver" />

                <button className="relative text-xl" data-legacy-click={"window.location.href='messages.html'"}>
                    <i className="fa-regular fa-message"></i>

                    <span id="header-message-notification-badge" className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center hidden">
                        0
                    </span>
                </button>

                <button className="text-xl" data-legacy-click={"window.location.href='notifications.html'"} aria-label="Notifications">
                    <i className="fa-regular fa-bell"></i>
                </button>

                <div className="flex items-center gap-3">

                    <img id="user-avatar" alt="Profile picture" className="w-10 h-10 rounded-full object-cover hidden" />

                    <div>
                        <h4 id="user-display-name" className="font-semibold">
                            Loading...
                        </h4>
                        <p id="user-display-role" className="text-sm text-gray-500 capitalize">
                            ...
                        </p>
                    </div>

                    <i className="fa-solid fa-chevron-down"></i>

                </div>

            </div>

        </header>

        <section className="p-8">

            <div className="flex justify-between items-center mb-8">

                <h2 className="text-3xl font-bold">
                    Dashboard Overview
                </h2>

                <label className="sr-only" htmlFor="driver-month-filter">View deliveries by month</label>
                <select id="driver-month-filter" aria-label="View deliveries by month" className="border rounded-lg px-4 py-2 bg-white">
                    <option value="">Loading delivery months…</option>
                </select>

            </div>

            <div className="bg-white rounded-2xl border p-5 sm:p-6 shadow-sm mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-route text-xl"></i>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Driver Matching Setup</p>
                        <h3 className="text-xl font-bold text-gray-900 mt-1">Set your capacity and usual routes</h3>
                        <p className="text-sm text-gray-500 mt-1 max-w-2xl">Complete your Route Profile so future AI matching can prioritize loads that fit your truck, preferred lanes, and cargo handling.</p>
                    </div>
                </div>
                <Link to="/Drivers/route_planner.html" className="inline-flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold px-5 py-3 rounded-xl transition shrink-0">
                    Open Route Profile <i className="fa-solid fa-arrow-right text-xs"></i>
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

                <div className="bg-white rounded-2xl border p-6 shadow-sm">
                    <h3 className="text-gray-700 font-medium mb-6">Active Trips</h3>
                    <div className="flex items-center justify-between">
                        <h2 id="metric-active-trips" className="text-5xl font-bold">0</h2>
                        <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                            <i className="fa-solid fa-truck-fast text-green-600 text-2xl"></i>
                        </div>
                    </div>
                    <Link to="/Drivers/active_trips.html" className="text-green-700 mt-6 block font-medium">View active trips</Link>
                </div>

                <div className="bg-white rounded-2xl border p-6 shadow-sm">
                    <h3 className="text-gray-700 font-medium mb-6">Available Loads Nearby</h3>
                    <div className="flex items-center justify-between">
                        <h2 id="metric-avail-loads" className="text-5xl font-bold">0</h2>
                        <div className="w-14 h-14 rounded-xl bg-yellow-100 flex items-center justify-center">
                            <i className="fa-solid fa-boxes-stacked text-yellow-500 text-2xl"></i>
                        </div>
                    </div>
                    <Link to="/Drivers/available_loads.html" className="text-green-700 mt-6 block font-medium">View load board</Link>
                </div>

                <div className="bg-white rounded-2xl border p-6 shadow-sm">
                    <h3 id="earnings-period-label" className="text-gray-700 font-medium mb-6">Earnings</h3>
                    <div className="flex items-center justify-between">
                        <h2 id="metric-monthly-earnings" className="text-4xl font-bold text-green-700">₦0</h2>
                        <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center">
                            <i className="fa-solid fa-sack-dollar text-green-600 text-2xl"></i>
                        </div>
                    </div>
                    <p id="metric-completed-count" className="text-gray-500 mt-6">Across 0 completed trips</p>
                </div>

                <div className="bg-white rounded-2xl border p-6 shadow-sm">
                    <h3 className="text-gray-700 font-medium mb-6">Pending Payments</h3>
                    <div className="flex items-center justify-between">
                        <h2 id="metric-pending-escrow" className="text-4xl font-bold text-amber-600">₦0</h2>
                        <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center">
                            <i className="fa-solid fa-clock-rotate-left text-amber-600 text-2xl"></i>
                        </div>
                    </div>
                    <p id="metric-escrow-count" className="text-gray-500 mt-6">0 payouts held in escrow</p>
                </div>

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                <div className="xl:col-span-2 bg-white rounded-2xl border p-6">

                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold">
                            Deliveries for Selected Month
                        </h2>
                    </div>

                    <div id="recent-trips-container" className="divide-y divide-gray-100">
                        <p className="text-gray-500 py-8 text-center text-sm">Loading recent trips...</p>
                    </div>

                    <div className="hidden">
                    <div className="flex items-center justify-between py-5 border-b">

                        <div className="flex items-center gap-4">

                            <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=200" className="w-16 h-16 rounded-xl object-cover" />

                            <div>
                                <h3 className="font-semibold text-lg">
                                    Tomatoes
                                </h3>

                                <p className="text-gray-500">
                                    50 Bags
                                </p>
                            </div>

                        </div>

                        <div>
                            <h4 className="font-medium">
                                Jos → Lagos
                            </h4>

                            <p className="text-gray-500">
                                Mile 12 Depot
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-xl">
                                ₦185,000
                            </h4>

                            <p className="text-gray-500">
                                total payout
                            </p>
                        </div>

                        <span className="bg-blue-100 text-blue-700 px-5 py-2 rounded-lg">
                            In Transit
                        </span>

                    </div>

                    <div className="flex items-center justify-between py-5 border-b">

                        <div className="flex items-center gap-4">

                            <img src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200" className="w-16 h-16 rounded-xl object-cover" />

                            <div>
                                <h3 className="font-semibold text-lg">
                                    Milled Rice
                                </h3>

                                <p className="text-gray-500">
                                    120 Bags
                                </p>
                            </div>

                        </div>

                        <div>
                            <h4 className="font-medium">
                                Kebbi → Lagos
                            </h4>

                            <p className="text-gray-500">
                                Mile 12 Grains Depot
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-xl">
                                ₦240,000
                            </h4>

                            <p className="text-gray-500">
                                total payout
                            </p>
                        </div>

                        <span className="bg-green-100 text-green-700 px-5 py-2 rounded-lg">
                            Delivered
                        </span>

                    </div>

                    <div className="flex items-center justify-between py-5 border-b">

                        <div className="flex items-center gap-4">

                            <img src="https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200" className="w-16 h-16 rounded-xl object-cover" />

                            <div>
                                <h3 className="font-semibold text-lg">
                                    Pepper
                                </h3>

                                <p className="text-gray-500">
                                    35 Bags
                                </p>
                            </div>

                        </div>

                        <div>
                            <h4 className="font-medium">
                                Zaria → Ibadan
                            </h4>

                            <p className="text-gray-500">
                                Bodija Perishables Bay
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-xl">
                                ₦142,000
                            </h4>

                            <p className="text-gray-500">
                                total payout
                            </p>
                        </div>

                        <span className="bg-yellow-100 text-yellow-700 px-5 py-2 rounded-lg">
                            Awaiting Pickup
                        </span>

                    </div>

                    <div className="flex items-center justify-between py-5">

                        <div className="flex items-center gap-4">

                            <img src="https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200" className="w-16 h-16 rounded-xl object-cover" />

                            <div>
                                <h3 className="font-semibold text-lg">
                                    Maize
                                </h3>

                                <p className="text-gray-500">
                                    60 Bags
                                </p>
                            </div>

                        </div>

                        <div>
                            <h4 className="font-medium">
                                Makurdi → Abuja
                            </h4>

                            <p className="text-gray-500">
                                Wuse Bulk Store
                            </p>
                        </div>

                        <div>
                            <h4 className="font-semibold text-xl">
                                ₦98,000
                            </h4>

                            <p className="text-gray-500">
                                total payout
                            </p>
                        </div>

                        <span className="bg-green-100 text-green-700 px-5 py-2 rounded-lg">
                            Delivered
                        </span>

                    </div>

                    </div>

                    <div className="text-center mt-8">

                        <Link to="/Drivers/active_trips.html" className="inline-block border-2 border-green-600 text-green-600 px-8 py-3 rounded-xl hover:bg-green-600 hover:text-white transition">
                            View all trips
                        </Link>

                    </div>

                </div>

                <div className="space-y-6">

                    <div className="bg-white rounded-2xl border p-6">

                        <h2 className="text-2xl font-semibold mb-6">
                            Loads Nearby
                        </h2>

                        <div id="nearby-loads-container" className="divide-y divide-gray-100">
                            <p className="text-gray-500 py-6 text-center text-sm">Loading recently listed loads...</p>
                        </div>

                        <div className="hidden">
                        <div className="pb-5 border-b">

                            <div className="flex justify-between items-center">

                                <div>

                                    <h3 className="font-semibold text-xl">
                                        Lagos
                                    </h3>

                                    <p className="text-gray-500 mt-1">
                                        High demand for Tomatoes
                                    </p>

                                </div>

                                <i className="fa-solid fa-arrow-up text-red-500 text-xl"></i>

                            </div>

                        </div>

                        <div className="py-5 border-b">

                            <div className="flex justify-between items-center">

                                <div>

                                    <h3 className="font-semibold text-xl">
                                        Abuja
                                    </h3>

                                    <p className="text-gray-500 mt-1">
                                        Medium demand for Rice
                                    </p>

                                </div>

                                <i className="fa-solid fa-arrow-right text-yellow-500 text-xl"></i>

                            </div>

                        </div>

                        <div className="py-5">

                            <div className="flex justify-between items-center">

                                <div>

                                    <h3 className="font-semibold text-xl">
                                        Ibadan
                                    </h3>

                                    <p className="text-gray-500 mt-1">
                                        High demand for Pepper
                                    </p>

                                </div>

                                <i className="fa-solid fa-arrow-up text-red-500 text-xl"></i>

                            </div>

                        </div>

                        </div>

                        <Link to="/Drivers/available_loads.html" className="text-green-700 font-medium mt-4 inline-block">
                            View load board
                        </Link>

                    </div>

                    <div className="bg-white rounded-2xl border p-6">

                        <h2 className="text-2xl font-semibold mb-6">
                            Priority Pickup
                        </h2>

                        <div id="priority-pickups-container" className="space-y-3">
                            <p className="text-gray-500 py-6 text-center text-sm">Scanning priority matches nearby...</p>
                        </div>

                        <div className="hidden">
                        <div className="flex items-center gap-4">

                            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center">
                                🍅
                            </div>

                            <div>

                                <h3 className="text-3xl font-semibold">
                                    Tomatoes
                                </h3>

                                <p className="text-red-600 text-xl font-bold mt-2">
                                    Priority: HIGH
                                </p>

                            </div>

                        </div>

                        <div className="mt-6">

                            <p className="text-gray-600">
                                Accept within
                            </p>

                            <h3 className="text-4xl text-red-600 font-bold mt-2">
                                24 Hours
                            </h3>

                            <p className="text-gray-500 mt-2 text-sm">
                                Full payout locked in only if picked up before the freshness window closes.
                            </p>

                        </div>

                        </div>

                        <Link to="/Drivers/available_loads.html" className="text-green-700 font-medium mt-6 inline-block">
                            View all priority loads
                        </Link>

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
    
