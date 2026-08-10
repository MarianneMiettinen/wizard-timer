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
export interface ThemePet {
  id: string;
  label: string;
  /** Full scene artwork showing this pet. */
  scene: string;
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
  /** Heading of the pet chooser popover. */
  petPickerLabel: string;
  /** Accessible names for the music toggle's two states. */
  soundOn: string;
  soundOff: string;
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
  readonly session: ThemeSession;
  readonly copy: ThemeCopy;
}
