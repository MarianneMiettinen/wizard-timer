/**
 * Wires /core to the active theme. This is the seam between the two halves of
 * the repo, and it is deliberately short — if this file starts growing logic,
 * that logic almost certainly belongs in /core (if it's about time) or in a
 * component (if it's about pixels).
 */

import { useCallback, useState } from 'react';
import { PetPicker } from './components/PetPicker';
import { SessionBar } from './components/SessionBar';
import { Scene } from './components/Scene';
import { SceneButton } from './components/SceneButton';
import { ThemeProvider, useTheme } from './components/ThemeProvider';
import { TimerReadout } from './components/TimerReadout';
import { useCompletionSound } from './components/useCompletionSound';
import { CatIcon, MusicIcon, MutedMusicIcon, PauseIcon, PlayIcon } from './components/icons';
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
  const { copy, pets, session, sounds } = useTheme();

  const defaultPet = pets[0];
  const [petId, setPetId] = useState(defaultPet?.id ?? '');
  const [petPickerOpen, setPetPickerOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const activePet = pets.find((pet) => pet.id === petId) ?? defaultPet;

  // Passing null when muted means the muted state is enforced at the source,
  // rather than by remembering not to call play().
  const playCompletionSound = useCompletionSound(
    soundOn ? sounds.complete : null,
    sounds.completeVolume,
  );

  const timer = useTimer({
    storageKey: STORAGE_KEY,
    defaultDurationMs: session.defaultMinutes * MS_PER_MINUTE,
    onFinish: playCompletionSound,
  });

  const dismissPetPicker = useCallback(() => setPetPickerOpen(false), []);

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

  if (!activePet) return null;

  return (
    <main className="wt-main">
      <h1 className="wt-visually-hidden">{copy.title}</h1>

      <Scene
        pet={activePet}
        remainingFraction={1 - timer.elapsedFraction}
        durationMs={timer.durationMs}
        // Lit unless it has burned out. A candle that goes dark the moment you
        // pause reads as "you lost it" — the artwork's whole mood is a candle
        // quietly burning, and pausing shouldn't punish you with darkness.
        lit={!timer.isFinished}
      >
        <TimerReadout
          display={timer.display}
          announcement={announcement}
          editable={!timer.isRunning}
          onCommit={timer.setDurationMs}
        />

        {timer.isFinished && (
          <div className="wt-finished">
            <p className="wt-finished__heading">{copy.finishedHeading}</p>
            <p className="wt-finished__body">{copy.finishedBody}</p>
          </div>
        )}

        <SceneButton
          position={activePet.buttons.pet}
          label={copy.petButton}
          accessibleLabel={copy.petPickerLabel}
          icon={<CatIcon />}
          onClick={() => setPetPickerOpen((open) => !open)}
          expanded={petPickerOpen}
        />

        <SceneButton
          position={activePet.buttons.start}
          label={timer.isRunning ? copy.pauseButton : copy.startButton}
          accessibleLabel={timer.isRunning ? copy.pauseAction : copy.startAction}
          icon={timer.isRunning ? <PauseIcon /> : <PlayIcon />}
          onClick={timer.toggle}
          emphasis
        />

        <SceneButton
          position={activePet.buttons.music}
          label={copy.musicButton}
          accessibleLabel={soundOn ? copy.soundOn : copy.soundOff}
          icon={soundOn ? <MusicIcon /> : <MutedMusicIcon />}
          onClick={() => setSoundOn((on) => !on)}
          pressed={soundOn}
        />

        {petPickerOpen && (
          <PetPicker
            anchor={activePet.buttons.pet}
            activeId={activePet.id}
            onSelect={(id) => {
              setPetId(id);
              setPetPickerOpen(false);
            }}
            onDismiss={dismissPetPicker}
          />
        )}
      </Scene>

      <SessionBar
        durationMs={timer.durationMs}
        onSelect={timer.setDurationMs}
        onReset={timer.reset}
      />
    </main>
  );
}
