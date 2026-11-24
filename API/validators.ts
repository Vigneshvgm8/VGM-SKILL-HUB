import { z, ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';

// ── 1. Create Order Schema ──
export const createOrderSchema = z.object({
  courseId: z.string().min(1).max(64),
  courseTitle: z.string().min(1).max(120),
  planId: z.string().min(1).max(64),
  planName: z.string().max(80).optional(),
  batchId: z.string().min(1).max(64),
  batchLabel: z.string().min(1).max(100),
  fee: z.number().positive().max(500000).optional(),
  couponCode: z.string().trim().max(30).regex(/^[A-Za-z0-9_-]*$/, 'Coupon must be alphanumeric').optional().nullable(),
  student: z.object({
    fullName: z.string().trim().min(2, 'Name must be at least 2 characters').max(80, 'Name cannot exceed 80 characters'),
    email: z.string().trim().email('Invalid email address format').max(120),
    mobile: z.string().trim().min(7, 'Mobile must be at least 7 digits').max(20, 'Mobile cannot exceed 20 digits').regex(/^[0-9+\s()-]{7,20}$/, 'Invalid mobile phone number'),
    dob: z.string().max(30).optional().nullable().default(''),
    city: z.string().trim().max(60).optional().nullable().default('Coimbatore'),
    college: z.string().trim().max(120).optional().nullable().default('Institution'),
    degreeStream: z.string().trim().max(100).optional().nullable().default('Engineering'),
    yearOfStudy: z.string().trim().max(50).optional().nullable().default('Undergraduate'),
    languages: z.array(z.string().max(40)).max(15).optional().default([]),
    referralSource: z.string().trim().max(50).optional().nullable().default('Direct')
  }),
  assessment: z.object({
    score: z.number().min(0).max(100).optional().default(0),
    total: z.number().min(0).max(100).optional().default(0),
    answers: z.record(z.string(), z.number()).optional().default({}),
    completedAt: z.string().max(60).optional().nullable().default('')
  }).optional().nullable()
});

// ── 2. Verify Payment Schema ──
export const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(5).max(100),
  razorpay_payment_id: z.string().min(5).max(100),
  razorpay_signature: z.string().max(128).optional(),
  enrolmentId: z.string().min(3).max(100).optional()
});

// ── 3. Validate Coupon Schema ──
export const validateCouponSchema = z.object({
  code: z.string().trim().min(2, 'Coupon code must be at least 2 characters').max(30).regex(/^[A-Za-z0-9_-]+$/, 'Coupon must be alphanumeric'),
  planId: z.string().max(50).optional(),
  fee: z.number().positive().max(500000).optional()
});

// ── 4. Admin Login Schema ──
export const adminLoginSchema = z.object({
  password: z.string().min(4, 'Password required').max(128)
});

// ── 5. Student Login Schema ──
export const studentLoginSchema = z.object({
  enrolmentId: z.string().trim().min(3).max(60),
  credential: z.string().trim().max(120).optional().nullable()
});

// ── 6. Student Progress Schema ──
export const studentProgressSchema = z.object({
  enrolmentId: z.string().trim().min(3).max(60),
  completedWeeks: z.array(z.number().int().min(1).max(52)).max(52)
});

// ── 7. Project Submission Schema ──
export const projectSubmitSchema = z.object({
  enrolmentId: z.string().trim().min(3).max(60),
  githubUrl: z.string().trim().url('Invalid GitHub URL').refine(url => url.includes('github.com'), 'Must be a valid GitHub repository URL'),
  liveUrl: z.string().trim().url('Invalid live deployment URL').optional().or(z.literal('')),
  notes: z.string().trim().max(1000, 'Notes cannot exceed 1000 characters').optional()
});

// ── 8. Coupon Create/Update Schemas ──
export const couponCreateSchema = z.object({
  code: z.string().trim().min(2).max(30).regex(/^[A-Za-z0-9_-]+$/, 'Coupon code must be alphanumeric'),
  discountType: z.enum(['percentage', 'flat']),
  discountValue: z.number().positive(),
  expiresAt: z.string().datetime({ message: 'expiresAt must be a valid ISO 8601 date string' }).or(z.string().min(10).max(40)),
  usageLimit: z.number().int().positive().max(100000).default(100),
  description: z.string().max(255).optional().default('')
}).refine(data => {
  if (data.discountType === 'percentage' && data.discountValue > 100) {
    return false;
  }
  return true;
}, { message: 'Percentage discount cannot exceed 100%', path: ['discountValue'] });

