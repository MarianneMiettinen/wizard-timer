/**
 * Reads a media query and re-renders when it changes.
 *
 * Used for the handful of decisions that cannot be made in CSS — chiefly
 * whether to offer the pop-out control at all. Checking `window.innerWidth`
 * once at render would get the first answer right and then be wrong forever
 * after a rotation or a resized window.
 */

import { useEffect, useState } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const list = window.matchMedia(query);
    const onChange = () => setMatches(list.matches);

    // Sync once in case it changed between first render and this effect.
    onChange();
    list.addEventListener('change', onChange);
    return () => list.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** The breakpoint the mobile layout switches at. Kept beside the CSS value. */
export const WIDE_VIEWPORT = '(min-width: 641px)';
