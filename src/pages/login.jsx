import React from "react";
import { Link } from "../Router.jsx";
import { usePageLogic } from "../usePageLogic.js";
import { initialize as inline_1 } from "../legacy/logic/login_1.js";
import { initialize as inline_2 } from "../legacy/logic/login_2.js";

const title = "FarmRoute - Login & Sign Up";
const bodyClass = "bg-gray-100 min-h-screen flex items-start justify-center p-4 sm:p-6 lg:p-8";
const logicOrder = [["inline", "inline_1", ""], ["inline", "inline_2", ""]];
const initializers = {"inline_1": inline_1, "inline_2": inline_2};

export default function LoginPage() {
  const handleClick = usePageLogic({ title, logicOrder, initializers });
  return <div className={bodyClass} onClick={handleClick}><style>{"\n        body {\n            font-family: 'Inter', sans-serif;\n        }\n    "}</style>

    <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col lg:flex-row min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-4rem)]">
        
        <div className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center p-12 flex-col justify-between text-white" style={{backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.25)), url('https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=1000')"}}>
            <div className="flex items-center space-x-2 bg-white/90 text-emerald-800 py-2 px-4 rounded-full w-fit backdrop-blur-sm shadow-sm">
                <i className="fa-solid fa-tractor text-xl text-emerald-600"></i>
                <span className="font-bold text-xl tracking-tight">FarmRoute</span>
            </div>

            <div className="my-auto max-w-md">
                <h1 className="text-4xl font-extrabold text-neutral-900 leading-tight mb-4 drop-shadow-sm">
                    Farm Fresh.<br />Delivered Right.
                </h1>
                <p className="text-neutral-800 font-medium text-lg mb-8 opacity-90">
                    Connecting farms to markets and people, one route at a time.
                </p>

                <div className="space-y-4">
                    <div className="flex items-center space-x-3 text-neutral-900 font-semibold bg-white/40 backdrop-blur-md p-3 rounded-xl border border-white/20">
                        <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white text-sm">
                            <i className="fa-solid fa-leaf"></i>
                        </div>
                        <span>Fresh Produce</span>
                    </div>
                    <div className="flex items-center space-x-3 text-neutral-900 font-semibold bg-white/40 backdrop-blur-md p-3 rounded-xl border border-white/20">
                        <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white text-sm">
                            <i className="fa-solid fa-truck-fast"></i>
                        </div>
                        <span>Smart Routes</span>
                    </div>
                    <div className="flex items-center space-x-3 text-neutral-900 font-semibold bg-white/40 backdrop-blur-md p-3 rounded-xl border border-white/20">
                        <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white text-sm">
                            <i className="fa-solid fa-users"></i>
                        </div>
                        <span>Stronger Connections</span>
                    </div>
                </div>
            </div>

            <div className="bg-emerald-950/90 text-emerald-50 backdrop-blur-md p-4 rounded-2xl border border-emerald-800/50 flex items-start space-x-3">
                <i className="fa-solid fa-seedling text-emerald-400 mt-1"></i>
                <p className="text-sm font-medium leading-relaxed">
                    Supporting farmers. Building communities. Growing together.
                </p>
            </div>
        </div>

        <div className="w-full lg:w-1/2 p-6 sm:p-12 flex flex-col justify-center bg-stone-50/30">
            
            <div className="flex border-b border-gray-200 mb-8 max-w-sm mx-auto w-full">
                <button id="tab-login" data-legacy-click={"switchTab('login')"} className="w-1/2 text-center pb-4 text-base font-semibold border-b-4 border-emerald-700 text-emerald-800 transition-all duration-200">
                    Login
                </button>
                <button id="tab-signup" data-legacy-click={"switchTab('signup')"} className="w-1/2 text-center pb-4 text-base font-medium text-gray-400 hover:text-gray-600 border-b-4 border-transparent transition-all duration-200">
                    Sign Up
                </button>
            </div>

            <div className="max-w-sm mx-auto w-full relative">
                
                <div id="form-container-login" className="transition-all duration-300 opacity-100 scale-100">
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="fa-solid fa-seedling text-xl"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Welcome Back!</h2>
                        <p className="text-sm text-gray-500 mt-1">Login to your FarmRoute account</p>
                    </div>

                    <form id="login-form" className="space-y-4">
                        <div>
                            <label htmlFor="login-email" className="block text-xs font-semibold text-gray-600 mb-1">Email or Phone Number</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <i className="fa-regular fa-envelope"></i>
                                </span>
                                <input name="identifier" id="login-email" type="text" autoComplete="username" required placeholder="name@example.com or 08012345678" className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition" />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <label htmlFor="login-password" className="text-xs font-semibold text-gray-600">Password</label>
                                <a href="#" id="forgot-password" className="text-xs font-semibold text-emerald-600 hover:underline">Forgot Password?</a>
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <i className="fa-solid fa-lock"></i>
                                </span>
                                <input name="password" id="login-password" type="password" autoComplete="current-password" required placeholder="Enter your password" className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition" />
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input name="remember" id="remember_me" type="checkbox" className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                            <label htmlFor="remember_me" className="ml-2 text-xs text-gray-500 cursor-pointer select-none">Remember me</label>
                        </div>

                        <button type="submit" className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold shadow-md transition">
                            Login
                        </button>
                    </form>

                    <div className="relative my-6 text-center">
                        <hr className="border-gray-200" />
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-50/30 px-3 text-[10px] font-medium uppercase tracking-wider text-gray-400">or continue with</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <button type="button" id="google-login-btn" className="flex items-center justify-center space-x-2 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:border-emerald-500 hover:text-emerald-800 transition">
                            <i className="fa-brands fa-google text-red-500"></i>
                            <span>Google</span>
                        </button>
                    </div>

                    <p className="text-center text-xs text-gray-500 mt-6">
                        Don't have an account? <button type="button" data-legacy-click={"switchTab('signup')"} className="text-emerald-600 font-semibold hover:underline focus:outline-none">Sign up</button>
                    </p>
                </div>

                <div id="form-container-signup" className="transition-all duration-300 opacity-0 scale-95 hidden">
                    <div className="text-center mb-6">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                            <i className="fa-regular fa-user text-xl"></i>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
                        <p className="text-sm text-gray-500 mt-1">Join FarmRoute today</p>
                    </div>

                    <form id="signup-form" className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Join as a:</label>
                            <input type="hidden" name="role" id="user-role" defaultValue="farmer" />
                            <div className="grid grid-cols-2 gap-3">
                                <button type="button" id="role-farmer" data-legacy-click={"selectRole('farmer')"} className="flex items-center justify-center space-x-2 py-2.5 rounded-xl text-sm font-semibold border-2 border-emerald-700 bg-emerald-50 text-emerald-800 transition">
                                    <i className="fa-solid fa-wheat-awn"></i>
                                    <span>Farmer</span>
                                </button>
                                <button type="button" id="role-driver" data-legacy-click={"selectRole('driver')"} className="flex items-center justify-center space-x-2 py-2.5 rounded-xl text-sm font-medium border-2 border-gray-200 bg-white text-gray-500 hover:border-gray-300 transition">
                                    <i className="fa-solid fa-truck"></i>
                                    <span>Driver</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="signup-name" className="block text-xs font-semibold text-gray-600 mb-1">Full Name</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <i className="fa-regular fa-user"></i>
                                </span>
                                <input name="name" id="signup-name" type="text" autoComplete="name" required placeholder="John Doe" className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="signup-phone" className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <i className="fa-solid fa-phone text-xs"></i>
                                </span>
                                <input name="number" id="signup-phone" type="tel" autoComplete="tel" required placeholder="08012345678" className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="signup-email" className="block text-xs font-semibold text-gray-600 mb-1">Email Address <span className="font-normal text-gray-400">(optional)</span></label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <i className="fa-regular fa-envelope"></i>
                                </span>
                                <input name="email" id="signup-email" type="email" autoComplete="email" placeholder="name@example.com" className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="signup-password" className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                                    <i className="fa-solid fa-lock"></i>
                                </span>
                                <input name="password" id="signup-password" type="password" autoComplete="new-password" required placeholder="Minimum 6 characters" className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition" />
                                <span id="toggle-signup-password" className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer hover:text-gray-600">
                                    <i className="fa-regular fa-eye text-xs"></i>
                                </span>
                            </div>
                        </div>

                        <div className="flex items-start">
                            <input name="terms" id="terms" type="checkbox" required className="w-4 h-4 mt-0.5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" />
                            <label htmlFor="terms" className="ml-2 text-xs text-gray-500 cursor-pointer select-none leading-normal">
                                I agree to the <a href="#" className="text-emerald-600 font-semibold hover:underline">Terms of Service</a> and <a href="#" className="text-emerald-600 font-semibold hover:underline">Privacy Policy</a>
                            </label>
                        </div>

                        <button type="submit" className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold shadow-md transition">
                            Sign Up
                        </button>
                    </form>

                    <div className="relative my-6 text-center">
                        <hr className="border-gray-200" />
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-50/30 px-3 text-[10px] font-medium uppercase tracking-wider text-gray-400">or continue with</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                        <button type="button" id="google-signup-btn" className="flex items-center justify-center space-x-2 py-2.5 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 hover:border-emerald-500 hover:text-emerald-800 transition">
                            <i className="fa-brands fa-google text-red-500"></i>
                            <span>Google</span>
                        </button>
                    </div>

                    <p className="text-center text-xs text-gray-500 mt-6">
                        Already have an account? <button type="button" data-legacy-click={"switchTab('login')"} className="text-emerald-600 font-semibold hover:underline focus:outline-none">Login</button>
                    </p>
                </div>

            </div>

        </div>

    </div>

    

    
</div>;
}
    