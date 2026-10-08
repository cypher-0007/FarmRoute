import React, { useEffect, useState } from 'react';
import { Link } from './Router.jsx';

const features = [
  { icon: 'fa-route', title: 'AI Route Optimization', description: 'Matches farmers to the best routes and trucks automatically.', card: 'border-blue-400 bg-blue-50', iconStyle: 'bg-blue-300 text-blue-600', titleStyle: 'text-blue-600' },
  { icon: 'fa-magnifying-glass', title: 'Quality Assessment', description: 'AI scans your produce and rates freshness instantly.', card: 'border-green-400 bg-green-50', iconStyle: 'bg-emerald-700 text-white', titleStyle: 'text-emerald-700' },
  { icon: 'fa-clock', title: 'Shelf-Life Clock', description: 'We prioritize urgent crops to get them to market on time.', card: 'border-amber-400 bg-amber-50', iconStyle: 'bg-amber-700 text-white', titleStyle: 'text-amber-700' },
];

const steps = [
  { title: 'Farmers List Produce', description: 'Farmers list their crops, quantity, and pick-up location.', image: '/assets/farmer.png', alt: 'Farmer listing crops' },
  { title: 'AI Matches & Optimizes', description: 'Our AI finds the best trucks and optimizes the most efficient routes.', image: '/assets/computer.png', alt: 'FarmRoute matching routes' },
  { title: 'Deliver to Market', description: 'Crops are picked up and delivered faster, cheaper, and with less waste.', image: '/assets/truck.png', alt: 'Produce delivery truck' },
];

