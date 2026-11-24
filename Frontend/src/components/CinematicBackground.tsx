import React from 'react';

export const CinematicBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Luxury off-white base */}
      <div className="absolute inset-0 bg-[#FBFBFD]" />

      {/* Subtle ambient light orbs */}
      <div 
        className="absolute -top-[20%] -left-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-emerald-500/6 via-emerald-300/4 to-transparent blur-[140px]"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      />
      <div 
        className="absolute top-[40%] -right-[15%] w-[700px] h-[700px] rounded-full bg-gradient-to-bl from-teal-500/5 via-emerald-200/4 to-transparent blur-[160px]"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      />
      <div 
        className="absolute -bottom-[10%] left-[20%] w-[900px] h-[600px] rounded-full bg-gradient-to-tr from-emerald-600/5 via-transparent to-transparent blur-[180px]"
        style={{ transform: 'translate3d(0, 0, 0)' }}
      />

      {/* Ultra-subtle luxury micro-grid */}
      <div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />
    </div>
  );
};
