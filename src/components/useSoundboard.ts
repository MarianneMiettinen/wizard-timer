/**
 * Plays the theme's sound effects.
 *
 * Uses Web Audio rather than `<audio>` elements for two reasons that came
 * straight out of the actual clips:
 *
 *  - **Gain above 1.** Source files are wildly uneven — the cat peaks at 0.10
 *    while the owl peaks at 0.66. An `<audio>` element's `volume` caps at 1, so
 *    it can only ever turn things *down*, leaving the quiet clip inaudible.
 *  - **Precise cut-off.** The clockwork clip is 49 seconds of ambience. Playing
 *    it whole on a pause would tick for the best part of a minute, so it needs
 *    stopping early with a fade rather than a hard chop.
 *
 * Every failure path ends in silence rather than an error. A missing file, a
 * refused AudioContext or a browser that blocks playback must all behave the
 * same way: the timer still works, it just doesn't make a noise.
 */

import { useCallback, useEffect, useRef } from 'react';
import type { ThemeSoundClip } from '../themes/theme.types';

/** Length of the fade used when a clip is cut short. */
const FADE_SECONDS = 0.18;

export type SoundClips = Record<string, ThemeSoundClip | null>;

export function useSoundboard(clips: SoundClips, enabled: boolean): (key: string) => void {
  const contextRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Map<string, AudioBuffer>>(new Map());
  /** The source currently playing for each clip, so a repeat can retrigger it. */
  const playingRef = useRef<Map<string, AudioBufferSourceNode>>(new Map());

  // Read inside the play callback so toggling sound off never has to rebuild it.
  const enabledRef = useRef(enabled);
  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  // Decode everything up front. `decodeAudioData` works on a suspended context,
  // so this costs nothing in permissions — the context stays asleep until the
  // first real click resumes it.
  useEffect(() => {
    let cancelled = false;

    const context = new AudioContext();
    contextRef.current = context;
    const buffers = new Map<string, AudioBuffer>();
    buffersRef.current = buffers;

    async function load(key: string, clip: ThemeSoundClip) {
      try {
        const response = await fetch(clip.src);
        if (!response.ok) return;
        const decoded = await context.decodeAudioData(await response.arrayBuffer());
        if (!cancelled) buffers.set(key, decoded);
      } catch {
        // Unplayable clip. Everything else still works.
      }
    }

    for (const [key, clip] of Object.entries(clips)) {
      if (clip !== null) void load(key, clip);
    }

    return () => {
      cancelled = true;
      void context.close().catch(() => undefined);
      contextRef.current = null;
    };
  }, [clips]);

  return useCallback(
    (key: string) => {
      if (!enabledRef.current) return;

      const context = contextRef.current;
      const clip = clips[key];
      const buffer = buffersRef.current.get(key);
      if (!context || !clip || !buffer) return;

      // Browsers start the context suspended until a user gesture. Every sound
      // here follows a click, so this resolves on the first one.
      if (context.state === 'suspended') void context.resume().catch(() => undefined);

      try {
        /*
         * Retrigger: cut any still-playing copy of *this* clip before starting
         * a new one. Several of these clips run for seconds, so clicking a
         * button twice in a row would otherwise stack copies on top of each
         * other — they sum, clip, and turn to mush. Different clips still
         * overlap freely, which is what you want when a click sound lands on
         * top of a spell.
         */
        const previous = playingRef.current.get(key);
        if (previous) {
          try {
            previous.stop();
          } catch {
            // Already finished. Nothing to stop.
          }
        }

        const source = context.createBufferSource();
        source.buffer = buffer;

        const gain = context.createGain();
        gain.gain.value = clip.gain;

        source.connect(gain).connect(context.destination);

        // Never schedule into the past: on a context that has just resumed,
        // currentTime can be behind by the time this runs, and a stop() in the
        // past silences the clip before it is heard.
        const startAt = Math.max(context.currentTime, 0);
        const limit = clip.maxSeconds;

        if (typeof limit === 'number' && limit < buffer.duration) {
          const endAt = startAt + limit;
          // Hold, then fade — a hard stop on a sustained clip is an audible click.
          gain.gain.setValueAtTime(clip.gain, Math.max(startAt, endAt - FADE_SECONDS));
          gain.gain.linearRampToValueAtTime(0, endAt);
          source.start(startAt);
          source.stop(endAt + 0.02);
        } else {
          source.start(startAt);
        }

        playingRef.current.set(key, source);
        source.addEventListener('ended', () => {
          // Release the node so the graph doesn't grow for the whole session.
          gain.disconnect();
          if (playingRef.current.get(key) === source) playingRef.current.delete(key);
        });
      } catch {
        // Playback refused. Not worth surfacing.
      }
    },
    [clips],
  );
}
