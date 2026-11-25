import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CourseItem } from '../config/coursesData.js';
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
  Play,
  CheckCircle2,
  Terminal,
  GitBranch,
  FileCode,
  Users,
  Code,
  Laptop,
  Briefcase,
  GraduationCap,
  FileText,
  Calendar,
  ChevronRight,
  Layers,
  Shield,
  RotateCcw
} from 'lucide-react';

const easeOut = [0.16, 1, 0.3, 1] as const;

// 4-Phase Internship Daily Routine Data
const INTERNSHIP_ROUTINE = [
  {
    time: '09:30 AM',
    phase: 'Phase 01',
    title: 'Agile Standup & Sprint Backlog',
    tag: 'STUDY & ALIGN',
    desc: 'Join your assigned developer pod. Review yesterday’s pull requests, resolve blockers with the senior engineering lead, and pick your active sprint tickets.',
    deliverable: 'Jira Sprint Ticket Assignment & Git Branch Scaffolding',
    icon: Users,
    color: '#1E9E54',
  },
  {
    time: '11:00 AM',
    phase: 'Phase 02',
    title: 'Live Production Feature Coding',
    tag: 'HANDS-ON REPO',
    desc: 'Work directly inside active VGM client repositories. Write clean TypeScript, Flutter, or Python modules using modern patterns, state machines, and AI APIs.',
    deliverable: 'Feature Commits & Unit Test Suite Pass',
    icon: Code,
    color: '#0284C7',
  },
  {
    time: '03:30 PM',
    phase: 'Phase 03',
    title: '1-on-1 Senior Staff Code Audits',
    tag: 'MENTOR AUDIT',
    desc: 'Submit your Pull Request. Sit 1-on-1 with a senior architect to walk through edge cases, async performance, memory leak profiling, and API security.',
    deliverable: 'Staff-Approved Pull Request & Merged to Staging',
    icon: GitBranch,
    color: '#8B5CF6',
  },
  {
    time: '05:30 PM',
    phase: 'Phase 04',
    title: 'CI/CD Deploy & Experience Logging',
    tag: 'PRODUCTION SHIP',
    desc: 'Watch your code build and pass cloud automated deployment checks. Every completed sprint module logs verifiable experience credits for your official relieving letter.',
    deliverable: 'Live Cloud Endpoint & Experience Credential Entry',
    icon: ShieldCheck,
    color: '#D97706',
  },
];

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseItem[]>([]);
  const [activeCodeTab, setActiveCodeTab] = useState<'flutter' | 'git' | 'backend'>('flutter');
  const [activeRoutineIndex, setActiveRoutineIndex] = useState<number>(0);
  const [activeDeliverableTab, setActiveDeliverableTab] = useState<'letter' | 'certificate' | 'github'>('letter');
  const [featuredCategory, setFeaturedCategory] = useState<string>('All');
  const [activeSort, setActiveSort] = useState<'Featured' | 'Popular' | 'Recent'>('Featured');
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState<boolean>(false);
  const [syllabusCourseSlug, setSyllabusCourseSlug] = useState<string>('ai-mobile-app');
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  // Interactive Live Sprint Simulator State
  const [testState, setTestState] = useState<'idle' | 'running' | 'passed'>('idle');
  const [testLogs, setTestLogs] = useState<string[]>([]);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
          setCourses(data.courses);
        }
      })
      .catch(() => {});
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

  // Run Test Sprint Simulation
  const handleRunSprintTests = () => {
    if (testState === 'running') return;
    setTestState('running');
    setTestLogs(['$ npx vitest run --reporter=verbose sprint_audit.test.ts']);

    setTimeout(() => {
      setTestLogs(prev => [
        ...prev,
        '✓ [AUTH] Bearer token validation middleware (18ms)',
        '✓ [STREAM] Gemini 1.5 Flash generative chunk latency < 120ms (42ms)'
      ]);
    }, 600);

    setTimeout(() => {
      setTestLogs(prev => [
        ...prev,
        '✓ [DB] Supabase PostgreSQL query pool health (14ms)',
        '✓ [SECURITY] Zod input sanitization & rate limit checks (12ms)'
      ]);
    }, 1200);

    setTimeout(() => {
      setTestLogs(prev => [
        ...prev,
        '✓ [BUILD] Production bundle size verified under budget (154 kB)',
        '======================================================',
        'STATUS: 5 passed in 238ms • Ready for Senior Staff PR Merge!'
      ]);
      setTestState('passed');
    }, 1800);
  };

  const handleResetTest = () => {
    setTestState('idle');
    setTestLogs([]);
  };

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
    final prompt = 'Build a production engineering sprint plan for: $topic';
    final response = _model.generateContentStream([Content.text(prompt)]);
    await for (final chunk in response) {
      if (chunk.text != null) yield chunk.text!;
    }
  }
}`;

  const gitCode = `# Live engineering workflow in VGM Soft Tech internship pods
