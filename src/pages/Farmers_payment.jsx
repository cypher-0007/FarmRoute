import React from "react";
import { Link } from "../Router.jsx";
import { usePageLogic } from "../usePageLogic.js";
import { initialize as inline_1 } from "../legacy/logic/Farmers_payment_1.js";
import { initialize as inline_2 } from "../legacy/logic/Farmers_payment_2.js";
import { initialize as external_Farmers_payment_3 } from "../legacy/logic/Farmers_payment_external_3.js";

const title = "FarmRoute - Escrow Payments";
const bodyClass = "bg-gray-50 text-gray-800";
const logicOrder = [["inline", "inline_1", ""], ["inline", "inline_2", ""], ["external-module", "external_Farmers_payment_3", ""]];
const initializers = {"inline_1": inline_1, "inline_2": inline_2, "external_Farmers_payment_3": external_Farmers_payment_3};

export default function FarmersPaymentPage() {
  const handleClick = usePageLogic({ title, logicOrder, initializers });
  return <div className={bodyClass} onClick={handleClick}>


<div id="loading-screen" className="fixed inset-0 bg-white z-50 flex items-center justify-center font-semibold text-gray-600">
    <div className="text-center">
        <i className="fa-solid fa-circle-notch fa-spin text-3xl text-green-700 mb-2"></i>
        <p>Verifying secure escrow data...</p>
    </div>
</div>


<div id="warning-modal" className="fixed inset-0 z-[60] hidden flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative z-10 border border-gray-100 text-center space-y-4">
        <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto text-2xl">
            <i className="fa-solid fa-triangle-exclamation animate-bounce"></i>
        </div>
        <h3 className="text-xl font-bold text-gray-900">Critical Escrow Authorization</h3>
        <p className="text-sm text-gray-500 leading-relaxed">
            Please verify absolutely that your cargo has arrived in the agreed condition. 
            <strong className="text-red-600">This payout mechanism is absolute and cannot be reversed</strong> once signed off.
        </p>
        <div className="bg-gray-50 rounded-xl py-3 text-sm font-bold text-gray-700 border">
            Unlocking release action in: <span id="countdown-timer" className="text-amber-600 text-lg ml-1">5</span>s
        </div>
        <div className="flex gap-3 pt-2">
            <button id="warning-cancel-btn" className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-semibold text-sm transition">
                Abort
            </button>
            <button id="warning-confirm-btn" disabled className="flex-1 bg-gray-200 text-gray-400 py-3 rounded-xl font-semibold text-sm cursor-not-allowed transition">
                Confirm Arrival
            </button>
        </div>
    </div>
</div>


<div id="pin-modal" className="fixed inset-0 z-[70] hidden flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
    <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl relative z-10 border border-gray-100 text-center space-y-4">
        <div className="w-12 h-12 bg-green-50 text-green-700 rounded-full flex items-center justify-center mx-auto text-xl">
            <i className="fa-solid fa-shield-halved"></i>
        </div>
        <div>
            <h3 className="text-lg font-bold text-gray-900">Security Clearance Required</h3>
            <p className="text-xs text-gray-400 mt-1">Enter your 6-digit transaction authorization code.</p>
        </div>
        
        
        <div className="flex justify-center gap-2 py-2" id="pin-input-wrapper">
            <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
            <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
            <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
            <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
            <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
            <input type="text" maxLength="1" className="w-11 h-12 text-center text-lg font-bold border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition" />
        </div>

        <p id="pin-error-msg" className="text-xs font-semibold text-red-500 hidden">Incorrect confirmation PIN. Verification denied.</p>

        <div className="flex gap-3 pt-2">
            <button id="pin-cancel-btn" className="flex-1 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 py-2.5 rounded-xl font-semibold text-xs transition">
                Cancel
            </button>
            <button id="pin-submit-btn" className="flex-1 bg-green-700 hover:bg-green-800 text-white py-2.5 rounded-xl font-semibold text-xs transition shadow-sm">
                Authorize Release
            </button>
        </div>
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
            <Link to="/Farmers/dashboard.html" className="flex items-center gap-3 hover:bg-green-900/50 hover:text-white text-gray-300 px-4 py-3 rounded-xl font-semibold transition shadow-sm">
                <i className="fa-solid fa-house text-lg w-6 text-center"></i> Dashboard
            </Link>
            <Link to="/Farmers/listings.html" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-green-900/50 hover:text-white transition">
                <i className="fa-solid fa-box-open text-lg w-6 text-center"></i> My Listings
            </Link>
            <Link to="/Farmers/messages.html" className="flex items-center justify-between px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-green-900/50 hover:text-white transition">
                <div className="flex items-center gap-3">
                    <i className="fa-regular fa-message text-lg w-6 text-center"></i> Messages
                </div>
                <span id="message-notification-badge" className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full font-bold hidden">0</span>
            </Link>
            <Link to="/Farmers/payment.html" className="flex items-center bg-green-700 justify-between px-4 py-3 rounded-xl font-medium text-white transition">
                <div className="flex items-center gap-3">
                    <i className="fa-solid fa-wallet text-lg w-6 text-center"></i> Payments
                </div>
                <span id="payments-badge" className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full font-bold hidden">0</span>
            </Link>
            <Link to="/Farmers/profile.html" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-green-900/50 hover:text-white transition">
                <i className="fa-regular fa-user text-lg w-6 text-center"></i> Profile
            </Link>
            <div className="pt-2">
                <Link to="/Farmers/add_produce.html" className="flex items-center gap-3 w-full text-gray-300 hover:bg-green-900/50 hover:text-white font-medium py-3 px-4 rounded-xl transition duration-200 text-sm">
                    <i className="fa-solid fa-plus text-base w-6 text-center"></i> List New Produce
                </Link>
            </div>
        </nav>

        <div className="p-4 border-t border-green-900/50">
            <button id="logout-btn" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-900/50 text-gray-300 hover:text-white font-medium transition text-left">
                <i className="fa-solid fa-right-from-bracket w-6 text-center"></i> Logout
            </button>
        </div>
    </aside>

    
    <main className="flex-1 flex flex-col h-screen overflow-hidden md:ml-64 md:w-[calc(100%-16rem)]">
        <header className="bg-white h-20 px-8 flex items-center justify-between border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-4">
                <button id="side-btn" className="text-2xl text-gray-600 md:hidden p-2">
                    <i className="fa-solid fa-bars"></i>
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Payment History</h1>
                    <p className="text-sm text-gray-500 hidden sm:block">View all secure payments and their current status.</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <Link to="/Farmers/notifications.html" className="relative text-xl text-gray-500 hover:text-gray-800 transition" aria-label="Notifications">
                    <i className="fa-regular fa-bell"></i>
                    <span id="header-notification-badge" className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-green-600 text-white text-[10px] font-bold items-center justify-center hidden">0</span>
                </Link>

                <div className="flex items-center gap-3 border-l pl-6 border-gray-100">
                    <img id="user-avatar" alt="Profile picture" className="w-10 h-10 rounded-full object-cover border border-gray-100 hidden" />
                    <div className="hidden sm:block">
                        <h4 id="user-display-name" className="font-semibold text-sm text-gray-900">Loading...</h4>
                        <p id="user-display-role" className="text-xs text-gray-400 capitalize">Farmer</p>
                    </div>
                    <i className="fa-solid fa-chevron-down text-xs text-gray-400 hidden sm:block"></i>
                </div>
            </div>
        </header>

        
        <div className="flex-1 overflow-y-auto p-8">
            <div className="max-w-5xl mx-auto space-y-6">
                
                <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="relative w-full sm:flex-1">
                        <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
                        <input type="text" id="payment-search" placeholder="Search by Order ID, Driver, or Location" className="w-full bg-gray-50 border border-gray-200 rounded-xl py-2.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-green-600/20 focus:border-green-600 transition" />
                    </div>
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button className="flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition w-full sm:w-auto">
                            <i className="fa-solid fa-sliders text-gray-400"></i> Filter <i className="fa-solid fa-chevron-down text-xs text-gray-400 ml-1"></i>
                        </button>
                    </div>
                </div>

                <div id="payments-history-container" className="space-y-4">
                    <p className="text-gray-400 py-12 text-center text-sm">Synchronizing ledger pipeline...</p>
                </div>
            </div>
        </div>
    </main>
</div>


<div id="detail-drawer" className="fixed inset-0 z-50 hidden">
    <div id="drawer-overlay" className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity"></div>
    
    <div className="absolute inset-y-0 right-0 max-w-lg w-full bg-white shadow-2xl flex flex-col h-full transform transition-transform border-l border-gray-100">
        <div className="px-6 py-5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <div>
                <span id="modal-order-id" className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md tracking-wider">#FR-XXXXXX</span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">Transaction Parameters</h3>
            </div>
            <button id="close-drawer-btn" className="text-gray-400 hover:text-gray-600 text-xl p-2 transition">
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="bg-gradient-to-br from-green-900 to-green-950 text-white rounded-2xl p-6 shadow-sm">
                <p className="text-xs text-green-200/80 font-medium uppercase tracking-wider mb-1">Total Escrow Vault Capital</p>
                <h2 id="modal-price" className="text-3xl font-black tracking-tight">₦0</h2>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-green-100">
                    <span className="flex items-center gap-1.5">
                        <i className="fa-solid fa-shield-halved text-green-400"></i> Secure Escrow Active
                    </span>
                    <span id="modal-status-badge" className="bg-white/20 px-2.5 py-0.5 rounded-full font-semibold">Loading</span>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Cargo Parameters</h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                    <div className="bg-white w-12 h-12 rounded-xl flex items-center justify-center border shadow-xs overflow-hidden shrink-0">
                        <img id="modal-cargo-image" alt="Produce cargo" className="w-full h-full object-cover hidden" />
                        <i id="modal-cargo-fallback" className="fa-solid fa-leaf text-green-600 text-lg"></i>
                    </div>
                    <div>
                        <h5 id="modal-crop-name" className="font-bold text-gray-800 text-sm">Produce Cargo</h5>
                        <p id="modal-weight" className="text-xs text-gray-500 mt-0.5">0 kg total allocation</p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assigned Driver</h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full border border-gray-100 bg-green-50 flex items-center justify-center shrink-0 overflow-hidden">
                        <img id="modal-driver-image" alt="Assigned driver" className="w-full h-full object-cover hidden" />
                        <i id="modal-driver-fallback" className="fa-solid fa-user text-green-700 text-sm"></i>
                    </div>
                    <div className="min-w-0">
                        <h4 id="modal-driver-name" className="font-semibold text-sm text-gray-800 truncate">Searching for Driver...</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <i className="fa-solid fa-star text-amber-400 text-[10px]"></i> 4.8 Rating • Verified Transporter
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Logistics Dispatch Pipeline</h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 space-y-4 relative">
                    <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gray-200 border-dashed"></div>
                    
                    <div className="flex gap-3 relative">
                        <div className="w-5 h-5 rounded-full bg-green-100 border-2 border-green-600 flex items-center justify-center text-[8px] text-green-700 z-10 shrink-0 mt-0.5">
                            <i className="fa-solid fa-circle"></i>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Pickup Point Origin</p>
                            <p id="modal-origin" className="text-sm font-semibold text-gray-800 mt-0.5">Loading Origin Location...</p>
                        </div>
                    </div>

                    <div className="flex gap-3 relative">
                        <div className="w-5 h-5 rounded-full bg-red-100 border-2 border-red-500 flex items-center justify-center text-[8px] text-red-600 z-10 shrink-0 mt-0.5">
                            <i className="fa-solid fa-location-dot"></i>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium">Destination Delivery Hub</p>
                            <p id="modal-destination" className="text-sm font-semibold text-gray-800 mt-0.5">Loading Destination Location...</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="modal-actions-wrapper" className="p-4 border-t border-gray-100 bg-gray-50 grid grid-cols-2 gap-3 shrink-0">
            <button id="action-cancel-btn" className="w-full bg-white border border-gray-200 hover:border-red-200 text-red-600 hover:bg-red-50/50 py-3 px-4 rounded-xl font-bold text-sm transition duration-150">
                Cancel Order
            </button>
            <button id="action-release-btn" className="w-full bg-green-700 hover:bg-green-800 text-white py-3 px-4 rounded-xl font-bold text-sm transition duration-150 shadow-sm">
                Release Payment
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
    