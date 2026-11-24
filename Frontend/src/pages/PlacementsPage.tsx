import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  PLACEMENT_STATS, 
  HIRING_PARTNERS, 
  ALUMNI_STORIES, 
  CAREER_SUPPORT_PILLARS 
} from '../config/placementsData.js';
import { CinematicTextReveal } from '../components/CinematicTextReveal.js';
import { CinematicCard } from '../components/CinematicCard.js';
import { AnimatedCounter } from '../components/AnimatedCounter.js';
import { 
  Building2, 
  ArrowRight, 
  Sparkles, 
  ArrowUpRight,
  Star,
  CheckCircle2
} from 'lucide-react';

const sectionAnim = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

export const PlacementsPage: React.FC = () => {
  const [partnerTypeFilter] = useState<string>('All');

  const filteredPartners = partnerTypeFilter === 'All' 
    ? HIRING_PARTNERS 
    : HIRING_PARTNERS.filter(p => p.category === partnerTypeFilter);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] pb-24 font-body">
      
      {/* 1. Placement Hero Banner */}
      <section className="bg-[#FFFFFF] text-[#111111] py-16 md:py-24 relative overflow-hidden pt-28">
        {/* Subtle mesh orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#1E9E54]/5 blur-[120px] pointer-events-none animate-orb" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E9E54]/10 border border-[#1E9E54]/30 text-[#14723B] text-xs font-mono font-bold uppercase tracking-[0.2em]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>VGM CAREER CELL &amp; CORPORATE PLACEMENTS</span>
            </div>

            <CinematicTextReveal
              text="Where Practical Code Turns Into High-Impact Tech Careers"
              tag="h1"
              className="text-4xl sm:text-6xl font-black text-[#111111] tracking-[-0.04em] leading-tight max-w-4xl mx-auto mt-4 font-heading"
            />

            <p className="text-base sm:text-lg text-[#555555] max-w-2xl mx-auto leading-relaxed mt-4 font-light">
              Our placement cell bridges the gap between academic graduation and high-growth IT firms. Learn inside an active software house, work on real production code, and interview directly with our 450+ hiring partner network.
            </p>
          </motion.div>

          {/* Stats Bar with Animated Counter */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8">
            {[
              { value: PLACEMENT_STATS.placementRate, label: 'Placement Rate', color: 'text-[#1E9E54]' },
              { value: PLACEMENT_STATS.highestPackage, label: 'Highest Tech Package', color: 'text-[#D97706]' },
              { value: PLACEMENT_STATS.averagePackage, label: 'Average Fresher CTC', color: 'text-[#111111]' },
              { value: PLACEMENT_STATS.totalAlumniPlaced, label: 'Graduates Placed', color: 'text-[#1E9E54]' },
            ].map((stat, idx) => (
              <CinematicCard key={idx} className="p-5 text-center">
                <span className={`text-4xl sm:text-5xl font-black block font-mono ${stat.color}`}>
                  <AnimatedCounter value={stat.value} />
                </span>
                <span className="text-xs text-[#777777] font-mono mt-1 block uppercase tracking-wider">{stat.label}</span>
              </CinematicCard>
            ))}
          </div>
        </div>
      </section>

      {/* 2. 4-Stage Placement Readiness Framework */}
      <motion.section
        {...sectionAnim}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16"
      >
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[#1E9E54] text-xs font-mono uppercase tracking-[0.2em] font-bold">[METHODOLOGY]</span>
          <CinematicTextReveal
            text="The 4-Stage Career Readiness Framework"
            tag="h2"
            className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight leading-tight font-heading"
          />
          <p className="text-sm text-[#666666] font-light">
            Inspired by industry standards, we don't just teach syntax — we train you to think, communicate, and deliver like a senior engineer.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAREER_SUPPORT_PILLARS.map((pillar, idx) => (
            <CinematicCard key={idx} index={idx + 1} className="h-full flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-[#111111] leading-snug font-heading">
                  {pillar.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed mt-2 font-light">
                  {pillar.description}
                </p>
              </div>
              <div className="pt-3 border-t border-black/5 text-[10px] font-mono text-[#1E9E54] uppercase tracking-wider font-bold mt-4">
                Verified Milestone
              </div>
            </CinematicCard>
          ))}
        </div>
      </motion.section>

      {/* 3. Alumni Success Stories Wall */}
      <motion.section
        {...sectionAnim}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24"
      >
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-black/10">
          <div>
            <span className="text-[#1E9E54] text-xs font-mono uppercase tracking-[0.2em] font-bold">[ALUMNI SPOTLIGHTS]</span>
            <CinematicTextReveal
              text="Real Transitions. Real Packages."
              tag="h2"
              className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight leading-tight mt-1 font-heading"
            />
            <p className="text-sm text-[#666666] mt-1 font-light">
              Read how candidates from engineering, science, arts, and non-coding streams built careers through VGM Skill Hub.
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider font-bold text-[#1E9E54] hover:text-[#111111] transition-colors shrink-0"
          >
            <span>Explore All Tracks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ALUMNI_STORIES.map((story, idx) => (
            <CinematicCard key={idx} className="h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#1E9E54]/10 border border-[#1E9E54]/30 text-[#14723B]">
                    {story.badge}
                  </span>
                  <span className="text-xs font-bold text-[#D97706] bg-[#D97706]/10 px-2.5 py-0.5 rounded-md border border-[#D97706]/20 font-mono">
                    {story.package}
                  </span>
                </div>

                <div className="relative">
                  <p className="text-xs sm:text-sm text-[#555555] leading-relaxed relative z-10 italic pt-1">
                    &ldquo;{story.testimonial}&rdquo;
                  </p>
                </div>
              </div>

              <div className="border-t border-black/5 pt-4 flex items-center gap-3 mt-4">
                <div className="w-10 h-10 rounded-full bg-[#1E9E54]/10 text-[#14723B] font-bold text-sm flex items-center justify-center shrink-0 font-mono">
                  {story.avatarInitials}
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-bold text-[#111111] truncate">{story.name}</h4>
                  <p className="text-xs font-semibold text-[#1E9E54] truncate">{story.role} @ {story.company}</p>
                  <p className="text-[11px] text-[#777777] truncate font-mono">{story.college} · {story.previousDegree}</p>
                </div>
              </div>
            </CinematicCard>
          ))}
        </div>
      </motion.section>

      {/* 4. Hiring Partners Continuous Marquee & Grid */}
      <motion.section
        {...sectionAnim}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24"
      >
        <div className="bg-[#F7F8FA] border border-black/5 rounded-3xl p-8 sm:p-12 space-y-8 overflow-hidden relative shadow-xs">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[#1E9E54] text-xs font-mono uppercase tracking-[0.2em] font-bold">[RECRUITMENT ECOSYSTEM]</span>
            <CinematicTextReveal
              text="450+ Tech Companies Hire Our Graduates"
              tag="h2"
              className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight leading-tight font-heading"
            />
            <p className="text-sm text-[#666666] font-light">
              From top-tier SaaS companies to specialized IT solutions houses across Coimbatore, Chennai, and Bangalore.
            </p>
          </div>

          {/* Infinite Marquee Ticker */}
          <div className="relative overflow-hidden py-2">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F7F8FA] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F7F8FA] to-transparent z-10" />

            <div className="animate-marquee py-2 flex items-center gap-4">
              {[...HIRING_PARTNERS, ...HIRING_PARTNERS].map((partner, idx) => (
                <div
                  key={`marquee-${idx}`}
                  className="px-5 py-3.5 bg-white border border-black/5 hover:border-[#1E9E54]/50 rounded-2xl flex items-center gap-3 transition-all shrink-0 group cursor-default shadow-xs"
                >
                  {partner.logo ? (
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="h-7 w-auto max-w-[120px] object-contain opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#555555]">
                      <Building2 className="w-4 h-4 text-[#1E9E54]" />
                      <span>{partner.name}</span>
                    </div>
                  )}
                  <span className="text-[10px] text-[#888888] font-mono uppercase tracking-wider pl-2 border-l border-black/10">
                    {partner.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Full Grid Directory */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 pt-4 border-t border-black/5">
            {filteredPartners.map((partner, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border border-black/5 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 hover:border-[#1E9E54]/40 transition-all group shadow-2xs"
              >
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="h-7 max-w-[110px] w-auto object-contain opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0 transition-all"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#555555]">
                    <Building2 className="w-4 h-4 text-[#1E9E54]" />
                    <span>{partner.name}</span>
                  </div>
                )}
                <span className="text-[10px] text-[#888888] font-mono uppercase tracking-wider">{partner.city}</span>
              </div>
            ))}
          </div>

          {/* Recruiter / Partner Callout */}
          <div className="bg-white rounded-2xl p-6 border border-black/5 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-base font-bold text-[#111111] font-heading">Are you a recruiter looking for pre-vetted junior engineers?</h3>
              <p className="text-xs sm:text-sm text-[#666666] font-light">
                Hire candidates trained on production Git workflows, clean code principles, and live project deliverables with zero hiring fee.
              </p>
            </div>
            <a
              href="mailto:intern@vgmsofttech.com?subject=Recruiter%20Hiring%20Inquiry%20-%20VGM%20Skill%20Hub"
              className="px-6 py-3 bg-[#111111] hover:bg-[#1E9E54] text-white font-bold rounded-full text-xs uppercase tracking-wider shrink-0 transition-all shadow-sm"
            >
              Hire From Us (Zero Placement Fee)
            </a>
          </div>
        </div>
      </motion.section>

      {/* 5. Bottom CTA Banner */}
      <motion.section
        {...sectionAnim}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24"
      >
        <CinematicCard className="p-0 overflow-hidden">
          <div className="bg-[#F7F8FA] border border-black/5 rounded-3xl p-8 sm:p-14 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
            <div className="space-y-3 max-w-xl relative z-10">
              <span className="px-3.5 py-1 bg-[#1E9E54]/10 border border-[#1E9E54]/30 rounded-full text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#14723B]">
                START YOUR CAREER SPRINT
              </span>
              <CinematicTextReveal
                text="Ready to land your dream role in tech?"
                tag="h2"
                className="text-4xl sm:text-5xl font-black text-[#111111] tracking-tight leading-tight font-heading"
              />
              <p className="text-[#666666] text-sm sm:text-base font-light">
                Admissions are open for our upcoming batches. Early-bird discount coupons and flexible installment plans are currently active.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full sm:w-auto relative z-10">
              <Link
                to="/courses"
                className="lusion-cta-btn w-full sm:w-auto text-center"
              >
                <span className="cta-dot"></span>
                <span className="cta-text">Browse All Courses</span>
                <span className="cta-arrow">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
              <Link
                to="/enrol"
                className="lusion-cta-btn lusion-cta-light w-full sm:w-auto text-center"
              >
                <span className="cta-dot"></span>
                <span className="cta-text">Enrol Directly</span>
                <span className="cta-arrow">
                  <ArrowUpRight className="w-4 h-4 text-[#1E9E54]" />
                </span>
              </Link>
            </div>
          </div>
        </CinematicCard>
      </motion.section>

    </div>
  );
};
