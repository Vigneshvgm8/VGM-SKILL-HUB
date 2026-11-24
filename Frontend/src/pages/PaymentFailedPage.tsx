import React from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { AlertTriangle, RefreshCw, MessageSquare, ArrowLeft, ShieldAlert } from 'lucide-react';
import { CONTACT_INFO } from '../config/programData.js';

export const PaymentFailedPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const enrolmentId = searchParams.get('enrolmentId');
  const reason = searchParams.get('reason') || 'Transaction was cancelled or declined by your bank/UPI app.';

  return (
    <div className="min-h-screen bg-[#FFFFFF] flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-xl w-full text-center space-y-6"
      >
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mx-auto animate-pulse">
            <AlertTriangle className="w-10 h-10" />
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-red-400 font-heading">
            TRANSACTION NOT COMPLETED
          </p>
          <h1 className="text-3xl font-heading font-bold text-[#111111]">
            Payment Was Not Completed
          </h1>
          <p className="text-sm text-[#555555] max-w-md mx-auto leading-relaxed">
            Your admission record has been preserved. If any amount was deducted from your account, Razorpay will automatically reverse it within 24 to 48 hours.
          </p>
        </div>

        {reason && (
          <div className="p-3 bg-[#F0F2F4] border border-black/10 rounded-xl text-xs text-[#555555] max-w-sm mx-auto font-mono">
            Reason: {reason}
          </div>
        )}

        {enrolmentId && (
          <p className="text-xs text-[#999999]">
            Pending Enrolment Reference: <strong className="font-mono text-[#555555]">{enrolmentId}</strong>
          </p>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <Link
            to={`/enrol`}
            className="w-full sm:w-auto px-6 py-3 bg-[#1E9E54] hover:bg-[#14723B] text-black text-sm font-bold rounded-xl shadow-[0_0_20px_rgba(30,158,84,0.3)] hover:shadow-[0_0_30px_rgba(30,158,84,0.5)] transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again / Complete Payment</span>
          </Link>
          <a
            href={CONTACT_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3 border border-black/10 hover:border-[#1E9E54]/30 hover:bg-[#F0F2F4] text-[#555555] hover:text-[#111111] text-sm font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <MessageSquare className="w-4 h-4 text-[#25D366]" />
            <span>Contact Admissions Helpdesk</span>
          </a>
        </div>

        <div className="pt-6 border-t border-black/10 text-xs text-[#999999]">
          You can also reach out directly to <strong className="text-[#555555]">{CONTACT_INFO.phone}</strong> or email <strong className="text-[#555555]">{CONTACT_INFO.email}</strong>.
        </div>
      </motion.div>
    </div>
  );
};
