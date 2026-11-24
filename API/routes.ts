import { Router, Request, Response } from 'express';
import { DB } from './db.js';
import { RazorpayService } from './razorpay.js';
import { Mailer } from './mailer.js';
import { SupabaseService } from './supabase.js';
import {
  authRateLimiter,
  publicRateLimiter,
  apiRateLimiter,
  recordAuthFailure,
  recordAuthSuccess
} from './rateLimiter.js';
import {
  validateBody,
  createOrderSchema,
  verifyPaymentSchema,
  validateCouponSchema,
  adminLoginSchema,
  studentLoginSchema,
  studentProgressSchema,
  projectSubmitSchema,
  couponCreateSchema,
  couponUpdateSchema,
  courseCreateSchema,
  certificateCreateSchema,
  certificateUpdateSchema,
  projectReviewSchema,
  enrolmentStatusSchema
} from './validators.js';
import { requireAdmin, verifyAdminPassword, generateAdminToken } from './auth.js';
import { handleSecureUpload, handleSecureFileServe } from './upload.js';

export const apiRouter = Router();

// Standard plan prices in INR
const PLAN_PRICES: Record<string, { name: string; fee: number }> = {
  explorer: { name: 'Explorer (1 Month)', fee: 5999 },
  builder: { name: 'Builder (2 Months)', fee: 9999 },
  professional: { name: 'Professional (3 Months)', fee: 14999 }
};

// 1. GET /api/config - Public configuration (Public Rate Limited)
apiRouter.get('/config', publicRateLimiter, (_req, res) => {
  res.json({
    success: true,
    razorpayKeyId: RazorpayService.getKeyId(),
    isLive: RazorpayService.isLive(),
    isConfigured: RazorpayService.isConfigured(),
    planPrices: DB.getPlans(),
    databaseEngine: SupabaseService.isAvailable() ? 'supabase_postgresql' : 'local_json_resilient'
  });
});

// 1.5. GET /api/plans - Public retrieval of current active plans & tuition
apiRouter.get('/plans', publicRateLimiter, (_req, res) => {
  res.json({
    success: true,
    plans: DB.getPlans()
  });
});

// 2. GET /api/health/db - Database connectivity diagnostic
apiRouter.get('/health/db', publicRateLimiter, async (_req, res) => {
  const ping = await SupabaseService.ping();
  res.json({
    status: ping.connected ? 'connected' : 'local_fallback',
    supabase: ping,
    totalEnrolments: DB.getEnrolments().length,
    totalCourses: DB.getCourses().length,
    timestamp: new Date().toISOString()
  });
});

// 3. POST /api/validate-coupon (Public Rate Limited + Strict Input Validation)
apiRouter.post('/validate-coupon', publicRateLimiter, validateBody(validateCouponSchema), (req, res) => {
  const { code, planId, fee } = req.body;

  const coupon = DB.getCouponByCode(code);
  if (!coupon) {
    return res.status(404).json({ valid: false, message: 'Invalid coupon code' });
  }

  if (!coupon.isActive) {
    return res.status(400).json({ valid: false, message: 'This coupon is no longer active' });
  }

  if (new Date(coupon.expiresAt).getTime() < Date.now()) {
    return res.status(400).json({ valid: false, message: 'This coupon has expired' });
  }

  if (coupon.timesUsed >= coupon.usageLimit) {
    return res.status(400).json({ valid: false, message: 'Coupon usage limit reached' });
  }

  const plan = planId ? PLAN_PRICES[planId] : null;
  const baseFee = typeof fee === 'number' && fee > 0 ? fee : (plan ? plan.fee : 5999);
  let discountAmount = 0;

  if (coupon.discountType === 'percentage') {
    discountAmount = Math.round((baseFee * coupon.discountValue) / 100);
  } else {
    discountAmount = Math.min(coupon.discountValue, baseFee);
  }

  return res.json({
    valid: true,
    code: coupon.code,
    discountType: coupon.discountType,
    discountValue: coupon.discountValue,
    discountAmount,
    description: coupon.description
  });
});

