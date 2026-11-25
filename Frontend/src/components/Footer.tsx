import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo.js';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  ExternalLink,
  Sparkles,
  Lock
} from 'lucide-react';
import { CONTACT_INFO } from '../config/programData.js';
import { CourseItem } from '../config/coursesData.js';

export const Footer: React.FC = () => {
  const [courses, setCourses] = useState<CourseItem[]>([]);

  useEffect(() => {
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (data.courses && Array.isArray(data.courses)) {
          setCourses(data.courses);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="relative z-20 bg-[#F8FAFC] text-[#555555] pt-0 pb-24 sm:pb-16 border-t border-black/[0.08] font-body selection:bg-[#43C170]/30 selection:text-[#111111]">
      {/* Top Emerald Ambient Gradient Line */}
      <div className="h-[2px] bg-gradient-to-r from-transparent via-[#1E9E54]/50 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14">

        {/* 1. Top Feature Badges Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 pb-12 border-b border-black/[0.08] text-xs">
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-black/[0.06] shadow-xs hover:border-[#1E9E54]/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#1E9E54]/10 border border-[#1E9E54]/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-5 h-5 text-[#1E9E54]" />
            </div>
            <div>
              <span className="font-bold text-[#111111] block text-sm">400+ Practical Hours</span>
              <span className="text-[#666666] text-xs">Live Client Project Tasks</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-black/[0.06] shadow-xs hover:border-[#1E9E54]/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#1E9E54]/10 border border-[#1E9E54]/20 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-[#1E9E54]" />
            </div>
            <div>
              <span className="font-bold text-[#111111] block text-sm">Experience Letter</span>
              <span className="text-[#666666] text-xs">Verifiable Online Credentials</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-black/[0.06] shadow-xs hover:border-[#1E9E54]/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#1E9E54]/10 border border-[#1E9E54]/20 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#1E9E54]" />
            </div>
            <div>
              <span className="font-bold text-[#111111] block text-sm">VGM Soft Tech Unit</span>
              <span className="text-[#666666] text-xs">Saibaba Colony, Coimbatore</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white border border-black/[0.06] shadow-xs hover:border-[#1E9E54]/30 transition-all">
            <div className="w-10 h-10 rounded-xl bg-[#1E9E54]/10 border border-[#1E9E54]/20 flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-[#1E9E54]" />
            </div>
            <div>
              <span className="font-bold text-[#111111] block text-sm">Admissions Helpline</span>
              <a href={`tel:${CONTACT_INFO.phone}`} className="text-[#666666] hover:text-[#1E9E54] transition-colors text-xs font-mono">
                {CONTACT_INFO.phone}
              </a>
            </div>
          </div>
        </div>

        {/* 2. 4-Column Navigation & Institute Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-black/[0.08]">

          {/* Col 1: Brand Lockup & Institute Profile (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div>
              <Logo size="md" variant="light" />
            </div>
            <p className="text-sm text-[#555555] max-w-sm leading-relaxed font-light">
              VGM Skill Hub is the dedicated software engineering training, internship fellowship, and corporate career development division of <strong className="text-[#111111] font-semibold">VGM Soft Tech</strong> in Coimbatore. We mentor engineering students, degree holders, and career transitioners into production-ready software engineers through active client codebases.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
              <span className="inline-flex items-center gap-1.5 text-[#14723B] bg-[#1E9E54]/10 px-3 py-1 rounded-full border border-[#1E9E54]/25 font-mono font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1E9E54]" />
                <span>Razorpay Verified Merchant</span>
              </span>
              <span className="text-[#777777] font-mono text-[11px]">ISO 9001:2015 Accredited</span>
            </div>
          </div>

          {/* Col 2: Curriculum Tracks (Live from API) */}
          <div className="space-y-3.5">
            <h4 className="text-[#14723B] uppercase tracking-widest text-[11px] font-mono font-bold">
              CURRICULUM TRACKS
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {courses.length > 0 ? courses.map((course) => (
                <li key={course.id}>
                  <Link 
                    to={`/courses/${course.slug}`} 
                    className="text-[#666666] hover:text-[#111111] transition-colors line-clamp-1 block"
                  >
                    {course.title}
                  </Link>
                </li>
              )) : (
                <li>
                  <Link to="/courses" className="text-[#666666] hover:text-[#111111] transition-colors">
                    View All Courses
                  </Link>
                </li>
              )}
              <li className="pt-1.5">
                <Link 
                  to="/courses" 
                  className="text-[#1E9E54] hover:text-[#14723B] font-bold inline-flex items-center gap-1 text-xs uppercase tracking-wider group"
                >
                  <span>View All {courses.length > 0 ? `${courses.length} ` : ''}Tracks</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Student Hub & Services */}
          <div className="space-y-3.5">
            <h4 className="text-[#14723B] uppercase tracking-widest text-[11px] font-mono font-bold">
              STUDENT &amp; CAREER
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/student-portal" className="text-[#111111] hover:text-[#1E9E54] transition-colors font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E54]" />
                  <span>Student Portal &amp; QR Verify</span>
                </Link>
              </li>
              <li>
                <Link to="/placements" className="text-[#666666] hover:text-[#111111] transition-colors">
                  Placements &amp; Alumni Network
                </Link>
              </li>
              <li>
                <Link to="/plans" className="text-[#666666] hover:text-[#111111] transition-colors">
                  Tuition &amp; Fellowship Plans
                </Link>
              </li>
              <li>
                <Link to="/enrol" className="text-[#666666] hover:text-[#1E9E54] transition-colors font-medium">
                  Direct Cohort Enrolment
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#666666] hover:text-[#111111] transition-colors">
                  About &amp; Campus Dev Pods
                </Link>
              </li>
              <li className="pt-1 border-t border-black/5">
                <a 
                  href="/adminweb" 
                  className="text-[#888888] hover:text-[#111111] transition-colors text-xs flex items-center gap-1 font-mono"
                >
                  <Lock className="w-3 h-3 text-[#888888]" />
                  <span>Staff Admin Console</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Campus Contact & Tech Hub */}
          <div className="space-y-3.5">
            <h4 className="text-[#14723B] uppercase tracking-widest text-[11px] font-mono font-bold">
              COIMBATORE TECH HUB
            </h4>
            <div className="space-y-3 text-xs sm:text-sm text-[#666666]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{CONTACT_INFO.location}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#1E9E54] shrink-0" />
                <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-[#111111] transition-colors font-mono">
                  {CONTACT_INFO.phone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#1E9E54] shrink-0" />
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-[#111111] transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </div>
              <div className="pt-2 text-[11px] text-[#888888] font-mono space-y-1 border-t border-black/5">
                <p>Mon - Sat: 9:00 AM – 6:30 PM IST</p>
                <p className="text-[#14723B] font-semibold">● Dev Pods &amp; Hybrid Lab Open</p>
              </div>
            </div>
          </div>

        </div>

        {/* 3. Bottom Legal, Copyright & Policy Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#777777] gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <p>© 2026 VGM Skill Hub · A unit of VGM Soft Tech. All rights reserved.</p>
            <span className="hidden sm:inline text-black/15">·</span>
            <p className="text-[#555555]">Engineered in Saibaba Colony, Coimbatore</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono">
            <Link to="/terms" className="hover:text-[#111111] transition-colors">Terms of Service</Link>
            <span className="text-black/15">·</span>
            <Link to="/privacy" className="hover:text-[#111111] transition-colors">Privacy Policy</Link>
            <span className="text-black/15">·</span>
            <Link to="/refund" className="hover:text-[#111111] transition-colors">Refund &amp; Cancellation</Link>
            <span className="text-black/15">·</span>
            <Link to="/about" className="hover:text-[#111111] transition-colors">About Us</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
