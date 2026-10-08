import React from "react";
import { Link } from "../Router.jsx";
import { usePageLogic } from "../usePageLogic.js";
import { initialize as inline_1 } from "../legacy/logic/Drivers_profile_1.js";
import { initialize as inline_2 } from "../legacy/logic/Drivers_profile_2.js";
import { initialize as external_Drivers_profile_3 } from "../legacy/logic/Drivers_profile_external_3.js";

const title = "FarmRoute - Driver Profile";
const bodyClass = "bg-gray-50 font-sans antialiased text-gray-800";
const logicOrder = [["inline", "inline_1", ""], ["inline", "inline_2", ""], ["external-module", "external_Drivers_profile_3", ""]];
const initializers = {"inline_1": inline_1, "inline_2": inline_2, "external_Drivers_profile_3": external_Drivers_profile_3};

export default function DriversProfilePage() {
  const handleClick = usePageLogic({ title, logicOrder, initializers });
  return <div className={bodyClass} onClick={handleClick}>

    <div id="notification-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 hidden opacity-0 transition-opacity duration-300">
        <div id="notification-card" className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl scale-95 transition-transform duration-300 text-center">
            <div id="modal-icon-container" className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                <i id="modal-icon" className="fa-solid"></i>
            </div>
            <h3 id="modal-title" className="text-xl font-bold text-gray-900 mb-2">Notification</h3>
            <p id="modal-message" className="text-gray-500 text-sm mb-6 leading-relaxed">Message placeholder.</p>
            <button id="modal-close-btn" className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition text-sm">Dismiss</button>
        </div>
    </div>

    <div className="flex h-screen overflow-hidden">
        <aside id="side-bar" className="md:w-64 w-full bg-green-950 text-white flex flex-col h-screen shrink-0 z-50 fixed inset-y-0 left-0 max-md:hidden">
            <div className="px-6 py-4 flex items-center justify-between border-b border-green-900/50">
                <img className="h-14 object-contain" src="../assets/logo3.png" alt="FarmRoute Logo" />
                <button id="closeside-btn" className="md:hidden text-2xl text-gray-300 hover:text-white p-2">
                    <i className="fa-solid fa-xmark"></i>
                </button>
            </div>

            <nav className="flex-1 mt-5 overflow-y-auto px-4 space-y-1">
                <Link to="/Drivers/dashboard.html" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-green-900/50 hover:text-white transition">
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
                <Link to="/Drivers/payments.html" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-green-900/50 hover:text-white transition">
                    <i className="fa-solid fa-wallet text-lg w-6 text-center"></i> Payments
                </Link>
                <Link to="/Drivers/profile.html" className="flex items-center gap-3 px-4 py-3 rounded-xl font-semibold bg-green-700 text-white transition">
                    <i className="fa-regular fa-user text-lg w-6 text-center"></i> Profile
                </Link>
                <Link to="/Drivers/route_planner.html" className="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-300 hover:bg-green-900/50 hover:text-white transition">
                    <i className="fa-solid fa-route text-lg w-6 text-center"></i> Route Profile
                </Link>
            </nav>

            <div className="p-4 border-t border-green-900/50">
                <button id="logout-btn" className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-900/50 text-gray-300 hover:text-white font-medium transition text-left">
                    <i className="fa-solid fa-right-from-bracket w-6 text-center"></i> Logout
                </button>
            </div>
        </aside>

        <main className="flex-1 h-screen overflow-y-auto p-4 sm:p-6 lg:p-10 w-full md:ml-64 md:w-[calc(100%-16rem)]">
            <div className="mb-8 flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0">
                    <button id="side-btn" className="text-xl text-gray-700 md:hidden p-2 -ml-2">
                        <i className="fa-solid fa-bars"></i>
                    </button>
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Profile</h1>
                        <p className="text-gray-500 text-sm hidden sm:block">Manage your personal information, preferences, and payout details.</p>
                    </div>
                </div>

                <div className="ml-auto flex items-center gap-3 shrink-0">
                    <Link to="/Drivers/notifications.html" className="relative w-10 h-10 rounded-full bg-white border border-gray-100 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition" aria-label="Notifications">
                        <i className="fa-regular fa-bell"></i>
                        <span id="header-notification-badge" className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-green-600 text-white text-[10px] font-bold items-center justify-center hidden">0</span>
                    </Link>
                    <div className="hidden sm:flex items-center gap-3 border-l border-gray-200 pl-3">
                        <img id="header-user-avatar" alt="Profile picture" className="w-10 h-10 rounded-full object-cover border border-gray-100 hidden" />
                        <div className="text-left">
                            <h4 id="header-user-name" className="text-sm font-semibold text-gray-900 leading-tight">Loading...</h4>
                            <p id="header-user-role" className="text-xs text-emerald-700 font-medium capitalize">Driver</p>
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

                <section>
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <label className="space-y-1.5">
                            <span className="text-xs font-semibold text-gray-700">Full Name</span>
                            <span className="relative block">
                                <i className="fa-regular fa-user absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"></i>
                                <input type="text" id="profile-fullname" placeholder="Enter your full name" className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600" />
                            </span>
                        </label>
                        <label className="space-y-1.5">
                            <span className="text-xs font-semibold text-gray-700">Email Address</span>
                            <span className="relative block">
                                <i className="fa-regular fa-envelope absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"></i>
                                <input type="email" id="profile-email" placeholder="Enter your email" className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600" />
                            </span>
                        </label>
                        <label className="space-y-1.5">
                            <span className="text-xs font-semibold text-gray-700">Phone Number</span>
                            <span className="relative block">
                                <i className="fa-solid fa-phone absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"></i>
                                <input type="tel" id="profile-phone" placeholder="Enter your phone number" className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600" />
                            </span>
                        </label>
                        <label className="space-y-1.5">
                            <span className="text-xs font-semibold text-gray-700">Date of Birth</span>
                            <span className="relative block">
                                <i className="fa-regular fa-calendar absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"></i>
                                <input type="date" id="profile-dob" className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 text-gray-500" />
                            </span>
                        </label>
                        <label className="space-y-1.5">
                            <span className="text-xs font-semibold text-gray-700">Gender</span>
                            <span className="relative block">
                                <i className="fa-regular fa-user absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"></i>
                                <select id="profile-gender" className="w-full pl-11 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 text-gray-500 appearance-none">
                                    <option value="" disabled>Select your gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </span>
                        </label>
                        <label className="space-y-1.5">
                            <span className="text-xs font-semibold text-gray-700">Role</span>
                            <span className="relative block">
                                <i className="fa-solid fa-users absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400"></i>
                                <select id="profile-role" disabled className="w-full pl-11 pr-10 py-3 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 appearance-none cursor-not-allowed">
                                    <option value="Driver">Driver</option>
                                </select>
                            </span>
                        </label>
                    </div>
                </section>

                <section className="pt-2">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">Payment Details</h2>
                    <p className="text-sm text-gray-500 mb-4">Add the bank account where completed trip earnings should be paid.</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <label className="space-y-1.5">
                            <span className="text-xs font-semibold text-gray-700">Bank Name</span>
                            <select id="bank-name" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600 text-gray-500">
                                <option value="">Select Bank</option>
                                <option>Access Bank</option>
                                <option>GTBank</option>
                                <option>UBA</option>
                                <option>Zenith Bank</option>
                                <option>First Bank</option>
                                <option>Moniepoint</option>
                                <option>Opay</option>
                            </select>
                        </label>
                        <label className="space-y-1.5">
                            <span className="text-xs font-semibold text-gray-700">Account Name</span>
                            <input type="text" id="account-name" placeholder="Account name" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600" />
                        </label>
                        <label className="space-y-1.5">
                            <span className="text-xs font-semibold text-gray-700">Account Number</span>
                            <input type="text" id="account-number" placeholder="0123456789" maxLength="10" inputmode="numeric" className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-green-600 focus:ring-1 focus:ring-green-600" />
                        </label>
                    </div>
                </section>

                <section className="pt-2">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Account</h2>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-700">Password</label>
                        <div className="flex items-center justify-between border border-gray-200 rounded-xl p-2 pl-4 bg-white">
                            <div className="flex items-center gap-3 text-sm text-gray-500 flex-1">
                                <i className="fa-solid fa-lock text-gray-400"></i>
                                <input type="password" defaultValue="password-hidden" disabled className="bg-transparent border-none outline-none w-full tracking-widest text-gray-400 select-none" />
                            </div>
                            <button id="driver-reset-password-btn" type="button" className="text-xs font-medium text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition whitespace-nowrap">Change Password</button>
                        </div>
                    </div>
                </section>

                <section className="pt-2">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Preferences</h2>
                    <label className="w-full flex items-center justify-between border border-gray-200 rounded-xl p-4 bg-white hover:bg-gray-50/50 transition text-left">
                        <span className="flex items-start gap-4">
                            <span className="p-2.5 bg-gray-50 rounded-xl text-gray-500 mt-0.5">
                                <i className="fa-regular fa-bell text-lg"></i>
                            </span>
                            <span>
                                <span className="block text-sm font-semibold text-gray-900">Push Notifications</span>
                                <span className="block text-xs text-gray-400 mt-0.5">Manage trip and payment notification preferences</span>
                            </span>
                        </span>
                        <input id="push-notifications" type="checkbox" className="w-5 h-5 accent-green-700" defaultChecked />
                    </label>
                </section>

                <section className="pt-2">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Security</h2>
                    <p className="text-sm text-gray-500 mb-4">Set a 6-digit PIN to authorize withdrawals from your available balance.</p>
                    <div id="withdrawal-pin-section" className="space-y-4">
                        <div id="pin-not-set" className="bg-amber-50 border border-amber-200 rounded-xl p-4 hidden">
                            <div className="flex items-start gap-3">
                                <i className="fa-solid fa-triangle-exclamation text-amber-600 mt-0.5"></i>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-amber-800">Withdrawal PIN not set</p>
                                    <p className="text-xs text-amber-700 mt-1">You need to set a withdrawal PIN before you can withdraw funds from your available balance.</p>
                                    <button type="button" id="set-pin-btn" className="mt-3 text-sm font-semibold text-amber-700 hover:underline">Set Withdrawal PIN</button>
                                </div>
                            </div>
                        </div>
                        <div id="pin-set" className="hidden">
                            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <i className="fa-solid fa-shield-check text-green-600"></i>
                                        <div>
                                            <p className="text-sm font-medium text-green-800">Withdrawal PIN is set</p>
                                            <p className="text-xs text-green-700 mt-1">Your PIN is active and protecting your withdrawals.</p>
                                        </div>
                                    </div>
                                    <button type="button" id="change-pin-btn" className="text-sm font-semibold text-green-700 hover:underline">Change PIN</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="pt-4">
                    <button type="submit" id="save-changes-btn" className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-medium py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition shadow-sm">
                        <i className="fa-regular fa-floppy-disk"></i>
                        Save Changes
                    </button>
                </div>
</form>
        </main>
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
    