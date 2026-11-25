import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { COURSE_CATEGORIES, CourseItem, COURSES_CATALOG } from '../config/coursesData.js';
import { getApiUrl } from '../config/api.js';
import { CurvedCourseShelf } from '../components/CurvedCourseShelf.js';
import { CinematicTextReveal } from '../components/CinematicTextReveal.js';
import { CinematicCard } from '../components/CinematicCard.js';
import {
  LusionCrosshairRow,
  LusionMaskLine,
  LusionRevealBlock,
  LusionMagnetic,
  LUSION_EASE,
} from '../components/LusionMotionPrimitives.js';
import { 
  Search, 
  X, 
  ArrowRight, 
  Star, 
  Clock, 
  Award, 
  Layers, 
  ArrowUpRight,
  Eye,
  Compass,
  Sparkles
} from 'lucide-react';

// Domain code acronyms for poster header
const DOMAIN_CODES: Record<string, string> = {
  'Mobile Development': 'MBL-01',
  'Full-Stack Web': 'FST-02',
  'AI & Data Science': 'DAT-03',
  'Cloud & DevOps': 'CLD-04',
  'Cybersecurity': 'SEC-05',
  'UI/UX Design': 'DES-06'
};

export const CoursesPage: React.FC = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState<CourseItem[]>(() => COURSES_CATALOG);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All Tracks');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalCourse, setActiveModalCourse] = useState<CourseItem | null>(null);

  // Sync live courses from API in background, maintaining catalog as fallback
  useEffect(() => {
    fetch(getApiUrl('/api/courses'))
      .then(res => res.json())
      .then(data => {
        if (data.courses && Array.isArray(data.courses) && data.courses.length > 0) {
          setCourses(data.courses);
        }
      })
      .catch((err) => {
        console.warn('[Courses] Using catalog fallback:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      if (selectedCategory !== 'All Tracks' && course.category !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = course.title.toLowerCase().includes(q);
        const matchesDesc = course.shortDescription.toLowerCase().includes(q);
        const matchesTools = course.tools.some(t => t.toLowerCase().includes(q));
        const matchesCat = course.category.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesTools && !matchesCat) {
          return false;
        }
      }
      return true;
    });
  }, [courses, selectedCategory, searchQuery]);

  // Categories list with count
  const categoryFilters = useMemo(() => {
    const list = ['All Tracks', ...COURSE_CATEGORIES.filter(c => c !== 'All Domains')];
    return list.map(cat => {
      const count = cat === 'All Tracks' 
        ? courses.length 
        : courses.filter(c => c.category === cat).length;
      return { name: cat, count };
    });
  }, [courses]);

  // Keyboard navigation for poster modal dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveModalCourse(null);
      } else if (activeModalCourse) {
        const currentIndex = filteredCourses.findIndex(c => c.id === activeModalCourse.id);
        if (e.key === 'ArrowRight' && currentIndex < filteredCourses.length - 1) {
          setActiveModalCourse(filteredCourses[currentIndex + 1]);
        } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
          setActiveModalCourse(filteredCourses[currentIndex - 1]);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalCourse, filteredCourses]);

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#111111] selection:bg-[#43C170]/30 selection:text-[#111111] pt-36 sm:pt-40 md:pt-44 pb-28 relative overflow-x-hidden font-body">
      
      {/* Subtle Ambient Atmosphere */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40 bg-[radial-gradient(#0000000d_1px,transparent_1px)] [background-size:24px_24px]" />
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[550px] bg-gradient-to-b from-[#1E9E54]/5 via-transparent to-transparent blur-[140px] -z-10" />

      {/* 1. Header Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-10">
        
        {/* Subtle Category Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/[0.04] border border-black/[0.08] text-xs font-mono text-[#555555] tracking-widest uppercase mb-6"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E54] animate-pulse" />
          <span>VGM SKILL HUB · THE 2026 CURRICULUM POSTERS</span>
        </motion.div>

        {/* Cinematic Masked Title */}
        <CinematicTextReveal
          text="The Curriculum Posters"
          tag="h1"
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-[-0.05em] text-[#111111] leading-[0.92] max-w-5xl mx-auto"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-base sm:text-lg text-[#555555] max-w-2xl mx-auto font-light leading-relaxed"
        >
          {courses.length} production-grade engineering {courses.length === 1 ? 'curriculum' : 'curricula'} engineered as collectible exhibition posters. Built for developers who shape tomorrow.
        </motion.p>

        {/* Meta Information Strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-6 text-[11px] font-mono text-[#777777] uppercase tracking-widest"
        >
          <span>{String(courses.length).padStart(2, '0')} ORIGINAL {courses.length === 1 ? 'TRACK' : 'TRACKS'}</span>
          <span className="text-black/20">·</span>
          <span>400+ HOURS PRACTICAL</span>
          <span className="text-black/20">·</span>
          <span>SAIBABA COLONY, COIMBATORE</span>
          <span className="text-black/20">·</span>
          <span className="text-[#1E9E54] font-bold">ADMISSIONS 2026 OPEN</span>
        </motion.div>

      </section>

      {/* 2. Filter & Search Bar */}
      <LusionRevealBlock variant="rise" className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 mb-12">
        <div className="flex flex-col items-center gap-5">
          
          {/* Search Pill */}
          <motion.div
            whileFocus={{ scale: 1.01 }}
            className="relative w-full max-w-[540px] h-[52px] rounded-full bg-white text-[#111111] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.1),0_2px_8px_rgba(0,0,0,0.03)] hover:shadow-[inset_0_0_0_1px_rgba(0,0,0,0.2)] focus-within:shadow-[inset_0_0_0_1.5px_rgba(30,158,84,0.6),0_8px_24px_rgba(30,158,84,0.12)] transition-all duration-200 flex items-center px-5 gap-3"
          >
            <Search className="w-4 h-4 text-[#888888] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, domain, tool, or stack..."
              className="w-full h-full bg-transparent border-0 outline-none text-[#111111] text-sm placeholder:text-[#888888]"
            />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-full text-[#888888] hover:text-[#111111] hover:bg-black/5 transition-colors cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </motion.div>

          {/* Chips */}
          <div className="w-full flex items-center justify-center">
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl">
              {categoryFilters.map((cat, cIdx) => {
                const isActive = selectedCategory === cat.name;
                return (
                  <motion.button
                    key={cat.name}
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: cIdx * 0.04, ease: LUSION_EASE }}
                    whileHover={{ y: -2, scale: 1.04 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`relative px-4 py-2 rounded-full text-xs font-medium transition-colors duration-200 flex items-center gap-1.5 whitespace-nowrap cursor-pointer z-10 ${
                      isActive
                        ? 'text-white font-semibold'
                        : 'bg-black/[0.04] text-[#555555] hover:text-[#111111] hover:bg-black/[0.08] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.06)]'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="courses-cat-active"
                        transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                        className="absolute inset-0 bg-[#111111] rounded-full -z-10 shadow-sm"
                      />
                    )}
                    <span>{cat.name}</span>
                    <span className={`text-[10px] ${isActive ? 'text-white/70' : 'text-[#888888]'}`}>
                      ({cat.count})
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>

          <LusionCrosshairRow count={5} label="3D EXHIBITION SHELF" className="pt-4" />

        </div>
      </LusionRevealBlock>

      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      {/* 3. CURRICULUM CATALOGUE WITH LEON VASARI CURVED 3D SHELF     */}
      {/*    (100% UNTOUCHED AS EXPLICITLY REQUESTED BY USER)          */}
      {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <section className="relative z-10 w-full mb-20 scroll-mt-44" id="curriculum-catalogue">
        
        {/* Results Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-black/[0.08]">
            <div className="flex items-center gap-3">
              <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#111111] tracking-tight">
                Curriculum Catalogue
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-[#1E9E54]/10 border border-[#1E9E54]/20 text-xs font-mono text-[#14723B] font-bold">
                {filteredCourses.length} {filteredCourses.length === 1 ? 'TRACK' : 'TRACKS'}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        {filteredCourses.length === 0 ? (
          <div className="max-w-md mx-auto py-24 text-center space-y-4 px-4">
            <h3 className="text-2xl font-heading font-bold text-[#111111]">No tracks match your search</h3>
            <p className="text-sm text-[#666666] leading-relaxed">
              We couldn't find any curriculum matching "{searchQuery}". Try searching for terms like "Flutter", "AI", "Cloud", or reset filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('All Tracks');
                setSearchQuery('');
              }}
              className="mt-2 px-6 py-2.5 rounded-full bg-[#111111] text-white font-semibold text-xs tracking-wider uppercase hover:bg-[#1E9E54] transition-colors cursor-pointer"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          /* Full Screen Edge-to-Edge Leon Vasari 3D Curved Shelf Archive */
          <div className="w-full overflow-hidden">
            <CurvedCourseShelf 
              courses={filteredCourses}
            />
          </div>
        )}

      </section>

      {/* 4. Poster Lightbox Modal */}
      <AnimatePresence>
        {activeModalCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-10 bg-black/60 backdrop-blur-xl"
            onClick={() => setActiveModalCourse(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto bg-white border border-black/10 rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.25)] p-6 sm:p-10 text-[#111111]"
            >
              
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveModalCourse(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-black/[0.06] hover:bg-black/[0.12] text-[#444444] hover:text-[#111111] transition-colors cursor-pointer z-20"
                aria-label="Close poster dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Left: Poster Artwork Large */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="relative w-full max-w-[340px] aspect-[1/1.414] rounded-2xl overflow-hidden bg-gradient-to-br from-[#F7F9FA] via-[#EEF2F5] to-[#E3E8EC] border border-black/10 p-6 shadow-lg flex flex-col justify-between">
                    
                    <div className="flex items-center justify-between border-b border-black/[0.08] pb-2 text-[10px] font-mono text-[#666666] tracking-widest">
                      <span>POSTER SPECIFICATION</span>
                      <span className="text-[#1E9E54] font-bold">{activeModalCourse.badge}</span>
                    </div>

                    <div className="my-auto py-4 flex flex-col items-center justify-center">
                      <img
                        src={activeModalCourse.thumbnail || `/assets/courses/${activeModalCourse.slug}.svg`}
                        alt={activeModalCourse.title}
                        className="max-h-44 object-contain filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.12)]"
                      />
                    </div>

                    <div className="border-t border-black/[0.08] pt-3 text-[10px] font-mono text-[#888888] uppercase tracking-widest">
                      <span>VGM SOFT TECH · COIMBATORE CAMPUS</span>
                    </div>

                  </div>
                </div>

                {/* Right: Full Course Specification & Actions */}
                <div className="lg:col-span-7 space-y-6">
                  
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#1E9E54]/10 border border-[#1E9E54]/30 text-[#14723B] text-xs font-mono uppercase tracking-wider font-bold">
                        {activeModalCourse.category}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-black/[0.05] border border-black/10 text-[#555555] text-xs font-mono uppercase">
                        {activeModalCourse.level}
                      </span>
                    </div>

                    <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#111111] tracking-tight leading-tight">
                      {activeModalCourse.title}
                    </h2>

                    <p className="text-base text-[#444444] font-medium leading-snug">
                      {activeModalCourse.headline}
                    </p>
                  </div>

                  <p className="text-sm text-[#666666] leading-relaxed font-light">
                    {activeModalCourse.shortDescription}
                  </p>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 gap-3 py-3 border-y border-black/[0.08]">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[#888888] uppercase">DURATION &amp; PROJECTS</span>
                      <p className="text-sm font-semibold text-[#111111]">
                        {activeModalCourse.duration} · {activeModalCourse.liveProjectsCount} Client Apps
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[#888888] uppercase">SALARY BENCHMARK</span>
                      <p className="text-sm font-semibold text-[#1E9E54]">
                        {activeModalCourse.averagePackage} AVG · {activeModalCourse.highestPackage} HIGH
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[#888888] uppercase">DELIVERY MODE</span>
                      <p className="text-sm font-semibold text-[#111111]">
                        {activeModalCourse.mode}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-[#888888] uppercase">NEXT BATCH</span>
                      <p className="text-sm font-semibold text-[#D97706]">
                        {activeModalCourse.nextBatch}
                      </p>
                    </div>
                  </div>

                  {/* Tools Strip */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono text-[#888888] uppercase tracking-widest block">
                      CORE TECHNOLOGIES COVERED
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {activeModalCourse.tools.map((t) => (
                        <span
                          key={t}
                          className="px-2.5 py-1 rounded-md bg-[#F0F2F4] border border-black/10 text-xs font-mono text-[#333333] font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTAs */}
                  <div className="pt-3 flex flex-wrap items-center gap-4">
                    <Link
                      to={`/courses/${activeModalCourse.slug}`}
                      className="px-7 py-3.5 rounded-full bg-[#111111] hover:bg-[#1E9E54] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2"
                    >
                      <span>Explore Detailed Curriculum</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      to={`/enrol?course=${activeModalCourse.slug}`}
                      className="px-7 py-3.5 rounded-full bg-[#1E9E54] hover:bg-[#14723B] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(30,158,84,0.3)] flex items-center gap-2"
                    >
                      <span>Enrol Online</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>

                </div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Career Counseling Callout */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
        <CinematicCard className="p-0 overflow-hidden">
          <div className="rounded-3xl border border-black/5 bg-[#F7F8FA] p-8 sm:p-14 relative overflow-hidden shadow-xs">
            
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1E9E54]/5 blur-[140px] pointer-events-none" />

            <div className="max-w-2xl space-y-5 relative z-10">
              <span className="font-mono text-xs uppercase tracking-widest text-[#1E9E54] font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#1E9E54] animate-pulse" />
                <span>ACADEMIC &amp; CAREER ADVISING</span>
              </span>

              <CinematicTextReveal
                text="Unsure which engineering track fits your background?"
                tag="h2"
                className="text-3xl sm:text-4xl font-black text-[#111111] tracking-tight leading-tight"
              />

              <p className="text-[#555555] text-sm sm:text-base font-light leading-relaxed">
                Schedule a 1-on-1 counseling consultation with senior staff developers at our Coimbatore campus. We analyze your degree stream, programming familiarity, and market hiring demand to guide your roadmap.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <LusionMagnetic strength={8}>
                  <a
                    href="https://wa.me/919345615913?text=Hi%20VGM%20Skill%20Hub,%20I%20would%20like%20guidance%20on%20choosing%20the%20right%20course"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lusion-cta-btn !bg-[#1E9E54]"
                  >
                    <span className="cta-dot !bg-white" />
                    <span className="cta-text">WhatsApp Senior Counselor (+91 9345615913)</span>
                    <span className="cta-arrow">
                      <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </a>
                </LusionMagnetic>

                <LusionMagnetic strength={6}>
                  <Link
                    to="/about"
                    className="px-6 py-3.5 rounded-full bg-white hover:bg-black/5 border border-black/10 text-[#111111] font-semibold text-xs uppercase tracking-wider transition-all inline-block"
                  >
                    Campus Location &amp; Contact
                  </Link>
                </LusionMagnetic>
              </div>
            </div>

          </div>
        </CinematicCard>
      </section>

    </div>
  );
};
