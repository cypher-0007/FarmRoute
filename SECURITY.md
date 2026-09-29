# FarmRoute security setup

## Before you deploy

1. Rotate the ImgBB key that was previously embedded in `Farmers/add_produce.html`. It has been removed from the current code, but it existed in the public Git history and must be treated as compromised.
2. In Vercel, add `IMGBB_API_KEY`, `GEMINI_API_KEY`, and `ALLOWED_ORIGINS` as encrypted environment variables. Do not add them to a source file or commit a real `.env` file.
3. Set `ALLOWED_ORIGINS` to a comma-separated list of the exact sites permitted to call the FarmRoute API routes, such as `https://farmroute.example,https://www.farmroute.example`.
4. Restrict the Firebase browser API key in Google Cloud Console to the FarmRoute web domains. Firebase web configuration is intentionally visible to browsers; Firebase Authentication and Firestore Security Rules are what protect data.
5. Keep only a Paystack `pk_` public key in the browser. Keep Paystack secret keys and webhook verification on a server-only route or in hosting-provider environment variables.

## Data and document handling

- Do not commit exports of users, payments, chats, identity documents, backups, service-account JSON files, or certificates.
- Put private local material in `private/` or `backups/`; both are excluded from Git. Store production documents in a restricted cloud location with named-user access, MFA, and backups.
- Review Firestore Security Rules before production. Client-side checks do not replace database rules.

## If a secret is exposed

Revoke or rotate it in the provider dashboard immediately, replace the value in the hosting environment, redeploy, and inspect access or billing logs. Removing a value from a later Git commit does not remove it from existing public Git history.
