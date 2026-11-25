import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo.js';
import { 
  Menu, 
  X, 
  ArrowUpRight, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const location = useLocation();
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 25);

      // Always show at top of page
      if (currentScrollY <= 60) {
        setVisible(true);
      } else if (currentScrollY > lastScrollY.current + 8) {
        // Scrolling down -> hide navbar smoothly
        if (!mobileMenuOpen) {
          setVisible(false);
        }
      } else if (currentScrollY < lastScrollY.current - 8) {
        // Scrolling up -> reveal navbar smoothly
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const isHomeDarkHero = location.pathname === '/' && !scrolled;

  interface NavItem {
    label: string;
    path: string;
    badge?: string;
    liveDot?: boolean;
  }

  // Direct individual page links — strict single-line, no dropdowns, no word-wrap
  const navItems: NavItem[] = [
    { label: 'Courses', path: '/courses' },
    // { label: 'AI Mobile', path: '/programme', liveDot: true },
    { label: 'Placements', path: '/placements', badge: '94.8%' },
    { label: 'Plans & Fees', path: '/plans' },
    { label: 'Student Hub', path: '/student-portal' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header 
      className={`fixed top-3 sm:top-5 left-0 right-0 z-50 px-3 sm:px-6 pointer-events-none transition-all duration-300 ease-in-out ${
        visible 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-28 opacity-0 pointer-events-none'
      }`}
    >
      <div className="max-w-7xl mx-auto pointer-events-auto">
        
        {/* Floating Island Glass Capsule - Clean single straight line */}
        <div
          className={`relative rounded-full h-16 sm:h-[68px] px-4 sm:px-6 flex items-center justify-between gap-3 sm:gap-6 flex-nowrap transition-all duration-300 ${
            isHomeDarkHero
              ? 'bg-[#09090b]/85 backdrop-blur-2xl border border-white/[0.12] shadow-[0_16px_40px_rgba(0,0,0,0.7),inset_0_1px_1px_rgba(255,255,255,0.15)] text-white'
              : scrolled
                ? 'bg-white/92 backdrop-blur-2xl border border-black/[0.08] shadow-[0_16px_40px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9)] text-[#111111]'
                : 'bg-white/85 backdrop-blur-xl border border-black/[0.06] shadow-[0_10px_30px_rgba(0,0,0,0.05)] text-[#111111]'
          }`}
        >
          {/* Top specular highlight trace */}
          <div 
            className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#43C170]/40 to-transparent" 
          />

          {/* ───────────────────────────────────────────────────────────── */}
          {/* LEFT: BRANDMARK (100% Transparent Vector Logo)               */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-3 shrink-0 whitespace-nowrap">
            <Link 
              to="/" 
              className="group flex items-center py-1 transition-transform duration-200 hover:scale-[1.02] focus:outline-hidden"
              aria-label="VGM Skill Hub Home"
            >
              <Logo size="md" variant={isHomeDarkHero ? 'dark' : 'light'} />
            </Link>

            {/* Subtle Divider */}
            <div 
              className={`hidden xl:block h-5 w-[1px] mx-1 ${
                isHomeDarkHero ? 'bg-white/10' : 'bg-black/10'
              }`} 
            />
          </div>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* CENTER: STRAIGHT HORIZONTAL NAV BAR (NO WORD-WRAP, NO SUBMENU) */}
          {/* ───────────────────────────────────────────────────────────── */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-nowrap shrink-0">
            {navItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-3 py-1.5 rounded-full text-xs xl:text-[13px] font-semibold tracking-wide whitespace-nowrap flex items-center gap-1.5 transition-all duration-200 select-none ${
                    active
                      ? isHomeDarkHero
                        ? 'text-white bg-white/15 shadow-xs font-bold'
                        : 'text-[#111111] bg-black/5 shadow-xs font-bold'
                      : isHomeDarkHero
                        ? 'text-[#CBD5E1] hover:text-white hover:bg-white/[0.08]'
                        : 'text-[#444444] hover:text-[#111111] hover:bg-black/[0.04]'
                  }`}
                >
                  <span className="whitespace-nowrap">{item.label}</span>

                  {/* Pulsing Live Dot */}
                  {item.liveDot && (
                    <span className="relative flex h-2 w-2 shrink-0">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#43C170] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#43C170]"></span>
                    </span>
                  )}

                  {/* Highlight Badge */}
                  {item.badge && (
                    <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full shrink-0 leading-none ${
                      isHomeDarkHero 
                        ? 'bg-white/10 text-[#43C170] border border-white/10' 
                        : 'bg-black/5 text-[#14723B] border border-black/5'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ───────────────────────────────────────────────────────────── */}
          {/* RIGHT: LIVE ADMISSIONS BADGE & CTA BUTTON                   */}
          {/* ───────────────────────────────────────────────────────────── */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0 whitespace-nowrap">
            
            {/* Live 2026 Batch Indicator */}
            <div 
              className={`hidden 2xl:inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-medium whitespace-nowrap shrink-0 transition-colors ${
                isHomeDarkHero
                  ? 'bg-[#1E9E54]/10 border border-[#1E9E54]/25 text-[#43C170]'
                  : 'bg-[#1E9E54]/10 border border-[#1E9E54]/20 text-[#14723B]'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#43C170] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#43C170]"></span>
              </span>
              <span>2026 Batch</span>
            </div>

            {/* Signature Glossy Enrol CTA Button */}
            <Link
              to="/enrol"
              className="relative overflow-hidden group flex items-center justify-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold rounded-full text-white cursor-pointer shadow-[0_6px_22px_rgba(30,158,84,0.45)] hover:shadow-[0_8px_30px_rgba(30,158,84,0.7)] hover:scale-[1.03] transition-all duration-200 border-t border-white/50 shrink-0 whitespace-nowrap"
              style={{
                backgroundImage: 'linear-gradient(135deg, #14723B 0%, #1E9E54 50%, #43C170 100%)',
              }}
            >
              {/* Shimmer sweep reflection on hover */}
              <span 
                className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-out pointer-events-none" 
              />
              <span className="relative z-10 whitespace-nowrap">Enrol Now</span>
              <ArrowUpRight className="relative z-10 w-4 h-4 stroke-[2.5]" />
            </Link>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 lg:hidden rounded-full transition-colors focus:outline-hidden ${
                isHomeDarkHero
                  ? 'text-white hover:bg-white/10'
                  : 'text-[#111111] hover:bg-black/5'
              }`}
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>

        </div>

      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* MOBILE FULL-SCREEN SLIDE-DOWN DRAWER                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div className="max-w-7xl mx-auto mt-2 pointer-events-auto lg:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="rounded-3xl border border-white/15 bg-[#09090b]/98 backdrop-blur-3xl p-5 shadow-2xl text-white">
            
            {/* Status Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-xs font-mono text-[#43C170]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#43C170] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#43C170]"></span>
                </span>
                <span>Admissions Live — 2026 Batch</span>
              </div>
              <span className="text-[10px] text-white/50 font-mono">Coimbatore</span>
            </div>

            {/* All Individual Page Links */}
            <nav className="flex flex-col space-y-1">
              {[
                { label: 'Home', path: '/' },
                { label: 'Courses', path: '/courses' },
                // { label: 'AI Mobile App', path: '/programme', badge: 'Live' },
                { label: 'Placements', path: '/placements', badge: '94.8%' },
                { label: 'Plans & Fees', path: '/plans' },
                { label: 'Student Portal', path: '/student-portal' },
                { label: 'Verify Credential', path: '/verify-certificate' },
                { label: 'About & Contact', path: '/about' },
              ].map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                      active
                        ? 'bg-[#1E9E54] text-white shadow-xs'
                        : 'text-[#CBD5E1] hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{item.label}</span>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded bg-white/20 text-white">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <ArrowUpRight className="w-4 h-4 opacity-50" />
                  </Link>
                );
              })}
            </nav>

            {/* Full-width Direct Enrol Button */}
            <Link
              to="/enrol"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 py-3.5 px-6 rounded-full text-sm font-bold text-white shadow-[0_4px_25px_rgba(30,158,84,0.5)] border-t border-white/40"
              style={{
                backgroundImage: 'linear-gradient(135deg, #14723B 0%, #1E9E54 50%, #43C170 100%)',
              }}
            >
              <span>Apply for 2026 Batch Now</span>
              <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

          </div>
        </div>
      )}

    </header>
  );
};
