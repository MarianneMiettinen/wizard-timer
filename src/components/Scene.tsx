/**
 * The artwork, and everything overlaid on it.
 *
 * The whole picture is one aspect-ratio-locked box, and every overlay inside it
 * is positioned in **percentages of that box**. That is the only reason the
 * buttons, candle and readout stay glued to the painting at every window size —
 * there is not a single hardcoded pixel offset anywhere in the layout.
 *
 * It also publishes the current gauge colour as CSS custom properties, so the
 * frame, the flame and the glows all read from one value.
 */

import type { CSSProperties, ReactNode } from 'react';
import type { ThemePet } from '../themes/theme.types';
import { CandleGauge } from './CandleGauge';
import { gaugeCssVariables, type GaugeState } from './gauge';
import { useTheme } from './ThemeProvider';

interface SceneProps {
  /** The chosen pet — carries both the artwork and its measured geometry. */
  pet: ThemePet;
  /** Computed by the caller, which also needs the colour for the tab icon. */
  gauge: GaugeState;
  durationMs: number;
  lit: boolean;
  children: ReactNode;
}

export function Scene({ pet, gauge, durationMs, lit, children }: SceneProps) {
  const { scene, copy } = useTheme();

  const style = {
    // Repeated here (as well as on the page wrapper) so the scene still has
    // them when it is portalled into a popped-out window.
    ...gaugeCssVariables(gauge),

    // Per-render, because each pet is a separately generated picture.
    '--wt-frame-top': `${pet.frame.topPercent}%`,
    '--wt-frame-right': `${pet.frame.rightPercent}%`,
    '--wt-frame-bottom': `${pet.frame.bottomPercent}%`,
    '--wt-frame-left': `${pet.frame.leftPercent}%`,
    '--wt-frame-radius': `${pet.frame.radiusPercent}%`,
  } as CSSProperties;

  return (
    <div className="wt-scene" style={style}>
      <img className="wt-scene__art" src={pet.scene} alt={copy.sceneAlt} />

      {/* Painted-in UI the app replaces with live equivalents. */}
      {scene.erase.map((rect, index) => (
        <div
          key={index}
          className="wt-scene__erase"
          aria-hidden="true"
          style={{
            left: `${rect.leftPercent}%`,
            top: `${rect.topPercent}%`,
            width: `${rect.widthPercent}%`,
            height: `${rect.heightPercent}%`,
          }}
        />
      ))}

      {/* The painted gold frame, re-lit in the candle's current colour. */}
      <div className="wt-scene__frame" aria-hidden="true" />

      <CandleGauge gauge={gauge} lit={lit} durationMs={durationMs} />

      {children}
    </div>
  );
}
