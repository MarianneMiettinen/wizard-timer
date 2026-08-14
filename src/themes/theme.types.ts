/**
 * The contract every theme fills in.
 *
 * This file is the *shape* of a theme, never the values of one. Adding a field
 * here is a code change that touches every theme; changing a value in a
 * theme.config.ts is not. Keep that asymmetry — it is the thing that makes a
 * new app a single-file edit.
 *
 * This theme layer is built around a single piece of full-scene artwork with
 * the UI painted into it. Everything the app draws on top is positioned in
 * **percentages of that artwork**, never in pixels, so the overlays stay
 * locked to the picture at every window size. Swapping in different art means
 * re-measuring those percentages here — and nothing else.
 */

/**
 * Every colour the UI can paint with. Any CSS colour string works
 * (`#rrggbb`, `#rrggbbaa`, `rgb()`, `oklch()`, …).
 *
 * Contrast is a theme's responsibility: `text` on `surface`, and `onAccent` on
 * `accent`, must each clear 4.5:1 to stay at WCAG 2.1 AA.
 */
export interface ThemeColors {
  /** Page colour around the artwork. Match the art's own edge so it blends. */
  background: string;
  surface: string;
  surfaceBorder: string;
  text: string;
  /** Secondary text. Must still clear 4.5:1 on `surface`. */
  textMuted: string;
  accent: string;
  /** Text and icons drawn on top of `accent`. */
  onAccent: string;
  /** Keyboard focus ring. Pick something that stands out against everything else. */
  focusRing: string;
  /** The note's parchment, and the ink written on it. Must clear 4.5:1. */
  parchment: string;
  parchmentEdge: string;
  parchmentInk: string;
  /** Wax the note is sealed with once the reader says they've saved it. */
  parchmentSeal: string;
  /**
   * Paints over the part of the printed candle that has already burned away.
   * Must match the artwork's wall behind the candle, or the erased strip shows
   * as a patch. Sample it from the art rather than guessing.
   */
  sceneMask: string;
}

/** Full CSS font stacks. Keep a system fallback last so nothing waits on a download. */
export interface ThemeFonts {
  display: string;
  body: string;
}

/**
 * The gold frame painted around the edge of the artwork. The app draws a glow
 * on top of it that takes the candle's current colour, so these numbers have to
 * line up with the painted frame.
 */
export interface ThemeFrame {
  topPercent: number;
  rightPercent: number;
  bottomPercent: number;
  leftPercent: number;
  /** Corner radius, as a percentage of artwork width. */
  radiusPercent: number;
  /** How far the glow spreads, as a percentage of artwork width. */
  glowSpreadPercent: number;
}

/**
 * The candle gauge.
 *
 * The candle is painted into the artwork already, complete with its colour
 * ramp. The app does not draw a candle — it *erases* the part that has burned
 * away and draws a fresh flame at the cut.
 *
 * Every session starts at `fullTopPercent` and ends at `zeroTopPercent`,
 * whatever its length, so the fall always looks the same.
 */
export interface ThemeCandleGauge {
  /**
   * Column to erase, as % of artwork width. Wider than the wax itself so it
   * also covers the flame's glow and the drips down the sides.
   */
  leftPercent: number;
  rightPercent: number;
  /**
   * The wax column itself — narrower than the erase column. The molten lip and
   * the flame sit on *this*, or they hang in mid-air off the sides of the
   * candle.
   */
  bodyLeftPercent: number;
  bodyRightPercent: number;
  /** Y of the candle's tip at the start of any session. */
  fullTopPercent: number;
  /** Y the flame reaches at zero. Below this is the base the art keeps. */
  zeroTopPercent: number;
  /** Everything painted above this is erased. Must clear the printed flame. */
  maskTopPercent: number;
  /** Drawn flame height, as % of artwork height. */
  flameHeightPercent: number;
  /**
   * The printed candle's colour ramp, top (most time left) → bottom (least),
   * as `#rrggbb`. Sampled from the artwork so the drawn flame and the frame
   * glow match the paint underneath them. Evenly spaced along the candle.
   */
  gradient: string[];
  /** The scale printed beside the candle, which the app redraws to match. */
  ticks: ThemeCandleTicks;
}

