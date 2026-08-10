/**
 * Saving and restoring timer state via localStorage.
 *
 * THEME-AGNOSTIC — see /STARTER_TEMPLATE.md.
 * No colours, copy, assets or theme imports. The storage key is passed in by
 * the app rather than hardcoded, so two apps built from this template can run
 * on the same domain without overwriting each other's timers.
 *
 * Everything here is defensive on purpose. localStorage is shared, persistent,
 * and outside our control: it survives redeploys, so a future version of the
 * app will meet state written by this one. It can also be absent, full, or
 * edited by hand. None of that may crash the timer — the worst outcome allowed
 * is "starts fresh".
 */

import type { TimerState, TimerStatus } from './timer';

/**
 * Bump when the shape of TimerState changes. Saved data with a different
 * version is discarded rather than guessed at.
 */
const SCHEMA_VERSION = 1;

interface Envelope {
  v: number;
  state: TimerState;
}

export interface TimerStorage {
  /** The saved timer, or null if there isn't one, it's unreadable, or it's stale. */
  load(): TimerState | null;
  save(state: TimerState): void;
  clear(): void;
}

/**
 * Safari in private mode and browsers with site data blocked throw on access
 * rather than returning null, so this has to be a try/catch, not an if.
 */
function getStore(): Storage | null {
  try {
    if (typeof globalThis.localStorage === 'undefined') return null;
    const probe = '__timer_probe__';
    globalThis.localStorage.setItem(probe, '1');
    globalThis.localStorage.removeItem(probe);
    return globalThis.localStorage;
  } catch {
    return null;
  }
}

const VALID_STATUSES: readonly TimerStatus[] = ['idle', 'running', 'paused', 'finished'];

/**
 * Validates every field rather than trusting the JSON. A hand-edited or
 * half-written entry must be rejected wholesale, not partly adopted.
 */
function isTimerState(value: unknown): value is TimerState {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;

  const { durationMs, status, remainingAtLastChangeMs, runningSinceEpochMs } = candidate;

  if (typeof durationMs !== 'number' || !Number.isFinite(durationMs) || durationMs <= 0) {
    return false;
  }
  if (typeof status !== 'string' || !VALID_STATUSES.includes(status as TimerStatus)) {
    return false;
  }
  if (
    typeof remainingAtLastChangeMs !== 'number' ||
    !Number.isFinite(remainingAtLastChangeMs) ||
    remainingAtLastChangeMs < 0
  ) {
    return false;
  }
  if (
    runningSinceEpochMs !== null &&
    (typeof runningSinceEpochMs !== 'number' || !Number.isFinite(runningSinceEpochMs))
  ) {
    return false;
  }
  // A running timer without a start time can't be resumed correctly.
  if (status === 'running' && runningSinceEpochMs === null) return false;

  return true;
}

export function createTimerStorage(namespace: string): TimerStorage {
  const key = `${namespace}:timer`;

  return {
    load(): TimerState | null {
      const store = getStore();
      if (!store) return null;

      try {
        const raw = store.getItem(key);
        if (raw === null) return null;

        const parsed: unknown = JSON.parse(raw);
        if (typeof parsed !== 'object' || parsed === null) return null;

        const envelope = parsed as Partial<Envelope>;
        if (envelope.v !== SCHEMA_VERSION) return null;
        if (!isTimerState(envelope.state)) return null;

        return envelope.state;
      } catch {
        // Unreadable or corrupt. Start fresh rather than fail loudly.
        return null;
      }
    },

    save(state: TimerState): void {
      const store = getStore();
      if (!store) return;

      try {
        const envelope: Envelope = { v: SCHEMA_VERSION, state };
        store.setItem(key, JSON.stringify(envelope));
      } catch {
        // Quota exceeded, or storage revoked mid-session. Losing a saved timer
        // is not worth interrupting a running one.
      }
    },

    clear(): void {
      const store = getStore();
      if (!store) return;
      try {
        store.removeItem(key);
      } catch {
        // Nothing useful to do.
      }
    },
  };
}
