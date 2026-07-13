import { auth } from "/backend/firebaseConfig.js";
import { getFunctions, httpsCallable } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-functions.js";

const functions = getFunctions(auth.app, "us-central1");
const askFarmRoute = httpsCallable(functions, "farmrouteChat");
const history = [];

const chat = document.createElement("div");
chat.innerHTML = `
  <button id="farmroute-chat-toggle" aria-label="Open FarmRoute Assistant" class="fixed bottom-5 right-5 z-[70] h-14 w-14 rounded-full bg-emerald-700 text-white shadow-lg shadow-emerald-950/30 hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-emerald-300 transition">
    <i class="fa-solid fa-sparkles text-lg"></i>
  </button>
  <section id="farmroute-chat-panel" class="hidden fixed bottom-24 right-4 sm:right-5 z-[70] w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl">
    <header class="flex items-center justify-between bg-emerald-800 px-4 py-3 text-white">
      <div><p class="font-bold text-sm">FarmRoute Assistant</p><p class="text-xs text-emerald-100">Help with using FarmRoute</p></div>
      <button id="farmroute-chat-close" aria-label="Close chat" class="h-8 w-8 rounded-lg hover:bg-white/10"><i class="fa-solid fa-xmark"></i></button>
    </header>
    <div id="farmroute-chat-messages" class="h-80 space-y-3 overflow-y-auto bg-slate-50 p-4 text-sm">
      <div class="max-w-[88%] rounded-2xl rounded-tl-sm bg-white p-3 text-slate-700 shadow-sm">Hi! I can help you list produce, accept loads, track trips, and understand payments.</div>
    </div>
    <form id="farmroute-chat-form" class="flex gap-2 border-t border-slate-100 p-3">
      <input id="farmroute-chat-input" maxlength="1000" required placeholder="Ask about FarmRoute..." class="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100">
      <button class="rounded-xl bg-emerald-700 px-3 text-white hover:bg-emerald-800 disabled:opacity-50" aria-label="Send message"><i class="fa-solid fa-paper-plane"></i></button>
    </form>
  </section>`;
document.body.appendChild(chat);

const panel = document.getElementById("farmroute-chat-panel");
const messages = document.getElementById("farmroute-chat-messages");
const form = document.getElementById("farmroute-chat-form");
const input = document.getElementById("farmroute-chat-input");

function addMessage(content, role) {
  const bubble = document.createElement("div");
  bubble.className = role === "user"
    ? "ml-auto max-w-[88%] rounded-2xl rounded-tr-sm bg-emerald-700 p-3 text-white"
    : "max-w-[88%] rounded-2xl rounded-tl-sm bg-white p-3 text-slate-700 shadow-sm";
  bubble.textContent = content;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
}

document.getElementById("farmroute-chat-toggle").addEventListener("click", () => panel.classList.toggle("hidden"));
document.getElementById("farmroute-chat-close").addEventListener("click", () => panel.classList.add("hidden"));

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const message = input.value.trim();
  if (!message) return;
  if (!auth.currentUser) {
    addMessage("Please sign in first so I can help you use FarmRoute.", "assistant");
    return;
  }

  const submit = form.querySelector("button");
  addMessage(message, "user");
  input.value = "";
  input.disabled = submit.disabled = true;
  try {
    const result = await askFarmRoute({ message, history });
    const reply = result.data.reply;
    history.push({ role: "user", content: message }, { role: "assistant", content: reply });
    addMessage(reply, "assistant");
  } catch (error) {
    console.error("FarmRoute Assistant error:", error);
    addMessage(error.code === "functions/unauthenticated" ? "Please sign in and try again." : "I can't respond right now. Please try again shortly.", "assistant");
  } finally {
    input.disabled = submit.disabled = false;
    input.focus();
  }
});
