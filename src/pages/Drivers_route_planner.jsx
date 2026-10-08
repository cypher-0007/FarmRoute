import React from "react";
import { Link } from "../Router.jsx";
import { usePageLogic } from "../usePageLogic.js";
import { initialize as inline_1 } from "../legacy/logic/Drivers_route_planner_1.js";
import { initialize as external_Drivers_route_planner_2 } from "../legacy/logic/Drivers_route_planner_external_2.js";
import { initialize as inline_3 } from "../legacy/logic/Drivers_route_planner_3.js";
import { initialize as external_Drivers_route_planner_4 } from "../legacy/logic/Drivers_route_planner_external_4.js";

const title = "FarmRoute - Route Profile";
const bodyClass = "bg-gray-50 text-gray-800";
const logicOrder = [["inline", "inline_1", ""], ["external-module", "external_Drivers_route_planner_2", ""], ["inline", "inline_3", ""], ["external-module", "external_Drivers_route_planner_4", ""]];
const initializers = {"inline_1": inline_1, "external_Drivers_route_planner_2": external_Drivers_route_planner_2, "inline_3": inline_3, "external_Drivers_route_planner_4": external_Drivers_route_planner_4};

export default function DriversRoutePlannerPage() {
  const handleClick = usePageLogic({ title, logicOrder, initializers });
  return <div className={bodyClass} onClick={handleClick}><style>{"\n        body { font-family: 'Inter', sans-serif; }\n    "}</style>

<div id="loading-screen" className="fixed inset-y-0 left-0 right-0 md:left-64 bg-white z-40 flex items-center justify-center font-semibold text-gray-600">
    <div className="text-center">
        <i className="fa-solid fa-circle-notch fa-spin text-3xl text-green-700 mb-2"></i>
        <p>Loading route profile...</p>
    </div>
</div>

<div className="flex h-screen overflow-hidden">
    <aside id="side-bar" className="md:w-64 w-full bg-green-950 text-white flex flex-col h-screen shrink-0 z-50 fixed inset-y-0 left-0 max-md:hidden">
        <div className="px-6 py-2 items-center justify-between flex border-b border-green-900">
            <img className="h-16" src="../assets/logo3.png" alt="FarmRoute Logo" />
            <button id="closeside-btn" className="md:hidden text-2xl text-gray-300 hover:text-white p-2">
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>

        <nav className="flex-1 mt-6 overflow-y-auto">
            <Link to="/Drivers/dashboard.html" className="flex items-center gap-3 hover:bg-green-800 mx-4 px-4 py-3 rounded-lg mb-2 text-gray-300 hover:text-white">
                <i className="fa-solid fa-house"></i> Dashboard
            </Link>
            <Link to="/Drivers/available_loads.html" className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg hover:bg-green-800 text-gray-300 hover:text-white mb-2">
                <i className="fa-solid fa-box-open"></i> Available Loads
            </Link>
            <Link to="/Drivers/active_trips.html" className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg hover:bg-green-800 text-gray-300 hover:text-white mb-2">
                <i className="fa-solid fa-truck"></i> My Active Trips
            </Link>
            <Link to="/Drivers/messages.html" className="flex items-center justify-between px-4 py-3 mx-4 rounded-lg hover:bg-green-800 text-gray-300 hover:text-white mb-2">
                <div className="flex items-center gap-3">
                    <i className="fa-regular fa-message"></i> Messages
                </div>
                <span className="bg-green-500 text-xs px-2 py-1 rounded-full text-white">3</span>
            </Link>
            <Link to="/Drivers/payments.html" className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg hover:bg-green-800 text-gray-300 hover:text-white mb-2">
                <i className="fa-solid fa-wallet"></i> Payments
            </Link>
            <Link to="/Drivers/profile.html" className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg hover:bg-green-800 text-gray-300 hover:text-white mb-2">
                <i className="fa-regular fa-user"></i> Profile
            </Link>
            <Link to="/Drivers/route_planner.html" className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg bg-green-700 text-white mb-6">
                <i className="fa-solid fa-route"></i> Route Profile
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
                <i className="fa-solid fa-right-from-bracket"></i> Logout
            </button>
        </div>
    </aside>

    <div className="flex-1 flex flex-col min-w-0 overflow-hidden md:ml-64">
        <header className="bg-white h-20 px-4 sm:px-8 flex items-center justify-between border-b shrink-0">
            <div className="flex items-center gap-4 min-w-0">
                <button id="side-btn" className="text-xl text-gray-700 md:hidden p-2">
                    <i className="fa-solid fa-bars"></i>
                </button>
                <div className="min-w-0">
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">Route Profile</h1>
                    <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Set your truck capacity, usual lanes, and cargo preferences.</p>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <img id="user-avatar" alt="Profile picture" className="w-10 h-10 rounded-full object-cover hidden" />
                <div className="hidden sm:block">
                    <h4 id="user-display-name" className="font-semibold text-sm leading-tight">Loading...</h4>
                    <p className="text-xs text-emerald-600 font-medium">Logistics Driver</p>
                </div>
            </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                <section className="bg-white rounded-2xl border shadow-sm p-5 sm:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                        <div>
                            <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Driver Matching Inputs</p>
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">Help FarmRoute rank better orders for you</h2>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-gray-50 border rounded-xl px-4 py-3 text-center">
                                <p id="capacity-preview" className="text-lg font-bold text-gray-900">0 kg</p>
                                <p className="text-[11px] text-gray-500">Capacity</p>
                            </div>
                            <div className="bg-gray-50 border rounded-xl px-4 py-3 text-center">
                                <p id="routes-preview" className="text-lg font-bold text-gray-900">0</p>
                                <p className="text-[11px] text-gray-500">Routes</p>
                            </div>
                            <div className="bg-gray-50 border rounded-xl px-4 py-3 text-center">
                                <p id="match-preview" className="text-lg font-bold text-emerald-700">0%</p>
                                <p className="text-[11px] text-gray-500">Complete</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <form id="route-profile-form" className="xl:col-span-2 bg-white rounded-2xl border shadow-sm p-5 sm:p-6 space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Vehicle Details</h3>
                            <p className="text-sm text-gray-500 mt-1">These values can later be used to hide loads that are too heavy or unsuitable.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="block md:col-span-2">
                                <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Vehicle Name or Model</span>
                                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3">
                                    <div className="relative">
                                        <i className="fa-solid fa-magnifying-glass absolute left-4 top-3.5 text-gray-400 text-sm"></i>
                                        <input id="vehicle-model" list="vehicle-model-options" type="text" placeholder="e.g. Toyota Hilux, Suzuki Carry, Isuzu NQR" className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700" />
                                        <datalist id="vehicle-model-options"></datalist>
                                    </div>
                                    <button id="lookup-capacity-btn" type="button" className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-100 px-5 py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2">
                                        <i className="fa-solid fa-wand-magic-sparkles"></i> Estimate Capacity
                                    </button>
                                </div>
                                <p id="capacity-source" className="text-xs text-gray-500 mt-2">Type a common vehicle model and FarmRoute will suggest an estimated carrying limit. Drivers can still edit it.</p>
                            </label>
                            <label className="block">
                                <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Vehicle Type</span>
                                <select id="vehicle-type" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700">
                                    <option value="">Select vehicle type</option>
                                    <option>Motorcycle/Tricycle</option>
                                    <option>Mini Van</option>
                                    <option>Pickup Truck</option>
                                    <option>Medium Truck</option>
                                    <option>Heavy Duty Truck</option>
                                    <option>Refrigerated Truck</option>
                                </select>
                            </label>
                            <label className="block">
                                <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Maximum Capacity</span>
                                <div className="relative">
                                    <input id="capacity-kg" type="number" min="1" placeholder="e.g. 2500" className="w-full border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700" />
                                    <span className="absolute right-4 top-3.5 text-xs font-semibold text-gray-400">kg</span>
                                </div>
                            </label>
                            <label className="block">
                                <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Base Location</span>
                                <input id="base-location" type="text" placeholder="e.g. Ibadan, Oyo" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700" />
                            </label>
                            <label className="block">
                                <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Operating Radius</span>
                                <div className="relative">
                                    <input id="operating-radius" type="number" min="1" placeholder="e.g. 120" className="w-full border border-gray-200 rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700" />
                                    <span className="absolute right-4 top-3.5 text-xs font-semibold text-gray-400">km</span>
                                </div>
                            </label>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-bold text-gray-900">Usual Routes</h3>
                            <p className="text-sm text-gray-500 mt-1">Add regular pickup and delivery lanes. The AI can use these as route matching signals.</p>

                            <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-3 mt-4">
                                <input id="route-from" type="text" placeholder="From e.g. Ibadan" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700" />
                                <input id="route-to" type="text" placeholder="To e.g. Lagos" className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700" />
                                <button id="add-route-btn" type="button" className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2">
                                    <i className="fa-solid fa-plus"></i> Add
                                </button>
                            </div>

                            <div id="routes-list" className="mt-4 flex flex-wrap gap-2"></div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-lg font-bold text-gray-900">Load Preferences</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <label className="block">
                                    <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Preferred Cargo</span>
                                    <select id="cargo-type" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700">
                                        <option value="">Any farm produce</option>
                                        <option>Fresh vegetables</option>
                                        <option>Grains and cereals</option>
                                        <option>Root crops</option>
                                        <option>Fruits</option>
                                        <option>Livestock feed</option>
                                        <option>Cold-chain produce</option>
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Minimum Payout</span>
                                    <div className="relative">
                                        <input id="minimum-payout" type="number" min="0" placeholder="e.g. 50000" className="w-full border border-gray-200 rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-700" />
                                        <span className="absolute left-4 top-3.5 text-xs font-semibold text-gray-400">NGN</span>
                                    </div>
                                </label>
                            </div>

                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <label className="flex items-center gap-3 bg-gray-50 border rounded-xl p-3 text-sm font-medium">
                                    <input id="accept-shared-loads" type="checkbox" className="w-4 h-4 accent-emerald-700" />
                                    Shared loads
                                </label>
                                <label className="flex items-center gap-3 bg-gray-50 border rounded-xl p-3 text-sm font-medium">
                                    <input id="has-cooling" type="checkbox" className="w-4 h-4 accent-emerald-700" />
                                    Cooling available
                                </label>
                                <label className="flex items-center gap-3 bg-gray-50 border rounded-xl p-3 text-sm font-medium">
                                    <input id="available-now" type="checkbox" className="w-4 h-4 accent-emerald-700" />
                                    Available now
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button id="save-profile-btn" type="submit" className="bg-emerald-800 hover:bg-emerald-900 text-white font-semibold py-3 px-5 rounded-xl transition flex items-center justify-center gap-2">
                                <i className="fa-solid fa-floppy-disk"></i> Save Route Profile
                            </button>
                            <Link to="/Drivers/available_loads.html" className="border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 px-5 rounded-xl transition flex items-center justify-center gap-2">
                                <i className="fa-solid fa-box-open"></i> View Loads
                            </Link>
                        </div>

                        <p id="save-status" className="text-sm font-medium hidden"></p>
                    </form>

                    <aside className="space-y-6">
                        <div className="bg-white rounded-2xl border shadow-sm p-5 sm:p-6">
                            <h3 className="text-lg font-bold text-gray-900">Matching Signals</h3>
                            <div className="mt-4 space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0"><i className="fa-solid fa-weight-hanging"></i></span>
                                    <div>
                                        <p className="font-semibold text-sm">Capacity filter</p>
                                        <p className="text-xs text-gray-500">Orders above your vehicle limit can be deprioritized.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center shrink-0"><i className="fa-solid fa-route"></i></span>
                                    <div>
                                        <p className="font-semibold text-sm">Route fit</p>
                                        <p className="text-xs text-gray-500">Pickup and dropoff locations can match your usual corridors.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0"><i className="fa-solid fa-snowflake"></i></span>
                                    <div>
                                        <p className="font-semibold text-sm">Cargo handling</p>
                                        <p className="text-xs text-gray-500">Cooling and cargo type help rank perishable jobs.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl border shadow-sm p-5 sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="text-lg font-bold text-gray-900">Possible Matches</h3>
                                <span id="suggested-count" className="text-xs font-bold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">0</span>
                            </div>
                            <div id="suggested-loads" className="mt-4 space-y-3">
                                <p className="text-sm text-gray-500 py-4 text-center">Save your route profile to start shaping matches.</p>
                            </div>
                        </div>
                    </aside>
                </section>
            </div>
        </main>
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
    