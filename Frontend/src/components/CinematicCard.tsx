import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';

interface CinematicCardProps {
  children: React.ReactNode;
  className?: string;
  badge?: string;
  index?: string | number;
  highlight?: boolean;
}

export const CinematicCard: React.FC<CinematicCardProps> = ({
  children,
  className = '',
  badge,
  index,
  highlight = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [3, -3]), { stiffness: 200, damping: 24 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-3, 3]), { stiffness: 200, damping: 24 });
  const glowX = useSpring(useTransform(mouseX, [0, 1], [0, 100]), { stiffness: 200, damping: 24 });
  const glowY = useSpring(useTransform(mouseY, [0, 1], [0, 100]), { stiffness: 200, damping: 24 });
  const radialBg = useTransform(
    [glowX, glowY],
    ([gx, gy]) =>
      `radial-gradient(420px circle at ${gx}% ${gy}%, rgba(30, 158, 84, 0.09), transparent 65%)`
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.1 }}
      transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
      style={{ rotateX, rotateY, transformPerspective: 1100 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ y: -6 }}
      className={`group relative rounded-3xl p-7 sm:p-8 transition-[border-color,box-shadow] duration-500 ease-out will-change-transform
        ${highlight 
          ? 'bg-gradient-to-b from-white via-white to-emerald-50/30 border-2 border-emerald-500/40 shadow-[0_24px_60px_-15px_rgba(30,158,84,0.12)]' 
          : 'bg-white border border-black/[0.08] hover:border-emerald-500/35 hover:shadow-[0_24px_50px_-12px_rgba(30,158,84,0.12)]'
        }
        ${className}`}
    >
      {/* Dynamic cursor-tracking specular spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: radialBg }}
      />

      {/* Subtle top specular highlight on hover */}
      <div className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/35 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-3xl" />

      {(badge || index !== undefined) && (
        <div className="relative z-10 flex items-center justify-between gap-4 mb-6">
          {index !== undefined && (
            <span className="font-mono text-xs font-black text-black/30 group-hover:text-emerald-600 transition-colors tracking-widest">
              {typeof index === 'number' && index < 10 ? `0${index}` : index}
            </span>
          )}
          {badge && (
            <span className="ml-auto inline-flex items-center px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-500/20">
              {badge}
            </span>
          )}
        </div>
      )}

      <div className="relative z-10 h-full flex flex-col justify-between">
        {children}
      </div>
    </motion.div>
  );
};
