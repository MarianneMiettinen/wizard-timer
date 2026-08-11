/**
 * Background music: one mix at a time, played as a looping playlist.
 *
 * Uses an `<audio>` element rather than Web Audio, unlike the sound effects.
 * That is not a style choice — Web Audio has to decode a whole file into raw
 * PCM before it can play a note, and these tracks run to 27 MB compressed,
 * which would be hundreds of megabytes in memory. An `<audio>` element streams,
 * so playback starts almost immediately and only the part being listened to is
 * ever fetched.
 *
 * `preload="none"` for the same reason: nothing is downloaded until someone
 * actually picks a mix.
 */

import { useEffect, useRef, useState } from 'react';
import type { ThemeMusicMix } from '../themes/theme.types';

interface UseMusicOptions {
  /** The chosen mix, or null for silence. */
  mix: ThemeMusicMix | null;
  /** Whether music should be sounding right now. */
  playing: boolean;
}

export function useMusic({ mix, playing }: UseMusicOptions): void {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [trackIndex, setTrackIndex] = useState(0);

  // One element for the lifetime of the app; only its `src` changes.
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'none';
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      audioRef.current = null;
    };
  }, []);

  // Advance through the playlist, wrapping back to the start.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !mix) return;

    const onEnded = () => setTrackIndex((current) => (current + 1) % mix.tracks.length);
    audio.addEventListener('ended', onEnded);
    return () => audio.removeEventListener('ended', onEnded);
  }, [mix]);

  // A new mix always starts from its first track.
  useEffect(() => {
    setTrackIndex(0);
  }, [mix]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (!mix) {
      audio.pause();
      return;
    }

    audio.volume = Math.min(1, Math.max(0, mix.gain));

    const track = mix.tracks[trackIndex] ?? mix.tracks[0];
    if (!track) return;

    // Only reassign when it actually changes: setting `src` restarts playback,
    // so doing it on every render would stutter the track every second.
    const absolute = new URL(track, window.location.href).href;
    if (audio.src !== absolute) {
      audio.src = track;
    }

    if (playing) {
      // Rejected when the browser has had no user interaction. Choosing a mix
      // or starting the timer is always a click, so in practice this resolves.
      void audio.play().catch(() => undefined);
    } else {
      audio.pause();
    }
  }, [mix, playing, trackIndex]);
}