// 4. POST /api/create-order (API Rate Limited + Strict Input Validation)
apiRouter.post('/create-order', apiRateLimiter, validateBody(createOrderSchema), async (req, res) => {
  try {
    const {
      courseId,
      courseTitle,
      planId,
      planName: customPlanName,
      batchId,
      batchLabel,
      fee: customFee,
      student,
      assessment,
      couponCode
    } = req.body;

    const currentPlans = DB.getPlans();
    const plan = currentPlans[planId];
    const resolvedPlanName = customPlanName || plan?.name || 'Explorer';
    const baseAmount = typeof customFee === 'number' && customFee > 0 ? customFee : (plan ? plan.fee : 5999);

    const cleanMobile = student.mobile.replace(/\D/g, '');

    let discountAmount = 0;
    let appliedCoupon: string | null = null;

    if (couponCode && typeof couponCode === 'string' && couponCode.trim()) {
      const coupon = DB.getCouponByCode(couponCode);
      if (coupon && coupon.isActive && new Date(coupon.expiresAt).getTime() >= Date.now() && coupon.timesUsed < coupon.usageLimit) {
        if (coupon.discountType === 'percentage') {
          discountAmount = Math.round((baseAmount * coupon.discountValue) / 100);
        } else {
          discountAmount = Math.min(coupon.discountValue, baseAmount);
        }
        appliedCoupon = coupon.code;
      }
    }

    const finalAmount = Math.max(0, baseAmount - discountAmount);
    const amountInPaise = finalAmount * 100;

    // Save pending enrolment in database first to get unique ID
    const pendingEnrolment = DB.createEnrolment({
      courseId: courseId || 'ai-mobile-app',
      courseTitle: courseTitle || 'AI-Powered Mobile App Development Internship',
      planId: planId || 'explorer',
      planName: resolvedPlanName,
      batchId: batchId || 'nov-morning',
      batchLabel: batchLabel || 'November 2026 Batch',
      student: {
        fullName: student.fullName.trim(),
        email: student.email.trim().toLowerCase(),
        mobile: cleanMobile,
        dob: student.dob || '',
        city: student.city || 'Coimbatore',
        college: student.college || 'Institution',
        degreeStream: student.degreeStream || 'Engineering',
        yearOfStudy: student.yearOfStudy || 'Undergraduate',
        languages: Array.isArray(student.languages) ? student.languages : [],
        referralSource: student.referralSource || 'Direct'
      },
      assessment: {
        score: Number(assessment?.score) || 0,
        total: Number(assessment?.total) || 5,
        answers: assessment?.answers || {},
        completedAt: assessment?.completedAt || new Date().toISOString()
      },
      pricing: {
        baseAmount,
        discountAmount,
        couponCode: appliedCoupon,
        finalAmount,
        currency: 'INR'
      },
      payment: {
        status: 'pending',
        orderId: 'pending_init'
      }
    });

    // Create Razorpay order
    const rzpOrder = await RazorpayService.createOrder({
      amountPaise: amountInPaise,
      currency: 'INR',
      receipt: pendingEnrolment.id,
      notes: {
        enrolmentId: pendingEnrolment.id,
        courseId: pendingEnrolment.courseId || 'ai-mobile-app',
        courseTitle: pendingEnrolment.courseTitle || 'AI-Powered Mobile App',
        studentName: pendingEnrolment.student.fullName,
        studentEmail: pendingEnrolment.student.email,
        plan: resolvedPlanName
      }
    });

    // Update pending enrolment with orderId
    DB.updateEnrolment(pendingEnrolment.id, {
      payment: {
        status: 'pending',
        orderId: rzpOrder.id
      }
    });

    return res.json({
      success: true,
      orderId: rzpOrder.id,
      enrolmentId: pendingEnrolment.id,
      amount: finalAmount,
      amountPaise: amountInPaise,
      currency: 'INR',
      keyId: RazorpayService.getKeyId(),
      isSimulated: rzpOrder.isSimulated,
      planName: resolvedPlanName,
      courseTitle: pendingEnrolment.courseTitle,
      student: {
        name: pendingEnrolment.student.fullName,
        email: pendingEnrolment.student.email,
        contact: pendingEnrolment.student.mobile
      }
    });
  } catch (err: any) {
    console.error('Error creating order:', err);
    res.status(500).json({ success: false, error: err?.message || 'Unable to initialize order. Please verify payment details.' });
  }
});

