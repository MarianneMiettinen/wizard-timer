/**
 * The time, in the middle of the scene — and the place you set it.
 *
 * Click the numbers and they become a text field, the way Google's timer works.
 * That keeps session length where you are already looking, instead of in a
 * separate form somewhere else on the page.
 *
 * Editable only while the timer is not running: retyping the length mid-session
 * would have to silently reset the session, and a click that throws away
 * running work is not a click anyone means to make.
 *
 * Accessibility note — two deliberately different treatments:
 *  - While running the digits are `aria-hidden`. A live region updating every
 *    second talks over everything else continuously.
 *  - While editable it is a real button whose accessible name carries the
 *    time. That name changes only when the duration changes, so it announces
 *    on purpose rather than constantly.
 */

import { useEffect, useRef, useState } from 'react';
import { useTheme } from './ThemeProvider';

const MS_PER_SECOND = 1_000;
const MS_PER_MINUTE = 60_000;
const MS_PER_HOUR = 3_600_000;

/**
 * Reads what someone typed into the readout:
 *   "25"      → 25 minutes        (bare numbers are minutes, the common case)
 *   "25:30"   → 25 min 30 s
 *   "1:30:00" → 1 h 30 min
 *
 * Returns null for anything unreadable, which leaves the timer untouched —
 * a typo should lose the edit, never the session.
 */
export function parseDuration(text: string): number | null {
  const parts = text.trim().split(':');
  if (parts.length === 0 || parts.length > 3) return null;
  if (parts.some((part) => !/^\d+$/.test(part.trim()))) return null;

  const numbers = parts.map((part) => Number(part.trim()));
  const [first = 0, second = 0, third = 0] = numbers;

  let total: number;
  if (numbers.length === 1) total = first * MS_PER_MINUTE;
  else if (numbers.length === 2) total = first * MS_PER_MINUTE + second * MS_PER_SECOND;
  else total = first * MS_PER_HOUR + second * MS_PER_MINUTE + third * MS_PER_SECOND;

  return total > 0 ? total : null;
}

interface TimerReadoutProps {
  /** Pre-formatted by /core, e.g. "24:07". Digits only. */
  display: string;
  /** Announced to assistive tech. Changes only when the status changes. */
  announcement: string;
  /** False while running, which is when editing is disallowed. */
  editable: boolean;
  onCommit(durationMs: number): void;
}

export function TimerReadout({
  display,
  announcement,
  editable,
  onCommit,
}: TimerReadoutProps) {
  const { scene, copy } = useTheme();

  // null means "not editing" — one piece of state instead of two that could
  // disagree with each other.
  const [draft, setDraft] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isEditing = draft !== null;

  useEffect(() => {
    if (isEditing) inputRef.current?.select();
  }, [isEditing]);

  // Starting the timer while the field is open would strand the edit.
  useEffect(() => {
    if (!editable) setDraft(null);
  }, [editable]);

  function commit() {
    if (draft === null) return;
    const parsed = parseDuration(draft);
    setDraft(null);
    if (parsed !== null) onCommit(parsed);
  }

  const position = {
    left: `${scene.timerXPercent}%`,
    top: `${scene.timerYPercent}%`,
  };

  return (
    <div className="wt-readout" style={position}>
      {isEditing ? (
        <form
          className="wt-readout__form"
          onSubmit={(event) => {
            event.preventDefault();
            commit();
          }}
        >
          <input
            ref={inputRef}
            className="wt-readout__input"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                setDraft(null);
                return;
              }
              // Handled explicitly rather than left to the form's implicit
              // submission, which several mobile keyboards never trigger.
              if (event.key === 'Enter') {
                event.preventDefault();
                commit();
              }
            }}
            aria-label={copy.editDurationLabel}
            inputMode="numeric"
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      ) : editable ? (
        <button
          type="button"
          className="wt-readout__value wt-readout__value--editable"
          onClick={() => setDraft(display)}
          aria-label={`${copy.editDurationLabel}: ${display}`}
        >
          {display}
        </button>
      ) : (
        <p className="wt-readout__value" aria-hidden="true">
          {display}
        </p>
      )}

      <p className="wt-visually-hidden" role="status">
        {announcement}
      </p>

      {editable && !isEditing && <p className="wt-readout__hint">{copy.editDurationHint}</p>}
    </div>
  );
}
