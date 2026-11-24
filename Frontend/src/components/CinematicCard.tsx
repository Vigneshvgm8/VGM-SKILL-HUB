import React from 'react';

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
  return (
    <div
      className={`group relative rounded-3xl p-7 sm:p-8 transition-all duration-500 ease-out 
        ${highlight 
          ? 'bg-gradient-to-b from-white via-white to-emerald-50/30 border-2 border-emerald-500/40 shadow-[0_24px_60px_-15px_rgba(30,158,84,0.12)]' 
          : 'bg-white border border-black/[0.08] hover:border-emerald-500/30 hover:shadow-[0_24px_50px_-12px_rgba(0,0,0,0.08)]'
        }
        hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-12px_rgba(30,158,84,0.12)] ${className}`}
    >
      {/* Top Bar with Badge or Index Number if provided */}
      {/* Subtle top specular highlight on hover */}
      <div className="pointer-events-none absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-3xl" />

      {(badge || index !== undefined) && (
        <div className="flex items-center justify-between gap-4 mb-6">
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

      {children}
    </div>
  );
};
