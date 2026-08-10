/**
 * A rolled-up note that unrolls when you click it, explaining how to keep the
 * timer to hand — bookmark it, or pin it to the taskbar.
 *
 * Closed by default and never nags. A timer you have to be reminded to keep is
 * not improved by a banner you have to dismiss; this sits there quietly until
 * someone is curious.
 *
 * The instructions stay slightly general on purpose. Browsers keep renaming and
 * moving the "install this page as an app" command, so naming both the current
 * and the older label is more useful than confidently sending someone to a menu
 * item that isn't there.
 */

import { useId, useState } from 'react';
import { useTheme } from './ThemeProvider';

function ScrollIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none">
      {/* Rolled top edge */}
      <rect
        x="3.2"
        y="3.4"
        width="17.6"
        height="4"
        rx="2"
        fill="currentColor"
        opacity="0.95"
      />
      {open ? (
        <>
          {/* Unrolled sheet with a couple of written lines */}
          <path
            d="M4.6 7.4 h14.8 v13.2 H4.6 Z"
            fill="currentColor"
            opacity="0.35"
          />
          <path
            d="M7.2 11.4 h9.6 M7.2 14.6 h9.6 M7.2 17.8 h6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </>
      ) : (
        /* Still rolled */
        <rect x="3.2" y="9" width="17.6" height="4" rx="2" fill="currentColor" opacity="0.55" />
      )}
    </svg>
  );
}

interface ScrollNoteProps {
  /** Fired when it unrolls, so the caller can play its sound. */
  onOpen(): void;
}

export function ScrollNote({ onOpen }: ScrollNoteProps) {
  const { copy } = useTheme();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  function toggle() {
    // The sound fires outside the state updater. React may call an updater more
    // than once to check it is pure, and a side effect in there plays twice.
    const next = !open;
    setOpen(next);
    if (next) onOpen();
  }

  return (
    <div className="wt-scroll">
      <button
        type="button"
        className="wt-scroll__handle"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="wt-scroll__icon">
          <ScrollIcon open={open} />
        </span>
        {copy.scrollButton}
      </button>

      {open && (
        <div className="wt-scroll__sheet" id={panelId} role="region">
          <p className="wt-scroll__heading">{copy.scrollHeading}</p>
          <ul className="wt-scroll__list">
            <li>{copy.scrollBookmark}</li>
            <li>{copy.scrollPin}</li>
          </ul>
          <p className="wt-scroll__why">{copy.scrollWhy}</p>
        </div>
      )}
    </div>
  );
}
