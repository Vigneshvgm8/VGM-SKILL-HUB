import fs from 'fs';
import path from 'path';
import { INITIAL_COURSES } from './coursesSeed.js';
import type { CourseItem } from './coursesSeed.js';
import { SupabaseService, isSupabaseConfigured } from './supabase.js';

export type { CourseItem };

export interface StudentDetails {
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

export interface AssessmentRecord {
  score: number;
  total: number;
  answers: Record<string, number>;
  completedAt: string;
}

export interface PricingBreakdown {
  baseAmount: number;
  discountAmount: number;
  couponCode: string | null;
  finalAmount: number;
  currency: 'INR';
}

export interface PaymentRecord {
  status: 'pending' | 'paid' | 'failed';
  orderId: string;
  paymentId?: string;
  signature?: string;
  paidAt?: string;
  failedReason?: string;
}

export interface ProjectSubmission {
  githubUrl: string;
  liveUrl?: string;
  notes?: string;
  submittedAt: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rework_needed';
  score?: number;
  reviewerFeedback?: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface Certificate {
  id: string; // e.g. VGM-2026-CERT-0104
  enrolmentId?: string;
  studentName: string;
  studentEmail: string;
  courseTitle: string;
  planLevel: string;
  completionDate: string;
  grade: string;
  projectTitle: string;
  skills: string[];
  authorizedSignatory: string;
  verificationStatus: 'verified' | 'revoked';
  createdAt: string;
  updatedAt: string;
}

export interface PlanItem {
  id: string; // 'explorer' | 'builder' | 'professional'
  name: string;
  duration: string;
  durationMonths: number;
  weeksTotal: number;
  fee: number;
  feeFormatted: string;
  recommended?: boolean;
  outcome: string;
  certificateType: string;
  liveProjectRole: string;
  features: string[];
}

export const INITIAL_PLANS: Record<string, PlanItem> = {
  explorer: {
    id: 'explorer',
    name: 'Explorer',
    duration: '1 Month',
    durationMonths: 1,
    weeksTotal: 4,
    fee: 5999,
    feeFormatted: '₹5,999',
    recommended: false,
    outcome: 'Understand the basics and build one working AI-powered mini app.',
    certificateType: 'Certificate of Participation',
    liveProjectRole: 'Shadow the team and complete small guided tasks such as UI fixes and screen changes.',
    features: [
      'App development fundamentals',
      'AI assistants for coding and learning',
      'Add an AI feature using an API',
      'Build one AI-powered mini app',
      'Shadow the team on a live project',
      'Certificate of participation',
      'Mentor guidance and doubt clearing',
      'Project templates and code access'
    ]
  },
  builder: {
    id: 'builder',
    name: 'Builder',
    duration: '2 Months',
    durationMonths: 2,
    weeksTotal: 8,
    fee: 9999,
    feeFormatted: '₹9,999',
    recommended: true,
    outcome: 'Build a complete app with a backend and smarter AI features.',
    certificateType: 'Certificate of Completion',
    liveProjectRole: 'Own assigned feature modules and work through Git branches with mentor code review.',
    features: [
      'Everything in Explorer',
      'Firebase backend and sign-in',
      'Speech and image AI features',
      'AI-assisted testing and debugging',
      'Own feature modules on a live project',
      'Certificate of completion',
      'Mid-term review & individual code review',
      'Working capstone project on GitHub'
    ]
  },
  professional: {
    id: 'professional',
    name: 'Professional',
    duration: '3 Months',
    durationMonths: 3,
    weeksTotal: 12,
    fee: 14999,
    feeFormatted: '₹14,999',
    recommended: false,
    outcome: 'Become job-ready with a published app, live feature ownership, and a strong portfolio.',
    certificateType: 'Certificate of Completion + Experience Letter',
    liveProjectRole: 'Take full ownership of a feature from planning to release, with regular reviews. An experience letter is issued on completion.',
    features: [
      'Everything in Builder',
      'App architecture and performance',
      'Secure, responsible use of AI & API costs',
      'Publish on Google Play Store',
      'Full ownership of a live feature',
      'Resume, portfolio & mock technical interviews',
      'Official Experience Letter on completion',
      'Priority recommendation for openings at VGM Soft Tech'
    ]
  }
};

export interface Enrolment {
  id: string; // e.g. VGM-2026-0001 or VGM-2026-0001-02
  enrollmentNumber?: string; // unique master enrollment number for the student e.g. VGM-2026-0001
  courseId?: string;
  courseTitle?: string;
  planId: string;
  planName: string;
  batchId: string;
  batchLabel: string;
  student: StudentDetails;
  assessment: AssessmentRecord;
  pricing: PricingBreakdown;
  payment: PaymentRecord;
  completedWeeks?: number[];
  projectSubmission?: ProjectSubmission;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  expiresAt: string;
  usageLimit: number;
  timesUsed: number;
  isActive: boolean;
  description: string;
}

interface DatabaseSchema {
  counter: number;
  courses: CourseItem[];
  enrolments: Enrolment[];
  coupons: Coupon[];
  certificates: Certificate[];
  plans?: Record<string, PlanItem>;
  processedWebhooks: { id: string; processedAt: string; eventType: string }[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Default initial certificates
export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'VGM-2026-CERT-0104',
    enrolmentId: 'VGM-2026-0001',
    studentName: 'Kavitha Ramasamy',
    studentEmail: 'kavitha.r@psgtech.ac.in',
    courseTitle: 'AI-Powered Mobile App Development Internship',
    planLevel: 'Builder Plan (8 Weeks)',
    completionDate: '24th October 2026',
    grade: 'Distinction (Grade A+)',
    projectTitle: 'AI Smart Voice Assistant with Gemini API & Flutter',
    skills: ['Flutter', 'Dart', 'Gemini API', 'Firebase', 'State Management', 'Git Pull Requests'],
    authorizedSignatory: 'Director of Academic Engineering, VGM Soft Tech',
    verificationStatus: 'verified',
    createdAt: '2026-10-24T12:00:00.000Z',
    updatedAt: '2026-10-24T12:00:00.000Z'
  },
  {
    id: 'VGM-2026-CERT-0105',
    enrolmentId: 'VGM-2026-0002',
    studentName: 'Praveen Kumar',
    studentEmail: 'praveen.k@cit.edu.in',
    courseTitle: 'Full-Stack Web Development & AI Engineering',
    planLevel: 'Professional Career Track (16 Weeks)',
    completionDate: '28th October 2026',
    grade: 'Distinction (Grade A+)',
    projectTitle: 'AI-Powered Collaborative Team Workspace with Next.js & PostgreSQL',
    skills: ['Next.js 15', 'React 19', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'LangChain'],
    authorizedSignatory: 'Director of Academic Engineering, VGM Soft Tech',
    verificationStatus: 'verified',
    createdAt: '2026-10-28T12:00:00.000Z',
    updatedAt: '2026-10-28T12:00:00.000Z'
  },
  {
    id: 'VGM-2026-CERT-0106',
    enrolmentId: 'VGM-2026-0003',
    studentName: 'Siddharth Raman',
    studentEmail: 'siddharth.r@gct.ac.in',
    courseTitle: 'Cloud Engineering, DevOps & Kubernetes',
    planLevel: 'Professional Plan (12 Weeks)',
    completionDate: '30th October 2026',
    grade: 'First Class with Honors',
    projectTitle: 'Zero-Downtime Multi-Region Kubernetes EKS Cluster with Prometheus',
    skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions', 'Grafana'],
    authorizedSignatory: 'Director of Academic Engineering, VGM Soft Tech',
    verificationStatus: 'verified',
    createdAt: '2026-10-30T12:00:00.000Z',
    updatedAt: '2026-10-30T12:00:00.000Z'
  },
  {
    id: 'VGM-2026-CERT-0107',
    enrolmentId: 'VGM-2026-0005',
    studentName: 'mathankumar',
    studentEmail: 'mathanvgm8@gmail.com',
    courseTitle: 'AI-Powered Mobile App Development Internship',
    planLevel: 'Builder Plan (8 Weeks)',
    completionDate: '15th November 2026',
    grade: 'Distinction (Grade A+)',
    projectTitle: 'AI Smart Voice Assistant with Gemini API & Flutter',
    skills: ['Flutter', 'Dart', 'Gemini API', 'Firebase', 'State Management', 'Git Pull Requests'],
    authorizedSignatory: 'Director of Academic Engineering, VGM Soft Tech',
    verificationStatus: 'verified',
    createdAt: '2026-11-15T12:00:00.000Z',
    updatedAt: '2026-11-15T12:00:00.000Z'
  }
];

// Default initial coupons
const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'c-earlybird',
    code: 'EARLYBIRD',
    discountType: 'percentage',
    discountValue: 10,
    expiresAt: '2026-12-31T23:59:59.000Z',
    usageLimit: 100,
    timesUsed: 14,
    isActive: true,
    description: 'Early bird registration 10% off'
  },
  {
    id: 'c-college',
    code: 'VGMCOLLEGE',
    discountType: 'flat',
    discountValue: 1500,
    expiresAt: '2026-12-31T23:59:59.000Z',
    usageLimit: 100,
    timesUsed: 8,
    isActive: true,
    description: 'College partnership special discount of ₹1,500'
  },
  {
    id: 'c-innovate',
    code: 'INNOVATE2026',
    discountType: 'percentage',
    discountValue: 15,
    expiresAt: '2026-12-31T23:59:59.000Z',
    usageLimit: 50,
    timesUsed: 6,
    isActive: true,
    description: 'Special Innovation Grant 15% off'
  }
];

