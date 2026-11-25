import React, { useRef, useState } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useVelocity,
  useMotionValue,
} from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Award, Clock, Star } from 'lucide-react';
import { CourseItem } from '../config/coursesData.js';

export const LUSION_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Accent palette keyed by course category for Lusion-style hover ambient halos
const CATEGORY_ACCENT: Record<string, { primary: string; glow: string; badgeBg: string; text: string }> = {
  'Mobile Development': {
    primary: '#0284C7',
    glow: 'rgba(2, 132, 199, 0.18)',
    badgeBg: 'rgba(2, 132, 199, 0.1)',
    text: '#0369A1',
  },
  'Full-Stack Web': {
    primary: '#7C3AED',
    glow: 'rgba(124, 58, 237, 0.18)',
    badgeBg: 'rgba(124, 58, 237, 0.1)',
    text: '#6D28D9',
  },
  'AI & Data Science': {
    primary: '#1E9E54',
    glow: 'rgba(30, 158, 84, 0.2)',
    badgeBg: 'rgba(30, 158, 84, 0.1)',
    text: '#14723B',
  },
  'Cloud & DevOps': {
    primary: '#D97706',
    glow: 'rgba(217, 119, 6, 0.18)',
    badgeBg: 'rgba(217, 119, 6, 0.1)',
    text: '#B45309',
  },
  Cybersecurity: {
    primary: '#E11D48',
    glow: 'rgba(225, 29, 72, 0.18)',
    badgeBg: 'rgba(225, 29, 72, 0.1)',
    text: '#BE123C',
  },
  'UI/UX Design': {
    primary: '#DB2777',
    glow: 'rgba(219, 39, 119, 0.18)',
    badgeBg: 'rgba(219, 39, 119, 0.1)',
    text: '#BE185D',
  },
};

/**
 * Lusion Crosshair Row (+ + + +) that rotates continuously with vertical scroll.
 */