/**
 * The artwork has "90 / 60 / 30 MIN" painted beside the candle, which is only
 * true for a 90-minute session. The app erases that strip and redraws the
 * labels from the session actually running, so the scale never lies.
 *
 * Set `fractions: []` to erase the printed scale and draw nothing in its place.
 */
export interface ThemeCandleTicks {
  /** Strip of artwork to erase, as % — must cover the painted labels. */
  leftPercent: number;
  rightPercent: number;
  maskTopPercent: number;
  maskBottomPercent: number;
  /** Points of the session to mark, as fractions remaining. */
  fractions: number[];
}

/** A round button painted into the artwork, which the app makes real. */
export interface ThemeSceneButton {
  /** Centre, as % of artwork width / height. */
  xPercent: number;
  yPercent: number;
  /** Radius, as % of artwork **width** (so it scales with the picture). */
  radiusPercent: number;
}

/**
 * A pet is a whole alternate render of the scene, not a sprite — the artwork
 * differs everywhere, so switching pets swaps the background image.
 *
 * The chooser thumbnail is a zoomed crop of that same image, which means
 * adding a pet costs no extra download and the thumbnail can never disagree
 * with what you get.
 */
/**
 * A pet cut out of a source picture and dropped into the scene, for pets that
 * have no scene render of their own.
 *
 * There is no alpha channel and no cut-out file. The source art sits on a
 * near-black background, so the sprite is composited with `lighten`: each
 * channel takes the brighter of sprite and scene, which drops a black backdrop
 * completely and keeps soft edges — fur and sparkles feather out instead of
 * ending on the hard rectangle a crop would otherwise show.
 *
 * That only works over a *dark* destination, which is why a pet using an
 * overlay almost always needs `erase` as well: the painted pet underneath must
 * be blacked out first, or its bright parts (eyes, sparkles) survive the
 * lighten and both animals show at once.
 */
export interface ThemePetOverlay {
  /** Source picture to cut from. */
  src: string;
  /** The crop, as % of the *source* image. */
  cropLeftPercent: number;
  cropTopPercent: number;
  cropWidthPercent: number;
  cropHeightPercent: number;
  /**
   * Width ÷ height of the crop **in pixels**, which the percentages alone
   * cannot give (they are relative to a source whose own shape CSS never sees).
   * Sets the sprite's height from its width so it is never stretched.
   */
  cropAspect: number;
  /** Where it lands, as % of the *scene*. Height follows the crop's aspect. */
  leftPercent: number;
  topPercent: number;
  widthPercent: number;
  /** Fine brightness trim, so a pet doesn't glow brighter than the painting. */
  opacity?: number;
  /** Pool of shadow where the animal meets the desk. Omit for none. */
  shadow?: ThemePetShadow;
  /**
   * Pool of light the pet sits in, in its own colour — the cat's purple, the
   * toad's cyan. Without it a composited pet reads as pasted on: it is the only
   * thing in the room with no reason to be lit, and its edges meet the backdrop
   * at a line. `scale` is a multiple of the sprite's width.
   */
  aura?: { colour: string; scale: number };
}

/** The dark pool that makes a composited pet look like it is resting on wood. */
export interface ThemePetShadow {
  /** Width as a multiple of the sprite's width. Wider than 1 spreads outward. */
  widthScale: number;
  /** Height as a fraction of the sprite's height. Keep it flat. */
  heightScale: number;
  /** How far up from the sprite's base to sit, as a fraction of its height. */
  liftFraction: number;
  opacity: number;
}

