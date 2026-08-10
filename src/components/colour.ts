/**
 * Small colour helpers for driving the gauge.
 *
 * Contains no colours of its own — it only interpolates between values the
 * theme supplies. Keep it that way.
 *
 * These exist rather than CSS `color-mix()` so the computed values can be read
 * back in JS and handed to several places at once (the flame, the frame border,
 * two different glow strengths) from a single source of truth.
 */

interface Rgb {
  r: number;
  g: number;
  b: number;
}

/** Accepts `#rgb` and `#rrggbb`. Anything else falls back to black. */
function parseHex(value: string): Rgb {
  const hex = value.trim().replace('#', '');

  if (hex.length === 3) {
    const r = hex[0] ?? '0';
    const g = hex[1] ?? '0';
    const b = hex[2] ?? '0';
    return {
      r: Number.parseInt(r + r, 16),
      g: Number.parseInt(g + g, 16),
      b: Number.parseInt(b + b, 16),
    };
  }

  if (hex.length >= 6) {
    return {
      r: Number.parseInt(hex.slice(0, 2), 16),
      g: Number.parseInt(hex.slice(2, 4), 16),
      b: Number.parseInt(hex.slice(4, 6), 16),
    };
  }

  return { r: 0, g: 0, b: 0 };
}

function toHex({ r, g, b }: Rgb): string {
  const channel = (value: number) =>
    Math.round(Math.min(255, Math.max(0, value)))
      .toString(16)
      .padStart(2, '0');
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

/**
 * Samples a gradient of evenly-spaced stops at `t` (0 → first stop, 1 → last).
 * Interpolates in plain sRGB, which is fine here: the stops are close together
 * and all in the same warm-to-cool arc, so there is no muddy midpoint to avoid.
 */
export function sampleGradient(stops: readonly string[], t: number): string {
  if (stops.length === 0) return '#000000';

  const first = stops[0] ?? '#000000';
  if (stops.length === 1) return first;

  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (stops.length - 1);
  const index = Math.min(stops.length - 2, Math.floor(scaled));
  const local = scaled - index;

  const from = parseHex(stops[index] ?? first);
  const to = parseHex(stops[index + 1] ?? first);

  return toHex({
    r: from.r + (to.r - from.r) * local,
    g: from.g + (to.g - from.g) * local,
    b: from.b + (to.b - from.b) * local,
  });
}

/** Same colour at a given opacity, as an `rgba()` string. */
export function withAlpha(colour: string, alpha: number): string {
  const { r, g, b } = parseHex(colour);
  return `rgba(${r}, ${g}, ${b}, ${Math.min(1, Math.max(0, alpha))})`;
}
