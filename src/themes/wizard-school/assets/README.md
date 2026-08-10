# wizard-school assets

Everything in this folder belongs to this theme alone. Another theme gets its
own folder and its own copies — nothing in here is shared.

| File | Used as |
|---|---|
| `background.svg` | `assets.background` — the full-bleed scene behind everything |
| `wizard.svg` | `assets.character` — the figure beside the candle |
| `candle-wax.svg` | `assets.candleWax` — clipped from the top as the session burns down |
| `candle-flame.svg` | `assets.candleFlame` — sits on top of whatever wax is left |

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

## Adding the completion sound

The theme currently ships with `sounds.complete: null`, which means the session
ends silently. To add one:

1. Put an audio file in this folder, e.g. `chime.mp3`. Keep it short (1–2s),
   quiet, and non-startling — it fires when someone may have forgotten the timer
   was running.
2. In `../theme.config.ts`, add the import next to the image imports:
   ```ts
   import completeSound from './assets/chime.mp3';
   ```
3. Set `sounds.complete: completeSound`.

Nothing else changes. The player already handles a missing or blocked file by
staying silent — a browser that refuses to autoplay must never break the timer.

## Swapping the candle art

`candle-wax.svg` is drawn to be **clipped from the top**: the wrapper shrinks its
height, revealing less of the column as time passes. Two things to preserve in a
replacement:

- Put drips and detail near the **bottom**, or they disappear in the first
  minute.
- Keep `preserveAspectRatio="none"`, so the column shortens instead of scaling
  down as a whole.
