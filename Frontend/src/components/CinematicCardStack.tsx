import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';

interface CinematicCardStackProps {
  children: React.ReactNode[];
  className?: string;
  topOffset?: number;
  stackOffset?: number;
}

const StackItem: React.FC<{
  child: React.ReactElement;
  index: number;
  total: number;
  calculatedTop: number;
}> = ({ child, index, total, calculatedTop }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });
  const targetScale = 1 - Math.max(0, total - 1 - index) * 0.015;
  const scale = useTransform(smooth, [0, 0.4, 1], [0.95, 1, targetScale]);

  return (
    <motion.div
      ref={ref}
      className="sticky will-change-transform"
      style={{
        top: `${calculatedTop}px`,
        zIndex: index + 10,
        scale,
      }}
    >
      {child}
    </motion.div>
  );
};

/**
 * Sticky Card Stacking container with Lusion scroll-linked depth scale.
 */
export const CinematicCardStack: React.FC<CinematicCardStackProps> = ({
  children,
  className = '',
  topOffset = 96,
  stackOffset = 20,
}) => {
  const validChildren = React.Children.toArray(children).filter(React.isValidElement);

  return (
    <div className={`relative flex flex-col gap-8 pb-12 ${className}`}>
      {validChildren.map((child, index) => (
        <StackItem
          key={index}
          child={child}
          index={index}
          total={validChildren.length}
          calculatedTop={topOffset + index * stackOffset}
        />
      ))}
    </div>
  );
};
