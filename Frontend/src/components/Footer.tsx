import React from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo.js';
import { Phone, Mail, MapPin, ArrowRight, ShieldCheck, Award, CheckCircle2 } from 'lucide-react';
import { CONTACT_INFO } from '../config/programData.js';
import { COURSES_CATALOG } from '../config/coursesData.js';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#F7F8FA] text-[#666666] pt-0 pb-12 border-t border-black/5">
      {/* Green accent line at very top */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#1E9E54]/40 to-transparent" />

      <div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">

          {/* Top Feature Badges Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-black/5 text-xs">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-black/5 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#1E9E54]/10 border border-[#1E9E54]/20 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#1E9E54]" />
              </div>
              <div>
                <span className="font-bold text-[#111111] block">400+ Hours Practical</span>
                <span className="text-[#777777]">Live Client Project Tasks</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-black/5 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#1E9E54]/10 border border-[#1E9E54]/20 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-[#1E9E54]" />
              </div>
              <div>
                <span className="font-bold text-[#111111] block">Experience Letter</span>
                <span className="text-[#777777]">Verifiable Online Credentials</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-black/5 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#1E9E54]/10 border border-[#1E9E54]/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-[#1E9E54]" />
              </div>
              <div>
                <span className="font-bold text-[#111111] block">VGM Soft Tech division</span>
                <span className="text-[#777777]">Saibaba Colony, Coimbatore</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-black/5 shadow-xs">
              <div className="w-9 h-9 rounded-xl bg-[#1E9E54]/10 border border-[#1E9E54]/20 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#1E9E54]" />
              </div>
              <div>
                <span className="font-bold text-[#111111] block">Direct Counseling</span>
                <span className="text-[#777777]">+91 9345615913</span>
              </div>
            </div>
          </div>

          {/* 4-Column Navigation Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 py-12 border-b border-black/5">

            {/* Col 1: Brand Lockup & Institute Info */}
            <div className="lg:col-span-2 space-y-4">
              <div>
                <Logo size="md" variant="light" />
              </div>
              <p className="text-sm text-[#666666] max-w-sm leading-relaxed">
                VGM Skill Hub is the dedicated technical training, internship, and career development division of <strong className="text-[#111111]">VGM Soft Tech</strong> in Coimbatore. We transform engineering students, degree holders, and career switchers into job-ready software developers through hands-on project sprints.
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#666666] pt-1">
                <span className="inline-flex items-center gap-1.5 text-[#1E9E54] bg-[#1E9E54]/10 px-2.5 py-1 rounded-full border border-[#1E9E54]/20 font-medium">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Razorpay Verified Merchant</span>
                </span>
                <span className="text-[#888888]">ISO &amp; NSDC Aligned</span>
              </div>
            </div>

            {/* Col 2: Course Directory */}
            <div className="space-y-3">
              <h4 className="text-[#1E9E54] uppercase tracking-widest text-[11px] font-bold">
                POPULAR COURSES
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                {COURSES_CATALOG.slice(0, 5).map((course) => (
                  <li key={course.id}>
                    <Link to={`/courses/${course.slug}`} className="text-[#666666] hover:text-[#111111] transition-colors line-clamp-1">
                      {course.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link to="/courses" className="text-[#1E9E54] hover:underline font-semibold inline-flex items-center gap-1 pt-1">
                    <span>View All {COURSES_CATALOG.length} Tracks</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Career & Services */}
            <div className="space-y-3">
              <h4 className="text-[#1E9E54] uppercase tracking-widest text-[11px] font-bold">
                CAREER &amp; PORTAL
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                <li>
                  <Link to="/placements" className="text-[#666666] hover:text-[#111111] transition-colors">
                    Placements &amp; Alumni Stories
                  </Link>
                </li>
                <li>
                  <Link to="/verify-certificate" className="text-[#666666] hover:text-[#111111] transition-colors">
                    Verify Certificate Credential
                  </Link>
                </li>
                <li>
                  <Link to="/plans" className="text-[#666666] hover:text-[#111111] transition-colors">
                    Fees &amp; Scholarship Plans
                  </Link>
                </li>
                <li>
                  <Link to="/enrol" className="text-[#666666] hover:text-[#1E9E54] transition-colors font-medium">
                    Direct Enrolment
                  </Link>
                </li>
                <li>
                  <Link to="/admin" className="text-[#888888] hover:text-[#111111] transition-colors text-xs">
                    Staff Admin Access
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Contact & Coimbatore Campus */}
            <div className="space-y-3">
              <h4 className="text-[#1E9E54] uppercase tracking-widest text-[11px] font-bold">
                COIMBATORE CAMPUS
              </h4>
              <div className="space-y-3 text-xs sm:text-sm text-[#666666]">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                  <span>{CONTACT_INFO.location}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#1E9E54] shrink-0" />
                  <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-[#111111] transition-colors">
                    {CONTACT_INFO.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#1E9E54] shrink-0" />
                  <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-[#111111] transition-colors">
                    {CONTACT_INFO.email}
                  </a>
                </div>
                <p className="text-[11px] text-[#888888] pt-1">
                  Mon - Sat: 9:00 AM – 6:30 PM IST
                </p>
              </div>
            </div>

          </div>

          {/* Bottom Bar & Policies */}
          <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#888888] gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
              <p>© 2026 VGM Skill Hub · A unit of VGM Soft Tech. All rights reserved.</p>
              <span className="hidden sm:inline text-black/10">·</span>
              <p className="text-[#666666]">Built with ♥ in Coimbatore</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <Link to="/terms" className="hover:text-[#111111] transition-colors">Terms of Service</Link>
              <span className="text-black/10">·</span>
              <Link to="/privacy" className="hover:text-[#111111] transition-colors">Privacy Policy</Link>
              <span className="text-black/10">·</span>
              <Link to="/refund" className="hover:text-[#111111] transition-colors">Refund &amp; Cancellation</Link>
              <span className="text-black/10">·</span>
              <Link to="/about" className="hover:text-[#111111] transition-colors">About Us</Link>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};
