# Wizard Focus Timer

A wizard-themed focus timer. Set a length, light the candle, come back when it
burns out. App #1 of a 30-app build challenge.

Built with React + TypeScript + Vite. The repo is structured so apps #2–30 can
reuse the timer engine and replace only the theme — see
[STARTER_TEMPLATE.md](./STARTER_TEMPLATE.md) for how that split works and how to
reuse it.

- **Local folder:** `C:\Users\omistaja\Documents\wizard-timer`
- **Live URL:** _(not deployed yet — see Setup below)_
- **Repo:** _(not connected yet — see Setup below)_

---

## Running it locally

Once, after cloning or on a fresh machine:

```bash
npm install
```

Then, every time you want to work on it:

```bash
npm run dev
```

That prints a `http://localhost:5173` address. Open it. Edits to any file appear
in the browser instantly without a reload — you do not need to stop and restart
anything.

Before pushing, it's worth checking the real build compiles:

```bash
npm run build
```

If that passes, Vercel's build will pass too. If it fails, Vercel's would have
failed as well — better to find out here.

---

## The loop you actually want

Once setup is done, updating the live site is three commands. Nothing else. No
uploading, no Vercel dashboard, no CLI.

```bash
git add -A
```

```bash
git commit -m "what you changed, in plain English"
```

```bash
git push
```

Vercel watches the repo. A push to `main` rebuilds and replaces the live site in
roughly a minute. That is the whole mechanism.

---

## Setup — one time only

You need a GitHub account and a Vercel account (free). Vercel is a website, not
a program — there is nothing to download.

### 1. Create the empty repo on GitHub

Go to <https://github.com/new>.

- **Repository name:** `wizard-timer`
- **Public or Private:** either works. Vercel's free tier deploys both.
- **Do not** tick "Add a README", "Add .gitignore", or "Choose a license". This
  repo already has those files, and ticking them creates a conflict you'd have
  to untangle.

Click **Create repository**.

### 2. Point this folder at that repo and push

Open File Explorer at `Documents\wizard-timer`, click the address bar, type
`powershell`, press Enter. Then, with your username swapped in:

```bash
git remote add origin https://github.com/YOUR-USERNAME/wizard-timer.git
```

```bash
git push -u origin main
```

The first push opens a browser window asking you to sign in to GitHub. That is
expected — it stores the credential in Windows so you're never asked again.

### 3. Connect Vercel

Go to <https://vercel.com/signup> and **sign up with GitHub**. Using GitHub as
the login is what wires the two accounts together — don't sign up with email, or
you'll have to link them manually afterwards.

Then:

1. **Add New… → Project**
2. Find `wizard-timer` in the list and click **Import**
3. Vercel detects Vite on its own and fills in Build Command `npm run build` and
   Output Directory `dist`. **Leave all of it alone.** If the Framework Preset
   box says anything other than Vite, set it to Vite.
4. Click **Deploy**

The first build takes a couple of minutes. You get a URL like
`wizard-timer-abc123.vercel.app` — live, on the real internet.

### 4. Confirm the loop works

Change one word in `src/themes/wizard-school/theme.config.ts` — the title, say —
then run the three commands from *The loop you actually want*. Watch the URL
update. Once you've seen that happen, setup is done and you never touch Vercel's
website again unless you want a custom domain.

---

## What's where

| Path | What it is |
|---|---|
| `src/core/` | The timer engine. Theme-agnostic — this is what gets reused. |
| `src/themes/wizard-school/` | Everything that makes it look and sound like this app. |
| `src/themes/theme.types.ts` | The shape every theme must fill in. |
| `src/components/` | UI. Reads values from the theme, never hardcodes them. |
| `src/styles/app.css` | Layout only. Zero colours — all via CSS custom properties. |
| `src/App.tsx` | Wires the engine to the active theme. Two lines pick the theme. |
| `STARTER_TEMPLATE.md` | How to turn this into app #2. |
| `.claude/launch.json` | Lets Claude Code start the dev server itself. |

---

## Things worth knowing before they bite you

- **Every push to `main` goes live.** There is no staging step and no
  confirmation. To try something risky, make a branch — Vercel gives every
  branch its own preview URL and leaves the real site alone.
- **Vercel keeps every previous deploy.** If a change breaks the site, open the
  Deployments tab, find the last good one, hit **Rollback**. Nothing is lost.
- **`node_modules` is not committed**, and shouldn't be. Anyone cloning the repo
  runs `npm install` to recreate it. Vercel does this automatically.
- **Never commit an API key.** If the app ever needs one, it goes in Vercel's
  Environment Variables screen, not in a file. `.gitignore` already blocks `.env`.
- **The timer state lives in the browser**, in `localStorage`, under the key
  `wizard-focus-timer:timer`. Nothing is sent anywhere. There is no account, no
  analytics, and no third-party request — the fonts are system fonts and the art
  is local SVG.
- **A custom domain is optional and separate.** The `.vercel.app` URL works
  forever and is free.
