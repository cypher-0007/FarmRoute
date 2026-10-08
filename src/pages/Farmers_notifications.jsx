import React from "react";
import { Link } from "../Router.jsx";
import { usePageLogic } from "../usePageLogic.js";
import { initialize as inline_1 } from "../legacy/logic/Farmers_notifications_1.js";
import { initialize as inline_2 } from "../legacy/logic/Farmers_notifications_2.js";
import { initialize as external_Farmers_notifications_3 } from "../legacy/logic/Farmers_notifications_external_3.js";

const title = "FarmRoute Notifications";
const bodyClass = "bg-gray-100";
const logicOrder = [["inline", "inline_1", ""], ["inline", "inline_2", ""], ["external-module", "external_Farmers_notifications_3", ""]];
const initializers = {"inline_1": inline_1, "inline_2": inline_2, "external_Farmers_notifications_3": external_Farmers_notifications_3};

export default function FarmersNotificationsPage() {
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

                <Link to="/Farmers/dashboard.html" className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg hover:bg-green-800 mb-2">
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
                <div className="hidden sm:block min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Farmer Workspace</p>
                    <h1 className="text-lg font-bold text-gray-900 truncate">Notifications</h1>
                </div>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">

                <button data-legacy-click={"window.location.href='messages.html'"} className="relative text-xl" aria-label="Messages">
                    <i className="fa-regular fa-message"></i>

                    <span id="header-message-notification-badge" className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-5 h-5 px-1 rounded-full hidden items-center justify-center">0</span>
                </button>

                <Link to="/Farmers/notifications.html" className="relative text-xl w-10 h-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center ring-1 ring-emerald-100" aria-label="Notifications" aria-current="page">
                    <i className="fa-regular fa-bell"></i>

                    <span id="header-notification-badge" className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-green-600 text-white text-[10px] font-bold flex items-center justify-center hidden">0</span>
                </Link>

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

        <section className="p-4 sm:p-8">

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">

                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Notifications
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Live updates on your listings, shipments and conversations.
                    </p>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">

                    <div className="flex items-center gap-1 bg-white border rounded-lg p-1" role="group" aria-label="Filter notifications">
                        <button type="button" data-filter="all" className="notification-filter px-3 sm:px-4 py-2 text-sm font-semibold rounded-md transition">
                            All
                        </button>
                        <button type="button" data-filter="unread" className="notification-filter px-3 sm:px-4 py-2 text-sm font-medium rounded-md transition">
                            Unread
                        </button>
                    </div>

                    <button type="button" id="mark-all-read-btn" className="px-4 py-2.5 bg-green-700 hover:bg-green-800 text-white rounded-lg text-sm font-semibold shadow-sm transition flex items-center gap-2">
                        <i className="fa-solid fa-check-double text-xs"></i>
                        Mark all read
                    </button>

                    <button type="button" id="clear-all-btn" className="w-11 h-11 flex items-center justify-center bg-white border text-gray-500 hover:text-red-600 hover:border-red-200 rounded-lg transition" title="Clear all notifications" aria-label="Clear all notifications">
                        <i className="fa-solid fa-trash-can text-sm"></i>
                    </button>

                </div>

            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

                <div className="xl:col-span-2 space-y-4">

                    <div id="notification-summary" className="grid grid-cols-1 sm:grid-cols-3 gap-4"></div>

                    <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

                        <div className="px-6 py-4 border-b flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                                    <i className="fa-regular fa-bell"></i>
                                </span>
                                <div className="min-w-0">
                                    <h3 id="notification-list-title" className="font-semibold text-gray-900 truncate">All notifications</h3>
                                    <p id="notification-list-subtitle" className="text-xs text-gray-400">Loading your latest updates...</p>
                                </div>
                            </div>
                            <span id="unread-pill" className="hidden shrink-0 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">0 new</span>
                        </div>

                        <div id="notification-list" className="divide-y divide-gray-100">
                            <p className="text-gray-400 py-14 text-center text-sm">
                                <i className="fa-solid fa-circle-notch fa-spin text-green-700 mb-2 block text-xl"></i>
                                Loading notifications...
                            </p>
                        </div>

                    </div>

                </div>

                <div className="space-y-6">

                    <div className="bg-white rounded-2xl border p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Delivery Channels</h3>
                        <p className="text-xs text-gray-400 mb-5">Choose how FarmRoute alerts you.</p>

                        <label className="flex items-start justify-between gap-4 py-3 border-b border-gray-100 cursor-pointer">
                            <span className="flex items-start gap-3">
                                <span className="p-2.5 bg-emerald-50 rounded-xl text-emerald-700 mt-0.5">
                                    <i className="fa-solid fa-bell text-lg"></i>
                                </span>
                                <span>
                                    <span className="block text-sm font-semibold text-gray-900">Push Notifications</span>
                                    <span className="block text-xs text-gray-400 mt-0.5">Shipment, payment and message alerts</span>
                                </span>
                            </span>
                            <input id="push-notifications" type="checkbox" className="w-5 h-5 accent-green-700 shrink-0 mt-1" defaultChecked />
                        </label>

                        <label className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 cursor-pointer">
                            <span className="text-sm font-semibold text-gray-900">Shipment updates</span>
                            <input type="checkbox" data-channel="shipments" className="w-5 h-5 accent-green-700" />
                        </label>

                        <label className="flex items-center justify-between gap-4 py-3 border-b border-gray-100 cursor-pointer">
                            <span className="text-sm font-semibold text-gray-900">New messages</span>
                            <input type="checkbox" data-channel="messages" className="w-5 h-5 accent-green-700" />
                        </label>

                        <label className="flex items-center justify-between gap-4 py-3 cursor-pointer">
                            <span className="text-sm font-semibold text-gray-900">Product advisories</span>
                            <input type="checkbox" data-channel="advisories" className="w-5 h-5 accent-green-700" />
                        </label>

                        <p id="channel-status" className="text-xs text-gray-400 mt-4 hidden" role="status"></p>
                    </div>

                    <div className="bg-gradient-to-br from-gray-950 via-emerald-950 to-gray-950 rounded-2xl border border-emerald-800 p-6 text-white shadow-xl">
                        <span className="bg-green-500/20 text-green-400 text-[10px] font-mono px-2.5 py-1 rounded-full border border-green-500/30 uppercase tracking-widest">
                            Stay in the loop
                        </span>
                        <h3 className="text-lg font-bold mt-3 tracking-tight">Listing health tips</h3>
                        <p className="text-xs text-emerald-100/70 leading-relaxed mt-2">
                            Fresh produce listed within 24 hours of harvest is matched with drivers almost twice as fast.
                        </p>
                        <Link to="/Farmers/add_produce.html" className="mt-5 inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition">
                            <i className="fa-solid fa-plus text-xs"></i>
                            List New Produce
                        </Link>
                    </div>

                </div>

            </div>

        </section>

    </main>

</div>





    
</div>;
}
    