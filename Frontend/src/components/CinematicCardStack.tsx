import React from 'react';

interface CinematicCardStackProps {
  children: React.ReactNode[];
  className?: string;
  topOffset?: number; // Base top offset in px (e.g. 100)
  stackOffset?: number; // Offset increment between stacked cards (e.g. 24)
}

/**
 * Sticky Card Stacking container.
 * As the user scrolls, each card sticks to the top with an increasing offset,
 * and subsequent cards slide smoothly over earlier ones with realistic depth and elevation.
 */
export const CinematicCardStack: React.FC<CinematicCardStackProps> = ({
  children,
  className = '',
  topOffset = 96,
  stackOffset = 20,
}) => {
  return (
    <div className={`relative flex flex-col gap-8 pb-12 ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return null;

        const calculatedTop = topOffset + index * stackOffset;

        return (
          <div
            key={index}
            className="sticky transition-all duration-300 will-change-transform"
            style={{
              top: `${calculatedTop}px`,
              zIndex: index + 10,
            }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};
