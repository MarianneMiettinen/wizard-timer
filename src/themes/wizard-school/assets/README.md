# wizard-school assets

Everything in this folder belongs to this theme alone. Another theme gets its
own folder and its own copies — nothing in here is shared.

| File | Used as |
|---|---|
| `background.svg` | `assets.background` — the full-bleed scene behind everything |
| `wizard.svg` | `assets.character` — the figure beside the candle |
| `candle-wax.svg` | `assets.candleWax` — clipped from the top as the session burns down |
| `candle-flame.svg` | `assets.candleFlame` — sits on top of whatever wax is left |
| `spell-complete.wav` | `sounds.complete` — plays once when the session ends |

These are hand-written SVGs, so they scale to any screen, weigh a few KB, and
have no licence attached. Replace them with your own art freely — PNG, JPG and
WebP all work the same way.

## Colours inside these files

The SVGs contain their own colours, and that is fine: they live inside the theme
folder, so they *are* theme values. The "no hardcoded colours" rule is about
`/core`, `/components` and the global stylesheet — see `/STARTER_TEMPLATE.md`.

If you want an asset to follow `theme.colors` instead of carrying its own, it
has to be inlined as JSX rather than loaded through `<img>`; `<img>` can't
inherit `currentColor`. Not worth it for these four.

## The completion sound

`spell-complete.wav` is a 2.8s rising bell arpeggio (A major) with a sparkle
tail — soft attack, long decay, no sharp transient. It fires when someone may
have forgotten the timer was running, so it has to read as "that's done" rather
than as an alarm.

It is **generated, not recorded**, by `/tools/generate-chime.mjs`. No licence, no
attribution, no third-party request, and it can be retuned rather than replaced:

```bash
node tools/generate-chime.mjs src/themes/wizard-school/assets/spell-complete.wav
```

The frequencies, arpeggio timing, decay length and sparkle density are all
constants at the top of that script. Output is deterministic — the same script
always produces a byte-identical file.

### Using a different sound instead

1. Put an audio file in this folder, e.g. `chime.mp3`. Short, quiet,
   non-startling.
2. In `../theme.config.ts`, change the import:
   ```ts
   import completeSound from './assets/chime.mp3';
   ```

Setting `sounds.complete: null` is also valid and means the session ends in
silence. Nothing else changes either way — the player treats a missing file, a
muted device and a browser that blocks autoplay all the same way: no sound, timer
unaffected.

## Swapping the candle art

`candle-wax.svg` is drawn to be **clipped from the top**: the wrapper shrinks its
height, revealing less of the column as time passes. Two things to preserve in a
replacement:

- Put drips and detail near the **bottom**, or they disappear in the first
  minute.
- Keep `preserveAspectRatio="none"`, so the column shortens instead of scaling
  down as a whole.