// 5. POST /api/verify-payment (API Rate Limited + Strict Input Validation)
apiRouter.post('/verify-payment', apiRateLimiter, validateBody(verifyPaymentSchema), async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, enrolmentId } = req.body;

    const isValid = RazorpayService.verifyPaymentSignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature || ''
    );

    if (!isValid) {
      console.warn(`Payment signature verification failed for order ${razorpay_order_id}`);
      return res.status(400).json({ success: false, error: 'Invalid payment signature. Verification failed.' });
    }

    // Find enrolment by order ID or Enrolment ID
    let enrolment = DB.getEnrolmentById(enrolmentId || razorpay_order_id);
    if (!enrolment) {
      return res.status(404).json({ success: false, error: 'Enrolment record not found.' });
    }

    // Mark as paid
    const updated = DB.updateEnrolment(enrolment.id, {
      payment: {
        status: 'paid',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        signature: razorpay_signature,
        paidAt: new Date().toISOString()
      }
    });

    // Update coupon count if coupon was used
    if (enrolment.pricing.couponCode) {
      const coupon = DB.getCouponByCode(enrolment.pricing.couponCode);
      if (coupon) {
        DB.updateCoupon(coupon.id, { timesUsed: coupon.timesUsed + 1 });
      }
    }

    // Send emails safely in background
    if (updated) {
      Mailer.sendEnrolmentConfirmation(updated).catch(err => console.error('Email confirmation error:', err));
    }

    return res.json({
      success: true,
      message: 'Payment verified and enrolment confirmed',
      enrolmentId: enrolment.id,
      enrolment: updated
    });
  } catch (err: any) {
    console.error('Error verifying payment:', err);
    res.status(500).json({ success: false, error: 'Payment verification failed due to internal error.' });
  }
});

// 6. POST /api/razorpay-webhook
apiRouter.post('/razorpay-webhook', async (req: any, res) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = req.rawBody || JSON.stringify(req.body);

    const isValid = RazorpayService.verifyWebhookSignature(rawBody, signature);
    if (!isValid) {
      console.warn('Webhook signature check failed');
      return res.status(400).send('Invalid webhook signature');
    }

    const event = req.body;
    const eventId = event?.event_id || event?.id || `evt_${Date.now()}`;

    // Idempotency check
    if (DB.isWebhookProcessed(eventId)) {
      console.log(`[WEBHOOK] Event ${eventId} already processed, skipping.`);
      return res.json({ status: 'already_processed' });
    }

    const eventType = event.event;
    console.log(`[WEBHOOK RECEIVED] ${eventType}`);

    if (eventType === 'payment.captured' || eventType === 'order.paid') {
      const payloadPayment = event.payload?.payment?.entity;
      const orderId = payloadPayment?.order_id || event.payload?.order?.entity?.id;
      const paymentId = payloadPayment?.id;

      if (orderId) {
        const enrolment = DB.getEnrolmentById(orderId);
        if (enrolment && enrolment.payment.status !== 'paid') {
          const updated = DB.updateEnrolment(enrolment.id, {
            payment: {
              status: 'paid',
              orderId,
              paymentId: paymentId || enrolment.payment.paymentId || 'webhook_captured',
              paidAt: new Date().toISOString()
            }
          });
          if (updated) {
            Mailer.sendEnrolmentConfirmation(updated).catch(e => console.error(e));
          }
        }
      }
    } else if (eventType === 'payment.failed') {
      const payloadPayment = event.payload?.payment?.entity;
      const orderId = payloadPayment?.order_id;
      if (orderId) {
        const enrolment = DB.getEnrolmentById(orderId);
        if (enrolment && enrolment.payment.status !== 'paid') {
          DB.updateEnrolment(enrolment.id, {
            payment: {
              ...enrolment.payment,
              status: 'failed',
              failedReason: payloadPayment?.error_description || 'Payment failed or declined'
            }
          });
        }
      }
    }

    DB.recordWebhook(eventId, eventType);
    return res.json({ status: 'ok' });
  } catch (err: any) {
    console.error('Webhook error:', err);
    res.status(500).json({ error: 'Webhook processing error' });
  }
});

