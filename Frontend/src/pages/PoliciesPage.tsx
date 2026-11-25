import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { CONTACT_INFO } from '../config/programData.js';
import { ShieldCheck, FileText, ArrowRight } from 'lucide-react';
import { CinematicTextReveal } from '../components/CinematicTextReveal.js';
import {
  LusionCrosshairRow,
  LusionMaskLine,
  LusionRevealBlock,
  LusionMagnetic,
  LUSION_EASE,
} from '../components/LusionMotionPrimitives.js';

export const PoliciesPage: React.FC = () => {
  const location = useLocation();

  // Determine active tab
  let initialTab: 'terms' | 'privacy' | 'refund' = 'terms';
  if (location.pathname.includes('/privacy')) initialTab = 'privacy';
  if (location.pathname.includes('/refund')) initialTab = 'refund';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 sm:pt-40 md:pt-44 pb-16 md:pb-24">
      
      {/* Header */}
      <LusionRevealBlock variant="rise" className="border-b border-slate-200 pb-6 mb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#1E9E54] font-heading">
          LEGAL &amp; COMPLIANCE
        </p>
        <CinematicTextReveal
          text="Policies & Student Agreement"
          tag="h1"
          className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 mt-1"
        />
        <LusionMaskLine delay={0.1}>
          <p className="text-sm text-slate-600 mt-1">
            VGM Skill Hub (VGM Soft Tech, Coimbatore, India). Required disclosures for Razorpay payment compliance.
          </p>
        </LusionMaskLine>
        <LusionCrosshairRow count={4} className="pt-4" />
      </LusionRevealBlock>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto gap-2">
        {[
          { to: '/terms', id: 'terms', label: 'Terms and Conditions' },
          { to: '/privacy', id: 'privacy', label: 'Privacy Policy' },
          { to: '/refund', id: 'refund', label: 'Refund & Cancellation Policy' },
        ].map((tab) => {
          const active = initialTab === tab.id;
          return (
            <Link
              key={tab.id}
              to={tab.to}
              className={`relative px-4 py-2.5 text-xs font-heading font-bold uppercase tracking-wider whitespace-nowrap transition-colors ${
                active ? 'text-[#1E9E54]' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              {active && (
                <motion.span
                  layoutId="policy-tab-underline"
                  transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  className="absolute inset-x-0 bottom-0 h-0.5 bg-[#1E9E54]"
                />
              )}
            </Link>
          );
        })}
      </div>

      {/* Content for Terms */}
      <AnimatePresence mode="wait">
        <motion.div
          key={initialTab}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: LUSION_EASE }}
        >
      {initialTab === 'terms' && (
        <article className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 space-y-5 leading-relaxed">
          <h2 className="text-xl font-heading font-bold text-slate-900">
            Terms & Conditions of Enrolment
          </h2>
          <p className="text-slate-500 text-xs">Last updated: October 2026</p>

          <section className="space-y-2">
            <h3 className="font-heading font-semibold text-slate-900 text-base">1. Program Description</h3>
            <p>
              VGM Skill Hub is the training and internship division of VGM Soft Tech, located in Saibaba Colony, Coimbatore, Tamil Nadu, India. The "AI-Powered Mobile App Development Internship 2026" is a hands-on training program where students learn mobile app engineering tools and contribute to guided live project modules.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-heading font-semibold text-slate-900 text-base">2. Enrolment & Seat Confirmation</h3>
            <p>
              Seats in each batch are limited to ensure direct mentor-student interaction. A student’s seat is officially confirmed only upon successful receipt of the program fee via the official payment gateway (Razorpay). An official Enrolment ID is generated upon successful payment.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-heading font-semibold text-slate-900 text-base">3. Attendance & Certification</h3>
            <p>
              To be eligible for the Certificate of Completion or Participation, the intern must maintain a minimum of 85% attendance during scheduled live sessions and submit all assigned weekly practical tasks and project demos. Experience letters on the 3-month Professional plan are issued based on satisfactory performance and feature module completion.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-heading font-semibold text-slate-900 text-base">4. Code of Conduct & Intellectual Property</h3>
            <p>
              Interns agree to uphold academic honesty and respect proprietary company codebases and client data. Live project code remains the intellectual property of VGM Soft Tech and its clients; personal portfolio projects created by students remain their own.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-heading font-semibold text-slate-900 text-base">5. Contact Information</h3>
            <p>
              For legal and contractual inquiries, contact: <br />
              <strong>VGM Skill Hub · VGM Soft Tech</strong><br />
              Saibaba Colony, Coimbatore, Tamil Nadu, India<br />
              Email: <a href="mailto:intern@vgmsofttech.com" className="text-[#1E9E54] underline">intern@vgmsofttech.com</a> | Phone: +91 9345615913
            </p>
          </section>
        </article>
      )}

      {/* Content for Privacy */}
      {initialTab === 'privacy' && (
        <article className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 space-y-5 leading-relaxed">
          <h2 className="text-xl font-heading font-bold text-slate-900">
            Privacy Policy
          </h2>
          <p className="text-slate-500 text-xs">Last updated: October 2026</p>

          <section className="space-y-2">
            <h3 className="font-heading font-semibold text-slate-900 text-base">1. Information We Collect</h3>
            <p>
              During admission, we collect personal information necessary to deliver the internship and issue formal credentials. This includes: Full Name, Email Address, 10-digit Indian Mobile Number, Date of Birth, City, College / University, Degree & Stream, Year of Study, and prior programming familiarity.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-heading font-semibold text-slate-900 text-base">2. Payment Data Security</h3>
            <p>
              All online payments are securely processed through Razorpay (Razorpay Software Private Limited). VGM Skill Hub never collects, stores, or transmits credit/debit card numbers, CVVs, or bank netbanking passwords on its servers. Razorpay complies with PCI-DSS Level 1 standards and Indian RBI regulatory mandates.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-heading font-semibold text-slate-900 text-base">3. Use of Information</h3>
            <p>
              Your contact details are used strictly to communicate batch timings, orientation links, repo access, assessment records, and internship certificates. We never sell, rent, or lease student information to third-party telemarketers or marketing agencies.
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-heading font-semibold text-slate-900 text-base">4. Data Retention & Queries</h3>
            <p>
              Academic credential records are maintained for verification purposes. You may request verification or correction of your admission records by contacting <a href="mailto:intern@vgmsofttech.com" className="text-[#1E9E54] underline">intern@vgmsofttech.com</a>.
            </p>
          </section>
        </article>
      )}

      {/* Content for Refund */}
      {initialTab === 'refund' && (
        <article className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 space-y-5 leading-relaxed">
          <h2 className="text-xl font-heading font-bold text-slate-900">
            Refund & Cancellation Policy
          </h2>
          <p className="text-slate-500 text-xs">Mandatory Merchant Policy for Razorpay</p>

          {/* EXACT REQUIRED PLACEHOLDER TEXT */}
          <div className="p-6 bg-amber-50 border border-amber-300 rounded-xl text-amber-950 font-mono text-xs sm:text-sm my-4">
            [REFUND POLICY TO BE PROVIDED BY VGM SKILL HUB]
          </div>

          <section className="space-y-2">
            <h3 className="font-heading font-semibold text-slate-900 text-base">Policy Notice</h3>
            <p>
              The official refund and cancellation policy text is currently being finalized by VGM Skill Hub administration. In accordance with Indian consumer protection standards, students requesting batch reschedules or refund requests may contact the admissions desk at <a href="mailto:intern@vgmsofttech.com" className="text-[#1E9E54] underline">intern@vgmsofttech.com</a> or phone +91 9345615913.
            </p>
          </section>
        </article>
      )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between">
        <LusionMagnetic strength={6}>
          <Link
            to="/enrol"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1E9E54] hover:underline"
          >
            <span>Return to Enrolment Form</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </LusionMagnetic>
        <span className="text-xs text-slate-400">
          VGM Skill Hub · Coimbatore
        </span>
      </div>

    </div>
  );
};
