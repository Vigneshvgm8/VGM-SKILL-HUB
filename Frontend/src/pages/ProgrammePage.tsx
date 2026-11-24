import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { WEEKS_CURRICULUM, TOOLKIT_CATEGORIES, PROGRAM_PLANS } from '../config/programData.js';
import { CinematicTextReveal } from '../components/CinematicTextReveal.js';
import { CinematicCard } from '../components/CinematicCard.js';
import { 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  FileText,
  Calendar, 
  Briefcase, 
  Cpu, 
  Sparkles,
  ExternalLink,
  Check
} from 'lucide-react';

const sectionAnim = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export const ProgrammePage: React.FC = () => {
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<'All' | 'Explorer' | 'Builder' | 'Professional'>('All');

  const filteredWeeks = WEEKS_CURRICULUM.filter(w => {
    if (selectedPlanFilter === 'All') return true;
    if (selectedPlanFilter === 'Explorer') return w.planLevel === 'Explorer';
    if (selectedPlanFilter === 'Builder') return w.planLevel === 'Explorer' || w.planLevel === 'Builder';
    if (selectedPlanFilter === 'Professional') return true;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FFFFFF] space-y-24 py-8 md:py-16 pt-28">
      
      {/* 1. Header Section */}
      <motion.section
        {...sectionAnim}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E9E54]/10 border border-[#1E9E54]/25 text-[#14723B] text-xs font-mono font-bold uppercase tracking-[0.2em]">
            <Sparkles className="w-3.5 h-3.5 text-[#1E9E54]" />
            <span>CURRICULUM &amp; SYLLABUS SPECIFICATION</span>
          </div>

          <CinematicTextReveal
            text="The 12-Week AI Mobile Engineering Curriculum"
            tag="h1"
            className="text-4xl sm:text-6xl font-black text-[#111111] tracking-[-0.03em] leading-tight"
          />

          <p className="text-base sm:text-lg text-[#555555] leading-relaxed font-light">
            A comprehensive, project-driven progression from mobile app foundations to shipping AI-powered cross-platform apps on Google Play. Choose the 1-month Explorer, 2-month Builder, or 3-month Professional track.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <Link
              to="/enrol"
              className="px-8 py-3.5 bg-[#111111] hover:bg-[#1E9E54] text-white text-xs font-bold rounded-full transition-all inline-flex items-center gap-2 uppercase tracking-wider shadow-md hover:scale-105"
            >
              <span>Enrol in a Plan</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="/assets/aistudio/AI-Powered_Mobile_App_Development_Internship_26822b03.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 bg-[#F0F2F4] hover:border-[#1E9E54]/50 border border-black/10 text-[#111111] text-xs font-semibold rounded-full transition-all inline-flex items-center gap-2 uppercase tracking-wider"
            >
              <FileText className="w-4 h-4 text-[#1E9E54]" />
              <span>Download Official Brochure</span>
            </a>
          </div>
        </div>
      </motion.section>

      {/* 2. Three Tier Summary Cards with 3D Tilt */}
      <motion.section
        {...sectionAnim}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Plan 1: Explorer */}
          <CinematicCard className="h-full">
            <div className="space-y-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono font-bold text-[#1E9E54] tracking-[0.15em]">
                    PLAN 1 · 1 MONTH
                  </span>
                  <span className="font-mono font-black text-2xl text-[#111111]">₹5,999</span>
                </div>
                <h2 className="text-2xl font-black text-[#111111] mt-2 font-heading">Explorer</h2>
                <div className="bg-[#1E9E54]/5 text-[#555555] text-xs p-3.5 rounded-xl border border-[#1E9E54]/15 mt-3 leading-relaxed">
                  <strong className="text-[#111111]">OUTCOME:</strong> Understand the basics and build one working AI-powered mini app.
                </div>
                <div className="mt-5 space-y-2.5 text-xs text-[#555555]">
                  <p><strong className="text-[#111111]">Coverage:</strong> Weeks 1 to 4</p>
                  <p><strong className="text-[#111111]">Live Project Role:</strong> Shadow the team and complete small guided tasks such as UI fixes and screen changes.</p>
                  <p><strong className="text-[#111111]">Credential:</strong> Certificate of Participation</p>
                </div>
              </div>
              <div className="pt-4 border-t border-black/5">
                <Link
                  to="/enrol?plan=explorer"
                  className="w-full py-3 px-4 text-center text-xs font-bold uppercase tracking-[0.1em] bg-[#111111] hover:bg-[#1E9E54] text-white rounded-full transition-all block shadow-sm"
                >
                  Select Explorer Plan
                </Link>
              </div>
            </div>
          </CinematicCard>

          {/* Plan 2: Builder (Recommended) */}
          <CinematicCard highlight className="h-full">
            <div className="space-y-6 flex flex-col justify-between relative h-full">
              <span className="absolute -top-11 right-0 bg-[#1E9E54] text-white text-[10px] font-black uppercase tracking-[0.15em] px-3.5 py-1 rounded-full shadow-[0_0_16px_rgba(30,158,84,0.4)]">
                RECOMMENDED
              </span>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono font-bold text-[#1E9E54] tracking-[0.15em]">
                    PLAN 2 · 2 MONTHS
                  </span>
                  <span className="font-mono font-black text-2xl text-[#111111]">₹9,999</span>
                </div>
                <h2 className="text-2xl font-black text-[#111111] mt-2 font-heading">Builder</h2>
                <div className="bg-[#1E9E54]/5 text-[#555555] text-xs p-3.5 rounded-xl border border-[#1E9E54]/15 mt-3 leading-relaxed">
                  <strong className="text-[#111111]">OUTCOME:</strong> Build a complete app with a backend and smarter AI features.
                </div>
                <div className="mt-5 space-y-2.5 text-xs text-[#555555]">
                  <p><strong className="text-[#111111]">Coverage:</strong> Weeks 1 to 8 (Includes Explorer)</p>
                  <p><strong className="text-[#111111]">Live Project Role:</strong> Own assigned feature modules and work through Git branches with mentor code review.</p>
                  <p><strong className="text-[#111111]">Credential:</strong> Certificate of Completion</p>
                </div>
              </div>
              <div className="pt-4 border-t border-black/5">
                <Link
                  to="/enrol?plan=builder"
                  className="w-full py-3 px-4 text-center text-xs font-bold uppercase tracking-[0.1em] bg-[#1E9E54] hover:bg-[#14723B] text-white rounded-full transition-all block shadow-[0_0_20px_rgba(30,158,84,0.3)] hover:shadow-[0_0_30px_rgba(30,158,84,0.5)]"
                >
                  Select Builder Plan
                </Link>
              </div>
            </div>
          </CinematicCard>

          {/* Plan 3: Professional */}
          <CinematicCard className="h-full">
            <div className="space-y-6 flex flex-col justify-between h-full">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono font-bold text-[#1E9E54] tracking-[0.15em]">
                    PLAN 3 · 3 MONTHS
                  </span>
                  <span className="font-mono font-black text-2xl text-[#111111]">₹14,999</span>
                </div>
                <h2 className="text-2xl font-black text-[#111111] mt-2 font-heading">Professional</h2>
                <div className="bg-[#1E9E54]/5 text-[#555555] text-xs p-3.5 rounded-xl border border-[#1E9E54]/15 mt-3 leading-relaxed">
                  <strong className="text-[#111111]">OUTCOME:</strong> Become job-ready with a published app and a strong portfolio.
                </div>
                <div className="mt-5 space-y-2.5 text-xs text-[#555555]">
                  <p><strong className="text-[#111111]">Coverage:</strong> Weeks 1 to 12 (Full curriculum)</p>
                  <p><strong className="text-[#111111]">Live Project Role:</strong> Take full ownership of a feature from planning to release, with regular reviews. Experience letter issued.</p>
                  <p><strong className="text-[#111111]">Credential:</strong> Certificate of Completion + Experience Letter</p>
                </div>
              </div>
              <div className="pt-4 border-t border-black/5">
                <Link
                  to="/enrol?plan=professional"
                  className="w-full py-3 px-4 text-center text-xs font-bold uppercase tracking-[0.1em] bg-[#111111] hover:bg-[#1E9E54] text-white rounded-full transition-all block shadow-sm"
                >
                  Select Professional Plan
                </Link>
              </div>
            </div>
          </CinematicCard>

        </div>
      </motion.section>

      {/* 3. Week-by-Week Syllabus Breakdown */}
      <motion.section
        {...sectionAnim}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-black/10">
          <div>
            <span className="text-[#1E9E54] text-xs uppercase font-mono tracking-[0.2em] font-bold block mb-1">
              [DETAILED BREAKDOWN]
            </span>
            <CinematicTextReveal
              text="Week-by-Week Syllabus"
              tag="h2"
              className="text-4xl sm:text-6xl font-black text-[#111111] tracking-[-0.03em] leading-tight"
            />
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#F0F2F4] border border-black/10 rounded-full self-start sm:self-auto">
            {(['All', 'Explorer', 'Builder', 'Professional'] as const).map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setSelectedPlanFilter(filter)}
                className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                  selectedPlanFilter === filter
                    ? 'bg-[#111111] text-white font-bold shadow-xs'
                    : 'text-[#555555] hover:text-[#111111]'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline connector + week cards */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredWeeks.map((item) => (
              <motion.div
                key={item.week}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="bg-[#F7F8FA] border border-black/10 rounded-2xl p-6 hover:border-[#1E9E54]/40 transition-colors flex flex-col md:flex-row md:items-center gap-6 shadow-2xs">
                  {/* Week numeral tag */}
                  <div className="w-18 shrink-0 text-center bg-white rounded-xl py-3.5 px-2 border border-black/10 shadow-2xs">
                    <span className="text-[10px] font-bold text-[#999999] uppercase block font-mono">WEEK</span>
                    <span className="text-2xl font-black text-[#1E9E54] block tabular-nums leading-none mt-1 font-mono">
                      {String(item.week).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="grow space-y-1.5">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-heading font-black text-xl text-[#111111]">
                        {item.title}
                      </h3>
                      <span className="text-xs text-[#999999]">·</span>
                      <span className="text-xs font-mono font-bold text-[#1E9E54] bg-[#1E9E54]/10 border border-[#1E9E54]/20 px-2.5 py-0.5 rounded-full uppercase">
                        {item.planLevel} Track
                      </span>
                    </div>
                    <p className="text-sm text-[#555555] leading-relaxed font-light">
                      {item.description}
                    </p>
                  </div>

                  {/* Milestones / Badge */}
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="px-3 py-1.5 rounded-md bg-white border border-black/5 text-xs font-mono text-[#444444] font-medium">
                      Live Sprint Repo
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.section>

      {/* 4. Complete Toolchain & Tech Stack */}
      <motion.section
        {...sectionAnim}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
          <span className="text-[#1E9E54] text-xs font-mono uppercase tracking-[0.2em] font-bold">
            [PRODUCTION TOOLCHAIN]
          </span>
          <CinematicTextReveal
            text="Technologies & Frameworks You Will Master"
            tag="h2"
            className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight"
          />
          <p className="text-sm text-[#666666] font-light">
            Every tool is selected because it is actively used in modern production environments.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TOOLKIT_CATEGORIES.map((cat, idx) => (
            <CinematicCard key={idx} className="h-full flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-xl bg-white border border-black/10 flex items-center justify-center text-[#1E9E54] mb-3 shadow-2xs">
                  <Cpu className="w-5 h-5" />
                </div>
                <h3 className="font-heading font-black text-lg text-[#111111]">{cat.title}</h3>
                <p className="text-xs text-[#666666] leading-relaxed mt-1">{cat.description}</p>
              </div>

              <div className="pt-3 border-t border-black/5 space-y-1.5 mt-4">
                {cat.tools.map((t, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-mono text-[#333333]">
                    <Check className="w-3.5 h-3.5 text-[#1E9E54] shrink-0" />
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </CinematicCard>
          ))}
        </div>
      </motion.section>

    </div>
  );
};
