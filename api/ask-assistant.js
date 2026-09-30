export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;

  const allowedOrigins = (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const origin = req.headers.origin;
  const forwardedHost = req.headers["x-forwarded-host"] || req.headers.host || "";
  const requestHost = String(forwardedHost).split(",")[0].trim().toLowerCase();
  let originHost = "";
  try {
    originHost = origin ? new URL(origin).host.toLowerCase() : "";
  } catch {
    originHost = "";
  }
  const isSameOrigin = Boolean(originHost && requestHost && originHost === requestHost);
  if (!isSameOrigin && (!origin || !allowedOrigins.includes(origin))) {
    return res.status(403).json({ error: "Origin is not allowed" });
  }

  if (!message || typeof message !== "string" || message.length > 1000) {
    return res.status(400).json({ error: "Message must be between 1 and 1,000 characters" });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("GEMINI_API_KEY environment variable is not set");
      return res.status(500).json({
        reply: "Assistant's a bit busy right now — try again shortly.",
        error: "GEMINI_API_KEY environment variable is not set",
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        signal: AbortSignal.timeout(20000),
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful assistant for FarmRoute, an app connecting Nigerian farmers with drivers to transport goods. Keep answers short, practical, and friendly.\n\nUser: ${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Gemini API error: ${response.status}`, errorBody);
      return res.status(response.status).json({
        reply: "Assistant's a bit busy right now — try again shortly.",
        error: `Gemini API error: ${response.status}`,
      });
    }

    const result = await response.json();
    if (!result.candidates || result.candidates.length === 0) {
      console.error("Gemini API returned no candidates", result);
      return res.status(500).json({
        reply: "Assistant's a bit busy right now — try again shortly.",
        error: "No candidates returned from Gemini API",
      });
    }

    const reply =
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't process that.";

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Assistant error:", err);
    res.status(err.name === "TimeoutError" ? 504 : 500).json({
      reply: "Assistant's a bit busy right now — try again shortly.",
      error: err.message,
    });
  }
}
