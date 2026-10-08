import React from "react";
import { Link } from "../Router.jsx";
import { usePageLogic } from "../usePageLogic.js";
import { initialize as inline_1 } from "../legacy/logic/Farmers_profile_1.js";
import { initialize as inline_2 } from "../legacy/logic/Farmers_profile_2.js";
import { initialize as external_Farmers_profile_3 } from "../legacy/logic/Farmers_profile_external_3.js";

const title = "FarmRoute - Profile";
const bodyClass = "bg-gray-50 font-sans antialiased text-gray-800";
const logicOrder = [["inline", "inline_1", ""], ["inline", "inline_2", ""], ["external-module", "external_Farmers_profile_3", ""]];
const initializers = {"inline_1": inline_1, "inline_2": inline_2, "external_Farmers_profile_3": external_Farmers_profile_3};

export default function FarmersProfilePage() {
  const handleClick = usePageLogic({ title, logicOrder, initializers });
  return <div className={bodyClass} onClick={handleClick}>

    <div id="notification-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 hidden transition-opacity duration-300 opacity-0">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl transform scale-95 transition-transform duration-300 flex flex-col items-center text-center">
            <div id="modal-icon-container" className="w-16 h-16 rounded-full flex items-center justify-center mb-4 text-2xl">
                <i id="modal-icon" className="fa-solid"></i>
            </div>
            <h3 id="modal-title" className="text-xl font-bold text-gray-900 mb-2">Notification</h3>
            <p id="modal-message" className="text-gray-500 text-sm mb-6 leading-relaxed">Message placeholder.</p>
            <button id="modal-close-btn" className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition shadow-sm text-sm">
                Dismiss
            </button>
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

                <Link to="/Farmers/profile.html" className="flex items-center gap-3 bg-green-700 mx-4 px-4 py-3 rounded-lg mb-2">
                    <i className="fa-regular fa-user"></i>
                    Profile
                </Link>

                <div className="px-4 mb-4">
                    <Link to="/Farmers/add_produce.html" className="flex items-center gap-2 w-full hover:bg-green-800 font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-sm text-sm">
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

        <main className="flex-1 h-screen overflow-y-auto p-4 sm:p-6 lg:p-10 md:ml-64 md:w-[calc(100%-16rem)] w-full">
            
            <div className="mb-8 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                    <button id="side-btn" className="text-xl text-gray-700 md:hidden p-2 -ml-2">
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Profile</h1>
                        <p className="text-gray-500 text-sm hidden sm:block">Manage your personal information and preferences.</p>
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-3 shrink-0">
                    <Link to="/Farmers/notifications.html" className="relative w-10 h-10 rounded-full bg-white border border-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition" aria-label="Notifications">
                        <i className="fa-regular fa-bell"></i>
                        <span id="header-notification-badge" className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-green-600 text-white text-[10px] font-bold items-center justify-center hidden">0</span>
                    </Link>
                    <div className="hidden sm:flex items-center gap-3 border-l border-gray-200 pl-3">
                        <img id="header-user-avatar" alt="Profile picture" className="w-10 h-10 rounded-full object-cover border border-gray-100 hidden" />
                        <div className="text-left">
                            <h4 id="header-user-name" className="text-sm font-semibold text-gray-900 leading-tight">Loading...</h4>
                            <p id="header-user-role" className="text-xs text-emerald-700 font-medium capitalize">Farmer</p>
                        </div>
                    </div>
                </div>
            </div>

            <form id="profile-form" className="bg-white rounded-2xl border border-gray-100 p-6 md:p-10 shadow-sm space-y-8">
                
                <div className="flex flex-col items-center justify-center text-center">
                    <label className="group cursor-pointer flex flex-col items-center">
                        <div id="pfp-container" className="w-32 h-32 rounded-full border-2 border-dashed border-green-500 bg-green-50/50 flex items-center justify-center overflow-hidden transition group-hover:bg-green-50 group-hover:border-green-600 mb-3">
                            <i id="pfp-icon" className="fa-solid fa-user-astronaut text-3xl text-green-600"></i>
                            
                            <img id="pfp-preview" className="w-full h-full object-cover hidden" alt="Profile Picture" />
                        </div>
                        <span className="text-green-700 font-medium text-sm group-hover:underline">Add Profile Picture</span>
                        <span className="text-gray-400 text-xs mt-1">JPG, PNG or WebP. Max size 2MB.</span>
                        <input type="file" id="pfp-input" className="hidden" accept="image/*" />
                    </label>
                </div>

                <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700">Full Name</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                                    <i className="fa-regular fa-user"></i>
                                </span>
                                <input type="text" id="profile-fullname" placeholder="Enter your full name" className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 placeholder-gray-400 transition" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700">Email Address</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                                    <i className="fa-regular fa-envelope"></i>
                                </span>
                                <input type="email" id="profile-email" placeholder="Enter your email" className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 placeholder-gray-400 transition" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700">Phone Number</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                                    <i className="fa-solid fa-phone"></i>
                                </span>
                                <input type="tel" id="profile-phone" placeholder="Enter your phone number" className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 placeholder-gray-400 transition" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700">Date of Birth</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                                    <i className="fa-regular fa-calendar"></i>
                                </span>
                                <input type="date" id="profile-dob" className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 text-gray-500 transition" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700">Gender</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                                    <i className="fa-regular fa-user"></i>
                                </span>
                                <select id="profile-gender" className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 text-gray-500 appearance-none transition">
                                    <option value="" disabled>Select your gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 pointer-events-none">
                                    <i className="fa-solid fa-chevron-down text-xs"></i>
                                </span>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-700">Role</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                                    <i className="fa-solid fa-users"></i>
                                </span>
                                <select id="profile-role" disabled className="w-full pl-11 pr-10 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 appearance-none cursor-not-allowed transition">
                                    <option value="" disabled>Select your role</option>
                                    <option value="Farmer">Farmer</option>
                                    <option value="Driver">Driver</option>
                                </select>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 pointer-events-none">
                                    <i className="fa-solid fa-lock text-xs"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Account</h2>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700">Password</label>
                        <div className="flex items-center justify-between border border-gray-200 rounded-xl p-2 pl-4 bg-white focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600 transition">
                            <div className="flex items-center gap-3 text-sm text-gray-500 flex-1">
                                <i className="fa-solid fa-lock text-gray-400"></i>
                                <input type="password" defaultValue="•••••••••••••••••" disabled className="bg-transparent border-none outline-none w-full tracking-widest text-gray-400 select-none" />
                            </div>
                            <button id="farmer-reset-password-btn" type="button" className="text-xs font-medium text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition whitespace-nowrap">
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Preferences</h2>
                    <Link to="/Farmers/notifications.html" className="w-full flex items-center justify-between border border-gray-100 rounded-xl p-4 bg-white hover:bg-gray-50/50 border border-gray-200 transition text-left">
                        <div className="flex items-start gap-4">
                            <span className="p-2.5 bg-gray-50 rounded-xl text-gray-500 mt-0.5">
                                <i className="fa-regular fa-bell text-lg"></i>
                            </span>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">Push Notifications</h3>
                                <p className="text-xs text-gray-400 mt-0.5">Manage your push notification preferences</p>
                            </div>
                        </div>
                        <i className="fa-solid fa-chevron-right text-gray-400 text-xs pr-2"></i>
                    </Link>
                </div>

                <div className="pt-4">
                    <button type="submit" id="save-changes-btn" className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-medium py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm">
                        <i className="fa-regular fa-floppy-disk"></i>
                        Save Changes
                    </button>
                </div>

            </form>
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
    