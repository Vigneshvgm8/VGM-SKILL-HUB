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
  // Height presets for the official VGM Skill Hub horizontal logo (166x63)
  const heightMap = {
    sm: 'h-6 sm:h-7',
    md: 'h-8 sm:h-9',
    lg: 'h-10 sm:h-11',
    xl: 'h-12 sm:h-14',
  };

  const heightClass = heightMap[size] || heightMap.md;

  // On dark hero navigation, wrap in a subtle clean capsule so the official brand colors pop crisply
  const isDark = variant === 'dark';

  return (
    <div className={`inline-flex items-center select-none ${isDark ? 'bg-white px-2 py-0.5 rounded-xl shadow-xs' : 'bg-transparent'} ${className}`}>
      <img
        src="/assets/logo.png"
        alt="VGM Skill Hub"
        className={`${heightClass} w-auto object-contain transition-transform duration-200 group-hover:scale-105`}
        loading="eager"
      />
    </div>
  );
};

export default Logo;
