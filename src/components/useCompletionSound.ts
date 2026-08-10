/**
 * Plays the theme's completion sound, if it has one.
 *
 * Every failure path here ends in silence rather than an error. A theme with
 * `sounds.complete: null`, a missing file, a muted device, or a browser that
 * blocks playback must all behave the same way: the timer still works, it just
 * doesn't make a noise. Sound is decoration on top of a visual state that has
 * already changed.
 */

import { useCallback, useEffect, useRef } from 'react';

export function useCompletionSound(src: string | null, volume: number): () => void {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (src === null) {
      audioRef.current = null;
      return;
    }

    const audio = new Audio(src);
    audio.volume = Math.min(1, Math.max(0, volume));
    // Fetch ahead of time — the sound is useless if it arrives after the moment.
    audio.preload = 'auto';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [src, volume]);

  return useCallback(() => {
    const audio = audioRef.current;
    if (audio === null) return;

    // Rewind so a second session can play it again mid-playback.
    audio.currentTime = 0;
    // Browsers reject play() when the tab has had no user interaction. That is
    // an expected outcome, not an error worth surfacing.
    void audio.play().catch(() => undefined);
  }, []);
}
