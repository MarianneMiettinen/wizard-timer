/**
 * Typed session length: hours and minutes, applied on submit.
 *
 * Sits alongside the presets rather than replacing them — the presets are what
 * make the app work on first open with no input at all, and this is the escape
 * hatch for anyone the presets don't fit.
 *
 * Applied on submit rather than on each keystroke. Live-applying means typing
 * "45" sets a 4-minute session before it sets a 45-minute one, resetting a
 * running timer twice on the way. Pressing Enter in either field submits.
 */

import { useEffect, useId, useState, type FormEvent } from 'react';
import { useTheme } from './ThemeProvider';

const MS_PER_MINUTE = 60_000;
const MINUTES_PER_HOUR = 60;

/** Empty, negative and non-numeric all mean "nothing entered", i.e. zero. */
function parseField(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

interface CustomDurationProps {
  /** Current session length, so the fields reflect presets and resets too. */
  durationMs: number;
  onSelect(durationMs: number): void;
}

export function CustomDuration({ durationMs, onSelect }: CustomDurationProps) {
  const { session, copy } = useTheme();

  const hoursFieldId = useId();
  const minutesFieldId = useId();

  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');

  // Mirror the active duration into the fields, so picking a preset or hitting
  // reset updates them rather than leaving stale numbers sitting there.
  useEffect(() => {
    const totalMinutes = Math.round(durationMs / MS_PER_MINUTE);
    const wholeHours = Math.floor(totalMinutes / MINUTES_PER_HOUR);
    setHours(wholeHours > 0 ? String(wholeHours) : '');
    setMinutes(String(totalMinutes % MINUTES_PER_HOUR));
  }, [durationMs]);

  const requestedMinutes = Math.min(
    session.maxMinutes,
    parseField(hours) * MINUTES_PER_HOUR + parseField(minutes),
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (requestedMinutes <= 0) return;
    onSelect(requestedMinutes * MS_PER_MINUTE);
  }

  return (
    <form className="wt-custom" onSubmit={handleSubmit}>
      <fieldset className="wt-custom__group">
        <legend className="wt-custom__legend">{copy.customLegend}</legend>

        <div className="wt-custom__fields">
          <div className="wt-custom__field">
            <label className="wt-custom__label" htmlFor={hoursFieldId}>
              {copy.hoursLabel}
            </label>
            <input
              id={hoursFieldId}
              className="wt-input"
              type="number"
              // Brings up the number pad on phones instead of the full keyboard.
              inputMode="numeric"
              min={0}
              // Deliberately no `max`. An out-of-range number input is invalid,
              // and an invalid field makes the browser refuse to submit the
              // form at all — so a `max` here would silently swallow the click
              // instead of capping the value. The cap is applied in JS below,
              // and the fields then re-sync to show what was actually set.
              value={hours}
              onChange={(event) => setHours(event.target.value)}
            />
          </div>

          <div className="wt-custom__field">
            <label className="wt-custom__label" htmlFor={minutesFieldId}>
              {copy.minutesLabel}
            </label>
            <input
              id={minutesFieldId}
              className="wt-input"
              type="number"
              inputMode="numeric"
              min={0}
              // Not capped at 59 — "90 minutes" is a normal thing to type, and
              // making someone convert it to 1h30 is a pointless bit of maths.
              // No `max` either, for the same reason as the hours field.
              value={minutes}
              onChange={(event) => setMinutes(event.target.value)}
            />
          </div>

          <button
            type="submit"
            className="wt-button wt-button--quiet wt-custom__apply"
            disabled={requestedMinutes <= 0}
          >
            {copy.applyDuration}
          </button>
        </div>
      </fieldset>
    </form>
  );
}
