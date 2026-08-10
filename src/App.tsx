/**
 * Wires /core to the active theme. This is the seam between the two halves of
 * the repo, and it is deliberately short — if this file starts growing logic,
 * that logic almost certainly belongs in /core (if it's about time) or in a
 * component (if it's about pixels).
 */

import { useCallback, useMemo, useState, type MouseEvent } from 'react';
import { PetPicker } from './components/PetPicker';
import { PictureInPicture, isPictureInPictureSupported } from './components/PictureInPicture';
import { ScrollNote } from './components/ScrollNote';
import { SessionBar } from './components/SessionBar';
import { Scene } from './components/Scene';
import { SceneButton } from './components/SceneButton';
import { Sparkles } from './components/Sparkles';
import { ThemeProvider, useTheme, useThemeStyle } from './components/ThemeProvider';
import { TimerReadout } from './components/TimerReadout';
import { describeGauge, gaugeCssVariables } from './components/gauge';
import { useFaviconWand } from './components/useFaviconWand';
import { useTabTitle } from './components/useTabTitle';
import { useSoundboard, type SoundClips } from './components/useSoundboard';
import {
  CatIcon,
  CloseIcon,
  MusicIcon,
  MutedMusicIcon,
  PauseIcon,
  PlayIcon,
} from './components/icons';
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

/** Width of the floating window; the height follows the artwork's aspect. */
const POPPED_OUT_WIDTH = 460;

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
  const { colors, copy, pets, scene, session, sounds } = useTheme();
  const themeStyle = useThemeStyle();

  const defaultPet = pets[0];
  const [petId, setPetId] = useState(defaultPet?.id ?? '');
  const [petPickerOpen, setPetPickerOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [poppedOut, setPoppedOut] = useState(false);

  const activePet = pets.find((pet) => pet.id === petId) ?? defaultPet;

  /**
   * Every clip the app can play, including one per pet so the *newly chosen*
   * pet can be heard at the moment of choosing — at that point `activePet` is
   * still the old one.
   */
  const clips = useMemo<SoundClips>(() => {
    const map: SoundClips = {
      click: sounds.click,
      scroll: sounds.scroll,
      start: sounds.start,
      pause: sounds.pause,
      reset: sounds.reset,
      complete: sounds.complete,
    };
    for (const pet of pets) map[`pet:${pet.id}`] = pet.sound;
    return map;
  }, [sounds, pets]);

  const play = useSoundboard(clips, soundOn);

  const playCompletionSound = useCallback(() => play('complete'), [play]);

  const timer = useTimer({
    storageKey: STORAGE_KEY,
    defaultDurationMs: session.defaultMinutes * MS_PER_MINUTE,
    onFinish: playCompletionSound,
  });

  const dismissPetPicker = useCallback(() => setPetPickerOpen(false), []);

  /**
   * The click sound, for every button, delegated from one place. Threading a
   * callback through each button would mean a new button silently ships without
   * one; bubbling cannot be forgotten.
   */
  const handleClickSound = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if ((event.target as HTMLElement).closest('button')) play('click');
    },
    [play],
  );

  const handleToggle = useCallback(() => {
    // Read before toggling: after it, the status is the opposite of the action.
    play(timer.isRunning ? 'pause' : 'start');
    timer.toggle();
  }, [play, timer]);

  const handleReset = useCallback(() => {
    play('reset');
    timer.reset();
  }, [play, timer]);

  const handlePipClose = useCallback(() => setPoppedOut(false), []);

  const pipSupported = isPictureInPictureSupported();

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

  // Also feeds the tab icon, so it is computed once here rather than inside
  // <Scene> where only the artwork could reach it.
  const gauge = describeGauge(scene.candle, 1 - timer.elapsedFraction);
  useFaviconWand(gauge.colour, colors.onAccent, colors.text);
  useTabTitle(`${timer.display} ${copy.tabTitleSuffix}`);

  if (!activePet) return null;

  const timerScene = (
    <Scene
      pet={activePet}
      gauge={gauge}
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
            <Sparkles />
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
          onClick={handleToggle}
          emphasis
        />

        <SceneButton
          position={activePet.buttons.music}
          label={copy.musicButton}
          accessibleLabel={soundOn ? copy.soundOn : copy.soundOff}
          icon={soundOn ? <MusicIcon /> : <MutedMusicIcon />}
          onClick={() => setSoundOn((on) => !on)}
          pressed={soundOn}
          // This button silences *everything*, not just the end chime. Without
          // an unmistakable off state it reads as "the sounds broke".
          dimmed={!soundOn}
        />

        {petPickerOpen && (
          <PetPicker
            anchor={activePet.buttons.pet}
            activeId={activePet.id}
            onSelect={(id) => {
              play(`pet:${id}`);
              setPetId(id);
              setPetPickerOpen(false);
            }}
            onDismiss={dismissPetPicker}
          />
        )}

      {/*
        Hidden entirely where Document Picture-in-Picture is unavailable
        (currently everything outside Chromium). A visible control that cannot
        work is worse than no control.
      */}
      {pipSupported && (
        <SceneButton
          position={activePet.buttons.hide}
          label={copy.hideButton}
          accessibleLabel={poppedOut ? copy.unhideAction : copy.hideAction}
          icon={<CloseIcon />}
          onClick={() => setPoppedOut((out) => !out)}
          pressed={poppedOut}
          compact
        />
      )}
    </Scene>
  );

  return (
    <main className="wt-main" style={gaugeCssVariables(gauge)} onClick={handleClickSound}>
      <h1 className="wt-visually-hidden">{copy.title}</h1>

      <PictureInPicture
        open={poppedOut}
        width={POPPED_OUT_WIDTH}
        height={Math.round(POPPED_OUT_WIDTH / (scene.aspectWidth / scene.aspectHeight))}
        onClose={handlePipClose}
        rootStyle={themeStyle}
      >
        {timerScene}
      </PictureInPicture>

      {poppedOut && (
        <div className="wt-poppedout">
          <p className="wt-poppedout__heading">{copy.poppedOutHeading}</p>
          <p className="wt-poppedout__body">{copy.poppedOutBody}</p>
          <button
            type="button"
            className="wt-chip"
            onClick={() => setPoppedOut(false)}
          >
            {copy.poppedOutReturn}
          </button>
        </div>
      )}

      <SessionBar
        durationMs={timer.durationMs}
        onSelect={timer.setDurationMs}
        onReset={handleReset}
        highlightReset={timer.isFinished}
      />

      <ScrollNote onOpen={() => play('scroll')} />
    </main>
  );
}