function initDB(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (fs.existsSync(DB_FILE)) {
    try {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      let changed = false;
      if (!parsed.courses || !Array.isArray(parsed.courses) || parsed.courses.length === 0) {
        parsed.courses = INITIAL_COURSES;
        changed = true;
      }
      if (!parsed.coupons || !Array.isArray(parsed.coupons) || parsed.coupons.length === 0) {
        parsed.coupons = INITIAL_COUPONS;
        changed = true;
      }
      if (!parsed.certificates || !Array.isArray(parsed.certificates) || parsed.certificates.length === 0) {
        parsed.certificates = INITIAL_CERTIFICATES;
        changed = true;
      }
      if (!parsed.plans || Object.keys(parsed.plans).length === 0) {
        parsed.plans = INITIAL_PLANS;
        changed = true;
      }
      if (changed) {
        fs.writeFileSync(DB_FILE, JSON.stringify(parsed, null, 2), 'utf-8');
      }
      return parsed;
    } catch (e) {
      console.error('Error reading db.json, reinitializing:', e);
    }
  }

  const defaultData: DatabaseSchema = {
    counter: 1,
    courses: INITIAL_COURSES,
    certificates: INITIAL_CERTIFICATES,
    plans: INITIAL_PLANS,
    enrolments: [
      {
        id: 'VGM-2026-0001',
        courseId: 'ai-mobile-app',
        courseTitle: 'AI-Powered Mobile App Development Internship',
        planId: 'builder',
        planName: 'Builder (2 Months)',
        batchId: 'nov-morning',
        batchLabel: 'November 2026 Batch — Morning (9:00 AM – 12:30 PM IST)',
        student: {
          fullName: 'Kavitha Ramasamy',
          email: 'kavitha.r@psgtech.ac.in',
          mobile: '9876543210',
          dob: '2003-08-14',
          city: 'Coimbatore',
          college: 'PSG College of Technology',
          degreeStream: 'B.E Computer Science and Engineering',
          yearOfStudy: '3rd Year',
          languages: ['Dart', 'JavaScript', 'Python'],
          referralSource: 'College Circular'
        },
        assessment: {
          score: 5,
          total: 5,
          answers: { '1': 1, '2': 1, '3': 2, '4': 0, '5': 1 },
          completedAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        pricing: {
          baseAmount: 9999,
          discountAmount: 1000,
          couponCode: 'EARLYBIRD',
          finalAmount: 8999,
          currency: 'INR'
        },
        payment: {
          status: 'paid',
          orderId: 'order_test_demo_001',
          paymentId: 'pay_test_demo_001',
          paidAt: new Date(Date.now() - 86400000 * 2).toISOString()
        },
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        updatedAt: new Date(Date.now() - 86400000 * 2).toISOString()
      }
    ],
    coupons: INITIAL_COUPONS,
    processedWebhooks: []
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  return defaultData;
}

let db = initDB();

function saveDB() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save db.json:', err);
  }
}

