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

/**
 * Where `public/` is served from. Respects vite's `base`, so the music keeps
 * resolving if the app is ever hosted under a sub-path.
 */
const BASE = import.meta.env.BASE_URL;

// Imported, not written as string paths, so the bundler fingerprints and
// includes them. A bare '/assets/x.png' string would silently 404 in the build.
import sceneCat from './assets/scene-cat.png';
import sceneOwl from './assets/scene-owl.png';
import petsSheet from './assets/pets-sheet.png';
import puffArt from './assets/puff.png';
import completeSound from './assets/sounds/universfield-bell-ring-123742.mp3';
import clickSound from './assets/sounds/matthewvakaliuk73627-mouse-click.mp3';
import startSound from './assets/sounds/daviddumais-magical-spell-cast.mp3';
import pauseSound from './assets/sounds/freesound-clockwork-timer.mp3';
import resetSound from './assets/sounds/biww-fire-burst-flame-sound-effect.mp3';
import scrollSound from './assets/sounds/liecio-crumping-paper-scroll-parchment.mp3';
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
    // Aged paper. Measured: ink on parchment is 9.7:1.
    parchment: '#e8d7ac',
    parchmentEdge: '#b99e6f',
    parchmentInk: '#3a2a12',
    parchmentSeal: '#8e2733',
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

    // Centred on the burst already painted at the wand tip, so the effect looks
    // like it comes out of the wand rather than hovering near it.
    magic: {
      xPercent: 36.5,
      yPercent: 27,
      widthPercent: 26,
      colour: '#b07cf0',
    },
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
        hide: { xPercent: 91.4, yPercent: 8.9, radiusPercent: 2.4 },
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
        hide: { xPercent: 92.1, yPercent: 8.4, radiusPercent: 2.3 },
      },
      // Much hotter source than the cat — turned down, not up.
      sound: { src: owlSound, gain: 0.32, maxSeconds: 3 },
    },

    /*
     * The toad and the puff have no scene render of their own, so they borrow
     * the cat's picture as a backdrop, black the cat out of it, and get
     * composited in from their source art. See ThemePetOverlay for why this
     * needs no cut-out files.
     *
     * They therefore reuse the cat render's frame and button geometry, because
     * that is literally the picture underneath.
     */
    {
      id: 'toad',
      label: 'Toad',
      scene: sceneCat,
      // Cut from the three-pet sheet: the toad on the right, plus its cyan
      // swirl. Starts right of the owl so no second animal creeps into frame.
      overlay: {
        src: petsSheet,
        cropLeftPercent: 64.78,
        cropTopPercent: 45.9,
        cropWidthPercent: 31.25,
        cropHeightPercent: 47.66,
        cropAspect: 0.984,
        leftPercent: 68.5,
        topPercent: 55,
        widthPercent: 17,
        // Cyan, matching the swirl the toad already sits in on the sheet.
        aura: { colour: 'rgba(95, 216, 208, 0.3)', scale: 2.3 },
        shadow: { widthScale: 0.78, heightScale: 0.17, liftFraction: 0.07, opacity: 0.75 },
      },
      // Covers the painted cat and its purple aura (x≈940–1230, y≈480–870),
      // with room to spare for the mask's soft edge.
      // Tightened around the painted cat itself (x≈960–1210, y≈470–870) rather
      // than the whole corner. The wide version softened half the desk, which
      // read as fog rather than as the same room the cat and owl sit in.
      erase: [
        { leftPercent: 67.2, topPercent: 40.2, widthPercent: 20.6, heightPercent: 38.4 },
      ],
      focusXPercent: 92.8,
      focusYPercent: 90.1,
      focusZoom: 3.2,
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
        hide: { xPercent: 91.4, yPercent: 8.9, radiusPercent: 2.4 },
      },
      // No toad sound in the set yet.
      sound: null,
    },
    {
      id: 'puff',
      label: 'Puff',
      scene: sceneCat,
      // Its source art is already a lone subject on pure black, which is the
      // ideal case for the lighten blend — the backdrop vanishes completely.
      overlay: {
        src: puffArt,
        cropLeftPercent: 18.83,
        cropTopPercent: 16.93,
        cropWidthPercent: 64.91,
        cropHeightPercent: 66.13,
        cropAspect: 1.226,
        leftPercent: 67,
        topPercent: 56.3,
        widthPercent: 20,
        // Trimmed: the source is brighter than anything else in this candlelit
        // room, and full strength makes it look pasted on.
        opacity: 0.88,
        aura: { colour: 'rgba(242, 168, 189, 0.28)', scale: 2.1 },
        shadow: { widthScale: 0.7, heightScale: 0.15, liftFraction: 0.06, opacity: 0.7 },
      },
      // Tightened around the painted cat itself (x≈960–1210, y≈470–870) rather
      // than the whole corner. The wide version softened half the desk, which
      // read as fog rather than as the same room the cat and owl sit in.
      erase: [
        { leftPercent: 67.2, topPercent: 40.2, widthPercent: 20.6, heightPercent: 38.4 },
      ],
      focusXPercent: 52.4,
      focusYPercent: 50,
      focusZoom: 2.2,
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
        hide: { xPercent: 91.4, yPercent: 8.9, radiusPercent: 2.4 },
      },
      sound: null,
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
    complete: { src: completeSound, gain: 0.5 },
    scroll: { src: scrollSound, gain: 0.55, maxSeconds: 1.8 },
  },

  /*
   * Music mixes. Each is a playlist, not a merged file — the dramatic pieces
   * are short and alike, so they are chained end to end and looped, which is
   * what makes them work as background rather than as three separate stings.
   *
   * Paths point into `public/`, so these stream on demand instead of being
   * bundled. See ThemeMusicMix. Gains sit well under the sound effects: this is
   * something to work through, not to listen to.
   */
  music: [
    {
      id: 'dramatic',
      label: 'Dramatic',
      tracks: [
        `${BASE}music/prettyjohn1-dramatic.mp3`,
        `${BASE}music/artmylife-powerful-dramatic2.mp3`,
        `${BASE}music/sonican-dramatic-classical-orchestral-cinematic3.mp3`,
      ],
      gain: 0.32,
    },
    {
      id: 'inspiring',
      label: 'Inspiring',
      tracks: [
        `${BASE}music/luis_humanoide-cinematic-violin-uplifting-music4.mp3`,
        `${BASE}music/nengjemping-energetic-flow-ambient-soft-piano-lo-fi5.mp3`,
        `${BASE}music/nakaradaalexander-through-the-white-steppes7.mp3`,
      ],
      gain: 0.36,
    },
    {
      id: 'mix',
      label: 'Mix',
      // Interleaved rather than grouped, so it doesn't open with every
      // dramatic piece in a row before reaching anything calm.
      tracks: [
        `${BASE}music/luis_humanoide-cinematic-violin-uplifting-music4.mp3`,
        `${BASE}music/prettyjohn1-dramatic.mp3`,
        `${BASE}music/nengjemping-deep-focus-mode-cinematic-ambient-binaural-beats6.mp3`,
        `${BASE}music/artmylife-powerful-dramatic2.mp3`,
        `${BASE}music/nengjemping-energetic-flow-ambient-soft-piano-lo-fi5.mp3`,
        `${BASE}music/sonican-dramatic-classical-orchestral-cinematic3.mp3`,
        `${BASE}music/nakaradaalexander-through-the-white-steppes7.mp3`,
      ],
      gain: 0.34,
    },
  ],

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
    hideButton: 'hide',
    hideAction: 'Hide this page and keep the candle floating on top',
    unhideAction: 'Hide the floating candle and bring it back here',
    poppedOutHeading: 'The candle is floating on top.',
    poppedOutBody: 'It keeps burning while you work elsewhere.',
    poppedOutReturn: 'Bring it back here',
    tabTitleSuffix: '· Wizard Focus',
    scrollButton: 'Keep it close',
    scrollHeading: 'Keep this candle within reach',
    scrollBookmark: 'Bookmark it — press Ctrl + D, or ⌘ + D on a Mac.',
    scrollPin:
      'Pin it to your taskbar — open the browser menu (⋮) and look for "Install page as app", or "Create shortcut" in older versions.',
    scrollWhy: 'A timer you can find in one click is a timer you actually use.',
    scrollSeal: 'I saved the Wizard Timer',
    scrollOpenHint: 'Open the scroll',
    scrollCornerLabel: 'How to keep the Wizard Timer close',
    scrollClose: 'Roll the scroll back up',
    petPickerLabel: 'Choose your familiar',
    musicPickerLabel: 'Choose your music',
    musicOff: 'Off',
    reset: 'New candle',
    finishedHeading: 'Magic focus finished!',
    finishedBody: "When you're ready, light another.",
    announceRunning: 'Timer running.',
    announcePaused: 'Timer paused.',
    announceReset: 'Timer reset.',
    announceFinished: 'Session complete.',
  },
};