// 7. GET /api/enrolment/:id - Retrieve enrolment for receipt/status
apiRouter.get('/enrolment/:id', publicRateLimiter, (req, res) => {
  const enrolment = DB.getEnrolmentById(req.params.id);
  if (!enrolment) {
    return res.status(404).json({ error: 'Enrolment record not found' });
  }
  res.json({ enrolment });
});

// 8. POST /api/admin/login (Auth Rate Limited with Exponential Backoff)
apiRouter.post('/admin/login', authRateLimiter, validateBody(adminLoginSchema), (req, res) => {
  const { password } = req.body;

  if (verifyAdminPassword(password) || (typeof password === 'string' && verifyAdminPassword(password.trim()))) {
    recordAuthSuccess(req, 'admin');
    const token = generateAdminToken();
    return res.json({ success: true, token });
  }

  recordAuthFailure(req, 'admin');
  return res.status(401).json({ success: false, error: 'Incorrect administrator password.' });
});

// 9. GET /api/admin/stats
apiRouter.get('/admin/stats', requireAdmin, (_req, res) => {
  const enrolments = DB.getEnrolments();
  const totalEnrolments = enrolments.length;
  const paidEnrolments = enrolments.filter(e => e.payment.status === 'paid');
  const pendingEnrolments = enrolments.filter(e => e.payment.status === 'pending');
  const failedEnrolments = enrolments.filter(e => e.payment.status === 'failed');

  const totalRevenue = paidEnrolments.reduce((sum, e) => sum + e.pricing.finalAmount, 0);

  const planBreakdown = {
    explorer: enrolments.filter(e => e.planId === 'explorer').length,
    builder: enrolments.filter(e => e.planId === 'builder').length,
    professional: enrolments.filter(e => e.planId === 'professional').length
  };

  const paidPlanBreakdown = {
    explorer: paidEnrolments.filter(e => e.planId === 'explorer').length,
    builder: paidEnrolments.filter(e => e.planId === 'builder').length,
    professional: paidEnrolments.filter(e => e.planId === 'professional').length
  };

  const courseBreakdown: Record<string, number> = {};
  enrolments.forEach(e => {
    const c = e.courseTitle || 'AI-Powered Mobile App';
    courseBreakdown[c] = (courseBreakdown[c] || 0) + 1;
  });

  const certificates = DB.getCertificates();
  const projects = DB.getAllProjectSubmissions();
  const reviewedProjectsCount = projects.filter(p => p.submission.status === 'approved' || p.submission.status === 'rework_needed').length;

  res.json({
    totalEnrolments,
    paidCount: paidEnrolments.length,
    pendingCount: pendingEnrolments.length,
    failedCount: failedEnrolments.length,
    totalRevenue,
    planBreakdown,
    paidPlanBreakdown,
    courseBreakdown,
    totalCertificates: certificates.length,
    totalProjects: projects.length,
    reviewedProjectsCount
  });
});

// 10. GET /api/admin/enrolments (with search and filters)
apiRouter.get('/admin/enrolments', requireAdmin, (req, res) => {
  const { search, plan, status, batch, course } = req.query;
  let list = DB.getEnrolments();

  if (course && course !== 'all') {
    list = list.filter(e => (e.courseId || 'ai-mobile-app') === course);
  }

  if (plan && plan !== 'all') {
    list = list.filter(e => e.planId === plan);
  }

  if (status && status !== 'all') {
    list = list.filter(e => e.payment.status === status);
  }

  if (batch && batch !== 'all') {
    list = list.filter(e => e.batchId === batch);
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    list = list.filter(e =>
      e.id.toLowerCase().includes(q) ||
      e.student.fullName.toLowerCase().includes(q) ||
      e.student.email.toLowerCase().includes(q) ||
      e.student.mobile.includes(q) ||
      e.student.college.toLowerCase().includes(q)
    );
  }

  res.json({ enrolments: list });
});

