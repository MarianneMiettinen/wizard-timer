/**
 * Wizard School — the theme this app ships with.
 *
 * THIS IS THE ONLY FILE THAT DEFINES HOW THE APP LOOKS AND WHAT IT SAYS.
 * A whole new app is a copy of this folder, a new set of assets, and edits to
 * the values below. If you find yourself needing to open a component to change
 * an appearance, that's a gap in ThemeColors/ThemeCopy — add the field to
 * /src/themes/theme.types.ts rather than hardcoding it in the component.
 *
 * Contrast, checked against WCAG 2.1 AA (4.5:1 for body text):
 *   text      #f2ecdc on surface #221b3f → 13.7:1
 *   textMuted #b8aed0 on surface #221b3f →  7.7:1
 *   onAccent  #1a1330 on accent  #f0b849 →  9.9:1
 * Re-check these if you touch the palette.
 */

import type { Theme } from '../theme.types';

// Imported, not written as string paths, so the bundler fingerprints and
// includes them. A bare '/assets/x.svg' string would silently 404 in the build.
import backgroundImage from './assets/background.svg';
import characterImage from './assets/wizard.svg';
import candleWaxImage from './assets/candle-wax.svg';
import candleFlameImage from './assets/candle-flame.svg';
import completeSound from './assets/spell-complete.wav';

export const wizardSchoolTheme: Theme = {
  id: 'wizard-school',
  name: 'Wizard School',

  colors: {
    background: '#14102a',
    backgroundScrim: 'rgba(12, 9, 28, 0.55)',
    surface: '#221b3f',
    surfaceBorder: '#3b3168',
    text: '#f2ecdc',
    textMuted: '#b8aed0',
    accent: '#f0b849',
    onAccent: '#1a1330',
    focusRing: '#8fd3ff',
    candleGlow: 'rgba(240, 184, 73, 0.32)',
  },

  fonts: {
    // System stacks only — nothing is downloaded, so there is no font flash and
    // no third-party request. Swap in a webfont per theme if a theme wants one.
    display: '"Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif',
    body: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  },

  assets: {
    background: backgroundImage,
    character: characterImage,
    candleWax: candleWaxImage,
    candleFlame: candleFlameImage,
  },

  sounds: {
    // Rising bell arpeggio with a sparkle tail. Deliberately soft-edged: it
    // fires when someone may have forgotten the timer was running, so it has to
    // read as "that's done", not as an alarm.
    complete: completeSound,
    completeVolume: 0.5,
  },

  candle: {
    enabled: true,
    heightPx: 250,
    widthPx: 74,
    // Leaves a visible stub at the end. A candle that vanishes reads as a bug.
    minHeightPercent: 12,
    flameHeightPx: 46,
  },

  stage: {
    characterHeightPx: 280,
  },

  session: {
    presetMinutes: [5, 15, 25, 45],
    defaultMinutes: 25,
    maxMinutes: 12 * 60,
  },

  copy: {
    title: 'Wizard Focus Timer',
    tagline: 'Light the candle. Come back when it burns out.',
    characterAlt: 'A wizard in a star-banded hat, holding a glowing staff',
    durationLegend: 'How long?',
    minuteSuffix: 'min',
    customLegend: 'Or set your own',
    hoursLabel: 'Hours',
    minutesLabel: 'Minutes',
    applyDuration: 'Set',
    start: 'Light the candle',
    resume: 'Light it again',
    pause: 'Pause',
    reset: 'New candle',
    finishedHeading: 'The candle burned out.',
    finishedBody: 'That was the whole session. Stop here, or light another.',
    announceRunning: 'Timer running.',
    announcePaused: 'Timer paused.',
    announceReset: 'Timer reset.',
    announceFinished: 'Session complete.',
  },
};
