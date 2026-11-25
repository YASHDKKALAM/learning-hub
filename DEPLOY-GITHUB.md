# Deploy `Learning` to GitHub Pages (learn as you go)

## Single entry URL

After deploy, your site loads from **`index.html`** in the `html/` folder (same content as `developer-hub.html`).

| Local | Live (example) |
|--------|----------------|
| `Learning/html/index.html` | `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/` |

---

## Part 1 — Create the GitHub repository (browser)

1. Go to [github.com/new](https://github.com/new).
2. **Repository name:** e.g. `learning-hub` or `interview-prep`.
3. **Public** (free GitHub Pages on public repos).
4. Do **not** add README, .gitignore, or license (you already have files locally).
5. Click **Create repository**.

GitHub will show commands for “push an existing repository from the command line” — you’ll use those in Part 2.

---

## Part 2 — Push from your PC (you run these)

Open PowerShell:

```powershell
cd C:\Users\ykm22\Desktop\Resume\Learning

# One-time: rebuild so html/index.html exists
node build.mjs

git init
git add .
git commit -m "Initial commit: static learning hub"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your values.

**What each step does**

| Command | Purpose |
|---------|---------|
| `git init` | Start a repo in `Learning` only (not whole Desktop). |
| `git add .` | Stage all tracked files (respects `.gitignore`). |
| `git commit` | Save a snapshot. |
| `git branch -M main` | Use `main` as default branch (GitHub standard). |
| `git remote add origin ...` | Link to GitHub. |
| `git push -u origin main` | Upload; `-u` remembers remote for next `git push`. |

Later, after edits:

```powershell
cd C:\Users\ykm22\Desktop\Resume\Learning
node build.mjs          # if you changed js/ or sql/
git add .
git commit -m "Describe your change"
git push
```

---

## Part 3 — Enable GitHub Pages (browser)

1. Repo → **Settings** → **Pages** (left sidebar).
2. Under **Build and deployment** → **Source:** choose **GitHub Actions** (not “Deploy from a branch”).
3. Save. No need to pick a folder when using Actions — the workflow uploads `html/`.

---

## Part 4 — Understand the workflow YAML (you can edit it)

File: **`.github/workflows/github-pages.yml`**

```yaml
on:
  push:
    branches: [main]
  workflow_dispatch:
```

- **`on: push: branches: [main]`** — run on every push to `main`.
- **`workflow_dispatch`** — manual “Run workflow” button in the Actions tab.

```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

GitHub needs these so the job can publish Pages (OIDC token).

```yaml
jobs:
  build:
    steps:
      - uses: actions/checkout@v4    # clone your repo
      - uses: actions/setup-node@v4   # Node for node build.mjs
      - run: node build.mjs           # regenerate html/
      - uses: actions/upload-pages-artifact@v3
        with:
          path: html                  # THIS folder becomes the live site root
```

- **`path: html`** — visitors see `html/index.html` as `https://.../` (site home).

```yaml
  deploy:
    needs: build
    uses: actions/deploy-pages@v4
```

Second job takes the artifact and publishes it.

**Experiments to learn**

1. Remove the `node build.mjs` step and only commit `html/` — CI just uploads what you pushed.
2. Change `branches: [main]` to a branch you use.
3. Push a broken workflow on purpose and read the red X under **Actions**.

---

## Part 5 — Verify deploy

1. Repo → **Actions** → workflow **Deploy Learning site** → latest run should be green.
2. **Settings → Pages** shows the live URL (may take 1–2 minutes).
3. Open the URL; you should see the Developer Learning Hub with SQL + QA tracks.

---

## Troubleshooting

| Issue | Fix |
|--------|-----|
| 404 on Pages | Source must be **GitHub Actions**; workflow must succeed; artifact path must be `html` with `index.html` inside. |
| Old content | Push again or **Actions → Run workflow**. |
| Private repo | Pages on private repos need a paid plan; use **public** for free hosting. |
| sql.js needs internet | Practice tab loads sql.js from CDN — works on Pages if user has internet. |

---

## Repo layout reminder

Only the **`html/`** folder is published. Everything else (`js/`, `sql/`, `content/`) is source for builds and stays in the repo but is not served as URLs (unless you add them to `html/` by mistake).