// 11. GET /api/admin/enrolments/export-csv
apiRouter.get('/admin/export-csv', requireAdmin, (_req, res) => {
  const enrolments = DB.getEnrolments();

  const headers = [
    'Enrolment ID',
    'Created Date',
    'Student Name',
    'Email',
    'Mobile',
    'DOB',
    'City',
    'College',
    'Degree & Stream',
    'Year of Study',
    'Known Languages',
    'Referral Source',
    'Plan',
    'Batch',
    'Base Amount (INR)',
    'Discount (INR)',
    'Coupon Code',
    'Paid Amount (INR)',
    'Payment Status',
    'Razorpay Order ID',
    'Razorpay Payment ID',
    'Payment Date',
    'Assessment Score',
    'Assessment Total'
  ];

  const rows = enrolments.map(e => [
    e.id,
    new Date(e.createdAt).toLocaleDateString('en-IN'),
    `"${(e.student.fullName || '').replace(/"/g, '""')}"`,
    e.student.email,
    e.student.mobile,
    e.student.dob,
    `"${(e.student.city || '').replace(/"/g, '""')}"`,
    `"${(e.student.college || '').replace(/"/g, '""')}"`,
    `"${(e.student.degreeStream || '').replace(/"/g, '""')}"`,
    `"${(e.student.yearOfStudy || '').replace(/"/g, '""')}"`,
    `"${(e.student.languages || []).join(', ')}"`,
    `"${(e.student.referralSource || '').replace(/"/g, '""')}"`,
    e.planName,
    `"${e.batchLabel.replace(/"/g, '""')}"`,
    e.pricing.baseAmount,
    e.pricing.discountAmount,
    e.pricing.couponCode || 'None',
    e.pricing.finalAmount,
    e.payment.status.toUpperCase(),
    e.payment.orderId || '',
    e.payment.paymentId || '',
    e.payment.paidAt ? new Date(e.payment.paidAt).toLocaleDateString('en-IN') : '',
    e.assessment.score,
    e.assessment.total
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="vgm_enrolments_${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(csvContent);
});

// 12. Coupon Management Routes
apiRouter.get('/admin/coupons', requireAdmin, (_req, res) => {
  res.json({ coupons: DB.getCoupons() });
});

apiRouter.post('/admin/coupons', requireAdmin, validateBody(couponCreateSchema), (req, res) => {
  const { code, discountType, discountValue, expiresAt, usageLimit, description } = req.body;

  const existing = DB.getCouponByCode(code);
  if (existing) {
    return res.status(400).json({ error: 'A coupon with this code already exists' });
  }

  const newCoupon = DB.createCoupon({
    code: code.trim().toUpperCase(),
    discountType: discountType || 'percentage',
    discountValue: Number(discountValue),
    expiresAt: expiresAt || new Date(Date.now() + 90 * 86400000).toISOString(),
    usageLimit: Number(usageLimit) || 100,
    isActive: true,
    description: description || ''
  });

  res.json({ success: true, coupon: newCoupon });
});

apiRouter.patch('/admin/coupons/:id', requireAdmin, validateBody(couponUpdateSchema), (req, res) => {
  const updated = DB.updateCoupon(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Coupon not found' });
  }
  res.json({ success: true, coupon: updated });
});

apiRouter.delete('/admin/coupons/:id', requireAdmin, (req, res) => {
  const success = DB.deleteCoupon(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Coupon not found' });
  }
  res.json({ success: true });
});

// 13. Dynamic Course Management Routes
apiRouter.get('/courses', publicRateLimiter, (_req, res) => {
  res.json({ courses: DB.getCourses() });
});

apiRouter.get('/courses/:slug', publicRateLimiter, (req, res) => {
  const course = DB.getCourseBySlug(req.params.slug);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json({ course });
});

apiRouter.post('/admin/courses', requireAdmin, validateBody(courseCreateSchema), (req, res) => {
  try {
    const course = DB.createCourse(req.body);
    res.json({ success: true, course });
  } catch (err: any) {
    res.status(500).json({ error: 'Error creating course' });
  }
});

apiRouter.put('/admin/courses/:id', requireAdmin, (req, res) => {
  try {
    const updated = DB.updateCourse(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ success: true, course: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Error updating course' });
  }
});

apiRouter.delete('/admin/courses/:id', requireAdmin, (req, res) => {
  try {
    const success = DB.deleteCourse(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Error deleting course' });
  }
});

// 13.5. Dynamic Plan & Tuition Management Routes
apiRouter.get('/admin/plans', requireAdmin, (_req, res) => {
  res.json({
    success: true,
    plans: DB.getPlans()
  });
});

apiRouter.put('/admin/plans/:id', requireAdmin, (req, res) => {
  try {
    const updated = DB.updatePlan(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, error: 'Plan not found.' });
    }
    res.json({ success: true, plan: updated });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err?.message || 'Error updating plan' });
  }
});

