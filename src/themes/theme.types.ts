/**
 * The contract every theme fills in.
 *
 * This file is the *shape* of a theme, never the values of one. Adding a field
 * here is a code change that touches every theme; changing a value in a
 * theme.config.ts is not. Keep that asymmetry — it is the thing that makes a
 * new app a single-file edit.
 *
 * Rule of thumb for what belongs in here: if a second theme would plausibly
 * want a different value, it goes in the Theme. If every theme would want the
 * same value, it belongs in /core or /components instead.
 */

/**
 * Every colour the UI can paint with. Any CSS colour string works
 * (`#rrggbb`, `#rrggbbaa`, `rgb()`, `oklch()`, …).
 *
 * Contrast is a theme's responsibility: `text` on `surface`, and `onAccent` on
 * `accent`, must each clear 4.5:1 to stay at WCAG 2.1 AA.
 */
export interface ThemeColors {
  /** Page colour behind the background image. Also what shows while it loads. */
  background: string;
  /** Laid over the background image so text stays readable on top of it. */
  backgroundScrim: string;
  /** Panels and cards. */
  surface: string;
  surfaceBorder: string;
  text: string;
  /** Secondary text. Must still clear 4.5:1 on `surface`. */
  textMuted: string;
  /** Primary action. */
  accent: string;
  /** Text and icons drawn on top of `accent`. */
  onAccent: string;
  /** Keyboard focus ring. Pick something that stands out against everything else. */
  focusRing: string;
  /** Glow cast around the flame. Usually a translucent form of the flame colour. */
  candleGlow: string;
}

/** Full CSS font stacks. Keep a system fallback last so nothing waits on a download. */
export interface ThemeFonts {
  display: string;
  body: string;
}

/**
 * Import assets at the top of theme.config.ts and reference the imported value
 * here — don't write a bare string path. The import is what tells the bundler
 * to include and fingerprint the file.
 */
export interface ThemeAssets {
  background: string;
  character: string;
  candleWax: string;
  candleFlame: string;
}

export interface ThemeSounds {
  /**
   * Played once when the session ends. `null` means silent, which is a valid
   * theme — no app should require a sound file to work.
   */
  complete: string | null;
  /** 0–1. */
  completeVolume: number;
}

/** How the burn-down visual behaves. The maths lives in /core; this is its costume. */
export interface ThemeCandle {
  /** false hides the candle entirely, for a theme that marks time some other way. */
  enabled: boolean;
  /** Height of the candle at the start of a session. */
  heightPx: number;
  widthPx: number;
  /**
   * How much of the candle is left at the very end, as a percentage of
   * `heightPx`. Never 0 — a stub with a flame reads as "done", an empty space
   * reads as "broken".
   */
  minHeightPercent: number;
  flameHeightPx: number;
}

/** Sizing for the scene, so art with different proportions can be dropped in. */
export interface ThemeStage {
  /**
   * Height of the character image. Capped against viewport height in CSS, so
   * this is a maximum rather than a fixed size.
   */
  characterHeightPx: number;
}

export interface ThemeSession {
  /** Buttons offered as session lengths, in minutes. */
  presetMinutes: number[];
  /** Pre-selected on a genuine first visit. Should be one of `presetMinutes`. */
  defaultMinutes: number;
}

/**
 * Every word the UI can show. Nothing outside this object may contain
 * user-facing text — that is what makes a theme translatable and re-skinnable
 * without opening a component.
 *
 * Keep each string short. These are read by someone who is trying to start,
 * not to read.
 */
export interface ThemeCopy {
  title: string;
  tagline: string;
  /** Alt text for the character image. */
  characterAlt: string;
  /** Label above the session-length buttons. */
  durationLegend: string;
  /** Appended to each preset number, e.g. "min". */
  minuteSuffix: string;
  start: string;
  resume: string;
  pause: string;
  reset: string;
  /** Shown in place of the controls hint once the session ends. */
  finishedHeading: string;
  finishedBody: string;
  /** Announced to screen readers on each status change. Not shown on screen. */
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
  readonly assets: ThemeAssets;
  readonly sounds: ThemeSounds;
  readonly candle: ThemeCandle;
  readonly stage: ThemeStage;
  readonly session: ThemeSession;
  readonly copy: ThemeCopy;
}
