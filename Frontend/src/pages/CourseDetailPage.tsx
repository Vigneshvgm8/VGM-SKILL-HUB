import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getCourseBySlug, CourseItem } from '../config/coursesData.js';
import { CinematicTextReveal } from '../components/CinematicTextReveal.js';
import { CinematicCard } from '../components/CinematicCard.js';
import { 
  Check, 
  ArrowRight, 
  Star, 
  Clock, 
  Calendar, 
  MapPin, 
  Award, 
  ChevronDown, 
  Laptop, 
  Briefcase, 
  Terminal, 
  ExternalLink,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [course, setCourse] = useState<CourseItem | null>(() => slug ? (getCourseBySlug(slug) || null) : null);
  const [loading, setLoading] = useState<boolean>(!course);

  useEffect(() => {
    if (slug) {
      fetch(`/api/courses/${slug}`)
        .then(res => res.json())
        .then(data => {
          if (data.course) {
            setCourse(data.course);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [slug]);

  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(null);

  if (loading && !course) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] pt-36 sm:pt-40 md:pt-44 pb-24 px-4 max-w-3xl mx-auto text-center space-y-4">
        <div className="w-10 h-10 border-4 border-[#1E9E54] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-[#666666] text-sm">Loading course details...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-[#FFFFFF] pt-28 sm:pt-32 pb-24 px-4 max-w-3xl mx-auto text-center space-y-6">
        <h1 className="text-3xl font-black text-[#111111]">Course Not Found</h1>
        <p className="text-[#666666]">The requested course track does not exist or has been updated.</p>
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#111111] hover:bg-[#1E9E54] text-white font-semibold rounded-full transition-colors"
        >
          <span>Browse All Courses</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const planKeys = Object.keys(course.plans || {});

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] pb-24 font-body pt-36 sm:pt-40 md:pt-44">
      
      {/* 1. Breadcrumbs */}
      <div className="bg-[#F7F8FA] border-b border-black/5 text-[#777777] text-xs py-3 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <Link to="/" className="hover:text-[#111111] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-black/20" />
          <Link to="/courses" className="hover:text-[#111111] transition-colors">Courses</Link>
          <ChevronRight className="w-3.5 h-3.5 text-black/20" />
          <span className="text-[#1E9E54] font-semibold truncate">{course.title}</span>
        </div>
      </div>

      {/* 2. Course Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-[#FFFFFF] text-[#111111] py-12 md:py-20 relative overflow-hidden"
      >
        {/* Gradient mesh orb top-right */}
        <div className="absolute top-0 right-0 w-[700px] h-[700px] pointer-events-none">
          <div className="animate-orb absolute top-[-150px] right-[-150px] w-[600px] h-[600px] rounded-full bg-[#1E9E54]/5 blur-[140px]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-8 space-y-6">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-[#1E9E54]/10 border border-[#1E9E54]/30 text-[#14723B] text-xs font-bold uppercase tracking-wider font-mono">
                  {course.badge}
                </span>
                <span className="px-3.5 py-1 rounded-full bg-[#F0F2F4] border border-black/10 text-[#555555] text-xs font-medium font-mono">
                  {course.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-[#D97706] bg-[#D97706]/10 border border-[#D97706]/20 px-3 py-1 rounded-full font-mono">
                  <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
                  <span className="font-bold">{course.rating}</span>
                  <span className="text-[#777777]">({course.reviewsCount} reviews)</span>
                </div>
              </div>

              {/* Title & Headline */}
              <CinematicTextReveal
                text={course.title}
                tag="h1"
                className="text-4xl sm:text-6xl font-black text-[#111111] tracking-[-0.04em] leading-tight font-heading"
              />

              <p className="text-xl text-[#1E9E54] font-semibold leading-relaxed">
                {course.headline}
              </p>

              <p className="text-[#555555] text-base leading-relaxed max-w-3xl font-light">
                {course.fullDescription}
              </p>

              {/* Highlights Bullet Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {course.highlights.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-sm text-[#444444]">
                    <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link
                  to={`/enrol?course=${course.slug}`}
                  className="lusion-cta-btn"
                >
                  <span className="cta-dot"></span>
                  <span className="cta-text">Enrol in this Course</span>
                  <span className="cta-arrow">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <a
                  href={`https://wa.me/919345615913?text=Hi%20VGM%20Skill%20Hub,%20I%20am%20interested%20in%20${encodeURIComponent(course.title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 bg-[#F0F2F4] hover:bg-[#E8ECEF] border border-black/10 text-[#111111] font-semibold rounded-full transition-all text-xs uppercase tracking-wider flex items-center gap-2"
                >
                  <span>Chat with Mentor</span>
                  <ExternalLink className="w-4 h-4 text-[#666666]" />
                </a>
              </div>

            </div>

            {/* Right Card: Quick Facts & Enrollment Snapshot */}
            <div className="lg:col-span-4">
              <CinematicCard className="bg-[#F7F8FA] border border-black/10 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 overflow-hidden">
                
                {/* Course Banner Thumbnail */}
                {course.thumbnail && (
                  <div className="rounded-t-2xl overflow-hidden -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-4 border-b border-black/10">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full aspect-video object-cover"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-[#777777] uppercase tracking-wider">Starting Investment</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[#1E9E54] text-3xl font-black font-mono">{course.startingFeeFormatted}</span>
                    <span className="text-xs text-[#777777]">EMI Available</span>
                  </div>
                </div>

                <div className="border-t border-black/5 pt-4 space-y-3.5 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-[#666666] flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#1E9E54]" /> Duration
                    </span>
                    <span className="font-semibold text-[#111111] font-mono">{course.duration}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#666666] flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-[#1E9E54]" /> Next Batch
                    </span>
                    <span className="font-semibold text-[#1E9E54] font-mono">{course.nextBatch}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#666666] flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#1E9E54]" /> Delivery Mode
                    </span>
                    <span className="font-semibold text-[#111111] text-right text-xs max-w-[160px] font-mono">{course.mode}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#666666] flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-[#1E9E54]" /> Avg Placement
                    </span>
                    <span className="font-semibold text-[#111111] font-mono">{course.averagePackage}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#666666] flex items-center gap-2">
                      <Award className="w-4 h-4 text-[#1E9E54]" /> Credential
                    </span>
                    <span className="font-semibold text-[#111111] text-xs font-mono">VGM Soft Tech Verified</span>
                  </div>
                </div>

                <div className="border-t border-black/5 pt-4">
                  <Link
                    to={`/enrol?course=${course.slug}`}
                    className="w-full py-3.5 bg-[#111111] hover:bg-[#1E9E54] text-white font-bold rounded-full text-center block transition-colors shadow-sm"
                  >
                    Apply Now
                  </Link>
                  <p className="text-[11px] text-[#888888] text-center mt-2 font-mono">
                    Instant Razorpay checkout or reserve seat
                  </p>
                </div>

              </CinematicCard>
            </div>

          </div>
        </div>
      </motion.section>

      {/* 3. Technologies & Toolchain Stack */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16"
      >
        <div className="bg-[#F7F8FA] rounded-3xl border border-black/5 p-8 space-y-6">
          <div className="max-w-2xl">
            <span className="font-mono text-xs text-[#1E9E54] uppercase tracking-wider font-bold">PRODUCTION TOOLCHAIN</span>
            <h2 className="text-2xl font-black text-[#111111] mt-1 font-heading">
              Tools, Frameworks &amp; Technologies You Will Master
            </h2>
            <p className="text-sm text-[#666666] mt-1">
              Every tool taught is chosen based on live software requirements at VGM Soft Tech and enterprise hiring criteria.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {course.tools.map((tool) => (
              <div
                key={tool}
                className="p-3 bg-white border border-black/5 rounded-xl text-center font-medium text-xs text-[#555555] flex flex-col items-center justify-center gap-1.5 hover:border-[#1E9E54]/50 hover:text-[#111111] transition-all shadow-2xs"
              >
                <Terminal className="w-4 h-4 text-[#1E9E54]" />
                <span className="truncate w-full font-mono">{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* 4. Interactive Curriculum Explorer */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16"
      >
        <div className="space-y-6">
          <div>
            <span className="text-xs font-mono font-bold text-[#1E9E54] uppercase tracking-wider">COMPREHENSIVE SYLLABUS</span>
            <h2 className="text-3xl font-black text-[#111111] mt-1 font-heading">
              Structured Project-Based Learning Journey
            </h2>
            <p className="text-sm text-[#666666] max-w-2xl mt-1">
              Each module combines theory, live engineering demonstrations, and practical code commits pushed to your personal GitHub repository.
            </p>
          </div>

          <div className="space-y-4">
            {course.curriculum.map((mod, idx) => {
              const isOpen = activeModuleIndex === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border border-black/5 overflow-hidden transition-all ${isOpen ? 'bg-[#F7F8FA] shadow-xs' : 'bg-white'}`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveModuleIndex(isOpen ? -1 : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-black/[0.02] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-10 h-10 rounded-xl bg-[#1E9E54]/10 border border-[#1E9E54]/20 text-[#1E9E54] font-mono font-bold text-sm flex items-center justify-center shrink-0">
                        0{mod.moduleNumber}
                      </span>
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-[#777777]">
                          <span>{mod.duration}</span>
                        </div>
                        <h3 className="text-lg font-bold text-[#111111] font-heading">
                          {mod.title}
                        </h3>
                      </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-[#777777] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-6 pb-6 pt-2 border-t border-black/5 space-y-4"
                      >
                        <p className="text-sm text-[#666666] leading-relaxed">
                          {mod.description}
                        </p>

                        <div>
                          <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#777777] mb-2">
                            Key Competencies Covered:
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {mod.topics.map((t, tidx) => (
                              <div key={tidx} className="flex items-center gap-2 text-xs text-[#555555] bg-white px-3 py-1.5 rounded-lg border border-black/5">
                                <Check className="w-3.5 h-3.5 text-[#1E9E54] shrink-0" />
                                <span>{t}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Hands-on Project Callout */}
                        <div className="bg-[#1E9E54]/05 border border-[#1E9E54]/20 rounded-xl p-4 flex items-start gap-3">
                          <Laptop className="w-5 h-5 text-[#1E9E54] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#1E9E54]">
                              Hands-On Deliverable:
                            </span>
                            <p className="text-xs sm:text-sm font-semibold text-[#111111] mt-0.5">
                              {mod.handsOnProject}
                            </p>
                          </div>
                        </div>

                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* 5. Plans & Pricing Comparison */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20"
      >
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono font-bold text-[#1E9E54] uppercase tracking-wider">CHOOSE YOUR COMMITMENT</span>
          <h2 className="text-3xl font-black text-[#111111] font-heading">
            Transparent Plans &amp; Fee Structure
          </h2>
          <p className="text-sm text-[#666666]">
            Select the tier matching your career commitment and timeline. Every plan includes mentor access and certificates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {planKeys.map((key) => {
            const plan = course.plans[key];
            if (!plan) return null;
            const isRec = plan.recommended;

            return (
              <CinematicCard
                key={plan.id}
                highlight={isRec}
                className={`p-8 flex flex-col relative transition-all duration-300 ${
                  isRec
                    ? 'border-[#1E9E54]/40 bg-white shadow-xl ring-2 ring-[#1E9E54]/20'
                    : 'bg-[#F7F8FA] border-black/5 hover:border-black/20'
                }`}
              >
                {isRec && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#1E9E54] text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm font-mono">
                    Most Popular Choice
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-[#111111] font-heading">{plan.name}</h3>
                  <p className="text-xs text-[#777777] font-mono">Duration: {plan.duration} ({plan.weeksTotal} Weeks)</p>
                </div>

                <div className="my-6">
                  <span className="text-[#111111] text-3xl font-black font-mono">{plan.feeFormatted}</span>
                  <span className="text-xs text-[#777777] block mt-1 font-mono">One-time payment (incl. all labs)</span>
                </div>

                <div className="p-3.5 bg-white rounded-xl border border-black/5 text-xs text-[#666666] mb-6 shadow-2xs">
                  <span className="font-bold text-[#111111] block mb-0.5">Outcome:</span>
                  {plan.outcome}
                </div>

                <div className="space-y-3 mb-8 grow">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#777777]">What's included:</span>
                  {plan.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#555555]">
                      <Check className="w-4 h-4 text-[#1E9E54] shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                <Link
                  to={`/enrol?course=${course.slug}&plan=${plan.id}`}
                  className={`w-full py-3.5 text-center font-bold text-sm rounded-full transition-all ${
                    isRec
                      ? 'bg-[#1E9E54] hover:bg-[#14723B] text-white shadow-sm'
                      : 'bg-[#111111] hover:bg-[#1E9E54] text-white'
                  }`}
                >
                  Select {plan.name}
                </Link>

              </CinematicCard>
            );
          })}
        </div>
      </motion.section>

      {/* 6. Career Roles & Salary Expectations */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20"
      >
        <div className="bg-[#F7F8FA] border border-black/5 text-[#111111] rounded-3xl p-8 sm:p-12 shadow-xs relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs font-mono font-bold text-[#1E9E54] uppercase tracking-wider">CAREER TRAJECTORY</span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#111111] font-heading">
                Job Roles You Will Qualify For
              </h2>
              <p className="text-[#666666] text-sm leading-relaxed">
                Graduates of this track are actively hired by product firms, fast-growing startups, and IT consultancies in Tamil Nadu and nationwide.
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {course.careerRoles.map((role) => (
                  <span
                    key={role}
                    className="px-3.5 py-1.5 bg-white border border-black/10 rounded-full text-xs sm:text-sm text-[#14723B] font-medium shadow-2xs font-mono"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="bg-white border border-black/5 rounded-2xl p-6 text-center shadow-xs">
                <span className="text-xs text-[#777777] uppercase font-mono">Average Package</span>
                <span className="text-2xl sm:text-3xl font-black text-[#1E9E54] block mt-1 font-mono">
                  {course.averagePackage}
                </span>
                <span className="text-[11px] text-[#888888] mt-1 block">Freshers &amp; Juniors</span>
              </div>

              <div className="bg-white border border-black/5 rounded-2xl p-6 text-center shadow-xs">
                <span className="text-xs text-[#777777] uppercase font-mono">Highest Package</span>
                <span className="text-2xl sm:text-3xl font-black text-[#D97706] block mt-1 font-mono">
                  {course.highestPackage}
                </span>
                <span className="text-[11px] text-[#888888] mt-1 block">Top Performers</span>
              </div>
            </div>

          </div>
        </div>
      </motion.section>

      {/* 7. FAQs */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 space-y-6"
      >
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-[#1E9E54] uppercase tracking-wider">GOT QUESTIONS?</span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111111] font-heading">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {course.faqs.map((faq, idx) => {
            const isOpen = activeFaqIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl border border-black/5 overflow-hidden transition-all ${isOpen ? 'bg-[#F7F8FA]' : 'bg-white'}`}
              >
                <button
                  type="button"
                  onClick={() => setActiveFaqIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-[#111111] text-sm sm:text-base hover:text-[#1E9E54] transition-colors"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-[#777777] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-[#666666] leading-relaxed border-t border-black/5 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.section>

    </div>
  );
};
