/**
 * The note explaining how to keep the timer to hand — bookmark it, or pin it to
 * the taskbar.
 *
 * It normally sits rolled up beside the ✕ in the corner, out of the way. The
 * first time a session actually runs to the end it appears large in the middle
 * instead, because that is the one moment we know two things at once: the timer
 * worked for this person, and they are about to leave. A prompt at the start
 * would interrupt; a prompt at the end lands on someone who just got value.
 *
 * Four phases, and the motion between them is the point:
 *   corner  → small, rolled, parked by the ✕
 *   featured→ large, rolled, centre stage, sparkling
 *   open    → unrolled parchment with the two numbered steps
 *   sealing → a wax seal stamps down, then it rolls back to the corner
 *
 * It only ever demands attention once. Sealing it is remembered, so it never
 * takes the middle of the screen again.
 */

import { useEffect, useState, type CSSProperties } from 'react';
import { Sparkles } from './Sparkles';
import { useTheme } from './ThemeProvider';

/** How long the wax seal is admired before the scroll rolls away. */
const SEAL_MS = 1100;

type ScrollPhase = 'corner' | 'featured' | 'open' | 'sealing';

function RolledScroll() {
  return (
    <svg viewBox="0 0 48 32" aria-hidden="true" focusable="false">
      {/* Body of the roll */}
      <rect x="4" y="8" width="40" height="16" rx="8" fill="var(--wt-color-parchment)" />
      {/* Shading so it reads as a cylinder rather than a pill */}
      <rect x="4" y="16" width="40" height="8" rx="4" fill="var(--wt-color-parchment-edge)" opacity="0.55" />
      {/* End caps */}
      <ellipse cx="6" cy="16" rx="3.6" ry="8" fill="var(--wt-color-parchment-edge)" />
      <ellipse cx="42" cy="16" rx="3.6" ry="8" fill="var(--wt-color-parchment-edge)" />
      <ellipse cx="42" cy="16" rx="1.8" ry="4.6" fill="var(--wt-color-parchment)" />
    </svg>
  );
}

function WaxSeal() {
  return (
    <svg className="wt-scrollnote__seal" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
      <circle cx="24" cy="24" r="20" fill="var(--wt-color-parchment-seal)" />
      <circle cx="24" cy="24" r="15.5" fill="none" stroke="var(--wt-color-parchment)" strokeWidth="1.4" opacity="0.5" />
      {/* Pressed star, the same mark the wizard's hat carries */}
      <path
        fill="var(--wt-color-parchment)"
        opacity="0.85"
        d="M24 11 l3.3 7.6 l8.2 0.8 l-6.2 5.5 l1.8 8.1 l-7.1 -4.3 l-7.1 4.3 l1.8 -8.1 l-6.2 -5.5 l8.2 -0.8 Z"
      />
    </svg>
  );
}

/** Points at the thing to do. */
function StepArrow() {
  return (
    <svg className="wt-scrollnote__arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path
        d="M3 12 h15 M13 6 l6 6 l-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface ScrollNoteProps {
  /** Where the rolled scroll parks: just left of the ✕, in scene percentages. */
  cornerXPercent: number;
  cornerYPercent: number;
  cornerWidthPercent: number;
  /** True when it should take the middle of the screen — first finished session. */
  celebrate: boolean;
  /** Unrolling and rolling up. */
  onOpenSound(): void;
  onSealSound(): void;
  /** Remembered, so the middle-of-screen moment happens only once. */
  onSealed(): void;
}

export function ScrollNote({
  cornerXPercent,
  cornerYPercent,
  cornerWidthPercent,
  celebrate,
  onOpenSound,
  onSealSound,
  onSealed,
}: ScrollNoteProps) {
  const { copy, colors } = useTheme();
  const [phase, setPhase] = useState<ScrollPhase>('corner');

  useEffect(() => {
    if (celebrate) setPhase('featured');
  }, [celebrate]);

  // Escape closes it, like any other overlay here.
  useEffect(() => {
    if (phase !== 'open') return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setPhase('corner');
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'sealing') return;
    const id = window.setTimeout(() => setPhase('corner'), SEAL_MS);
    return () => window.clearTimeout(id);
  }, [phase]);

  function open() {
    onOpenSound();
    setPhase('open');
  }

  function seal() {
    onSealSound();
    onSealed();
    setPhase('sealing');
  }

  const isRolled = phase === 'corner' || phase === 'featured';

  return (
    <div
      className={`wt-scrollnote wt-scrollnote--${phase}`}
      /*
       * The anchor is published as custom properties, never as `left`/`top`
       * directly. Inline positions would outrank the stylesheet, so the phone
       * layout could not stand this on its end at the right edge — and gating
       * the inline styles on a JS media query instead put the breakpoint in two
       * places, where the JS copy silently disagreed with the CSS.
       *
       * As variables, the stylesheet decides everything and stays the single
       * source of truth for layout.
       */
      style={
        {
          '--wt-scroll-left': `${cornerXPercent}%`,
          '--wt-scroll-top': `${cornerYPercent}%`,
          '--wt-scroll-width': `${cornerWidthPercent}%`,
        } as CSSProperties
      }
    >
      {isRolled ? (
        <button
          type="button"
          className="wt-scrollnote__roll"
          onClick={open}
          aria-label={copy.scrollCornerLabel}
        >
          <RolledScroll />
          {phase === 'featured' && (
            <>
              <span className="wt-scrollnote__hint">{copy.scrollOpenHint}</span>
              <Sparkles colour={colors.accent} />
            </>
          )}
        </button>
      ) : (
        <div className="wt-scrollnote__sheet" role="dialog" aria-label={copy.scrollHeading}>
          {/* Openable and closable from the same corner — Escape alone is not
              a control anyone can see. */}
          <button
            type="button"
            className="wt-scrollnote__close"
            onClick={() => setPhase('corner')}
            aria-label={copy.scrollClose}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <path
                d="M7 7 L17 17 M17 7 L7 17"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <p className="wt-scrollnote__heading">{copy.scrollHeading}</p>

          {/* Numbered, not bulleted: these are steps to follow in order. */}
          <ol className="wt-scrollnote__steps">
            <li className="wt-scrollnote__step">
              <StepArrow />
              <span>{copy.scrollBookmark}</span>
            </li>
            <li className="wt-scrollnote__step">
              <StepArrow />
              <span>{copy.scrollPin}</span>
            </li>
          </ol>

          <p className="wt-scrollnote__why">{copy.scrollWhy}</p>

          {phase === 'sealing' ? (
            <WaxSeal />
          ) : (
            <button type="button" className="wt-scrollnote__seal-button" onClick={seal}>
              {copy.scrollSeal}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
