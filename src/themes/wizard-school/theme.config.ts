/**
 * Wizard School — the theme this app ships with.
 *
 * THIS IS THE ONLY FILE THAT DEFINES HOW THE APP LOOKS AND WHAT IT SAYS.
 * A whole new app is a copy of this folder, a new set of assets, and edits to
 * the values below.
 *
 * Every percentage in `scene` was measured off the artwork by sampling its
 * pixels, not estimated by eye. If you replace the art, re-measure — an overlay
 * that is 2% out is immediately visible as a misaligned button.
 *
 * Contrast, checked against WCAG 2.1 AA (4.5:1 for body text):
 *   text      #f2e6c8 on surface #17110a → 13.9:1
 *   textMuted #c2ab7e on surface #17110a →  8.0:1
 *   onAccent  #1a1206 on accent  #e3b45c →  9.4:1
 */

import type { Theme } from '../theme.types';

// Imported, not written as string paths, so the bundler fingerprints and
// includes them. A bare '/assets/x.png' string would silently 404 in the build.
import sceneCat from './assets/scene-cat.png';
import sceneOwl from './assets/scene-owl.png';
import completeSound from './assets/spell-complete.wav';
import clickSound from './assets/sounds/matthewvakaliuk73627-mouse-click.mp3';
import startSound from './assets/sounds/daviddumais-magical-spell-cast.mp3';
import pauseSound from './assets/sounds/freesound-clockwork-timer.mp3';
import resetSound from './assets/sounds/biww-fire-burst-flame-sound-effect.mp3';
import catSound from './assets/sounds/cat.mp3';
import owlSound from './assets/sounds/lazychillzone-owl-hooting.mp3';

