/**
 * One of the round buttons painted into the artwork, made real.
 *
 * The overlay covers the painted button completely rather than sitting inside
 * it, because it has to redraw the icon and label anyway — the START button's
 * glyph changes, and a painted play triangle showing under a live pause icon
 * would be worse than redrawing both.
 *
 * Position and size come from the theme as percentages of the artwork, so the
 * button tracks the picture exactly at any size. `aspect-ratio: 1` on a
 * percentage width is what keeps it circular.
 */

import type { ReactNode } from 'react';
import type { ThemeSceneButton } from '../themes/theme.types';

interface SceneButtonProps {
  position: ThemeSceneButton;
  /** Text drawn inside the circle, under the icon. */
  label: string;
  /** Overrides the label for assistive tech when the label alone is too terse. */
  accessibleLabel?: string;
  icon: ReactNode;
  onClick(): void;
  /** The larger, brighter treatment. The artwork gives START this weight. */
  emphasis?: boolean;
  /** Small corner treatment: the label sits *below* the circle, not inside it. */
  compact?: boolean;
  /** Visibly "off" — for a toggle whose off state must not look like a fault. */
  dimmed?: boolean;
  expanded?: boolean;
  pressed?: boolean;
}

export function SceneButton({
  position,
  label,
  accessibleLabel,
  icon,
  onClick,
  emphasis = false,
  compact = false,
  dimmed = false,
  expanded,
  pressed,
}: SceneButtonProps) {
  const className = [
    'wt-orb',
    emphasis && 'wt-orb--emphasis',
    compact && 'wt-orb--compact',
    dimmed && 'wt-orb--dimmed',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={className}
      style={{
        left: `${position.xPercent}%`,
        top: `${position.yPercent}%`,
        width: `${position.radiusPercent * 2}%`,
      }}
      onClick={onClick}
      aria-label={accessibleLabel}
      aria-expanded={expanded}
      aria-pressed={pressed}
    >
      <span className="wt-orb__icon">{icon}</span>
      <span className="wt-orb__label">{label}</span>
    </button>
  );
}
