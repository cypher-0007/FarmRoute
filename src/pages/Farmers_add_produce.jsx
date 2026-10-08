import React from "react";
import { Link } from "../Router.jsx";
import { usePageLogic } from "../usePageLogic.js";
import { initialize as inline_2 } from "../legacy/logic/Farmers_add_produce_2.js";
import { initialize as inline_3 } from "../legacy/logic/Farmers_add_produce_3.js";
import { initialize as external_Farmers_add_produce_4 } from "../legacy/logic/Farmers_add_produce_external_4.js";

const title = "FarmRoute - List New Produce";
const bodyClass = "bg-gray-50/50 text-gray-800";
const logicOrder = [["external", "https://js.paystack.co/v1/inline.js", "classic"], ["inline", "inline_2", ""], ["inline", "inline_3", ""], ["external-module", "external_Farmers_add_produce_4", ""]];
const initializers = {"inline_2": inline_2, "inline_3": inline_3, "external_Farmers_add_produce_4": external_Farmers_add_produce_4};

export default function FarmersAddProducePage() {
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
                <Link to="/Farmers/dashboard.html" className="flex items-center gap-3 hover:bg-green-800 mx-4 px-4 py-3 rounded-lg mb-2">
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
                    <Link to="/Farmers/add_produce.html" className="flex items-center justify-center gap-2 w-full bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-sm text-sm">
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

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden md:ml-64 md:w-[calc(100%-16rem)]">
            <header className="bg-white h-20 px-4 sm:px-8 flex items-center justify-between border-b shrink-0 z-30">
                <div className="flex items-center gap-4">
                    <button id="side-btn" className="text-xl text-gray-600 md:hidden"><i className="fa-solid fa-bars"></i></button>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">List New Produce</h1>
                        <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Add your fresh agricultural harvest items to connect instantly with buyers.</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 sm:gap-6">
                    <div className="flex items-center gap-3 border-l pl-4 sm:pl-6">
                        <img id="user-avatar" alt="Profile picture" className="w-10 h-10 rounded-full object-cover hidden" />
                        <div className="hidden sm:block text-left">
                            <h4 id="user-display-name" className="font-semibold text-sm text-gray-900 leading-tight">Loading...</h4>
                            <span id="user-display-role" className="text-xs text-emerald-600 font-medium capitalize">Farmer</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                    
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-2xl border p-4 sm:p-6 shadow-sm">
                            <div className="flex items-center justify-between max-w-md mx-auto relative">
                                <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 z-0"></div>
                                <div id="progress-line" className="absolute left-0 top-4 h-0.5 bg-emerald-700 z-0 transition-all duration-300 w-0"></div>

                                <div className="z-10 flex flex-col items-center step-item" data-step="1">
                                    <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm ring-4 ring-emerald-50">1</div>
                                    <span className="text-xs font-semibold text-emerald-800 mt-2">Product Info</span>
                                </div>
                                <div className="z-10 flex flex-col items-center step-item" data-step="2">
                                    <div className="w-9 h-9 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm">2</div>
                                    <span className="text-xs font-medium text-gray-400 mt-2">Pricing</span>
                                </div>
                                <div className="z-10 flex flex-col items-center step-item" data-step="3">
                                    <div className="w-9 h-9 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center font-bold text-sm">3</div>
                                    <span className="text-xs font-medium text-gray-400 mt-2">Availability</span>
                                </div>
                            </div>
                        </div>

                        <form id="produce-listing-form" className="bg-white rounded-2xl border p-4 sm:p-6 shadow-sm space-y-6">
                            
                            <div id="step-panel-1" className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Product Name *</label>
                                    <input type="text" id="productName" required placeholder="e.g., Fresh Habanero Pepper, Sweet Potatoes" className="w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Category *</label>
                                        <select id="category" className="w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition">
                                            <option value="Vegetables">Vegetables</option>
                                            <option value="Fruits">Fruits</option>
                                            <option value="Grains">Grains &amp; Cereals</option>
                                            <option value="Tubers">Tubers &amp; Roots</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Measurement Unit *</label>
                                        <select id="unit" className="w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition">
                                            <option value="kg">Kilogram (kg)</option>
                                            <option value="bag">Bag</option>
                                            <option value="tuber">Tuber</option>
                                            <option value="crate">Crate</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-xs font-bold uppercase text-gray-600">Description *</label>
                                        <span id="char-counter" className="text-xs text-gray-400">0/200</span>
                                    </div>
                                    <textarea id="description" rows="4" maxLength="200" required placeholder="Describe your produce quality, variety types, sorting conditions, or any custom details buyers should know..." className="w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition resize-none"></textarea>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Upload Photos *</label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                        <label className="border-2 border-dashed border-gray-200 hover:border-emerald-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition bg-gray-50/50 aspect-square">
                                            <i className="fa-regular fa-image text-2xl text-gray-400"></i>
                                            <span className="text-[11px] font-medium text-gray-500 text-center">Click to upload</span>
                                            <input type="file" id="imageFiles" accept="image/*" className="hidden" multiple />
                                        </label>
                                        <div id="image-previews-container" className="contents">
                                            </div>
                                    </div>
                                </div>
                            </div>

                            <div id="step-panel-2" className="space-y-4 hidden">
                                <div>
                                    <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Price per Unit (₦) *</label>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-500 font-bold text-sm">₦</span>
                                        <input type="number" id="pricePerUnit" required placeholder="e.g., 800" className="w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Set a competitive marketplace unit value rate pricing matrix structure.</p>
                                </div>
                            </div>

                            <div id="step-panel-3" className="space-y-4 hidden">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Quantity Available *</label>
                                        <input type="number" id="quantity" required placeholder="e.g., 100" className="w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Harvest Date *</label>
                                        <input type="date" id="harvestDate" required className="w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Route From (Origin State) *</label>
                                        <input type="text" id="location" required placeholder="e.g., Ibadan, Oyo State" className="w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Route To (Destination State) *</label>
                                        <input type="text" id="destination" required placeholder="e.g., Lagos State" className="w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Specific Pickup Point / Address *</label>
                                        <input type="text" id="pickupPoint" required placeholder="e.g., Bodija Market, Block B" className="w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold uppercase text-gray-600 mb-2">Specific Drop-off Point / Address *</label>
                                        <input type="text" id="dropoffPoint" required placeholder="e.g., Mile 12 Market Depot" className="w-full px-4 py-3 bg-white border rounded-xl text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition" />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t flex justify-between items-center">
                                <button type="button" id="prev-btn" className="px-5 py-2.5 rounded-xl border font-semibold text-gray-600 hover:bg-gray-50 transition invisible text-sm">Cancel</button>
                                <button type="button" id="next-btn" className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-xl transition text-sm flex items-center gap-2">
                                    <span>Next: Pricing</span> <i className="fa-solid fa-arrow-right text-xs"></i>
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-6 lg:sticky lg:top-8">
                        <section className="bg-white rounded-2xl border p-4 sm:p-6 shadow-sm space-y-4">
                            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <i className="fa-regular fa-eye"></i> <span>Live Output Preview</span>
                            </div>

                            <div className="border rounded-2xl overflow-hidden bg-white shadow-sm transition hover:shadow-md">
                                <div className="relative bg-emerald-50 aspect-[4/3] flex items-center justify-center text-emerald-600 font-bold overflow-hidden">
                                    <img src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600" className="w-full h-full object-cover" />
                                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shadow-sm">Open for Orders</span>
                                </div>
                                <div className="p-4 space-y-2">
                                    <div className="flex items-center gap-2">
                                        <h3 id="prev-title" className="font-bold text-lg text-gray-900 truncate">Fresh Tomatoes</h3>
                                        <span id="prev-cat" className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md">Vegetables</span>
                                    </div>
                                    <div className="flex items-center text-xs text-gray-500 gap-1.5 font-medium">
                                        <i className="fa-solid fa-boxes-stacked text-gray-400"></i>
                                        <span id="prev-qty">100 kg available</span>
                                        <span className="text-gray-300">•</span>
                                        <i className="fa-solid fa-location-dot text-gray-400"></i>
                                        <span id="prev-loc" className="truncate">Ibadan, Oyo State → Lagos State</span>
                                    </div>
                                    <p id="prev-desc" className="text-xs text-gray-500 font-medium line-clamp-2">High-quality, farm-fresh tomatoes. Perfect for sauces, stews, and daily cooking workflows.</p>
                                    <div className="pt-2 border-t flex items-baseline gap-0.5">
                                        <span id="prev-price" className="text-xl font-extrabold text-emerald-700">₦800</span>
                                        <span id="prev-unit" className="text-xs text-gray-500 font-medium">/ kg</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="bg-white rounded-2xl border p-4 sm:p-6 shadow-sm">
                            <h4 className="font-bold text-sm text-gray-900 mb-3 flex items-center gap-2"><i className="fa-regular fa-lightbulb text-emerald-600"></i> Tips for Better Listings</h4>
                            <ul className="space-y-2 text-xs font-medium text-gray-600">
                                <li className="flex items-center gap-2 text-emerald-700"><i className="fa-regular fa-circle-check"></i> Use clear, natural high-quality photos</li>
                                <li className="flex items-center gap-2 text-emerald-700"><i className="fa-regular fa-circle-check"></i> Be completely honest about quantity variables</li>
                                <li className="flex items-center gap-2 text-emerald-700"><i className="fa-regular fa-circle-check"></i> Set competitive rates market valuation metrics</li>
                            </ul>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    </div>

    <div id="success-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm hidden opacity-0 transition-opacity duration-300">
        <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-xl transform scale-95 transition-transform duration-300" id="success-modal-card">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 animate-bounce">
                <i className="fa-solid fa-circle-check"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Escrow Payment Secured!</h3>
            <p className="text-gray-500 text-sm mb-6">Your produce listing has been verified and safely uploaded to FarmRoute.</p>
            <button id="modal-close-btn" className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-semibold text-sm shadow transition">
                Go to My Listings
            </button>
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
    