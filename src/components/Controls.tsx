/**
 * Start / pause / reset.
 *
 * One primary button whose icon and label both change with the status, rather
 * than several buttons that appear and disappear — a control that moves under
 * the cursor is a control you misclick.
 *
 * Icon *and* text, not icon alone: a bare ▶ is ambiguous the first time you see
 * it, and the theme's wording ("Light the candle") is doing real work here.
 *
 * The two glyphs are inline SVG drawn in `currentColor`, so they take the
 * button's text colour from the theme like any other text would. They are
 * deliberately not theme assets — a play triangle is a standard control glyph,
 * the same category of thing as a border radius, not a piece of the wizard.
 * A theme that wants its own icons should add fields to ThemeAssets.
 */

import type { TimerStatus } from '../core/timer';
import { useTheme } from './ThemeProvider';

function PlayIcon() {
  return (
    <svg
      className="wt-button__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinejoin="round"
    >
      <path d="M8.5 5.6 L19 12 L8.5 18.4 Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg
      className="wt-button__icon"
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
    >
      <rect x="6.5" y="4.5" width="4.4" height="15" rx="1.6" />
      <rect x="13.1" y="4.5" width="4.4" height="15" rx="1.6" />
    </svg>
  );
}

interface ControlsProps {
  status: TimerStatus;
  onToggle(): void;
  onReset(): void;
}

export function Controls({ status, onToggle, onReset }: ControlsProps) {
  const { copy } = useTheme();

  const isRunning = status === 'running';
  const primaryLabel = isRunning ? copy.pause : status === 'idle' ? copy.start : copy.resume;

  return (
    <div className="wt-controls">
      <button type="button" className="wt-button wt-button--primary" onClick={onToggle}>
        {isRunning ? <PauseIcon /> : <PlayIcon />}
        {primaryLabel}
      </button>
      <button type="button" className="wt-button wt-button--quiet" onClick={onReset}>
        {copy.reset}
      </button>
    </div>
  );
}
