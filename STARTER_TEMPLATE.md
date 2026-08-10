# Starter template

This repo is two things stacked on top of each other:

- a **countdown timer** that knows nothing about wizards
- a **wizard theme** that knows nothing about counting down

App #1 of the 30-app build challenge ships the wizard. Apps #2–30 are meant to
reuse the first half and replace the second. This document is the contract that
keeps that possible — if you find yourself fighting it, the answer is usually
that a value needs to move into a theme, not that the split needs bending.

---

## 1. What's theme-agnostic vs theme-specific

### `/src/core` — theme-agnostic. Copy this folder to a new app untouched.

| File | Owns |
|---|---|
| `timer.ts` | Countdown state and every transition on it: start, pause, toggle, reset, set duration, and the one transition time itself causes. Pure functions over plain data. No React, no browser APIs. |
| `persistence.ts` | Saving and restoring timer state via `localStorage`, with validation and a schema version. |
| `useTimer.ts` | The React binding. Owns the clock, the save/restore round trip, and the one-shot "just finished" callback. |

What `/core` hands the UI is deliberately dull: a status, some numbers, and
some functions.

```ts
const timer = useTimer({ storageKey, defaultDurationMs, onFinish });
// → status, isRunning, isFinished, durationMs, remainingMs,
//   display ("24:07"), elapsedFraction (0→1),
//   start(), pause(), toggle(), reset(), setDurationMs()
```

`elapsedFraction` is the important one. It's a plain 0→1 number, and it's how a
theme drives *any* progress visual — a candle burning down, a potion draining, a
moon crossing the sky. `/core` has no idea which.

### `/src/themes/<name>` — theme-specific. This is what you replace.

| File | Owns |
|---|---|
| `theme.config.ts` | Every colour, font, asset path, sound, size, session preset and word the app uses. |
| `assets/` | The images and audio for that theme, and nothing shared with other themes. |

`/src/themes/theme.types.ts` sits alongside them and is the *shape* a theme must
fill in — shared machinery, not a theme itself.

### `/src/components` — the join

Presentational only. Components read values from the theme via `useTheme()` and
receive numbers from `/core` as props. They contain layout, structure and
accessibility behaviour — never a colour, never a sentence.

### How this theme paints: overlay, don't rebuild

Wizard School is one piece of full-scene artwork with the UI painted into it.
Rather than rebuilding that UI in HTML, the app sits on top of the picture:

- **Everything is positioned in percentages of the artwork**, never in pixels.
  The scene is one aspect-ratio-locked box with `container-type: inline-size`,
  so overlays use `cqw` units and stay glued to the painting at any size.
- **The candle is erased, not drawn.** The painted candle already has its colour
  ramp; the app covers the burned-away part with a near-black panel and draws a
  fresh flame at the cut. This only works because the wall behind the candle is
  almost black (sampled at `[6,2,0]`). Brighter art needs real layered assets.
- **Painted UI that would go stale gets erased too** — the fixed level arrow,
  the "90 / 60 / 30 MIN" labels — and is redrawn from live values.
- **Measure the geometry, don't eyeball it.** Every percentage in `scene` and in
  each pet's `frame` / `buttons` came from sampling the PNG's pixels in a
  canvas. An overlay 1% out is plainly visible as a painted ring peeking out
  from behind its replacement.
- **Each pet is a whole separate render**, so its frame and buttons land in
  different places. That geometry lives on the pet, not on the theme.

### `/src/App.tsx` — the wiring

Picks the active theme, picks the storage key, connects one to the other. It is
short on purpose.

---

## 2. Reusing this for a new app

Say the new one is a *Deep Sea Timer*.

**1. Copy the repo.** Then, inside it:

```bash
git remote set-url origin https://github.com/YOUR-USERNAME/deep-sea-timer.git
```

Otherwise your first push overwrites the wizard.

**2. Rename the app** in `package.json` (`name`) and `index.html` (`<title>`).
Also update the absolute path in `.claude/launch.json` — it points at the
wizard-timer folder, so a copy will otherwise start the *old* app's dev server.

**3. Create the theme folder.**

```
src/themes/deep-sea/
  theme.config.ts
  assets/
```

Copy `src/themes/wizard-school/theme.config.ts` into it as a starting point —
it's easier to overwrite values than to remember which fields exist.

**4. Fill in `theme.config.ts`.** Change the `id`, drop your art into `assets/`,
import it at the top, and work down the object. TypeScript will tell you if you
miss a field; that's the point of `Theme` being a type rather than a loose
object.

**5. Point `App.tsx` at it** — two lines, and they're marked with a comment box:

```ts
import { deepSeaTheme } from './themes/deep-sea/theme.config';
const activeTheme = deepSeaTheme;
```

**6. Change `STORAGE_KEY`** in `App.tsx` to `'deep-sea-timer'`. Two apps sharing
a key on the same domain will overwrite each other's saved timer.

**7. Delete `src/themes/wizard-school/`** once the new theme runs. Leaving it
costs nothing at runtime — it's tree-shaken out — but it rots.

That's the whole job. **You should not need to open `/core` or `/components` at
all.** If you do, see the next section.

### When a theme genuinely needs something the schema lacks

Wanting a value the `Theme` type doesn't have is normal — it means the schema
was written against one theme and is meeting its second. The fix is always the
same three steps, in this order:

1. Add the field to the right interface in `src/themes/theme.types.ts`.
2. If CSS needs it, map it to a `--wt-*` custom property in
   `components/ThemeProvider.tsx`.
3. Set it in **every** `theme.config.ts`.

What you must not do is shortcut that by writing the value straight into a
component. One hardcoded value doesn't break anything on its own; it breaks the
next app, quietly, when that app needs a different one.

---

## 3. Files that must never contain theme-specific values

Explicitly, and with no exceptions:

- **`src/core/timer.ts`**
- **`src/core/persistence.ts`**
- **`src/core/useTimer.ts`**
- **`src/components/*.tsx`**
- **`src/styles/app.css`**

"Theme-specific" means: a colour, a font stack, a font size that only suits one
theme's art, an asset path or filename, a sound, or **any string a user will
read**.

Two things that look like exceptions and aren't:

- **Developer error messages** (`'useTheme() must be called inside a
  <ThemeProvider>.'`) are fine. They're read by you, in a console, never by a user.
- **Colours inside a theme's own `assets/*.svg`** are fine. Those files live
  inside the theme folder, so they *are* theme values.

### Checking it, rather than trusting it

Run these from the repo root before a commit that touched the UI. Both should
print nothing:

```bash
grep -rEn "#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(" src --exclude-dir=themes --exclude=colour.ts
```

`colour.ts` is excluded because it is the colour *utility* — it holds a black
fallback for an empty gradient and builds `rgba()` strings out of values the
theme supplied. It defines no colours of its own. Nothing else gets an
exemption.

```bash
grep -rEn "^\s*import .*(themes|theme\.config)" src/core
```

A hit in the first means a colour escaped into `/core`, `/components` or the
stylesheet. A hit in the second means `/core` learned about theming and is no
longer copyable.

---

## Why the timer works the way it does

One design note worth keeping if you rewrite anything, because it's the part
that's easy to get wrong and hard to notice:

**Remaining time is never decremented on an interval.** Browsers throttle
background tabs hard — a decrementing timer loses minutes while the user is in
another tab, and loses everything on reload. Instead, `TimerState` stores how
much was left at the last status change plus the absolute timestamp of that
change, and remaining time is a subtraction against `Date.now()`.

That single choice is why the timer survives a backgrounded tab, a sleeping
laptop, and a page reload — and why `persistence.ts` can resume a running timer
without any extra work.
