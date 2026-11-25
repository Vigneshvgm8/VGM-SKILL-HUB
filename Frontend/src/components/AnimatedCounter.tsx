import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';

interface AnimatedCounterProps {
  value: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ value, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const elementRef = useRef<HTMLSpanElement | null>(null);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const match = value.match(/^([^0-9.]*)([0-9,.]+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1] || '';
    const numStr = match[2].replace(/,/g, '');
    const suffix = match[3] || '';
    const targetNumber = parseFloat(numStr);
    const isDecimal = numStr.includes('.');

    if (isNaN(targetNumber)) {
      setDisplayValue(value);
      return;
    }

    let rafId: number | null = null;

    const runCount = () => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;
      const duration = 1400;
      const startTime = performance.now();

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        const currentNum = targetNumber * ease;

        const formattedNum = isDecimal
          ? currentNum.toFixed(1)
          : Math.floor(currentNum).toLocaleString();

        setDisplayValue(`${prefix}${formattedNum}${suffix}`);

        if (progress < 1) {
          rafId = requestAnimationFrame(step);
        } else {
          setDisplayValue(value);
          isAnimatingRef.current = false;
        }
      };

      rafId = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          runCount();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [value]);

  return (
    <motion.span
      ref={elementRef}
      initial={{ opacity: 0, y: 12, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
      className={`inline-block ${className}`}
    >
      {displayValue}
    </motion.span>
  );
};
