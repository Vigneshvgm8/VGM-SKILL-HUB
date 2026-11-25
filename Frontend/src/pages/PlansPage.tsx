import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PROGRAM_PLANS, CONTACT_INFO } from '../config/programData.js';
import { CinematicTextReveal } from '../components/CinematicTextReveal.js';
import { CinematicCard } from '../components/CinematicCard.js';
import { 
  Check, 
  ArrowRight, 
  Laptop, 
  Award, 
  ArrowUpRight, 
  Sparkles, 
  ShieldCheck, 
  Terminal, 
  GitBranch, 
  Code, 
  Users, 
  Briefcase, 
  Building2, 
  CheckCircle2, 
  X
} from 'lucide-react';

const sectionAnim = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.15 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export const PlansPage: React.FC = () => {
  const [plans, setPlans] = useState<Record<string, any>>(PROGRAM_PLANS);
  const [activePlanHover, setActivePlanHover] = useState<string>('builder');

  useEffect(() => {
    fetch('/api/plans')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.plans) {
          setPlans(data.plans);
        }
      })
      .catch(err => console.warn('Using local fallback plans:', err));
  }, []);

  const explorer = plans.explorer || PROGRAM_PLANS.explorer;
  const builder = plans.builder || PROGRAM_PLANS.builder;
  const professional = plans.professional || PROGRAM_PLANS.professional;

  // Comparison Matrix Rows
  const comparisonFeatures = [
    { name: 'Internship Duration', explorer: '1 Month (4 Weeks)', builder: '2 Months (8 Weeks)', professional: '3 Months (12 Weeks)' },
    { name: 'Hands-on Coding Hours', explorer: '60+ Hours', builder: '140+ Hours', professional: '240+ Hours' },
    { name: 'Live Client Pod Integration', explorer: 'Shadowing & Mini-app', builder: 'Direct Feature Ownership', professional: 'Full Sprint Ownership + Release' },
    { name: 'Senior Staff PR Code Audits', explorer: 'Weekly (4 Total)', builder: 'Bi-Weekly (8 Total)', professional: 'Every Sprint (12+ Total)' },
    { name: 'Git Branching & CI/CD Staging', explorer: 'Basic GitHub', builder: 'Automated CI/CD Actions', professional: 'Multi-Environment Pipeline' },
    { name: 'AI LLM API Integration', explorer: 'API Call Fundamentals', builder: 'Function Calling & RAG', professional: 'Agentic Workflows & Multi-Modal' },
    { name: 'Official Stamped Experience Letter', explorer: 'Internship Certificate', builder: 'Performance Rated Letter', professional: 'Experience Letter + Recommendation' },
    { name: 'Verifiable Digital QR Credential', explorer: 'Included', builder: 'Included', professional: 'Included (Permanent Link)' },
    { name: 'Corporate Placement Cell Referrals', explorer: 'Resume Template', builder: '5 Partner Referrals', professional: 'Unlimited Partner Referrals + Mock HR' },
    { name: 'Coimbatore Saibaba Colony Lab Access', explorer: 'Hybrid (Online / Lab)', builder: 'Dedicated Lab Dev Pod', professional: 'Priority Dev Pod + Mentorship Desk' },
  ];

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] space-y-24 pt-36 sm:pt-40 md:pt-44 pb-20 md:pb-28 font-body selection:bg-[#43C170]/30 selection:text-[#111111]">
      
      {/* 1. Header Section */}
      <motion.section
        {...sectionAnim}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E9E54]/10 border border-[#1E9E54]/30 text-[#14723B] text-xs font-mono font-bold uppercase tracking-[0.2em] mb-5">
          <Sparkles className="w-3.5 h-3.5 text-[#1E9E54]" />
          <span>TRANSPARENT TUITION &amp; FELLOWSHIP PLANS</span>
        </div>

        <CinematicTextReveal
          text="Choose Your Plan & Duration"
          tag="h1"
          className="text-4xl sm:text-6xl md:text-7xl font-black text-[#111111] tracking-[-0.04em] leading-[1.04] font-heading"
        />

        <p className="text-base sm:text-lg text-[#555555] leading-relaxed mt-5 max-w-2xl mx-auto font-light">
          One-time all-inclusive fee. No hidden subscription fees. Choose 1, 2, or 3 months depending on how deep you want to take your portfolio, live project ownership, and software house experience.
        </p>

        {/* Live Cohort Trust Banner */}
        <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-6 py-3 rounded-2xl bg-[#F7F8FA] border border-black/[0.06] text-xs font-mono text-[#666666]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1E9E54] animate-pulse" />
            <span className="font-bold text-[#111111]">Next Cohort: 15th December 2026</span>
          </div>
          <span className="hidden sm:inline text-black/20">|</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#1E9E54]" />
            <span>ISO 9001:2015 Accredited</span>
          </div>
          <span className="hidden sm:inline text-black/20">|</span>
          <div className="flex items-center gap-1.5">
            <Building2 className="w-4 h-4 text-[#1E9E54]" />
            <span>Saibaba Colony Tech Hub</span>
          </div>
        </div>
      </motion.section>

      {/* 2. 3 Pricing Cards with 3D Perspective Tilt & Interactive Focus */}
      <motion.section
        {...sectionAnim}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Plan 1: Explorer */}
          <div
            onMouseEnter={() => setActivePlanHover('explorer')}
            className="h-full"
          >
            <CinematicCard 
              highlight={activePlanHover === 'explorer'}
              className="h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono font-bold text-[#777777] tracking-[0.15em]">
                    {explorer.duration ? explorer.duration.toUpperCase() : '1 MONTH'}
                  </span>
                  <span className="text-xs text-[#888888] font-mono">one-time fee</span>
                </div>
                <h2 className="text-3xl font-black text-[#111111] mt-2 font-heading">
                  {explorer.name || 'Explorer'}
                </h2>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-[#111111] tabular-nums font-mono">
                    {explorer.feeFormatted || `₹${Number(explorer.fee).toLocaleString('en-IN')}`}
                  </span>
                  <span className="text-xs text-[#777777]">all-inclusive</span>
                </div>
                <p className="text-xs text-[#666666] mt-2 font-light">
                  {explorer.outcome || 'Understand the basics and build one working AI-powered mini app.'}
                </p>

                <hr className="my-6 border-black/10" />

                <div className="space-y-3 text-sm text-[#555555]">
                  <p className="text-xs font-mono font-bold text-[#888888] uppercase tracking-[0.15em]">
                    WHAT IS INCLUDED
                  </p>
                  {(explorer.features || []).map((f: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#1E9E54] mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-black/10">
                <Link
                  to="/enrol?plan=explorer"
                  className="w-full text-center py-3.5 px-4 bg-[#111111] hover:bg-[#1E9E54] text-white font-bold rounded-full transition-all block text-xs uppercase tracking-wider flex items-center justify-center gap-2 group"
                >
                  <span>Enrol in {explorer.name || 'Explorer'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </CinematicCard>
          </div>

          {/* Plan 2: Builder (Recommended / Most Popular) */}
          <div
            onMouseEnter={() => setActivePlanHover('builder')}
            className="h-full"
          >
            <CinematicCard 
              highlight={true} 
              className="h-full flex flex-col justify-between relative border-2 border-[#1E9E54]"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1E9E54] text-white text-xs font-mono font-bold uppercase tracking-[0.15em] px-4 py-1 rounded-full shadow-md z-10">
                MOST POPULAR
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono font-bold text-[#1E9E54] tracking-[0.15em]">
                    {builder.duration ? builder.duration.toUpperCase() : '2 MONTHS'}
                  </span>
                  <span className="text-xs text-[#777777] font-mono">one-time fee</span>
                </div>
                <h2 className="text-3xl font-black text-[#111111] mt-2 font-heading">
                  {builder.name || 'Builder'}
                </h2>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-[#111111] tabular-nums font-mono">
                    {builder.feeFormatted || `₹${Number(builder.fee).toLocaleString('en-IN')}`}
                  </span>
                  <span className="text-xs text-[#777777]">all-inclusive</span>
                </div>
                <p className="text-xs text-[#666666] mt-2 font-light">
                  {builder.outcome || 'Build a complete app with a backend and smarter AI features.'}
                </p>

                <hr className="my-6 border-black/10" />

                <div className="space-y-3 text-sm text-[#555555]">
                  <p className="text-xs font-mono font-bold text-[#1E9E54] uppercase tracking-[0.15em]">
                    WHAT IS INCLUDED
                  </p>
                  {(builder.features || []).map((f: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#1E9E54] mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-black/10">
                <Link
                  to="/enrol?plan=builder"
                  className="w-full text-center py-3.5 px-4 bg-[#1E9E54] hover:bg-[#14723B] text-white font-bold rounded-full transition-all block text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 group"
                >
                  <span>Enrol in {builder.name || 'Builder'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </CinematicCard>
          </div>

          {/* Plan 3: Professional */}
          <div
            onMouseEnter={() => setActivePlanHover('professional')}
            className="h-full"
          >
            <CinematicCard 
              highlight={activePlanHover === 'professional'}
              className="h-full flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono font-bold text-[#777777] tracking-[0.15em]">
                    {professional.duration ? professional.duration.toUpperCase() : '3 MONTHS'}
                  </span>
                  <span className="text-xs text-[#888888] font-mono">one-time fee</span>
                </div>
                <h2 className="text-3xl font-black text-[#111111] mt-2 font-heading">
                  {professional.name || 'Professional'}
                </h2>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-[#111111] tabular-nums font-mono">
                    {professional.feeFormatted || `₹${Number(professional.fee).toLocaleString('en-IN')}`}
                  </span>
                  <span className="text-xs text-[#777777]">all-inclusive</span>
                </div>
                <p className="text-xs text-[#666666] mt-2 font-light">
                  {professional.outcome || 'Become job-ready with a published app, live feature ownership, and a strong portfolio.'}
                </p>

                <hr className="my-6 border-black/10" />

                <div className="space-y-3 text-sm text-[#555555]">
                  <p className="text-xs font-mono font-bold text-[#888888] uppercase tracking-[0.15em]">
                    WHAT IS INCLUDED
                  </p>
                  {(professional.features || []).map((f: string, i: number) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-[#1E9E54] mt-0.5 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-black/10">
                <Link
                  to="/enrol?plan=professional"
                  className="w-full text-center py-3.5 px-4 bg-[#111111] hover:bg-[#1E9E54] text-white font-bold rounded-full transition-all block text-xs uppercase tracking-wider flex items-center justify-center gap-2 group"
                >
                  <span>Enrol in {professional.name || 'Professional'}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </CinematicCard>
          </div>

        </div>

        {/* Note on Discounts */}
        <div className="mt-10 bg-[#D97706]/10 border border-[#D97706]/20 rounded-2xl p-5 text-center text-xs text-[#B45309] max-w-3xl mx-auto font-mono">
          <strong>Special Offers &amp; Group Waivers:</strong> Discounts available for early cohort registrations, groups of three or more, and college tie-ups. Reach out directly at <a href={`mailto:${CONTACT_INFO.email}`} className="underline font-semibold">{CONTACT_INFO.email}</a> or apply your coupon during checkout.
        </div>
      </motion.section>

      {/* 3. Deep Academic & Internship Comparison Matrix */}
      <motion.section
        {...sectionAnim}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-[#1E9E54] text-xs font-mono uppercase tracking-[0.2em] font-bold">[FELLOWSHIP ARCHITECTURE]</span>
          <CinematicTextReveal
            text="Detailed Track Deliverables &amp; Comparison"
            tag="h2"
            className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight font-heading"
          />
          <p className="text-sm text-[#666666] font-light">
            Compare concrete learning deliverables, code audit frequencies, and software house credentialing across each fellowship tier.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-black/10 bg-white shadow-xs">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-black/10 bg-[#F7F8FA]">
                <th className="p-4 sm:p-5 font-mono text-xs uppercase tracking-widest text-[#777777] font-bold">
                  Internship Dimension
                </th>
                <th className="p-4 sm:p-5 font-mono text-xs uppercase tracking-widest text-[#111111] font-bold">
                  Explorer (1 Mo)
                </th>
                <th className="p-4 sm:p-5 font-mono text-xs uppercase tracking-widest text-[#1E9E54] font-bold bg-[#1E9E54]/5">
                  Builder (2 Mo) ★
                </th>
                <th className="p-4 sm:p-5 font-mono text-xs uppercase tracking-widest text-[#111111] font-bold">
                  Professional (3 Mo)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 font-mono text-xs sm:text-sm">
              {comparisonFeatures.map((row, idx) => (
                <tr key={idx} className="hover:bg-black/[0.015] transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-[#111111] font-body text-sm">
                    {row.name}
                  </td>
                  <td className="p-4 sm:p-5 text-[#555555]">
                    {row.explorer}
                  </td>
                  <td className="p-4 sm:p-5 font-semibold text-[#14723B] bg-[#1E9E54]/5">
                    {row.builder}
                  </td>
                  <td className="p-4 sm:p-5 text-[#111111]">
                    {row.professional}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* 4. Every Plan Includes & Prerequisites */}
      <motion.section
        {...sectionAnim}
        className="border-y border-black/5 bg-[#F7F8FA] py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Box 1: Every plan includes */}
            <CinematicCard>
              <div className="space-y-4 h-full">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-[#1E9E54]" />
                  <h3 className="text-lg font-black text-[#111111] font-heading">
                    Every Plan Includes
                  </h3>
                </div>
                <ul className="space-y-3 text-sm text-[#666666]">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                    <span>Structured training sessions led by working senior developers</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                    <span>Mentor guidance and dedicated 1-on-1 sprint doubt clearing</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                    <span>Curated engineering materials and production starter templates</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                    <span>Access to live client project pods at VGM Soft Tech</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                    <span>Weekly practical sprints and a final capstone demonstration</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                    <span>Official verifiable certificate from VGM Skill Hub</span>
                  </li>
                </ul>
              </div>
            </CinematicCard>

            {/* Box 2: What you need */}
            <CinematicCard>
              <div className="space-y-4 h-full">
                <div className="flex items-center gap-2">
                  <Laptop className="w-5 h-5 text-[#1E9E54]" />
                  <h3 className="text-lg font-black text-[#111111] font-heading">
                    Prerequisites &amp; Setup
                  </h3>
                </div>
                <ul className="space-y-3 text-sm text-[#666666]">
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                    <span>A working laptop (Windows, Mac, or Linux) with at least 8 GB RAM</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                    <span>Stable internet connection for hybrid and live repository reviews</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                    <span>Basic familiarity with any programming language (C, Java, Python, or JS)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                    <span>Willingness to commit 10–15 hours per week to practical coding</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                    <span>Active GitHub profile for tracking pull requests and commits</span>
                  </li>
                </ul>
              </div>
            </CinematicCard>

          </div>
        </div>
      </motion.section>

    </div>
  );
};
