import React from 'react';
import { motion, Variants } from 'motion/react';

interface CinematicTextRevealProps {
  text: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  className?: string;
  delay?: number;
  stagger?: number;
}

export const CinematicTextReveal: React.FC<CinematicTextRevealProps> = ({
  text,
  tag = 'h2',
  className = '',
  delay = 0,
  stagger = 0.035,
}) => {
  const words = text.split(' ');

  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  // Lusion-inspired masked word rise with subtle 3D rotation settle
  const wordVariants: Variants = {
    hidden: {
      y: '115%',
      rotateZ: 2.5,
      opacity: 0,
    },
    visible: {
      y: '0%',
      rotateZ: 0,
      opacity: 1,
      transition: {
        duration: 0.85,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  const Tag = motion[tag] as any;

  return (
    <Tag
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.15 }}
      className={`inline-flex flex-wrap gap-x-[0.28em] gap-y-[0.08em] ${className}`}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden py-1 -my-1">
          <motion.span
            variants={wordVariants}
            style={{ transformOrigin: 'left bottom' }}
            className="inline-block will-change-transform"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
};
