

export function initialize() {

  (function() {
    const toggle = document.getElementById("chat-toggle");
    const box = document.getElementById("chat-box");
    const closeBtn = document.getElementById("chat-close");
    const input = document.getElementById("chat-input");
    const sendBtn = document.getElementById("chat-send");
    const messages = document.getElementById("chat-messages");

    let isOpen = false;

    function toggleChat() {
      isOpen = !isOpen;
      box.style.display = isOpen ? "flex" : "none";
      if (isOpen) input.focus();
    }

    toggle.onclick = toggleChat;
    closeBtn.onclick = toggleChat;

    function addMessage(text, sender) {
      const div = document.createElement("div");
      div.style.alignSelf = sender === "user" ? "flex-end" : "flex-start";
      div.style.maxWidth = "80%";
      const bg = sender === "user" ? "#dcfce7" : "#f3f4f6";
      const textColor = sender === "user" ? "#166534" : "#1f2937";
      div.innerHTML = `<span style="background:${bg};color:${textColor};padding:8px 12px;border-radius:12px;display:inline-block;line-height:1.4;">${escapeHtml(text)}</span>`;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function escapeHtml(text) {
      const div = document.createElement("div");
      div.textContent = text;
      return div.innerHTML;
    }

    async function sendMessage() {
      const text = input.value.trim();
      if (!text) return;
      addMessage(text, "user");
      input.value = "";
      
      const typingDiv = document.createElement("div");
      typingDiv.style.alignSelf = "flex-start";
      typingDiv.style.maxWidth = "80%";
      typingDiv.innerHTML = `<span style="background:#f3f4f6;color:#6b7280;padding:8px 12px;border-radius:12px;display:inline-block;"><span class="typing-dots">Typing<span>.</span><span>.</span><span>.</span></span></span>`;
      messages.appendChild(typingDiv);
      messages.scrollTop = messages.scrollHeight;

      try {
        const res = await fetch("/api/ask-assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text }),
        });
        const data = await res.json().catch(() => ({}));
        typingDiv.remove();
        if (!res.ok) throw new Error(data.error || "Assistant request failed.");
        if (typeof data.reply !== "string" || !data.reply.trim()) throw new Error("Assistant returned an empty response.");
        addMessage(data.reply, "bot");
      } catch (err) {
        console.error("Chat error:", err);
        typingDiv.remove();
        addMessage("Assistant's a bit busy — try again shortly.", "bot");
      }
    }

    sendBtn.onclick = sendMessage;
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendMessage();
    });

    const style = document.createElement("style");
    style.textContent = `
      .typing-dots span { display: inline-block; animation: typing 1.4s infinite; opacity: 0; }
      .typing-dots span:nth-child(1) { animation-delay: 0s; }
      .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
      .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes typing { 0%, 80%, 100% { opacity: 0; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-2px); } }
    `;
    document.head.appendChild(style);
  })();

  return {};
}