function LoginActions({ mobile = false, onNavigate }) {
  const buttonClass = mobile ? 'rounded-md border-[2px] py-2 font-bold' : 'hidden rounded-md border-[2px] px-4 py-1.5 md:block';
  return <>
    <button className={`${buttonClass} border-[#569c41] bg-white text-[#569c41]`} onClick={onNavigate}>Login</button>
    <button className={`${buttonClass} border-[#569c41] bg-emerald-800 text-white`} onClick={onNavigate}>Sign Up</button>
  </>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const goToLogin = () => window.location.assign('/login.html');

  useEffect(() => {
    const updateHeader = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', updateHeader);
    return () => window.removeEventListener('scroll', updateHeader);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  return <header id="main-header" className={`left-0 top-0 z-50 w-full px-6 transition-all duration-300 ease-in-out max-sm:fixed max-sm:bg-white md:px-16 ${scrolled ? 'fixed bg-white py-2 shadow-md' : 'py-3'}`}>
    <nav className="flex w-full items-center justify-between pt-4">
      <Link to="/" aria-label="FarmRoute home"><img className="h-16 md:h-20" src="/assets/logo.png" alt="FarmRoute Logo" /></Link>
      <div className="hidden items-center gap-5 text-[1.15rem] font-semibold md:flex">
        <Link className="text-emerald-800" to="/">Home</Link>
        <a className="text-gray-600 hover:text-emerald-800" href="#3">How It Works</a>
        <a className="text-gray-600 hover:text-emerald-800" href="#2">Features</a>
      </div>
      <div className="flex items-center gap-3 text-[1.1rem] font-bold">
        <LoginActions onNavigate={goToLogin} />
        <button id="dropdown-btn" className="block text-2xl text-emerald-950 focus:outline-none md:hidden" aria-label="Toggle Menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          <i className={`fa-solid ${menuOpen ? 'fa-xmark' : 'fa-bars'}`} aria-hidden="true" />
        </button>
      </div>
    </nav>
    {menuOpen && <div id="dropdown-menu" className="mt-1 flex flex-col gap-1 rounded-sm bg-white text-[1.15rem] font-semibold md:hidden">
          <Link className="border-b border-gray-300 px-1 py-1 text-emerald-800" to="/" onClick={closeMenu}>Home</Link>
      <a className="border-b border-gray-300 px-1 py-1 text-gray-600 hover:text-emerald-800" href="#3" onClick={closeMenu}>How It Works</a>
      <a className="border-b border-gray-300 px-1 py-1 text-gray-600 hover:text-emerald-800" href="#2" onClick={closeMenu}>Features</a>
      <div className="flex flex-col gap-2 pb-1 pt-4"><LoginActions mobile onNavigate={goToLogin} /></div>
    </div>}
  </header>;
}

function Hero() {
  return <section className="min-h-[85vh] bg-[url('/assets/hero_bg.png')] bg-cover bg-center bg-no-repeat px-6 md:min-h-[93vh] md:px-1">
    <Header />
    <div className="mt-24 flex w-full flex-col gap-6 max-sm:pt-3 md:mt-20 md:w-1/2 md:pl-14 lg:w-2/5">
      <h1 className="text-[2.2rem] font-bold leading-none text-[#111827] md:text-[4rem]">Move More Crops. Waste Less Food.</h1>
      <p className="pt-3 text-[1.3rem] leading-none text-gray-600 md:text-[1.4rem]">AI-powered logistics that connects farmers,<br className="hidden md:block" /> optimizes routes, and gets your harvest<br className="hidden md:block" /> to market faster and cheaper.</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Link to="/login.html" className="w-full rounded-md bg-emerald-800 px-6 py-3 text-center font-semibold text-white sm:w-auto md:text-[1.3rem]">Find Transport</Link>
        <Link to="/login.html" className="w-full rounded-md border border-emerald-800 bg-white px-6 py-3 text-center font-semibold text-emerald-800 sm:w-auto md:text-[1.3rem]">Become a Driver</Link>
      </div>
    </div>
  </section>;
}

function FeatureCards() {
  return <section id="2" className="my-10 grid grid-cols-1 items-center justify-center gap-6 px-6 md:grid-cols-3 md:px-10">
    {features.map((feature) => <article key={feature.title} className={`flex items-center gap-4 rounded-md border border-gray-500 px-4 py-4 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${feature.card}`}>
      <i className={`fa-solid flex w-24 justify-center rounded-md px-9 py-3 text-[2.5rem] md:w-28 md:text-[3rem] ${feature.icon} ${feature.iconStyle}`} aria-hidden="true" />
      <div><h2 className={`text-lg font-bold ${feature.titleStyle}`}>{feature.title}</h2><p className="text-[1rem] leading-tight text-gray-700 md:text-[1.2rem]">{feature.description}</p></div>
    </article>)}
  </section>;
}

function HowItWorks() {
  return <section id="3" className="px-6 py-10 md:px-10">
    <h2 className="text-center text-[1.7rem] font-bold text-emerald-800">How It Works</h2>
    <div className="flex flex-col items-center justify-center gap-8 md:flex-row md:gap-0">
      {steps.map((step, index) => <React.Fragment key={step.title}>
        <article className="flex w-full max-w-[280px] flex-col items-center px-2 py-2">
          <div className="relative flex w-full items-start justify-center"><span className="z-10 rounded-full bg-emerald-600 px-3 py-1 text-lg font-bold text-white">{index + 1}</span><img className="-ml-4 h-36 w-36 rounded-full bg-gray-200 object-contain px-3 pt-4" src={step.image} alt={step.alt} /></div>
          <h3 className="mt-2 text-center text-[1.2rem] font-semibold">{step.title}</h3><p className="mt-1 text-center leading-none text-gray-800">{step.description}</p>
        </article>
        {index < steps.length - 1 && <div className="hidden items-center md:flex" aria-hidden="true"><div className="w-12 border-t-2 border-dashed border-black" /><i className="fa-solid fa-caret-right -ml-1 text-[1.25rem]" /></div>}
      </React.Fragment>)}
    </div>
  </section>;
}

export default function App() {
  return <>
    <Hero />
    <FeatureCards />
    <HowItWorks />
    <section className="mt-16 flex w-full flex-col items-center justify-center gap-6 bg-emerald-950 p-8 text-center md:flex-row md:gap-10 md:p-12 md:text-left">
      <h2 className="text-xl font-bold text-white md:text-2xl">Ready to move your harvest smarter?</h2>
      <Link to="/login.html" className="w-full rounded-lg bg-emerald-600 px-6 py-3 text-center font-bold text-white shadow transition hover:bg-emerald-700 md:w-auto">Start Shipping Now</Link>
    </section>
  </>;
}
