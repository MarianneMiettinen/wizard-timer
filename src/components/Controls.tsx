/**
 * Start / pause / reset.
 *
 * One primary button whose label changes with the status, rather than several
 * buttons that appear and disappear — a control that moves under the cursor is
 * a control you misclick.
 *
 * Every label comes from theme.copy. There is no fallback string in this file
 * on purpose: a missing label should be obvious in review, not silently papered
 * over with English.
 */

import type { TimerStatus } from '../core/timer';
import { useTheme } from './ThemeProvider';

interface ControlsProps {
  status: TimerStatus;
  onToggle(): void;
  onReset(): void;
}

export function Controls({ status, onToggle, onReset }: ControlsProps) {
  const { copy } = useTheme();

  const primaryLabel =
    status === 'running' ? copy.pause : status === 'idle' ? copy.start : copy.resume;

  return (
    <div className="wt-controls">
      <button type="button" className="wt-button wt-button--primary" onClick={onToggle}>
        {primaryLabel}
      </button>
      <button type="button" className="wt-button wt-button--quiet" onClick={onReset}>
        {copy.reset}
      </button>
    </div>
  );
}
