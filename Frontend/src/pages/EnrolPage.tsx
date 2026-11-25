import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PROGRAM_PLANS, BATCH_OPTIONS, PlanInfo } from '../config/programData.js';
import { CourseItem, COURSES_CATALOG } from '../config/coursesData.js';
import { getApiUrl } from '../config/api.js';
import { CinematicTextReveal } from '../components/CinematicTextReveal.js';
import { LusionCrosshairRow, LusionMaskLine, LusionMagnetic } from '../components/LusionMotionPrimitives.js';
import { 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck, 
  AlertCircle, 
  Tag, 
  CheckCircle2, 
  Loader2, 
  Lock,
  CreditCard,
  Sparkles,
  Zap,
  BookOpen
} from 'lucide-react';

interface StudentFormData {
  fullName: string;
  email: string;
  mobile: string;
  dob: string;
  city: string;
  college: string;
  degreeStream: string;
  yearOfStudy: string;
  languages: string[];
  referralSource: string;
}

const PROGRAMMING_LANGUAGES = [
  'Python',
  'Java',
  'C / C++',
  'JavaScript / TypeScript',
  'Dart (Flutter)',
  'Kotlin',
  'Swift',
  'HTML / CSS',
  'Other'
];

const REFERRAL_SOURCES = [
  'College Notice / Placement Cell',
  'Friend / Senior / Alumni',
  'Instagram / Social Media',
  'LinkedIn',
  'Google Search',
  'VGM Soft Tech Website',
  'Other'
];

const YEARS_OF_STUDY = [
  '1st Year Undergraduate',
  '2nd Year Undergraduate',
  '3rd Year Undergraduate',
  'Final Year Undergraduate (4th Year)',
  'Postgraduate Student',
  'Fresh Graduate (2025 / 2026)',
  'Working Professional'
];

