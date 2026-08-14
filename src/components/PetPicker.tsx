/**
 * Chooser for which familiar sits beside the wizard.
 *
 * Each pet is a whole alternate render of the scene, so the thumbnails are
 * zoomed crops of those same images — no separate thumbnail files to download,
 * and a thumbnail can never disagree with the artwork it selects.
 *
 * Closes on Escape and on a click outside, because a popover that can only be
 * dismissed by the button that opened it is a trap on touch screens.
 */

import { useEffect, useRef, type CSSProperties } from 'react';
import type { ThemePet, ThemeSceneButton } from '../themes/theme.types';
import { useTheme } from './ThemeProvider';

interface PetPickerProps {
  /** The button it hangs above, so it tracks the artwork with everything else. */
  anchor: ThemeSceneButton;
  activeId: string;
  onSelect(id: string): void;
  onDismiss(): void;
}

export function PetPicker({ anchor, activeId, onSelect, onDismiss }: PetPickerProps) {
  const { pets, copy } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onDismiss();
    }
    function onPointerDown(event: PointerEvent) {
      const panel = panelRef.current;
      if (panel && !panel.contains(event.target as Node)) onDismiss();
    }

    document.addEventListener('keydown', onKeyDown);
    // Deferred by a tick: the click that opened this would otherwise close it
    // again in the same gesture.
    const id = window.setTimeout(() => {
      document.addEventListener('pointerdown', onPointerDown);
    }, 0);

    return () => {
      window.clearTimeout(id);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [onDismiss]);

  function thumbnailStyle(pet: ThemePet) {
    return {
      // A composited pet is not in its backdrop, so cropping the backdrop would
      // show whichever animal is painted there — the cat, for every one of them.
      backgroundImage: `url("${pet.overlay?.src ?? pet.scene}")`,
      backgroundSize: `${pet.focusZoom * 100}%`,
      backgroundPosition: `${pet.focusXPercent}% ${pet.focusYPercent}%`,
    };
  }

  return (
    <div
      ref={panelRef}
      className="wt-petpicker"
      role="dialog"
      aria-label={copy.petPickerLabel}
      /*
       * Published as variables, not as positions — see ScrollNote for why.
       * Right-aligned to the button rather than centred on it, so the panel
       * opens away from the readout instead of across it.
       */
      style={
        {
          '--wt-pick-right': `${100 - (anchor.xPercent + anchor.radiusPercent)}%`,
          '--wt-pick-bottom': `${100 - anchor.yPercent + anchor.radiusPercent * 1.35}%`,
        } as CSSProperties
      }
    >
      <p className="wt-petpicker__title">{copy.petPickerLabel}</p>
      <div className="wt-petpicker__options">
        {pets.map((pet) => (
          <button
            key={pet.id}
            type="button"
            className="wt-petpicker__option"
            // Redundant with the visible label, but the name is too important
            // to leave to how a given engine walks nested spans.
            aria-label={pet.label}
            aria-pressed={pet.id === activeId}
            onClick={() => onSelect(pet.id)}
          >
            <span className="wt-petpicker__thumb" style={thumbnailStyle(pet)} />
            <span className="wt-petpicker__label">{pet.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
