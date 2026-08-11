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

/** Hand-drawn forks. Viewbox is 100×100, the wand tip at roughly (50, 50). */
const BOLTS = [
  'M50 50 L38 30 L46 28 L30 8',
  'M50 50 L66 34 L58 31 L74 14',
  'M50 50 L34 58 L42 62 L24 74',
  'M50 50 L64 66 L56 68 L72 84',
  'M50 50 L52 26 L58 32 L54 6',
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

      {bursting && (
        <svg className="wt-magic__bolts" viewBox="0 0 100 100" focusable="false">
          {BOLTS.map((d, index) => (
            <path
              key={d}
              d={d}
              className="wt-magic__bolt"
              // Staggered so the forks fire in sequence rather than as one
              // flash — that is what reads as lightning rather than a strobe.
              style={{ animationDelay: `${index * 0.17}s` }}
            />
          ))}
        </svg>
      )}
    </div>
  );
}