export const EnrolPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Multi-step progress: 1: Plan, 2: Student Details, 3: Review & Pay
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Dynamic Course Selection
  const initialCourseSlug = searchParams.get('course') || 'ai-mobile-app';
  const [coursesList, setCoursesList] = useState<CourseItem[]>(() => COURSES_CATALOG);
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>(initialCourseSlug);
  const [livePlans, setLivePlans] = useState<Record<string, PlanInfo>>(PROGRAM_PLANS);

  // Enrolment capacity state
  const [courseFull, setCourseFull] = useState<boolean>(false);
  const [enrolmentStatus, setEnrolmentStatus] = useState<{ limit: number; enrolled: number; spotsLeft: number } | null>(null);

  useEffect(() => {
    fetch(getApiUrl('/api/courses'))
      .then(res => res.json())
      .then(data => {
        if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
          setCoursesList(data.courses);
        }
      })
      .catch(() => {});

    fetch(getApiUrl('/api/plans'))
      .then(res => res.json())
      .then(data => {
        if (data.success && data.plans) {
          setLivePlans(data.plans);
        }
      })
      .catch(() => {});
  }, []);

  // Check enrolment capacity whenever the selected course changes
  useEffect(() => {
    if (!selectedCourseSlug) return;
    fetch(getApiUrl(`/api/enrolment-status/${encodeURIComponent(selectedCourseSlug)}`))
      .then(res => res.json())
      .then(data => {
        setCourseFull(data.isFull === true);
        setEnrolmentStatus({ limit: data.limit, enrolled: data.enrolled, spotsLeft: data.spotsLeft });
      })
      .catch(() => {
        setCourseFull(false);
        setEnrolmentStatus(null);
      });
  }, [selectedCourseSlug]);

  const selectedCourse: CourseItem | null = coursesList.find(c => c.slug === selectedCourseSlug) || coursesList[0] || null;

  // Course-specific plans
  const coursePlans = (!selectedCourse || selectedCourse.id === 'ai-mobile-app' || selectedCourse.slug === 'ai-mobile-app')
    ? livePlans
    : (selectedCourse.plans || livePlans);
  const planKeys = Object.keys(coursePlans);

  // Step 1: Plan selection & Coupon
  const initialPlan = searchParams.get('plan') || planKeys[1] || planKeys[0] || 'builder';
  const [selectedPlanId, setSelectedPlanId] = useState<string>(initialPlan);
  const [selectedBatchId, setSelectedBatchId] = useState<string>(BATCH_OPTIONS[0].id);

  // Auto-align selected plan if course changes
  useEffect(() => {
    if (!coursePlans[selectedPlanId]) {
      const fallbackKey = planKeys[1] || planKeys[0];
      if (fallbackKey) setSelectedPlanId(fallbackKey);
    }
  }, [selectedCourseSlug]);
  
  // Coupon state
  const [couponInput, setCouponInput] = useState<string>('');
  const [couponValidating, setCouponValidating] = useState<boolean>(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discountType: 'percentage' | 'flat';
    discountValue: number;
    discountAmount: number;
    description: string;
  } | null>(null);

  // Step 2: Student Details
  const [studentData, setStudentData] = useState<StudentFormData>({
    fullName: '',
    email: '',
    mobile: '',
    dob: '',
    city: 'Coimbatore',
    college: '',
    degreeStream: '',
    yearOfStudy: YEARS_OF_STUDY[2],
    languages: ['Python'],
    referralSource: REFERRAL_SOURCES[0]
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Step 3: Legal & Payment
  const [agreedTerms, setAgreedTerms] = useState<boolean>(false);
  const [agreedPrivacy, setAgreedPrivacy] = useState<boolean>(false);
  const [agreedRefund, setAgreedRefund] = useState<boolean>(false);
  const [legalError, setLegalError] = useState<string | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Fallback simulator modal for test keys or sandbox
  const [simulatedOrderModal, setSimulatedOrderModal] = useState<{
    orderId: string;
    enrolmentId: string;
    amount: number;
    studentName: string;
    keyId: string;
  } | null>(null);

  const selectedPlan: PlanInfo = coursePlans[selectedPlanId] || Object.values(coursePlans)[0] || PROGRAM_PLANS.builder;
  const selectedBatch = BATCH_OPTIONS.find(b => b.id === selectedBatchId) || BATCH_OPTIONS[0];

  // Calculate pricing
  const basePrice = selectedPlan.fee;
  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalPrice = Math.max(0, basePrice - discountAmount);

  // Re-validate coupon when plan changes
  useEffect(() => {
    if (appliedCoupon) {
      validateCoupon(appliedCoupon.code);
    }
  }, [selectedPlanId, selectedCourseSlug]);

  // Server coupon validation
  const validateCoupon = async (codeToTest?: string) => {
    const code = (codeToTest || couponInput).trim();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    setCouponValidating(true);
    setCouponError(null);

    try {
      const res = await fetch(getApiUrl('/api/validate-coupon'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, planId: selectedPlanId, fee: selectedPlan.fee })
      });
      const data = await res.json();

      if (res.ok && data.valid) {
        setAppliedCoupon(data);
        setCouponInput(data.code);
        setCouponError(null);
      } else {
        setAppliedCoupon(null);
        setCouponError(data.message || 'Invalid coupon code');
      }
    } catch (e) {
      setCouponError('Unable to validate coupon at this time.');
    } finally {
      setCouponValidating(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponError(null);
  };

  // Step 2 Validation
  const validateStudentDetails = (): boolean => {
    const errors: Record<string, string> = {};

    if (!studentData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!studentData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(studentData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    const cleanMobile = studentData.mobile.replace(/\D/g, '');
    if (!cleanMobile) {
      errors.mobile = 'Mobile number is required';
    } else if (cleanMobile.length !== 10) {
      errors.mobile = 'Please enter a valid 10-digit Indian mobile number';
    } else if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      errors.mobile = 'Mobile number must start with 6, 7, 8, or 9';
    }

    if (!studentData.city.trim()) {
      errors.city = 'City is required';
    }

    if (!studentData.college.trim()) {
      errors.college = 'College or university name is required';
    }

    if (!studentData.degreeStream.trim()) {
      errors.degreeStream = 'Degree and stream are required (e.g. B.E CSE)';
    }

    if (studentData.languages.length === 0) {
      errors.languages = 'Select at least one programming language you are familiar with';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const toggleLanguage = (lang: string) => {
    setStudentData(prev => {
      const exists = prev.languages.includes(lang);
      if (exists) {
        return { ...prev, languages: prev.languages.filter(l => l !== lang) };
      } else {
        return { ...prev, languages: [...prev.languages, lang] };
      }
    });
  };

  // Pay with Razorpay
  const handleRazorpayPayment = async () => {
    if (!agreedTerms || !agreedPrivacy || !agreedRefund) {
      setLegalError('You must agree to the Terms, Privacy Policy, and Refund Policy to proceed.');
      return;
    }
    setLegalError(null);
    setPaymentError(null);
    setIsProcessingPayment(true);

    try {
      // 1. Create order on backend (No assessment before payment)
      const orderPayload = {
        courseId: selectedCourse?.id || selectedCourseSlug,
        courseTitle: selectedCourse?.title || 'Engineering Internship Track',
        planId: selectedPlanId,
        planName: selectedPlan.name,
        fee: selectedPlan.fee,
        batchId: selectedBatchId,
        batchLabel: selectedBatch.label,
        student: studentData,
        assessment: {
          score: 0,
          total: 0,
          answers: {},
          completedAt: ''
        },
        couponCode: appliedCoupon ? appliedCoupon.code : undefined
      };

      const res = await fetch(getApiUrl('/api/create-order'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const detailedMsg = Array.isArray(errData.details) && errData.details.length > 0
          ? errData.details.map((d: any) => `${d.field ? d.field + ': ' : ''}${d.message}`).join(' | ')
          : (errData.error || 'Failed to initiate payment order. Please check your form details.');
        throw new Error(detailedMsg);
      }

      const orderData = await res.json();
      const RazorpayConstructor = (window as any).Razorpay;

      // In production mode, disallow test simulator modal
      if (import.meta.env.PROD && (orderData.isSimulated || orderData.keyId === 'rzp_test_placeholder_key')) {
        throw new Error('Payment gateway is currently connecting to live Razorpay. Please contact admissions at contact@vgmsofttech.com or retry shortly.');
      }

      if (!RazorpayConstructor && import.meta.env.PROD) {
        throw new Error('Razorpay secure checkout failed to load. Please disable ad-blockers or check your internet connection.');
      }

      if (!RazorpayConstructor || orderData.isSimulated || orderData.keyId === 'rzp_test_placeholder_key') {
        // Show seamless test payment simulator modal in local development
        setSimulatedOrderModal({
          orderId: orderData.orderId,
          enrolmentId: orderData.enrolmentId,
          amount: orderData.amount,
          studentName: studentData.fullName,
          keyId: orderData.keyId
        });
        setIsProcessingPayment(false);
        return;
      }

      // Configure official Razorpay Checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amountPaise,
        currency: 'INR',
        name: 'VGM Skill Hub',
        description: `${orderData.planName} - 2026`,
        image: '/assets/logo.png',
        order_id: orderData.orderId,
        prefill: {
          name: studentData.fullName,
          email: studentData.email,
          contact: studentData.mobile
        },
        notes: {
          enrolmentId: orderData.enrolmentId,
          plan: orderData.planName
        },
        theme: {
          color: '#43C170'
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(getApiUrl('/api/verify-payment'), {
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
            if (verifyData.success) {
              navigate(`/payment/success?enrolmentId=${orderData.enrolmentId}`);
            } else {
              navigate(`/payment/failed?enrolmentId=${orderData.enrolmentId}&reason=${encodeURIComponent(verifyData.error || 'Signature check failed')}`);
            }
          } catch (e: any) {
            navigate(`/payment/failed?enrolmentId=${orderData.enrolmentId}&reason=VerificationNetworkError`);
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessingPayment(false);
            navigate(`/payment/failed?enrolmentId=${orderData.enrolmentId}&reason=UserDismissed`);
          }
        }
      };

      const rzpInstance = new RazorpayConstructor(options);
      rzpInstance.on('payment.failed', function (failResp: any) {
        setIsProcessingPayment(false);
        navigate(`/payment/failed?enrolmentId=${orderData.enrolmentId}&reason=${encodeURIComponent(failResp.error.description || 'Payment failed')}`);
      });
      rzpInstance.open();
    } catch (err: any) {
      console.error('Payment checkout error:', err);
      setPaymentError(err.message || 'Error communicating with payment gateway.');
      setIsProcessingPayment(false);
    }
  };

  const completeSimulatedPayment = async (status: 'success' | 'fail') => {
    if (!simulatedOrderModal) return;

    if (status === 'fail') {
      const eid = simulatedOrderModal.enrolmentId;
      setSimulatedOrderModal(null);
      navigate(`/payment/failed?enrolmentId=${eid}&reason=TestSimulationDeclined`);
      return;
    }

    try {
      setIsProcessingPayment(true);
      const fakePaymentId = `pay_sim_${Date.now()}`;
      const fakeSignature = `sig_sim_${Math.random().toString(36).substring(2, 10)}`;

      const verifyRes = await fetch(getApiUrl('/api/verify-payment'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: simulatedOrderModal.orderId,
          razorpay_payment_id: fakePaymentId,
          razorpay_signature: fakeSignature,
          enrolmentId: simulatedOrderModal.enrolmentId
        })
      });

      const verifyData = await verifyRes.json();
      setSimulatedOrderModal(null);

      if (verifyData.success) {
        navigate(`/payment/success?enrolmentId=${simulatedOrderModal.enrolmentId}`);
      } else {
        navigate(`/payment/failed?enrolmentId=${simulatedOrderModal.enrolmentId}&reason=VerificationError`);
      }
    } catch (e) {
      setSimulatedOrderModal(null);
      navigate(`/payment/failed?enrolmentId=${simulatedOrderModal.enrolmentId}&reason=NetworkError`);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 sm:pt-40 md:pt-44 pb-16 md:pb-24 text-[#111111]">
      
      {/* Title */}
      <div className="mb-8 text-center sm:text-left">
        <p className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E9E54]">
          FAST-TRACK ADMISSION · 2026 BATCH
        </p>
        <CinematicTextReveal
          text="Internship Enrolment & Fee Payment"
          tag="h1"
          className="text-3xl sm:text-4xl font-heading font-black text-[#111111] mt-1 tracking-tight"
        />
        <LusionMaskLine delay={0.1}>
          <p className="text-sm text-[#555555] mt-1 font-light">
            Direct 3-step registration. Secure your seat in the 2026 cohort with instant online payment.
          </p>
        </LusionMaskLine>
        <LusionCrosshairRow count={4} className="pt-4" />
      </div>

      {/* Clean 3-Step Progress Bar */}
      <div className="mb-10">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-[#888888] mb-2 tracking-wider">
          <span className={currentStep >= 1 ? 'text-[#1E9E54]' : ''}>1. CHOOSE PLAN &amp; BATCH</span>
          <span className={currentStep >= 2 ? 'text-[#1E9E54]' : ''}>2. STUDENT DETAILS</span>
          <span className={currentStep >= 3 ? 'text-[#1E9E54]' : ''}>3. REVIEW &amp; PAY</span>
        </div>
        <div className="w-full bg-[#F0F2F4] border border-black/10 h-2 rounded-full overflow-hidden">
          <motion.div
            className="bg-[#1E9E54] h-full rounded-full shadow-[0_0_12px_rgba(30,158,84,0.6)]"
            initial={false}
            animate={{ width: `${(currentStep / 3) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* STEP 1: CHOOSE PLAN & BATCH */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-8 bg-white border border-black/10 rounded-3xl p-6 sm:p-10 shadow-sm shadow-2xl"
          >
            {/* Course Selector Dropdown */}
            <div className="space-y-2 pb-6 border-b border-black/10">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555]">
                Choose Program / Course Track *
              </label>
              <select
                value={selectedCourseSlug}
                onChange={(e) => setSelectedCourseSlug(e.target.value)}
                className="w-full px-4 py-3 bg-[#F0F2F4] border border-black/10 rounded-xl text-sm font-semibold text-[#111111] focus:outline-none focus:border-[#1E9E54]"
              >
                {coursesList.map((c) => (
                  <option key={c.slug} value={c.slug} className="bg-white text-[#111111]">
                    {c.title} — {c.duration} ({c.startingFeeFormatted || `₹${c.startingFee?.toLocaleString('en-IN') || '4,999'}`})
                  </option>
                ))}
              </select>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#555555] pt-1 gap-1">
                <span>{selectedCourse?.headline || 'Loading track curriculum...'}</span>
                <Link to={`/courses/${selectedCourse?.slug || selectedCourseSlug}`} className="text-[#1E9E54] font-semibold hover:underline shrink-0">
                  View Full Syllabus &rarr;
                </Link>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-heading font-black text-[#111111]">
                Select Your Plan Duration
              </h2>
              <p className="text-xs text-[#555555] mt-0.5">
                Choose the track tier that fits your learning schedule and career commitment.
              </p>
            </div>

            {/* Selectable Plan Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.values(coursePlans).map((p) => {
                const isSelected = selectedPlanId === p.id;
                return (
                  <motion.div
                    key={p.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedPlanId(p.id)}
                    className={`p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                      isSelected
                        ? 'border-[#1E9E54] bg-[#1E9E54]/10 ring-2 ring-[#1E9E54]/30 shadow-[0_0_20px_rgba(30,158,84,0.2)]'
                        : 'border-black/10 hover:border-[#1E9E54]/40 bg-[#F7F8FA]'
                    }`}
                  >
                    {p.recommended && (
                      <span className="absolute -top-2.5 right-4 bg-[#1E9E54] text-white text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-sm">
                        RECOMMENDED
                      </span>
                    )}
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-[#555555] uppercase">
                          {p.duration}
                        </span>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSelected ? 'border-[#1E9E54] bg-[#1E9E54]' : 'border-black/20'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-black stroke-[3]" />}
                        </div>
                      </div>
                      <h3 className="font-heading text-xl font-black text-[#111111] mt-2">
                        {p.name}
                      </h3>
                      <p className="font-heading text-2xl font-black text-[#1E9E54] mt-1 tabular-nums">
                        {p.feeFormatted}
                      </p>
                      <p className="text-xs text-[#555555] mt-2 line-clamp-2">
                        {p.outcome}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-black/5 text-[11px] text-[#777777] font-medium">
                      {p.certificateType}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Batch Preference Dropdown */}
            <div className="space-y-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555]">
                Select Batch Preference *
              </label>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="w-full px-4 py-2.5 bg-[#F0F2F4] border border-black/10 rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#1E9E54]"
              >
                {BATCH_OPTIONS.map((b) => (
                  <option key={b.id} value={b.id} className="bg-white text-[#111111]">
                    {b.label}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#666666]">
                Batches are conducted in hybrid format with access to the Coimbatore lab and online live mentorship.
              </p>
            </div>

            {/* Coupon Code Section */}
            <div className="p-4 bg-[#F7F8FA] rounded-2xl border border-black/10 space-y-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#1E9E54]" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#444444]">
                  Have a Coupon or College Partnership Code?
                </span>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. EARLYBIRD, VGMCOLLEGE"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  disabled={!!appliedCoupon}
                  className="grow px-3 py-2 bg-white border border-black/10 rounded-xl text-sm uppercase placeholder:normal-case text-[#111111] focus:outline-none focus:border-[#1E9E54]"
                />
                {appliedCoupon ? (
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="px-4 py-2 bg-[#F0F2F4] hover:bg-[#E5E7EB] text-[#111111] text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => validateCoupon()}
                    disabled={couponValidating}
                    className="px-5 py-2 bg-white hover:bg-white/90 text-black text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {couponValidating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Apply'}
                  </button>
                )}
              </div>

              {couponError && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{couponError}</span>
                </p>
              )}

              {appliedCoupon && (
                <div className="text-xs text-[#1E9E54] bg-[#1E9E54]/10 border border-[#1E9E54]/30 p-2.5 rounded-xl flex items-center justify-between">
                  <span>
                    <strong>{appliedCoupon.code}</strong> applied: {appliedCoupon.description} (-₹{appliedCoupon.discountAmount.toLocaleString('en-IN')})
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-[#1E9E54]" />
                </div>
              )}
            </div>

            {/* Pricing Preview */}
            <div className="p-4 bg-[#F7F8FA] rounded-2xl border border-black/10 flex items-center justify-between text-sm">
              <div>
                <span className="text-[#555555]">Total payable for <strong className="text-[#111111]">{selectedPlan.name}</strong>:</span>
                {appliedCoupon && (
                  <span className="line-through text-xs text-[#999999] ml-2">₹{basePrice.toLocaleString('en-IN')}</span>
                )}
              </div>
              <span className="font-heading text-2xl font-black text-[#1E9E54] tabular-nums">
                ₹{finalPrice.toLocaleString('en-IN')}
              </span>
            </div>

            {/* Navigation to Step 2 */}
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-8 py-3.5 bg-[#111111] hover:bg-[#1E9E54] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(30,158,84,0.35)] cursor-pointer"
              >
                <span>Continue to Student Details</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: STUDENT DETAILS */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6 bg-white border border-black/10 rounded-3xl p-6 sm:p-10 shadow-sm shadow-2xl"
          >
            <div>
              <h2 className="text-xl font-heading font-black text-[#111111]">
                Student Information
              </h2>
              <p className="text-xs text-[#555555] mt-0.5">
                These details will appear on your official certificate and internship registration record.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555]">
                  Full Name (as on Certificate) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Arun Kumar S"
                  value={studentData.fullName}
                  onChange={(e) => setStudentData({ ...studentData, fullName: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-[#F0F2F4] border rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#1E9E54] ${
                    formErrors.fullName ? 'border-red-400 bg-red-500/10' : 'border-black/10'
                  }`}
                />
                {formErrors.fullName && <p className="text-[11px] text-red-400">{formErrors.fullName}</p>}
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555]">
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="arun@example.com"
                  value={studentData.email}
                  onChange={(e) => setStudentData({ ...studentData, email: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-[#F0F2F4] border rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#1E9E54] ${
                    formErrors.email ? 'border-red-400 bg-red-500/10' : 'border-black/10'
                  }`}
                />
                {formErrors.email && <p className="text-[11px] text-red-400">{formErrors.email}</p>}
              </div>

              {/* Mobile (10 digit validation) */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555]">
                  Mobile Number (10 digits) *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3.5 text-xs font-mono font-semibold bg-[#F0F2F4] border border-r-0 border-black/10 rounded-l-xl text-[#555555]">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="9876543210"
                    maxLength={10}
                    value={studentData.mobile}
                    onChange={(e) => setStudentData({ ...studentData, mobile: e.target.value.replace(/\D/g, '') })}
                    className={`w-full px-3.5 py-2.5 bg-[#F0F2F4] border rounded-r-xl text-sm text-[#111111] focus:outline-none focus:border-[#1E9E54] ${
                      formErrors.mobile ? 'border-red-400 bg-red-500/10' : 'border-black/10'
                    }`}
                  />
                </div>
                {formErrors.mobile && <p className="text-[11px] text-red-400">{formErrors.mobile}</p>}
              </div>

              {/* Date of Birth */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555]">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={studentData.dob}
                  onChange={(e) => setStudentData({ ...studentData, dob: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F0F2F4] border border-black/10 rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#1E9E54]"
                />
              </div>

              {/* City */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555]">
                  City / Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Coimbatore, Chennai, Bangalore"
                  value={studentData.city}
                  onChange={(e) => setStudentData({ ...studentData, city: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-[#F0F2F4] border rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#1E9E54] ${
                    formErrors.city ? 'border-red-400 bg-red-500/10' : 'border-black/10'
                  }`}
                />
                {formErrors.city && <p className="text-[11px] text-red-400">{formErrors.city}</p>}
              </div>

              {/* College or Institution */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555]">
                  College / Institution Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. PSG Tech, CIT, Kumaraguru, Anna University"
                  value={studentData.college}
                  onChange={(e) => setStudentData({ ...studentData, college: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-[#F0F2F4] border rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#1E9E54] ${
                    formErrors.college ? 'border-red-400 bg-red-500/10' : 'border-black/10'
                  }`}
                />
                {formErrors.college && <p className="text-[11px] text-red-400">{formErrors.college}</p>}
              </div>

              {/* Degree and Stream */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555]">
                  Degree &amp; Stream *
                </label>
                <input
                  type="text"
                  placeholder="e.g. B.E CSE, B.Tech IT, MCA, B.Sc CS"
                  value={studentData.degreeStream}
                  onChange={(e) => setStudentData({ ...studentData, degreeStream: e.target.value })}
                  className={`w-full px-3.5 py-2.5 bg-[#F0F2F4] border rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#1E9E54] ${
                    formErrors.degreeStream ? 'border-red-400 bg-red-500/10' : 'border-black/10'
                  }`}
                />
                {formErrors.degreeStream && <p className="text-[11px] text-red-400">{formErrors.degreeStream}</p>}
              </div>

              {/* Year of Study */}
              <div className="space-y-1">
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555]">
                  Year of Study / Status *
                </label>
                <select
                  value={studentData.yearOfStudy}
                  onChange={(e) => setStudentData({ ...studentData, yearOfStudy: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#F0F2F4] border border-black/10 rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#1E9E54]"
                >
                  {YEARS_OF_STUDY.map((y) => (
                    <option key={y} value={y} className="bg-white text-[#111111]">{y}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* Programming Languages Known */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555]">
                Programming Languages You Know (Select all that apply) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PROGRAMMING_LANGUAGES.map((lang) => {
                  const checked = studentData.languages.includes(lang);
                  return (
                    <label
                      key={lang}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer select-none transition-colors ${
                        checked
                          ? 'bg-[#1E9E54]/15 border-[#1E9E54] text-[#1E9E54] font-semibold'
                          : 'border-black/10 bg-[#F7F8FA] text-[#555555] hover:border-black/20'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleLanguage(lang)}
                        className="sr-only"
                      />
                      <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                        checked ? 'bg-[#1E9E54] border-[#1E9E54]' : 'border-black/20 bg-[#F0F2F4]'
                      }`}>
                        {checked && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                      </div>
                      <span>{lang}</span>
                    </label>
                  );
                })}
              </div>
              {formErrors.languages && <p className="text-[11px] text-red-400">{formErrors.languages}</p>}
            </div>

            {/* Where did you hear about us? */}
            <div className="space-y-1">
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-[#555555]">
                Where Did You Hear About VGM Skill Hub?
              </label>
              <select
                value={studentData.referralSource}
                onChange={(e) => setStudentData({ ...studentData, referralSource: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#F0F2F4] border border-black/10 rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#1E9E54]"
              >
                {REFERRAL_SOURCES.map((r) => (
                  <option key={r} value={r} className="bg-white text-[#111111]">{r}</option>
                ))}
              </select>
            </div>

            {/* Navigation: Back or to Step 3 */}
            <div className="flex items-center justify-between pt-4 border-t border-black/5">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-5 py-2.5 border border-black/10 text-[#555555] hover:text-[#111111] text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-black/[0.04] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <LusionMagnetic strength={7}>
                <button
                  type="button"
                  onClick={() => {
                    if (validateStudentDetails()) {
                      setCurrentStep(3);
                    }
                  }}
                  className="lusion-cta-btn"
                >
                  <span className="cta-dot" />
                  <span className="cta-text">Proceed to Review &amp; Pay</span>
                  <span className="cta-arrow">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
              </LusionMagnetic>
            </div>
          </motion.div>
        )}

        {/* STEP 3: REVIEW AND PAY */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="space-y-6 bg-white border border-black/10 rounded-3xl p-6 sm:p-10 shadow-sm shadow-2xl"
          >
            <div>
              <h2 className="text-xl font-heading font-black text-[#111111]">
                Review Enrolment &amp; Fee Summary
              </h2>
              <p className="text-xs text-[#555555] mt-0.5">
                Verify your particulars before proceeding to Razorpay secure payment.
              </p>
            </div>

            {/* Summary Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Student Info Recap */}
              <div className="p-4 bg-[#F7F8FA] rounded-2xl border border-black/5 space-y-2 text-xs">
                <span className="font-mono font-bold uppercase text-[#1E9E54] tracking-wider block">
                  STUDENT PARTICULARS
                </span>
                <p><strong className="text-[#555555]">Name:</strong> {studentData.fullName}</p>
                <p><strong className="text-[#555555]">Email:</strong> {studentData.email}</p>
                <p><strong className="text-[#555555]">Mobile:</strong> +91 {studentData.mobile}</p>
                <p><strong className="text-[#555555]">Institution:</strong> {studentData.college} ({studentData.degreeStream})</p>
                <p><strong className="text-[#555555]">Location:</strong> {studentData.city}</p>
              </div>

              {/* Plan & Batch Recap */}
              <div className="p-4 bg-[#F7F8FA] rounded-2xl border border-black/5 space-y-2 text-xs">
                <span className="font-mono font-bold uppercase text-[#1E9E54] tracking-wider block">
                  PROGRAM &amp; INTERNSHIP DETAILS
                </span>
                <p><strong className="text-[#555555]">Course:</strong> {selectedCourse?.title || selectedCourseSlug}</p>
                <p><strong className="text-[#555555]">Selected Plan:</strong> {selectedPlan.name} ({selectedPlan.duration})</p>
                <p><strong className="text-[#555555]">Batch:</strong> {selectedBatch.label}</p>
                <p><strong className="text-[#555555]">Certificate:</strong> {selectedPlan.certificateType}</p>
                <p><strong className="text-[#555555]">Live Project Role:</strong> {selectedPlan.liveProjectRole}</p>
              </div>

            </div>

            {/* Fee Breakdown */}
            <div className="p-5 bg-[#1E9E54]/10 rounded-2xl border border-[#1E9E54]/30 space-y-2">
              <div className="flex justify-between text-xs text-[#777777]">
                <span>Standard Program Fee ({selectedPlan.name}):</span>
                <span className="tabular-nums font-mono text-[#111111]">₹{basePrice.toLocaleString('en-IN')}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-xs text-[#1E9E54] font-medium">
                  <span>Coupon Discount ({appliedCoupon.code}):</span>
                  <span className="tabular-nums font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <hr className="border-[#1E9E54]/20" />
              <div className="flex justify-between items-baseline pt-1">
                <div>
                  <span className="font-heading text-base font-black text-[#111111] block">Total Payable Now</span>
                  <span className="text-[11px] text-[#555555]">Includes all taxes, mentorship, materials, live repo access and certificate</span>
                </div>
                <span className="font-heading text-3xl font-black text-[#1E9E54] tabular-nums">
                  ₹{finalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Required Policy Checkboxes */}
            <div className="space-y-3 pt-2 text-xs text-[#777777] bg-[#F7F8FA] p-4 rounded-2xl border border-black/5">
              <p className="font-mono font-bold uppercase tracking-wider text-[#555555] text-[11px]">
                REGISTRATION DECLARATIONS &amp; POLICIES
              </p>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedTerms}
                  onChange={(e) => setAgreedTerms(e.target.checked)}
                  className="mt-0.5 rounded border-[#444] bg-[#18181c] text-[#43C170] focus:ring-[#43C170]"
                />
                <span>
                  I agree to the <Link to="/terms" target="_blank" className="underline font-semibold text-[#1E9E54]">Terms and Conditions</Link> for the VGM Skill Hub internship.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedPrivacy}
                  onChange={(e) => setAgreedPrivacy(e.target.checked)}
                  className="mt-0.5 rounded border-[#444] bg-[#18181c] text-[#43C170] focus:ring-[#43C170]"
                />
                <span>
                  I agree to the <Link to="/privacy" target="_blank" className="underline font-semibold text-[#1E9E54]">Privacy Policy</Link> regarding the processing of student admission data.
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedRefund}
                  onChange={(e) => setAgreedRefund(e.target.checked)}
                  className="mt-0.5 rounded border-[#444] bg-[#18181c] text-[#43C170] focus:ring-[#43C170]"
                />
                <span>
                  I have reviewed the <Link to="/refund" target="_blank" className="underline font-semibold text-[#1E9E54]">Refund and Cancellation Policy</Link> shared at enrolment.
                </span>
              </label>
            </div>

            {legalError && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 p-3 bg-red-500/10 rounded-xl border border-red-500/30">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{legalError}</span>
              </p>
            )}

            {paymentError && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 p-3 bg-red-500/10 rounded-xl border border-red-500/30">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{paymentError}</span>
              </p>
            )}

            {/* Secure Payment Trigger */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-black/5">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 border border-black/10 text-[#555555] hover:text-[#111111] text-xs font-mono uppercase tracking-wider rounded-xl hover:bg-black/[0.04] transition-colors flex items-center gap-1.5 w-full sm:w-auto justify-center cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Student Details</span>
              </button>

              {courseFull ? (
                <div className="flex-1 text-center bg-red-50 border border-red-200 rounded-xl px-6 py-3">
                  <p className="text-sm font-bold text-red-700">🚫 This batch is full</p>
                  <p className="text-xs text-red-500 mt-0.5">
                    Maximum {enrolmentStatus?.limit ?? 20} students admitted. Contact admissions for the next batch.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleRazorpayPayment}
                  disabled={isProcessingPayment}
                  className="w-full sm:w-auto px-8 py-3.5 bg-[#1E9E54] hover:bg-[#14723B] text-black font-bold rounded-xl shadow-[0_0_25px_rgba(30,158,84,0.4)] transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider cursor-pointer"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Connecting to Razorpay...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay ₹{finalPrice.toLocaleString('en-IN')} Securely with Razorpay</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex items-center justify-center gap-4 text-xs font-mono text-[#999999] pt-2">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#1E9E54]" />
                <span>Razorpay 256-bit SSL Encryption</span>
              </span>
              <span>·</span>
              <span>UPI / Netbanking / Cards / Wallets</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Test Mode Simulator Modal */}
      {simulatedOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-4 border border-black/10 text-[#111111]">
            <div className="flex items-center gap-2.5 text-[#1E9E54]">
              <div className="w-10 h-10 rounded-2xl bg-[#1E9E54]/15 border border-[#1E9E54]/30 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#1E9E54]" />
              </div>
              <div>
                <h3 className="font-heading text-lg font-black text-[#111111] leading-tight">
                  Razorpay Checkout Simulator
                </h3>
                <span className="text-[11px] text-[#555555] font-mono">
                  Test Gateway Environment
                </span>
              </div>
            </div>

            <p className="text-xs text-[#777777] leading-relaxed">
              Order created successfully on server:
            </p>

            <div className="bg-[#F0F2F4] p-3.5 rounded-xl border border-black/10 text-xs space-y-1 font-mono text-[#111111]">
              <p><span className="text-[#888888]">Order ID:</span> {simulatedOrderModal.orderId}</p>
              <p><span className="text-[#888888]">Enrolment:</span> {simulatedOrderModal.enrolmentId}</p>
              <p><span className="text-[#888888]">Amount:</span> ₹{simulatedOrderModal.amount.toLocaleString('en-IN')}</p>
              <p><span className="text-[#888888]">Student:</span> {simulatedOrderModal.studentName}</p>
            </div>

            <p className="text-xs text-[#666666]">
              Click below to simulate a successful payment authorization or simulate user dismissal/failure.
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => completeSimulatedPayment('success')}
                className="w-full py-3 px-4 bg-[#1E9E54] hover:bg-[#14723B] text-black font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-[0_0_20px_rgba(30,158,84,0.35)] cursor-pointer"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Simulate Successful Payment (Authorize)</span>
              </button>

              <button
                type="button"
                onClick={() => completeSimulatedPayment('fail')}
                className="w-full py-2.5 px-4 bg-[#F0F2F4] hover:bg-[#E5E7EB] text-[#111111] hover:text-[#111111] font-medium rounded-xl text-xs transition-colors cursor-pointer"
              >
                Simulate Payment Declined / Dismissed
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