export const couponUpdateSchema = z.object({
  code: z.string().trim().min(2).max(30).optional(),
  discountType: z.enum(['percentage', 'flat']).optional(),
  discountValue: z.number().positive().optional(),
  expiresAt: z.string().optional(),
  usageLimit: z.number().int().positive().optional(),
  isActive: z.boolean().optional(),
  description: z.string().max(255).optional()
});

// ── 9. Course Create/Update Schemas ──
export const courseCreateSchema = z.object({
  id: z.string().min(2).max(64).regex(/^[a-z0-9-]+$/i).optional(),
  slug: z.string().min(2).max(64).regex(/^[a-z0-9-]+$/i),
  title: z.string().min(2).max(120),
  headline: z.string().min(2).max(255).optional(),
  shortDescription: z.string().min(5).max(500),
  fullDescription: z.string().optional().default(''),
  category: z.string().min(2).max(64),
  badge: z.string().min(2).max(64).optional().default('Trending Track 2026'),
  level: z.string().min(2).max(64).optional().default('Beginner to Advanced'),
  duration: z.string().min(2).max(64).optional().default('12 Weeks (3 Months)'),
  durationWeeks: z.number().int().positive().optional().default(12),
  startingFee: z.number().int().positive().max(500000),
  startingFeeFormatted: z.string().optional(),
  nextBatch: z.string().min(2).max(100).optional().default('15th December 2026'),
  mode: z.string().optional().default('Hybrid (Coimbatore Campus + Online Live)'),
  status: z.enum(['enrolling', 'upcoming', 'waitlist']).optional().default('enrolling'),
  tools: z.array(z.string().max(60)).optional().default([]),
  highlights: z.array(z.string().max(255)).optional().default([])
});

// ── 10. Certificate Create/Update Schemas ──
export const certificateCreateSchema = z.object({
  id: z.string().trim().max(60).optional(),
  certId: z.string().trim().max(60).optional(),
  enrolmentId: z.string().trim().max(60).optional(),
  studentName: z.string().trim().min(2, 'Student name required').max(100),
  studentEmail: z.string().trim().email('Valid email required').max(120),
  courseTitle: z.string().trim().min(2, 'Course title required').max(150),
  planLevel: z.string().trim().min(2).max(100).default('Builder Plan (8 Weeks)'),
  completionDate: z.string().trim().min(4).max(60),
  grade: z.string().trim().min(2).max(80).default('Distinction (Grade A+)'),
  projectTitle: z.string().trim().min(2).max(255).default('Capstone Project'),
  skills: z.array(z.string().max(50)).default([]),
  authorizedSignatory: z.string().trim().max(150).default('Director of Academic Engineering, VGM Soft Tech'),
  verificationStatus: z.enum(['verified', 'revoked']).default('verified')
});

export const certificateUpdateSchema = z.object({
  studentName: z.string().trim().min(2).max(100).optional(),
  studentEmail: z.string().trim().email().max(120).optional(),
  courseTitle: z.string().trim().min(2).max(150).optional(),
  planLevel: z.string().trim().min(2).max(100).optional(),
  completionDate: z.string().trim().min(4).max(60).optional(),
  grade: z.string().trim().min(2).max(80).optional(),
  verificationStatus: z.enum(['verified', 'revoked']).optional(),
  authorizedSignatory: z.string().trim().max(150).optional(),
  projectTitle: z.string().trim().max(255).optional(),
  skills: z.array(z.string().max(50)).optional()
});

// ── 11. Project Review Schema ──
export const projectReviewSchema = z.object({
  status: z.enum(['approved', 'rework_needed', 'under_review']),
  feedback: z.string().trim().min(2, 'Feedback required').max(2000),
  score: z.number().min(0).max(100).optional(),
  reviewerName: z.string().trim().max(100).optional().default('Senior Staff Engineer')
});

// ── 12. Enrolment Status Update Schema ──
export const enrolmentStatusSchema = z.object({
  status: z.enum(['paid', 'pending', 'failed'])
});

// ── Validation Middleware Factory ──
export const validateBody = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const errorDetails = result.error.issues.map((err: z.ZodIssue) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({
        success: false,
        error: 'Validation failed. Please verify submitted form fields.',
        details: errorDetails
      });
    }
    // Replace req.body with cleanly parsed & typed data
    req.body = result.data;
    next();
  };
};
