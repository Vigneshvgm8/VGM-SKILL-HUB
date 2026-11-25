import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CourseItem } from '../config/coursesData.js';
import { 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Tag, 
  CheckCircle2, 
  Loader2, 
  Lock,
  Sparkles,
  X,
  CreditCard
} from 'lucide-react';

interface CoursePurchaseModalProps {
  course: CourseItem;
  isOpen: boolean;
  onClose: () => void;
}

export const CoursePurchaseModal: React.FC<CoursePurchaseModalProps> = ({
  course,
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();

  // Tier selection: 'explorer' | 'builder' | 'professional'
  const [selectedTier, setSelectedTier] = useState<'explorer' | 'builder' | 'professional'>('builder');

  // Form step: 1 = choose tier, 2 = student details & pay
  const [step, setStep] = useState<1 | 2>(1);

  // Student form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [city, setCity] = useState('Coimbatore');
  const [college, setCollege] = useState('');

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Lock body scroll and pause Lenis smooth scroll while modal is active
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    const lenis = (window as any).__lenis;
    if (lenis && typeof lenis.stop === 'function') {
      try {
        lenis.stop();
      } catch {}
    }

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
      if (lenis && typeof lenis.start === 'function') {
        try {
          lenis.start();
        } catch {}
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Resolve tier prices dynamically from course data or fallback to standard
  const explorerFee = course.tierPricing?.explorer?.fee || course.plans?.explorer?.fee || course.startingFee || 5999;
  const builderFee = course.tierPricing?.builder?.fee || course.plans?.builder?.fee || 9999;
  const professionalFee = course.tierPricing?.professional?.fee || course.plans?.professional?.fee || 14999;

  const tiers = [
    {
      id: 'explorer' as const,
      name: 'Explorer',
      duration: '1 MONTH',
      durationMonths: 1,
      fee: explorerFee,
      recommended: false,
      features: [
        'App development fundamentals',
        'AI assistants for coding and learning',
        'Add an AI feature using an API',
        'Build one AI-powered mini app',
        'Shadow the team on a live project',
        'Certificate of participation'
      ]
    },
    {
      id: 'builder' as const,
      name: 'Builder',
      duration: '2 MONTHS',
      durationMonths: 2,
      fee: builderFee,
      recommended: true,
      features: [
        'Everything in Explorer',
        'Firebase backend and sign-in',
        'Speech and image AI features',
        'AI-assisted testing and debugging',
        'Own feature modules on a live project',
        'Certificate of completion'
      ]
    },
    {
      id: 'professional' as const,
      name: 'Professional',
      duration: '3 MONTHS',
      durationMonths: 3,
      fee: professionalFee,
      recommended: false,
      features: [
        'Everything in Builder',
        'App architecture and performance',
        'Secure, responsible use of AI',
        'Publish on Google Play',
        'Full ownership of a live feature',
        'Resume, portfolio, mock interviews',
        'Certificate + experience letter'
      ]
    }
  ];

  const activeTier = tiers.find(t => t.id === selectedTier) || tiers[1];
  const finalFee = Math.max(0, activeTier.fee - appliedDiscount);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError(null);

    try {
      const res = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.trim(),
          planId: selectedTier,
          fee: activeTier.fee
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedDiscount(data.discountAmount);
        setAppliedCouponCode(data.coupon.code);
        setCouponError(null);
      } else {
        setAppliedDiscount(0);
        setAppliedCouponCode(null);
        setCouponError(data.error || 'Invalid coupon code');
      }
    } catch {
      setCouponError('Network error checking coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        courseId: course.id || course.slug,
        courseTitle: course.title,
        enrolmentType: 'course',
        planId: selectedTier,
        planName: `${activeTier.name} (${activeTier.duration})`,
        batchId: 'direct-access',
        batchLabel: 'Immediate Access / 2026 Curriculum Batch',
        fee: finalFee,
        couponCode: appliedCouponCode || undefined,
        student: {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          mobile: mobile.replace(/\D/g, ''),
          dob: '',
          city: city.trim() || 'Coimbatore',
          college: college.trim() || 'Institution',
          degreeStream: 'Self-Paced Track',
          yearOfStudy: 'Direct Enrollment',
          languages: [],
          referralSource: 'Course Purchase'
        },
        assessment: {
          score: 5,
          total: 5,
          answers: {},
          completedAt: new Date().toISOString()
        }
      };

      const res = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const orderData = await res.json();
      if (!res.ok || !orderData.success) {
        throw new Error(orderData.error || 'Failed to initialize course purchase.');
      }

      const RazorpayConstructor = (window as any).Razorpay;

      // In production, reject simulated flow
      if (import.meta.env.PROD && (orderData.isSimulated || orderData.keyId === 'rzp_test_placeholder_key')) {
        throw new Error('Payment gateway is currently configuring live credentials. Please reach out to admissions at contact@vgmsofttech.com');
      }

      if (!RazorpayConstructor && import.meta.env.PROD) {
        throw new Error('Razorpay secure checkout failed to load. Please verify your connection.');
      }

      // If Razorpay SDK is present, open standard checkout
      if (RazorpayConstructor) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amountPaise,
          currency: 'INR',
          name: 'VGM Skill Hub',
          description: `${course.title} — ${activeTier.name}`,
          image: '/assets/logo.png',
          order_id: orderData.orderId,
          prefill: {
            name: fullName,
            email: email,
            contact: mobile
          },
          notes: {
            enrolmentId: orderData.enrolmentId,
            courseId: course.id,
            plan: activeTier.name,
            enrolmentType: 'course'
          },
          theme: { color: '#1E9E54' },
          handler: async (response: any) => {
            try {
              const verifyRes = await fetch('/api/verify-payment', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  enrolmentId: orderData.enrolmentId
                })
              });
              const verifyData = await verifyRes.json();
              if (verifyRes.ok && verifyData.success) {
                onClose();
                navigate(`/payment/success?enrolmentId=${orderData.enrolmentId}`);
              } else {
                onClose();
                navigate(`/payment/failed?enrolmentId=${orderData.enrolmentId}&reason=VerificationError`);
              }
            } catch {
              onClose();
              navigate(`/payment/failed?enrolmentId=${orderData.enrolmentId}&reason=NetworkError`);
            }
          },
          modal: {
            ondismiss: () => {
              setIsSubmitting(false);
            }
          }
        };

        const rzp = new RazorpayConstructor(options);
        rzp.open();
        setIsSubmitting(false);
        return;
      }

      // Development fallback if offline / test simulator
      if (!import.meta.env.PROD) {
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: orderData.orderId,
            razorpay_payment_id: `pay_sim_${Date.now()}`,
            razorpay_signature: 'test_dev_sig',
            enrolmentId: orderData.enrolmentId
          })
        });
        const vData = await verifyRes.json();
        if (vData.success) {
          onClose();
          navigate(`/payment/success?enrolmentId=${orderData.enrolmentId}`);
        } else {
          throw new Error('Simulation confirmation failed');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment processing error');
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto overscroll-contain"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        data-lenis-prevent
        className="bg-white rounded-3xl max-w-4xl w-full my-auto max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-black/10 animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* Modal Header */}
        <div className="shrink-0 px-6 py-4 bg-slate-50 border-b border-black/5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-purple-50 text-purple-700 border border-purple-200">
                Individual Course Purchase
              </span>
              <span className="text-xs text-[#666666] font-mono">
                {course.category}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-heading font-black text-[#111111] mt-0.5 line-clamp-1">
              {course.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-black/5 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div 
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          className="flex-1 p-4 sm:p-6 overflow-y-auto overscroll-contain"
        >
          {step === 1 ? (
            <div className="space-y-6">
              <div className="text-center max-w-xl mx-auto">
                <span className="text-xs font-mono font-bold text-[#1E9E54] uppercase tracking-widest">
                  Choose Your Learning Commitment
                </span>
                <h3 className="text-xl sm:text-2xl font-heading font-black text-[#111111] mt-1">
                  Select Your Course Plan
                </h3>
                <p className="text-xs text-[#666666] mt-1">
                  Each plan includes lifetime curriculum updates, hands-on capstone modules, and verified certification.
                </p>
              </div>

              {/* 3-Tier Grid exactly matching Image 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {tiers.map((t) => {
                  const isSelected = selectedTier === t.id;
                  const isRec = t.recommended;

                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTier(t.id)}
                      className={`relative rounded-2xl p-5 cursor-pointer transition-all flex flex-col justify-between ${
                        isRec
                          ? 'bg-[#1E9E54] text-white shadow-lg ring-2 ring-[#1E9E54]'
                          : 'bg-[#EBF7F0] text-[#111111] hover:bg-[#E3F4EA] border border-[#1E9E54]/20'
                      } ${isSelected ? 'scale-[1.02] ring-3 ring-black/40' : 'opacity-95 hover:opacity-100'}`}
                    >
                      {/* Recommended Pill */}
                      {isRec && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#111111] text-white text-[10px] font-mono font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                          RECOMMENDED
                        </div>
                      )}

                      <div className="space-y-4">
                        <div>
                          <span className={`text-[11px] font-mono font-bold uppercase tracking-wider block ${isRec ? 'text-white/80' : 'text-[#1E7A46]'}`}>
                            {t.duration}
                          </span>
                          <h4 className={`text-2xl font-heading font-black ${isRec ? 'text-white' : 'text-[#111111]'}`}>
                            {t.name}
                          </h4>
                          <div className="mt-2 flex items-baseline gap-1">
                            <span className={`text-3xl font-black font-mono tracking-tight ${isRec ? 'text-white' : 'text-[#111111]'}`}>
                              ₹{t.fee.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <span className={`text-[10px] block mt-0.5 ${isRec ? 'text-white/70' : 'text-[#666666]'}`}>
                            one-time fee
                          </span>
                        </div>

                        {/* Divider */}
                        <div className={`h-px w-full ${isRec ? 'bg-white/20' : 'bg-[#1E9E54]/20'}`} />

                        {/* Features bullet list from Image 3 */}
                        <ul className="space-y-2.5 text-xs">
                          {t.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2">
                              <span className={`mt-0.5 shrink-0 rounded-full p-0.5 ${isRec ? 'bg-white/20 text-white' : 'bg-[#1E9E54]/15 text-[#1E7A46]'}`}>
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                              <span className={`leading-relaxed ${isRec ? 'text-white/95' : 'text-[#333333]'}`}>
                                {feat}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-5">
                        <button
                          type="button"
                          className={`w-full py-2.5 rounded-xl font-mono text-xs font-black uppercase tracking-wider transition-all text-center flex items-center justify-center gap-1.5 ${
                            isSelected
                              ? (isRec ? 'bg-[#111111] text-white' : 'bg-[#1E9E54] text-white')
                              : (isRec ? 'bg-white text-[#1E9E54] hover:bg-white/90' : 'bg-white text-[#111111] hover:bg-black/5 border border-black/10')
                          }`}
                        >
                          <span>{isSelected ? 'SELECTED PLAN' : 'SELECT TIER'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Step 1 Actions */}
              <div className="pt-4 border-t border-black/5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-[#666666]">
                  <ShieldCheck className="w-4 h-4 text-[#1E9E54]" />
                  <span>Includes 100% money-back guarantee &amp; verified digital certificate.</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-8 py-3 rounded-xl bg-[#111111] hover:bg-[#1E9E54] text-white text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-md hover:shadow-lg"
                >
                  <span>Continue to Details</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              {/* Step 2: Student Details & Checkout */}
              <div className="flex items-center justify-between border-b border-black/5 pb-3">
                <div>
                  <span className="text-[11px] font-mono text-[#1E9E54] font-bold uppercase tracking-wider">
                    Step 2 of 2: Student Identification
                  </span>
                  <h3 className="text-lg font-heading font-black text-[#111111]">
                    {activeTier.name} Plan ({activeTier.duration}) — ₹{finalFee.toLocaleString('en-IN')}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs font-mono text-[#1E7A46] hover:underline cursor-pointer"
                >
                  ← Change Plan
                </button>
              </div>

              {/* Shared ID Notice (Requirement #3) */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-950 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                <p>
                  <strong>Unified Student ID:</strong> If you have already enrolled in any VGM internship or course, enter your registered email or phone number. We will automatically link this course under your <strong>existing Enrollment Number</strong>!
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#333333] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-black/10 rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#1E9E54]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#333333] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-black/10 rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#1E9E54]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#333333] mb-1">
                    Mobile Phone (+91) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9876543210"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-black/10 rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#1E9E54]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#333333] mb-1">
                    College / Institution
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. PSG College of Technology"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-black/10 rounded-xl text-xs text-[#111111] focus:outline-none focus:border-[#1E9E54]"
                  />
                </div>
              </div>

              {/* Coupon Row */}
              <div className="pt-2">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#333333] mb-1">
                  Have a Discount Coupon?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="ENTER COUPON CODE"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-black/10 rounded-xl text-xs font-mono uppercase"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-4 py-2 bg-slate-100 hover:bg-[#1E9E54] hover:text-white text-slate-800 text-xs font-mono font-bold uppercase rounded-xl transition-colors disabled:opacity-50"
                  >
                    {couponLoading ? 'Checking...' : 'Apply'}
                  </button>
                </div>
                {appliedCouponCode && (
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Coupon '{appliedCouponCode}' applied! You save ₹{appliedDiscount.toLocaleString('en-IN')}.
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-red-600 mt-1">{couponError}</p>
                )}
              </div>

              {/* Order Summary Box */}
              <div className="p-4 bg-slate-50 border border-black/10 rounded-2xl space-y-2">
                <div className="flex items-center justify-between text-xs text-[#666666]">
                  <span>Course Tuition ({activeTier.name} — {activeTier.duration}):</span>
                  <span className="font-mono">₹{activeTier.fee.toLocaleString('en-IN')}</span>
                </div>
                {appliedDiscount > 0 && (
                  <div className="flex items-center justify-between text-xs text-[#1E7A46]">
                    <span>Coupon Discount:</span>
                    <span className="font-mono">-₹{appliedDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-black/5 flex items-center justify-between text-sm font-bold text-[#111111]">
                  <span>Total Payable:</span>
                  <span className="text-xl font-mono text-[#1E9E54]">₹{finalFee.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                  {errorMessage}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-3 border border-black/10 text-slate-700 text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-black/5"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#111111] hover:bg-[#1E9E54] text-white text-xs font-mono font-bold uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Initiating Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pay ₹{finalFee.toLocaleString('en-IN')} &amp; Enrol</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
