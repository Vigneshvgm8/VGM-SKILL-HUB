import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import type { Enrolment } from '../../../API/db.js';
import { 
  CheckCircle2, 
  ArrowRight, 
  Download,
  Phone,
  Home,
  Clock,
  Sparkles
} from 'lucide-react';
import { CONTACT_INFO } from '../config/programData.js';
import { motion } from 'motion/react';
import { LusionMagnetic } from '../components/LusionMotionPrimitives.js';
import { getApiUrl } from '../config/api.js';

export const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const enrolmentId = searchParams.get('enrolmentId');
  const [enrolment, setEnrolment] = useState<Enrolment | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enrolmentId) {
      setError('No Enrolment ID provided.');
      setLoading(false);
      return;
    }

    fetch(getApiUrl(`/api/enrolment/${encodeURIComponent(enrolmentId)}`))
      .then(res => {
        if (!res.ok) throw new Error('Enrolment not found');
        return res.json();
      })
      .then(data => {
        setEnrolment(data.enrolment);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Error fetching enrolment record');
        setLoading(false);
      });
  }, [enrolmentId]);

  const handlePrintReceipt = () => {
    window.print();
  };

  const studentEnrolmentNum = enrolment?.enrollmentNumber || enrolment?.id || enrolmentId || 'VGM-2026-PENDING';
  const studentMobile = enrolment?.student?.mobile || '';

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center pt-36 sm:pt-40 md:pt-44 pb-16">
        <p className="text-sm text-[#555555]">Retrieving official enrolment particulars...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-24 font-body selection:bg-[#43C170]/30 selection:text-[#111111]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* On-screen Confirmation Banner (Hidden in Print) */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="no-print space-y-6 mb-8"
        >
          {/* Main User Notification Card */}
          <div className="p-6 sm:p-8 bg-gradient-to-br from-[#1E9E54]/10 via-emerald-50/60 to-white border border-[#1E9E54]/30 rounded-3xl shadow-sm space-y-4">
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1E9E54] text-white flex items-center justify-center shrink-0 shadow-md">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h1 className="text-xl sm:text-2xl font-heading font-black text-[#111111] tracking-tight leading-snug">
                  Internship Application Registered Successfully!
                </h1>
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#666666]">
                    Enrolment Number:
                  </span>
                  <span className="font-mono text-base font-black text-[#14723B] bg-[#1E9E54]/15 px-3 py-0.5 rounded-lg border border-[#1E9E54]/30">
                    {studentEnrolmentNum}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/95 rounded-2xl border border-black/5 shadow-2xs space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#14723B]">
                <Phone className="w-4 h-4 text-[#1E9E54]" />
                <span>Telephonic Onboarding &amp; Fee Collection Process</span>
              </div>
              <p className="text-xs sm:text-sm text-[#444444] leading-relaxed">
                Payment will be collected directly by our company staff. Our admissions team will call you at{' '}
                <strong className="text-[#111111] font-bold">
                  {studentMobile ? `+91 ${studentMobile}` : 'your registered contact number'}
                </strong>{' '}
                regarding your batch schedule, onboarding process, and fee payment.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-3">
              <LusionMagnetic strength={6}>
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="px-6 py-3 bg-[#1E9E54] hover:bg-[#14723B] text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(30,158,84,0.3)] flex items-center gap-2 cursor-pointer uppercase tracking-wider"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Your Details (PDF)</span>
                </button>
              </LusionMagnetic>

              <LusionMagnetic strength={5}>
                <Link
                  to={`/student-portal?enrolmentId=${encodeURIComponent(studentEnrolmentNum)}`}
                  className="px-5 py-3 bg-[#F0F2F4] hover:bg-[#E5E7EB] border border-black/10 text-[#111111] text-xs font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                  <span>Student Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </LusionMagnetic>

              <Link
                to="/"
                className="px-4 py-3 border border-black/10 text-[#555555] text-xs font-semibold rounded-xl hover:bg-[#F0F2F4] hover:text-[#111111] transition-colors flex items-center gap-1.5"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Home</span>
              </Link>
            </div>

            <span className="text-xs text-[#777777] font-mono">
              Status: <span className="text-[#D97706] font-bold">Application Pending Collection</span>
            </span>
          </div>
        </motion.div>

        {/* OFFICIAL PRINTABLE ADMISSION SUMMARY SLIP */}
        <div
          id="printable-receipt"
          className="bg-white border border-black/10 shadow-sm rounded-3xl p-6 sm:p-10 space-y-6"
        >
          {/* Header */}
          <div className="border-b border-black/10 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <img src="/assets/logo.png" alt="VGM Skill Hub" className="h-10 w-auto object-contain" />
              </div>
              <p className="text-xs text-[#666666] mt-1.5">
                Technical Training &amp; Industry Internships · Powered by VGM Soft Tech
              </p>
              <p className="text-[11px] text-[#888888]">
                {CONTACT_INFO.location}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#666666] block">
                ADMISSION REGISTRATION SLIP
              </span>
              <span className="font-mono text-xl font-black text-[#1E9E54] block mt-0.5">
                {studentEnrolmentNum}
              </span>
              <span className="text-[11px] text-[#888888] block">
                Date: {enrolment?.createdAt ? new Date(enrolment.createdAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}
              </span>
            </div>
          </div>

          {/* Two-Column Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#444444]">
            {/* Student Particulars */}
            <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-2xl border border-black/5">
              <p className="font-mono font-bold uppercase tracking-wider text-[#14723B] text-[11px]">
                STUDENT PARTICULARS
              </p>
              <p><strong className="text-[#111111]">Full Name:</strong> {enrolment?.student?.fullName || 'Enrolled Student'}</p>
              <p><strong className="text-[#111111]">Email Address:</strong> {enrolment?.student?.email || 'N/A'}</p>
              <p><strong className="text-[#111111]">Mobile Contact:</strong> +91 {studentMobile || 'N/A'}</p>
              <p><strong className="text-[#111111]">Institution / College:</strong> {enrolment?.student?.college || 'N/A'}</p>
              <p><strong className="text-[#111111]">Degree &amp; Stream:</strong> {enrolment?.student?.degreeStream || 'Engineering'}</p>
              <p><strong className="text-[#111111]">Year of Study:</strong> {enrolment?.student?.yearOfStudy || 'Undergraduate'}</p>
              <p><strong className="text-[#111111]">Campus Location:</strong> {enrolment?.student?.location || enrolment?.student?.city || 'Coimbatore'}</p>
            </div>

            {/* Course & Internship Details */}
            <div className="space-y-2 bg-[#F8FAFC] p-4 rounded-2xl border border-black/5">
              <p className="font-mono font-bold uppercase tracking-wider text-[#14723B] text-[11px]">
                PROGRAMME DETAILS
              </p>
              <p><strong className="text-[#111111]">Course Track:</strong> {enrolment?.courseTitle || 'AI-Powered Mobile App Development Internship'}</p>
              <p><strong className="text-[#111111]">Selected Plan:</strong> {enrolment?.planName || 'Builder Plan'}</p>
              <p><strong className="text-[#111111]">Assigned Batch:</strong> {enrolment?.batchLabel || 'November 2026 Batch'}</p>
              <p><strong className="text-[#111111]">Certificate Type:</strong> Stamped Project Completion Certificate</p>
              <p><strong className="text-[#111111]">Payment Method:</strong> Telephonic Collection by Company Staff</p>
              <p>
                <strong className="text-[#111111]">Payment Status:</strong>{' '}
                <span className="text-[#D97706] font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px] uppercase">
                  Pending Staff Call Collection
                </span>
              </p>
            </div>
          </div>

          {/* Pricing & Fee Summary Table */}
          <div className="border border-black/10 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0F2F4] border-b border-black/10 font-mono text-[#555555]">
                <tr>
                  <th className="py-2.5 px-4 font-bold uppercase tracking-wider">Item Description</th>
                  <th className="py-2.5 px-4 font-bold uppercase tracking-wider">Duration</th>
                  <th className="py-2.5 px-4 text-right font-bold uppercase tracking-wider">Fee Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-[#444444]">
                <tr>
                  <td className="py-3 px-4">
                    <strong className="text-[#111111]">{enrolment?.planName || 'Internship Training Track'}</strong>
                    <div className="text-[11px] text-[#777777]">
                      Live repository access, project mentorship, code review, assessment &amp; verified certification
                    </div>
                  </td>
                  <td className="py-3 px-4 text-[#555555]">
                    {enrolment?.planId === 'explorer' ? '1 Month (4 Weeks)' : enrolment?.planId === 'builder' ? '2 Months (8 Weeks)' : '3 Months (12 Weeks)'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#111111]">
                    ₹{(enrolment?.pricing?.baseAmount || 1800).toLocaleString('en-IN')}
                  </td>
                </tr>
                {enrolment?.pricing?.discountAmount ? (
                  <tr className="text-[#14723B] bg-[#1E9E54]/5">
                    <td className="py-2 px-4" colSpan={2}>
                      Applied Partner/Promotional Coupon ({enrolment.pricing.couponCode})
                    </td>
                    <td className="py-2 px-4 text-right font-mono font-bold">
                      -₹{enrolment.pricing.discountAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ) : null}
              </tbody>
              <tfoot className="bg-[#F8FAFC] border-t border-black/10">
                <tr>
                  <td className="py-3.5 px-4 text-sm font-heading font-black text-[#111111]" colSpan={2}>
                    Total Fee Payable Upon Staff Call
                  </td>
                  <td className="py-3.5 px-4 text-right text-2xl font-black text-[#1E9E54] font-mono tabular-nums">
                    ₹{(enrolment?.pricing?.finalAmount || 1800).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Company Staff Notice & Seal */}
          <div className="pt-4 border-t border-black/10 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-1.5 text-xs text-[#666666]">
              <p className="font-bold text-[#111111] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#1E9E54]" />
                <span>Next Steps for Student:</span>
              </p>
              <p>1. Our admissions coordinator will call you at <strong>+91 {studentMobile || 'your number'}</strong> to confirm your batch timings.</p>
              <p>2. Please keep this Enrolment Number <strong>{studentEnrolmentNum}</strong> handy during the call.</p>
              <p>3. Fee payment will be guided directly by our staff during the phone call.</p>
              <p>4. Email Support: <a href="mailto:intern@vgmsofttech.com" className="text-[#1E9E54] underline">intern@vgmsofttech.com</a></p>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0">
              <div className="inline-block p-3 border border-black/10 rounded-2xl text-center bg-[#F8FAFC]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#777777] block">
                  ADMISSIONS OFFICE VERIFICATION SEAL
                </span>
                <span className="font-heading font-black text-xs text-[#1E9E54] block mt-0.5">
                  VGM SOFT TECH · COIMBATORE CAMPUS
                </span>
                <span className="text-[9px] text-[#888888] font-mono block mt-0.5">
                  Official Registration Record Verified
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
