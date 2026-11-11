# Setup

Everything here is built locally. Three manual steps put it live on github.com/Muhammad-Akhtar.

## 1. Push to the profile repo

GitHub shows the README of the repo whose name matches the username. `Muhammad-Akhtar/Muhammad-Akhtar` already exists (public, default branch `main`, empty when this was built).

```bash
cd akhtar-profile
git init -b main
git add .
git commit -m "Profile README"
git remote add origin https://github.com/Muhammad-Akhtar/Muhammad-Akhtar.git
git push -u origin main
```

If the remote already has commits, run `git pull --rebase origin main` before you push. Don't force-push over them.

## 2. Turn on Actions

In the repo, go to **Settings → Actions → General**:

- Allow actions.
- Under **Workflow permissions**, choose **Read and write permissions**. The workflow commits the refreshed SVG back to `main`.

Then open **Actions → Refresh contribution snake → Run workflow** once. After that it runs daily at 05:30 UTC and rewrites `assets/contribution-snake.svg`, which the README already references. The committed SVG is a real snapshot (taken 11 Nov 2026), so the section works before the first run.

## 3. Show it on the profile

On github.com/Muhammad-Akhtar, check that the README appears above the pinned repositories. If it doesn't, confirm the repo is **public** and the file is named `README.md` at the root of `main`. Optionally, use **Customize your pins** to pin this repo.

## Editing

- Colours and fonts live in `tools/theme.mjs`. Copy is in `tools/generate.mjs`. The photo is `tools/src/akhtar.jpg`, embedded as base64.
- To rebuild: `node tools/generate.mjs && node tools/contributions.mjs --offline` (Node 18+, no dependencies).
- `node tools/preview.mjs <out-dir>` writes light and dark HTML previews of the README at GitHub's width.
- The reference profile also shows a `github-readme-stats` card. It's left out here because the public instance (`github-readme-stats.vercel.app`) returned `503 DEPLOYMENT_PAUSED` when this was built, and it would show as a broken image. If you want the card, deploy your own instance (https://github.com/anuraghazra/github-readme-stats) and add this under the commit-log section:

  ```html
  <p align="center">
    <img src="https://YOUR-INSTANCE.vercel.app/api?username=Muhammad-Akhtar&show_icons=true&hide_rank=true&hide_border=true&border_radius=16&bg_color=190B12&title_color=E5B5C7&text_color=B6A3AC&icon_color=C77B9B&custom_title=GitHub%20at%20a%20glance" width="400" alt="GitHub stats for Muhammad-Akhtar">
  </p>
  ```
