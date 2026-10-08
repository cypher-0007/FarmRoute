import React from "react";
import { Link } from "../Router.jsx";
import { usePageLogic } from "../usePageLogic.js";
import { initialize as inline_1 } from "../legacy/logic/Drivers_messages_1.js";
import { initialize as external_Drivers_messages_2 } from "../legacy/logic/Drivers_messages_external_2.js";
import { initialize as inline_3 } from "../legacy/logic/Drivers_messages_3.js";
import { initialize as external_Drivers_messages_4 } from "../legacy/logic/Drivers_messages_external_4.js";

const title = "FarmRoute - Messages";
const bodyClass = "bg-[#f8f9fa] font-sans antialiased text-slate-800";
const logicOrder = [["inline", "inline_1", ""], ["external-module", "external_Drivers_messages_2", ""], ["inline", "inline_3", ""], ["external-module", "external_Drivers_messages_4", ""]];
const initializers = {"inline_1": inline_1, "external_Drivers_messages_2": external_Drivers_messages_2, "inline_3": inline_3, "external_Drivers_messages_4": external_Drivers_messages_4};

export default function DriversMessagesPage() {
  const handleClick = usePageLogic({ title, logicOrder, initializers });
  return <div className={bodyClass} onClick={handleClick}>

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
                    <i className="fa-solid fa-house text-lg w-6 text-center"></i>
                    Dashboard
                </Link>

                <Link to="/Drivers/available_loads.html" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-green-900/50 hover:text-white transition">
                    <i className="fa-solid fa-boxes-stacked text-lg w-6 text-center"></i>
                    Available Loads
                </Link>

                <Link to="/Drivers/active_trips.html" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-green-900/50 hover:text-white transition">
                    <i className="fa-solid fa-truck-fast text-lg w-6 text-center"></i>
                    My Active Trips
                </Link>

                <Link to="/Drivers/messages.html" className="flex items-center justify-between px-4 py-3 rounded-xl font-semibold bg-green-700 text-white transition">
                    <div className="flex items-center gap-3">
                        <i className="fa-regular fa-message text-lg w-6 text-center"></i>
                        Messages
                    </div>

                    <span id="message-notification-badge" className="bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-bold hidden">
                        0
                    </span>
                </Link>

                <Link to="/Drivers/payments.html" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-green-900/50 hover:text-white transition">
                    <i className="fa-solid fa-wallet text-lg w-6 text-center"></i>
                    Payments
                </Link>

                <Link to="/Drivers/profile.html" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-green-900/50 hover:text-white transition">
                    <i className="fa-regular fa-user text-lg w-6 text-center"></i>
                    Profile
                </Link>

                <Link to="/Drivers/route_planner.html" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-green-900/50 hover:text-white transition">
                    <i className="fa-solid fa-route text-lg w-6 text-center"></i>
                    Route Profile
                </Link>

                <div className="pt-2">
                    <button id="go-online-btn" className="flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-500 font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-sm text-sm">
                        <i className="fa-solid fa-circle text-xs" id="online-dot"></i>
                        <span id="online-label">Go Online</span>
                    </button>
                </div>

            </nav>

            <div className="p-4 border-t border-green-900/50">
                <button id="logout-btn" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-900/50 text-gray-300 hover:text-white font-medium transition text-left">
                    <i className="fa-solid fa-right-from-bracket w-6 text-center"></i>
                    Logout
                </button>
            </div>

    </aside>

        <main className="flex-1 h-screen flex flex-col relative min-w-0 overflow-hidden md:ml-64 md:w-[calc(100%-16rem)]">
            
            <header className="h-20 bg-white px-4 sm:px-8 flex items-center justify-between sticky top-0 z-10">
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                    <button id="side-btn" className="text-xl text-slate-700 md:hidden p-2">
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <div className="min-w-0">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 truncate">Messages</h2>
                        <p className="text-sm text-slate-500 hidden sm:block">Chat with drivers, farmers and partners.</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <Link to="/Drivers/notifications.html" className="relative p-2 text-slate-700 hover:text-slate-900 transition" aria-label="Notifications">
                        <i className="fa-regular fa-bell text-xl"></i>
                        <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></span>
                    </Link>
                    <div className="flex items-center gap-3 sm:pl-4">
                        <div id="user-avatar-placeholder" className="w-10 h-10 bg-[#e8f5e9] text-emerald-800 font-bold rounded-full flex items-center justify-center text-sm overflow-hidden">
                            FN
                        </div>
                        <div className="hidden sm:flex items-center gap-1 cursor-pointer">
                            <h4 id="user-display-name" className="text-sm font-semibold text-slate-800 leading-tight">FarmRoute Driver</h4>
                            <i className="fa-solid fa-chevron-down text-xs text-slate-500"></i>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex-1 p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-[minmax(280px,400px)_minmax(0,1fr)] gap-4 lg:gap-6 min-h-0 h-[calc(100dvh-5rem)] overflow-hidden">
                
                <div id="chat-list-panel" className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden min-h-0 h-full">
                    <div className="p-4 flex items-center gap-2">
                        <div className="relative flex-1">
                            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                            <input type="text" placeholder="Search messages" className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition placeholder-slate-400" />
                        </div>
                        <button className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-600 hover:bg-slate-100 transition">
                            <i className="fa-solid fa-sliders text-sm"></i>
                        </button>
                    </div>

                    <div id="chat-threads-container" className="flex-1 overflow-y-auto px-2 space-y-1">
                        <p className="text-slate-400 py-12 text-center text-xs">Loading conversations...</p>
                    </div>
                    
                    <div className="p-4 border-t border-slate-50">
                        <button className="w-full py-2 text-sm font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl transition flex items-center justify-center gap-1">
                            Load more <i className="fa-solid fa-chevron-down text-xs"></i>
                        </button>
                    </div>
                </div>

                <div id="empty-chat-state" className="hidden bg-white rounded-2xl border border-slate-100 shadow-sm lg:flex flex-col items-center justify-center p-8">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4 text-2xl shadow-sm">
                        <i className="fa-regular fa-comments"></i>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">No Chat Selected</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-xs text-center leading-relaxed">Select a live conversation from your active listings on the panel to begin secure logistics management communication.</p>
                </div>

                <div id="active-chat-state" className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col overflow-hidden hidden min-h-0 h-full">
                    <div id="chat-window-header" className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10"></div>

                    <div id="message-bubbles-container" className="flex-1 bg-white p-4 sm:p-6 overflow-y-auto space-y-6"></div>

                    <div className="p-4 border-t border-slate-100 bg-white flex items-center gap-3">
                        <button className="text-slate-400 hover:text-slate-600 transition text-lg px-1">
                            <i className="fa-solid fa-paperclip"></i>
                        </button>
                        
                        <div className="relative flex-1">
                            <input id="message-input" type="text" placeholder="Type a message..." className="w-full py-3 pl-4 pr-10 text-sm bg-slate-50 border border-slate-100 rounded-full focus:outline-none focus:ring-1 focus:ring-emerald-500/50 transition placeholder-slate-400" />
                            <button className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-lg">
                                <i className="fa-regular fa-face-smile"></i>
                            </button>
                        </div>

                        <button id="send-btn" className="w-11 h-11 bg-[#1e3d2f] hover:bg-emerald-900 text-white rounded-full shadow-sm transition flex items-center justify-center shrink-0">
                            <i className="fa-solid fa-paper-plane text-sm"></i>
                        </button>
                    </div>
                </div>

            </div>
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
    