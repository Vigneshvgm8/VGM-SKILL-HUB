import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { COURSES_CATALOG, CourseItem } from '../config/coursesData.js';
import { PLACEMENT_STATS, HIRING_PARTNERS, ALUMNI_STORIES } from '../config/placementsData.js';
import { SyllabusDownloadModal } from '../components/SyllabusDownloadModal.js';
import { CinematicBackground } from '../components/CinematicBackground.js';
import { CinematicCard } from '../components/CinematicCard.js';
import { CinematicCardStack } from '../components/CinematicCardStack.js';
import { CinematicTextReveal } from '../components/CinematicTextReveal.js';
import { CinematicImageExpand } from '../components/CinematicImageExpand.js';
import { CinematicMarquee } from '../components/CinematicMarquee.js';
import { AnimatedCounter } from '../components/AnimatedCounter.js';
import { MotionGridCanvas } from '../components/MotionGridCanvas.js';
import {
  ArrowRight,
  Check,
  Cpu,
  Clock,
  MapPin,
  Award,
  Building2,
  Star,
  ArrowUpRight,
  Download,
  Sparkles,
  ShieldCheck,
  Zap,
} from 'lucide-react';

const easeOut = [0.16, 1, 0.3, 1] as const;

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseItem[]>(COURSES_CATALOG);
  const [activeCodeTab, setActiveCodeTab] = useState<'flutter' | 'ai'>('flutter');
  const [featuredCategory, setFeaturedCategory] = useState<string>('All');
  const [activeSort, setActiveSort] = useState<'Featured' | 'Popular' | 'Recent'>('Featured');
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState<boolean>(false);
  const [syllabusCourseSlug, setSyllabusCourseSlug] = useState<string>('ai-mobile-app');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
          setCourses(data.courses);
        }
      })
      .catch(() => { });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollTotal > 0) {
        const pct = Math.min(100, Math.max(0, (window.scrollY / scrollTotal) * 100));
        setScrollProgress(pct);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const flutterCode = `// lib/features/ai_assistant/gemini_service.dart
import 'package:google_generative_ai/google_generative_ai.dart';

class GeminiMobileService {
  final GenerativeModel _model;
  
  GeminiMobileService({required String apiKey}) 
    : _model = GenerativeModel(
        model: 'gemini-1.5-flash', 
        apiKey: apiKey
      );

  Stream<String> generateStreamingPlan(String topic) async* {
    final prompt = 'Build a daily study plan for: $topic';
    final response = _model.generateContentStream([Content.text(prompt)]);
    await for (final chunk in response) {
      if (chunk.text != null) yield chunk.text!;
    }
  }
}`;

  const gitCode = `# Live project workflow taught in Builder & Professional plans
$ git checkout -b feat/speech-recognition
$ flutter pub add speech_to_text
$ git commit -m "feat(voice): add offline speech input for Tamil and English"
$ git push origin feat/speech-recognition
# Open Pull Request -> Senior Staff Audit & Approval -> Merge to staging`;

  const filteredCourses = courses
    .filter(c => featuredCategory === 'All' || c.category === featuredCategory)
    .sort((a, b) => {
      if (activeSort === 'Popular') return (b.rating || 5) - (a.rating || 5);
      if (activeSort === 'Recent') return b.id.localeCompare(a.id);
      return 0;
    });

  return (
    <div className="relative bg-[#FFFFFF] text-[#111111] min-h-screen selection:bg-[#43C170]/30 selection:text-[#111111]">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* FRESH CINEMATIC AMBIENT BACKGROUND                         */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <CinematicBackground />

      {/* Top Scroll Progress Hairline */}
      <div
        className="fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#1E9E54] to-[#1E9E54] z-50 transition-all duration-100 ease-out pointer-events-none"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 1. SECTION: MOTIONSITES CINEMATIC HERO (#home-hero)          */}
      {/*    (100% UNTOUCHED AS EXPLICITLY REQUESTED BY USER)          */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="home-hero"
        className="relative z-10 flex flex-col justify-center px-4 sm:px-8 lg:px-12 pt-28 sm:pt-36 pb-16 overflow-hidden bg-[#09090b] min-h-[78vh] lg:min-h-[84vh]"
      >
        {/* Interactive 3D Illuminated Tile Grid with Mouse Spotlight Glow */}
        <MotionGridCanvas theme="emerald" lightElementId="home-hero-title" />

        {/* Centered Hero Content */}
        <div className="max-w-4xl mx-auto w-full text-center relative z-10 my-auto flex flex-col items-center justify-center py-2">

          {/* Cinematic Headline with MotionSites Signature Shifting Gradient */}
          <h1
            id="home-hero-title"
            className="text-4xl sm:text-6xl md:text-7xl lg:text-[4.75rem] font-black tracking-[-0.035em] uppercase text-center text-white leading-[1.02] max-w-4xl mx-auto"
          >
            <span className="block">We Engineer</span>
            <span className="block mt-1 sm:mt-2">
              <span className="relative inline-block">
                {/* Main Shifting Gradient Text */}
                <span
                  className="animate-gradient-shift"
                  style={{
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    backgroundSize: '200% 200%',
                    backgroundImage: 'radial-gradient(80.17% 109.2% at var(--gradient-x, 44.373%) var(--gradient-y, 35.1526%), rgb(200, 255, 225) 0%, rgb(67, 219, 133) 42.83%, rgb(20, 150, 75) 88.38%)'
                  }}
                >
                  Industry Developers
                </span>
                {/* Blurred Radiant Glow Clone (MotionSites Superpowers Glow Effect) */}
                <span
                  className="animate-gradient-shift select-none"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    right: 0,
                    bottom: 0,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    backgroundSize: '200% 200%',
                    backgroundImage: 'radial-gradient(80.17% 109.2% at var(--gradient-x, 44.373%) var(--gradient-y, 35.1526%), rgb(200, 255, 225) 0%, rgb(67, 219, 133) 42.83%, rgb(20, 150, 75) 88.38%)',
                    filter: 'blur(16px)',
                    mixBlendMode: 'screen',
                    opacity: 0.85,
                    pointerEvents: 'none',
                    zIndex: 2
                  }}
                >
                  Industry Developers
                </span>
              </span>
            </span>
            <span className="block mt-1 sm:mt-2 text-white">Through Production Code.</span>
          </h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: easeOut }}
            className="text-sm sm:text-base text-[#CBD5E1] text-center max-w-2xl mx-auto mt-5 leading-relaxed font-light"
          >
            Work on live client repositories inside <strong className="text-white font-semibold">VGM Soft Tech</strong> in Coimbatore. Build scalable full-stack and mobile applications under Senior Staff Engineers with 100% placement support.
          </motion.p>

          {/* MotionSites Glowing Pill Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: easeOut }}
            className="flex flex-wrap items-center justify-center gap-3.5 pt-7"
          >
            {/* Primary MotionSites Pill Button */}
            <Link
              to="/courses"
              className="flex items-center justify-center gap-1.5 px-8 py-3.5 text-sm sm:text-base font-semibold rounded-full border-t-2 border-white cursor-pointer hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-[0_10px_30px_rgba(30,158,84,0.4)]"
              style={{
                backgroundImage: 'linear-gradient(to top, rgb(20, 120, 60) 15%, rgb(67, 193, 112) 85%)',
                color: '#FFFFFF'
              }}
            >
              <span>Explore All Tracks →</span>
            </Link>

            {/* Secondary Frosted Glass Pill */}
            <Link
              to="/enrol"
              className="flex items-center justify-center gap-1.5 px-7 py-3.5 text-sm sm:text-base font-semibold rounded-full border border-white/20 bg-white/10 hover:bg-white/15 text-white backdrop-blur-md hover:scale-[1.02] transition-all duration-200"
            >
              <span>Enrol Directly</span>
              <ArrowUpRight className="w-4 h-4 text-[#43C170]" />
            </Link>

            {/* Syllabus Modal Trigger */}
            <button
              type="button"
              onClick={() => {
                setSyllabusCourseSlug('ai-mobile-app');
                setIsSyllabusModalOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full border border-white/15 hover:border-[#43C170]/60 bg-black/40 hover:bg-black/60 text-[#CBD5E1] hover:text-white text-xs font-semibold uppercase tracking-wider transition-all backdrop-blur-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#43C170]" />
              <span>Get 2026 Syllabus</span>
            </button>
          </motion.div>

          {/* Key Trust Metrics */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-8 pt-6 border-t border-white/10 font-mono text-[11px] sm:text-xs uppercase tracking-wider text-[#94A3B8]"
          >
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg sm:text-xl font-black text-white">400+</span>
              <span>Hrs Live Code</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E54] hidden sm:block"></span>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg sm:text-xl font-black text-[#43C170]">94.8%</span>
              <span>Placement Rate</span>
            </div>
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E54] hidden sm:block"></span>
            <div className="flex items-center gap-2">
              <span className="font-heading text-lg sm:text-xl font-black text-white">450+</span>
              <span>Hiring Partners</span>
            </div>
          </motion.div>

        </div>

      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 2. SECTION: STATS STRIP WITH CINEMATIC COUNTERS (#home-stats) */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative z-10 border-y border-black/5 bg-[#F7F8FA]/90 backdrop-blur-xl py-14 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-1"
            >
              <span className="text-4xl sm:text-6xl font-black text-[#1E9E54] block tabular-nums tracking-tight">
                <AnimatedCounter value={PLACEMENT_STATS.highestPackage} />
              </span>
              <p className="text-xs text-[#666666] font-mono uppercase tracking-wider">Highest Tech Package</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="space-y-1"
            >
              <span className="text-4xl sm:text-6xl font-black text-[#D97706] block tabular-nums tracking-tight">
                <AnimatedCounter value={PLACEMENT_STATS.averagePackage} />
              </span>
              <p className="text-xs text-[#666666] font-mono uppercase tracking-wider">Average Fresher CTC</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-1"
            >
              <span className="text-4xl sm:text-6xl font-black text-[#1E9E54] block tabular-nums tracking-tight">
                <AnimatedCounter value={PLACEMENT_STATS.totalAlumniPlaced} />
              </span>
              <p className="text-xs text-[#666666] font-mono uppercase tracking-wider">Graduates Placed</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="space-y-1"
            >
              <span className="text-4xl sm:text-6xl font-black text-[#111111] block tabular-nums tracking-tight">
                <AnimatedCounter value="100%" />
              </span>
              <p className="text-xs text-[#666666] font-mono uppercase tracking-wider">Placement Assistance</p>
            </motion.div>
          </div>

          {/* Accreditations */}
          <div className="pt-6 border-t border-black/5 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs text-[#777777] font-mono uppercase tracking-wider">
            <div className="flex items-center gap-2 hover:text-[#111111] transition-colors">
              <img src="/assets/accreditations/vgm-soft-tech.svg" alt="VGM Soft Tech" className="w-4 h-4 opacity-70" />
              <span>VGM Soft Tech Enterprise Division</span>
            </div>
            <div className="flex items-center gap-2 hover:text-[#111111] transition-colors">
              <img src="/assets/accreditations/iso-9001.svg" alt="ISO 9001" className="w-4 h-4 opacity-70" />
              <span>ISO 9001:2015 Certified</span>
            </div>
            <div className="flex items-center gap-2 hover:text-[#111111] transition-colors">
              <img src="/assets/accreditations/skill-india.svg" alt="Skill India" className="w-4 h-4 opacity-70" />
              <span>Skill India Standards</span>
            </div>
            <div className="flex items-center gap-2 hover:text-[#111111] transition-colors">
              <img src="/assets/accreditations/coimbatore-campus.svg" alt="Campus" className="w-4 h-4 opacity-70" />
              <span>Saibaba Colony Tech Hub</span>
            </div>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 3. SECTION: REEL & STATEMENT (#home-reel)                     */}
      {/*    LUSION EDITORIAL REVEAL WITH MASKED TYPOGRAPHY             */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="home-reel" className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-16">

          {/* Split Heading in Lusion's Editorial Aesthetic */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <div className="font-mono text-xs text-[#1E9E54] uppercase tracking-[0.25em] mb-4 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E9E54] animate-pulse" />
                <span>[02 // EDITORIAL REEL]</span>
              </div>
              
              {/* Masked character-by-character typography */}
              <div className="space-y-1">
                <CinematicTextReveal
                  text="Bold Ideas,"
                  tag="h2"
                  className="text-5xl sm:text-6xl lg:text-7xl font-black text-[#111111] leading-[0.92] tracking-[-0.04em]"
                />
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gradient-green leading-[0.92] tracking-[-0.04em]">
                  Brought to Life
                </h2>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6 lg:pl-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-lg sm:text-xl text-[#555555] font-light leading-relaxed"
              >
                We combine software engineering architecture, Generative AI models, live client sprint requirements, and senior staff code reviews to create digital developers that feel technically exceptional and production-ready from day one.
              </motion.p>

              <div>
                <Link to="/programme" className="lusion-cta-btn">
                  <span className="cta-dot"></span>
                  <span className="cta-text">Our Curriculum Approach</span>
                  <span className="cta-arrow">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              </div>
            </div>
          </div>

          {/* Software House Workflow Frame with Luxury Cinematic Cards */}
          <div className="relative rounded-[32px] border border-black/5 bg-[#F7F8FA]/80 backdrop-blur-xl p-6 sm:p-10 overflow-hidden shadow-xs">
            {/* Top crosshair hairline */}
            <div className="w-full h-px bg-black/10 relative flex justify-between items-center mb-8">
              <span className="lusion-cross -translate-y-1/2"></span>
              <span className="lusion-cross -translate-y-1/2"></span>
              <span className="lusion-cross -translate-y-1/2"></span>
              <span className="lusion-cross -translate-y-1/2"></span>
              <span className="lusion-cross -translate-y-1/2"></span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <CinematicCard index={1} badge="Sprint">
                <div className="space-y-3 h-full flex flex-col justify-between">
                  <h4 className="text-base font-bold text-[#111111]">Live Client Codebase</h4>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    Submit real Pull Requests directly to active VGM Soft Tech client projects instead of dummy classroom scripts.
                  </p>
                </div>
              </CinematicCard>

              <CinematicCard index={2} badge="AI Stack">
                <div className="space-y-3 h-full flex flex-col justify-between">
                  <h4 className="text-base font-bold text-[#111111]">Gemini &amp; LLM Workflows</h4>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    Integrate streaming generative models, embeddings, and vector storage into production user interfaces.
                  </p>
                </div>
              </CinematicCard>

              <CinematicCard index={3} badge="Mentorship">
                <div className="space-y-3 h-full flex flex-col justify-between">
                  <h4 className="text-base font-bold text-[#111111]">1-on-1 Senior Reviews</h4>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    Receive detailed line-by-line PR feedback covering modularity, async states, and zero-defect deployments.
                  </p>
                </div>
              </CinematicCard>

              <CinematicCard index={4} badge="Career">
                <div className="space-y-3 h-full flex flex-col justify-between">
                  <h4 className="text-base font-bold text-[#111111]">Direct Tech Hiring</h4>
                  <p className="text-xs text-[#666666] leading-relaxed">
                    Graduate with verified experience letters, published live applications, and direct drives with 450+ partners.
                  </p>
                </div>
              </CinematicCard>
            </div>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 4. SECTION: FEATURED SOFT CARDS (#home-featured)             */}
      {/*    LIGHT THEME ASYMMETRICAL 3D PERSPECTIVE WATERFALL         */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="home-featured" className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 lg:px-12 bg-[#F7F8FA]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto space-y-16">

          {/* Top Title & Uppercase Disclaimer */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-black/10">
            <div>
              <div className="font-mono text-xs text-[#1E9E54] uppercase tracking-[0.25em] mb-3 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E9E54]" />
                <span>[03 // FEATURED WORK]</span>
              </div>
              <CinematicTextReveal
                text="Featured Tracks"
                tag="h2"
                className="text-5xl sm:text-7xl lg:text-8xl font-black text-[#111111] tracking-[-0.04em] leading-none"
              />
            </div>

            <div className="lg:max-w-md font-mono text-[11px] sm:text-xs text-[#666666] uppercase tracking-widest leading-relaxed">
              A SELECTION OF PRODUCTION-GRADE INTERNSHIP TRACKS ENGINEERED FOR AMBITIOUS DEVELOPERS AND FUTURE TECH LEADERS.
            </div>
          </div>

          {/* Segmented & Category Filter Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2">

            {/* Segmented Sort Pills */}
            <div className="inline-flex items-center p-1 rounded-full border border-black/10 bg-white shadow-xs shrink-0">
              {(['Featured', 'Popular', 'Recent'] as const).map((sort) => (
                <button
                  key={sort}
                  type="button"
                  onClick={() => setActiveSort(sort)}
                  className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full transition-all whitespace-nowrap cursor-pointer ${activeSort === sort
                    ? 'bg-[#111111] text-white font-bold shadow-xs'
                    : 'text-[#666666] hover:text-[#111111]'
                    }`}
                >
                  {sort}
                </button>
              ))}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1" style={{ scrollbarWidth: 'none' }}>
              {['All', 'Mobile Development', 'Full-Stack Web', 'AI & Data Science', 'Cloud & DevOps', 'Cybersecurity', 'UI/UX Design'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFeaturedCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${featuredCategory === cat
                    ? 'bg-[#1E9E54] text-white font-bold shadow-xs'
                    : 'bg-white border border-black/10 text-[#666666] hover:text-[#111111] hover:border-black/30'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>

          {/* 
            THE SIGNATURE LUSION SOFT CARD WATERFALL WITH 3D PERSPECTIVE TILT:
            - 2-Column Responsive Grid
            - Column 2 items have massive top margin offset (md:mt-28 lg:mt-36)
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 md:gap-y-24 items-start pt-6">
            {filteredCourses.map((course, idx) => {
              const isOffset = idx % 2 === 1;
              return (
                <div
                  key={course.id}
                  className={`group relative ${isOffset ? 'md:mt-28 lg:mt-36' : ''}`}
                >
                  <CinematicCard className="p-0 overflow-hidden">
                    {/* Soft Card Container in Pure White */}
                    <div
                      className="p-6 sm:p-8 flex flex-col justify-between overflow-hidden bg-white"
                    >

                      {/* Visual Media Showcase with 16/10 Aspect Ratio */}
                      <Link
                        to={`/courses/${course.slug}`}
                        className="block relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#EAEFF2] border border-black/5 mb-6 group-hover:border-[#1E9E54]/40 transition-all"
                      >
                        {course.thumbnail ? (
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#EAEFF2] to-[#D5DEE5]">
                            <Cpu className="w-16 h-16 text-[#1E9E54]/40" />
                          </div>
                        )}

                        {/* Top Floating Pill Tags */}
                        <div className="absolute top-4 left-4 flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/10 text-[#14723B]">
                            {course.badge}
                          </span>
                        </div>

                        <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/10 font-mono text-xs font-bold text-[#D97706]">
                          <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                          <span>{course.rating}</span>
                        </div>

                        {/* Bottom Info Bar Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex items-center justify-between text-xs font-mono text-white">
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#43C170]" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Award className="w-3.5 h-3.5 text-[#43C170]" />
                            {course.liveProjectsCount} Projects
                          </span>
                        </div>
                      </Link>

                      {/* Metadata Line 1: Uppercase Tracked Skills */}
                      <div className="font-mono text-[10px] sm:text-xs text-[#1E9E54] uppercase tracking-[0.2em] mb-2 font-bold">
                        {course.category} • {course.curriculum?.length || 4} MODULES • LIVE REPO
                      </div>

                      {/* Title Line 2: Big Title with Sliding Arrow */}
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <h3 className="text-2xl sm:text-3xl font-black text-[#111111] group-hover:text-[#1E9E54] transition-colors leading-tight">
                          <Link to={`/courses/${course.slug}`}>
                            {course.title}
                          </Link>
                        </h3>
                        <div className="w-10 h-10 rounded-full border border-black/10 group-hover:border-[#1E9E54] group-hover:bg-[#1E9E54] flex items-center justify-center shrink-0 transition-all duration-500">
                          <ArrowUpRight className="w-4 h-4 text-[#111111] group-hover:text-white transition-colors" />
                        </div>
                      </div>

                      {/* Brief description */}
                      <p className="text-xs sm:text-sm text-[#666666] line-clamp-2 mb-6 leading-relaxed">
                        {course.shortDescription}
                      </p>

                      {/* Card Footer: Pricing & Action Buttons */}
                      <div className="pt-4 border-t border-black/5 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono uppercase text-[#888888] block">Tuition Starts At</span>
                          <span className="text-lg font-black text-[#111111] font-mono">{course.startingFeeFormatted}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setSyllabusCourseSlug(course.slug);
                              setIsSyllabusModalOpen(true);
                            }}
                            className="px-3.5 py-2 rounded-full text-xs font-mono uppercase tracking-wider text-[#555555] hover:text-[#111111] border border-black/10 hover:border-black/30 transition-all bg-white cursor-pointer"
                          >
                            Syllabus
                          </button>
                          <Link
                            to={`/enrol?course=${course.slug}`}
                            className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#111111] hover:bg-[#1E9E54] transition-all"
                          >
                            Enrol Now
                          </Link>
                        </div>
                      </div>

                    </div>
                  </CinematicCard>
                </div>
              );
            })}
          </div>

          {/* Bottom All Tracks Pill CTA */}
          <div className="pt-12 text-center">
            <Link to="/courses" className="lusion-cta-btn" data-cursor-text="ALL TRACKS">
              <span className="cta-dot"></span>
              <span className="cta-text">View All {COURSES_CATALOG.length} Tracks in Poster Stage</span>
              <span className="cta-arrow">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 5. SECTION: EDITORIAL MISSION (#home-goal)                   */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="home-goal" className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 lg:px-12 border-t border-black/5">
        <div className="max-w-7xl mx-auto space-y-20">

          <div className="font-mono text-xs text-[#1E9E54] uppercase tracking-[0.25em] font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1E9E54]" />
            <span>[04 // THE MISSION]</span>
          </div>

          {/* Giant Mission Statement */}
          <CinematicTextReveal
            text="Where Academic Knowledge Becomes Production Mastery"
            tag="h2"
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#111111] tracking-[-0.04em] leading-[0.95] max-w-4xl"
          />

          {/* 2-Column Editorial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-light text-base sm:text-lg text-[#555555] leading-relaxed">
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              We do not chase outdated university syllabi or teach surface-level syntax tutorials. We focus on immersing you directly into active software projects, clean Git branch flows, and scalable system design that reflects how modern engineering teams build and deploy software.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              Our process blends software craftsmanship, AI copilot workflows, and real code reviews to build tailored engineering journeys that feel authentic, disciplined, and built for lasting industry impact.
            </motion.p>
          </div>

          {/* Tunnel Typography Callout with Cinematic Depth */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: easeOut }}
            className="py-12 border-y border-black/10 text-center space-y-2 select-none"
          >
            <div className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-black/15 uppercase tracking-tight">
              Step into our live software lab
            </div>
            <div className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-gradient-green uppercase tracking-tight">
              and write code that ships
            </div>
            <div className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-black/15 uppercase tracking-tight">
              to production users
            </div>
          </motion.div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 6. SECTION: 4-STAGE LEARNING PIPELINE (CINEMATIC CARD STACK) */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative z-10 py-20 px-4 sm:px-8 lg:px-12 bg-[#F7F8FA]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto space-y-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/10">
            <div>
              <span className="font-mono text-xs text-[#1E9E54] uppercase tracking-[0.25em] block mb-2 font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E9E54]" />
                <span>[05 // CURRICULUM ARCHITECTURE]</span>
              </span>
              <CinematicTextReveal
                text="The 4-Stage Learning-To-Placement Pipeline"
                tag="h2"
                className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight"
              />
            </div>
            <p className="text-xs sm:text-sm text-[#666666] font-mono max-w-sm uppercase">
              From foundational setup to live client sprint repositories and campus placements.
            </p>
          </div>

          {/* Sticky Stacking Cards with Real Cinematic Depth */}
          <CinematicCardStack topOffset={110} stackOffset={24}>

            {/* Stage 1 */}
            <CinematicCard index={1} badge="Weeks 1–2" className="bg-white shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-2">
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#111111]">
                    Tooling &amp; Architecture Foundations
                  </h3>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    Modern frameworks, clean architecture patterns, Git branching &amp; AI developer copilots. Learn to scaffold enterprise software correctly from commit one.
                  </p>
                </div>
                <div className="md:col-span-4 bg-[#F7F8FA] p-4 rounded-2xl border border-black/5 font-mono text-xs space-y-1">
                  <span className="text-[#1E9E54] font-bold block">DELIVERABLE:</span>
                  <span className="text-[#333333]">Clean Git scaffold &amp; repository architecture</span>
                </div>
              </div>
            </CinematicCard>

            {/* Stage 2 */}
            <CinematicCard index={2} badge="Weeks 3–6" className="bg-white shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-2">
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#111111]">
                    Live Client Sprint Implementation
                  </h3>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    Build real software features for VGM Soft Tech client projects and integrate AI APIs. Experience true agile sprints with backlog planning and velocity tracking.
                  </p>
                </div>
                <div className="md:col-span-4 bg-[#F7F8FA] p-4 rounded-2xl border border-black/5 font-mono text-xs space-y-1">
                  <span className="text-[#1E9E54] font-bold block">DELIVERABLE:</span>
                  <span className="text-[#333333]">Production Pull Requests merged into staging</span>
                </div>
              </div>
            </CinematicCard>

            {/* Stage 3 */}
            <CinematicCard index={3} badge="Weeks 7–9" className="bg-white shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-2">
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#111111]">
                    Staff Code Audits &amp; Optimisation
                  </h3>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    1-on-1 reviews with Senior Staff Engineers for security, scalability, and performance. Benchmark latency, eliminate memory leaks, and configure CI/CD.
                  </p>
                </div>
                <div className="md:col-span-4 bg-[#F7F8FA] p-4 rounded-2xl border border-black/5 font-mono text-xs space-y-1">
                  <span className="text-[#1E9E54] font-bold block">DELIVERABLE:</span>
                  <span className="text-[#333333]">Staff-audited live deployed application</span>
                </div>
              </div>
            </CinematicCard>

            {/* Stage 4 */}
            <CinematicCard index={4} badge="Weeks 10–12" highlight className="shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-2">
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#111111]">
                    Placement Bootcamp &amp; Direct Drives
                  </h3>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    Technical mock interviews, ATS resume polish, and direct recruitment calls with 450+ hiring partners. Walk into interviews with audited repositories and confidence.
                  </p>
                </div>
                <div className="md:col-span-4 bg-emerald-50/80 p-4 rounded-2xl border border-emerald-500/20 font-mono text-xs space-y-1">
                  <span className="text-emerald-700 font-bold block">OUTCOME:</span>
                  <span className="text-emerald-900 font-semibold">Job Offer &amp; Experience Certificate</span>
                </div>
              </div>
            </CinematicCard>

          </CinematicCardStack>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 7. SECTION: HIGH-CONTRAST TERMINAL CODE DEMO                 */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative z-10 py-20 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          <div className="lg:col-span-6 space-y-6">
            <span className="font-mono text-xs text-[#1E9E54] uppercase tracking-[0.25em] font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1E9E54]" />
              <span>[06 // PRODUCTION WORKFLOW]</span>
            </span>
            <CinematicTextReveal
              text="Build Production Software From Day One"
              tag="h2"
              className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight leading-tight"
            />
            <p className="text-sm sm:text-base text-[#555555] leading-relaxed">
              Learn agile engineering: writing clean modular code, integrating Generative AI APIs, handling Git reviews, and deploying builds directly to cloud hosts.
            </p>

            <div className="space-y-3 font-mono text-xs text-[#444444]">
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#1E9E54]" />
                <span>Pull Request Standards &amp; Git Branch Flow</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#1E9E54]" />
                <span>Gemini 1.5 Streaming &amp; OpenAI API Integrations</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#1E9E54]" />
                <span>Containerized Deployment &amp; Cloud Workflows</span>
              </div>
            </div>

            <div className="pt-2">
              <Link to="/programme" className="lusion-cta-btn">
                <span className="cta-dot"></span>
                <span className="cta-text">View 12-Week Syllabus</span>
                <span className="cta-arrow">
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-black/10 bg-[#141618] text-white overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-5 py-4 bg-white/5 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('flutter')}
                    className={`px-3 py-1 text-xs rounded-md font-mono transition-colors cursor-pointer ${activeCodeTab === 'flutter'
                      ? 'bg-[#1E9E54]/30 text-[#43C170] font-semibold'
                      : 'text-white/60 hover:text-white'
                      }`}
                  >
                    gemini_service.dart
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('ai')}
                    className={`px-3 py-1 text-xs rounded-md font-mono transition-colors cursor-pointer ${activeCodeTab === 'ai'
                      ? 'bg-[#1E9E54]/30 text-[#43C170] font-semibold'
                      : 'text-white/60 hover:text-white'
                      }`}
                  >
                    git_workflow.sh
                  </button>
                </div>
              </div>
              <pre className="p-6 text-xs font-mono text-white/80 overflow-x-auto leading-relaxed">
                <code>{activeCodeTab === 'flutter' ? flutterCode : gitCode}</code>
              </pre>
            </div>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 8. SECTION: HIRING PARTNERS MARQUEE                          */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative z-10 py-20 border-y border-black/5 bg-[#F7F8FA]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-mono text-xs text-[#1E9E54] uppercase tracking-[0.25em] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E9E54]" />
                <span>[07 // PLACEMENT NETWORK]</span>
              </span>
              <CinematicTextReveal
                text="Where Our Graduates Build Their Careers"
                tag="h3"
                className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight mt-2"
              />
            </div>
            <Link
              to="/placements"
              className="font-mono text-xs text-[#1E9E54] hover:text-[#111111] flex items-center gap-1.5 transition-colors uppercase tracking-wider font-bold"
            >
              <span>Explore Placement Cell</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Gliding Infinite Tracks */}
          <div className="relative overflow-hidden py-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F7F8FA] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F7F8FA] to-transparent z-10" />

            {/* Track 1: Left */}
            <div className="animate-marquee flex items-center gap-4">
              {[...HIRING_PARTNERS, ...HIRING_PARTNERS].map((p, idx) => (
                <div
                  key={`track1-${idx}`}
                  className="px-6 py-4 rounded-2xl bg-white border border-black/5 hover:border-[#1E9E54]/50 flex items-center gap-3 transition-all shrink-0 group cursor-default shadow-xs"
                >
                  {p.logo ? (
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="h-6 w-auto max-w-[100px] object-contain opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#1E9E54]" />
                      <span className="text-xs font-bold text-[#444444] group-hover:text-[#111111] transition-colors">{p.name}</span>
                    </div>
                  )}
                  <span className="text-[10px] font-mono text-[#888888] uppercase pl-2 border-l border-black/10">
                    {p.category}
                  </span>
                </div>
              ))}
            </div>

            {/* Track 2: Right */}
            <div className="animate-marquee-reverse flex items-center gap-4 mt-4">
              {[...HIRING_PARTNERS.slice().reverse(), ...HIRING_PARTNERS.slice().reverse()].map((p, idx) => (
                <div
                  key={`track2-${idx}`}
                  className="px-6 py-4 rounded-2xl bg-white border border-black/5 hover:border-[#1E9E54]/50 flex items-center gap-3 transition-all shrink-0 group cursor-default shadow-xs"
                >
                  {p.logo ? (
                    <img
                      src={p.logo}
                      alt={p.name}
                      className="h-6 w-auto max-w-[100px] object-contain opacity-60 hover:opacity-100 grayscale hover:grayscale-0 transition-all"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#1E9E54]" />
                      <span className="text-xs font-bold text-[#444444] group-hover:text-[#111111] transition-colors">{p.name}</span>
                    </div>
                  )}
                  <span className="text-[10px] font-mono text-[#888888] uppercase pl-2 border-l border-black/10">
                    {p.category}
                  </span>
                </div>
              ))}
            </div>

          </div>

          {/* Hiring stats strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-black/5 text-center font-mono">
            <div className="p-4 rounded-xl bg-white border border-black/5 shadow-xs">
              <span className="text-xl font-black text-[#111111] block">
                <AnimatedCounter value="₹18.5 LPA" />
              </span>
              <span className="text-[11px] text-[#666666] uppercase">Highest Tech CTC</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-black/5 shadow-xs">
              <span className="text-xl font-black text-[#1E9E54] block">
                <AnimatedCounter value="₹6.2 LPA" />
              </span>
              <span className="text-[11px] text-[#666666] uppercase">Average Fresher Package</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-black/5 shadow-xs">
              <span className="text-xl font-black text-[#111111] block">
                <AnimatedCounter value="450+" />
              </span>
              <span className="text-[11px] text-[#666666] uppercase">Placement Partners</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-black/5 shadow-xs">
              <span className="text-xl font-black text-[#1E9E54] block">
                <AnimatedCounter value="100%" />
              </span>
              <span className="text-[11px] text-[#666666] uppercase">Interview Calls</span>
            </div>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 9. SECTION: ALUMNI SUCCESS STORIES                           */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-12">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-black/10">
            <div>
              <span className="font-mono text-xs text-[#1E9E54] uppercase tracking-[0.25em] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E9E54]" />
                <span>[08 // ALUMNI TESTIMONIALS]</span>
              </span>
              <CinematicTextReveal
                text="Trusted by 1,450+ Learners Across Tamil Nadu"
                tag="h2"
                className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight mt-2"
              />
            </div>
            <Link
              to="/placements"
              className="font-mono text-xs text-[#1E9E54] hover:text-[#111111] flex items-center gap-1.5 transition-colors uppercase tracking-wider font-bold"
            >
              <span>See All Alumni Profiles</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ALUMNI_STORIES.slice(0, 3).map((story, idx) => (
              <CinematicCard key={idx} className="h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-[#14723B] px-3 py-1 rounded-full bg-[#1E9E54]/10 border border-[#1E9E54]/20 font-bold">
                      {story.badge}
                    </span>
                    <span className="font-mono text-xs font-bold text-[#D97706] bg-[#D97706]/10 px-2.5 py-1 rounded-md">
                      {story.package}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                    ))}
                  </div>

                  <p className="text-sm text-[#555555] italic leading-relaxed">
                    &ldquo;{story.testimonial}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-black/5 flex items-center gap-3 mt-6">
                  <div className="w-10 h-10 rounded-full bg-[#1E9E54]/10 text-[#14723B] font-bold text-xs flex items-center justify-center shrink-0 border border-[#1E9E54]/30 font-mono">
                    {story.avatarInitials}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-[#111111] truncate">{story.name}</h4>
                    <p className="text-[11px] font-semibold text-[#1E9E54] truncate">{story.role} @ {story.company}</p>
                    <p className="text-[10px] text-[#777777] truncate font-mono">{story.college}</p>
                  </div>
                </div>
              </CinematicCard>
            ))}
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 10. SECTION: COIMBATORE CAMPUS SPOTLIGHT                     */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative z-10 py-16 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto rounded-[32px] border border-black/5 bg-[#F7F8FA]/90 backdrop-blur-xl p-8 sm:p-12 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            <div className="lg:col-span-6 space-y-6">
              <span className="font-mono text-xs text-[#1E9E54] uppercase tracking-[0.25em] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E9E54]" />
                <span>[09 // TECH LAB &amp; CAMPUS]</span>
              </span>
              <CinematicTextReveal
                text="Train Inside an Active Engineering Hub in Coimbatore"
                tag="h2"
                className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight leading-tight"
              />
              <p className="text-sm sm:text-base text-[#555555] leading-relaxed font-light">
                Experience software engineering the way modern product teams operate. Our Saibaba Colony campus houses dedicated development pods and direct mentorship with senior staff architects at <strong className="text-[#111111]">VGM Soft Tech</strong>.
              </p>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-black/5 shadow-2xs">
                  <span className="text-[#111111] font-bold block">Dev Pods &amp; Gigabit LAN</span>
                  <span className="text-[#777777] text-[10px]">Dedicated developer workstations</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-black/5 shadow-2xs">
                  <span className="text-[#111111] font-bold block">Agile Standup Rooms</span>
                  <span className="text-[#777777] text-[10px]">Weekly sprint audits</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-black/5 shadow-2xs">
                  <span className="text-[#111111] font-bold block">Hybrid Studio</span>
                  <span className="text-[#777777] text-[10px]">HD streaming sessions</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-black/5 shadow-2xs">
                  <span className="text-[#111111] font-bold block">Interview Pods</span>
                  <span className="text-[#777777] text-[10px]">1-on-1 mock interviews</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Link to="/about" className="lusion-cta-btn">
                  <span className="cta-dot"></span>
                  <span className="cta-text">Visit Campus</span>
                  <span className="cta-arrow">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                <a
                  href="https://maps.google.com/maps?q=Saibaba+Colony+Coimbatore+Tamil+Nadu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[#555555] hover:text-[#111111] flex items-center gap-1.5 uppercase tracking-wider"
                >
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>Google Maps</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-6">
              <CinematicImageExpand
                src="/assets/hero_building.png"
                alt="VGM Soft Tech Coimbatore Facility"
                caption="Saibaba Colony, Coimbatore, Tamil Nadu — Enterprise Software Engineering & Training Division"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 11. SECTION: SCROLL NAV TRANSITION (#scroll-nav-section)     */}
      {/*     LIGHT THEME LUSION SCROLL TRANSITION TO COURSES          */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="scroll-nav-section"
        className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 lg:px-12 bg-[#F0F2F4]/90 backdrop-blur-xl border-t border-black/10 text-[#111111] cursor-pointer group"
        onClick={() => navigate('/courses')}
      >
        <div className="max-w-7xl mx-auto space-y-8">

          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-[#1E9E54] uppercase tracking-[0.25em] font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1E9E54]" />
              <span>[10 // KEEP SCROLLING TO DISCOVER]</span>
            </span>
            <span className="font-mono text-xs text-[#666666] uppercase tracking-widest hidden sm:inline">
              CLICK OR SCROLL TO ENTER
            </span>
          </div>

          {/* Giant Next Page Title */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="text-5xl sm:text-7xl lg:text-8xl font-black text-[#111111] group-hover:text-[#1E9E54] transition-colors tracking-[-0.04em] leading-none">
              Explore All Tracks
            </div>

            {/* Next Page Bar with animated inner progress */}
            <div className="flex items-center gap-4 min-w-[260px] lg:w-1/3">
              <span className="font-mono text-xs uppercase tracking-wider text-[#666666] group-hover:text-[#111111] transition-colors font-bold">
                Courses Stage
              </span>
              <div className="flex-1 h-1.5 bg-black/10 rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-[#1E9E54] rounded-full transition-all duration-150 ease-out"
                  style={{ width: `${Math.min(100, Math.max(15, scrollProgress))}%` }}
                />
              </div>
              <div className="w-10 h-10 rounded-full bg-[#111111] group-hover:bg-[#1E9E54] text-white flex items-center justify-center shrink-0 group-hover:translate-x-2 transition-all duration-300">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* 5 Crosshairs Line */}
          <div className="pt-8">
            <div className="w-full h-px bg-black/10 relative flex justify-between items-center">
              <span className="lusion-cross -translate-y-1/2"></span>
              <span className="lusion-cross -translate-y-1/2"></span>
              <span className="lusion-cross -translate-y-1/2"></span>
              <span className="lusion-cross -translate-y-1/2"></span>
              <span className="lusion-cross -translate-y-1/2"></span>
            </div>
          </div>

        </div>
      </section>

      {/* Curriculum Syllabus Modal */}
      <SyllabusDownloadModal
        isOpen={isSyllabusModalOpen}
        onClose={() => setIsSyllabusModalOpen(false)}
        defaultCourseSlug={syllabusCourseSlug}
      />

    </div>
  );
};
