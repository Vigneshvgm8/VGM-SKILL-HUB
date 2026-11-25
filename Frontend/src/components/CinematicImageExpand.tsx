import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useVelocity } from 'motion/react';

interface CinematicImageExpandProps {
  src: string;
  alt: string;
  className?: string;
  caption?: string;
}

export const CinematicImageExpand: React.FC<CinematicImageExpandProps> = ({
  src,
  alt,
  className = '',
  caption,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 25 });

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVel = useSpring(scrollVelocity, { stiffness: 150, damping: 28 });
  const skewY = useTransform(smoothVel, [-2400, 0, 2400], [-2.5, 0, 2.5]);

  const scale = useTransform(smoothProgress, [0, 0.35, 0.85, 1], [0.88, 1, 1, 0.96]);
  const rotateX = useTransform(smoothProgress, [0, 0.35, 0.85, 1], [7, 0, 0, -4]);
  const borderRadius = useTransform(smoothProgress, [0, 0.35, 0.85, 1], ['42px', '22px', '22px', '32px']);
  const imgY = useTransform(smoothProgress, [0, 1], ['-8%', '8%']);
  const imgScale = useTransform(smoothProgress, [0, 0.4, 1], [1.15, 1.02, 1.06]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden py-2 ${className}`} style={{ perspective: 1200 }}>
      <motion.div
        style={{
          scale,
          rotateX,
          skewY,
          borderRadius,
        }}
        initial={{ clipPath: 'inset(10% 4% 10% 4% round 34px)' }}
        whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 22px)' }}
        viewport={{ once: false, amount: 0.15 }}
        transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
        className="group relative w-full overflow-hidden bg-zinc-100 shadow-2xl border border-black/5 will-change-transform"
      >
        <motion.img
          src={src}
          alt={alt}
          style={{ y: imgY, scale: imgScale }}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 will-change-transform"
        />
        {caption && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-6 text-white"
          >
            <p className="text-sm font-medium tracking-wide">{caption}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};
