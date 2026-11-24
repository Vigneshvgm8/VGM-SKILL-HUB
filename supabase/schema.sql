-- ====================================================================
-- VGM SKILL HUB - SUPABASE POSTGRESQL SCHEMA
-- Description: Complete relational schema with RLS, triggers, and seed data
-- Author: VGM Soft Tech Platform Team
-- Target: Supabase (PostgreSQL 15+)
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  headline TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  badge TEXT NOT NULL,
  level TEXT NOT NULL,
  duration TEXT NOT NULL,
  duration_weeks INTEGER NOT NULL DEFAULT 12,
  mode TEXT NOT NULL,
  rating NUMERIC(3,2) NOT NULL DEFAULT 4.9,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  learners_enrolled INTEGER NOT NULL DEFAULT 0,
  live_projects_count INTEGER NOT NULL DEFAULT 3,
  next_batch TEXT NOT NULL,
  starting_fee NUMERIC(10,2) NOT NULL DEFAULT 5999,
  starting_fee_formatted TEXT NOT NULL DEFAULT '₹5,999',
  status TEXT NOT NULL DEFAULT 'enrolling' CHECK (status IN ('enrolling', 'upcoming', 'waitlist')),
  featured BOOLEAN NOT NULL DEFAULT false,
  thumbnail TEXT,
  tools TEXT[] NOT NULL DEFAULT '{}',
  career_roles TEXT[] NOT NULL DEFAULT '{}',
  average_package TEXT NOT NULL DEFAULT '₹4.8 LPA',
  highest_package TEXT NOT NULL DEFAULT '₹11.5 LPA',
  highlights TEXT[] NOT NULL DEFAULT '{}',
  prerequisites TEXT,
  target_audience TEXT[] NOT NULL DEFAULT '{}',
  curriculum JSONB NOT NULL DEFAULT '[]'::jsonb,
  plans JSONB NOT NULL DEFAULT '{}'::jsonb,
  faqs JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index on slug & category for fast lookup
CREATE INDEX IF NOT EXISTS idx_courses_slug ON public.courses(slug);
CREATE INDEX IF NOT EXISTS idx_courses_category ON public.courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_status ON public.courses(status);

-- 3. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY DEFAULT ('c-' || substr(md5(random()::text), 1, 8)),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'flat')),
  discount_value NUMERIC(10,2) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  usage_limit INTEGER NOT NULL DEFAULT 100,
  times_used INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);

-- 4. ENROLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.enrolments (
  id TEXT PRIMARY KEY, -- e.g. VGM-2026-0001
  course_id TEXT REFERENCES public.courses(id) ON DELETE SET NULL,
  course_title TEXT NOT NULL,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('explorer', 'builder', 'professional')),
  plan_name TEXT NOT NULL,
  batch_id TEXT NOT NULL,
  batch_label TEXT NOT NULL,
  
  -- Student Details
  student_full_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_mobile TEXT NOT NULL,
  student_dob TEXT DEFAULT '',
  student_city TEXT DEFAULT '',
  student_college TEXT DEFAULT '',
  student_degree_stream TEXT DEFAULT '',
  student_year_of_study TEXT DEFAULT '',
  student_languages TEXT[] DEFAULT '{}',
  student_referral_source TEXT DEFAULT 'Direct',

  -- Assessment
  assessment_score INTEGER DEFAULT 0,
  assessment_total INTEGER DEFAULT 5,
  assessment_answers JSONB DEFAULT '{}'::jsonb,
  assessment_completed_at TIMESTAMPTZ,

  -- Pricing
  base_amount NUMERIC(10,2) NOT NULL,
  discount_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  coupon_code TEXT,
  final_amount NUMERIC(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',

  -- Payment
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  paid_at TIMESTAMPTZ,
  failed_reason TEXT,

  -- Student Portal
  completed_weeks INTEGER[] DEFAULT '{}',
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_enrolments_email ON public.enrolments(student_email);
CREATE INDEX IF NOT EXISTS idx_enrolments_mobile ON public.enrolments(student_mobile);
CREATE INDEX IF NOT EXISTS idx_enrolments_order_id ON public.enrolments(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_enrolments_payment_status ON public.enrolments(payment_status);
CREATE INDEX IF NOT EXISTS idx_enrolments_created_at ON public.enrolments(created_at DESC);

-- 5. PROJECT SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.project_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrolment_id TEXT NOT NULL REFERENCES public.enrolments(id) ON DELETE CASCADE,
  github_url TEXT NOT NULL,
  live_url TEXT,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'approved', 'rework_needed')),
  score INTEGER,
  reviewer_feedback TEXT,
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_submissions_enrolment ON public.project_submissions(enrolment_id);

