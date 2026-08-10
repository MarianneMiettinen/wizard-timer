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
import type { ThemePet, ThemePetOverlay } from '../themes/theme.types';
import { CandleGauge } from './CandleGauge';
import { gaugeCssVariables, type GaugeState } from './gauge';
import { useTheme } from './ThemeProvider';

/**
 * Draws a cropped pet from a sheet, blended into the scene.
 *
 * The crop is expressed in the theme as a plain rectangle in percentages of the
 * source picture, which is the only form a human can measure and check. Turning
 * that into `background-size` / `background-position` is fiddly enough to be
 * worth doing once, here, rather than in every theme:
 *
 *  - **size**: scale the source so the crop exactly fills the box — the crop is
 *    `cropWidthPercent` of the image, so the image must be `100 / crop` times
 *    the box.
 *  - **position**: percentage positioning aligns the same percentage point of
 *    image and container, so showing a window that starts at `cropLeft`
 *    needs `cropLeft / (100 - cropWidth) × 100`, not `cropLeft`.
 */
function PetOverlay({ overlay }: { overlay: ThemePetOverlay }) {
  const positionAxis = (start: number, size: number) =>
    size >= 100 ? 0 : (start / (100 - size)) * 100;

  return (
    <div
      className="wt-scene__pet"
      aria-hidden="true"
      style={{
        left: `${overlay.leftPercent}%`,
        top: `${overlay.topPercent}%`,
        width: `${overlay.widthPercent}%`,
        aspectRatio: String(overlay.cropAspect),
        opacity: overlay.opacity ?? 1,
        backgroundImage: `url("${overlay.src}")`,
        backgroundSize: `${(100 / overlay.cropWidthPercent) * 100}% ${
          (100 / overlay.cropHeightPercent) * 100
        }%`,
        backgroundPosition: `${positionAxis(
          overlay.cropLeftPercent,
          overlay.cropWidthPercent,
        )}% ${positionAxis(overlay.cropTopPercent, overlay.cropHeightPercent)}%`,
      }}
    />
  );
}

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

      {/* Blacks out the pet painted into this backdrop, so only one shows. */}
      {pet.erase?.map((rect, index) => (
        <div
          key={`pet-erase-${index}`}
          className="wt-scene__erase wt-scene__erase--strong"
          aria-hidden="true"
          style={{
            left: `${rect.leftPercent}%`,
            top: `${rect.topPercent}%`,
            width: `${rect.widthPercent}%`,
            height: `${rect.heightPercent}%`,
          }}
        />
      ))}

      {pet.overlay && <PetOverlay overlay={pet.overlay} />}

      {/* The painted gold frame, re-lit in the candle's current colour. */}
      <div className="wt-scene__frame" aria-hidden="true" />

      <CandleGauge gauge={gauge} lit={lit} durationMs={durationMs} />

      {children}
    </div>
  );
}
