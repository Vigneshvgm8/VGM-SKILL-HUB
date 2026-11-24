import React, { useEffect, useRef, useState } from 'react';
import { createTileWall, TileWallTheme, TileWallInstance } from '../lib/tile-wall.js';

interface MotionGridCanvasProps {
  className?: string;
  theme?: 'emerald' | 'pink' | 'cyber';
  lightElementId?: string;
}

export const THEME_PALETTES: Record<string, TileWallTheme> = {
  emerald: {
    accent: '#1E9E54',
    hot: '#D1FAE5',
    deep: '#064E3B',
    tile: '#0D2118',
    page: '#09090b',
  },
  pink: {
    accent: '#ff2a77',
    hot: '#ffdbe8',
    deep: '#9c0b47',
    tile: '#2c0a19',
    page: '#09090b',
  },
  cyber: {
    accent: '#06B6D4',
    hot: '#E0F2FE',
    deep: '#0E7490',
    tile: '#082F49',
    page: '#09090b',
  }
};

export const MotionGridCanvas: React.FC<MotionGridCanvasProps> = ({
  className = '',
  theme = 'emerald',
  lightElementId = 'hero-headline'
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    let isDisposed = false;
    let cleanup = () => { };

    const activeTheme = THEME_PALETTES[theme] || THEME_PALETTES.emerald;

    try {
      // Check for WebGL capability
      const testGl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!testGl) {
        console.warn('WebGL is not supported or disabled; using fallback gradient.');
        return;
      }

      // Initialize the exact 3D Tile Wall engine from MotionSites
      const wall: TileWallInstance = createTileWall(canvas, activeTheme, {
        pixelRatio: Math.min(window.devicePixelRatio || 1, 2)
      });

      const updateFrame = () => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const lightEl = lightElementId ? document.getElementById(lightElementId)?.getBoundingClientRect() : null;

        wall.setFrame({
          width: canvas.offsetWidth || rect.width || window.innerWidth,
          height: canvas.offsetHeight || rect.height || 600,
          lightX: lightEl ? lightEl.left - rect.left + lightEl.width / 2 : rect.width / 2,
          lightY: lightEl ? lightEl.top - rect.top + lightEl.height / 2 : rect.height * 0.45,
        });
      };

      const resizeObserver = new ResizeObserver(updateFrame);
      resizeObserver.observe(canvas);
      updateFrame();

      // Window pointermove tracking for 100% exact 3D mouse hover & tilt interaction
      const handlePointerMove = (e: PointerEvent) => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const inside =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        wall.setPointer(
          inside
            ? {
              x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
              y: -((e.clientY - rect.top) / rect.height) * 2 + 1,
            }
            : null
        );
      };

      window.addEventListener('pointermove', handlePointerMove, { passive: true });

      cleanup = () => {
        resizeObserver.disconnect();
        window.removeEventListener('pointermove', handlePointerMove);
        wall.dispose();
      };

      // Warm up WebGL compilation and play opening ripple wave
      wall.warmUp().then(() => {
        if (!isDisposed) {
          setReady(true);
          window.setTimeout(() => {
            if (!isDisposed) {
              wall.playRipple();
            }
          }, 250);
        }
      }).catch((err) => {
        console.warn('Tile wall warmup warning:', err);
      });

    } catch (err) {
      console.error('Failed to initialize 3D tile wall:', err);
    }

    return () => {
      isDisposed = true;
      cleanup();
    };
  }, [theme, lightElementId]);

  const activeTheme = THEME_PALETTES[theme] || THEME_PALETTES.emerald;

  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 w-full h-full overflow-hidden select-none ${className}`}
      style={{
        maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)',
      }}
      aria-hidden="true"
    >
      {/* MotionSites Signature Volumetric Radial Halo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 55% 45% at 50% 45%, ${activeTheme.accent}30, ${activeTheme.deep}18 45%, transparent 75%)`,
        }}
      />

      {/* Real-time 3D WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 size-full w-full h-full transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'
          }`}
      />
    </div>
  );
};