// 14. Student Portal Routes (Auth Rate Limited with Exponential Backoff)
apiRouter.post('/student/login', authRateLimiter, validateBody(studentLoginSchema), (req, res) => {
  const { enrolmentId, credential } = req.body;

  const portalData = DB.getStudentPortalData(enrolmentId, credential || undefined);
  if (!portalData) {
    recordAuthFailure(req, enrolmentId);
    return res.status(401).json({ error: 'No matching student record found. Please verify your Enrollment Number or registered credentials.' });
  }

  recordAuthSuccess(req, enrolmentId);
  const primaryEnrolment = portalData.enrolments[0];
  const course = DB.getCourseBySlug(primaryEnrolment?.courseId || 'ai-mobile-app');
  res.json({
    success: true,
    enrolment: primaryEnrolment,
    enrolments: portalData.enrolments,
    enrollmentNumber: portalData.enrollmentNumber,
    student: portalData.student,
    certificates: portalData.certificates,
    primaryCertificate: portalData.primaryCertificate,
    course
  });
});

apiRouter.get('/student/details/:id', apiRateLimiter, (req, res) => {
  const portalData = DB.getStudentPortalData(req.params.id);
  if (!portalData) {
    const single = DB.getEnrolmentById(req.params.id);
    if (!single) {
      return res.status(404).json({ error: 'Student record not found.' });
    }
    const course = DB.getCourseBySlug(single.courseId || 'ai-mobile-app');
    const certs = DB.getCertificatesByEnrolment(single.enrollmentNumber || single.id);
    return res.json({
      success: true,
      enrolment: single,
      enrolments: [single],
      enrollmentNumber: single.enrollmentNumber || single.id,
      student: single.student,
      certificates: certs,
      primaryCertificate: certs[0] || null,
      course
    });
  }

  const primaryEnrolment = portalData.enrolments[0];
  const course = DB.getCourseBySlug(primaryEnrolment?.courseId || 'ai-mobile-app');
  res.json({
    success: true,
    enrolment: primaryEnrolment,
    enrolments: portalData.enrolments,
    enrollmentNumber: portalData.enrollmentNumber,
    student: portalData.student,
    certificates: portalData.certificates,
    primaryCertificate: portalData.primaryCertificate,
    course
  });
});

apiRouter.get('/student/portal/:query', publicRateLimiter, (req, res) => {
  const portalData = DB.getStudentPortalData(req.params.query);
  if (!portalData) {
    return res.status(404).json({ success: false, error: 'No student record found for this Enrollment Number.' });
  }
  const primaryEnrolment = portalData.enrolments[0];
  const course = DB.getCourseBySlug(primaryEnrolment?.courseId || 'ai-mobile-app');
  res.json({
    success: true,
    enrollmentNumber: portalData.enrollmentNumber,
    student: portalData.student,
    enrolments: portalData.enrolments,
    enrolment: primaryEnrolment,
    certificates: portalData.certificates,
    primaryCertificate: portalData.primaryCertificate,
    course
  });
});

apiRouter.post('/student/progress', apiRateLimiter, validateBody(studentProgressSchema), (req, res) => {
  const { enrolmentId, completedWeeks } = req.body;

  const updated = DB.updateStudentProgress(enrolmentId, completedWeeks);
  if (!updated) {
    return res.status(404).json({ error: 'Enrolment not found.' });
  }
  res.json({ success: true, enrolment: updated });
});

