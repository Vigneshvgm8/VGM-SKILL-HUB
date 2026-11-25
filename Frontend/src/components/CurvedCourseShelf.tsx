import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { CourseItem } from '../config/coursesData.js';
import { 
  ArrowLeft, 
  ArrowRight, 
  ArrowUpRight, 
  BookOpen, 
  X, 
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { CoursePurchaseModal } from './CoursePurchaseModal.js';

interface CurvedCourseShelfProps {
  courses: CourseItem[];
  onSelectCourse?: (course: CourseItem) => void;
}

// Domain visual codes
const DOMAIN_CODES: Record<string, string> = {
  'Mobile Development': 'MBL-01',
  'Full-Stack Web': 'FST-02',
  'AI & Data Science': 'DAT-03',
  'Cloud & DevOps': 'CLD-04',
  'Cybersecurity': 'SEC-05',
  'UI/UX Design': 'DES-06',
};

// Course artwork map
const COURSE_ARTWORK: Record<string, string> = {
  'ai-mobile-app': '/assets/courses/ai-mobile-app.svg',
  'full-stack-web-ai': '/assets/courses/fullstack-ai-web.svg',
  'fullstack-ai-web': '/assets/courses/fullstack-ai-web.svg',
  'python-ai-engineering': '/assets/courses/data-science-ai.svg',
  'data-science-ai': '/assets/courses/data-science-ai.svg',
  'cloud-devops-linux': '/assets/courses/cloud-devops.svg',
  'cloud-devops': '/assets/courses/cloud-devops.svg',
  'ui-ux-design-frontend': '/assets/courses/uiux-product-design.svg',
  'uiux-product-design': '/assets/courses/uiux-product-design.svg',
  'cybersecurity-ethical-hacking': '/assets/courses/cybersecurity-defensive.svg',
  'cybersecurity-defensive': '/assets/courses/cybersecurity-defensive.svg',
};

// Hardcover Color Palettes
const ARCHIVE_THEMES: Record<string, {
  spineBg: string;
  coverBg: string;
  accent: string;
  accentLight: string;
}> = {
  'Full-Stack Web': {
    spineBg: '#1E1B2E',
    coverBg: 'linear-gradient(150deg, #161326 0%, #251B42 50%, #110E1F 100%)',
    accent: '#8B5CF6',
    accentLight: '#DDD6FE',
  },
  'Mobile Development': {
    spineBg: '#13283E',
    coverBg: 'linear-gradient(150deg, #0F2033 0%, #173250 50%, #0A1624 100%)',
    accent: '#0284C7',
    accentLight: '#BAE6FD',
  },
  'AI & Data Science': {
    spineBg: '#122E22',
    coverBg: 'linear-gradient(150deg, #0D241A 0%, #153E2B 50%, #081711 100%)',
    accent: '#1E9E54',
    accentLight: '#BBF7D0',
  },
  'Cloud & DevOps': {
    spineBg: '#382214',
    coverBg: 'linear-gradient(150deg, #2A170C 0%, #4D2B14 50%, #1B0F07 100%)',
    accent: '#D97706',
    accentLight: '#FDE68A',
  },
  'Cybersecurity': {
    spineBg: '#361520',
    coverBg: 'linear-gradient(150deg, #290F17 0%, #471927 50%, #1A090F 100%)',
    accent: '#E11D48',
    accentLight: '#FECDD3',
  },
  'UI/UX Design': {
    spineBg: '#33152C',
    coverBg: 'linear-gradient(150deg, #280E22 0%, #47183C 50%, #190916 100%)',
    accent: '#DB2777',
    accentLight: '#FBCFE8',
  },
};

// Ink blot circles configuration (proportional to 600x850 aspect ratio)
const INK_CIRCLES = [
  { cx: 300, cy: 410, delay: 0 },
  { cx: 190, cy: 240, delay: 50 },
  { cx: 410, cy: 260, delay: 100 },
  { cx: 200, cy: 580, delay: 150 },
  { cx: 400, cy: 570, delay: 200 },
  { cx: 300, cy: 180, delay: 260 },
  { cx: 300, cy: 690, delay: 310 },
];

// ── Isolated Ink Blot Poster Subcomponent ────────────────────────────
// Features organic ragged-edge ink bleed animation that spreads out across the hardcover face
const InkBlotPoster: React.FC<{
  course: CourseItem;
  theme: typeof ARCHIVE_THEMES[string];
  domainCode: string;
  artworkSrc: string;
  inkStarted: boolean;
  prefersReduced: boolean;
}> = ({ course, theme, domainCode, artworkSrc, inkStarted, prefersReduced }) => {
  const circleRefs = useRef<(SVGCircleElement | null)[]>([]);
  const [animDone, setAnimDone] = useState(prefersReduced);

  useEffect(() => {
    if (prefersReduced) {
      setAnimDone(true);
      return;
    }

    if (!inkStarted) {
      setAnimDone(false);
      circleRefs.current.forEach((el) => el?.setAttribute('r', '0'));
      return;
    }

    let rafId: number;
    const startTime = performance.now();
    const duration = 1250;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      circleRefs.current.forEach((circleEl, i) => {
        if (!circleEl) return;
        const c = INK_CIRCLES[i];
        const circleElapsed = Math.max(0, elapsed - c.delay);
        const p = Math.min(1, circleElapsed / duration);
        const ease = 1 - Math.pow(1 - p, 3); // ease-out cubic
        const r = Math.round(ease * 720);
        circleEl.setAttribute('r', `${r}`);
      });

      if (elapsed < duration + 350) {
        rafId = requestAnimationFrame(animate);
      } else {
        circleRefs.current.forEach((circleEl) => {
          circleEl?.setAttribute('r', '720');
        });
        setAnimDone(true);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [inkStarted, prefersReduced]);

  const maskId = `ink-mask-${course.id}`;
  const filterId = `ink-filter-${course.id}`;

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Archival Paper Mat Frame */}
      <div className="relative w-full max-w-[340px] sm:max-w-[380px] aspect-[1/1.42] rounded-2xl overflow-hidden bg-[#EFECE6] border border-black/10 shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-3 sm:p-4 flex items-center justify-center select-none">
        
        {/* SVG Defs for Ragged Noise Mask */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 600 850"
          style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden' }}
          aria-hidden="true"
        >
          <defs>
            <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.04"
                numOctaves={4}
                seed={17}
                result="noise"
              />
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={36}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width="600" height="850">
              <rect width="600" height="850" fill="black" />
              <g filter={`url(#${filterId})`}>
                {INK_CIRCLES.map((circle, i) => (
                  <circle
                    key={i}
                    ref={(el) => {
                      circleRefs.current[i] = el;
                    }}
                    cx={circle.cx}
                    cy={circle.cy}
                    r={prefersReduced ? 720 : 0}
                    fill="white"
                  />
                ))}
              </g>
            </mask>
          </defs>
        </svg>

        {/* Poster Plate - Pixel-Perfect Replica of the Hardcover Book Cover */}
        <div
          className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl flex flex-col justify-between p-4 sm:p-5 transition-opacity duration-300"
          style={{
            background: theme.coverBg,
            maskImage: animDone ? 'none' : `url(#${maskId})`,
            WebkitMaskImage: animDone ? 'none' : `url(#${maskId})`,
            opacity: inkStarted || prefersReduced ? 1 : 0,
            transform: inkStarted || prefersReduced ? 'scale(1)' : 'scale(0.97)',
            transition: 'opacity 0.4s ease-out, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Left Bound Hardcover Spine Cylinder Highlight */}
          <div
            className="pointer-events-none absolute left-0 top-0 bottom-0 w-[18px] rounded-l-md z-30 overflow-hidden shadow-[inset_1px_0_1px_rgba(255,255,255,0.25),inset_-2px_0_4px_rgba(0,0,0,0.7)]"
            style={{
              background:
                'linear-gradient(to right, rgba(8,16,26,0.95) 0%, rgba(35,65,95,0.75) 35%, rgba(15,25,38,0.4) 65%, rgba(0,0,0,0.85) 90%, rgba(0,0,0,0.95) 100%)',
            }}
          >
            <div className="absolute right-0 top-0 bottom-0 w-[1.5px] bg-black/80" />
            <div className="absolute right-[2px] top-0 bottom-0 w-[1px] bg-white/20" />
          </div>

          {/* Top Header */}
          <div className="relative z-10 pl-3 flex items-center justify-between border-b border-white/12 pb-2">
            <span className="font-mono text-[9px] sm:text-[9.5px] uppercase tracking-[0.2em] text-[#94A3B8] font-bold">
              VGM TECH PRESS · 2026
            </span>
            <span className="font-mono text-[9px] sm:text-[9.5px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-white/10 border border-white/25 text-white font-bold">
              {domainCode}
            </span>
          </div>

          {/* Artwork Card Screen (Phone / Code / AI Illustration) */}
          <div className="relative z-10 pl-3 my-auto py-1">
            <div className="w-full h-32 sm:h-38 rounded-xl overflow-hidden bg-[#08121E] border border-cyan-950/70 shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_8px_20px_rgba(0,0,0,0.4)] flex items-center justify-center p-2">
              <img
                src={artworkSrc}
                alt={course.title}
                className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                loading="eager"
              />
            </div>

            {/* Category Radar Dot Indicator */}
            <div className="mt-2.5 flex items-center justify-center gap-2">
              <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-teal-500/50" />
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
              </div>
              <span className="font-mono text-[9px] sm:text-[9.5px] font-bold tracking-[0.2em] uppercase text-white/90">
                {course.category}
              </span>
            </div>
          </div>

          {/* Bottom Course Information */}
          <div className="relative z-10 pl-3 border-t border-white/12 pt-2.5 text-white space-y-1">
            <h3 className="font-heading font-black text-sm sm:text-base leading-tight line-clamp-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] text-white">
              {course.title}
            </h3>
            <p className="text-[10.5px] text-slate-300 line-clamp-2 leading-relaxed">
              {course.headline}
            </p>
            <div className="pt-2 flex items-center justify-between border-t border-white/10 text-slate-400 font-mono text-[8px] sm:text-[8.5px] uppercase tracking-wider">
              <span>{course.duration}</span>
              <span className="text-white/60">VGM · 2026</span>
            </div>
          </div>

          {/* Sheen & Lighting */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/15 opacity-60" />
        </div>
      </div>
    </div>
  );
};

export const CurvedCourseShelf: React.FC<CurvedCourseShelfProps> = ({
  courses,
}) => {
  const navigate = useNavigate();
  const N = courses.length || 1;

  const START_INDEX = Math.floor(N / 2);

  const stateRef = useRef({
    s: START_INDEX,
    T: START_INDEX,
    isDragging: false,
    hasDragged: false,
    dragStartX: 0,
    dragStartY: 0,
    dragStartT: START_INDEX,
    lastTime: performance.now(),
    tiltX: 0,
    tiltY: 0,
    targetTiltX: 0,
    targetTiltY: 0,
    hoveredIndex: -1,
    liftValues: new Float32Array(N),
  });

  const [activeIndex, setActiveIndex] = useState<number>(START_INDEX);
  const containerRef = useRef<HTMLDivElement>(null);
  const shelfStageRef = useRef<HTMLDivElement>(null);
  const tapeRefs = useRef<(HTMLDivElement | null)[]>([]);

  // ── Book Open Detail Sheet State ────────────────────────────────────
  const [sheetState, setSheetState] = useState<'closed' | 'opening' | 'open' | 'closing'>('closed');
  const [selectedBookIndex, setSelectedBookIndex] = useState<number | null>(null);
  const [clipPathStyle, setClipPathStyle] = useState<string>('none');
  const [textRevealed, setTextRevealed] = useState<boolean>(false);
  const [inkStarted, setInkStarted] = useState<boolean>(false);
  const [purchasingCourse, setPurchasingCourse] = useState<CourseItem | null>(null);

  const sheetTimersRef = useRef<NodeJS.Timeout[]>([]);
  const coverRectRef = useRef<{ top: number; right: number; bottom: number; left: number } | null>(null);

  // Precomputed screen integral lookup table
  const xsCache = useRef<{ U: number; table: Float32Array } | null>(null);

  const getScreenX = (u: number, U: number) => {
    if (!xsCache.current || xsCache.current.U !== U) {
      const steps = Math.ceil((3 * U) / 2) + 2;
      const table = new Float32Array(steps);
      let acc = 0;
      for (let i = 0; i < steps; i++) {
        const uStep = i * 2;
        acc += 2 / (1 + Math.pow(uStep / U, 1.6));
        table[i] = acc;
      }
      xsCache.current = { U, table };
    }
    const absU = Math.abs(u);
    const idx = Math.min(Math.floor(absU / 2), xsCache.current.table.length - 1);
    const sign = u >= 0 ? 1 : -1;
    return sign * (xsCache.current.table[idx] || absU);
  };

  const smoothstep = (x: number) => {
    const t = Math.max(0, Math.min(1, x));
    return t * t * (3 - 2 * t);
  };

  // 60fps spring physics loop
  useEffect(() => {
    let animId: number;

    const tick = (now: number) => {
      const dt = Math.min((now - stateRef.current.lastTime) / 1000, 0.05);
      stateRef.current.lastTime = now;

      const st = stateRef.current;
      const prefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReduced) {
        st.s = st.T;
        st.tiltX = 0;
        st.tiltY = 0;
        for (let i = 0; i < N; i++) {
          st.liftValues[i] = st.hoveredIndex === i ? 1 : 0;
        }
      } else {
        const kSpring = st.isDragging ? 18 : 6.5;
        st.T = Math.max(0, Math.min(N - 1, st.T));
        st.s += (st.T - st.s) * (1 - Math.exp(-kSpring * dt));

        st.tiltX += (st.targetTiltX - st.tiltX) * (1 - Math.exp(-8 * dt));
        st.tiltY += (st.targetTiltY - st.tiltY) * (1 - Math.exp(-8 * dt));
      }

      const rawActive = Math.max(0, Math.min(N - 1, Math.round(st.s)));
      setActiveIndex(rawActive);

      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw <= 767;
      // --H: min(68vw, 40svh) on phones
      const H = isMobile
        ? Math.min(vw * 0.68, vh * 0.40)
        : Math.min(vh * 0.47, Math.max(350, vw * 0.28));
      const ws = H * (142 / 840);
      const d = H * (474 / 900);
      const gap = H * 0.07;
      const U = isMobile ? H * 1.1 : H * 1.4;
      const P = 1400;

      tapeRefs.current.forEach((el, v) => {
        if (!el) return;

        const r = v - st.s;
        const o = smoothstep(Math.max(0, 1 - Math.abs(r)));
        const Br =
          Math.abs(r) < 1
            ? (r + Math.sin(Math.PI * r) / Math.PI) / 2
            : r > 0
            ? 0.5
            : -0.5;
        const u = r * (ws + gap) + (d - ws + 1.4 * gap) * Br;

        const sc = 1 / (1 + Math.pow(Math.abs(u) / U, 1.6));
        const k = 1 / sc;

        const isHovered = st.hoveredIndex === v && Math.abs(r) > 0.5;
        const targetLift = isHovered ? 1 : 0;
        if (!prefersReduced) {
          st.liftValues[v] +=
            (targetLift - st.liftValues[v]) * (1 - Math.exp(-12 * dt));
        } else {
          st.liftValues[v] = targetLift;
        }
        const lift = st.liftValues[v];

        const z = P * (1 - k) + o * H * 0.12;
        const x = getScreenX(u, U) * k;
        const y =
          (H * 0.5 * (1 - sc) * 0.42 + o * H * 0.012 - lift * H * 0.05) * k;

        const spineAngle = Math.sign(u) * Math.min(1, Math.abs(u) / U) * 26;
        const rotY = spineAngle * (1 - o) - 90 * o + st.tiltY * o;
        const rotX = st.tiltX * o;

        el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, ${z.toFixed(2)}px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
        el.style.zIndex = `${Math.round(3000 + z)}`;

        const spineShade = Math.min(0.62, o * 0.55 + (1 - sc) * 0.35);
        const coverShade = (1 - o) * 0.82;

        const spineFace = el.querySelector<HTMLElement>('.sp-tape');
        const coverFace = el.querySelector<HTMLElement>('.cv-tape');
        if (spineFace) spineFace.style.setProperty('--shade', `${spineShade}`);
        if (coverFace) coverFace.style.setProperty('--shade', `${coverShade}`);
      });

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [N]);

  // Ensure body scroll is strictly restored on component unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      sheetTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // Helper to compute a reliable viewport-relative bounding box for the cover
  const computeCoverRect = (index: number) => {
    const isMobile = window.innerWidth <= 767;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // First try projected DOM rect of the cover if available and stable
    const tapeEl = tapeRefs.current[index];
    const coverEl = tapeEl?.querySelector<HTMLElement>('.cv-tape');

    if (coverEl) {
      const rect = coverEl.getBoundingClientRect();
      if (rect.width >= 100 && rect.height >= 150) {
        return {
          top: Math.max(0, Math.round(rect.top)),
          right: Math.max(0, Math.round(vw - rect.right)),
          bottom: Math.max(0, Math.round(vh - rect.bottom)),
          left: Math.max(0, Math.round(rect.left)),
        };
      }
    }

    // Accurate centered cover coordinates from 3D shelf stage
    const shelfEl = shelfStageRef.current || containerRef.current;
    const shelfRect = shelfEl?.getBoundingClientRect();
    const centerX = shelfRect
      ? shelfRect.left + shelfRect.width / 2
      : vw / 2;
    const centerY = shelfRect
      ? shelfRect.top + shelfRect.height / 2
      : vh * 0.44;

    const coverW = isMobile ? Math.min(vw * 0.72, 280) : 295;
    const coverH = isMobile ? Math.min(vw * 0.68, vh * 0.40) : 440;

    const clampTop = Math.max(0, Math.min(vh - 120, Math.round(centerY - coverH / 2)));
    const clampLeft = Math.max(0, Math.min(vw - 120, Math.round(centerX - coverW / 2)));
    const clampBottom = Math.max(0, Math.min(vh - clampTop - 80, Math.round(vh - (centerY + coverH / 2))));
    const clampRight = Math.max(0, Math.min(vw - clampLeft - 80, Math.round(vw - (centerX + coverW / 2))));

    return {
      top: clampTop,
      bottom: clampBottom,
      left: clampLeft,
      right: clampRight,
    };
  };

  // ── Open Book Detail Sheet Sequence ─────────────────────────────────
  const openBook = (index: number) => {
    const c = courses[index];
    if (!c) return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Step 1: Snap T, fill in texts, aim poster
    stateRef.current.T = index;
    stateRef.current.s = index;
    setActiveIndex(index);
    setSelectedBookIndex(index);

    sheetTimersRef.current.forEach((t) => clearTimeout(t));
    sheetTimersRef.current = [];

    // Step 2: Read projected cover rect
    const rect = computeCoverRect(index);
    coverRectRef.current = rect;
    const initialClip = `inset(${rect.top}px ${rect.right}px ${rect.bottom}px ${rect.left}px round 4px)`;

    // Prevent layout shift from scrollbar disappearing
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    document.body.style.overflow = 'hidden';

    if (prefersReduced) {
      setClipPathStyle('inset(0px 0px 0px 0px round 0px)');
      setInkStarted(true);
      setTextRevealed(true);
      setSheetState('open');
      return;
    }

    // Step 3: Animate clip-path from cover rect to inset(0 round 0) over 1050ms
    setInkStarted(false);
    setTextRevealed(false);
    setClipPathStyle(initialClip);
    setSheetState('opening');

    // Double RAF ensures initialClip is rendered and committed before transitioning
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setClipPathStyle('inset(0px 0px 0px 0px round 0px)');
      });
    });

    // Step 4: Text lines rise from translateY(110%) over 900ms (stagger delays: 620 + i*75 ms)
    const tText = setTimeout(() => {
      setTextRevealed(true);
    }, 60);
    sheetTimersRef.current.push(tText);

    // Step 5: From 520ms, ink blot circles grow from 0 to r = 720 over 1250ms (ease-out cubic)
    const tInk = setTimeout(() => {
      setInkStarted(true);
    }, 520);
    sheetTimersRef.current.push(tInk);

    // Opening animation completes at 1050ms: unclip sheet for seamless scrolling
    const tDone = setTimeout(() => {
      setSheetState('open');
      setClipPathStyle('none');
    }, 1050);
    sheetTimersRef.current.push(tDone);
  };

  // ── Close Book Sequence ─────────────────────────────────────────────
  const closeBook = () => {
    if (sheetState === 'closed' || sheetState === 'closing') return;

    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    sheetTimersRef.current.forEach((t) => clearTimeout(t));
    sheetTimersRef.current = [];

    const restoreBody = () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };

    if (prefersReduced) {
      restoreBody();
      setSheetState('closed');
      setSelectedBookIndex(null);
      setTextRevealed(false);
      setInkStarted(false);
      return;
    }

    setSheetState('closing');
    setTextRevealed(false);

    // Re-read current cover rect for reverse clip
    const idx = selectedBookIndex ?? activeIndex;
    const rect = computeCoverRect(idx);
    const targetClip = `inset(${rect.top}px ${rect.right}px ${rect.bottom}px ${rect.left}px round 4px)`;

    // Animate smoothly back from inset(0) to cover rect over 850ms
    setClipPathStyle('inset(0px 0px 0px 0px round 0px)');

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setClipPathStyle(targetClip);
      });
    });

    const tClose = setTimeout(() => {
      restoreBody();
      setSheetState('closed');
      setSelectedBookIndex(null);
      setInkStarted(false);
    }, 850);
    sheetTimersRef.current.push(tClose);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
      sheetTimersRef.current.forEach((t) => clearTimeout(t));
    };
  }, []);

  // ── Pointer handlers ────────────────────────────────────────────────
  const handlePointerDown = (e: React.PointerEvent) => {
    if (sheetState !== 'closed') return;
    const st = stateRef.current;
    st.dragStartX = e.clientX;
    st.dragStartY = e.clientY;
    st.hasDragged = false;
    st.isDragging = false;
    st.dragStartT = st.T;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (sheetState !== 'closed') return;
    const st = stateRef.current;
    if (e.buttons === 1) {
      const dx = e.clientX - st.dragStartX;
      const dy = e.clientY - st.dragStartY;
      if (!st.hasDragged && Math.hypot(dx, dy) > 6) {
        st.hasDragged = true;
        st.isDragging = true;
      }
      if (st.isDragging) {
        const H = 400;
        const ws = H * (142 / 840);
        const gap = H * 0.07;
        const newT = st.dragStartT - dx / (ws + gap);
        st.T = Math.max(0, Math.min(N - 1, newT));
      }
    } else {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const mx = e.clientX - rect.left - rect.width / 2;
        const my = e.clientY - rect.top - rect.height / 2;
        st.targetTiltY = (mx / (rect.width / 2)) * 8;
        st.targetTiltX = -(my / (rect.height / 2)) * 5;
      }
    }
  };

  const handlePointerUp = () => {
    const st = stateRef.current;
    if (st.isDragging) {
      st.isDragging = false;
      st.T = Math.max(0, Math.min(N - 1, Math.round(st.T)));
    }
    setTimeout(() => {
      stateRef.current.hasDragged = false;
    }, 60);
  };

  const handlePointerLeave = () => {
    stateRef.current.targetTiltX = 0;
    stateRef.current.targetTiltY = 0;
    stateRef.current.hoveredIndex = -1;
  };

  const step = (delta: number) => {
    const st = stateRef.current;
    st.T = Math.max(0, Math.min(N - 1, Math.round(st.T) + delta));
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (sheetState !== 'closed') closeBook();
        return;
      }
      if (sheetState !== 'closed') return;
      if (e.key === 'ArrowLeft') step(-1);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'Enter') {
        openBook(activeIndex);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, sheetState]);

  const activeCourse = courses[activeIndex] || courses[0];
  const openedCourse =
    selectedBookIndex !== null
      ? courses[selectedBookIndex] || activeCourse
      : activeCourse;

  const openedDomainCode = DOMAIN_CODES[openedCourse.category] || 'TRK-2026';
  const openedArtwork =
    COURSE_ARTWORK[openedCourse.slug] ||
    openedCourse.thumbnail ||
    '/assets/courses/ai-mobile-app.svg';

  const openedTheme =
    ARCHIVE_THEMES[openedCourse.category] || ARCHIVE_THEMES['AI & Data Science'];

  const prefersReduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── Render Detail Sheet as a Portal directly into document.body ───────
  const renderDetailSheetPortal = () => {
    if (sheetState === 'closed' || typeof document === 'undefined') return null;

    const sheetContent = (
      <div
        className="fixed inset-0 z-[999999] h-screen h-[100dvh] w-full overflow-hidden bg-[#FAF9F5] text-[#111111] flex flex-col shadow-2xl"
        style={{
          clipPath: sheetState === 'open' ? 'none' : clipPathStyle,
          WebkitClipPath: sheetState === 'open' ? 'none' : clipPathStyle,
          transition: prefersReduced
            ? 'none'
            : sheetState === 'closing'
            ? 'clip-path 850ms cubic-bezier(.76,0,.18,1), -webkit-clip-path 850ms cubic-bezier(.76,0,.18,1)'
            : 'clip-path 1050ms cubic-bezier(.76,0,.18,1), -webkit-clip-path 1050ms cubic-bezier(.76,0,.18,1)',
          willChange: 'clip-path',
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeBook();
        }}
      >
        {/* Top Bar: 60px height, 16px padding on phones, brand line 22px */}
        <header className="h-[60px] px-4 sm:px-8 border-b border-black/10 flex items-center justify-between shrink-0 bg-[#FAF9F5]/95 backdrop-blur-md z-30 select-none">
          <div className="flex items-center gap-3">
            <span className="font-heading font-black text-[22px] sm:text-lg tracking-tight text-[#111111]">
              VGM TECH PRESS
            </span>
            <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-widest text-[#888888] border-l border-black/15 pl-3">
              ARCHIVE SPEC SHEET · 2026
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/5 text-[#111111] border border-black/10">
              {openedDomainCode}
            </span>

            <button
              type="button"
              onClick={closeBook}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/5 hover:bg-black/10 active:scale-95 text-xs font-mono font-bold tracking-wider uppercase text-[#111111] transition-all cursor-pointer"
              aria-label="Close book"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">CLOSE [ESC]</span>
            </button>
          </div>
        </header>

        {/* Sheet Body: Single scrolling column on phones, 2 columns on desktop */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 sm:py-10 pb-24 sm:pb-16 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
            
            {/* Left Column: Full Cover Poster with Ragged Ink Bleed Animation */}
            <div className="lg:col-span-5 w-full flex flex-col items-center">
              <InkBlotPoster
                course={openedCourse}
                theme={openedTheme}
                domainCode={openedDomainCode}
                artworkSrc={openedArtwork}
                inkStarted={inkStarted}
                prefersReduced={prefersReduced}
              />

              {/* Sub-poster badge strip */}
              <div className="w-full mt-4 flex items-center justify-between text-[10px] font-mono text-[#777777] border-b border-black/10 pb-3">
                <span>STATUS: {openedCourse.status.toUpperCase()}</span>
                <span>CLASS SIZE: 20 SEATS</span>
                <span>EDITION: VERIFIED</span>
              </div>
            </div>

            {/* Right Column: Rising Staggered Typography Lines */}
            <div className="lg:col-span-7 flex flex-col space-y-5">
              
              {/* Line 0: Category & Domain Pill */}
              <div className="overflow-hidden">
                <div
                  style={{
                    transform: textRevealed ? 'translateY(0%)' : 'translateY(110%)',
                    opacity: textRevealed ? 1 : 0,
                    transition: prefersReduced
                      ? 'none'
                      : `transform 900ms cubic-bezier(0.16, 1, 0.3, 1) 620ms, opacity 900ms ease 620ms`,
                  }}
                  className="flex flex-wrap items-center gap-2"
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-[#1E9E54] font-bold px-2.5 py-1 rounded-sm bg-[#1E9E54]/10 border border-[#1E9E54]/20">
                    {openedDomainCode} · {openedCourse.category}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#666666] px-2.5 py-1 rounded-sm bg-black/5">
                    {openedCourse.duration}
                  </span>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#666666] px-2.5 py-1 rounded-sm bg-black/5">
                    {openedCourse.mode}
                  </span>
                </div>
              </div>

              {/* Line 1: Giant Editorial Course Title (42px on phones) */}
              <div className="overflow-hidden">
                <div
                  style={{
                    transform: textRevealed ? 'translateY(0%)' : 'translateY(110%)',
                    opacity: textRevealed ? 1 : 0,
                    transition: prefersReduced
                      ? 'none'
                      : `transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${620 + 75}ms, opacity 900ms ease ${620 + 75}ms`,
                  }}
                >
                  <h1 className="font-heading font-black text-[42px] sm:text-5xl lg:text-6xl text-[#111111] leading-[1.1] tracking-tight pb-1">
                    {openedCourse.title}
                  </h1>
                </div>
              </div>

              {/* Line 2: Headline / Value Proposition */}
              <div className="overflow-hidden">
                <div
                  style={{
                    transform: textRevealed ? 'translateY(0%)' : 'translateY(110%)',
                    opacity: textRevealed ? 1 : 0,
                    transition: prefersReduced
                      ? 'none'
                      : `transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${620 + 150}ms, opacity 900ms ease ${620 + 150}ms`,
                  }}
                >
                  <p className="text-base sm:text-lg font-medium text-[#444444] leading-snug">
                    {openedCourse.headline}
                  </p>
                </div>
              </div>

              {/* Line 3: Description Paragraph */}
              <div className="overflow-hidden">
                <div
                  style={{
                    transform: textRevealed ? 'translateY(0%)' : 'translateY(110%)',
                    opacity: textRevealed ? 1 : 0,
                    transition: prefersReduced
                      ? 'none'
                      : `transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${620 + 225}ms, opacity 900ms ease ${620 + 225}ms`,
                  }}
                >
                  <p className="text-sm text-[#666666] leading-relaxed">
                    {openedCourse.shortDescription} {openedCourse.fullDescription?.slice(0, 180)}...
                  </p>
                </div>
              </div>

              {/* Line 4: Specs Matrix (4 Data Points) */}
              <div className="overflow-hidden">
                <div
                  style={{
                    transform: textRevealed ? 'translateY(0%)' : 'translateY(110%)',
                    opacity: textRevealed ? 1 : 0,
                    transition: prefersReduced
                      ? 'none'
                      : `transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${620 + 300}ms, opacity 900ms ease ${620 + 300}ms`,
                  }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-2 border-y border-black/10"
                >
                  <div className="p-2.5 rounded-lg bg-black/[0.03]">
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-[#888888]">
                      LEVEL
                    </span>
                    <span className="font-heading font-bold text-xs sm:text-sm text-[#111111]">
                      {openedCourse.level}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/[0.03]">
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-[#888888]">
                      LIVE PROJECTS
                    </span>
                    <span className="font-heading font-bold text-xs sm:text-sm text-[#111111]">
                      {openedCourse.liveProjectsCount}+ Apps / Labs
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/[0.03]">
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-[#888888]">
                      CAREER PACKAGE
                    </span>
                    <span className="font-heading font-bold text-xs sm:text-sm text-[#1E9E54]">
                      {openedCourse.averagePackage}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-black/[0.03]">
                    <span className="block font-mono text-[9px] uppercase tracking-wider text-[#888888]">
                      NEXT COHORT
                    </span>
                    <span className="font-heading font-bold text-xs sm:text-sm text-[#111111]">
                      {openedCourse.nextBatch}
                    </span>
                  </div>
                </div>
              </div>

              {/* Line 5: Tech Stack Pills */}
              <div className="overflow-hidden">
                <div
                  style={{
                    transform: textRevealed ? 'translateY(0%)' : 'translateY(110%)',
                    opacity: textRevealed ? 1 : 0,
                    transition: prefersReduced
                      ? 'none'
                      : `transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${620 + 375}ms, opacity 900ms ease ${620 + 375}ms`,
                  }}
                >
                  <span className="block font-mono text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-2">
                    CORE TECHNOLOGY STACK:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {openedCourse.tools?.map((tool, idx) => (
                      <span
                        key={idx}
                        className="font-mono text-xs px-2.5 py-1 rounded-sm bg-black/5 text-[#111111] border border-black/10"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Line 6: Curriculum Module Preview */}
              <div className="overflow-hidden">
                <div
                  style={{
                    transform: textRevealed ? 'translateY(0%)' : 'translateY(110%)',
                    opacity: textRevealed ? 1 : 0,
                    transition: prefersReduced
                      ? 'none'
                      : `transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${620 + 450}ms, opacity 900ms ease ${620 + 450}ms`,
                  }}
                  className="p-3.5 rounded-xl bg-black/[0.02] border border-black/10 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-[#111111]">
                    <span>CURRICULUM SYLLABUS HIGHLIGHTS</span>
                    <span className="text-[#1E9E54]">{openedCourse.curriculum?.length || 4} PHASES</span>
                  </div>
                  <div className="space-y-1.5 text-xs text-[#555555]">
                    {openedCourse.curriculum?.slice(0, 3).map((mod) => (
                      <div key={mod.moduleNumber} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1E9E54] shrink-0" />
                        <span className="font-semibold text-[#111111]">Mod 0{mod.moduleNumber}:</span>
                        <span className="line-clamp-1">{mod.title}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Line 7: Action CTA Buttons */}
              <div className="overflow-hidden pt-2">
                <div
                  style={{
                    transform: textRevealed ? 'translateY(0%)' : 'translateY(110%)',
                    opacity: textRevealed ? 1 : 0,
                    transition: prefersReduced
                      ? 'none'
                      : `transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${620 + 525}ms, opacity 900ms ease ${620 + 525}ms`,
                  }}
                  className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2"
                >
                  <button
                    type="button"
                    onClick={() => {
                      document.body.style.overflow = '';
                      document.body.style.paddingRight = '';
                      setPurchasingCourse(openedCourse);
                    }}
                    className="px-8 py-3.5 rounded-full bg-[#1E9E54] text-white hover:bg-[#14723B] text-xs font-mono font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all text-center cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>PURCHASE COURSE (1–3 MO)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      document.body.style.overflow = '';
                      document.body.style.paddingRight = '';
                      navigate(`/enrol?course=${openedCourse.slug}&type=internship`);
                    }}
                    className="px-6 py-3.5 rounded-full bg-[#111111] text-white hover:bg-black/80 text-xs font-mono font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all text-center cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>INTERNSHIP ENROLMENT</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      document.body.style.overflow = '';
                      document.body.style.paddingRight = '';
                      navigate(`/courses/${openedCourse.slug}`);
                    }}
                    className="px-6 py-3.5 rounded-full bg-white text-[#111111] hover:bg-black/5 border border-black/15 text-xs font-mono font-bold uppercase tracking-wider transition-all text-center cursor-pointer flex items-center justify-center gap-2"
                  >
                    <span>FULL CURRICULUM PAGE</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={closeBook}
                    className="px-4 py-3.5 text-xs font-mono text-[#888888] hover:text-[#111111] uppercase tracking-wider transition-colors cursor-pointer text-center"
                  >
                    CLOSE BOOK
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    );

    return createPortal(sheetContent, document.body);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none py-8 sm:py-14"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      style={{ touchAction: 'pan-y' }}
    >

      {/* ── Soft floor shadow ── */}
      <div
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[60%] w-[420px] sm:w-[540px] h-[75px] rounded-full z-0 opacity-40 blur-2xl"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(30,24,18,0.5) 0%, rgba(30,158,84,0.2) 40%, transparent 72%)',
        }}
      />

      {/* ── 3D Perspective Shelf Arc ── */}
      <div
        ref={shelfStageRef}
        className="relative z-10 w-full h-[400px] sm:h-[460px] flex items-center justify-center"
        style={{ perspective: '1400px' }}
      >
        <div className="relative w-0 h-0" style={{ transformStyle: 'preserve-3d' }}>
          {courses.map((course, v) => {
            const theme =
              ARCHIVE_THEMES[course.category] || ARCHIVE_THEMES['AI & Data Science'];
            const domainCode = DOMAIN_CODES[course.category] || 'TRK-2026';
            const artworkSrc =
              COURSE_ARTWORK[course.slug] || course.thumbnail || '/assets/courses/ai-mobile-app.svg';
            const isActive = v === activeIndex;

            return (
              <div
                key={course.id}
                ref={(el) => {
                  tapeRefs.current[v] = el;
                }}
                onPointerEnter={() => {
                  stateRef.current.hoveredIndex = v;
                }}
                className="absolute left-0 top-0"
                style={{
                  transformStyle: 'preserve-3d',
                  transformOrigin: 'center center',
                }}
              >
                {/* ── SPINE ── clicking snaps book to center; clicking active opens book ── */}
                <div
                  className="sp-tape absolute top-[-200px] sm:top-[-225px] left-[-35px] w-[70px] sm:w-[76px] h-[400px] sm:h-[450px] rounded-xs overflow-hidden flex flex-col justify-between p-3.5 border border-black/30 shadow-[inset_1px_0_2px_rgba(255,255,255,0.18),inset_-2px_0_4px_rgba(0,0,0,0.4),0_15px_30px_rgba(0,0,0,0.25)] hover:shadow-2xl cursor-pointer transition-shadow select-none"
                  style={{
                    backgroundColor: theme.spineBg,
                    transform: 'translateZ(135px)',
                    backfaceVisibility: 'hidden',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (stateRef.current.hasDragged) return;
                    if (isActive) {
                      openBook(v);
                    } else {
                      stateRef.current.T = v;
                    }
                  }}
                  title={isActive ? `Open ${course.title}` : `Select ${course.title}`}
                >
                  <div className="flex flex-col items-center gap-1.5 border-b border-white/20 pb-2.5">
                    <div className="w-5 h-5 rounded-full border border-white/40 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-white/80" />
                    </div>
                    <span className="font-mono text-[8px] font-bold tracking-widest text-white/90 uppercase">
                      {domainCode}
                    </span>
                  </div>

                  <div className="my-auto flex items-center justify-center py-2">
                    <span
                      className="font-heading font-black text-xs sm:text-[13px] tracking-wider uppercase text-white/95 whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        letterSpacing: '0.09em',
                      }}
                    >
                      {course.title}
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-1.5 border-t border-white/20 pt-2.5 text-center">
                    <span className="font-mono text-[8px] uppercase tracking-wider text-white/70">
                      {course.duration.split(' ')[0]} MOS
                    </span>
                    <span className="font-mono text-[7px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded-xs border border-white/40 bg-black/30 text-white">
                      VGM
                    </span>
                  </div>

                  {/* Shade overlay */}
                  <div
                    className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-150"
                    style={{ opacity: 'var(--shade, 0)' }}
                  />
                </div>

                {/* ── FRONT COVER ── Exact Replica of the Hardcover Specification (Clicking ANY area opens book) ── */}
                <div
                  className="cv-tape absolute top-[-200px] sm:top-[-225px] left-[-135px] w-[270px] sm:w-[295px] h-[400px] sm:h-[450px] rounded-r-xl rounded-l-md overflow-hidden flex flex-col justify-between p-4 sm:p-5 border border-white/15 shadow-[0_30px_70px_rgba(0,0,0,0.45),0_10px_20px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,0.2)] group hover:scale-[1.01] transition-transform duration-300 cursor-pointer select-none"
                  style={{
                    background: theme.coverBg,
                    transform: 'rotateY(90deg) translateZ(35px)',
                    backfaceVisibility: 'hidden',
                  }}
                  title={`Click to Open Book: ${course.title}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (stateRef.current.hasDragged) return;
                    openBook(v);
                  }}
                >
                  {/* Realistic Bound Hardcover Spine Cylinder Hinge on the left */}
                  <div
                    className="pointer-events-none absolute left-0 top-0 bottom-0 w-[20px] rounded-l-md z-30 overflow-hidden shadow-[inset_1px_0_1px_rgba(255,255,255,0.25),inset_-2px_0_4px_rgba(0,0,0,0.7)]"
                    style={{
                      background:
                        'linear-gradient(to right, rgba(8,16,26,0.95) 0%, rgba(35,65,95,0.75) 35%, rgba(15,25,38,0.4) 65%, rgba(0,0,0,0.85) 90%, rgba(0,0,0,0.95) 100%)',
                    }}
                  >
                    <div className="absolute right-0 top-0 bottom-0 w-[1.5px] bg-black/80" />
                    <div className="absolute right-[2px] top-0 bottom-0 w-[1px] bg-white/20" />
                  </div>

                  {/* Top Header: Brand Line + Domain Code Badge */}
                  <div className="relative z-10 pl-3 flex items-center justify-between border-b border-white/12 pb-2">
                    <span className="font-mono text-[8.5px] sm:text-[9px] uppercase tracking-[0.2em] text-[#94A3B8] font-bold">
                      VGM TECH PRESS · 2026
                    </span>
                    <span className="font-mono text-[8.5px] sm:text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm bg-white/5 border border-white/25 text-white/90 font-bold">
                      {domainCode}
                    </span>
                  </div>

                  {/* Artwork Card Screen (Phone / Code / AI Illustration) */}
                  <div className="relative z-10 pl-3 my-auto py-1.5">
                    <div className="w-full h-32 sm:h-36 rounded-xl overflow-hidden bg-[#08121E] border border-cyan-950/70 shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_8px_20px_rgba(0,0,0,0.4)] flex items-center justify-center p-2 group-hover:scale-[1.015] transition-transform duration-300">
                      <img
                        src={artworkSrc}
                        alt={course.title}
                        className="w-full h-full object-contain filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
                        loading="eager"
                      />
                    </div>

                    {/* Category Radar Dot Indicator */}
                    <div className="mt-2.5 flex items-center justify-center gap-2">
                      <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border border-teal-500/50" />
                        <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_6px_#10B981]" />
                      </div>
                      <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-white/90">
                        {course.category}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Course Information */}
                  <div className="relative z-10 pl-3 border-t border-white/12 pt-2 text-white space-y-1">
                    <h3 className="font-heading font-black text-sm sm:text-base leading-tight line-clamp-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.7)] group-hover:text-emerald-400 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-[10.5px] text-slate-300 line-clamp-2 leading-relaxed">
                      {course.headline}
                    </p>
                    <div className="pt-2 flex items-center justify-between border-t border-white/10 text-slate-400 font-mono text-[8px] sm:text-[8.5px] uppercase tracking-wider">
                      <span>{course.duration}</span>
                      <span className="text-white/60">VGM · 2026</span>
                    </div>
                  </div>

                  {/* Realistic Lighting & Spine Sheen */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/15 opacity-60" />
                  <div
                    className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-150"
                    style={{ opacity: 'var(--shade, 0)' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Caption + Navigation Buttons ── */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center mt-6 sm:mt-8">
        <div className="flex items-center justify-between max-w-xl mx-auto">
          {/* Left Arrow Button (Drops to bottom-118px on phones) */}
          <button
            type="button"
            disabled={activeIndex === 0}
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className={`fixed sm:static bottom-[118px] left-4 z-20 p-3 sm:p-3 rounded-full bg-white text-[#111111] border border-black/10 shadow-lg sm:shadow-sm transition-all focus:outline-hidden ${
              activeIndex === 0
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-black/5 hover:scale-110 active:scale-95 cursor-pointer'
            }`}
            aria-label="Previous Course"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
          </button>

          <div className="flex-1 px-4 select-none">
            <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-[#1E9E54] font-bold">
              {DOMAIN_CODES[activeCourse.category] || 'TRK-2026'} · {activeCourse.category}
            </span>
            {/* Title: 27px on phones */}
            <h2 className="font-heading font-black text-[27px] sm:text-3xl text-[#111111] tracking-tight mt-0.5">
              {activeCourse.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#666666] max-w-md mx-auto line-clamp-1 mt-1">
              {activeCourse.shortDescription}
            </p>

            {/* Prominent Open Book CTA Button */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
              <button
                type="button"
                onClick={() => setPurchasingCourse(activeCourse)}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#1E9E54] hover:bg-[#14723B] text-white text-xs font-mono font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>PURCHASE COURSE</span>
              </button>

              <button
                type="button"
                onClick={() => openBook(activeIndex)}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#111111] text-white hover:bg-[#1E9E54] text-xs font-mono font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all cursor-pointer group"
              >
                <BookOpen className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>OPEN BOOK</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => navigate(`/courses/${activeCourse.slug}`)}
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-[#666666] hover:text-[#111111] font-semibold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <span>Curriculum Page</span>
              </button>
            </div>
          </div>

          {/* Right Arrow Button (Drops to bottom-118px on phones) */}
          <button
            type="button"
            disabled={activeIndex === N - 1}
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className={`fixed sm:static bottom-[118px] right-4 z-20 p-3 sm:p-3 rounded-full bg-white text-[#111111] border border-black/10 shadow-lg sm:shadow-sm transition-all focus:outline-hidden ${
              activeIndex === N - 1
                ? 'opacity-30 cursor-not-allowed'
                : 'hover:bg-black/5 hover:scale-110 active:scale-95 cursor-pointer'
            }`}
            aria-label="Next Course"
          >
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* ── Course Track Timeline ── */}
      {/* 16px sides, bottom 54px on phones, alternate labels hidden on phones */}
      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-6 mb-[54px] sm:mb-8 mt-8 sm:mt-10">
        <div className="relative h-10 flex items-center">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-black/15" />

          {/* Gliding dot */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#1E9E54] border-2 border-white shadow-md transition-all duration-300 ease-out z-20 pointer-events-none"
            style={{ left: `${(activeIndex / (N - 1 || 1)) * 100}%` }}
          />

          {/* Track nodes */}
          <div className="relative w-full flex items-center justify-between z-10">
            {courses.map((c, i) => {
              const isSelected = i === activeIndex;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    stateRef.current.T = i;
                  }}
                  className="flex flex-col items-center group cursor-pointer focus:outline-hidden"
                >
                  <span
                    className={`w-[1.5px] transition-all duration-200 ${
                      isSelected
                        ? 'h-5 bg-[#1E9E54]'
                        : 'h-2.5 bg-black/30 group-hover:bg-black/60 group-hover:h-3.5'
                    }`}
                  />
                  {/* Alternate labels hidden on phones */}
                  <span
                    className={`text-[9px] font-mono tracking-wider mt-2 transition-colors ${
                      i % 2 === 1 ? 'hidden sm:inline-block' : 'inline-block'
                    } ${
                      isSelected
                        ? 'font-bold text-[#1E9E54]'
                        : 'text-[#888888] group-hover:text-[#111111]'
                    }`}
                  >
                    0{i + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Render Detail Sheet Modal Portal ── */}
      {renderDetailSheetPortal()}

      {/* ── Render Course Individual Purchase 3-Tier Modal ── */}
      {purchasingCourse && (
        <CoursePurchaseModal
          course={purchasingCourse}
          isOpen={Boolean(purchasingCourse)}
          onClose={() => setPurchasingCourse(null)}
        />
      )}
    </div>
  );
};
