/**
 * Chooser for the background music, hanging off the MUSIC button.
 *
 * Lists the mixes plus an "off" option carrying the struck-through note icon,
 * so silence is a visible choice in the same list rather than a separate
 * control you have to know about.
 *
 * Closes on Escape and on a click outside, like the pet chooser — a popover
 * dismissable only by its own button is a trap on touch screens.
 */

import { useEffect, useRef } from 'react';
import type { ThemeSceneButton } from '../themes/theme.types';
import { MusicIcon, MutedMusicIcon } from './icons';
import { useMediaQuery, WIDE_VIEWPORT } from './useMediaQuery';
import { useTheme } from './ThemeProvider';

interface MusicPickerProps {
  anchor: ThemeSceneButton;
  /** id of the playing mix, or null when music is off. */
  activeId: string | null;
  onSelect(mixId: string | null): void;
  onDismiss(): void;
}

export function MusicPicker({ anchor, activeId, onSelect, onDismiss }: MusicPickerProps) {
  const { music, copy } = useTheme();
  const panelRef = useRef<HTMLDivElement>(null);
  const isWide = useMediaQuery(WIDE_VIEWPORT);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onDismiss();
    }
    function onPointerDown(event: PointerEvent) {
      const panel = panelRef.current;
      if (panel && !panel.contains(event.target as Node)) onDismiss();
    }

    document.addEventListener('keydown', onKeyDown);
    // Deferred a tick, or the click that opened this closes it again.
    const id = window.setTimeout(() => {
      document.addEventListener('pointerdown', onPointerDown);
    }, 0);

    return () => {
      window.clearTimeout(id);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [onDismiss]);

  return (
    <div
      ref={panelRef}
      className="wt-musicpicker"
      role="dialog"
      aria-label={copy.musicPickerLabel}
      /* Anchored to its button only on wide screens — see PetPicker. */
      style={
        isWide
          ? {
              // Left-aligned to the button so it opens away from the readout.
              left: `${anchor.xPercent - anchor.radiusPercent}%`,
              bottom: `${100 - anchor.yPercent + anchor.radiusPercent * 1.35}%`,
            }
          : undefined
      }
    >
      <p className="wt-musicpicker__title">{copy.musicPickerLabel}</p>

      <div className="wt-musicpicker__options">
        {music.map((mix) => (
          <button
            key={mix.id}
            type="button"
            className="wt-musicpicker__option"
            aria-pressed={mix.id === activeId}
            onClick={() => onSelect(mix.id)}
          >
            <span className="wt-musicpicker__icon">
              <MusicIcon />
            </span>
            {mix.label}
          </button>
        ))}

        <button
          type="button"
          className="wt-musicpicker__option"
          aria-pressed={activeId === null}
          onClick={() => onSelect(null)}
        >
          <span className="wt-musicpicker__icon">
            <MutedMusicIcon />
          </span>
          {copy.musicOff}
        </button>
      </div>
    </div>
  );
}
