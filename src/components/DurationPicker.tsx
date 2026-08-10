/**
 * Session length, as a row of presets.
 *
 * The presets stay clickable at all times, including mid-session. Picking one
 * resets the timer to that length, which is destructive-but-trivial: one click
 * to undo by picking the old one again. Disabling them would be the more
 * "correct" choice and the worse one — a greyed-out control mid-session reads
 * as "you are locked in until this finishes".
 *
 * `aria-pressed` rather than a radio group: these are actions that take effect
 * immediately, not a selection you confirm later.
 */

import { useTheme } from './ThemeProvider';

const MS_PER_MINUTE = 60_000;

interface DurationPickerProps {
  /** Current session length in ms, used to mark the active preset. */
  durationMs: number;
  onSelect(durationMs: number): void;
}

export function DurationPicker({ durationMs, onSelect }: DurationPickerProps) {
  const { session, copy } = useTheme();

  return (
    <fieldset className="wt-durations">
      <legend className="wt-durations__legend">{copy.durationLegend}</legend>
      <div className="wt-durations__options">
        {session.presetMinutes.map((minutes) => {
          const presetMs = minutes * MS_PER_MINUTE;
          return (
            <button
              key={minutes}
              type="button"
              className="wt-button wt-button--chip"
              aria-pressed={presetMs === durationMs}
              onClick={() => onSelect(presetMs)}
            >
              {minutes} {copy.minuteSuffix}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
