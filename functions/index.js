const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const OpenAI = require("openai");

const openaiApiKey = defineSecret("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");

const FARMROUTE_GUIDANCE = `You are FarmRoute Assistant, the in-app help chatbot for FarmRoute.
Only answer questions about using FarmRoute, including listing produce, accepting loads, active trips, delivery, escrow payments, account profiles, messages, and navigation.
Give short, practical, step-by-step guidance using the labels users see in the app. Do not invent policies, prices, delivery times, or account information. If a question needs account-specific help, tell the user to check the relevant FarmRoute page or contact support. Politely decline unrelated requests.`;

exports.farmrouteChat = onCall(
  { region: "us-central1", secrets: [openaiApiKey] },
  async (request) => {
    if (!request.auth) {
      throw new HttpsError("unauthenticated", "Please sign in to chat with FarmRoute Assistant.");
    }

    const message = String(request.data?.message || "").trim();
    if (!message || message.length > 1000) {
      throw new HttpsError("invalid-argument", "Enter a question of up to 1,000 characters.");
    }

    const history = Array.isArray(request.data?.history) ? request.data.history : [];
    const conversation = history
      .slice(-10)
      .filter((item) => item && ["user", "assistant"].includes(item.role) && typeof item.content === "string")
      .map((item) => ({ role: item.role, content: item.content.slice(0, 1000) }));
    conversation.push({ role: "user", content: message });

    try {
      const client = new OpenAI({ apiKey: openaiApiKey.value() });
      const response = await client.responses.create({
        model: "gpt-5-mini",
        instructions: FARMROUTE_GUIDANCE,
        input: conversation,
        max_output_tokens: 350,
        store: false
      });

      return { reply: response.output_text || "I couldn't prepare a response just now. Please try again." };
    } catch (error) {
      console.error("FarmRoute chat request failed:", error);
      throw new HttpsError("internal", "The assistant is temporarily unavailable. Please try again shortly.");
    }
  }
);
