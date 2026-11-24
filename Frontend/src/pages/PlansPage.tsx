import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { PROGRAM_PLANS, CONTACT_INFO } from '../config/programData.js';
import { CinematicTextReveal } from '../components/CinematicTextReveal.js';
import { CinematicCard } from '../components/CinematicCard.js';
import { Check, ArrowRight, Laptop, Award, ArrowUpRight, Sparkles } from 'lucide-react';

const sectionAnim = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export const PlansPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] space-y-24 pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-24 font-body">
      
      {/* 1. Header Section */}
      <motion.section
        {...sectionAnim}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl"
      >
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E9E54]/10 border border-[#1E9E54]/30 text-[#14723B] text-xs font-mono font-bold uppercase tracking-[0.2em] mb-4">
          <Sparkles className="w-3.5 h-3.5 text-[#1E9E54]" />
          <span>TRANSPARENT TUITION &amp; PLANS</span>
        </div>

        <CinematicTextReveal
          text="Choose Your Plan & Duration"
          tag="h1"
          className="text-4xl sm:text-6xl font-black text-[#111111] tracking-[-0.04em] leading-tight font-heading"
        />

        <p className="text-base sm:text-lg text-[#555555] leading-relaxed mt-4 font-light">
          One-time all-inclusive fee. No hidden subscription fees. Choose 1, 2, or 3 months depending on how deep you want to take your portfolio and live project ownership.
        </p>
      </motion.section>

      {/* 2. 3 Pricing Cards with 3D Perspective Tilt */}
      <motion.section
        {...sectionAnim}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Plan 1: Explorer */}
          <CinematicCard className="h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono font-bold text-[#777777] tracking-[0.15em]">
                    1 MONTH
                  </span>
                  <span className="text-xs text-[#888888] font-mono">one-time fee</span>
                </div>
                <h2 className="text-3xl font-black text-[#111111] mt-2 font-heading">
                  Explorer
                </h2>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-[#111111] tabular-nums font-mono">
                    ₹5,999
                  </span>
                  <span className="text-xs text-[#777777]">all-inclusive</span>
                </div>
                <p className="text-xs text-[#666666] mt-2 font-light">
                  Understand the basics and build one working AI-powered mini app.
                </p>

                <hr className="my-6 border-black/10" />

                <div className="space-y-3 text-sm text-[#555555]">
                  <p className="text-xs font-mono font-bold text-[#888888] uppercase tracking-[0.15em]">
                    WHAT IS INCLUDED
                  </p>
                  {PROGRAM_PLANS.explorer.features.map((f, i) => (
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
                  className="w-full text-center py-3.5 px-4 bg-[#111111] hover:bg-[#1E9E54] text-white font-bold rounded-full transition-all block text-xs uppercase tracking-wider"
                >
                  Enrol in Explorer (₹5,999)
                </Link>
              </div>
            </div>
          </CinematicCard>

          {/* Plan 2: Builder (Recommended / Most Popular) */}
          <CinematicCard highlight className="h-full">
            <div className="flex flex-col justify-between relative h-full">
              <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-[#1E9E54] text-white text-xs font-mono font-bold uppercase tracking-[0.15em] px-4 py-1 rounded-full shadow-sm">
                MOST POPULAR
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono font-bold text-[#1E9E54] tracking-[0.15em]">
                    2 MONTHS
                  </span>
                  <span className="text-xs text-[#777777] font-mono">one-time fee</span>
                </div>
                <h2 className="text-3xl font-black text-[#111111] mt-2 font-heading">
                  Builder
                </h2>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-[#111111] tabular-nums font-mono">
                    ₹9,999
                  </span>
                  <span className="text-xs text-[#777777]">all-inclusive</span>
                </div>
                <p className="text-xs text-[#666666] mt-2 font-light">
                  Build a complete app with a backend and smarter AI features.
                </p>

                <hr className="my-6 border-black/10" />

                <div className="space-y-3 text-sm text-[#555555]">
                  <p className="text-xs font-mono font-bold text-[#1E9E54] uppercase tracking-[0.15em]">
                    WHAT IS INCLUDED
                  </p>
                  {PROGRAM_PLANS.builder.features.map((f, i) => (
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
                  className="w-full text-center py-3.5 px-4 bg-[#1E9E54] hover:bg-[#14723B] text-white font-bold rounded-full transition-all block text-xs uppercase tracking-wider shadow-sm"
                >
                  Enrol in Builder (₹9,999)
                </Link>
              </div>
            </div>
          </CinematicCard>

          {/* Plan 3: Professional */}
          <CinematicCard className="h-full">
            <div className="flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono font-bold text-[#777777] tracking-[0.15em]">
                    3 MONTHS
                  </span>
                  <span className="text-xs text-[#888888] font-mono">one-time fee</span>
                </div>
                <h2 className="text-3xl font-black text-[#111111] mt-2 font-heading">
                  Professional
                </h2>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-black text-[#111111] tabular-nums font-mono">
                    ₹14,999
                  </span>
                  <span className="text-xs text-[#777777]">all-inclusive</span>
                </div>
                <p className="text-xs text-[#666666] mt-2 font-light">
                  Become job-ready with a published app, live feature ownership, and a strong portfolio.
                </p>

                <hr className="my-6 border-black/10" />

                <div className="space-y-3 text-sm text-[#555555]">
                  <p className="text-xs font-mono font-bold text-[#888888] uppercase tracking-[0.15em]">
                    WHAT IS INCLUDED
                  </p>
                  {PROGRAM_PLANS.professional.features.map((f, i) => (
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
                  className="w-full text-center py-3.5 px-4 bg-[#111111] hover:bg-[#1E9E54] text-white font-bold rounded-full transition-all block text-xs uppercase tracking-wider"
                >
                  Enrol in Professional (₹14,999)
                </Link>
              </div>
            </div>
          </CinematicCard>

        </div>

        {/* Note on Discounts */}
        <div className="mt-8 bg-[#D97706]/10 border border-[#D97706]/20 rounded-2xl p-4 text-center text-xs text-[#B45309] max-w-3xl mx-auto font-mono">
          <strong>Special Offers &amp; Group Waivers:</strong> Discounts may be available for early registration, groups of three or more, and college tie-ups. Ask the team for current offers at <a href={`mailto:${CONTACT_INFO.email}`} className="underline font-semibold">{CONTACT_INFO.email}</a> or use a valid coupon code during checkout.
        </div>
      </motion.section>

      {/* 3. Every Plan Includes & What You Need Strips */}
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
                    <span>Structured training sessions led by working developers</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                    <span>Mentor guidance and dedicated doubt clearing</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                    <span>Curated learning materials and production project starter templates</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                    <span>Access to live client project work at VGM Soft Tech</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                    <span>Weekly practical tasks and a final project demonstration</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                    <span>Certificate from VGM Skill Hub</span>
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
                    <span>Basic familiarity with any programming language (C, Java, Python, or JavaScript)</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                    <span>Willingness to commit 10–15 hours per week to practical coding</span>
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