export interface ThemePet {
  id: string;
  label: string;
  /** Full scene artwork showing this pet — or acting as its backdrop. */
  scene: string;
  /** Cut-out pet composited onto `scene`. Omit for pets painted into the art. */
  overlay?: ThemePetOverlay;
  /**
   * Blacked out before the overlay is drawn — normally the pet already painted
   * into `scene`, which would otherwise sit there alongside the new one.
   */
  erase?: ThemeEraseRect[];
  /**
   * Where the painted UI sits **in this render**.
   *
   * Each pet is a separately generated picture, so the frame and buttons land
   * in slightly different places — up to about 1.3% apart, which is plainly
   * visible as a painted ring peeking out from behind its overlay. Measure
   * these per render rather than sharing one set and hoping.
   */
  frame: ThemeFrame;
  buttons: ThemeSceneButtons;
  /** Played when this pet is chosen. */
  sound: ThemeSoundClip | null;
  /**
   * CSS `background-position` for the thumbnail crop, as %.
   *
   * These are **not** "where the pet is in the picture". With a zoomed
   * background, position is a ratio between the overflow and the container, so
   * the value that centres an image point p at zoom z is
   * `(p - 1/(2z)) * z/(z-1)`. And because `background-size` is set as a width
   * percentage, the vertical zoom on non-square art is `z * height/width`, so
   * the two axes need different maths. Getting this wrong shows a crop of
   * empty wall, which is easy to miss and easy to fix — just look at it.
   */
  focusXPercent: number;
  focusYPercent: number;
  /** Horizontal zoom of the thumbnail crop. 1 = whole scene. */
  focusZoom: number;
}

/** A rectangle of artwork the app paints over permanently, in % of the scene. */
export interface ThemeEraseRect {
  leftPercent: number;
  topPercent: number;
  widthPercent: number;
  heightPercent: number;
}

export interface ThemeSceneButtons {
  pet: ThemeSceneButton;
  start: ThemeSceneButton;
  music: ThemeSceneButton;
  /** The ✕ painted in the corner, which pops the timer out and back. */
  hide: ThemeSceneButton;
}

/**
 * The spell that plays at the wand while a session runs.
 *
 * Keep `widthPercent` small. This has to be noticeable at the edge of vision
 * and then ignorable — it sits next to something you are trying to concentrate
 * beside, so it earns its place by being brief and contained, not by being big.
 */
export interface ThemeMagic {
  /** Centre of the effect, as % of the artwork — normally the wand tip. */
  xPercent: number;
  yPercent: number;
  widthPercent: number;
  /** Any CSS colour. Drives both the forks and the glow. */
  colour: string;
}

export interface ThemeScene {
  /** Natural size of the artwork. Only the ratio matters; it locks the overlays. */
  aspectWidth: number;
  aspectHeight: number;
  /**
   * Static UI painted into the artwork that the app replaces with live
   * equivalents — a fixed pointer, a stale label. Erased on every frame, not
   * just while the timer runs.
   */
  erase: ThemeEraseRect[];
  /** Shared across renders: how the gauge behaves, not where it sits. */
  candle: ThemeCandleGauge;
  /** Centre of the numeric readout, as % of the artwork. */
  timerXPercent: number;
  timerYPercent: number;
  /** Where the spell effect plays. Omit and no effect is drawn. */
  magic?: ThemeMagic;
}

/**
 * One sound effect.
 *
 * `gain` is a multiplier, not a volume slider — **values above 1 are expected**.
 * Source clips vary enormously in level, and matching them by ear at the theme
 * layer is the only place it can be done without touching a component. Check a
 * clip's peak before choosing: gain × peak above 1 clips and sounds harsh.
 */
export interface ThemeSoundClip {
  src: string;
  gain: number;
  /**
   * Stop after this many seconds, with a short fade. For clips that are longer
   * than the moment they mark — an ambience loop used as a one-shot cue.
   * Omit to play the whole file.
   */
  maxSeconds?: number;
}

/**
 * Sounds tied to app events. Any of them may be `null`, which means silence —
 * no app should require a sound file to work.
 *
 * `click` fires on *every* button in addition to whatever that button's own
 * sound is, so keep it short and quiet or it will wear out fast.
 */
export interface ThemeSounds {
  click: ThemeSoundClip | null;
  start: ThemeSoundClip | null;
  pause: ThemeSoundClip | null;
  reset: ThemeSoundClip | null;
  /** Played once when the session ends. */
  complete: ThemeSoundClip | null;
  /** Unrolling the note. */
  scroll: ThemeSoundClip | null;
}

