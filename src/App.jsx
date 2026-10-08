import React, { lazy, Suspense } from 'react';
import { Link, usePathname } from './Router.jsx';
import Home from './Home.jsx';

const pageComponents = {
  '/login.html': lazy(() => import('./pages/login.jsx')),
  '/ussd.html': lazy(() => import('./pages/ussd.jsx')),
  '/farmroute_ussd.html': lazy(() => import('./pages/farmroute_ussd.jsx')),
  '/Farmers/dashboard.html': lazy(() => import('./pages/Farmers_dashboard.jsx')),
  '/Farmers/add_produce.html': lazy(() => import('./pages/Farmers_add_produce.jsx')),
  '/Farmers/listings.html': lazy(() => import('./pages/Farmers_listings.jsx')),
  '/Farmers/messages.html': lazy(() => import('./pages/Farmers_messages.jsx')),
  '/Farmers/notifications.html': lazy(() => import('./pages/Farmers_notifications.jsx')),
  '/Farmers/payment.html': lazy(() => import('./pages/Farmers_payment.jsx')),
  '/Farmers/profile.html': lazy(() => import('./pages/Farmers_profile.jsx')),
  '/Drivers/dashboard.html': lazy(() => import('./pages/Drivers_dashboard.jsx')),
  '/Drivers/available_loads.html': lazy(() => import('./pages/Drivers_available_loads.jsx')),
  '/Drivers/active_trips.html': lazy(() => import('./pages/Drivers_active_trips.jsx')),
  '/Drivers/messages.html': lazy(() => import('./pages/Drivers_messages.jsx')),
  '/Drivers/notifications.html': lazy(() => import('./pages/Drivers_notifications.jsx')),
  '/Drivers/payments.html': lazy(() => import('./pages/Drivers_payments.jsx')),
  '/Drivers/profile.html': lazy(() => import('./pages/Drivers_profile.jsx')),
  '/Drivers/route_planner.html': lazy(() => import('./pages/Drivers_route_planner.jsx')),
};

function NotFound() {
  return <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-50 p-8 text-center">
    <h1 className="text-3xl font-bold text-emerald-900">Page not found</h1>
    <p className="text-gray-600">That FarmRoute page doesn’t exist.</p>
    <Link className="rounded-lg bg-emerald-800 px-5 py-3 font-semibold text-white" to="/">Return home</Link>
  </main>;
}

export default function App() {
  const pathname = usePathname();
  if (pathname === '/' || pathname === '/index.html') return <Home />;
  const Page = pageComponents[pathname];
  if (!Page) return <NotFound />;
  return <Suspense fallback={<main className="p-8 text-center text-emerald-900">Loading FarmRoute…</main>}><Page /></Suspense>;
}
