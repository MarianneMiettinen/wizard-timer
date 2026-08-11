/**
 * The wizard casting, at the tip of the wand, while a session runs.
 *
 * Two phases, on purpose:
 *
 *  - **Burst** — about ten seconds of forked lightning when the timer starts.
 *    This is the "something just happened" moment, so it is allowed to be
 *    showy.
 *  - **Ember** — after that it settles to a slow breathing glow, which is one
 *    animated property on one element and costs essentially nothing.
 *
 * Dropping to the cheap phase is deliberate rather than a fallback measured
 * after the fact: a lightning effect flickering for the whole of a 90-minute
 * session would be both a battery drain and, far worse, impossible to work
 * next to. It can be bright briefly; it cannot be bright for an hour.
 *
 * Everything animated here is `opacity` and `transform`, which the compositor
 * handles without re-running layout or paint.
 */

import { useEffect, useState } from 'react';
import { useTheme } from './ThemeProvider';

/** How long the showy phase lasts. */
const BURST_MS = 10_000;

/**
 * Hand-drawn forks. Viewbox is 100×100, the wand tip at roughly (50, 50).
 * More segments and sharper reversals than a simple zig-zag — real lightning
 * changes direction often and unevenly, and a regular zig-zag reads as a
 * decorative squiggle.
 */
const BOLTS = [
  'M50 50 L44 40 L48 37 L38 26 L43 24 L31 9',
  'M50 50 L59 41 L55 38 L67 29 L62 26 L75 13',
  'M50 50 L42 57 L46 60 L35 67 L39 70 L25 79',
  'M50 50 L58 58 L54 61 L64 68 L60 71 L73 82',
  'M50 50 L52 38 L56 40 L53 27 L58 29 L55 8',
  'M50 50 L40 52 L43 56 L30 59 L34 63 L18 66',
];

/** Loose motes around the tip. Positions are viewbox units. */
const SPARKS = [
  { cx: 62, cy: 30, r: 1.5, delay: 0.1 },
  { cx: 36, cy: 33, r: 1.1, delay: 0.55 },
  { cx: 70, cy: 47, r: 1.3, delay: 0.9 },
  { cx: 30, cy: 60, r: 1.6, delay: 0.35 },
  { cx: 57, cy: 68, r: 1.2, delay: 1.25 },
  { cx: 46, cy: 22, r: 1.4, delay: 0.75 },
  { cx: 78, cy: 62, r: 1, delay: 1.05 },
  { cx: 24, cy: 44, r: 1.2, delay: 1.45 },
  { cx: 66, cy: 78, r: 1.1, delay: 0.2 },
  { cx: 40, cy: 76, r: 1.3, delay: 1.6 },
];

interface MagicStrikeProps {
  /** True while the timer is running. */
  active: boolean;
  /** Changes on every fresh start, so the burst replays. */
  runToken: number;
}

export function MagicStrike({ active, runToken }: MagicStrikeProps) {
  const { scene } = useTheme();
  const magic = scene.magic;

  const [bursting, setBursting] = useState(false);

  useEffect(() => {
    if (!active) {
      setBursting(false);
      return;
    }
    setBursting(true);
    const id = window.setTimeout(() => setBursting(false), BURST_MS);
    return () => window.clearTimeout(id);
  }, [active, runToken]);

  if (!magic || !active) return null;

  return (
    <div
      className={bursting ? 'wt-magic wt-magic--burst' : 'wt-magic'}
      aria-hidden="true"
      style={{
        left: `${magic.xPercent}%`,
        top: `${magic.yPercent}%`,
        width: `${magic.widthPercent}%`,
        color: magic.colour,
      }}
    >
      <div className="wt-magic__glow" />

      {/*
        Sparks keep drifting after the forks stop — a wand that has just thrown
        lightning should still be crackling, and ten small circles fading in and
        out cost far less than the bolts do.
      */}
      <svg className="wt-magic__bolts" viewBox="0 0 100 100" focusable="false">
        {bursting &&
          BOLTS.map((d, index) => (
            <path
              key={d}
              d={d}
              className="wt-magic__bolt"
              // Staggered so the forks fire in sequence rather than as one
              // flash — that is what reads as lightning rather than a strobe.
              style={{ animationDelay: `${index * 0.13}s` }}
            />
          ))}

        {SPARKS.map((spark) => (
          <circle
            key={`${spark.cx}-${spark.cy}`}
            className="wt-magic__spark"
            cx={spark.cx}
            cy={spark.cy}
            r={spark.r}
            style={{ animationDelay: `${spark.delay}s` }}
          />
        ))}
      </svg>
    </div>
  );
}