export const LusionCrosshairRow: React.FC<{
  count?: number;
  className?: string;
  label?: string;
}> = ({ count = 5, className = '', label }) => {
  const { scrollY } = useScroll();
  const smoothScroll = useSpring(scrollY, { stiffness: 120, damping: 24, mass: 0.4 });
  const rotate = useTransform(smoothScroll, (v) => (v * 0.14) % 360);

  return (
    <div className={`w-full flex items-center justify-between py-2 select-none pointer-events-none ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <React.Fragment key={i}>
          <motion.span
            style={{ rotate }}
            className="lusion-cross will-change-transform opacity-40 text-[#111111]"
            aria-hidden="true"
          />
          {label && i === Math.floor(count / 2) - 1 && (
            <span className="hidden sm:inline-block font-mono text-[10px] tracking-[0.28em] uppercase text-[#777777]">
              {label}
            </span>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

/**
 * Lusion Masked Line Reveal (matches #home-featured-disclaimer `.line` slide-up inside overflow:hidden).
 */
export const LusionMaskLine: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className = '' }) => {
  return (
    <div className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: '108%', opacity: 0 }}
        whileInView={{ y: '0%', opacity: 1 }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.85, delay, ease: LUSION_EASE }}
        className="will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
};

/**
 * Lusion Animated Hairline Divider.
 */
export const LusionDivider: React.FC<{ className?: string; delay?: number }> = ({
  className = '',
  delay = 0,
}) => (
  <motion.div
    initial={{ scaleX: 0, opacity: 0 }}
    whileInView={{ scaleX: 1, opacity: 1 }}
    viewport={{ once: false, amount: 0.2 }}
    transition={{ duration: 0.9, delay, ease: LUSION_EASE }}
    style={{ transformOrigin: 'left center' }}
    className={`h-[1px] w-full bg-black/[0.08] ${className}`}
  />
);

/**
 * Lusion Reveal Block for content sections, badges, text, and grids (bi-directional scroll).
 */
export const LusionRevealBlock: React.FC<{
  children: React.ReactNode;
  delay?: number;
  variant?: 'rise' | 'left' | 'right' | 'scale' | 'blur';
  className?: string;
}> = ({ children, delay = 0, variant = 'rise', className = '' }) => {
  const variantsMap = {
    rise: {
      initial: { opacity: 0, y: 36 },
      whileInView: { opacity: 1, y: 0 },
    },
    left: {
      initial: { opacity: 0, x: -36 },
      whileInView: { opacity: 1, x: 0 },
    },
    right: {
      initial: { opacity: 0, x: 36 },
      whileInView: { opacity: 1, x: 0 },
    },
    scale: {
      initial: { opacity: 0, scale: 0.93, y: 20 },
      whileInView: { opacity: 1, scale: 1, y: 0 },
    },
    blur: {
      initial: { opacity: 0, y: 24, filter: 'blur(6px)' },
      whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
    },
  };

  const selected = variantsMap[variant];

  return (
    <motion.div
      initial={selected.initial}
      whileInView={selected.whileInView}
      viewport={{ once: false, amount: 0.12 }}
      transition={{ duration: 0.78, delay, ease: LUSION_EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

/**
 * Lusion Magnetic Interaction Wrapper for buttons, pills, and CTAs.
 */
export const LusionMagnetic: React.FC<{
  children: React.ReactNode;
  strength?: number;
  className?: string;
}> = ({ children, strength = 8, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 18, mass: 0.25 });
  const springY = useSpring(y, { stiffness: 260, damping: 18, mass: 0.25 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
    const relY = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.025 }}
      whileTap={{ scale: 0.965 }}
      transition={{ duration: 0.2 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};

/**
 * Lusion Slot-Machine Rolling Word/Character Title (inspired by `.project-item-line-2-inner-list`).
 */
export const LusionSlotText: React.FC<{
  text: string;
  hovered: boolean;
  accentColor?: string;
}> = ({ text, hovered, accentColor = '#1E9E54' }) => {
  const words = text.split(' ');
  let charCounter = 0;

  return (
    <span className="inline-flex flex-wrap gap-x-[0.26em] leading-tight">
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-flex whitespace-nowrap overflow-hidden">
          {word.split('').map((ch, cIdx) => {
            const idx = charCounter++;
            return (
              <span
                key={cIdx}
                className="relative inline-block overflow-hidden align-top"
                style={{ height: '1.15em', lineHeight: '1.15em' }}
              >
                <span
                  className="flex flex-col transition-transform duration-500 will-change-transform"
                  style={{
                    transform: hovered ? 'translateY(-50%)' : 'translateY(0%)',
                    transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
                    transitionDelay: `${Math.min(idx * 14, 240)}ms`,
                  }}
                >
                  <span className="block h-[1.15em]">{ch}</span>
                  <span className="block h-[1.15em]" style={{ color: accentColor }} aria-hidden="true">
                    {ch}
                  </span>
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </span>
  );
};

/**
 * Lusion Featured Work Card — faithful recreation of lusion.co `#home-featured` `.project-item`
 * scroll-linked 3D perspective, asymmetric counter-parallax, scroll-velocity bend,
 * inner media zoom + radius morph, ambient halo, and slot-machine kinetic footer title.
 */
interface LusionFeaturedCardProps {
  course: CourseItem;
  index: number;
  isOffset: boolean;
  onOpenSyllabus: (slug: string) => void;
}

export const LusionFeaturedCard: React.FC<LusionFeaturedCardProps> = ({
  course,
  index,
  isOffset,
  onOpenSyllabus,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const theme = CATEGORY_ACCENT[course.category] || CATEGORY_ACCENT['AI & Data Science'];

  // Mouse 3D tilt tracking inside card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const pointerTiltX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4.5, -4.5]), {
    stiffness: 180,
    damping: 22,
  });
  const pointerTiltY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4.5, 4.5]), {
    stiffness: 180,
    damping: 22,
  });

  // Scroll-linked card & inner image progress across the viewport
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'end start'],
  });
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.35,
  });

  // Global scroll velocity for signature Lusion elastic WebGL-plane bend on fast scroll
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { stiffness: 160, damping: 28 });
  const velocitySkew = useTransform(smoothVelocity, [-2400, 0, 2400], [-3.2, 0, 3.2]);

  // Column differential parallax (right offset column glides at stronger counter speed)
  const cardY = useTransform(
    smoothProgress,
    [0, 1],
    isOffset ? [72, -64] : [32, -28]
  );
  const cardScale = useTransform(smoothProgress, [0, 0.25, 0.75, 1], [0.89, 1, 1, 0.95]);
  const cardRotateX = useTransform(smoothProgress, [0, 0.28, 0.75, 1], [9, 0, 0, -5]);
  const cardOpacity = useTransform(smoothProgress, [0, 0.14, 0.88, 1], [0.25, 1, 1, 0.55]);

  // Inner image parallax + organic border-radius morph
  const mediaRadius = useTransform(smoothProgress, [0, 0.3, 0.75, 1], ['40px', '18px', '18px', '30px']);
  const imgParallaxY = useTransform(smoothProgress, [0, 1], ['-10%', '10%']);
  const imgScrollScale = useTransform(smoothProgress, [0, 0.35, 1], [1.18, 1.03, 1.08]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      style={{
        y: cardY,
        scale: cardScale,
        opacity: cardOpacity,
        skewY: velocitySkew,
        perspective: 1200,
      }}
      className={`group relative will-change-transform ${isOffset ? 'md:mt-16 lg:mt-24' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor-label="VIEW TRACK"
    >
      {/* Dynamic Lusion Ambient Color Halo behind hovered card */}
      <div
        className="pointer-events-none absolute -inset-6 rounded-[44px] transition-opacity duration-700 blur-3xl -z-10"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${theme.glow}, transparent 70%)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      <motion.div
        style={{
          rotateX: hovered ? pointerTiltX : cardRotateX,
          rotateY: hovered ? pointerTiltY : 0,
          transformStyle: 'preserve-3d',
        }}
        className="rounded-[28px] border border-black/[0.08] group-hover:border-emerald-500/40 p-5 sm:p-8 bg-white/95 backdrop-blur-xl hover:shadow-[0_32px_70px_-15px_rgba(0,0,0,0.12)] transition-[border-color,box-shadow] duration-500 flex flex-col justify-between relative overflow-hidden"
      >
        {/* Top specular beam on hover */}
        <div
          className="pointer-events-none absolute inset-x-10 top-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
          }}
        />

        {/* Index & Quick Spec Row */}
        <div className="flex items-center justify-between mb-4 text-[11px] font-mono text-[#777777]">
          <span className="font-bold tracking-widest text-[#111111]">
            PRJ // {String(index + 1).padStart(2, '0')}
          </span>
          <span className="uppercase tracking-wider">{course.level}</span>
        </div>

        {/* Media Viewport (Lusion `.project-item-main > .project-item-image`) */}
        <Link
          to={`/courses/${course.slug}`}
          className="block relative w-full aspect-[16/10] overflow-hidden bg-[#EAEFF2] border border-black/5 mb-6"
          style={{ borderRadius: '20px' }}
        >
          <motion.div
            style={{ borderRadius: mediaRadius }}
            initial={{ clipPath: 'inset(10% 4% 10% 4% round 28px)' }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 18px)' }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.9, ease: LUSION_EASE }}
            className="w-full h-full overflow-hidden relative"
          >
            <motion.img
              src={course.thumbnail || `/assets/courses/${course.slug}.svg`}
              alt={course.title}
              style={{
                y: imgParallaxY,
                scale: imgScrollScale,
              }}
              className="w-full h-full object-cover opacity-95 group-hover:opacity-100 transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform"
              loading="lazy"
            />

            {/* Floating Badges */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="absolute top-4 left-4 flex items-center gap-2 z-10"
            >
              <span className="font-mono text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-black/10 text-[#14723B] shadow-xs">
                {course.badge}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute top-4 right-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md border border-black/10 font-mono text-xs font-bold text-[#D97706] shadow-xs z-10"
            >
              <Star className="w-3.5 h-3.5 fill-[#D97706] text-[#D97706]" />
              <span>{course.rating || 4.9}</span>
            </motion.div>

            {/* Bottom Overlay Bar */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent flex items-center justify-between text-xs font-mono text-white z-10">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#43C170]" />
                {course.duration}
              </span>
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[#43C170]" />
                {course.liveProjectsCount || 3} Client Projects
              </span>
            </div>
          </motion.div>
        </Link>

        {/* Lusion `.project-item-line-1` Metadata Header */}
        <LusionMaskLine delay={0.05}>
          <div
            className="font-mono text-[11px] uppercase tracking-[0.14em] font-bold mb-2 flex items-center gap-2"
            style={{ color: theme.text }}
          >
            <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: theme.primary }} />
            <span>
              {course.category} • {course.curriculum?.length || 4} MODULES • LIVE REPO
            </span>
          </div>
        </LusionMaskLine>

        {/* Lusion `.project-item-line-2`: Kinetic Arrow Icon + Rolling Character Title */}
        <h3 className="text-2xl sm:text-3xl font-black text-[#111111] leading-tight font-heading mb-3">
          <Link to={`/courses/${course.slug}`} className="flex items-start gap-2.5 group/title">
            <span
              className={`inline-flex items-center justify-center shrink-0 mt-1.5 transition-all duration-500 overflow-hidden ${
                hovered ? 'w-7 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-3'
              }`}
              style={{
                color: theme.primary,
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
              aria-hidden="true"
            >
              <ArrowRight className="w-6 h-6 stroke-[2.5]" />
            </span>
            <LusionSlotText text={course.title} hovered={hovered} accentColor={theme.primary} />
          </Link>
        </h3>

        {/* Description (Masked Line Reveal) */}
        <LusionMaskLine delay={0.12} className="mb-4">
          <p className="text-xs sm:text-sm text-[#666666] line-clamp-2 leading-relaxed font-light">
            {course.shortDescription}
          </p>
        </LusionMaskLine>

        {/* Tech Stack Chips with Staggered Pop */}
        <div className="flex flex-wrap gap-1.5 mb-6">
          {(course.tools || []).slice(0, 4).map((tool, tIdx) => (
            <motion.span
              key={tIdx}
              initial={{ opacity: 0, scale: 0.85, y: 8 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.1 + tIdx * 0.05, ease: LUSION_EASE }}
              whileHover={{ y: -2, scale: 1.05 }}
              className="px-2.5 py-0.5 rounded-md text-[11px] font-mono bg-slate-100 text-slate-700 border border-slate-200 hover:border-emerald-400/60 transition-colors"
            >
              {tool}
            </motion.span>
          ))}
        </div>

        {/* Card Footer: Pricing & Magnetic CTAs */}
        <LusionDivider className="mb-4" />
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#888888] block">Tuition Starts At</span>
            <span className="text-xl font-black text-[#111111] font-mono font-heading">
              {course.startingFeeFormatted || `₹${(course.startingFee || 5999).toLocaleString('en-IN')}`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <LusionMagnetic strength={6}>
              <button
                type="button"
                onClick={() => onOpenSyllabus(course.slug)}
                className="px-3.5 py-2 rounded-full text-xs font-mono uppercase tracking-wider text-[#555555] hover:text-[#111111] border border-black/10 hover:border-black/30 transition-all bg-white cursor-pointer"
              >
                Syllabus
              </button>
            </LusionMagnetic>
            <LusionMagnetic strength={7}>
              <Link
                to={`/enrol?course=${course.slug}`}
                className="lusion-cta-btn !py-2 !px-4 !text-xs !gap-2 shadow-xs"
              >
                <span className="cta-dot" />
                <span className="cta-text">Enrol</span>
                <span className="cta-arrow">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </LusionMagnetic>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
