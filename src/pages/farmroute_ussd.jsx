import React from "react";
import { Link } from "../Router.jsx";
import { usePageLogic } from "../usePageLogic.js";
import { initialize as inline_1 } from "../legacy/logic/farmroute_ussd_1.js";

const title = "FarmRoute USSD Farmer Simulator";
const bodyClass = "min-h-screen grid place-items-center bg-[radial-gradient(circle_at_top,#164e36_0,#07130d_42%,#020617_100%)] text-slate-50 p-6 font-sans";
const logicOrder = [["inline", "inline_1", ""]];
const initializers = {"inline_1": inline_1};

export default function FarmrouteUssdPage() {
  const handleClick = usePageLogic({ title, logicOrder, initializers });
  return <div className={bodyClass} onClick={handleClick}>
    <div className="w-full max-w-[430px]">
        <div className="bg-gray-900 border border-white/10 rounded-[34px] p-[22px] shadow-[0_28px_80px_rgba(0,0,0,0.45)]">
            <div className="flex items-center justify-between gap-3 mb-4 text-green-100 font-bold">
                <span>FarmRoute USSD</span>
                <span className="text-xs text-green-300">*347*01#</span>
            </div>

            <div className="bg-lime-200 text-[#13210f] rounded-[18px] min-h-[430px] p-[18px] flex flex-col border-[5px] border-slate-900 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.14)]">
                <div className="flex items-center justify-between text-xs text-[#4d633f] border-b border-[#13210f]/20 pb-2.5 mb-3">
                    <span id="session-label">Checking session...</span>
                    <span id="clock-label">00:00</span>
                </div>
                <pre id="ussd-output" className="whitespace-pre-wrap break-words m-0 flex-1 font-mono text-[15px] leading-[1.45]">Loading FarmRoute USSD...</pre>
                <form id="ussd-form" className="flex gap-2 mt-3.5 border-t border-[#13210f]/20 pt-3">
                    <input id="ussd-input" autoComplete="off" placeholder="Type reply" className="min-w-0 flex-1 border border-[#13210f]/30 bg-white/50 text-[#13210f] rounded-[10px] px-3 py-2.5 text-[15px] font-semibold outline-none focus:border-green-800 focus:ring-4 focus:ring-green-800/15" />
                    <button type="submit" className="rounded-[10px] bg-green-900 text-white font-bold px-4 cursor-pointer">Send</button>
                </form>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mt-4" aria-label="USSD keypad">
                <div className="min-h-12 bg-gray-800 rounded-[14px] grid place-items-center text-gray-200 font-extrabold border border-white/10 cursor-pointer select-none" data-key="1">1<small className="block text-[9px] font-semibold text-slate-400 mt-0.5">Menu</small></div>
                <div className="min-h-12 bg-gray-800 rounded-[14px] grid place-items-center text-gray-200 font-extrabold border border-white/10 cursor-pointer select-none" data-key="2">2<small className="block text-[9px] font-semibold text-slate-400 mt-0.5">ABC</small></div>
                <div className="min-h-12 bg-gray-800 rounded-[14px] grid place-items-center text-gray-200 font-extrabold border border-white/10 cursor-pointer select-none" data-key="3">3<small className="block text-[9px] font-semibold text-slate-400 mt-0.5">DEF</small></div>
                <div className="min-h-12 bg-gray-800 rounded-[14px] grid place-items-center text-gray-200 font-extrabold border border-white/10 cursor-pointer select-none" data-key="4">4<small className="block text-[9px] font-semibold text-slate-400 mt-0.5">GHI</small></div>
                <div className="min-h-12 bg-gray-800 rounded-[14px] grid place-items-center text-gray-200 font-extrabold border border-white/10 cursor-pointer select-none" data-key="5">5<small className="block text-[9px] font-semibold text-slate-400 mt-0.5">JKL</small></div>
                <div className="min-h-12 bg-gray-800 rounded-[14px] grid place-items-center text-gray-200 font-extrabold border border-white/10 cursor-pointer select-none" data-key="6">6<small className="block text-[9px] font-semibold text-slate-400 mt-0.5">MNO</small></div>
                <div className="min-h-12 bg-gray-800 rounded-[14px] grid place-items-center text-gray-200 font-extrabold border border-white/10 cursor-pointer select-none" data-key="7">7<small className="block text-[9px] font-semibold text-slate-400 mt-0.5">PQRS</small></div>
                <div className="min-h-12 bg-gray-800 rounded-[14px] grid place-items-center text-gray-200 font-extrabold border border-white/10 cursor-pointer select-none" data-key="8">8<small className="block text-[9px] font-semibold text-slate-400 mt-0.5">TUV</small></div>
                <div className="min-h-12 bg-gray-800 rounded-[14px] grid place-items-center text-gray-200 font-extrabold border border-white/10 cursor-pointer select-none" data-key="9">9<small className="block text-[9px] font-semibold text-slate-400 mt-0.5">WXYZ</small></div>
                <div className="min-h-12 bg-gray-800 rounded-[14px] grid place-items-center text-gray-200 font-extrabold border border-white/10 cursor-pointer select-none" data-key="*">*</div>
                <div className="min-h-12 bg-gray-800 rounded-[14px] grid place-items-center text-gray-200 font-extrabold border border-white/10 cursor-pointer select-none" data-key="0">0<small className="block text-[9px] font-semibold text-slate-400 mt-0.5">Back</small></div>
                <div className="min-h-12 bg-gray-800 rounded-[14px] grid place-items-center text-gray-200 font-extrabold border border-white/10 cursor-pointer select-none" data-key="#">#</div>
            </div>
        </div>
        <p className="mt-3.5 text-green-200 text-xs leading-relaxed">Standalone simulator. It is not linked from the main dashboard, but it uses real FarmRoute Firebase auth and product records.</p>
    </div>

    
</div>;
}
    