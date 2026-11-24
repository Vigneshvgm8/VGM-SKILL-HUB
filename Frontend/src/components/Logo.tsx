import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'light' | 'dark' | 'auto';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  variant = 'auto' 
}) => {
  // Height & scale presets
  const heightMap = {
    sm: { icon: 26, text: 'text-sm sm:text-base', subText: 'text-[8.5px]' },
    md: { icon: 34, text: 'text-lg sm:text-xl', subText: 'text-[10px]' },
    lg: { icon: 42, text: 'text-xl sm:text-2xl', subText: 'text-xs' },
    xl: { icon: 50, text: 'text-2xl sm:text-3xl', subText: 'text-sm' },
  };

  const { icon: iconH, text: textClass, subText: subTextClass } = heightMap[size] || heightMap.md;

  // Variant color mapping:
  // 'light' -> dark text for white/light backgrounds
  // 'dark' -> crisp white text for dark/black backgrounds
  // 'auto' -> adaptive currentColor
  const textColor = variant === 'dark' 
    ? 'text-white' 
    : variant === 'light' 
      ? 'text-[#09090b]' 
      : 'text-foreground';

  return (
    <div className={`inline-flex items-center gap-2.5 select-none bg-transparent ${className}`}>
      {/* Precision Vector Lightbulb Mark with 100% Transparent Background */}
      <div className="relative flex items-center justify-center shrink-0">
        {/* Subtle breathing glow aura behind the bulb */}
        <div 
          className="absolute inset-0 rounded-full bg-[#1E9E54]/25 blur-md scale-110 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
        />
        
        <svg
          height={iconH}
          viewBox="0 0 36 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 transition-transform duration-300 group-hover:scale-105 relative z-10"
          style={{ overflow: 'visible' }}
        >
          {/* Bulb Outer Glass Silhouette */}
          <path
            d="M18 3C10.82 3 5 8.82 5 16C5 20.53 7.34 24.52 10.85 26.83C11.84 27.48 12.44 28.58 12.44 29.77V30.5C12.44 31.05 12.89 31.5 13.44 31.5H22.56C23.11 31.5 23.56 31.05 23.56 30.5V29.77C23.56 28.58 24.16 27.48 25.15 26.83C28.66 24.52 31 20.53 31 16C31 8.82 25.18 3 18 3Z"
            stroke="#1E9E54"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* Glowing T-Filament / Core Engineer Pillar */}
          <path
            d="M18 10V22M12 14.5H24"
            stroke="#43C170"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Filament Spark Energy Dot */}
          <circle cx="18" cy="14.5" r="1.5" fill="#A7F3D0" />

          {/* Screw Base Socket */}
          <path
            d="M13.5 35H22.5"
            stroke="#1E9E54"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M15.5 38.5H20.5"
            stroke="#14723B"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {/* Typography: VGM (Emerald Gradient) + SKILL HUB (Adaptive White / Obsidian) */}
      <div className="flex flex-col leading-none">
        <span 
          className={`font-black tracking-tight text-[#1E9E54] ${textClass} leading-none`}
          style={{ letterSpacing: '-0.02em' }}
        >
          VGM
        </span>
        <span 
          className={`font-black tracking-[0.16em] uppercase ${subTextClass} ${textColor} leading-tight mt-0.5 transition-colors duration-200`}
        >
          SKILL HUB
        </span>
      </div>
    </div>
  );
};
