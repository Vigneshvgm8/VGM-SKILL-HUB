import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'motion/react';

export const CinematicCursor: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 420, mass: 0.45 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const labeled = target.closest('[data-cursor-label]') as HTMLElement | null;
      if (labeled) {
        setCursorLabel(labeled.getAttribute('data-cursor-label'));
      } else {
        setCursorLabel(null);
      }

      const interactive = target.closest('a, button, input, select, textarea, [role="button"]');
      setIsHovered(!!interactive || !!labeled);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setCursorLabel(null);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {/* Outer fluid halo ring / Lusion contextual badge */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-emerald-600/45 pointer-events-none flex items-center justify-center backdrop-blur-[2px]"
        style={{
          x: smoothX,
          y: smoothY,
          translateX: '-50%',
          translateY: '-50%',
          width: cursorLabel ? 84 : isHovered ? 46 : 28,
          height: cursorLabel ? 32 : isHovered ? 46 : 28,
          backgroundColor: cursorLabel
            ? 'rgba(17, 17, 17, 0.9)'
            : isHovered
            ? 'rgba(30, 158, 84, 0.08)'
            : 'transparent',
          borderColor: cursorLabel ? 'rgba(67, 193, 112, 0.65)' : 'rgba(30, 158, 84, 0.4)',
          transition:
            'width 0.28s cubic-bezier(0.16, 1, 0.3, 1), height 0.28s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.25s ease',
        }}
      >
        <AnimatePresence mode="wait">
          {cursorLabel && (
            <motion.span
              key={cursorLabel}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18 }}
              className="text-[9px] font-mono font-bold tracking-[0.15em] text-white whitespace-nowrap px-2"
            >
              {cursorLabel}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Precision core dot */}
      {!cursorLabel && (
        <motion.div
          className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-emerald-600 pointer-events-none"
          style={{
            x: cursorX,
            y: cursorY,
            translateX: '-50%',
            translateY: '-50%',
          }}
        />
      )}
    </div>
  );
};
