/**
 * Keeps the countdown in the browser-tab title.
 *
 * Between this and the colour-tracking tab icon, the tab strip alone tells you
 * how long is left without switching to the tab at all — which is the whole
 * point of a focus timer you are meant to walk away from.
 */

import { useEffect } from 'react';

export function useTabTitle(title: string): void {
  useEffect(() => {
    document.title = title;
  }, [title]);
}