/**
 * A background music option, offered under the MUSIC button.
 *
 * `tracks` play in order and then start again from the top — which is how
 * "combining" several short pieces works here. They are not merged into one
 * file; they are a playlist, so any of them can be reordered or dropped in this
 * config without touching audio.
 *
 * Unlike every other asset, music tracks are **URLs into `public/`, not
 * imports**. Bundling them would make the app download tens of megabytes before
 * it could start; served as plain files they stream on demand, so nothing is
 * fetched until someone actually picks a mix.
 */
export interface ThemeMusicMix {
  id: string;
  label: string;
  tracks: string[];
  /** 0–1. Music sits under the sound effects, so this is normally well below 1. */
  gain: number;
}

export interface ThemeSession {
  /** Buttons offered as session lengths, in minutes. */
  presetMinutes: number[];
  /** Pre-selected on a genuine first visit. Should be one of `presetMinutes`. */
  defaultMinutes: number;
  /**
   * Ceiling for the typed hours/minutes entry, in minutes. Anything longer is
   * clamped to this rather than rejected.
   */
  maxMinutes: number;
}

/**
 * Every word the UI can show. Nothing outside this object may contain
 * user-facing text — that is what makes a theme translatable and re-skinnable
 * without opening a component.
 */
export interface ThemeCopy {
  title: string;
  /** Accessible description of the artwork, for people who can't see it. */
  sceneAlt: string;
  durationLegend: string;
  minuteSuffix: string;
  /** Unit printed under each candle tick, e.g. "MIN". */
  tickSuffix: string;
  /** Accessible name for the click-to-edit readout. */
  editDurationLabel: string;
  /** Hint shown under the readout when it can be edited. */
  editDurationHint: string;
  /** Labels printed under the round buttons. */
  petButton: string;
  startButton: string;
  pauseButton: string;
  musicButton: string;
  /**
   * Spoken names for the start/pause button. Each must still contain its
   * visible label as a word — WCAG 2.5.3 (Label in Name), so that saying
   * "click start" works for voice-control users.
   */
  startAction: string;
  pauseAction: string;
  /** Word printed under the corner ✕. */
  hideButton: string;
  /** Spoken names for the ✕ in each of its two states. */
  hideAction: string;
  unhideAction: string;
  /** Shown in the tab once the timer has been popped out into its own window. */
  poppedOutHeading: string;
  poppedOutBody: string;
  poppedOutReturn: string;
  /**
   * Follows the countdown in the browser-tab title, e.g. "12:04 · Focus".
   * Kept short — a tab strip gives you very few characters.
   */
  tabTitleSuffix: string;
  /** The rolled-up note that explains how to keep the timer to hand. */
  scrollButton: string;
  scrollHeading: string;
  scrollBookmark: string;
  scrollPin: string;
  scrollWhy: string;
  /** Confirms the reader has saved it, and seals the note shut. */
  scrollSeal: string;
  /** Nudge under the scroll the first time it appears in the middle. */
  scrollOpenHint: string;
  /** Accessible name for the rolled-up scroll once it lives in the corner. */
  scrollCornerLabel: string;
  scrollClose: string;
  /** Heading of the pet chooser popover. */
  petPickerLabel: string;
  /** Heading of the music chooser, and its "no music" option. */
  musicPickerLabel: string;
  musicOff: string;
  reset: string;
  finishedHeading: string;
  finishedBody: string;
  announceRunning: string;
  announcePaused: string;
  announceReset: string;
  announceFinished: string;
}

export interface Theme {
  /** Stable, lowercase, hyphenated. Matches the folder name. */
  readonly id: string;
  /** Human-readable, for menus and docs. */
  readonly name: string;
  readonly colors: ThemeColors;
  readonly fonts: ThemeFonts;
  readonly scene: ThemeScene;
  readonly pets: readonly ThemePet[];
  readonly sounds: ThemeSounds;
  readonly music: readonly ThemeMusicMix[];
  readonly session: ThemeSession;
  readonly copy: ThemeCopy;
}
