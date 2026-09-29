const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function allowedOrigins() {
  return (process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function isAllowedOrigin(origin) {
  return Boolean(origin) && allowedOrigins().includes(origin);
}

function imageFromDataUrl(value) {
  const match = /^data:(image\/(?:png|jpe?g|webp));base64,([A-Za-z0-9+/=]+)$/i.exec(value || "");
  if (!match) return null;

  const base64 = match[2];
  const byteLength = Buffer.byteLength(base64, "base64");
  if (!byteLength || byteLength > MAX_IMAGE_BYTES) return null;

  return { base64, mimeType: match[1].toLowerCase() };
}

export const config = {
  api: { bodyParser: { sizeLimit: "7mb" } },
};

// Keeps the ImgBB credential on the server. The browser receives only the
// resulting public image URL, never the upload API key.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const origin = req.headers.origin;
  if (!isAllowedOrigin(origin)) {
    return res.status(403).json({ error: "Origin is not allowed" });
  }

  if (!process.env.IMGBB_API_KEY) {
    console.error("IMGBB_API_KEY environment variable is not set");
    return res.status(500).json({ error: "Image upload is unavailable" });
  }

  const image = imageFromDataUrl(req.body?.image);
  if (!image) {
    return res.status(400).json({ error: "Use a PNG, JPEG, or WebP image smaller than 5 MB" });
  }

  try {
    const payload = new URLSearchParams({ image: image.base64 });
    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${encodeURIComponent(process.env.IMGBB_API_KEY)}`,
      { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: payload }
    );
    const result = await response.json();

    if (!response.ok || !result.success || !result.data?.url) {
      console.error("ImgBB upload failed", response.status, result.error?.message);
      return res.status(502).json({ error: "Image upload failed" });
    }

    return res.status(200).json({ url: result.data.url });
  } catch (error) {
    console.error("Image upload failed", error.message);
    return res.status(500).json({ error: "Image upload failed" });
  }
}
