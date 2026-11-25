import React from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

export const CinematicBackground: React.FC = () => {
  const { scrollY } = useScroll();
  const smoothScroll = useSpring(scrollY, { stiffness: 90, damping: 24 });

  const orb1Y = useTransform(smoothScroll, [0, 3000], [0, -180]);
  const orb2Y = useTransform(smoothScroll, [0, 3000], [0, 140]);
  const orb3Y = useTransform(smoothScroll, [0, 3000], [0, -120]);
  const gridY = useTransform(smoothScroll, [0, 3000], [0, -80]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Luxury off-white base */}
      <div className="absolute inset-0 bg-[#FBFBFD]" />

      {/* Scroll-driven & floating ambient light orbs */}
      <motion.div
        style={{ y: orb1Y }}
        animate={{ scale: [1, 1.08, 1], x: [0, 24, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-emerald-500/8 via-emerald-300/4 to-transparent blur-[140px] will-change-transform"
      />
      <motion.div
        style={{ y: orb2Y }}
        animate={{ scale: [1, 0.94, 1], x: [0, -28, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[40%] -right-[15%] w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-teal-500/7 via-emerald-200/4 to-transparent blur-[160px] will-change-transform"
      />
      <motion.div
        style={{ y: orb3Y }}
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-[10%] left-[20%] w-[900px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-600/6 via-transparent to-transparent blur-[180px] will-change-transform"
      />

      {/* Scroll-parallax luxury micro-grid */}
      <motion.div
        style={{ y: gridY }}
        className="absolute -inset-y-24 inset-x-0 opacity-[0.028] will-change-transform"
      >
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
          }}
        />
      </motion.div>
    </div>
  );
};
