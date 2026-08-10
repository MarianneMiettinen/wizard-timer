# Wizard Timer

A wizard-themed timer. Vanilla HTML/CSS/JS, no build step — `index.html` opens by
double-clicking it, and the same files are what gets served live.

- **Local folder:** `C:\Users\omistaja\Documents\wizard-timer`
- **Live URL:** _(not deployed yet — see Setup below)_
- **Repo:** _(not connected yet — see Setup below)_

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
roughly 20–40 seconds. That is the whole mechanism.

---

## Setup — one time only

You need a GitHub account (you have one) and a Vercel account (free). Vercel is a
website, not a program — there is nothing to download.

### 1. Create the empty repo on GitHub

Go to <https://github.com/new>.

- **Repository name:** `wizard-timer`
- **Public or Private:** either works. Vercel's free tier deploys both.
- **Do not** tick "Add a README", "Add .gitignore", or "Choose a license". This repo
  already has those files, and ticking them creates a conflict you'd have to untangle.

Click **Create repository**. GitHub then shows you a URL like
`https://github.com/YOUR-USERNAME/wizard-timer.git`.

### 2. Point this folder at that repo and push

Run these from `C:\Users\omistaja\Documents\wizard-timer`, swapping in your username:

```bash
git remote add origin https://github.com/YOUR-USERNAME/wizard-timer.git
```

```bash
git push -u origin main
```

The first push opens a browser window asking you to sign in to GitHub. That is
expected — it stores the credential in Windows so you're never asked again.

### 3. Connect Vercel

Go to <https://vercel.com/signup> and **sign up with GitHub**. Using GitHub as the
login is what wires the two accounts together — don't sign up with email, or you'll
have to link them manually afterwards.

Then:

1. **Add New… → Project**
2. Find `wizard-timer` in the list and click **Import**
3. Vercel will ask about a Framework Preset. Leave it on **Other**. Leave Build
   Command, Output Directory and Install Command **empty**. This is a plain static
   site — there is nothing to build.
4. Click **Deploy**

You get a URL like `wizard-timer-abc123.vercel.app`. That's live, on the real
internet, immediately.

### 4. Confirm the loop works

Change one word in `index.html`, then run the three commands from *The loop you
actually want*. Watch the URL update. Once you've seen that happen, the setup is
done and you never touch Vercel's website again unless you want a custom domain.

---

## What each file is for

| File | What it does |
|---|---|
| `index.html` | The page. Currently a placeholder. |
| `styles.css` | All styling. |
| `app.js` | All behaviour. |
| `vercel.json` | Tells Vercel to serve `/about` instead of `/about.html`. Optional but tidy. |
| `.gitignore` | Files git should never commit — secrets, OS junk, `.vercel`. |
| `tasks/lessons.md` | Running notes on corrections, per MM's global convention. |

---

## Things worth knowing before they bite you

- **Every push to `main` goes live.** There is no staging step and no confirmation.
  If you want to try something risky, make a branch — Vercel gives every branch its
  own separate preview URL and leaves the real site alone.
- **Vercel keeps every previous deploy.** If a change breaks the site, open the
  Deployments tab, find the last good one, and hit **Rollback**. Nothing is lost.
- **Never commit an API key.** If the app ever needs one, it goes in Vercel's
  Environment Variables screen, not in a file. `.gitignore` already blocks `.env`.
- **A custom domain is optional and separate.** The `.vercel.app` URL works forever
  and is free. Buying a domain is a later decision, not part of this setup.