-- 5b. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
  id TEXT PRIMARY KEY, -- e.g. VGM-2026-CERT-0104
  enrolment_id TEXT REFERENCES public.enrolments(id) ON DELETE SET NULL,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  course_title TEXT NOT NULL,
  plan_level TEXT NOT NULL,
  completion_date TEXT NOT NULL,
  grade TEXT NOT NULL DEFAULT 'Distinction (Grade A+)',
  project_title TEXT NOT NULL,
  skills TEXT[] NOT NULL DEFAULT '{}',
  authorized_signatory TEXT NOT NULL DEFAULT 'Director of Academic Engineering, VGM Soft Tech',
  verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'revoked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_certificates_student_email ON public.certificates(student_email);
CREATE INDEX IF NOT EXISTS idx_certificates_status ON public.certificates(verification_status);

-- 6. PROCESSED WEBHOOKS TABLE (Idempotency)
CREATE TABLE IF NOT EXISTS public.processed_webhooks (
  id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. AUDIT & AUTH ATTEMPTS LOG TABLE (For Rate Limiting & Security Monitoring)
CREATE TABLE IF NOT EXISTS public.auth_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP or username/email
  route TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 1,
  last_attempt TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  locked_until TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_auth_attempts_identifier ON public.auth_attempts(identifier);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrolments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processed_webhooks ENABLE ROW LEVEL SECURITY;

-- Public can read active courses
CREATE POLICY "Public courses read access" ON public.courses
  FOR SELECT USING (true);

-- Public can read verified certificates to verify credentials
CREATE POLICY "Public certificates read access" ON public.certificates
  FOR SELECT USING (true);

-- Public can read active coupons to validate
CREATE POLICY "Public coupons validation" ON public.coupons
  FOR SELECT USING (is_active = true AND expires_at > now());

-- Service role has full access to all tables
CREATE POLICY "Service role full access courses" ON public.courses
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access coupons" ON public.coupons
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access enrolments" ON public.enrolments
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access submissions" ON public.project_submissions
  FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access webhooks" ON public.processed_webhooks
  FOR ALL TO service_role USING (true);

-- 9. INITIAL SEED DATA
INSERT INTO public.coupons (id, code, discount_type, discount_value, expires_at, usage_limit, times_used, is_active, description)
VALUES 
  ('c-earlybird', 'EARLYBIRD', 'percentage', 10, timezone('utc'::text, now() + interval '90 days'), 100, 14, true, '10% early registration discount for upcoming cohorts'),
  ('c-campus20', 'CAMPUS20', 'percentage', 20, timezone('utc'::text, now() + interval '60 days'), 50, 8, true, '20% college campus partner discount'),
  ('c-vgmflat1k', 'VGM1000', 'flat', 1000, timezone('utc'::text, now() + interval '120 days'), 200, 31, true, 'Flat ₹1,000 instant discount on professional plans')
ON CONFLICT (code) DO NOTHING;

-- 10. AUTO-UPDATE TIMESTAMP TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER update_enrolments_updated_at
  BEFORE UPDATE ON public.enrolments
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON public.coupons
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
