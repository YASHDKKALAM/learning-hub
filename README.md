# Learning workspace

Scalable layout for study hubs (SQL, QA, future JS/Python).

## Open in browser

**Single entry (use this):** `html/index.html` (same as `developer-hub.html`)  
**Standalone testing export:** `html/Testing-Study-Hub.html`

**GitHub Pages:** see **[DEPLOY-GITHUB.md](./DEPLOY-GITHUB.md)** — create repo, push, enable Actions.

## Folder layout

```
Learning/
  html/                 # Built pages only (open these)
  sql/                  # Schema & future .sql assets
  js/
    paths.mjs           # Single source of truth for paths
    data/               # Track data (exercises, diagrams, etc.)
    hub/                # Unified developer hub (manifest + builder)
    testing/            # Standalone testing hub builder
  content/              # Source notes (markdown when you add them)
    sql/
    testing/
  build.mjs             # Rebuild everything
  build-developer-hub.mjs
  build-testing-hub.mjs
```

## Rebuild

```powershell
cd C:\Users\ykm22\Desktop\Resume\Learning
node build.mjs
```

## Add a track later

1. Put sources under `content/<track>/`
2. Add `js/data/<track>-*.js` if you need interactive data
3. Register the track in `js/hub/manifest.js`
4. Add `js/hub/<track>-track-bundle.js` and wire it in `js/hub/build.mjs`
5. `node build.mjs`