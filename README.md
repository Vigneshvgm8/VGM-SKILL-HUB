# VGM Skill Hub — Tech Academy & Professional Internships Platform

Official web application, course catalog, and student admission portal for **VGM Skill Hub**, the specialized technical training, internship, and placement division of **VGM Soft Tech** (Saibaba Colony, Coimbatore, Tamil Nadu, India).

Inspired by top-tier professional skill institutes (such as **KGiSL MicroCollege**), the platform provides:
- **Comprehensive Multi-Course Platform:** Scalable catalog supporting multiple domains (Mobile App Development, Full-Stack Web, AI & Data Science, Cloud & DevOps, Cybersecurity, UI/UX Design).
- **Dedicated Course Landing Pages:** Dynamic routing (`/courses/:slug`) with weekly module breakdowns, live client deliverables, tool stacks, and career outcomes.
- **Dynamic Multi-Course Enrolment:** Seamless 3-step checkout (`/enrol`) supporting course selection, tailored plan tiers, coupon discounts, and instant Razorpay payments.
- **Career & Placement Cell (`/placements`):** 94.8% placement rate, ₹16 LPA highest package, 50+ hiring partners, alumni success stories, and recruiter hiring requests.
- **Credential Verification Portal (`/verify-certificate`):** Digital credential registry allowing employers and colleges to verify student certificates and experience letters.
- **Staff Admin Console (`/admin`):** Filter candidates by Course, Plan, Batch, and Payment status, inspect answer breakdowns, manage discount coupons, and export complete CSV reports.

---

## 🛠 Tech Stack

- **Frontend:** React 19, Tailwind CSS v4, Lucide Icons, Motion (framer-motion), React Router v7.
- **Backend:** Node.js, Express, Razorpay Official Node SDK, Crypto for HMAC-SHA256 signature verification.
- **Data Store:** Persistent file-backed JSON database (`data/db.json`) preserving enrolments, coupons, payments, and webhook logs across restarts.
- **Brand Palette:**
  - Primary Green: `#43C170`
  - Dark Green: `#1E7A46`
  - Near Black: `#141414`
  - Amber Accent: `#FFC83D`
  - Fonts: **Oswald** (headings) & **Poppins** (body).

---

## 📚 How to Add New Courses in the Future

The platform uses a scalable, type-safe course registry located at:
[`src/config/coursesData.ts`](file:///d:/website/vgm-skill-hub---ai-mobile-app-internship-2026/src/config/coursesData.ts)

To add a new course in the future:
1. Open `src/config/coursesData.ts`.
2. Add a new object to `COURSES_CATALOG`:
   ```ts
   {
     id: 'your-course-id',
     slug: 'your-course-slug',
     title: 'Course Title',
     headline: 'Compelling one-liner',
     shortDescription: 'Brief summary for cards',
     fullDescription: 'Comprehensive overview',
     category: 'Full-Stack Web', // or 'AI & Data Science', 'Mobile Development', etc.
     badge: '100% Placement Track',
     level: 'Beginner to Advanced',
     duration: '14 Weeks (3.5 Months)',
     durationWeeks: 14,
     mode: 'Hybrid (Coimbatore Campus + Live Online)',
     rating: 4.9,
     reviewsCount: 240,
     learnersEnrolled: 650,
     liveProjectsCount: 4,
     nextBatch: '15th December 2026',
     startingFee: 7999,
     startingFeeFormatted: '₹7,999',
     status: 'enrolling',
     tools: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
     careerRoles: ['Full-Stack Developer', 'Software Engineer'],
     averagePackage: '₹5.5 LPA',
     highestPackage: '₹14.0 LPA',
     highlights: ['400+ hours practical lab work', 'Work on live client codebases'],
     prerequisites: 'Basic programming knowledge',
     targetAudience: ['Graduates', 'Career switchers'],
     curriculum: [ ... ], // Weekly modules with topics and hands-on deliverables
     plans: { ... },       // Plan tiers (Explorer, Builder, Professional)
     faqs: [ ... ]
   }
   ```
3. That's it! The course will **automatically**:
   - Appear on the **Courses Page (`/courses`)** with domain filter tabs and search.
   - Generate its own dedicated **Course Landing Page (`/courses/your-course-slug`)**.
   - Appear in the **Enrolment Dropdown (`/enrol`)** with matching plans and fees.
   - Be selectable in the **Staff Admin Console (`/admin`)** filters.

---

## 🚀 Getting Started

### 1. Environment Configuration

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Set your configuration values:

```env
# Razorpay Credentials (from https://dashboard.razorpay.com/#/access/api-keys)
RAZORPAY_KEY_ID="rzp_test_YOUR_KEY_ID"
RAZORPAY_KEY_SECRET="YOUR_KEY_SECRET"
RAZORPAY_WEBHOOK_SECRET="YOUR_WEBHOOK_SECRET"

# Admin Dashboard Password (access at /admin)
ADMIN_PASSWORD="vgm_admin_2026"

# Optional SMTP Email Dispatch
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="intern@vgmsofttech.com"
SMTP_PASS=""
NOTIFICATION_EMAIL="intern@vgmsofttech.com"
```

### 2. Running Locally

```bash
# Start server with Vite middleware in development
npm run dev

# Or build and start for production
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📍 Contact & Institute Details

- **Division:** VGM Skill Hub (Training & Internship Division of VGM Soft Tech)
- **Address:** Saibaba Colony, Coimbatore, Tamil Nadu, 641011, India
- **Phone:** +91 9345615913
- **Email:** intern@vgmsofttech.com
- **WhatsApp:** https://wa.me/919345615913