apiRouter.post('/student/submit-project', apiRateLimiter, validateBody(projectSubmitSchema), (req, res) => {
  const { enrolmentId, githubUrl, liveUrl, notes } = req.body;

  const updated = DB.submitStudentProject(enrolmentId, { githubUrl, liveUrl, notes });
  if (!updated) {
    return res.status(404).json({ error: 'Enrolment not found.' });
  }
  res.json({ success: true, enrolment: updated });
});

// 15. Secure File Upload & Retrieval Endpoints
apiRouter.post('/upload', apiRateLimiter, handleSecureUpload);
apiRouter.get('/files/:filename', publicRateLimiter, handleSecureFileServe);

// 16. Enrolment Status Update Route (Admin)
apiRouter.patch('/admin/enrolments/:id/status', requireAdmin, validateBody(enrolmentStatusSchema), (req, res) => {
  const { status } = req.body;
  const updated = DB.updateEnrolmentPaymentStatus(req.params.id, status);
  if (!updated) {
    return res.status(404).json({ error: 'Enrolment not found.' });
  }
  res.json({ success: true, enrolment: updated });
});

// 17. Certificate Routes (Public Verification + Admin Management)
apiRouter.get('/certificates/:id', publicRateLimiter, async (req, res) => {
  const query = req.params.id;
  let cert = DB.getCertificateById(query);
  let allCerts = DB.getCertificatesByEnrolment(query);

  if ((!cert || allCerts.length === 0) && SupabaseService.isAvailable()) {
    try {
      const remote = await SupabaseService.getCertificateById(query);
      if (remote) {
        if (!cert) cert = remote;
        if (!allCerts.some(c => c.id === remote.id)) allCerts.push(remote);
      }
    } catch {}
  }

  const enrolments = DB.getEnrolmentsByStudent(query);

  if (!cert && allCerts.length === 0) {
    return res.status(404).json({ error: 'Certificate not found. Please verify the Certificate ID or Enrollment Number.' });
  }

  const primaryCert = cert || allCerts[0];
  res.json({
    success: true,
    certificate: primaryCert,
    certificates: allCerts.length > 0 ? allCerts : [primaryCert],
    student: enrolments[0]?.student || { fullName: primaryCert.studentName, email: primaryCert.studentEmail },
    enrolment: enrolments[0] || null
  });
});

apiRouter.get('/admin/certificates', requireAdmin, (req, res) => {
  const { search } = req.query;
  let list = DB.getCertificates();
  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    list = list.filter(c =>
      c.id.toLowerCase().includes(q) ||
      c.studentName.toLowerCase().includes(q) ||
      c.studentEmail.toLowerCase().includes(q) ||
      c.courseTitle.toLowerCase().includes(q)
    );
  }
  res.json({ success: true, certificates: list });
});

apiRouter.post('/admin/certificates', requireAdmin, validateBody(certificateCreateSchema), (req, res) => {
  try {
    const id = req.body.id || req.body.certId;
    const newCert = DB.createCertificate({ ...req.body, id });
    res.json({ success: true, certificate: newCert });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to issue certificate' });
  }
});

apiRouter.patch('/admin/certificates/:id', requireAdmin, validateBody(certificateUpdateSchema), (req, res) => {
  try {
    const updated = DB.updateCertificate(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    res.json({ success: true, certificate: updated });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to update certificate' });
  }
});

apiRouter.delete('/admin/certificates/:id', requireAdmin, (req, res) => {
  try {
    const success = DB.deleteCertificate(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to delete certificate' });
  }
});

// 18. Project Submission & Mentorship Evaluation Routes (Admin)
apiRouter.get('/admin/projects', requireAdmin, (_req, res) => {
  const projects = DB.getAllProjectSubmissions();
  res.json({ success: true, projects });
});

apiRouter.post('/admin/projects/:enrolmentId/review', requireAdmin, validateBody(projectReviewSchema), (req, res) => {
  const { status, feedback, score, reviewerName } = req.body;
  const updated = DB.reviewStudentProject(req.params.enrolmentId, {
    status,
    feedback,
    score,
    reviewerName
  });
  if (!updated) {
    return res.status(404).json({ error: 'Enrolment or project submission not found.' });
  }
  res.json({ success: true, enrolment: updated });
});
