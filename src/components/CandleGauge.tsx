/**
 * The burning candle, and the scale beside it.
 *
 * The candle is already painted into the artwork, ramp and all. This component
 * does not draw one — it **erases** the part that has burned away and draws a
 * fresh flame at the cut, which is far more convincing than trying to redraw
 * the painted candle from scratch.
 *
 * Erasing works because the wall behind the candle in the artwork is very close
 * to black (sampled at [6,2,0]–[16,8,1]). A near-black panel over it is
 * effectively invisible, so the candle simply appears shorter. If you re-skin
 * this with brighter art, this trick stops working and the theme needs real
 * layered assets instead.
 *
 * The same erase-and-redraw applies to the painted "90 / 60 / 30 MIN" scale,
 * which is only true for a 90-minute session. Redrawing it from the session
 * actually running is the difference between a gauge and a decoration.
 *
 * Marked aria-hidden: it is a second, less precise view of the readout that
 * <TimerReadout> already announces properly.
 */

import { useTheme } from './ThemeProvider';
import { tickTopPercent, type GaugeState } from './gauge';

const MS_PER_MINUTE = 60_000;

interface CandleGaugeProps {
  gauge: GaugeState;
  /** Whether the flame is burning. False while idle, paused, or finished. */
  lit: boolean;
  /** Full session length, used to label the scale. */
  durationMs: number;
}

export function CandleGauge({ gauge, lit, durationMs }: CandleGaugeProps) {
  const { scene, copy } = useTheme();
  const { candle } = scene;
  const { ticks } = candle;

  const width = candle.rightPercent - candle.leftPercent;
  const maskHeight = Math.max(0, gauge.topPercent - candle.maskTopPercent);

  // The lip and the flame belong to the wax, not to the wider erase column.
  const bodyWidth = candle.bodyRightPercent - candle.bodyLeftPercent;
  const bodyCentreX = candle.bodyLeftPercent + bodyWidth / 2;

  // A tick that rounds to zero minutes says nothing useful, so it is dropped
  // rather than printed as "0 MIN".
  const visibleTicks = ticks.fractions
    .map((fraction) => ({
      fraction,
      minutes: Math.round((durationMs * fraction) / MS_PER_MINUTE),
    }))
    .filter((tick) => tick.minutes > 0);

  return (
    <div className="wt-gauge" aria-hidden="true">
      {/* Erases the burned-away candle, plus the painted flame above it. */}
      <div
        className="wt-gauge__mask"
        style={{
          left: `${candle.leftPercent}%`,
          width: `${width}%`,
          top: `${candle.maskTopPercent}%`,
          height: `${maskHeight}%`,
        }}
      />

      {/* Erases the painted 90/60/30 scale. */}
      <div
        className="wt-gauge__mask"
        style={{
          left: `${ticks.leftPercent}%`,
          width: `${ticks.rightPercent - ticks.leftPercent}%`,
          top: `${ticks.maskTopPercent}%`,
          height: `${ticks.maskBottomPercent - ticks.maskTopPercent}%`,
        }}
      />

      {visibleTicks.map((tick) => (
        <div
          key={tick.fraction}
          className="wt-gauge__tick"
          style={{
            left: `${ticks.leftPercent}%`,
            width: `${ticks.rightPercent - ticks.leftPercent}%`,
            top: `${tickTopPercent(candle, tick.fraction)}%`,
          }}
        >
          <span className="wt-gauge__tick-value">{tick.minutes}</span>
          <span className="wt-gauge__tick-unit">{copy.tickSuffix}</span>
        </div>
      ))}

      {/* Molten lip at the cut, so the erased edge reads as wax, not as a crop. */}
      <div
        className="wt-gauge__melt"
        style={{
          left: `${candle.bodyLeftPercent}%`,
          width: `${bodyWidth}%`,
          top: `${gauge.topPercent}%`,
        }}
      />

      {lit && (
        <div
          className="wt-gauge__flame"
          style={{
            left: `${bodyCentreX}%`,
            top: `${gauge.topPercent}%`,
            height: `${candle.flameHeightPercent}%`,
          }}
        >
          <div className="wt-gauge__glow" />
          {/*
            Drawn inline rather than loaded as theme art so it can take the
            gauge colour through `currentColor` — an <img> can't inherit it.
            The shape is generic; the colour, which is the meaningful part,
            still comes entirely from the theme's gradient.
          */}
          <svg
            className="wt-gauge__flame-svg"
            viewBox="0 0 60 96"
            aria-hidden="true"
            focusable="false"
          >
            <path
              fill="currentColor"
              d="M30 4 c14 22 22 32 22 50 c0 15 -10 26 -22 26 s-22 -11 -22 -26 c0 -18 8 -28 22 -50 Z"
            />
            <path
              fill="var(--wt-color-text)"
              opacity="0.85"
              d="M30 34 c6 10 10 16 10 25 c0 8 -4 14 -10 14 s-10 -6 -10 -14 c0 -9 4 -15 10 -25 Z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
