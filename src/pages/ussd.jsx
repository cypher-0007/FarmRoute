import React from "react";
import { Link } from "../Router.jsx";
import { usePageLogic } from "../usePageLogic.js";
import { initialize as inline_0 } from "../legacy/logic/ussd_0.js";

const title = "FarmRoute USSD Farmer Simulator";
const bodyClass = "";
const logicOrder = [["inline", "inline_0", ""]];
const initializers = {"inline_0": inline_0};

export default function UssdPage() {
  const handleClick = usePageLogic({ title, logicOrder, initializers });
  return <div className={bodyClass} onClick={handleClick}><style>{"\n        :root {\n            color-scheme: dark;\n            --phone: #111827;\n            --screen: #d9f99d;\n            --ink: #13210f;\n            --muted: #4d633f;\n            --key: #1f2937;\n            --accent: #22c55e;\n        }\n\n        * {\n            box-sizing: border-box;\n        }\n\n        body {\n            margin: 0;\n            min-height: 100vh;\n            display: grid;\n            place-items: center;\n            background: radial-gradient(circle at top, #164e36 0, #07130d 42%, #020617 100%);\n            font-family: Arial, Helvetica, sans-serif;\n            color: #f8fafc;\n            padding: 24px;\n        }\n\n        .shell {\n            width: min(430px, 100%);\n        }\n\n        .phone {\n            background: var(--phone);\n            border: 1px solid rgba(255, 255, 255, 0.12);\n            border-radius: 34px;\n            padding: 22px;\n            box-shadow: 0 28px 80px rgba(0, 0, 0, 0.45);\n        }\n\n        .brand {\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            gap: 12px;\n            margin-bottom: 16px;\n            color: #dcfce7;\n            font-weight: 700;\n        }\n\n        .signal {\n            font-size: 12px;\n            color: #86efac;\n        }\n\n        .screen {\n            background: var(--screen);\n            color: var(--ink);\n            border-radius: 18px;\n            min-height: 430px;\n            padding: 18px;\n            display: flex;\n            flex-direction: column;\n            border: 5px solid #0f172a;\n            box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.14);\n        }\n\n        .screen-top {\n            display: flex;\n            align-items: center;\n            justify-content: space-between;\n            font-size: 12px;\n            color: var(--muted);\n            border-bottom: 1px solid rgba(19, 33, 15, 0.2);\n            padding-bottom: 10px;\n            margin-bottom: 12px;\n        }\n\n        pre {\n            white-space: pre-wrap;\n            word-break: break-word;\n            margin: 0;\n            flex: 1;\n            font-family: \"Courier New\", monospace;\n            font-size: 15px;\n            line-height: 1.45;\n        }\n\n        .input-row {\n            display: flex;\n            gap: 8px;\n            margin-top: 14px;\n            border-top: 1px solid rgba(19, 33, 15, 0.2);\n            padding-top: 12px;\n        }\n\n        input {\n            min-width: 0;\n            flex: 1;\n            border: 1px solid rgba(19, 33, 15, 0.28);\n            background: rgba(255, 255, 255, 0.5);\n            color: var(--ink);\n            border-radius: 10px;\n            padding: 11px 12px;\n            font: 600 15px Arial, Helvetica, sans-serif;\n            outline: none;\n        }\n\n        input:focus {\n            border-color: #166534;\n            box-shadow: 0 0 0 3px rgba(22, 101, 52, 0.16);\n        }\n\n        button {\n            border: 0;\n            border-radius: 10px;\n            background: #14532d;\n            color: white;\n            font-weight: 700;\n            padding: 0 16px;\n            cursor: pointer;\n        }\n\n        .keys {\n            display: grid;\n            grid-template-columns: repeat(3, 1fr);\n            gap: 10px;\n            margin-top: 16px;\n        }\n\n        .key {\n            min-height: 48px;\n            background: var(--key);\n            border-radius: 14px;\n            display: grid;\n            place-items: center;\n            color: #e5e7eb;\n            font-weight: 800;\n            border: 1px solid rgba(255, 255, 255, 0.08);\n            cursor: pointer;\n            user-select: none;\n        }\n\n        .key small {\n            display: block;\n            font-size: 9px;\n            font-weight: 600;\n            color: #94a3b8;\n            margin-top: 2px;\n        }\n\n        .hint {\n            margin-top: 14px;\n            color: #bbf7d0;\n            font-size: 12px;\n            line-height: 1.4;\n        }\n    "}</style>
    <div className="shell">
        <div className="phone">
            <div className="brand">
                <span>FarmRoute USSD</span>
                <span className="signal">*347*01#</span>
            </div>

            <div className="screen">
                <div className="screen-top">
                    <span id="session-label">Checking session...</span>
                    <span id="clock-label">00:00</span>
                </div>
                <pre id="ussd-output">Loading FarmRoute USSD...</pre>
                <form id="ussd-form" className="input-row">
                    <input id="ussd-input" autoComplete="off" placeholder="Type reply" />
                    <button type="submit">Send</button>
                </form>
            </div>

            <div className="keys" aria-label="USSD keypad">
                <div className="key" data-key="1">1<small>Menu</small></div>
                <div className="key" data-key="2">2<small>ABC</small></div>
                <div className="key" data-key="3">3<small>DEF</small></div>
                <div className="key" data-key="4">4<small>GHI</small></div>
                <div className="key" data-key="5">5<small>JKL</small></div>
                <div className="key" data-key="6">6<small>MNO</small></div>
                <div className="key" data-key="7">7<small>PQRS</small></div>
                <div className="key" data-key="8">8<small>TUV</small></div>
                <div className="key" data-key="9">9<small>WXYZ</small></div>
                <div className="key" data-key="*">*</div>
                <div className="key" data-key="0">0<small>Back</small></div>
                <div className="key" data-key="#">#</div>
            </div>
        </div>
        <p className="hint">Standalone simulator. It is not linked from the main dashboard, but it uses real FarmRoute Firebase auth and product records.</p>
    </div>

    
</div>;
}
    