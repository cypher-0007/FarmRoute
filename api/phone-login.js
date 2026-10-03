import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  const existingApp = getApps()[0];
  if (existingApp) return existingApp;

  const serviceAccountValue = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!serviceAccountValue) throw new Error("Firebase Admin credentials are not configured.");

  const serviceAccount = JSON.parse(serviceAccountValue);
  serviceAccount.private_key = serviceAccount.private_key?.replace(/\\n/g, "\n");
  return initializeApp({ credential: cert(serviceAccount) });
}

const normalizePhone = (phone) => String(phone || "").replace(/\D/g, "");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const requestHost = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim().toLowerCase();
  let originHost = "";
  try {
    originHost = req.headers.origin ? new URL(req.headers.origin).host.toLowerCase() : "";
  } catch {
    originHost = "";
  }
  if (originHost && requestHost && originHost !== requestHost) {
    return res.status(403).json({ error: "Origin is not allowed." });
  }

  const phoneInput = String(req.body?.phone || "").trim();
  const phone = normalizePhone(phoneInput);
  const password = String(req.body?.password || "");
  if (phone.length < 7 || phone.length > 15 || !password || password.length > 128) {
    return res.status(400).json({ error: "Enter a valid phone number and password." });
  }

  try {
    const app = getAdminApp();
    const db = getFirestore(app);
    let matches = await db.collection("users").where("phone", "==", phone).limit(2).get();
    if (matches.empty && phoneInput !== phone) {
      matches = await db.collection("users").where("phone", "==", phoneInput).limit(2).get();
    }
    if (matches.empty) {
      matches = await db.collection("users").where("phoneNumber", "==", phone).limit(2).get();
    }
    if (matches.empty && phoneInput !== phone) {
      matches = await db.collection("users").where("phoneNumber", "==", phoneInput).limit(2).get();
    }

    if (matches.size !== 1) {
      return res.status(401).json({ error: "Phone number or password is incorrect." });
    }

    const profile = matches.docs[0].data();
    const uid = profile.uid || matches.docs[0].id;

    const auth = getAuth(app);
    const authUser = await auth.getUser(uid);
    const authEmail = profile.email || authUser.email;
    const apiKey = process.env.FIREBASE_WEB_API_KEY;
    if (!authEmail || !apiKey) {
      console.error("Phone login requires an account email and FIREBASE_WEB_API_KEY.");
      return res.status(503).json({ error: "Phone login is not configured on the server." });
    }

    const authResponse = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: authEmail, password, returnSecureToken: true })
    });
    const authResult = await authResponse.json();
    if (!authResponse.ok || authResult.localId !== uid) {
      return res.status(401).json({ error: "Phone number or password is incorrect." });
    }

    const token = await auth.createCustomToken(uid);
    return res.status(200).json({ token });
  } catch (error) {
    console.error("Phone login error:", error);
    return res.status(500).json({ error: "Phone login could not be completed. Please try again." });
  }
}
