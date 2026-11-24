import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

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
    offset: ['start end', 'center center'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], ['40px', '24px']);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      <motion.div
        style={{
          scale,
          borderRadius,
        }}
        className="relative w-full overflow-hidden bg-zinc-100 shadow-2xl border border-black/5"
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
        {caption && (
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 text-white">
            <p className="text-sm font-medium tracking-wide">{caption}</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
