import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import type { Enrolment } from '../../../API/db.js';
import { 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  Calendar, 
  Mail, 
  Phone, 
  MapPin, 
  Download,
  ShieldCheck,
  Home
} from 'lucide-react';
import { CONTACT_INFO } from '../config/programData.js';
import { motion } from 'motion/react';
import { CinematicTextReveal } from '../components/CinematicTextReveal.js';
import { LusionCrosshairRow, LusionMaskLine, LusionMagnetic, LUSION_EASE } from '../components/LusionMotionPrimitives.js';

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

    fetch(`/api/enrolment/${enrolmentId}`)
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center pt-36 sm:pt-40 md:pt-44 pb-16">
        <p className="text-sm text-[#555555]">Retrieving official enrolment record...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF] pt-28 sm:pt-32 md:pt-36 pb-16 md:pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">

        {/* On-screen Confirmation Banner (Hidden in Print) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="no-print space-y-6 mb-8"
        >
          <div className="p-6 bg-[#1E9E54]/10 border border-[#1E9E54]/20 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <motion.div
              initial={{ scale: 0.4, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 18 }}
              className="w-14 h-14 rounded-full bg-[#1E9E54]/20 border border-[#1E9E54]/40 flex items-center justify-center text-[#1E9E54] shrink-0 shadow-[0_0_20px_rgba(30,158,84,0.3)]"
            >
              <CheckCircle2 className="w-7 h-7" />
            </motion.div>
            <div className="space-y-1 text-center sm:text-left">
              <CinematicTextReveal
                text="Payment Received & Enrolment Confirmed!"
                tag="h1"
                className="text-2xl font-heading font-bold text-[#111111]"
              />
              <LusionMaskLine delay={0.1}>
                <p className="text-sm text-[#555555] leading-relaxed">
                  Your admission to the <strong className="text-[#111111]">AI-Powered Mobile App Development Internship 2026</strong> is secured. An official confirmation email with your onboarding details has been sent to <strong className="text-[#1E9E54]">{enrolment?.student?.email || 'your email'}</strong>.
                </p>
              </LusionMaskLine>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <LusionMagnetic strength={7}>
                <Link
                  to={`/student-portal?enrolmentId=${enrolment?.enrollmentNumber || enrolment?.id || enrolmentId}`}
                  className="px-5 py-2.5 bg-[#1E9E54] hover:bg-[#14723B] text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(30,158,84,0.3)] flex items-center gap-2"
                >
                  <span>Student Portal &amp; Certificates</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </LusionMagnetic>
              <LusionMagnetic strength={6}>
                <button
                  type="button"
                  onClick={handlePrintReceipt}
                  className="px-5 py-2.5 bg-[#F0F2F4] hover:bg-[#E5E7EB] border border-black/10 text-[#111111] text-xs font-semibold rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt (PDF)</span>
                </button>
              </LusionMagnetic>
              <LusionMagnetic strength={5}>
                <Link
                  to="/"
                  className="px-4 py-2.5 border border-black/10 text-[#555555] text-xs font-semibold rounded-xl hover:bg-[#F0F2F4] hover:text-[#111111] transition-colors flex items-center gap-1.5"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Home</span>
                </Link>
              </LusionMagnetic>
            </div>

            <span className="text-xs text-[#777777]">
              Enrollment Number: <strong className="font-mono text-[#1E9E54] text-sm">{enrolment?.enrollmentNumber || enrolment?.id || enrolmentId}</strong>
            </span>
          </div>
        </motion.div>

        {/* OFFICIAL PRINTABLE RECEIPT CONTAINER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          id="printable-receipt"
          className="bg-white border border-black/10 shadow-sm rounded-2xl p-6 sm:p-10 space-y-6"
        >
          {/* Receipt Header */}
          <div className="border-b border-black/10 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-2xl text-[#1E9E54] tracking-wider">
                  VGM
                </span>
                <span className="font-heading font-bold text-2xl text-[#111111] tracking-wider">
                  SKILL HUB
                </span>
              </div>
              <p className="text-xs text-[#999999] mt-0.5">
                Training &amp; Internship Division · VGM Soft Tech
              </p>
              <p className="text-[11px] text-[#BBBBBB]">
                {CONTACT_INFO.location}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#999999] block">
                OFFICIAL PAYMENT RECEIPT
              </span>
              <span className="font-mono text-lg font-bold text-[#111111] block">
                {enrolment?.id || enrolmentId}
              </span>
              <span className="text-xs text-[#999999] block">
                Date: {enrolment?.payment?.paidAt ? new Date(enrolment.payment.paidAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN')}
              </span>
            </div>
          </div>

          {/* Two-Column Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#555555]">
            <div className="space-y-1.5">
              <p className="font-heading font-bold uppercase tracking-wider text-[#999999] text-[10px]">
                STUDENT DETAILS
              </p>
              <p><strong className="text-[#111111]">Name:</strong> {enrolment?.student?.fullName}</p>
              <p><strong className="text-[#111111]">Email:</strong> {enrolment?.student?.email}</p>
              <p><strong className="text-[#111111]">Mobile:</strong> +91 {enrolment?.student?.mobile}</p>
              <p><strong className="text-[#111111]">Institution:</strong> {enrolment?.student?.college}</p>
              <p><strong className="text-[#111111]">Degree &amp; Stream:</strong> {enrolment?.student?.degreeStream}</p>
              <p><strong className="text-[#111111]">Location:</strong> {enrolment?.student?.city}</p>
            </div>

            <div className="space-y-1.5">
              <p className="font-heading font-bold uppercase tracking-wider text-[#999999] text-[10px]">
                INTERNSHIP PROGRAMME
              </p>
              <p><strong className="text-[#111111]">Course:</strong> AI-Powered Mobile App Dev Internship 2026</p>
              <p><strong className="text-[#111111]">Plan:</strong> {enrolment?.planName}</p>
              <p><strong className="text-[#111111]">Batch:</strong> {enrolment?.batchLabel}</p>
              <p><strong className="text-[#111111]">Razorpay Order ID:</strong> {enrolment?.payment?.orderId || 'N/A'}</p>
              <p><strong className="text-[#111111]">Razorpay Payment ID:</strong> {enrolment?.payment?.paymentId || 'N/A'}</p>
              <p><strong className="text-[#111111]">Payment Status:</strong> <span className="text-[#1E9E54] font-bold uppercase">PAID &amp; VERIFIED</span></p>
            </div>
          </div>

          {/* Financial Line Item Table */}
          <div className="border border-black/10 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F0F2F4] border-b border-black/10 font-heading text-[#999999]">
                <tr>
                  <th className="py-2.5 px-3 text-[#555555]">Description</th>
                  <th className="py-2.5 px-3 text-[#555555]">Duration</th>
                  <th className="py-2.5 px-3 text-right text-[#555555]">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-[#555555]">
                <tr>
                  <td className="py-3 px-3">
                    <strong className="text-[#111111]">{enrolment?.planName}</strong>
                    <div className="text-[11px] text-[#999999]">
                      Live project training, mentorship, assessment &amp; certification
                    </div>
                  </td>
                  <td className="py-3 px-3 text-[#555555]">{enrolment?.planId === 'explorer' ? '1 Month' : enrolment?.planId === 'builder' ? '2 Months' : '3 Months'}</td>
                  <td className="py-3 px-3 text-right font-mono tabular-nums text-[#111111]">
                    ₹{enrolment?.pricing?.baseAmount?.toLocaleString('en-IN')}
                  </td>
                </tr>
                {enrolment?.pricing?.discountAmount ? (
                  <tr className="text-[#1E9E54] bg-[#1E9E54]/5">
                    <td className="py-2 px-3" colSpan={2}>
                      Applied Discount / Coupon ({enrolment.pricing.couponCode || 'Promo'})
                    </td>
                    <td className="py-2 px-3 text-right font-mono tabular-nums">
                      -₹{enrolment.pricing.discountAmount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ) : null}
              </tbody>
              <tfoot className="bg-[#F0F2F4] border-t border-black/10 font-bold">
                <tr>
                  <td className="py-3 px-3 text-sm font-heading text-[#111111]" colSpan={2}>Total Amount Paid</td>
                  <td className="py-3 px-3 text-right text-3xl font-black text-[#1E9E54] font-mono tabular-nums">
                    ₹{enrolment?.pricing?.finalAmount?.toLocaleString('en-IN')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Seal & Next Steps */}
          <div className="pt-4 border-t border-black/10 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div className="space-y-1 text-xs text-[#999999]">
              <p className="font-semibold text-[#555555]">Next Steps &amp; Orientation:</p>
              <p>1. Orientation date, schedule, and repository links will be shared via email.</p>
              <p>2. Keep this receipt ID <strong className="text-[#111111]">{enrolment?.id}</strong> for future communications.</p>
              <p>3. Support desk: <a href="mailto:intern@vgmsofttech.com" className="text-[#1E9E54] underline">intern@vgmsofttech.com</a></p>
            </div>

            <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0">
              <div className="inline-block p-2 border border-black/10 rounded-xl text-center bg-[#F0F2F4]">
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-[#999999] block">
                  AUTHORIZED ENROLMENT SEAL
                </span>
                <span className="font-heading font-bold text-xs text-[#1E9E54] block">
                  VGM SOFT TECH · COIMBATORE
                </span>
                <span className="text-[9px] text-[#AAAAAA] font-mono">
                  Digitally Signed &amp; Validated
                </span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
