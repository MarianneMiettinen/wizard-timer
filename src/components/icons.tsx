/**
 * Control glyphs.
 *
 * All drawn in `currentColor`, so they take the button's colour from the theme
 * like any other text would. They are deliberately **not** theme assets: a play
 * triangle and a pause bar are standard control glyphs, the same category of
 * thing as a border radius, not part of the wizard. A theme that genuinely
 * wants its own iconography should add fields to the Theme type.
 */

export function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      <path
        d="M8.6 5.2 L19.4 12 L8.6 18.8 Z"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      <rect x="6.4" y="4.5" width="4.4" height="15" rx="1.6" />
      <rect x="13.2" y="4.5" width="4.4" height="15" rx="1.6" />
    </svg>
  );
}

export function CatIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      {/* Ears */}
      <path d="M4.6 3.4 L8.8 6.6 L4.9 9.4 Z" />
      <path d="M19.4 3.4 L15.2 6.6 L19.1 9.4 Z" />
      {/* Head */}
      <path d="M12 5.6 c4.5 0 7.4 3.1 7.4 7 c0 4.2 -3.2 6.8 -7.4 6.8 s-7.4 -2.6 -7.4 -6.8 c0 -3.9 2.9 -7 7.4 -7 Z" />
      {/* Eyes and nose, punched out in the button's own background colour */}
      <circle cx="9.2" cy="11.6" r="1.15" fill="var(--wt-color-background)" />
      <circle cx="14.8" cy="11.6" r="1.15" fill="var(--wt-color-background)" />
      <path d="M12 14.2 l1.5 1.2 h-3 Z" fill="var(--wt-color-background)" />
    </svg>
  );
}

export function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none">
      <path
        d="M6.4 6.4 L17.6 17.6 M17.6 6.4 L6.4 17.6"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MusicIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M19 3.2 v10.4 a3 3 0 1 1 -1.9 -2.8 V6.5 l-6.6 1.7 v8.1 a3 3 0 1 1 -1.9 -2.8 V6 Z" />
    </svg>
  );
}

export function MutedMusicIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="currentColor">
      <path d="M19 3.2 v10.4 a3 3 0 1 1 -1.9 -2.8 V6.5 l-6.6 1.7 v8.1 a3 3 0 1 1 -1.9 -2.8 V6 Z" opacity="0.45" />
      <path
        d="M3.6 3.6 L20.4 20.4"
        stroke="currentColor"
        strokeWidth="2.1"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
