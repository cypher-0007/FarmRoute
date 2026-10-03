const MAX_IMAGE_BYTES = 3 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_SHELF_LIFE_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_SHELF_LIFE_API_KEY is not configured");
    return res.status(503).json({ error: "Shelf-life analysis is not configured on the server." });
  }

  const listing = req.body?.listing;
  const imageUrl = req.body?.imageUrl;
  if (!listing || typeof listing.name !== "string" || listing.name.length > 120) {
    return res.status(400).json({ error: "A valid listing is required." });
  }

  try {
    const parts = [{ text: `Assess the visible freshness and remaining shelf life of this Nigerian farm produce listing. Use all supplied listing details, especially harvest date, status, quantity, and description, together with the image when provided. Treat the image as evidence of visible condition, not age. Estimate remaining shelf life from both the crop type and harvest date. Do not claim certainty from an image alone. Return ONLY valid JSON with these keys: condition (Fresh, Use soon, or Spoilage signs), estimatedShelfLife (short human-readable remaining time estimate), riskScore (integer 0-100, higher means more risk), storageAdvice (brief phrase), routingMode (practical transport/storage handling mode based on shelf life and risk), summary (one or two sentences explaining the listing details and visible evidence, including uncertainty), recommendation (one practical next step). Do not diagnose safety or say produce is safe to eat. Listing: ${JSON.stringify({ name: listing.name, category: listing.category, harvestDate: listing.harvestDate, description: listing.description, status: listing.status, quantity: listing.quantity, unit: listing.unit, location: listing.location, routeFrom: listing.routeFrom, routeTo: listing.routeTo })}` }];
    if (imageUrl) {
      let parsedUrl;
      try {
        parsedUrl = new URL(imageUrl);
      } catch {
        return res.status(400).json({ error: "The listing photo URL is invalid." });
      }
      if (parsedUrl.protocol !== "https:" || parsedUrl.hostname !== "i.ibb.co" || parsedUrl.username || parsedUrl.password) {
        return res.status(400).json({ error: "The listing photo must be an HTTPS ImgBB image." });
      }
      const imageResponse = await fetch(parsedUrl, { redirect: "error" });
      if (!imageResponse.ok) return res.status(400).json({ error: "The listing photo could not be downloaded." });
      const mimeType = (imageResponse.headers.get("content-type") || "").split(";")[0].toLowerCase();
      if (!ALLOWED_IMAGE_TYPES.has(mimeType)) return res.status(400).json({ error: "Use a JPEG, PNG, or WebP listing photo." });
      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      if (imageBuffer.length > MAX_IMAGE_BYTES) return res.status(413).json({ error: "The listing photo must be 3 MB or smaller." });
      parts.push({ inline_data: { mime_type: mimeType, data: imageBuffer.toString("base64") } });
    }

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent", {
      method: "POST",
      headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.2 }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini shelf-life request failed:", response.status, errorText);
      return res.status(502).json({ error: "Gemini could not analyze this listing right now. Please try again." });
    }

    const payload = await response.json();
    const text = payload.candidates?.[0]?.content?.parts?.find(part => part.text)?.text;
    if (!text) return res.status(502).json({ error: "Gemini returned no analysis. Please try again." });

    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch {
      console.error("Gemini returned invalid shelf-life JSON");
      return res.status(502).json({ error: "Gemini returned an unreadable analysis. Please try again." });
    }

    const conditions = new Set(["Fresh", "Use soon", "Spoilage signs"]);
    const condition = conditions.has(analysis.condition) ? analysis.condition : "Use soon";
    const riskScore = Number.isFinite(Number(analysis.riskScore))
      ? Math.max(0, Math.min(100, Math.round(Number(analysis.riskScore))))
      : 50;
    return res.status(200).json({
      condition,
      riskScore,
      estimatedShelfLife: String(analysis.estimatedShelfLife || "Unable to estimate").slice(0, 80),
      storageAdvice: String(analysis.storageAdvice || "Store in a cool, dry place").slice(0, 100),
      routingMode: String(analysis.routingMode || analysis.storageAdvice || "Standard handling").slice(0, 100),
      summary: String(analysis.summary || "No freshness details were returned.").slice(0, 500),
      recommendation: String(analysis.recommendation || "Inspect the produce again before dispatch.").slice(0, 250)
    });
  } catch (error) {
    console.error("Shelf-life analysis error:", error);
    return res.status(500).json({ error: "Shelf-life analysis failed. Please try again." });
  }
}
