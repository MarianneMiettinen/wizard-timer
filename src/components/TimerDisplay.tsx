/**
 * The time readout.
 *
 * Two separate jobs, deliberately not combined:
 *
 *  - The visible digits are `aria-hidden`. A live region that updates every
 *    second makes a screen reader talk over everything else continuously,
 *    which is worse than useless.
 *  - A visually-hidden `role="status"` announces status *changes* only —
 *    started, paused, reset, finished. That is the information someone
 *    actually needs, delivered at the moments it changes.
 */

import { useTheme } from './ThemeProvider';

interface TimerDisplayProps {
  /** Pre-formatted by /core, e.g. "24:07". Digits only. */
  display: string;
  /** Announced to assistive tech. Changes only when the status changes. */
  announcement: string;
}

export function TimerDisplay({ display, announcement }: TimerDisplayProps) {
  const { copy } = useTheme();

  return (
    <div className="wt-display">
      <p className="wt-display__time" aria-hidden="true">
        {display}
      </p>
      <p className="wt-visually-hidden" role="status">
        {announcement}
      </p>
      <p className="wt-display__tagline">{copy.tagline}</p>
    </div>
  );
}
