import React from 'react';

interface CinematicMarqueeProps {
  items: React.ReactNode[];
  speed?: number; // duration in seconds
  reverse?: boolean;
  className?: string;
  gap?: string;
}

export const CinematicMarquee: React.FC<CinematicMarqueeProps> = ({
  items,
  speed = 35,
  reverse = false,
  className = '',
  gap = 'gap-6',
}) => {
  return (
    <div className={`relative w-full overflow-hidden py-3 select-none ${className}`}>
      {/* Edge gradient masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white via-white/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white via-white/80 to-transparent z-10 pointer-events-none" />

      <div
        className={`flex w-max items-center ${gap} ${reverse ? 'animate-marquee-reverse' : 'animate-marquee'} hover:[animation-play-state:paused]`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {/* Render 2 sets for infinite loop */}
        {items.map((item, idx) => (
          <div key={`item-a-${idx}`} className="shrink-0">
            {item}
          </div>
        ))}
        {items.map((item, idx) => (
          <div key={`item-b-${idx}`} className="shrink-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};
