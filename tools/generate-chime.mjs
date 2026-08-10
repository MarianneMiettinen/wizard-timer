/**
 * Generates the "spell completes" chime as a 16-bit mono WAV.
 *
 * Written rather than downloaded: no licence, no attribution, no third-party
 * request, and it can be regenerated or retuned at any time.
 *
 * Sound design brief: it fires when someone may have forgotten the timer was
 * running, so it must read as "that's done" and never as an alarm. Soft attack,
 * long decay, ascending — no sharp transient, nothing that startles.
 */

import { writeFileSync } from 'node:fs';

const SAMPLE_RATE = 22050; // Nyquist 11 kHz — plenty for bell partials, half the bytes
const DURATION_S = 2.8;
const TOTAL_SAMPLES = Math.floor(SAMPLE_RATE * DURATION_S);

// Deterministic pseudo-random, so regenerating gives a byte-identical file.
let seed = 0x5eed1e;
function random() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return seed / 0xffffffff;
}

/**
 * Inharmonic partials — the ratios that make a struck bell sound like metal
 * rather than an organ. A pure harmonic series here would sound like a beep.
 */
const PARTIALS = [
  { ratio: 1.0, amp: 1.0 },
  { ratio: 2.0, amp: 0.46 },
  { ratio: 2.76, amp: 0.26 },
  { ratio: 5.4, amp: 0.12 },
  { ratio: 8.93, amp: 0.05 },
];

// A major arpeggio, rising. Rising = resolved; falling would read as failure.
const NOTES = [
  { freq: 440.0, start: 0.0, gain: 0.85 }, // A4
  { freq: 554.37, start: 0.17, gain: 0.85 }, // C#5
  { freq: 659.25, start: 0.34, gain: 0.9 }, // E5
  { freq: 880.0, start: 0.53, gain: 1.0 }, // A5
];

const BASE_DECAY_S = 1.25;
const ATTACK_S = 0.008; // long enough to kill the click, short enough to feel struck

const buffer = new Float64Array(TOTAL_SAMPLES);

for (const note of NOTES) {
  const startSample = Math.floor(note.start * SAMPLE_RATE);

  for (const partial of PARTIALS) {
    // Higher partials die away faster, as they do on a real bell.
    const decay = BASE_DECAY_S / (1 + 0.55 * (partial.ratio - 1));
    const frequency = note.freq * partial.ratio;
    if (frequency >= SAMPLE_RATE / 2) continue; // would alias into a whistle

    const omega = 2 * Math.PI * frequency;
    // Slight detune per partial so the tone shimmers instead of sitting still.
    const phase = random() * Math.PI * 2;

    for (let i = startSample; i < TOTAL_SAMPLES; i++) {
      const t = (i - startSample) / SAMPLE_RATE;
      const attack = t < ATTACK_S ? t / ATTACK_S : 1;
      const envelope = attack * Math.exp(-t / decay);
      // Only bail once the tail has actually decayed. Testing this during the
      // attack ramp exits on the first sample, where the envelope is still 0 —
      // which silently produces a file full of zeros.
      if (t > ATTACK_S && envelope < 1e-5) break;
      buffer[i] += Math.sin(omega * t + phase) * partial.amp * note.gain * envelope;
    }
  }
}

/**
 * Sparkle layer: brief high tones scattered through the tail. This is the part
 * that reads as "magic" rather than "doorbell". Quiet on purpose — it should be
 * noticed, not heard.
 */
const SPARKLE_COUNT = 14;
for (let s = 0; s < SPARKLE_COUNT; s++) {
  const start = 0.25 + random() * 1.35;
  const frequency = 2200 + random() * 4200;
  if (frequency >= SAMPLE_RATE / 2) continue;

  const startSample = Math.floor(start * SAMPLE_RATE);
  const decay = 0.11 + random() * 0.13;
  const omega = 2 * Math.PI * frequency;
  const amp = 0.05 + random() * 0.045;

  for (let i = startSample; i < TOTAL_SAMPLES; i++) {
    const t = (i - startSample) / SAMPLE_RATE;
    const attack = t < 0.004 ? t / 0.004 : 1;
    const envelope = attack * Math.exp(-t / decay);
    if (t > 0.004 && envelope < 1e-5) break;
    buffer[i] += Math.sin(omega * t) * amp * envelope;
  }
}

// Fade the last stretch to true silence so the file can't end on a click.
const FADE_S = 0.3;
const fadeStart = TOTAL_SAMPLES - Math.floor(FADE_S * SAMPLE_RATE);
for (let i = fadeStart; i < TOTAL_SAMPLES; i++) {
  buffer[i] *= (TOTAL_SAMPLES - i) / (TOTAL_SAMPLES - fadeStart);
}

// Normalise to leave headroom — the theme sets playback volume separately.
let peak = 0;
for (const sample of buffer) peak = Math.max(peak, Math.abs(sample));
const scale = peak > 0 ? 0.72 / peak : 1;

const pcm = Buffer.alloc(TOTAL_SAMPLES * 2);
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const clamped = Math.max(-1, Math.min(1, buffer[i] * scale));
  pcm.writeInt16LE(Math.round(clamped * 32767), i * 2);
}

// ── RIFF/WAVE container ───────────────────────────────────────────────────
const header = Buffer.alloc(44);
header.write('RIFF', 0);
header.writeUInt32LE(36 + pcm.length, 4);
header.write('WAVE', 8);
header.write('fmt ', 12);
header.writeUInt32LE(16, 16); // PCM chunk size
header.writeUInt16LE(1, 20); // format: PCM
header.writeUInt16LE(1, 22); // channels: mono
header.writeUInt32LE(SAMPLE_RATE, 24);
header.writeUInt32LE(SAMPLE_RATE * 2, 28); // byte rate
header.writeUInt16LE(2, 32); // block align
header.writeUInt16LE(16, 34); // bits per sample
header.write('data', 36);
header.writeUInt32LE(pcm.length, 40);

const out = process.argv[2];
writeFileSync(out, Buffer.concat([header, pcm]));
console.log(`wrote ${out} — ${(header.length + pcm.length / 1024).toFixed(0)} KB, ${DURATION_S}s, ${SAMPLE_RATE} Hz mono`);
