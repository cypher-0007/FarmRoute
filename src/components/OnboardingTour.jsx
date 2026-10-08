import React, { useEffect, useState } from "react";

const tours = {
  farmer: [
    { title: "Your dashboard", text: "Start here to check your deliveries, active shipments, pending matches, and recent activity. Use the month filter to review a different period.", target: "main > section > div:nth-of-type(2)" },
    { title: "List your produce", text: "Choose List New Produce to add a crop, quantity, price, and pickup details. Clear information helps drivers understand the load.", target: 'a[href="/Farmers/add_produce.html"]' },
    { title: "Track your listings", text: "My Listings is where you follow each load, review its matching or delivery status, and open the details when you need them.", target: 'a[href="/Farmers/listings.html"]' },
    { title: "Stay in touch", text: "Use Messages to coordinate with drivers. Notifications and the badges at the top alert you to updates that may need your attention.", target: 'a[href="/Farmers/messages.html"]' },
    { title: "Payments and profile", text: "Payments keeps your transaction information together. Visit Profile to review your account details, then use Logout when you finish.", target: 'a[href="/Farmers/payment.html"]' },
  ],
  driver: [
    { title: "Your dashboard", text: "Start here to check your trips, nearby loads, and delivery activity. Use the month filter to review a different period.", target: "main > section > div:nth-of-type(2)" },
    { title: "Set up your route profile", text: "Add your truck capacity, preferred routes, and cargo handling details. This helps matching prioritize loads that suit your setup.", target: 'a[href="/Drivers/route_planner.html"]' },
    { title: "Find and manage loads", text: "Available Loads is where you browse pickup opportunities. My Active Trips helps you keep track of loads you have accepted and deliveries in progress.", target: 'a[href="/Drivers/available_loads.html"]' },
    { title: "Plan your route", text: "Use Route Profile to maintain your usual lanes and vehicle details. Check trip and load details before setting off.", target: 'a[href="/Drivers/route_planner.html"]' },
    { title: "Stay in touch and get paid", text: "Use Messages and Notifications to coordinate and follow updates. Payments shows your payment activity; Profile holds your account details.", target: 'a[href="/Drivers/messages.html"]' },
  ],
};

export default function OnboardingTour({ role }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const steps = tours[role] || tours.farmer;
  const storageKey = `farmroute-tour-seen-${role}`;

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(storageKey)) setOpen(true);
    } catch {
      // The help button still makes the tour available if storage is disabled.
    }
  }, [storageKey]);

  useEffect(() => {
    if (!open) return undefined;
    const target = document.querySelector(steps[step]?.target);
    if (!target) return undefined;

    const previousTargetStyle = target.getAttribute("style");
    target.classList.add("farmroute-tour-highlight");

    return () => {
      target.classList.remove("farmroute-tour-highlight");
      if (previousTargetStyle === null) target.removeAttribute("style");
      else target.setAttribute("style", previousTargetStyle);
    };
  }, [open, step, steps]);

  const close = () => {
    setOpen(false);
    try { window.localStorage.setItem(storageKey, "true"); } catch { /* Ignore unavailable storage. */ }
  };

  return <>
    <style>{`.farmroute-tour-highlight { outline: 3px solid #facc15 !important; outline-offset: 3px; border-radius: 10px; }`}</style>
    <button type="button" onClick={() => { setStep(0); setOpen(true); }} className="rounded-lg border border-green-700 px-3 py-2 text-sm font-semibold text-green-800 hover:bg-green-50" aria-label="Open the getting started tour">
      <i className="fa-regular fa-circle-question mr-2" aria-hidden="true" />Getting started
    </button>
    {open && <div style={{ zIndex: 1000 }} className="fixed inset-0 flex items-center justify-center bg-gray-950/60 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <section style={{ position: "relative", zIndex: 1001 }} role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-description" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-sm font-semibold text-green-800">FarmRoute quick tour</span>
          <button type="button" onClick={close} className="rounded p-2 text-gray-500 hover:bg-gray-100" aria-label="Close tour"><i className="fa-solid fa-xmark" aria-hidden="true" /></button>
        </div>
        <div className="mb-5 h-2 overflow-hidden rounded-full bg-gray-100" aria-label={`Step ${step + 1} of ${steps.length}`}>
          <div className="h-full rounded-full bg-green-700 transition-all" style={{ width: `${((step + 1) / steps.length) * 100}%` }} />
        </div>
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Step {step + 1} of {steps.length}</p>
        <h2 id="tour-title" className="mt-2 text-2xl font-bold text-gray-900">{steps[step].title}</h2>
        <p id="tour-description" className="mt-3 min-h-20 leading-relaxed text-gray-600">{steps[step].text}</p>
        <div className="mt-7 flex items-center justify-between gap-3">
          <button type="button" onClick={close} className="text-sm font-medium text-gray-500 hover:text-gray-800">Skip tour</button>
          <div className="flex gap-2">
            {step > 0 && <button type="button" onClick={() => setStep((current) => current - 1)} className="rounded-lg border px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50">Back</button>}
            {step < steps.length - 1
              ? <button type="button" onClick={() => setStep((current) => current + 1)} className="rounded-lg bg-green-800 px-5 py-2 font-semibold text-white hover:bg-green-900">Next</button>
              : <button type="button" onClick={close} className="rounded-lg bg-green-800 px-5 py-2 font-semibold text-white hover:bg-green-900">Finish</button>}
          </div>
        </div>
      </section>
    </div>}
  </>;
}
