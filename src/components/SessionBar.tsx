/**
 * Session-length presets and reset, in a strip under the artwork.
 *
 * These live outside the picture on purpose. The artwork has no room for them,
 * and hiding them behind one of the painted buttons would mean a first-time
 * visitor has to go looking for the single most common adjustment. Typing an
 * exact length is handled by clicking the readout itself; this is the
 * one-click path for the usual lengths.
 *
 * The presets stay clickable at all times, including mid-session. Picking one
 * resets the timer to that length, which is destructive-but-trivial: one click
 * to undo by picking the old one. Disabling them mid-session would read as
 * "you are locked in until this finishes".
 */

import { useTheme } from './ThemeProvider';

const MS_PER_MINUTE = 60_000;

interface SessionBarProps {
  /** Current session length in ms, used to mark the active preset. */
  durationMs: number;
  onSelect(durationMs: number): void;
  onReset(): void;
}

export function SessionBar({ durationMs, onSelect, onReset }: SessionBarProps) {
  const { session, copy } = useTheme();

  return (
    <div className="wt-sessionbar">
      <span className="wt-sessionbar__legend">{copy.durationLegend}</span>

      <div className="wt-sessionbar__options">
        {session.presetMinutes.map((minutes) => {
          const presetMs = minutes * MS_PER_MINUTE;
          return (
            <button
              key={minutes}
              type="button"
              className="wt-chip"
              // aria-pressed rather than a radio group: these take effect
              // immediately, they are not a selection you confirm later.
              aria-pressed={presetMs === durationMs}
              onClick={() => onSelect(presetMs)}
            >
              {minutes} {copy.minuteSuffix}
            </button>
          );
        })}
      </div>

      <button type="button" className="wt-chip wt-chip--quiet" onClick={onReset}>
        {copy.reset}
      </button>
    </div>
  );
}
