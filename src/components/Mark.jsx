import { useId } from 'react';

const GRADIENTS = {
  X: ['#67e8f9', '#3b82f6'],
  O: ['#f0abfc', '#8b5cf6'],
};

/** Animated, glowing X or O drawn with SVG strokes. `delay` (seconds) offsets the draw animation. */
export default function Mark({ symbol, className = 'h-full w-full', animate = true, glow = true, delay = 0, strokeWidth = 13 }) {
  const gradId = `mark-${useId().replace(/:/g, '')}`;
  const isX = symbol === 'X';
  const [from, to] = GRADIENTS[isX ? 'X' : 'O'];
  const anim = animate ? 'draw-path' : '';
  const style = (extra = 0) => (animate ? { animationDelay: `${delay + extra}s` } : undefined);

  return (
    <svg viewBox="0 0 100 100" className={`${className} ${glow ? (isX ? 'glow-x' : 'glow-o') : ''}`} aria-hidden="true">
      <defs>
        <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="100" y2="100">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      {isX ? (
        <g stroke={`url(#${gradId})`} strokeWidth={strokeWidth} strokeLinecap="round" fill="none">
          <line x1="26" y1="26" x2="74" y2="74" pathLength="1" className={anim} style={style(0)} />
          <line x1="74" y1="26" x2="26" y2="74" pathLength="1" className={anim} style={style(0.14)} />
        </g>
      ) : (
        <circle
          cx="50"
          cy="50"
          r="26"
          fill="none"
          stroke={`url(#${gradId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          pathLength="1"
          transform="rotate(-90 50 50)"
          className={anim}
          style={style(0)}
        />
      )}
    </svg>
  );
}
