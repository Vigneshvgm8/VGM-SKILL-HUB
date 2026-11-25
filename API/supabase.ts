import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

// A valid key is preferred: service_role key has full database privileges for backend operations
const ACTIVE_KEY = SUPABASE_SERVICE_ROLE_KEY || SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_URL.startsWith('https://') && 
  SUPABASE_URL.includes('.supabase.co') &&
  ACTIVE_KEY && 
  ACTIVE_KEY.length > 20
);

let supabaseClient: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    supabaseClient = createClient(SUPABASE_URL, ACTIVE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    console.log(`[SUPABASE] Connected to live Supabase DB instance: ${SUPABASE_URL}`);
  } catch (err) {
    console.error('[SUPABASE] Failed to initialize Supabase client:', err);
  }
} else {
  console.log('[SUPABASE] Not configured. Using local persistent storage engine with auto-sync.');
}

export const getSupabaseClient = (): SupabaseClient | null => {
  return supabaseClient;
};

export const SupabaseService = {
  isAvailable(): boolean {
    return isSupabaseConfigured && supabaseClient !== null;
  },

  async ping(): Promise<{ connected: boolean; latencyMs?: number; error?: string }> {
    if (!this.isAvailable() || !supabaseClient) {
      return { connected: false, error: 'Supabase credentials not configured in environment.' };
    }

    const start = performance.now();
    try {
      const { data, error } = await supabaseClient
        .from('courses')
        .select('id')
        .limit(1);

      if (error) {
        return { connected: false, error: error.message };
      }
      return { connected: true, latencyMs: Math.round(performance.now() - start) };
    } catch (err: any) {
      return { connected: false, error: err?.message || 'Connection timeout' };
    }
  },

  // 1. Enrolments Operations
  async getEnrolments(): Promise<any[]> {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient
      .from('enrolments')
      .select('*, project_submissions(*)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SUPABASE ERROR] getEnrolments:', error.message);
      throw error;
    }
    return (data || []).map(formatEnrolmentFromDb);
  },

  async getEnrolmentById(id: string): Promise<any | null> {
    if (!supabaseClient) return null;
    const { data, error } = await supabaseClient
      .from('enrolments')
      .select('*, project_submissions(*)')
      .or(`id.eq.${id},razorpay_order_id.eq.${id}`)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[SUPABASE ERROR] getEnrolmentById:', error.message);
      return null;
    }
    return data ? formatEnrolmentFromDb(data) : null;
  },

  async createEnrolment(record: any): Promise<any> {
    if (!supabaseClient) throw new Error('Supabase client unavailable');
    const dbPayload = formatEnrolmentToDb(record);
    const { data, error } = await supabaseClient
      .from('enrolments')
      .insert(dbPayload)
      .select()
      .single();

    if (error) {
      console.error('[SUPABASE ERROR] createEnrolment:', error.message);
      throw error;
    }
    return formatEnrolmentFromDb(data);
  },

  async updateEnrolment(id: string, updates: any): Promise<any | null> {
    if (!supabaseClient) return null;
    const dbPayload: Record<string, any> = {
      updated_at: new Date().toISOString()
    };

    if (updates.payment) {
      if (updates.payment.status) dbPayload.payment_status = updates.payment.status;
      if (updates.payment.orderId) dbPayload.razorpay_order_id = updates.payment.orderId;
      if (updates.payment.paymentId) dbPayload.razorpay_payment_id = updates.payment.paymentId;
      if (updates.payment.signature) dbPayload.razorpay_signature = updates.payment.signature;
      if (updates.payment.paidAt) dbPayload.paid_at = updates.payment.paidAt;
      if (updates.payment.failedReason) dbPayload.failed_reason = updates.payment.failedReason;
    }

    if (updates.completedWeeks) {
      dbPayload.completed_weeks = updates.completedWeeks;
    }

    const { data, error } = await supabaseClient
      .from('enrolments')
      .update(dbPayload)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('[SUPABASE ERROR] updateEnrolment:', error.message);
      throw error;
    }
    return data ? formatEnrolmentFromDb(data) : null;
  },

  async deleteEnrolment(id: string): Promise<boolean> {
    if (!supabaseClient) return false;
    const clean = id.trim();
    try {
      await supabaseClient
        .from('project_submissions')
        .delete()
        .eq('enrolment_id', clean);
    } catch (e) {
      // ignore
    }

    const { error } = await supabaseClient
      .from('enrolments')
      .delete()
      .eq('id', clean);

    if (error) {
      console.error('[SUPABASE ERROR] deleteEnrolment:', error.message);
      return false;
    }
    return true;
  },

  // 2. Project Submissions
  async submitProject(enrolmentId: string, project: { githubUrl: string; liveUrl?: string; notes?: string }): Promise<any> {
    if (!supabaseClient) return null;
    const { data, error } = await supabaseClient
      .from('project_submissions')
      .insert({
        enrolment_id: enrolmentId,
        github_url: project.githubUrl,
        live_url: project.liveUrl || null,
        notes: project.notes || null,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('[SUPABASE ERROR] submitProject:', error.message);
      throw error;
    }
    return data;
  },

  // 3. Courses Operations
  async getCourses(): Promise<any[]> {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient
      .from('courses')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('[SUPABASE ERROR] getCourses:', error.message);
      return [];
    }
    return (data || []).map(formatCourseFromDb);
  },

  async getCourseBySlug(slug: string): Promise<any | null> {
    if (!supabaseClient) return null;
    const { data, error } = await supabaseClient
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('[SUPABASE ERROR] getCourseBySlug:', error.message);
      return null;
    }
    return data ? formatCourseFromDb(data) : null;
  },

  async upsertCourses(courses: any[]): Promise<void> {
    if (!supabaseClient || courses.length === 0) return;
    for (const c of courses) {
      const payload = formatCourseToDb(c);
      const { error } = await supabaseClient
        .from('courses')
        .upsert(payload, { onConflict: 'slug' });

      if (error) {
        console.error('[SUPABASE ERROR] upsertCourse for', c.slug || c.id, ':', error.message);
      }
    }
  },

  async deleteCourse(idOrSlug: string): Promise<boolean> {
    if (!supabaseClient) return false;
    const { error } = await supabaseClient
      .from('courses')
      .delete()
      .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`);

    if (error) {
      console.error('[SUPABASE ERROR] deleteCourse:', error.message);
      return false;
    }
    return true;
  },

  // 4. Coupons Operations
  async getCoupons(): Promise<any[]> {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SUPABASE ERROR] getCoupons:', error.message);
      return [];
    }
    return (data || []).map(formatCouponFromDb);
  },

  async getCouponByCode(code: string): Promise<any | null> {
    if (!supabaseClient) return null;
    const { data, error } = await supabaseClient
      .from('coupons')
      .select('*')
      .ilike('code', code.trim())
      .maybeSingle();

    if (error) {
      console.error('[SUPABASE ERROR] getCouponByCode:', error.message);
      return null;
    }
    return data ? formatCouponFromDb(data) : null;
  },

  async incrementCouponUsage(code: string): Promise<void> {
    if (!supabaseClient) return;
    const coupon = await this.getCouponByCode(code);
    if (coupon) {
      await supabaseClient
        .from('coupons')
        .update({ times_used: coupon.timesUsed + 1 })
        .eq('id', coupon.id);
    }
  },

  async deleteCoupon(idOrCode: string): Promise<boolean> {
    if (!supabaseClient) return false;
    const clean = idOrCode.trim();
    const { error } = await supabaseClient
      .from('coupons')
      .delete()
      .or(`id.eq.${clean},code.eq.${clean.toUpperCase()}`);

    if (error) {
      console.error('[SUPABASE ERROR] deleteCoupon:', error.message);
      return false;
    }
    return true;
  },

  async createCoupon(coupon: any): Promise<any> {
    if (!supabaseClient) return null;
    const { data, error } = await supabaseClient
      .from('coupons')
      .insert({
        id: coupon.id,
        code: coupon.code,
        discount_type: coupon.discountType,
        discount_value: coupon.discountValue,
        expires_at: coupon.expiresAt,
        usage_limit: coupon.usageLimit,
        times_used: coupon.timesUsed || 0,
        is_active: coupon.isActive !== false,
        description: coupon.description || ''
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('[SUPABASE ERROR] createCoupon:', error.message);
      return null;
    }
    return data ? formatCouponFromDb(data) : null;
  },

  async updateCoupon(id: string, updates: any): Promise<any | null> {
    if (!supabaseClient) return null;
    const payload: Record<string, any> = {};
    if (updates.code) payload.code = updates.code;
    if (updates.discountType) payload.discount_type = updates.discountType;
    if (updates.discountValue !== undefined) payload.discount_value = updates.discountValue;
    if (updates.expiresAt) payload.expires_at = updates.expiresAt;
    if (updates.usageLimit !== undefined) payload.usage_limit = updates.usageLimit;
    if (updates.timesUsed !== undefined) payload.times_used = updates.timesUsed;
    if (updates.isActive !== undefined) payload.is_active = updates.isActive;
    if (updates.description !== undefined) payload.description = updates.description;

    const { data, error } = await supabaseClient
      .from('coupons')
      .update(payload)
      .eq('id', id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('[SUPABASE ERROR] updateCoupon:', error.message);
      return null;
    }
    return data ? formatCouponFromDb(data) : null;
  },

  // 5. Webhooks Idempotency
  async isWebhookProcessed(id: string): Promise<boolean> {
    if (!supabaseClient) return false;
    const { data } = await supabaseClient
      .from('processed_webhooks')
      .select('id')
      .eq('id', id)
      .maybeSingle();
    return Boolean(data);
  },

  async recordWebhook(id: string, eventType: string): Promise<void> {
    if (!supabaseClient) return;
    await supabaseClient
      .from('processed_webhooks')
      .insert({ id, event_type: eventType, processed_at: new Date().toISOString() })
      .maybeSingle();
  },

  // 6. Certificates Management
  async getCertificates(): Promise<any[]> {
    if (!supabaseClient) return [];
    const { data, error } = await supabaseClient
      .from('certificates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[SUPABASE ERROR] getCertificates:', error.message);
      return [];
    }
    return (data || []).map(formatCertificateFromDb);
  },

  async getCertificateById(id: string): Promise<any | null> {
    if (!supabaseClient) return null;
    const clean = id.trim().toUpperCase();
    const { data, error } = await supabaseClient
      .from('certificates')
      .select('*')
      .or(`id.eq.${clean},enrolment_id.eq.${clean},student_email.ilike.${id.trim()}`)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('[SUPABASE ERROR] getCertificateById:', error.message);
      return null;
    }
    return data ? formatCertificateFromDb(data) : null;
  },

  async getCertificatesByEnrolment(enrolmentIdOrEmail: string): Promise<any[]> {
    if (!supabaseClient) return [];
    const clean = enrolmentIdOrEmail.trim().toUpperCase();
    const { data, error } = await supabaseClient
      .from('certificates')
      .select('*')
      .or(`id.eq.${clean},enrolment_id.eq.${clean},student_email.ilike.${enrolmentIdOrEmail.trim()}`);

    if (error) {
      console.error('[SUPABASE ERROR] getCertificatesByEnrolment:', error.message);
      return [];
    }
    return (data || []).map(formatCertificateFromDb);
  },

  async upsertCertificates(certificates: any[]): Promise<void> {
    if (!supabaseClient || certificates.length === 0) return;
    const rows = certificates.map(formatCertificateToDb);
    const { error } = await supabaseClient
      .from('certificates')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.error('[SUPABASE ERROR] upsertCertificates:', error.message);
      throw error;
    }
  },

  async deleteCertificate(id: string): Promise<boolean> {
    if (!supabaseClient) return false;
    const { error } = await supabaseClient
      .from('certificates')
      .delete()
      .eq('id', id.trim().toUpperCase());

    if (error) {
      console.error('[SUPABASE ERROR] deleteCertificate:', error.message);
      return false;
    }
    return true;
  }
};

function formatCertificateToDb(c: any): any {
  return {
    id: c.id,
    enrolment_id: c.enrolmentId || null,
    student_name: c.studentName,
    student_email: c.studentEmail,
    course_title: c.courseTitle,
    plan_level: c.planLevel,
    completion_date: c.completionDate,
    grade: c.grade || 'Distinction (Grade A+)',
    project_title: c.projectTitle,
    skills: c.skills || [],
    authorized_signatory: c.authorizedSignatory || 'Director of Academic Engineering, VGM Soft Tech',
    verification_status: c.verificationStatus || 'verified',
    created_at: c.createdAt || new Date().toISOString(),
    updated_at: c.updatedAt || new Date().toISOString()
  };
}

function formatCertificateFromDb(r: any): any {
  return {
    id: r.id,
    enrolmentId: r.enrolment_id,
    studentName: r.student_name,
    studentEmail: r.student_email,
    courseTitle: r.course_title,
    planLevel: r.plan_level,
    completionDate: r.completion_date,
    grade: r.grade,
    projectTitle: r.project_title,
    skills: r.skills || [],
    authorizedSignatory: r.authorized_signatory,
    verificationStatus: r.verification_status,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

// ── Helpers to map snake_case Postgres columns to camelCase TypeScript models ──
function formatEnrolmentToDb(e: any): any {
  return {
    id: e.id,
    course_id: e.courseId || null,
    course_title: e.courseTitle,
    plan_id: e.planId,
    plan_name: e.planName,
    batch_id: e.batchId,
    batch_label: e.batchLabel,
    student_full_name: e.student.fullName,
    student_email: e.student.email,
    student_mobile: e.student.mobile,
    student_dob: e.student.dob || '',
    student_city: e.student.city || '',
    student_college: e.student.college || '',
    student_degree_stream: e.student.degreeStream || '',
    student_year_of_study: e.student.yearOfStudy || '',
    student_languages: e.student.languages || [],
    student_referral_source: e.student.referralSource || 'Direct',
    assessment_score: e.assessment?.score || 0,
    assessment_total: e.assessment?.total || 5,
    assessment_answers: e.assessment?.answers || {},
    assessment_completed_at: e.assessment?.completedAt || null,
    base_amount: e.pricing.baseAmount,
    discount_amount: e.pricing.discountAmount || 0,
    coupon_code: e.pricing.couponCode || null,
    final_amount: e.pricing.finalAmount,
    currency: e.pricing.currency || 'INR',
    payment_status: e.payment.status,
    razorpay_order_id: e.payment.orderId,
    razorpay_payment_id: e.payment.paymentId || null,
    razorpay_signature: e.payment.signature || null,
    paid_at: e.payment.paidAt || null,
    failed_reason: e.payment.failedReason || null,
    completed_weeks: e.completedWeeks || [],
    created_at: e.createdAt || new Date().toISOString(),
    updated_at: e.updatedAt || new Date().toISOString()
  };
}

function formatEnrolmentFromDb(r: any): any {
  return {
    id: r.id,
    courseId: r.course_id,
    courseTitle: r.course_title,
    planId: r.plan_id,
    planName: r.plan_name,
    batchId: r.batch_id,
    batchLabel: r.batch_label,
    student: {
      fullName: r.student_full_name,
      email: r.student_email,
      mobile: r.student_mobile,
      dob: r.student_dob || '',
      city: r.student_city || '',
      college: r.student_college || '',
      degreeStream: r.student_degree_stream || '',
      yearOfStudy: r.student_year_of_study || '',
      languages: r.student_languages || [],
      referralSource: r.student_referral_source || 'Direct'
    },
    assessment: {
      score: r.assessment_score || 0,
      total: r.assessment_total || 5,
      answers: r.assessment_answers || {},
      completedAt: r.assessment_completed_at || r.created_at
    },
    pricing: {
      baseAmount: Number(r.base_amount),
      discountAmount: Number(r.discount_amount || 0),
      couponCode: r.coupon_code || null,
      finalAmount: Number(r.final_amount),
      currency: r.currency || 'INR'
    },
    payment: {
      status: r.payment_status,
      orderId: r.razorpay_order_id,
      paymentId: r.razorpay_payment_id || undefined,
      signature: r.razorpay_signature || undefined,
      paidAt: r.paid_at || undefined,
      failedReason: r.failed_reason || undefined
    },
    completedWeeks: r.completed_weeks || [],
    projectSubmission: r.project_submissions?.[0] ? {
      githubUrl: r.project_submissions[0].github_url,
      liveUrl: r.project_submissions[0].live_url,
      notes: r.project_submissions[0].notes,
      submittedAt: r.project_submissions[0].submitted_at,
      status: r.project_submissions[0].status,
      score: r.project_submissions[0].score,
      reviewerFeedback: r.project_submissions[0].reviewer_feedback,
      reviewedBy: r.project_submissions[0].reviewed_by,
      reviewedAt: r.project_submissions[0].reviewed_at
    } : undefined,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

function formatCourseToDb(c: any): any {
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    headline: c.headline,
    short_description: c.shortDescription,
    full_description: c.fullDescription || '',
    category: c.category,
    badge: c.badge,
    level: c.level,
    duration: c.duration,
    duration_weeks: c.durationWeeks || 12,
    mode: c.mode,
    rating: c.rating || 4.9,
    reviews_count: c.reviewsCount || 0,
    learners_enrolled: c.learnersEnrolled || 0,
    live_projects_count: c.liveProjectsCount || 3,
    next_batch: c.nextBatch,
    starting_fee: c.startingFee || 5999,
    starting_fee_formatted: c.startingFeeFormatted || `₹${(c.startingFee || 5999).toLocaleString('en-IN')}`,
    status: c.status || 'enrolling',
    featured: Boolean(c.featured),
    thumbnail: c.thumbnail || null,
    tools: c.tools || [],
    career_roles: c.careerRoles || [],
    average_package: c.averagePackage || '₹4.8 LPA',
    highest_package: c.highestPackage || '₹11.5 LPA',
    highlights: c.highlights || [],
    prerequisites: c.prerequisites || null,
    target_audience: c.targetAudience || [],
    curriculum: c.curriculum || [],
    plans: c.plans || {},
    faqs: c.faqs || []
  };
}

function formatCourseFromDb(r: any): any {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    headline: r.headline,
    shortDescription: r.short_description,
    fullDescription: r.full_description,
    category: r.category,
    badge: r.badge,
    level: r.level,
    duration: r.duration,
    durationWeeks: r.duration_weeks,
    mode: r.mode,
    rating: Number(r.rating),
    reviewsCount: r.reviews_count,
    learnersEnrolled: r.learners_enrolled,
    liveProjectsCount: r.live_projects_count,
    nextBatch: r.next_batch,
    startingFee: Number(r.starting_fee),
    startingFeeFormatted: r.starting_fee_formatted,
    status: r.status,
    featured: r.featured,
    thumbnail: r.thumbnail,
    tools: r.tools || [],
    careerRoles: r.career_roles || [],
    averagePackage: r.average_package,
    highestPackage: r.highest_package,
    highlights: r.highlights || [],
    prerequisites: r.prerequisites,
    targetAudience: r.target_audience || [],
    curriculum: r.curriculum || [],
    plans: r.plans || {},
    faqs: r.faqs || []
  };
}

function formatCouponFromDb(r: any): any {
  return {
    id: r.id,
    code: r.code,
    discountType: r.discount_type,
    discountValue: Number(r.discount_value),
    expiresAt: r.expires_at,
    usageLimit: r.usage_limit,
    timesUsed: r.times_used,
    isActive: r.is_active,
    description: r.description || ''
  };
}