// Initial sync with live Supabase if available
if (isSupabaseConfigured) {
  (async () => {
    try {
      const ping = await SupabaseService.ping();
      if (ping.connected) {
        console.log(`[SUPABASE] Verified connection in ${ping.latencyMs}ms. Syncing local cache with remote PostgreSQL...`);
        const remoteCourses = await SupabaseService.getCourses();
        if (remoteCourses.length === 0) {
          console.log('[SUPABASE] Seeding initial courses into Supabase...');
          await SupabaseService.upsertCourses(INITIAL_COURSES);
        } else {
          db.courses = remoteCourses;
        }

        const remoteEnrolments = await SupabaseService.getEnrolments();
        if (remoteEnrolments.length > 0) {
          db.enrolments = remoteEnrolments;
        }

        const remoteCoupons = await SupabaseService.getCoupons();
        if (remoteCoupons.length > 0) {
          db.coupons = remoteCoupons;
        }

        const remoteCertificates = await SupabaseService.getCertificates();
        if (remoteCertificates.length > 0) {
          db.certificates = remoteCertificates;
        }
        saveDB();
      } else {
        console.warn(`[SUPABASE WARNING] Ping check failed: ${ping.error}. Continuing with persistent local storage.`);
      }
    } catch (err) {
      console.error('[SUPABASE SYNC ERROR]', err);
    }
  })();
}

