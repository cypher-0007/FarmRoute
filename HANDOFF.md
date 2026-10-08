# FarmRoute React migration

## Current result

- All 19 original HTML screens now load through React: the homepage plus login, both USSD screens, seven farmer pages, and eight driver pages.
- The homepage is written as React components in `src/Home.jsx`.
- The other 18 screens are JSX components in `src/pages/` and are selected by URL in `src/App.jsx`.
- The migrated source HTML snapshots in `legacy/` and the one-time migration script have been removed. The `.html` files at the app routes are small React entry documents and remain in use.
- Inline scripts were extracted to `src/legacy/logic/` as page initializer modules. `src/usePageLogic.js` starts them from a React effect after the page DOM mounts and dispatches the remaining inline button actions. This preserves Firebase, payment, chat, and page-specific flows. Some initializers still use the prior DOM-oriented implementation and should be rewritten as domain hooks/state as a follow-up.
- The Firebase services, API routes, Vercel functions, and backend code remain in place.

## Build and preview

- `npm run build` succeeds and emits all 19 React entry documents and their route chunks.
- `npm run preview` serves the production build.
- `npm run dev` starts Vite, but in the managed desktop sandbox Vite's dependency optimizer currently hits an access-denied error while traversing outside the workspace to prebundle React. This did not affect the production build or preview. Verify `npm run dev` in the regular local shell/environment.
- API endpoints still need the Vercel dev runtime (`npm run backend:dev`) when exercising serverless functions locally.

## Next work for a strict all-React logic refactor

Replace the per-page initializer modules in `src/legacy/logic/` with domain hooks and React state, beginning with login/auth, then farmer and driver workflows. Preserve Firebase calls, validation, notifications, navigation, and Paystack behavior while removing direct DOM queries and `innerHTML` updates. The page UIs and routes are already React JSX.
