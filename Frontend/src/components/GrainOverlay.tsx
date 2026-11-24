import React from 'react';

export const GrainOverlay: React.FC<{ opacity?: number }> = ({ opacity = 0.025 }) => (
  <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden" style={{ opacity }} aria-hidden="true">
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <filter id="grain-filter">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#grain-filter)" />
    </svg>
  </div>
);