$ git checkout -b feat/speech-recognition
$ flutter pub add speech_to_text
$ git commit -m "feat(voice): add offline speech input with fallback"
$ git push origin feat/speech-recognition
# Open Pull Request -> Senior Architect Review -> Automated Staging CI/CD`;

  const backendCode = `// src/controllers/enrollment.controller.ts
import { Request, Response } from 'express';
import { SupabaseService } from '../services/supabase.js';
import { enrollmentSchema } from '../validators/enrollment.js';

export async function createStudentEnrollment(req: Request, res: Response) {
  const validated = enrollmentSchema.parse(req.body);
  const enrollment = await SupabaseService.createEnrolment(validated);
  return res.status(201).json({ success: true, enrollment });
}`;

  const filteredCourses = useMemo(() => {
    return courses
      .filter(c => featuredCategory === 'All' || c.category === featuredCategory)
      .sort((a, b) => {
        if (activeSort === 'Popular') return (b.rating || 5) - (a.rating || 5);
        if (activeSort === 'Recent') return b.id.localeCompare(a.id);
        return 0;
      });
  }, [courses, featuredCategory, activeSort]);

  return (
    <div className="relative bg-[#FFFFFF] text-[#111111] min-h-screen selection:bg-[#43C170]/30 selection:text-[#111111]">

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* FRESH CINEMATIC AMBIENT BACKGROUND                         */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <CinematicBackground />

      {/* Top Scroll Progress Hairline */}
      <div
        className="fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-transparent via-[#1E9E54] to-[#43C170] z-50 transition-all duration-100 ease-out pointer-events-none shadow-[0_0_12px_rgba(30,158,84,0.6)]"
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
      {/* 2. SECTION: STATS STRIP WITH CINEMATIC TELEMETRY (#home-stats) */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative z-10 border-y border-black/[0.08] bg-[#F8FAFC]/95 backdrop-blur-2xl py-14 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">

          {/* Live Cohort Status Banner */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-emerald-500/20 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1E9E54] opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1E9E54]" />
              </span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#14723B]">
                Academic Cohort 2026 Admissions Open
              </span>
              <span className="hidden sm:inline-block text-black/20">|</span>
              <span className="text-xs text-[#555555] font-medium hidden sm:inline-block">
                Coimbatore On-Campus Pods &amp; Live Remote Internship Seats
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-[#14723B] font-bold border border-emerald-200">
                Next Batch: 15th December 2026
              </span>
              <Link
                to="/enrol"
                className="text-[#1E9E54] hover:text-[#14723B] font-bold flex items-center gap-1 group"
              >
                <span>Reserve Seat</span>
                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* 4 Interactive Metric Telemetry Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="p-6 rounded-3xl bg-white border border-black/[0.08] hover:border-emerald-500/40 hover:shadow-[0_20px_40px_-15px_rgba(30,158,84,0.12)] transition-all group"
            >
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1E9E54] block tabular-nums tracking-tight font-heading group-hover:scale-105 transition-transform">
                <AnimatedCounter value={PLACEMENT_STATS.highestPackage} />
              </span>
              <p className="text-xs text-[#111111] font-heading font-bold uppercase tracking-wider mt-2">Highest Tech CTC</p>
              <p className="text-[11px] text-[#777777] font-mono mt-0.5">Top Product Engineering Role</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="p-6 rounded-3xl bg-white border border-black/[0.08] hover:border-amber-500/40 hover:shadow-[0_20px_40px_-15px_rgba(217,119,6,0.12)] transition-all group"
            >
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#D97706] block tabular-nums tracking-tight font-heading group-hover:scale-105 transition-transform">
                <AnimatedCounter value={PLACEMENT_STATS.averagePackage} />
              </span>
              <p className="text-xs text-[#111111] font-heading font-bold uppercase tracking-wider mt-2">Average Fresher Package</p>
              <p className="text-[11px] text-[#777777] font-mono mt-0.5">Software Development Engineer</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="p-6 rounded-3xl bg-white border border-black/[0.08] hover:border-emerald-500/40 hover:shadow-[0_20px_40px_-15px_rgba(30,158,84,0.12)] transition-all group"
            >
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#1E9E54] block tabular-nums tracking-tight font-heading group-hover:scale-105 transition-transform">
                <AnimatedCounter value={PLACEMENT_STATS.totalAlumniPlaced} />
              </span>
              <p className="text-xs text-[#111111] font-heading font-bold uppercase tracking-wider mt-2">Interns &amp; Alumni Placed</p>
              <p className="text-[11px] text-[#777777] font-mono mt-0.5">Across 450+ Tech Companies</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              className="p-6 rounded-3xl bg-white border border-black/[0.08] hover:border-black/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.08)] transition-all group"
            >
              <span className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111111] block tabular-nums tracking-tight font-heading group-hover:scale-105 transition-transform">
                <AnimatedCounter value="100%" />
              </span>
              <p className="text-xs text-[#111111] font-heading font-bold uppercase tracking-wider mt-2">Placement Assistance</p>
              <p className="text-[11px] text-[#777777] font-mono mt-0.5">Resume ATS + 1-on-1 Mock Drives</p>
            </motion.div>

          </div>

          {/* Academic Accreditations & Industry Standards */}
          <div className="pt-6 border-t border-black/[0.08] flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-[#666666] font-mono uppercase tracking-wider">
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-black/[0.06] shadow-2xs">
              <Shield className="w-4 h-4 text-[#1E9E54]" />
              <span>VGM Soft Tech Enterprise Division</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-black/[0.06] shadow-2xs">
              <Award className="w-4 h-4 text-[#1E9E54]" />
              <span>ISO 9001:2015 Certified Curriculum</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-black/[0.06] shadow-2xs">
              <GraduationCap className="w-4 h-4 text-[#1E9E54]" />
              <span>Official Stamped Relieving Letter</span>
            </div>
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-white border border-black/[0.06] shadow-2xs">
              <MapPin className="w-4 h-4 text-[#1E9E54]" />
              <span>Saibaba Colony Tech Hub, Coimbatore</span>
            </div>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 3. SECTION: THE LIVE SOFTWARE HOUSE INTERNSHIP MODEL         */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="home-reel" className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-16">

          {/* Section Header */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5 space-y-3">
              <div className="font-mono text-xs text-[#1E9E54] uppercase tracking-[0.25em] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E9E54] animate-pulse" />
                <span>[02 // REAL-WORLD INTERNSHIP DYNAMICS]</span>
              </div>
              
              <CinematicTextReveal
                text="Not Just Classes."
                tag="h2"
                className="text-4xl sm:text-6xl font-black text-[#111111] leading-[0.95] tracking-[-0.04em] font-heading"
              />
              <h2 className="text-4xl sm:text-6xl font-black text-gradient-green leading-[0.95] tracking-[-0.04em] font-heading">
                A Working Software House.
              </h2>
            </div>

            <div className="lg:col-span-7 space-y-6 lg:pl-6">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.8 }}
                className="text-base sm:text-xl text-[#555555] font-light leading-relaxed"
              >
                Traditional training institutes teach outdated syntax on dummy calculator apps. At VGM Skill Hub, you are onboarded as an engineering intern inside an active IT product firm in Coimbatore. You write production pull requests, handle Git reviews, benchmark response times, and ship code directly to live clients.
              </motion.p>

              <div className="flex flex-wrap items-center gap-4">
                <Link to="/courses" className="lusion-cta-btn">
                  <span className="cta-dot" />
                  <span className="cta-text">Explore All 6 Internship Tracks</span>
                  <span className="cta-arrow">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <Link
                  to="/student-portal"
                  className="px-5 py-3 rounded-full bg-white hover:bg-slate-50 border border-black/10 text-xs font-mono font-bold uppercase tracking-wider text-[#111111] flex items-center gap-2 transition-all shadow-2xs"
                >
                  <Award className="w-4 h-4 text-[#1E9E54]" />
                  <span>Verify Certificate &amp; Enrollment</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Interactive Daily Internship Routine Simulator */}
          <div className="rounded-[32px] border border-black/[0.08] bg-[#F8FAFC]/90 backdrop-blur-2xl p-6 sm:p-10 shadow-xs space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-black/[0.08]">
              <div>
                <span className="text-xs font-mono font-bold uppercase text-[#1E9E54] tracking-widest block">
                  A DAY IN THE LIFE OF AN INTERN
                </span>
                <h3 className="text-2xl font-black text-[#111111] font-heading mt-1">
                  Daily Engineering Sprint Cadence
                </h3>
              </div>
              <p className="text-xs text-[#666666] font-mono max-w-sm">
                Click any phase below to inspect the real developer routine practiced inside our developer pods.
              </p>
            </div>

            {/* Interactive Timeline Tabs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {INTERNSHIP_ROUTINE.map((item, idx) => {
                const isSelected = activeRoutineIndex === idx;
                const IconComponent = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveRoutineIndex(idx)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-white border-[#1E9E54] shadow-md ring-1 ring-[#1E9E54]/20'
                        : 'bg-white/60 border-black/[0.06] hover:bg-white hover:border-black/20'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-bold text-[#888888]">
                        {item.time}
                      </span>
                      <IconComponent
                        className={`w-4 h-4 ${isSelected ? 'text-[#1E9E54]' : 'text-slate-400'}`}
                      />
                    </div>
                    <p className={`text-xs font-bold leading-snug ${isSelected ? 'text-[#111111]' : 'text-slate-600'}`}>
                      {item.title}
                    </p>
                    <span className={`mt-2 inline-block text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      isSelected ? 'bg-emerald-50 text-[#14723B]' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {item.phase}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Selected Phase Detail Showcase */}
            <motion.div
              key={activeRoutineIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="p-6 sm:p-8 rounded-2xl bg-white border border-black/[0.08] shadow-xs grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
            >
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-emerald-50 text-[#14723B] border border-emerald-200">
                    {INTERNSHIP_ROUTINE[activeRoutineIndex].tag}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Scheduled: {INTERNSHIP_ROUTINE[activeRoutineIndex].time} IST
                  </span>
                </div>
                <h4 className="text-2xl font-black font-heading text-[#111111]">
                  {INTERNSHIP_ROUTINE[activeRoutineIndex].title}
                </h4>
                <p className="text-sm text-[#555555] leading-relaxed">
                  {INTERNSHIP_ROUTINE[activeRoutineIndex].desc}
                </p>
              </div>

              <div className="md:col-span-4 p-5 rounded-2xl bg-[#F8FAFC] border border-black/[0.06] space-y-2">
                <span className="text-[10px] font-mono uppercase font-bold text-[#1E9E54] block tracking-wider">
                  TICKET DELIVERABLE
                </span>
                <p className="text-xs font-bold font-mono text-[#111111] leading-relaxed">
                  {INTERNSHIP_ROUTINE[activeRoutineIndex].deliverable}
                </p>
                <div className="pt-2 flex items-center gap-2 text-[11px] text-[#1E9E54] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified in Student Portal</span>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 4. SECTION: PRODUCTION TRACKS SHOWCASE (#home-featured)      */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="home-featured" className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 lg:px-12 bg-[#F8FAFC]/95 backdrop-blur-2xl border-y border-black/[0.08]">
        <div className="max-w-7xl mx-auto space-y-16">

          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-10 border-b border-black/[0.08]">
            <div className="space-y-3">
              <div className="font-mono text-xs text-[#1E9E54] uppercase tracking-[0.25em] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E9E54]" />
                <span>[03 // VERIFIED CURRICULUM TRACKS]</span>
              </div>
              <CinematicTextReveal
                text="The 2026 Engineering Tracks"
                tag="h2"
                className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#111111] tracking-[-0.04em] font-heading leading-tight"
              />
            </div>

            <p className="lg:max-w-md font-mono text-xs text-[#666666] uppercase tracking-widest leading-relaxed">
              Every course is built around live client codebases, 1-on-1 code reviews, and verifiable experience letters for your resume.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-2">
            
            {/* Sort Switcher */}
            <div className="inline-flex items-center p-1 rounded-full border border-black/10 bg-white shadow-xs shrink-0">
              {(['Featured', 'Popular', 'Recent'] as const).map((sort) => (
                <button
                  key={sort}
                  type="button"
                  onClick={() => setActiveSort(sort)}
                  className={`px-4 py-1.5 text-xs font-mono uppercase tracking-wider rounded-full transition-all cursor-pointer ${
                    activeSort === sort
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
                  className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    featuredCategory === cat
                      ? 'bg-[#1E9E54] text-white font-bold shadow-xs'
                      : 'bg-white border border-black/10 text-[#666666] hover:text-[#111111] hover:border-black/30'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 2-Column Asymmetric Track Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 items-start pt-6">
            {filteredCourses.map((course, idx) => {
              const isOffset = idx % 2 === 1;
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{ duration: 0.7, delay: idx * 0.08 }}
                  className={`group relative ${isOffset ? 'md:mt-16 lg:mt-24' : ''}`}
                >
                  <div className="rounded-[28px] border border-black/[0.08] hover:border-emerald-500/40 p-6 sm:p-8 bg-white hover:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.08)] transition-all flex flex-col justify-between">
                    
                    {/* Media Showcase */}
                    <Link
                      to={`/courses/${course.slug}`}
                      className="block relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-[#EAEFF2] border border-black/5 mb-6 group-hover:border-[#1E9E54]/30 transition-all"
                    >
                      <img
                        src={course.thumbnail || `/assets/courses/${course.slug}.svg`}
                        alt={course.title}
                        className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                        loading="lazy"
                      />

                      {/* Floating Badges */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-black/10 text-[#14723B]">
                          {course.badge}
                        </span>
                      </div>

                      <div className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-black/10 font-mono text-xs font-bold text-[#D97706]">
                        <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                        <span>{course.rating || 4.9}</span>
                      </div>

                      {/* Bottom Overlay Bar */}
                      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-xs font-mono text-white">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#43C170]" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-[#43C170]" />
                          {course.liveProjectsCount || 3} Client Projects
                        </span>
                      </div>
                    </Link>

                    {/* Metadata Header */}
                    <div className="font-mono text-xs text-[#1E9E54] uppercase tracking-wider font-bold mb-2">
                      {course.category} • {course.curriculum?.length || 4} MODULES • LIVE REPO
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl sm:text-3xl font-black text-[#111111] group-hover:text-[#1E9E54] transition-colors leading-tight font-heading mb-3">
                      <Link to={`/courses/${course.slug}`}>
                        {course.title}
                      </Link>
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#666666] line-clamp-2 mb-4 leading-relaxed font-light">
                      {course.shortDescription}
                    </p>

                    {/* Tech Stack Chips */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {(course.tools || []).slice(0, 4).map((tool, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>

                    {/* Card Footer: Pricing & CTAs */}
                    <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono uppercase text-[#888888] block">Tuition Starts At</span>
                        <span className="text-xl font-black text-[#111111] font-mono font-heading">
                          {course.startingFeeFormatted || `₹${(course.startingFee || 5999).toLocaleString('en-IN')}`}
                        </span>
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
                          className="px-4 py-2 rounded-full text-xs font-bold text-white bg-[#111111] hover:bg-[#1E9E54] transition-all flex items-center gap-1.5 shadow-xs"
                        >
                          <span>Enrol</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom All Tracks CTA */}
          <div className="pt-8 text-center">
            <Link to="/courses" className="lusion-cta-btn">
              <span className="cta-dot" />
              <span className="cta-text">Enter Interactive 3D Poster Shelf ({courses.length} Tracks)</span>
              <span className="cta-arrow">
                <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 5. SECTION: ACADEMIC & INTERNSHIP MANIFESTO                  */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section id="home-goal" className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-16">

          <div className="font-mono text-xs text-[#1E9E54] uppercase tracking-[0.25em] font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#1E9E54]" />
            <span>[04 // THE ENGINEERING MANIFESTO]</span>
          </div>

          <CinematicTextReveal
            text="Where College Knowledge Becomes Production Mastery"
            tag="h2"
            className="text-4xl sm:text-6xl lg:text-7xl font-black text-[#111111] tracking-[-0.04em] leading-[0.95] max-w-5xl font-heading"
          />

          {/* Comparison Table: Rote Classroom vs VGM Soft Tech Internship */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* Outdated Traditional Approach */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                TRADITIONAL TRAINING INSTITUTES
              </span>
              <h4 className="text-xl font-bold font-heading text-slate-700">
                Outdated Syllabi &amp; Dummy Exercises
              </h4>
              <ul className="space-y-3 text-sm text-slate-600 font-light">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Memorizing textbook theory without writing commercial software</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Toy projects (to-do lists, calculators) that fail tech interviews</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Zero code review; nobody inspects your architecture or Git commits</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold shrink-0">✕</span>
                  <span>Generic participation paper with no industry validation</span>
                </li>
              </ul>
            </div>

            {/* VGM Soft Tech Software House Approach */}
            <div className="p-8 rounded-3xl bg-white border-2 border-emerald-500/30 shadow-[0_20px_50px_-12px_rgba(30,158,84,0.12)] space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#14723B]">
                  VGM SOFT TECH INTERNSHIP
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-50 text-[#1E9E54] border border-emerald-200">
                  Active Pods
                </span>
              </div>
              <h4 className="text-xl font-bold font-heading text-[#111111]">
                Live Client Codebases &amp; Stamped Experience
              </h4>
              <ul className="space-y-3 text-sm text-[#444444] font-medium">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                  <span>Pull Requests merged directly into production VGM client repositories</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                  <span>Real LLM integrations: Gemini 1.5 streaming, vector search &amp; APIs</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                  <span>1-on-1 code reviews with Senior Architects on every single sprint</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                  <span>Official Stamped Relieving Experience Letter &amp; Verifiable Credential</span>
                </li>
              </ul>
            </div>
          </motion.div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 6. SECTION: 4-STAGE INTERNSHIP ROADMAP                       */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 lg:px-12 bg-[#F8FAFC]/95 backdrop-blur-2xl border-y border-black/[0.08]">
        <div className="max-w-7xl mx-auto space-y-12">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/[0.08]">
            <div className="space-y-2">
              <span className="font-mono text-xs text-[#1E9E54] uppercase tracking-[0.25em] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E9E54]" />
                <span>[05 // CURRICULUM ARCHITECTURE]</span>
              </span>
              <CinematicTextReveal
                text="The 4-Stage Learning-To-Placement Pipeline"
                tag="h2"
                className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight font-heading"
              />
            </div>
            <p className="text-xs sm:text-sm text-[#666666] font-mono max-w-sm uppercase">
              From foundational scaffolding to live sprint PRs, staff audits, and placement drives.
            </p>
          </div>

          {/* 4 Stacking Milestone Cards */}
          <CinematicCardStack topOffset={110} stackOffset={24}>

            {/* Stage 1 */}
            <CinematicCard index={1} badge="Weeks 1–2" className="bg-white shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-2">
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#111111]">
                    Tooling &amp; Enterprise Architecture Scaffolding
                  </h3>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    Set up professional developer workstations, Git branch hygiene, CI/CD linters, and clean layered architecture patterns. Scaffold commercial code repositories properly from day one.
                  </p>
                </div>
                <div className="md:col-span-4 bg-[#F8FAFC] p-4 rounded-2xl border border-black/[0.06] font-mono text-xs space-y-1">
                  <span className="text-[#1E9E54] font-bold block uppercase tracking-wider">MILESTONE DELIVERABLE:</span>
                  <span className="text-[#333333] font-semibold">Clean Git Scaffold &amp; Repository Setup</span>
                </div>
              </div>
            </CinematicCard>

            {/* Stage 2 */}
            <CinematicCard index={2} badge="Weeks 3–6" className="bg-white shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-2">
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#111111]">
                    Live Client Sprint Implementation
                  </h3>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    Implement real software feature tickets for active VGM client applications. Integrate streaming Gemini AI models, state management, and real-time backend databases.
                  </p>
                </div>
                <div className="md:col-span-4 bg-[#F8FAFC] p-4 rounded-2xl border border-black/[0.06] font-mono text-xs space-y-1">
                  <span className="text-[#1E9E54] font-bold block uppercase tracking-wider">MILESTONE DELIVERABLE:</span>
                  <span className="text-[#333333] font-semibold">Production Pull Requests Merged to Staging</span>
                </div>
              </div>
            </CinematicCard>

            {/* Stage 3 */}
            <CinematicCard index={3} badge="Weeks 7–9" className="bg-white shadow-md">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-2">
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#111111]">
                    Senior Staff Code Audits &amp; Optimisation
                  </h3>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    Participate in rigorous 1-on-1 code reviews with Lead Engineers. Profile CPU, eliminate memory leaks, harden SQL queries, and implement zero-defect automated testing.
                  </p>
                </div>
                <div className="md:col-span-4 bg-[#F8FAFC] p-4 rounded-2xl border border-black/[0.06] font-mono text-xs space-y-1">
                  <span className="text-[#1E9E54] font-bold block uppercase tracking-wider">MILESTONE DELIVERABLE:</span>
                  <span className="text-[#333333] font-semibold">Staff-Audited Live Deployed Application</span>
                </div>
              </div>
            </CinematicCard>

            {/* Stage 4 */}
            <CinematicCard index={4} badge="Weeks 10–12" highlight className="shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                <div className="md:col-span-8 space-y-2">
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#111111]">
                    Placement Bootcamp &amp; Direct Hiring Drives
                  </h3>
                  <p className="text-sm text-[#666666] leading-relaxed">
                    Undergo technical system design mock interviews, ATS resume optimization, and direct hiring calls with our 450+ enterprise partner network across Bangalore, Chennai, and Coimbatore.
                  </p>
                </div>
                <div className="md:col-span-4 bg-emerald-50/90 p-4 rounded-2xl border border-emerald-500/30 font-mono text-xs space-y-1">
                  <span className="text-emerald-700 font-bold block uppercase tracking-wider">FINAL OUTCOME:</span>
                  <span className="text-emerald-950 font-bold">Tech Job Offer + Stamped Experience Letter</span>
                </div>
              </div>
            </CinematicCard>

          </CinematicCardStack>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 7. SECTION: INTERACTIVE IDE & SPRINT TEST SIMULATOR          */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Context */}
          <div className="lg:col-span-5 space-y-6">
            <span className="font-mono text-xs text-[#1E9E54] uppercase tracking-[0.25em] font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1E9E54]" />
              <span>[06 // INTERACTIVE LAB WORKSTATION]</span>
            </span>

            <CinematicTextReveal
              text="Write Production Code, Not Toy Scripts"
              tag="h2"
              className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight font-heading leading-tight"
            />

            <p className="text-sm sm:text-base text-[#555555] leading-relaxed font-light">
              Explore the actual source code written inside our developer pods. Switch between Flutter AI streaming, Git agile sprint workflows, and backend API controllers — and click the live test runner to simulate a sprint validation.
            </p>

            <div className="space-y-3 font-mono text-xs text-[#444444]">
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#1E9E54]" />
                <span>Pull Request Standards &amp; Mandatory Code Reviews</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#1E9E54]" />
                <span>Google Gemini 1.5 Streaming &amp; OpenAI API Integrations</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-4 h-4 text-[#1E9E54]" />
                <span>Live PostgreSQL &amp; Supabase Cloud Database Workflows</span>
              </div>
            </div>

            <div className="pt-2 flex items-center gap-4">
              <button
                type="button"
                onClick={handleRunSprintTests}
                disabled={testState === 'running'}
                className="px-6 py-3.5 rounded-full bg-[#1E9E54] hover:bg-[#14723B] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>{testState === 'running' ? 'Running Automated Tests...' : '▶ Run Sprint Tests'}</span>
              </button>

              {testState !== 'idle' && (
                <button
                  type="button"
                  onClick={handleResetTest}
                  className="p-3 rounded-full border border-slate-300 text-slate-600 hover:text-slate-900 transition-colors"
                  title="Reset test output"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Right Interactive Developer Studio IDE */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-800 bg-[#0F172A] text-white overflow-hidden shadow-2xl">
              
              {/* Window Header */}
              <div className="flex items-center justify-between px-5 py-4 bg-slate-900/90 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/90" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/90" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/90" />
                  <span className="text-[11px] font-mono text-slate-400 pl-3 hidden sm:inline-block">
                    vgm-intern-workspace
                  </span>
                </div>

                {/* Source File Tabs */}
                <div className="flex gap-1.5 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('flutter')}
                    className={`px-3 py-1 text-xs rounded-lg font-mono transition-colors cursor-pointer ${
                      activeCodeTab === 'flutter'
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    gemini_service.dart
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('git')}
                    className={`px-3 py-1 text-xs rounded-lg font-mono transition-colors cursor-pointer ${
                      activeCodeTab === 'git'
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    pr_workflow.sh
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveCodeTab('backend')}
                    className={`px-3 py-1 text-xs rounded-lg font-mono transition-colors cursor-pointer ${
                      activeCodeTab === 'backend'
                        ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    enrollment.ts
                  </button>
                </div>
              </div>

              {/* Code Display Area */}
              <pre className="p-6 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-[340px]">
                <code>
                  {activeCodeTab === 'flutter' && flutterCode}
                  {activeCodeTab === 'git' && gitCode}
                  {activeCodeTab === 'backend' && backendCode}
                </code>
              </pre>

              {/* Terminal Test Runner Output Drawer */}
              {testLogs.length > 0 && (
                <div className="p-5 bg-black/90 border-t border-slate-800 font-mono text-xs space-y-1.5 transition-all">
                  <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800 text-[11px]">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Terminal className="w-3.5 h-3.5" />
                      <span>TERMINAL CONSOLE</span>
                    </span>
                    <span>Sprint Test Suite</span>
                  </div>
                  {testLogs.map((log, lIdx) => (
                    <p
                      key={lIdx}
                      className={`leading-tight ${
                        log.startsWith('✓')
                          ? 'text-emerald-400 font-semibold'
                          : log.startsWith('STATUS')
                          ? 'text-emerald-300 font-bold pt-1'
                          : 'text-slate-300'
                      }`}
                    >
                      {log}
                    </p>
                  ))}
                </div>
              )}

            </div>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 8. SECTION: VERIFIABLE EXPERIENCE LETTER & CERTIFICATE       */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 lg:px-12 bg-[#F8FAFC]/95 backdrop-blur-2xl border-y border-black/[0.08]">
        <div className="max-w-7xl mx-auto space-y-16">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/[0.08]">
            <div className="space-y-2">
              <span className="font-mono text-xs text-[#1E9E54] uppercase tracking-[0.25em] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E9E54]" />
                <span>[07 // VERIFIED ACADEMIC CREDENTIALS]</span>
              </span>
              <CinematicTextReveal
                text="Graduate with Verifiable Industry Proof"
                tag="h2"
                className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight font-heading"
              />
            </div>
            <p className="text-xs sm:text-sm text-[#666666] font-mono max-w-sm uppercase">
              Official VGM Soft Tech Experience Letters, ISO Stamped Certificates, and public verification links.
            </p>
          </div>

          {/* Interactive Credential Inspector */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Controls */}
            <div className="lg:col-span-5 space-y-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#111111] font-heading">
                  Real Corporate Documents That Employers Trust
                </h3>
                <p className="text-sm text-[#555555] font-light leading-relaxed">
                  Companies don't hire generic tutorial watchers. They hire verified developers with demonstrable production experience. Every student completing the Builder or Professional track receives physical and digital corporate credentials.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveDeliverableTab('letter')}
                  className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                    activeDeliverableTab === 'letter'
                      ? 'bg-white border-[#1E9E54] shadow-md ring-1 ring-[#1E9E54]/20'
                      : 'bg-white/60 border-black/[0.06] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111111]">
                      1. Official Stamped Experience Letter
                    </span>
                    <Award className="w-4 h-4 text-[#1E9E54]" />
                  </div>
                  <p className="text-xs text-[#666666] mt-1 font-light">
                    Issued on official VGM Soft Tech letterhead with CIN registration and Director of Academic Engineering seal.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDeliverableTab('certificate')}
                  className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                    activeDeliverableTab === 'certificate'
                      ? 'bg-white border-[#1E9E54] shadow-md ring-1 ring-[#1E9E54]/20'
                      : 'bg-white/60 border-black/[0.06] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111111]">
                      2. Verifiable Digital Certificate (QR Linked)
                    </span>
                    <ShieldCheck className="w-4 h-4 text-[#1E9E54]" />
                  </div>
                  <p className="text-xs text-[#666666] mt-1 font-light">
                    Instant public verification at skillhub.vgmsofttech.com/student-portal with unique enrollment ID.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDeliverableTab('github')}
                  className={`w-full p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                    activeDeliverableTab === 'github'
                      ? 'bg-white border-[#1E9E54] shadow-md ring-1 ring-[#1E9E54]/20'
                      : 'bg-white/60 border-black/[0.06] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#111111]">
                      3. Live Client Project GitHub Contributions
                    </span>
                    <GitBranch className="w-4 h-4 text-[#1E9E54]" />
                  </div>
                  <p className="text-xs text-[#666666] mt-1 font-light">
                    Merged pull requests and green commit heatmap that interviewers can inspect during technical interviews.
                  </p>
                </button>
              </div>

              <div className="pt-2">
                <Link
                  to="/student-portal"
                  className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[#1E9E54] hover:text-[#14723B]"
                >
                  <span>Test Live Credential Verification Search</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Document Visualizer */}
            <div className="lg:col-span-7">
              <motion.div
                key={activeDeliverableTab}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="p-8 rounded-3xl bg-white border border-black/[0.1] shadow-2xl relative overflow-hidden"
              >
                {/* Watermark Logo */}
                <div className="absolute right-4 bottom-4 w-48 h-48 opacity-[0.03] pointer-events-none">
                  <Shield className="w-full h-full text-black" />
                </div>

                {activeDeliverableTab === 'letter' && (
                  <div className="space-y-6 text-[#111111]">
                    <div className="flex items-center justify-between pb-4 border-b border-black/[0.08]">
                      <div>
                        <h4 className="font-heading font-black text-lg text-slate-900">
                          VGM SOFT TECH PRIVATE LIMITED
                        </h4>
                        <p className="text-[10px] font-mono text-slate-500">
                          CIN: U72900TZ2026PTC • Saibaba Colony, Coimbatore, Tamil Nadu
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-50 text-[#14723B] border border-emerald-200">
                        OFFICIAL RELIEVING LETTER
                      </span>
                    </div>

                    <div className="space-y-3 text-xs leading-relaxed text-slate-700">
                      <p className="font-mono text-[11px] text-slate-500">REF: VGM/INT/2026/SDE-0842</p>
                      <p className="font-bold text-slate-900">TO WHOMSOEVER IT MAY CONCERN</p>
                      <p>
                        This is to certify that <strong>Mathan Kumar</strong> has successfully completed an intensive 
                        <strong> Software Engineering &amp; AI Mobile App Development Internship</strong> with VGM Soft Tech from 
                        <strong> 1st September 2026 to 30th November 2026</strong>.
                      </p>
                      <p>
                        During this tenure, the candidate demonstrated exemplary diligence, working on live client modules,
                        submitting feature pull requests, and implementing streaming generative AI APIs under senior engineering supervision.
                      </p>
                    </div>

                    <div className="pt-6 border-t border-black/[0.08] flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-900">Director of Academic Engineering</p>
                        <p className="text-[10px] font-mono text-slate-500">VGM Soft Tech Academic Division</p>
                      </div>
                      <div className="w-16 h-16 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-50/50 flex flex-col items-center justify-center text-center p-1">
                        <span className="text-[9px] font-mono font-bold text-[#1E9E54]">SEAL</span>
                        <span className="text-[8px] text-slate-400">ISO 9001</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeDeliverableTab === 'certificate' && (
                  <div className="space-y-6 text-[#111111]">
                    <div className="flex items-center justify-between pb-4 border-b border-black/[0.08]">
                      <span className="text-xs font-mono font-bold uppercase text-[#1E9E54] tracking-widest">
                        ACADEMIC CREDENTIAL
                      </span>
                      <span className="font-mono text-xs text-slate-400">VGM-2026-CERT-0107</span>
                    </div>

                    <div className="text-center py-4 space-y-2">
                      <p className="text-xs font-mono uppercase text-slate-500 tracking-wider">THIS IS AWARDED TO</p>
                      <h4 className="text-3xl font-black font-heading text-slate-900">Mathan Kumar</h4>
                      <p className="text-xs text-slate-600 max-w-md mx-auto">
                        For demonstrating outstanding distinction (Grade A+) in AI-Powered Mobile App Engineering &amp; Live Client Implementation.
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs font-mono">
                      <span>Verification Link:</span>
                      <span className="text-[#1E9E54] font-bold">skillhub.vgmsofttech.com/student-portal</span>
                    </div>
                  </div>
                )}

                {activeDeliverableTab === 'github' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-mono font-bold text-slate-900">
                          vgmsofttech/production-mobile-app
                        </span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800">
                        Merged #42
                      </span>
                    </div>

                    <div className="space-y-2 text-xs font-mono text-slate-700">
                      <p className="text-slate-900 font-bold">PR Title: feat(ai): add streaming speech assistant with Gemini API</p>
                      <p className="text-slate-500">Commits: 8 commits • 14 files changed (+482, -41)</p>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                        <p className="text-[11px] text-emerald-700 font-semibold">✓ Senior Architect Code Review Approved</p>
                        <p className="text-[10px] text-slate-500">"Clean separation of services, zero memory leaks, and passes end-to-end unit tests."</p>
                      </div>
                    </div>
                  </div>
                )}

              </motion.div>
            </div>

          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 9. SECTION: 450+ HIRING PARTNERS MARQUEE                     */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative z-10 py-20 bg-[#F8FAFC]/90 backdrop-blur-xl border-b border-black/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="font-mono text-xs text-[#1E9E54] uppercase tracking-[0.25em] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E9E54]" />
                <span>[08 // DIRECT PLACEMENT RECRUITMENT]</span>
              </span>
              <CinematicTextReveal
                text="Where Our Graduates Build Their Careers"
                tag="h3"
                className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight mt-2 font-heading"
              />
            </div>
            <Link
              to="/placements"
              className="font-mono text-xs text-[#1E9E54] hover:text-[#111111] flex items-center gap-1.5 transition-colors uppercase tracking-wider font-bold"
            >
              <span>Explore Placement Cell &amp; CTC</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Gliding Infinite Tracks */}
          <div className="relative overflow-hidden py-4">
            <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F8FAFC] to-transparent z-10" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F8FAFC] to-transparent z-10" />

            {/* Track 1: Left */}
            <div className="animate-marquee flex items-center gap-4">
              {[...HIRING_PARTNERS, ...HIRING_PARTNERS].map((p, idx) => (
                <div
                  key={`track1-${idx}`}
                  className="px-6 py-4 rounded-2xl bg-white border border-black/[0.06] hover:border-[#1E9E54]/50 flex items-center gap-3 transition-all shrink-0 shadow-xs"
                >
                  <Building2 className="w-4 h-4 text-[#1E9E54]" />
                  <span className="text-xs font-bold text-[#111111]">{p.name}</span>
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
                  className="px-6 py-4 rounded-2xl bg-white border border-black/[0.06] hover:border-[#1E9E54]/50 flex items-center gap-3 transition-all shrink-0 shadow-xs"
                >
                  <Building2 className="w-4 h-4 text-[#1E9E54]" />
                  <span className="text-xs font-bold text-[#111111]">{p.name}</span>
                  <span className="text-[10px] font-mono text-[#888888] uppercase pl-2 border-l border-black/10">
                    {p.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 10. SECTION: ALUMNI SUCCESS STORIES & REVIEWS               */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative z-10 py-24 sm:py-32 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-12">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-black/[0.08]">
            <div className="space-y-2">
              <span className="font-mono text-xs text-[#1E9E54] uppercase tracking-[0.25em] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E9E54]" />
                <span>[09 // ALUMNI &amp; INTERN TESTIMONIALS]</span>
              </span>
              <CinematicTextReveal
                text="Endorsed by 1,450+ Learners Across Tamil Nadu"
                tag="h2"
                className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight font-heading"
              />
            </div>
            <Link
              to="/placements"
              className="font-mono text-xs text-[#1E9E54] hover:text-[#111111] flex items-center gap-1.5 transition-colors uppercase tracking-wider font-bold"
            >
              <span>View All Placed Interns</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ALUMNI_STORIES.slice(0, 3).map((story, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                className="p-7 sm:p-8 rounded-3xl bg-white border border-black/[0.08] hover:border-emerald-500/40 hover:shadow-xl transition-all flex flex-col justify-between"
              >
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

                <div className="pt-4 border-t border-black/[0.06] flex items-center gap-3 mt-6">
                  <div className="w-10 h-10 rounded-full bg-[#1E9E54]/10 text-[#14723B] font-bold text-xs flex items-center justify-center shrink-0 border border-[#1E9E54]/30 font-mono">
                    {story.avatarInitials}
                  </div>
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-[#111111] truncate">{story.name}</h4>
                    <p className="text-[11px] font-semibold text-[#1E9E54] truncate">{story.role} @ {story.company}</p>
                    <p className="text-[10px] text-[#777777] truncate font-mono">{story.college}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 11. SECTION: COIMBATORE CAMPUS SPOTLIGHT                     */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative z-10 py-16 px-4 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto rounded-[32px] border border-black/[0.08] bg-[#F8FAFC]/95 backdrop-blur-2xl p-8 sm:p-12 overflow-hidden shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            <div className="lg:col-span-6 space-y-6">
              <span className="font-mono text-xs text-[#1E9E54] uppercase tracking-[0.25em] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E9E54]" />
                <span>[10 // LIVE SOFTWARE LAB CAMPUS]</span>
              </span>
              <CinematicTextReveal
                text="Train Inside an Active Engineering Hub in Coimbatore"
                tag="h2"
                className="text-3xl sm:text-5xl font-black text-[#111111] tracking-tight leading-tight font-heading"
              />
              <p className="text-sm sm:text-base text-[#555555] leading-relaxed font-light">
                Experience software development the way elite product teams work. Our Saibaba Colony campus houses dedicated development pods and direct mentorship with senior staff architects at <strong className="text-[#111111]">VGM Soft Tech</strong>.
              </p>

              <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-black/[0.06] shadow-2xs">
                  <span className="text-[#111111] font-bold block">Dedicated Dev Pods</span>
                  <span className="text-[#777777] text-[10px]">Dual monitors &amp; gigabit network</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-black/[0.06] shadow-2xs">
                  <span className="text-[#111111] font-bold block">Agile Standup Rooms</span>
                  <span className="text-[#777777] text-[10px]">Weekly sprint audits &amp; demos</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-black/[0.06] shadow-2xs">
                  <span className="text-[#111111] font-bold block">Hybrid Studio</span>
                  <span className="text-[#777777] text-[10px]">Live remote session streaming</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-black/[0.06] shadow-2xs">
                  <span className="text-[#111111] font-bold block">Interview Pods</span>
                  <span className="text-[#777777] text-[10px]">1-on-1 mock technical interviews</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-4">
                <Link to="/about" className="lusion-cta-btn">
                  <span className="cta-dot" />
                  <span className="cta-text">Visit Coimbatore Campus</span>
                  <span className="cta-arrow">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
                <a
                  href="https://maps.google.com/maps?q=Saibaba+Colony+Coimbatore+Tamil+Nadu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-[#555555] hover:text-[#111111] flex items-center gap-1.5 uppercase tracking-wider font-bold"
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
      {/* 12. SECTION: ADMISSION & FELLOWSHIP MILESTONE (PRE-FOOTER)   */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section
        id="scroll-nav-section"
        className="relative z-10 py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-gradient-to-b from-white via-[#F8FAFC] to-[#F1F5F9] border-t border-black/[0.08] text-[#111111]"
      >
        <div className="max-w-7xl mx-auto">
          <div className="rounded-3xl bg-[#111111] text-white p-8 sm:p-14 relative overflow-hidden shadow-2xl">
            {/* Ambient emerald glow aura */}
            <div className="pointer-events-none absolute -top-24 -right-24 w-96 h-96 bg-[#1E9E54]/20 rounded-full blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-96 h-96 bg-[#43C170]/15 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[#43C170] text-xs font-mono font-bold uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 text-[#43C170]" />
                  <span>NEXT SPRINT COHORT: 15TH DECEMBER 2026</span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight font-heading leading-tight">
                  Ready to Build Production Software at VGM?
                </h2>
                <p className="text-sm sm:text-base text-white/70 font-light leading-relaxed">
                  Join our hands-on engineering pods in Saibaba Colony, Coimbatore. Work on live client codebases, ship verified PRs, and graduate with an ISO 9001:2015 accredited experience letter.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 shrink-0">
                <Link
                  to="/courses"
                  className="px-6 py-4 bg-[#1E9E54] hover:bg-[#14723B] text-white font-bold rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 group"
                >
                  <span>Explore All 6 Tracks</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/enrol"
                  className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold rounded-2xl text-xs sm:text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Enrol in Next Cohort</span>
                  <ArrowUpRight className="w-4 h-4 text-[#43C170]" />
                </Link>
              </div>
            </div>

            {/* Bottom credential micro-strip */}
            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-white/50">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#43C170]" />
                <span>ISO 9001:2015 Verified Academy</span>
              </div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#43C170]" />
                <span>Saibaba Colony Tech Hub, Coimbatore</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#43C170]" />
                <span>400+ Hours Practical Live Sprints</span>
              </div>
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