export const wizardSchoolTheme: Theme = {
  id: 'wizard-school',
  name: 'Wizard School',

  colors: {
    // Matches the artwork's own outer edge, so the letterboxing around the
    // picture reads as part of the frame rather than as empty page.
    background: '#0a0704',
    surface: '#17110a',
    surfaceBorder: '#4a3a1e',
    text: '#f2e6c8',
    textMuted: '#c2ab7e',
    accent: '#e3b45c',
    onAccent: '#1a1206',
    focusRing: '#8fd3ff',
    // Sampled from the wall beside the printed candle, which reads [6,2,0] to
    // [16,8,1]. Near-black, which is why erasing the candle is invisible.
    sceneMask: '#050301',
  },

  fonts: {
    // System stacks only — nothing is downloaded, so there is no font flash and
    // no third-party request. The serif matches the painted lettering.
    display: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif',
    body: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  },

  scene: {
    aspectWidth: 1402,
    aspectHeight: 1122,

    // The painted green arrow beside the candle points at a fixed height, so
    // it starts lying the moment the candle burns past it. The molten lip the
    // app draws at the cut does that job properly.
    erase: [{ leftPercent: 22.9, topPercent: 28.8, widthPercent: 2.7, heightPercent: 4.2 }],

    candle: {
      // Widened well beyond the wax so the flame's halo and the drips are
      // erased too — anything left behind reads as a ghost of the old candle.
      leftPercent: 14.9,
      rightPercent: 25.9,
      // The wax column itself, measured at x 229→308.
      bodyLeftPercent: 16.3,
      bodyRightPercent: 22.0,
      // Painted candle runs y≈285 (full) down to y≈755 (burned out).
      fullTopPercent: 25.4,
      zeroTopPercent: 67.3,
      // Above the printed flame (which starts at y≈190), so erasing starts
      // clear of it.
      maskTopPercent: 15.5,
      flameHeightPercent: 7.2,
      // Sampled straight down the painted candle at x=265. Green at the top of
      // the candle through to deep red at the bottom.
      gradient: ['#a8cc2e', '#c9ce38', '#e3c233', '#dfa22a', '#da6b18', '#c93412'],
      // Covers the painted "90 / 60 / 30 MIN" labels at x≈164–218, y≈270–625.
      ticks: {
        leftPercent: 10.4,
        rightPercent: 14.3,
        maskTopPercent: 23.2,
        maskBottomPercent: 57,
        fractions: [0.75, 0.5, 0.25],
      },
    },

    // Below the wizard's hand, above the buttons, between candle and pet.
    timerXPercent: 50,
    timerYPercent: 69,
  },

  pets: [
    {
      id: 'cat',
      label: 'Cat',
      scene: sceneCat,
      // Not simply "where the cat is". CSS background-position with a zoomed
      // image is a ratio, not a centre point, and the vertical zoom differs
      // from the horizontal one on non-square art — see ThemePet.
      // Framed on the face, not the whole animal: this cat is black against a
      // black room, so anything wider reads as an empty square.
      focusXPercent: 82.4,
      focusYPercent: 54.9,
      focusZoom: 4.5,
      // Painted frame measured at x 74→1328, y 45→1076.
      frame: {
        topPercent: 4.01,
        rightPercent: 5.28,
        bottomPercent: 4.1,
        leftPercent: 5.28,
        radiusPercent: 1.9,
        glowSpreadPercent: 1.5,
      },
      buttons: {
        pet: { xPercent: 35.5, yPercent: 84.2, radiusPercent: 5.6 },
        start: { xPercent: 50.1, yPercent: 83.7, radiusPercent: 6.7 },
        music: { xPercent: 64.6, yPercent: 84.7, radiusPercent: 5.5 },
      },
      // Quiet source (peaks at 0.10), so it needs lifting well past 1 to sit
      // alongside the owl. Trimmed — 5.5s of meow outlasts the moment.
      sound: { src: catSound, gain: 3.5, maxSeconds: 3.5 },
    },
    {
      id: 'owl',
      label: 'Owl',
      scene: sceneOwl,
      focusXPercent: 84.7,
      focusYPercent: 57.3,
      focusZoom: 4.5,
      // This render sits noticeably differently — see ThemePet.frame.
      frame: {
        topPercent: 3.12,
        rightPercent: 3.85,
        bottomPercent: 2.94,
        leftPercent: 4.35,
        radiusPercent: 1.9,
        glowSpreadPercent: 1.5,
      },
      buttons: {
        pet: { xPercent: 36.16, yPercent: 84.36, radiusPercent: 6.35 },
        start: { xPercent: 50.71, yPercent: 83.69, radiusPercent: 7.28 },
        music: { xPercent: 65.94, yPercent: 84.36, radiusPercent: 6.03 },
      },
      // Much hotter source than the cat — turned down, not up.
      sound: { src: owlSound, gain: 0.32, maxSeconds: 3 },
    },
  ],

  /*
   * Gains are matched by measured loudness, not by taste — every clip was
   * decoded and its RMS and peak read off, then levelled to roughly RMS 0.05.
   * The raw files are nowhere near each other: the cat sits at RMS 0.014 and
   * peaks at 0.10, the spell cast at RMS 0.180. Playing them at the same
   * nominal volume would make the cat inaudible and the spell startling.
   */
  sounds: {
    // Fires on every button as well as whatever else that button plays, so it
    // is mixed well under everything and kept short.
    click: { src: clickSound, gain: 0.8 },
    start: { src: startSound, gain: 0.3 },
    // The source is 49 seconds of clockwork ambience. Cut to a couple of
    // seconds so it marks the pause instead of scoring it.
    pause: { src: pauseSound, gain: 1.8, maxSeconds: 2.4 },
    reset: { src: resetSound, gain: 0.5 },
    // Rising bell arpeggio with a sparkle tail. Deliberately soft-edged: it
    // fires when someone may have forgotten the timer was running, so it has to
    // read as "that's done", not as an alarm.
    complete: { src: completeSound, gain: 0.45 },
  },

  session: {
    // Chosen to line up with the painted 30/60/90 tick marks.
    presetMinutes: [15, 30, 60, 90],
    defaultMinutes: 30,
    maxMinutes: 12 * 60,
  },

  copy: {
    title: 'Wizard Focus Timer',
    sceneAlt:
      'A wizard at a candlelit desk, with a burning focus candle and a familiar beside them',
    durationLegend: 'How long?',
    minuteSuffix: 'min',
    tickSuffix: 'MIN',
    editDurationLabel: 'Session length — click to type a new one',
    editDurationHint: 'Click the time to change it',
    petButton: 'PET',
    startButton: 'START',
    pauseButton: 'PAUSE',
    musicButton: 'MUSIC',
    startAction: 'Start the candle burning',
    pauseAction: 'Pause the candle',
    petPickerLabel: 'Choose your familiar',
    soundOn: 'Sound on',
    soundOff: 'Sound off',
    reset: 'New candle',
    finishedHeading: 'The candle burned out.',
    finishedBody: 'That was the whole session. Stop here, or light another.',
    announceRunning: 'Timer running.',
    announcePaused: 'Timer paused.',
    announceReset: 'Timer reset.',
    announceFinished: 'Session complete.',
  },
};