function cleanString(val?: string): string {
  return (val || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function cleanDigits(val?: string): string {
  return (val || '').replace(/\D/g, '');
}

export function findExistingStudentEnrollmentNumber(fullName: string, email: string, mobile: string): string | null {
  const normName = cleanString(fullName);
  const normEmail = cleanString(email);
  const normMobile = cleanDigits(mobile);

  for (const e of db.enrolments) {
    const eEmail = cleanString(e.student?.email);
    const eMobile = cleanDigits(e.student?.mobile);
    const eName = cleanString(e.student?.fullName);

    const emailMatches = Boolean(normEmail && eEmail && normEmail === eEmail);
    const mobileMatches = Boolean(normMobile && eMobile && (normMobile === eMobile || normMobile.endsWith(eMobile) || eMobile.endsWith(normMobile)));
    const nameMatches = Boolean(normName && eName && (normName === eName || normName.includes(eName) || eName.includes(normName)));

    // User requirement: if same student registers another course using same name, mobile number, email -> reuse same enrollment number
    if (emailMatches && mobileMatches && nameMatches) {
      return e.enrollmentNumber || e.id.split('-').slice(0, 3).join('-');
    }
    // Also if email and mobile match
    if (emailMatches && mobileMatches) {
      return e.enrollmentNumber || e.id.split('-').slice(0, 3).join('-');
    }
    // If name and email match
    if (nameMatches && emailMatches) {
      return e.enrollmentNumber || e.id.split('-').slice(0, 3).join('-');
    }
  }

  return null;
}

export function getNextEnrollmentNumber(): string {
  let maxSeq = db.counter || 0;
  for (const e of db.enrolments) {
    const m = (e.enrollmentNumber || e.id).match(/VGM-2026-(\d+)/i);
    if (m) {
      const n = parseInt(m[1], 10);
      if (!isNaN(n) && n > maxSeq) maxSeq = n;
    }
  }
  for (const c of (db.certificates || [])) {
    if (c.enrolmentId) {
      const m = c.enrolmentId.match(/VGM-2026-(\d+)/i);
      if (m) {
        const n = parseInt(m[1], 10);
        if (!isNaN(n) && n > maxSeq) maxSeq = n;
      }
    }
  }
  const nextSeq = Math.max(maxSeq + 1, 6);
  db.counter = nextSeq;
  return `VGM-2026-${String(nextSeq).padStart(4, '0')}`;
}

export const DB = {
  getEnrolments(): Enrolment[] {
    return [...db.enrolments].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getEnrolmentById(id: string): Enrolment | undefined {
    const clean = id.trim().toUpperCase();
    return db.enrolments.find(e => 
      e.id.toUpperCase() === clean || 
      (e.enrollmentNumber && e.enrollmentNumber.toUpperCase() === clean) ||
      e.payment.orderId === id
    );
  },

  getEnrolmentsByStudent(query: string): Enrolment[] {
    const clean = query.trim().toUpperCase();
    const cleanLower = query.trim().toLowerCase();
    const cleanMobile = query.replace(/\D/g, '');

    return db.enrolments.filter(e => {
      const idMatch = e.id.toUpperCase() === clean || e.id.toUpperCase().startsWith(clean + '-');
      const enrMatch = Boolean(e.enrollmentNumber && e.enrollmentNumber.toUpperCase() === clean);
      const emailMatch = e.student.email.toLowerCase() === cleanLower;
      const mobileMatch = cleanMobile.length >= 7 && e.student.mobile.replace(/\D/g, '').includes(cleanMobile);
      return idMatch || enrMatch || emailMatch || mobileMatch;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  },

  createEnrolment(data: Omit<Enrolment, 'id' | 'createdAt' | 'updatedAt'> & { enrollmentNumber?: string }): Enrolment {
    // 1. Check if same student already registered with same name, mobile, email
    let enrollmentNumber = data.enrollmentNumber;
    if (!enrollmentNumber) {
      enrollmentNumber = findExistingStudentEnrollmentNumber(
        data.student.fullName,
        data.student.email,
        data.student.mobile
      ) || undefined;
    }

    let id: string;
    if (enrollmentNumber) {
      // Reusing existing student enrollment number!
      const existingForStudent = db.enrolments.filter(e => 
        e.enrollmentNumber === enrollmentNumber || 
        e.id === enrollmentNumber || 
        e.id.startsWith(enrollmentNumber + '-')
      );

      if (existingForStudent.length === 0) {
        id = enrollmentNumber;
      } else {
        // Additional course for same student
        const suffix = String(existingForStudent.length + 1).padStart(2, '0');
        id = `${enrollmentNumber}-${suffix}`;
      }
    } else {
      // New student - generate brand new unique enrollment number
      enrollmentNumber = getNextEnrollmentNumber();
      id = enrollmentNumber;
    }

    const now = new Date().toISOString();
    const newEnrolment: Enrolment = {
      ...data,
      id,
      enrollmentNumber,
      createdAt: now,
      updatedAt: now
    };

    db.enrolments.push(newEnrolment);
    saveDB();

    // Async sync to Supabase
    if (SupabaseService.isAvailable()) {
      SupabaseService.createEnrolment(newEnrolment).catch(e =>
        console.error('[SUPABASE ASYNC ERROR] createEnrolment sync:', e?.message || e)
      );
    }

    return newEnrolment;
  },

  updateEnrolment(id: string, updates: Partial<Enrolment>): Enrolment | null {
    const idx = db.enrolments.findIndex(e => e.id === id || e.payment.orderId === id);
    if (idx === -1) return null;

    db.enrolments[idx] = {
      ...db.enrolments[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    saveDB();

    // Async sync to Supabase
    if (SupabaseService.isAvailable()) {
      SupabaseService.updateEnrolment(db.enrolments[idx].id, updates).catch(e =>
        console.error('[SUPABASE ASYNC ERROR] updateEnrolment sync:', e?.message || e)
      );
    }

    return db.enrolments[idx];
  },

  getCoupons(): Coupon[] {
    return [...db.coupons];
  },

  getCouponByCode(code: string): Coupon | undefined {
    const normalized = code.trim().toUpperCase();
    return db.coupons.find(c => c.code.toUpperCase() === normalized);
  },

  createCoupon(couponData: Omit<Coupon, 'id' | 'timesUsed'>): Coupon {
    const id = `c-${Date.now()}`;
    const newCoupon: Coupon = {
      ...couponData,
      id,
      code: couponData.code.trim().toUpperCase(),
      timesUsed: 0
    };
    db.coupons.push(newCoupon);
    saveDB();
    return newCoupon;
  },

  updateCoupon(id: string, updates: Partial<Coupon>): Coupon | null {
    const idx = db.coupons.findIndex(c => c.id === id || c.code.toUpperCase() === id.toUpperCase());
    if (idx === -1) return null;

    db.coupons[idx] = {
      ...db.coupons[idx],
      ...updates
    };
    saveDB();
    return db.coupons[idx];
  },

  deleteCoupon(id: string): boolean {
    const initialLen = db.coupons.length;
    db.coupons = db.coupons.filter(c => c.id !== id && c.code.toUpperCase() !== id.toUpperCase());
    if (db.coupons.length !== initialLen) {
      saveDB();
      return true;
    }
    return false;
  },

  isWebhookProcessed(eventId: string): boolean {
    return db.processedWebhooks.some(w => w.id === eventId);
  },

  recordWebhook(eventId: string, eventType: string): void {
    db.processedWebhooks.push({
      id: eventId,
      eventType,
      processedAt: new Date().toISOString()
    });
    // keep last 500
    if (db.processedWebhooks.length > 500) {
      db.processedWebhooks = db.processedWebhooks.slice(-500);
    }
    saveDB();

    if (SupabaseService.isAvailable()) {
      SupabaseService.recordWebhook(eventId, eventType).catch(e =>
        console.error('[SUPABASE ASYNC ERROR] recordWebhook sync:', e?.message || e)
      );
    }
  },

  // --- Dynamic Course Management ---
  getCourses(): CourseItem[] {
    return [...(db.courses || [])];
  },

  getCourseBySlug(slugOrId: string): CourseItem | undefined {
    const q = (slugOrId || '').trim().toLowerCase();
    return (db.courses || []).find(c => c.slug.toLowerCase() === q || c.id.toLowerCase() === q);
  },

  getCourseById(id: string): CourseItem | undefined {
    return this.getCourseBySlug(id);
  },

  createCourse(courseData: Partial<CourseItem>): CourseItem {
    const id = courseData.id || `course-${Date.now()}`;
    const slug = courseData.slug || id;
    const newCourse: CourseItem = {
      id,
      slug,
      title: courseData.title || 'Untitled Internship Course',
      headline: courseData.headline || '',
      shortDescription: courseData.shortDescription || '',
      fullDescription: courseData.fullDescription || '',
      category: courseData.category || 'General',
      badge: courseData.badge || 'New Cohort',
      level: courseData.level || 'Beginner to Advanced',
      duration: courseData.duration || '12 Weeks',
      durationWeeks: courseData.durationWeeks || 12,
      mode: courseData.mode || 'Hybrid (Coimbatore Campus + Online Live)',
      rating: courseData.rating || 4.9,
      reviewsCount: courseData.reviewsCount || 1,
      learnersEnrolled: courseData.learnersEnrolled || 1,
      liveProjectsCount: courseData.liveProjectsCount || 3,
      nextBatch: courseData.nextBatch || 'Coming Soon',
      startingFee: courseData.startingFee || 5999,
      startingFeeFormatted: courseData.startingFeeFormatted || `₹${(courseData.startingFee || 5999).toLocaleString('en-IN')}`,
      status: courseData.status || 'enrolling',
      featured: courseData.featured ?? true,
      tools: Array.isArray(courseData.tools) ? courseData.tools : [],
      careerRoles: Array.isArray(courseData.careerRoles) ? courseData.careerRoles : [],
      averagePackage: courseData.averagePackage || '₹4.5 - ₹8 LPA',
      highestPackage: courseData.highestPackage || '₹12 LPA',
      highlights: Array.isArray(courseData.highlights) ? courseData.highlights : [],
      prerequisites: courseData.prerequisites || 'Basic programming knowledge',
      targetAudience: Array.isArray(courseData.targetAudience) ? courseData.targetAudience : [],
      curriculum: Array.isArray(courseData.curriculum) ? courseData.curriculum : [],
      plans: courseData.plans || {
        explorer: {
          id: 'explorer',
          name: 'Explorer (1 Month)',
          duration: '1 Month',
          durationMonths: 1,
          weeksTotal: 4,
          fee: 5999,
          feeFormatted: '₹5,999',
          outcome: 'Understand the foundations and build a mini project.',
          certificateType: 'Certificate of Participation',
          liveProjectRole: 'Guided tasks under senior mentor review.',
          features: ['Foundation training', '1 mini project', 'Certificate']
        }
      },
      faqs: Array.isArray(courseData.faqs) ? courseData.faqs : []
    };

    if (!db.courses) db.courses = [];
    db.courses.push(newCourse);
    saveDB();

    if (SupabaseService.isAvailable()) {
      SupabaseService.upsertCourses([newCourse]).catch(e =>
        console.error('[SUPABASE ASYNC ERROR] upsertCourses:', e?.message || e)
      );
    }

    return newCourse;
  },

  updateCourse(idOrSlug: string, updates: Partial<CourseItem>): CourseItem | null {
    if (!db.courses) db.courses = [];
    const q = idOrSlug.trim().toLowerCase();
    const idx = db.courses.findIndex(c => c.id.toLowerCase() === q || c.slug.toLowerCase() === q);
    if (idx === -1) return null;

    db.courses[idx] = {
      ...db.courses[idx],
      ...updates
    };
    saveDB();

    if (SupabaseService.isAvailable()) {
      SupabaseService.upsertCourses([db.courses[idx]]).catch(e =>
        console.error('[SUPABASE ASYNC ERROR] upsertCourses:', e?.message || e)
      );
    }

    return db.courses[idx];
  },

  deleteCourse(idOrSlug: string): boolean {
    if (!db.courses) return false;
    const q = idOrSlug.trim().toLowerCase();
    const initLen = db.courses.length;
    db.courses = db.courses.filter(c => c.id.toLowerCase() !== q && c.slug.toLowerCase() !== q);
    if (db.courses.length !== initLen) {
      saveDB();
      return true;
    }
    return false;
  },

  // --- Dynamic Plan Management ---
  getPlans(): Record<string, PlanItem> {
    if (!db.plans || Object.keys(db.plans).length === 0) {
      db.plans = { ...INITIAL_PLANS };
      saveDB();
    }
    return db.plans;
  },

  getPlanById(id: string): PlanItem | undefined {
    const plans = this.getPlans();
    return plans[id.toLowerCase().trim()];
  },

  updatePlan(id: string, updates: Partial<PlanItem>): PlanItem | null {
    const cleanId = id.toLowerCase().trim();
    if (!db.plans) db.plans = { ...INITIAL_PLANS };
    if (!db.plans[cleanId]) return null;

    const existing = db.plans[cleanId];
    const newFee = typeof updates.fee === 'number' && updates.fee >= 0 ? updates.fee : existing.fee;
    const feeFormatted = updates.feeFormatted || `₹${newFee.toLocaleString('en-IN')}`;

    db.plans[cleanId] = {
      ...existing,
      ...updates,
      id: cleanId,
      fee: newFee,
      feeFormatted
    };

    // Also synchronize to the flagship ai-mobile-app course in db.courses
    if (db.courses) {
      const mobileCourse = db.courses.find(c => c.id === 'ai-mobile-app');
      if (mobileCourse) {
        if (!mobileCourse.plans) mobileCourse.plans = {};
        mobileCourse.plans[cleanId] = {
          ...mobileCourse.plans[cleanId],
          ...db.plans[cleanId]
        };
        if (cleanId === 'explorer' && typeof updates.fee === 'number') {
          mobileCourse.startingFee = updates.fee;
          mobileCourse.startingFeeFormatted = feeFormatted;
        }
        if (SupabaseService.isAvailable()) {
          SupabaseService.upsertCourses([mobileCourse]).catch(e =>
            console.error('[SUPABASE ASYNC ERROR] sync plan to course:', e?.message || e)
          );
        }
      }
    }

    saveDB();
    return db.plans[cleanId];
  },

  // --- Student Portal Methods ---
  getStudentByAuth(enrolmentIdOrQuery: string, credential?: string): Enrolment | null {
    const cleanId = (enrolmentIdOrQuery || '').trim().toUpperCase();
    const cred = (credential || '').trim().toLowerCase();
    const cleanMobile = (credential || '').replace(/\D/g, '');

    const candidates = db.enrolments.filter(e => {
      const idMatch = e.id.toUpperCase() === cleanId || e.id.toUpperCase().startsWith(cleanId + '-');
      const enrMatch = Boolean(e.enrollmentNumber && e.enrollmentNumber.toUpperCase() === cleanId);
      const emailMatch = e.student.email.toLowerCase() === cleanId.toLowerCase();
      const mobileMatch = cleanId.replace(/\D/g, '').length >= 7 && e.student.mobile.replace(/\D/g, '') === cleanId.replace(/\D/g, '');
      return idMatch || enrMatch || emailMatch || mobileMatch;
    });

    if (candidates.length === 0) return null;

    if (!credential || credential.trim().length === 0) {
      return candidates[0];
    }

    const matched = candidates.find(e => {
      const emailMatch = e.student.email.toLowerCase() === cred;
      const mobileMatch = cleanMobile.length >= 7 && e.student.mobile.replace(/\D/g, '').includes(cleanMobile);
      return emailMatch || mobileMatch;
    });

    return matched || candidates[0];
  },

  getStudentPortalData(query: string, credential?: string) {
    const enrolments = this.getEnrolmentsByStudent(query);
    if (enrolments.length === 0) return null;

    if (credential && credential.trim().length > 0) {
      const cred = credential.trim().toLowerCase();
      const credMobile = credential.replace(/\D/g, '');
      const hasMatch = enrolments.some(e => 
        e.student.email.toLowerCase() === cred || 
        (credMobile.length >= 7 && e.student.mobile.replace(/\D/g, '').includes(credMobile))
      );
      if (!hasMatch) return null;
    }

    const primary = enrolments[0];
    const enrollmentNumber = primary.enrollmentNumber || primary.id.split('-').slice(0, 3).join('-');
    const certificates = this.getCertificatesByEnrolment(enrollmentNumber);

    return {
      enrollmentNumber,
      student: primary.student,
      enrolments,
      certificates,
      primaryCertificate: certificates[0] || null
    };
  },

  updateStudentProgress(enrolmentId: string, completedWeeks: number[]): Enrolment | null {
    const cleanId = enrolmentId.trim().toUpperCase();
    const idx = db.enrolments.findIndex(e => e.id.toUpperCase() === cleanId || (e.enrollmentNumber && e.enrollmentNumber.toUpperCase() === cleanId));
    if (idx === -1) return null;

    db.enrolments[idx] = {
      ...db.enrolments[idx],
      completedWeeks,
      updatedAt: new Date().toISOString()
    };
    saveDB();

    if (SupabaseService.isAvailable()) {
      SupabaseService.updateEnrolment(db.enrolments[idx].id, { completedWeeks }).catch(e =>
        console.error('[SUPABASE ASYNC ERROR] updateStudentProgress:', e?.message || e)
      );
    }

    return db.enrolments[idx];
  },

  submitStudentProject(enrolmentId: string, submission: { githubUrl: string; liveUrl?: string; notes?: string }): Enrolment | null {
    const cleanId = enrolmentId.trim().toUpperCase();
    const idx = db.enrolments.findIndex(e => e.id.toUpperCase() === cleanId || (e.enrollmentNumber && e.enrollmentNumber.toUpperCase() === cleanId));
    if (idx === -1) return null;

    db.enrolments[idx] = {
      ...db.enrolments[idx],
      projectSubmission: {
        githubUrl: submission.githubUrl,
        liveUrl: submission.liveUrl || '',
        notes: submission.notes || '',
        submittedAt: new Date().toISOString(),
        status: 'submitted'
      },
      updatedAt: new Date().toISOString()
    };
    saveDB();

    if (SupabaseService.isAvailable()) {
      SupabaseService.submitProject(db.enrolments[idx].id, submission).catch(e =>
        console.error('[SUPABASE ASYNC ERROR] submitProject:', e?.message || e)
      );
    }

    return db.enrolments[idx];
  },

  // --- Certificate Management ---
  getCertificates(): Certificate[] {
    return [...(db.certificates || [])].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  getCertificateById(query: string): Certificate | null {
    if (!db.certificates || db.certificates.length === 0) return null;
    const clean = query.trim().toUpperCase();
    const cleanLower = query.trim().toLowerCase();

    // 1. Exact ID
    const exact = db.certificates.find(c => c.id.toUpperCase() === clean);
    if (exact) return exact;

    // 2. By enrolment ID / number
    const byEnr = db.certificates.find(c => 
      c.enrolmentId && (c.enrolmentId.toUpperCase() === clean || c.enrolmentId.toUpperCase().startsWith(clean))
    );
    if (byEnr) return byEnr;

    // 3. By student email
    const byEmail = db.certificates.find(c => c.studentEmail.toLowerCase() === cleanLower);
    if (byEmail) return byEmail;

    return null;
  },

  getCertificatesByEnrolment(query: string): Certificate[] {
    if (!db.certificates || db.certificates.length === 0) return [];
    const clean = query.trim().toUpperCase();
    const cleanLower = query.trim().toLowerCase();

    return db.certificates.filter(c => {
      const idMatch = c.id.toUpperCase() === clean;
      const enrMatch = c.enrolmentId && (c.enrolmentId.toUpperCase() === clean || c.enrolmentId.toUpperCase().startsWith(clean));
      const emailMatch = c.studentEmail.toLowerCase() === cleanLower;
      return idMatch || enrMatch || emailMatch;
    });
  },

  createCertificate(data: Omit<Certificate, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Certificate {
    if (!db.certificates) db.certificates = [];
    const seq = String(db.certificates.length + 101).padStart(4, '0');
    const id = data.id && data.id.trim().length > 0 ? data.id.trim().toUpperCase() : `VGM-2026-CERT-${seq}`;
    const now = new Date().toISOString();

    const newCert: Certificate = {
      ...data,
      id,
      skills: Array.isArray(data.skills) ? data.skills : [],
      verificationStatus: data.verificationStatus || 'verified',
      authorizedSignatory: data.authorizedSignatory || 'Director of Academic Engineering, VGM Soft Tech',
      createdAt: now,
      updatedAt: now
    };

    db.certificates.push(newCert);
    saveDB();
    return newCert;
  },

  updateCertificate(id: string, updates: Partial<Certificate>): Certificate | null {
    if (!db.certificates) return null;
    const clean = id.trim().toUpperCase();
    const idx = db.certificates.findIndex(c => c.id.toUpperCase() === clean);
    if (idx === -1) return null;

    db.certificates[idx] = {
      ...db.certificates[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    saveDB();
    return db.certificates[idx];
  },

  deleteCertificate(id: string): boolean {
    if (!db.certificates) return false;
    const clean = id.trim().toUpperCase();
    const initLen = db.certificates.length;
    db.certificates = db.certificates.filter(c => c.id.toUpperCase() !== clean);
    if (db.certificates.length !== initLen) {
      saveDB();
      return true;
    }
    return false;
  },

  // --- Project Review & Evaluation ---
  getAllProjectSubmissions() {
    return db.enrolments
      .filter(e => !!e.projectSubmission)
      .map(e => ({
        enrolmentId: e.id,
        courseId: e.courseId,
        courseTitle: e.courseTitle,
        planId: e.planId,
        planName: e.planName,
        student: e.student,
        submission: e.projectSubmission!,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt
      }))
      .sort((a, b) => new Date(b.submission.submittedAt).getTime() - new Date(a.submission.submittedAt).getTime());
  },

  reviewStudentProject(
    enrolmentId: string,
    review: {
      status: 'approved' | 'rework_needed' | 'under_review';
      feedback: string;
      score?: number;
      reviewerName?: string;
    }
  ): Enrolment | null {
    const cleanId = enrolmentId.trim().toUpperCase();
    const idx = db.enrolments.findIndex(e => e.id.toUpperCase() === cleanId);
    if (idx === -1 || !db.enrolments[idx].projectSubmission) return null;

    const currentSub = db.enrolments[idx].projectSubmission!;
    db.enrolments[idx].projectSubmission = {
      ...currentSub,
      status: review.status,
      reviewerFeedback: review.feedback,
      score: review.score !== undefined ? review.score : currentSub.score,
      reviewedBy: review.reviewerName || 'Senior Academic Reviewer',
      reviewedAt: new Date().toISOString()
    };
    db.enrolments[idx].updatedAt = new Date().toISOString();
    saveDB();
    return db.enrolments[idx];
  },

  // --- Admin Enrolment Payment Status ---
  updateEnrolmentPaymentStatus(id: string, status: 'paid' | 'pending' | 'failed'): Enrolment | null {
    const cleanId = id.trim().toUpperCase();
    const idx = db.enrolments.findIndex(e => e.id.toUpperCase() === cleanId || e.payment.orderId === id);
    if (idx === -1) return null;

    db.enrolments[idx].payment.status = status;
    if (status === 'paid' && !db.enrolments[idx].payment.paidAt) {
      db.enrolments[idx].payment.paidAt = new Date().toISOString();
    }
    db.enrolments[idx].updatedAt = new Date().toISOString();
    saveDB();
    return db.enrolments[idx];
  }
};
