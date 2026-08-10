/**
 * The scene: the theme's character standing beside the burn-down visual.
 *
 * Purely presentational. It receives the same 0–1 number <Candle> does and
 * passes it straight through, so a theme that swaps the wizard for something
 * else changes one asset path and nothing here.
 */

import { Candle } from './Candle';
import { useTheme } from './ThemeProvider';

interface StageProps {
  elapsedFraction: number;
  lit: boolean;
}

export function Stage({ elapsedFraction, lit }: StageProps) {
  const { assets, copy } = useTheme();

  return (
    <div className="wt-stage">
      <img
        className="wt-stage__character"
        src={assets.character}
        alt={copy.characterAlt}
        // Eager, not lazy: it is the first thing on screen, and a lazy-loaded
        // hero image just means a visible pop-in.
        decoding="async"
      />
      <Candle elapsedFraction={elapsedFraction} lit={lit} />
    </div>
  );
}
