/**
 * Countdown timer logic. Pure, synchronous, dependency-free.
 *
 * THEME-AGNOSTIC — see /STARTER_TEMPLATE.md.
 * This file must never contain a colour, a font, a copy string, an asset path,
 * or an import from /themes or /components. It must also stay free of React:
 * everything here is a plain function over plain data, so it can be reused,
 * reasoned about, and tested without a UI.
 *
 * Why time is stored the way it is
 * --------------------------------
 * The remaining time is NOT decremented on an interval. Intervals drift, and
 * browsers throttle them hard in background tabs — a decrementing timer loses
 * minutes while the user is in another tab, and loses everything on reload.
 *
 * Instead the state stores two facts and derives the rest from the wall clock:
 *   - how much time was left at the last status change
 *   - the absolute timestamp of that change
 *
 * Remaining time is then a subtraction against `Date.now()`. That stays correct
 * across throttled tabs, sleeping laptops and page reloads, which is also what
 * makes /core/persistence.ts able to resume a running timer for free.
 */

export type TimerStatus = 'idle' | 'running' | 'paused' | 'finished';

export interface TimerState {
  /** Full length of the session in ms. Unchanged by running the timer. */
  readonly durationMs: number;
  readonly status: TimerStatus;
  /**
   * Time left as of the last status change. Authoritative while idle, paused
   * or finished. While running it is the starting point for the subtraction,
   * not the live value — call `remainingMs()` for that.
   */
  readonly remainingAtLastChangeMs: number;
  /** Epoch ms of the moment the timer last started running. Null when not running. */
  readonly runningSinceEpochMs: number | null;
}

/** A session shorter than this isn't a timer, it's a flicker. */
export const MIN_DURATION_MS = 1_000;

/** Guards against NaN, negatives and fractional milliseconds from user input. */
export function clampDuration(durationMs: number): number {
  if (!Number.isFinite(durationMs)) return MIN_DURATION_MS;
  return Math.max(MIN_DURATION_MS, Math.round(durationMs));
}

export function createTimer(durationMs: number): TimerState {
  const duration = clampDuration(durationMs);
  return {
    durationMs: duration,
    status: 'idle',
    remainingAtLastChangeMs: duration,
    runningSinceEpochMs: null,
  };
}

/**
 * Time left right now, in ms. Never negative.
 * `now` is passed in rather than read from the clock so callers can test this.
 */
export function remainingMs(state: TimerState, now: number): number {
  if (state.status !== 'running' || state.runningSinceEpochMs === null) {
    return Math.max(0, state.remainingAtLastChangeMs);
  }
  const elapsed = now - state.runningSinceEpochMs;
  return Math.max(0, state.remainingAtLastChangeMs - elapsed);
}

/**
 * How far through the session we are: 0 at the start, 1 when it is over.
 * Themes use this to drive visuals (a candle burning down, a bar filling).
 * It is deliberately a plain number — /core does not know what it looks like.
 */
export function elapsedFraction(state: TimerState, now: number): number {
  if (state.durationMs <= 0) return 1;
  const fraction = 1 - remainingMs(state, now) / state.durationMs;
  return Math.min(1, Math.max(0, fraction));
}

export function start(state: TimerState, now: number): TimerState {
  if (state.status === 'running') return state;

  // Starting a finished timer runs the whole session again rather than
  // starting a zero-length one.
  const remaining =
    state.status === 'finished' ? state.durationMs : remainingMs(state, now);

  return {
    ...state,
    status: 'running',
    remainingAtLastChangeMs: remaining,
    runningSinceEpochMs: now,
  };
}

export function pause(state: TimerState, now: number): TimerState {
  if (state.status !== 'running') return state;
  return {
    ...state,
    status: 'paused',
    remainingAtLastChangeMs: remainingMs(state, now),
    runningSinceEpochMs: null,
  };
}

export function toggle(state: TimerState, now: number): TimerState {
  return state.status === 'running' ? pause(state, now) : start(state, now);
}

/** Back to a full, unstarted session of the same length. */
export function reset(state: TimerState): TimerState {
  return createTimer(state.durationMs);
}

/**
 * Changing the length always returns to idle — a half-run old session is
 * meaningless. `_state` is unused but kept so every transition has the same
 * (state, ...args) => state shape.
 */
export function setDuration(_state: TimerState, durationMs: number): TimerState {
  return createTimer(durationMs);
}

/**
 * The one transition the passage of time can cause on its own.
 * Returns the same object when nothing changed, so callers can use identity
 * to decide whether to re-render or re-save.
 */
export function settle(state: TimerState, now: number): TimerState {
  if (state.status === 'running' && remainingMs(state, now) <= 0) {
    return {
      ...state,
      status: 'finished',
      remainingAtLastChangeMs: 0,
      runningSinceEpochMs: null,
    };
  }
  return state;
}

/**
 * Milliseconds as `m:ss`, or `h:mm:ss` past an hour.
 *
 * Rounds up, so a timer set to 10 minutes reads "10:00" on the first frame
 * instead of flashing "9:59" — and only shows "0:00" when the time is
 * genuinely gone. No words, so it stays language- and theme-neutral.
 */
export function formatDuration(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const paddedSeconds = String(seconds).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${paddedSeconds}`;
  }
  return `${minutes}:${paddedSeconds}`;
}
