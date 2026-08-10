/**
 * Turns "fraction of the session left" into the numbers the candle needs.
 *
 * The candle always starts at full height, whatever the session length, and
 * burns down to the same place — so watching it fall is the same satisfying
 * motion for a 5-minute session as for a 90-minute one.
 *
 * Colour tracks the same fraction: green at the top of the candle, red at the
 * bottom, so "how red is it" always means "how close am I to done".
 */

import type { CSSProperties } from 'react';
import type { ThemeCandleGauge } from '../themes/theme.types';
import { sampleGradient, withAlpha } from './colour';

export interface GaugeState {
  /** Y of the candle's burning tip, as a percentage of the artwork height. */
  topPercent: number;
  /** Colour of the candle at that height, as `#rrggbb`. */
  colour: string;
}

/** `remainingFraction` is 1 at the start of a session and 0 when it is over. */
export function describeGauge(
  candle: ThemeCandleGauge,
  remainingFraction: number,
): GaugeState {
  const left = Math.min(1, Math.max(0, remainingFraction));

  return {
    topPercent: candle.zeroTopPercent - left * (candle.zeroTopPercent - candle.fullTopPercent),
    // Gradient runs top → bottom, i.e. most time → least, so it is sampled
    // with the fraction inverted.
    colour: sampleGradient(candle.gradient, 1 - left),
  };
}

/**
 * The gauge colour as CSS custom properties.
 *
 * Applied in two places on purpose: on the page wrapper, so anything outside
 * the artwork (the session bar's glowing reset button) can read them; and again
 * on the scene itself, because a popped-out Picture-in-Picture window is a
 * separate document that the page wrapper is not an ancestor of.
 *
 * Scoping these to the scene alone silently breaks the outside users — an
 * undefined custom property makes the whole declaration invalid, so the glow
 * simply computes to `none` with no error anywhere.
 */
export function gaugeCssVariables(gauge: GaugeState): CSSProperties {
  return {
    '--wt-gauge-colour': gauge.colour,
    '--wt-gauge-glow': withAlpha(gauge.colour, 0.5),
    '--wt-gauge-soft': withAlpha(gauge.colour, 0.18),
  } as CSSProperties;
}

/** Y of a tick marking `fraction` of the session, as a percentage of height. */
export function tickTopPercent(candle: ThemeCandleGauge, fraction: number): number {
  return candle.zeroTopPercent - fraction * (candle.zeroTopPercent - candle.fullTopPercent);
}
