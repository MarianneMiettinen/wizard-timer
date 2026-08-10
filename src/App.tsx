/**
 * Wires /core to the active theme. This is the seam between the two halves of
 * the repo, and it is deliberately short — if this file starts growing logic,
 * that logic almost certainly belongs in /core (if it's about time) or in a
 * component (if it's about pixels).
 */

import { useTheme, ThemeProvider } from './components/ThemeProvider';
import { Controls } from './components/Controls';
import { CustomDuration } from './components/CustomDuration';
import { DurationPicker } from './components/DurationPicker';
import { Stage } from './components/Stage';
import { TimerDisplay } from './components/TimerDisplay';
import { useCompletionSound } from './components/useCompletionSound';
import { useTimer } from './core/useTimer';

import { wizardSchoolTheme } from './themes/wizard-school/theme.config';

import './styles/app.css';

// ───────────────────────────────────────────────────────────────────────────
// THE ACTIVE THEME.
// This import and this line are the entire wiring. To ship a different app,
// point both at another folder under /themes — nothing else in /src changes.
const activeTheme = wizardSchoolTheme;
// ───────────────────────────────────────────────────────────────────────────

/**
 * localStorage namespace. Give each app built from this template its own, or
 * two of them served from the same domain will fight over one saved timer.
 */
const STORAGE_KEY = 'wizard-focus-timer';

const MS_PER_MINUTE = 60_000;

export default function App() {
  return (
    <ThemeProvider theme={activeTheme}>
      <TimerScreen />
    </ThemeProvider>
  );
}

/**
 * Split out from App so it can call useTheme() — a component cannot read a
 * context that it renders the provider for.
 */
function TimerScreen() {
  const { copy, session, sounds } = useTheme();

  const playCompletionSound = useCompletionSound(sounds.complete, sounds.completeVolume);

  const timer = useTimer({
    storageKey: STORAGE_KEY,
    defaultDurationMs: session.defaultMinutes * MS_PER_MINUTE,
    onFinish: playCompletionSound,
  });

  // Screen-reader announcement. Derived rather than stored, so it can only ever
  // describe the status the UI is actually in.
  const announcement =
    timer.status === 'running'
      ? copy.announceRunning
      : timer.status === 'paused'
        ? copy.announcePaused
        : timer.status === 'finished'
          ? copy.announceFinished
          : copy.announceReset;

  return (
    <main className="wt-main">
      <h1 className="wt-title">{copy.title}</h1>

      <Stage elapsedFraction={timer.elapsedFraction} lit={timer.isRunning} />

      <TimerDisplay display={timer.display} announcement={announcement} />

      {timer.isFinished && (
        <div className="wt-finished">
          <p className="wt-finished__heading">{copy.finishedHeading}</p>
          <p className="wt-finished__body">{copy.finishedBody}</p>
        </div>
      )}

      <Controls status={timer.status} onToggle={timer.toggle} onReset={timer.reset} />

      <DurationPicker durationMs={timer.durationMs} onSelect={timer.setDurationMs} />

      <CustomDuration durationMs={timer.durationMs} onSelect={timer.setDurationMs} />
    </main>
  );
}
