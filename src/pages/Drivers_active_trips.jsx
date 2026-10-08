import React from "react";
import { Link } from "../Router.jsx";
import { usePageLogic } from "../usePageLogic.js";
import { initialize as inline_1 } from "../legacy/logic/Drivers_active_trips_1.js";
import { initialize as external_Drivers_active_trips_2 } from "../legacy/logic/Drivers_active_trips_external_2.js";
import { initialize as inline_3 } from "../legacy/logic/Drivers_active_trips_3.js";
import { initialize as external_Drivers_active_trips_4 } from "../legacy/logic/Drivers_active_trips_external_4.js";

const title = "FarmRoute - Active Trips";
const bodyClass = "bg-gray-50/50 text-gray-800";
const logicOrder = [["inline", "inline_1", ""], ["external-module", "external_Drivers_active_trips_2", ""], ["inline", "inline_3", ""], ["external-module", "external_Drivers_active_trips_4", ""]];
const initializers = {"inline_1": inline_1, "external_Drivers_active_trips_2": external_Drivers_active_trips_2, "inline_3": inline_3, "external_Drivers_active_trips_4": external_Drivers_active_trips_4};

export default function DriversActiveTripsPage() {
  const handleClick = usePageLogic({ title, logicOrder, initializers });
  return <div className={bodyClass} onClick={handleClick}><style>{"\n        body { font-family: 'Inter', sans-serif; }\n    "}</style>

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
                <Link to="/Drivers/active_trips.html" className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg bg-green-700 text-white mb-2">
                    <i className="fa-solid fa-truck"></i> My Active Trips
                </Link>
                <Link to="/Drivers/messages.html" className="flex items-center justify-between px-4 py-3 mx-4 rounded-lg hover:bg-green-800 text-gray-300 hover:text-white mb-2">
                    <div className="flex items-center gap-3">
                        <i className="fa-regular fa-message"></i> Messages
                    </div>
                    <span id="message-notification-badge" className="bg-green-500 text-xs px-2 py-1 rounded-full text-white hidden">0</span>
                </Link>
                <Link to="/Drivers/payments.html" className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg hover:bg-green-800 text-gray-300 hover:text-white mb-2">
                    <i className="fa-solid fa-wallet"></i> Payments
                </Link>
                <Link to="/Drivers/profile.html" className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg hover:bg-green-800 text-gray-300 hover:text-white mb-2">
                    <i className="fa-regular fa-user"></i> Profile
                </Link>
                <Link to="/Drivers/route_planner.html" className="flex items-center gap-3 px-4 py-3 mx-4 rounded-lg hover:bg-green-800 text-gray-300 hover:text-white mb-6">
                    <i className="fa-solid fa-route"></i> Route Profile
                </Link>
                
                <div className="px-4 mb-4">
                    <button id="online-toggle-btn" className="flex items-center justify-center gap-2 w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-sm text-sm cursor-pointer">
                        <i className="fa-solid fa-circle text-xs text-emerald-500 animate-pulse"></i> Go Online
                    </button>
                </div>
            </nav>

            <div className="p-4 border-t border-green-900">
                <button id="logout-btn" className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-green-800 text-left text-gray-300 hover:text-white transition">
                    <i className="fa-solid fa-right-from-bracket"></i> Logout
                </button>
            </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden md:ml-64 md:w-[calc(100%-16rem)]">
            
            <header className="bg-white h-20 px-4 sm:px-8 flex items-center justify-between border-b shrink-0 z-30">
                <div className="flex items-center gap-4">
                    <button id="side-btn" className="text-xl text-gray-600 md:hidden"><i className="fa-solid fa-bars"></i></button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Active Trips</h1>
                        <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Track ongoing shipments, update trip statuses, and manage fulfillment milestones.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-3 border-l pl-4 sm:pl-6">
                        <img id="user-avatar" src="../assets/logo.png" alt="Driver profile picture" className="w-10 h-10 rounded-full object-cover border border-gray-100" />
                        <div className="hidden sm:block text-left">
                            <h4 id="user-display-name" className="font-semibold text-sm text-gray-900 leading-tight">Loading...</h4>
                            <span id="user-display-role" className="text-xs text-emerald-600 font-medium capitalize">Logistics Driver</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-6">

                    <div className="bg-white rounded-2xl border p-4 sm:p-6 shadow-sm">
                        <div id="trips-wrapper" className="divide-y divide-gray-100">
                            <div className="text-center py-12 text-gray-500">
                                <i className="fa-solid fa-spinner fa-spin text-2xl text-emerald-600 mb-2"></i>
                                <p className="text-sm">Fetching your active transits...</p>
                            </div>
                        </div>
                    </div>

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
    