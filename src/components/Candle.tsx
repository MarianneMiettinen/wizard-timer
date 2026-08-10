/**
 * The burn-down visual.
 *
 * Takes a plain 0–1 number from /core and turns it into a shortening candle.
 * It knows nothing about timers, minutes or sessions — hand it 0.5 and it draws
 * a half-burned candle, whatever produced that number.
 *
 * Marked aria-hidden: it is a second, less precise view of the readout that
 * <TimerDisplay> already announces properly. Describing it again would just
 * make a screen reader repeat itself.
 */

import { useTheme } from './ThemeProvider';

interface CandleProps {
  /** 0 at the start of the session, 1 when it is over. */
  elapsedFraction: number;
  /** Whether the flame is burning. False while idle, paused, or finished. */
  lit: boolean;
}

export function Candle({ elapsedFraction, lit }: CandleProps) {
  const { candle, assets } = useTheme();

  if (!candle.enabled) return null;

  const remainingFraction = 1 - Math.min(1, Math.max(0, elapsedFraction));
  const heightPercent =
    candle.minHeightPercent + (100 - candle.minHeightPercent) * remainingFraction;

  return (
    <div className="wt-candle" aria-hidden="true">
      {/*
        The wax is a background-image on a shrinking box, anchored to the
        bottom. Shortening the box clips the column from the top, which is what
        burning down looks like. Scaling the whole image instead would just
        make a small candle.
      */}
      <div className="wt-candle__wax" style={{ height: `${heightPercent}%` }} />

      <div
        className="wt-candle__flame-anchor"
        style={{ bottom: `calc(${heightPercent}% - 8px)` }}
        data-lit={lit}
      >
        <div className="wt-candle__glow" />
        {lit && (
          <img
            className="wt-candle__flame"
            src={assets.candleFlame}
            alt=""
            width={Math.round(candle.flameHeightPx * 0.625)}
            height={candle.flameHeightPx}
          />
        )}
      </div>
    </div>
  );
}
