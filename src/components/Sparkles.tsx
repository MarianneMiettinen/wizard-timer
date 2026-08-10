/**
 * A few small sparkles around the finished message.
 *
 * Deliberately restrained: slow, low-contrast, only eight of them, and gone
 * entirely under `prefers-reduced-motion`. The session has just *ended* — this
 * is a quiet "that's done", not a celebration demanding attention.
 *
 * The positions are layout, not theme values, so they live here. The colour
 * comes from the theme like everything else.
 */

/** Scattered by hand rather than randomly, so nothing clusters or overlaps the text. */
const SPARKS = [
  { left: -4, top: 12, size: 2.1, delay: 0 },
  { left: 8, top: -10, size: 1.4, delay: 0.9 },
  { left: 31, top: -16, size: 1.8, delay: 1.8 },
  { left: 62, top: -12, size: 1.3, delay: 0.45 },
  { left: 88, top: -8, size: 2, delay: 2.2 },
  { left: 101, top: 34, size: 1.5, delay: 1.3 },
  { left: 78, top: 96, size: 1.7, delay: 2.6 },
  { left: 16, top: 101, size: 1.4, delay: 1.9 },
];

export function Sparkles() {
  return (
    <div className="wt-sparkles" aria-hidden="true">
      {SPARKS.map((spark) => (
        <svg
          key={`${spark.left}-${spark.top}`}
          className="wt-sparkles__spark"
          viewBox="0 0 24 24"
          focusable="false"
          style={{
            left: `${spark.left}%`,
            top: `${spark.top}%`,
            width: `${spark.size}cqw`,
            animationDelay: `${spark.delay}s`,
          }}
        >
          <path
            fill="currentColor"
            d="M12 0 c1.1 6.6 4.3 9.8 12 12 c-7.7 2.2 -10.9 5.4 -12 12 c-1.1 -6.6 -4.3 -9.8 -12 -12 c7.7 -2.2 10.9 -5.4 12 -12 Z"
          />
        </svg>
      ))}
    </div>
  );
}
