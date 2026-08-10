/**
 * React binding for /core/timer.ts.
 *
 * THEME-AGNOSTIC — see /STARTER_TEMPLATE.md.
 * This is the only file in /core that knows React exists, and it still knows
 * nothing about the theme: it returns numbers, a status, and functions. It
 * never returns a colour, a label, or an asset. What that means visually is
 * decided entirely in /themes and /components.
 *
 * It owns the three things the pure logic deliberately does not: the clock,
 * the save/restore round trip, and the one-shot "it just finished" signal.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createTimer,
  elapsedFraction,
  formatDuration,
  pause as pauseTimer,
  remainingMs as remainingMsOf,
  reset as resetTimer,
  setDuration as setDurationOf,
  settle,
  start as startTimer,
  toggle as toggleTimer,
  type TimerState,
  type TimerStatus,
} from './timer';
import { createTimerStorage } from './persistence';

export interface UseTimerOptions {
  /** Namespace for localStorage. Give each app built from this template its own. */
  storageKey: string;
  /** Length used when there is nothing saved — i.e. on a genuine first visit. */
  defaultDurationMs: number;
  /**
   * How often the displayed time is recomputed. 250ms keeps the seconds
   * readout honest without re-rendering 60 times a second for a value that
   * changes once a second.
   */
  tickMs?: number;
  /** Fired once, on the transition into 'finished'. Never fired on page load. */
  onFinish?: () => void;
}

export interface Timer {
  readonly status: TimerStatus;
  readonly isRunning: boolean;
  readonly isFinished: boolean;
  readonly durationMs: number;
  readonly remainingMs: number;
  /** Remaining time as `m:ss`, ready to render. Digits only, no words. */
  readonly display: string;
  /** 0 at the start of the session, 1 when it is over. Drives theme visuals. */
  readonly elapsedFraction: number;
  start(): void;
  pause(): void;
  toggle(): void;
  reset(): void;
  setDurationMs(durationMs: number): void;
}

export function useTimer(options: UseTimerOptions): Timer {
  const { storageKey, defaultDurationMs, tickMs = 250, onFinish } = options;

  const storage = useMemo(() => createTimerStorage(storageKey), [storageKey]);

  const [state, setState] = useState<TimerState>(() => {
    const saved = storage.load();
    // A timer saved while running may have run out while the tab was closed,
    // so settle it before it is ever shown.
    return settle(saved ?? createTimer(defaultDurationMs), Date.now());
  });

  const [now, setNow] = useState<number>(() => Date.now());

  // Seeded from the initial state so that resuming an already-expired timer on
  // page load does not fire onFinish — nobody wants a chime for a session that
  // ended yesterday.
  const previousStatus = useRef<TimerStatus>(state.status);

  // Held in a ref so an inline arrow function in the caller doesn't restart the
  // finish-detection effect on every render.
  const onFinishRef = useRef(onFinish);
  useEffect(() => {
    onFinishRef.current = onFinish;
  }, [onFinish]);

  /**
   * Applies a transition against a freshly-read clock, and moves `now` to the
   * same instant. Sharing one timestamp matters: reading the clock twice can
   * briefly show more time remaining than the session actually has.
   */
  const run = useCallback((transition: (state: TimerState, now: number) => TimerState) => {
    const stamp = Date.now();
    setNow(stamp);
    setState((current) => transition(current, stamp));
  }, []);

  const start = useCallback(() => run(startTimer), [run]);
  const pause = useCallback(() => run(pauseTimer), [run]);
  const toggle = useCallback(() => run(toggleTimer), [run]);
  const reset = useCallback(() => run((current) => resetTimer(current)), [run]);
  const setDurationMs = useCallback(
    (durationMs: number) => run((current) => setDurationOf(current, durationMs)),
    [run],
  );

  // Tick only while running. An idle timer should cost nothing.
  useEffect(() => {
    if (state.status !== 'running') return;
    const id = window.setInterval(() => setNow(Date.now()), tickMs);
    return () => window.clearInterval(id);
  }, [state.status, tickMs]);

  // Background tabs get their intervals throttled to once a minute or worse, so
  // the displayed time can be badly stale on return. Re-read the clock the
  // moment the tab is looked at again.
  useEffect(() => {
    const resync = () => setNow(Date.now());
    document.addEventListener('visibilitychange', resync);
    window.addEventListener('focus', resync);
    return () => {
      document.removeEventListener('visibilitychange', resync);
      window.removeEventListener('focus', resync);
    };
  }, []);

  // `settle` returns the identical object when nothing changed, so this is a
  // no-op re-render bail-out on every tick except the one that ends the session.
  useEffect(() => {
    setState((current) => settle(current, now));
  }, [now]);

  useEffect(() => {
    storage.save(state);
  }, [state, storage]);

  useEffect(() => {
    if (previousStatus.current !== 'finished' && state.status === 'finished') {
      onFinishRef.current?.();
    }
    previousStatus.current = state.status;
  }, [state.status]);

  const remaining = remainingMsOf(state, now);

  return {
    status: state.status,
    isRunning: state.status === 'running',
    isFinished: state.status === 'finished',
    durationMs: state.durationMs,
    remainingMs: remaining,
    display: formatDuration(remaining),
    elapsedFraction: elapsedFraction(state, now),
    start,
    pause,
    toggle,
    reset,
    setDurationMs,
  };
}
