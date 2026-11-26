/**
 * Developer Learning Hub — static HTML builder
 * Run: node build-developer-hub.mjs  (from Learning/)
 */
import { writeFileSync } from "fs";
import { join } from "path";
import { paths } from "../paths.mjs";
import { hubManifest } from "./manifest.js";
import { prepareSqlTrack } from "./sql-track-bundle.js";
import { prepareTestingTrack } from "./testing-track-bundle.js";
import { prepareFastapiTrack } from "./fastapi-track-bundle.js";
import { learnLevelDiagrams } from "../data/sql-practice-exercises.js";

const sql = prepareSqlTrack();
const testing = prepareTestingTrack();
const fastapi = prepareFastapiTrack();
const manifestJson = JSON.stringify(hubManifest);

const testingNavHtml = testing.sections
  .map(
    (s) =>
      `<li><a href="#" class="testing-jump" data-section="${s.id}" style="--accent:${s.color}">` +
      `<span class="sec-icon">${s.icon}</span><span class="sec-label">${s.title}</span></a></li>`
  )
  .join("\n");

const fastapiNavHtml = fastapi.sections
  .map(
    (s) =>
      `<li><a href="#" class="fastapi-jump" data-hash="${s.hash}">` +
      `<span class="sec-label">${s.title.replace(/</g, "&lt;")}</span></a></li>`
  )
  .join("\n");

const sqlTrack = hubManifest.tracks.find((t) => t.id === "sql");
const moduleButtonsHtml = (sqlTrack?.modules ?? [])
  .map(
    (m, i) =>
      `<button type="button" class="module-btn${m.id === "learn" ? " active" : ""}" data-module="${m.id}">` +
      `<span class="mod-label">${m.label}</span>` +
      (m.short ? `<span class="mod-short">${m.short}</span>` : "") +
      `</button>`
  )
  .join("\n");

const sideModulesHtml = (sqlTrack?.modules ?? [])
  .map((m) => {
    if (m.id === "practice") {
      return `<div class="side-module" id="side-sql-${m.id}" data-module="${m.id}">
        <p class="side-hint">Pick an exercise</p>
        <div class="practice-filter">
          <label><input type="checkbox" id="filter-interview-only"> Interview only</label>
        </div>
        <div class="practice-nav" id="practice-nav"></div>
      </div>`;
    }
    return `<div class="side-module${m.id === "learn" ? " visible" : ""}" id="side-sql-${m.id}" data-module="${m.id}">
      <ul class="nav" id="toc-sql-${m.id}"></ul>
    </div>`;
  })
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${hubManifest.title}</title>
  <style>
    :root {
      --bg: #0d1117;
      --sidebar: #161b22;
      --surface: #fff;
      --text: #24292f;
      --border: #d0d7de;
      --accent: #238636;
      --link: #0969da;
      --sql-bg: #0d1117;
      --hub-bar: #010409;
    }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: "Segoe UI", system-ui, sans-serif; background: var(--bg); color: var(--text); }
    .hub-top {
      background: var(--hub-bar); color: #e6edf3; padding: 0.85rem 1.25rem;
      border-bottom: 1px solid #30363d; position: sticky; top: 0; z-index: 30;
    }
    .hub-top h1 { margin: 0; font-size: 1.05rem; font-weight: 700; }
    .hub-top p { margin: 0.2rem 0 0; font-size: 0.78rem; color: #8b949e; }
    .layout { display: grid; grid-template-columns: 280px 1fr; min-height: calc(100vh - 52px); }
    .sidebar {
      background: var(--sidebar); color: #e6edf3; padding: 0;
      position: sticky; top: 52px; height: calc(100vh - 52px);
      border-right: 1px solid #30363d;
      display: flex; flex-direction: column; min-height: 0;
    }
    .paths-block { padding: 0.85rem 0.75rem 0.5rem; flex-shrink: 0; }
    .sidebar-rail { height: 1px; background: #30363d; margin: 0 0.65rem 0.5rem; flex-shrink: 0; }
    .detail-block { flex: 1; overflow-y: auto; padding: 0 0.65rem 1.25rem; min-height: 0; }
    .sidebar-context {
      font-size: 0.82rem; font-weight: 700; color: #f0f6fc;
      margin: 0.15rem 0 0.55rem; padding: 0.2rem 0.35rem;
      border-left: 3px solid var(--track-accent, var(--accent));
    }
    .track-nav-panel { display: none; }
    .track-nav-panel.visible { display: block; }
    .sidebar-heading {
      margin: 0 0 0.5rem; font-size: 0.68rem; text-transform: uppercase;
      letter-spacing: 0.07em; color: #8b949e; font-weight: 600;
    }
    .track-list { display: flex; flex-direction: column; gap: 0.4rem; }
    .track-btn {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.48rem 0.6rem; border: 1px solid transparent; border-radius: 8px;
      background: transparent; color: #c9d1d9; cursor: pointer; text-align: left;
      width: 100%; font: inherit; transition: background 0.15s, color 0.15s;
    }
    .track-btn:hover { background: rgba(255,255,255,.06); color: #fff; }
    .track-btn.active {
      background: color-mix(in srgb, var(--track-accent, var(--accent)) 22%, #21262d);
      border-color: color-mix(in srgb, var(--track-accent, var(--accent)) 45%, #30363d);
      color: #fff;
    }
    .track-btn .track-icon { font-size: 1.05rem; line-height: 1; width: 1.35rem; text-align: center; }
    .track-btn .track-title { font-weight: 600; font-size: 0.82rem; flex: 1; line-height: 1.25; }
    .badge { font-size: 0.62rem; padding: 0.1rem 0.35rem; border-radius: 4px; background: #30363d; color: #c9d1d9; margin-left: 0.35rem; vertical-align: middle; }
    .badge.soon { background: #3d2e00; color: #e3b341; }
    .module-switch { display: flex; flex-direction: column; gap: 0.35rem; margin-bottom: 0.65rem; }
    .module-btn {
      padding: 0.48rem 0.6rem; border: 1px solid #30363d; background: #21262d; color: #e6edf3;
      border-radius: 8px; cursor: pointer; text-align: left; display: flex; justify-content: space-between; align-items: baseline; gap: 0.5rem;
    }
    .module-btn .mod-label { font-weight: 600; font-size: 0.8rem; }
    .module-btn .mod-short { font-size: 0.68rem; color: #8b949e; }
    .module-btn.active { background: var(--accent); border-color: var(--accent); color: #fff; }
    .module-btn.active .mod-short { color: rgba(255,255,255,.85); }
    .section-nav { max-height: none; }
    .section-nav a {
      display: flex; align-items: center; gap: 0.45rem;
      border-left: 3px solid transparent; padding: 0.42rem 0.5rem;
    }
    .section-nav a.active {
      border-left-color: var(--accent, #58a6ff);
      background: rgba(255,255,255,.08); color: #fff;
    }
    .sec-icon { font-size: 0.95rem; flex-shrink: 0; }
    .sec-label { font-size: 0.76rem; line-height: 1.3; }
    #track-testing .panel { scroll-margin-top: 4.5rem; }
    .testing-scroll .panel-source { display: none; }
    .side-module { display: none; }
    .side-module.visible { display: block; }
    .side-hint { padding: 0 0.25rem; font-size: 0.72rem; color: #8b949e; margin: 0 0 0.5rem; }
    .practice-filter { font-size: 0.74rem; margin-bottom: 0.45rem; color: #c9d1d9; }
    .practice-filter input { margin-right: 0.35rem; }
    .nav { list-style: none; margin: 0; padding: 0 0.25rem; font-size: 0.8rem; max-height: 42vh; overflow-y: auto; }
    .nav a { display: block; padding: 0.35rem 0.55rem; color: #c9d1d9; text-decoration: none; border-radius: 6px; }
    .nav a:hover, .nav a.active { background: rgba(255,255,255,.08); color: #fff; }
    .practice-nav button {
      display: block; width: 100%; text-align: left; margin-bottom: 0.25rem;
      padding: 0.4rem 0.55rem; font-size: 0.76rem; border: none; border-radius: 6px;
      background: transparent; color: #c9d1d9; cursor: pointer;
    }
    .practice-nav button:hover, .practice-nav button.active { background: rgba(35,134,54,.25); color: #fff; }
    .practice-nav button.interview-item { border-left: 3px solid #d29922; padding-left: 0.45rem; }
    .practice-nav button.hidden-by-filter { display: none; }
    .practice-nav .nav-section { font-size: 0.68rem; color: #8b949e; text-transform: uppercase; letter-spacing: 0.06em; padding: 0.6rem 0.55rem 0.25rem; margin-top: 0.35rem; }
    .practice-nav .nav-section.hidden-by-filter { display: none; }
    main.stage { padding: 1.35rem 2rem 3.5rem; max-width: 1120px; width: 100%; }
    main.stage.embed-mode { padding: 0; max-width: none; }
    .track-embed {
      width: 100%; border: 0; display: block;
      min-height: calc(100vh - 52px); background: #f4f7fb;
    }
    .track-panel { display: none; }
    .track-panel.visible { display: block; }
    .placeholder-card {
      background: var(--surface); border-radius: 14px; padding: 2rem 1.75rem;
      box-shadow: 0 8px 28px rgba(0,0,0,.22); max-width: 640px;
    }
    .placeholder-card h2 { margin: 0 0 0.6rem; }
    .placeholder-card p { margin: 0.5rem 0; line-height: 1.55; color: #57606a; }
    .placeholder-card code { font-size: 0.88em; }
    .module-panel { display: none; }
    .module-panel.visible { display: block; }
    .track-hero {
      background: linear-gradient(120deg, var(--track-accent, #1f6feb), #8957e5);
      color: #fff; padding: 1.15rem 1.4rem; border-radius: 12px; margin-bottom: 1.15rem;
    }
    .track-hero h2 { margin: 0 0 0.4rem; font-size: 1.28rem; }
    .track-hero p { margin: 0; font-size: 0.9rem; opacity: .96; line-height: 1.5; }
    .card { background: var(--surface); border-radius: 12px; box-shadow: 0 8px 24px rgba(0,0,0,.2); margin-bottom: 1.25rem; overflow: hidden; }
    .card-head { padding: 0.75rem 1.15rem; background: #f6f8fa; border-bottom: 2px solid var(--accent); font-weight: 700; }
    .card-body { padding: 1rem 1.15rem; }
    .schema-pre { margin: 0; background: var(--sql-bg); color: #e6edf3; padding: 0.85rem; border-radius: 8px; font-size: 0.75rem; overflow: auto; max-height: 200px; }
    .content { background: var(--surface); border-radius: 12px; padding: 1.2rem 1.4rem 1.75rem; box-shadow: 0 8px 24px rgba(0,0,0,.2); font-size: 0.9rem; line-height: 1.58; }
    .content h1 { font-size: 1.35rem; margin-top: 0; }
    .content h2 { font-size: 1.08rem; margin-top: 1.6rem; scroll-margin-top: 4.5rem; border-bottom: 1px solid var(--border); padding-bottom: 0.25rem; }
    .content pre { background: var(--sql-bg); color: #e6edf3; padding: 1rem; border-radius: 8px; overflow-x: auto; font-size: 0.78rem; }
    .content code { font-family: Consolas, monospace; font-size: 0.85em; background: #f6f8fa; padding: 0.1em 0.35em; border-radius: 4px; }
    .content pre code { background: none; padding: 0; color: inherit; }
    .content table { width: 100%; border-collapse: collapse; font-size: 0.84rem; margin: 0.75rem 0; }
    .content th, .content td { border: 1px solid var(--border); padding: 0.4rem 0.5rem; }
    .content th { background: #f6f8fa; }
    .content details { margin: 0.6rem 0; padding: 0.45rem 0.7rem; background: #f6f8fa; border-radius: 8px; }
    .gallery-row, .grid-gallery { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1rem; margin-bottom: 1.25rem; }
    .db-status { font-size: 0.8rem; padding: 0.5rem 0.75rem; border-radius: 8px; margin-bottom: 1rem; }
    .db-status.ok { background: #dafbe1; color: #116329; }
    .db-status.load { background: #fff8c5; color: #663c00; }
    .db-status.err { background: #ffebe9; color: #cf222e; }
    .practice-card { background: var(--surface); border-radius: 12px; padding: 1.2rem 1.35rem; box-shadow: 0 8px 24px rgba(0,0,0,.2); }
    .practice-card .level { font-size: 0.72rem; color: #57606a; text-transform: uppercase; letter-spacing: 0.05em; }
    .practice-card h3 { margin: 0.25rem 0 0.5rem; font-size: 1.15rem; }
    .concept-box { background: #f6f8fa; border-left: 4px solid #1f6feb; padding: 0.65rem 0.85rem; margin: 0.75rem 0; border-radius: 0 8px 8px 0; font-size: 0.88rem; }
    .inline-concept-viz { margin: 0.65rem 0 1rem; }
    .inline-concept-viz .viz { margin: 0; }
    .join-viz-stack { display: grid; gap: 0.75rem; }
    .viz { margin: 0.75rem 0; padding: 0.85rem; background: #f6f8fa; border-radius: 10px; border: 1px solid var(--border); }
    .viz-label { margin: 0.35rem 0 0; font-size: 0.8rem; color: #57606a; text-align: center; }
    .schema-viz { display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }
    .entity { background: #fff; border: 2px solid #1f6feb; border-radius: 10px; padding: 0.6rem 0.85rem; min-width: 140px; }
    .entity.orders { border-color: #8957e5; }
    .entity ul { margin: 0.4rem 0 0; padding-left: 1.1rem; font-size: 0.78rem; }
    .rel { font-size: 0.85rem; color: #57606a; }
    .pipeline { display: flex; flex-wrap: wrap; align-items: center; gap: 0.35rem; justify-content: center; }
    .pipeline .step { padding: 0.35rem 0.6rem; background: #fff; border: 1px solid var(--border); border-radius: 6px; font-size: 0.78rem; }
    .pipeline .step.active { border-color: #1f6feb; background: #ddf4ff; }
    .pipeline .step.result { border-color: var(--accent); background: #dafbe1; }
    .filter-viz .rows { display: flex; gap: 0.35rem; flex-wrap: wrap; justify-content: center; }
    .filter-viz .rows span { padding: 0.25rem 0.5rem; background: #eaeef2; border-radius: 4px; font-size: 0.75rem; }
    .filter-viz .rows span.keep { background: #dafbe1; border: 1px solid var(--accent); }
    .arrow-down { text-align: center; margin: 0.5rem 0; font-size: 0.8rem; color: #0969da; font-weight: 600; }
    .aggregate-viz, .distinct-viz { text-align: center; font-size: 0.88rem; }
    .many, .one { padding: 0.5rem; background: #fff; border-radius: 8px; display: inline-block; margin: 0.25rem; }
    .group-viz .buckets { display: flex; gap: 0.75rem; flex-wrap: wrap; justify-content: center; }
    .group-viz .bucket { background: #fff; border: 1px solid var(--border); padding: 0.6rem; border-radius: 8px; font-size: 0.8rem; text-align: center; }
    textarea.sql-input { width: 100%; min-height: 140px; font-family: Consolas, monospace; font-size: 0.82rem; padding: 0.75rem; border: 1px solid var(--border); border-radius: 8px; resize: vertical; }
    .btn-row { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 0.65rem 0; }
    .btn-row button { padding: 0.45rem 0.85rem; border-radius: 8px; border: 1px solid var(--border); background: #f6f8fa; cursor: pointer; font-weight: 600; font-size: 0.82rem; }
    .btn-row button.primary { background: var(--accent); color: #fff; border-color: var(--accent); }
    .btn-row button.danger { color: #cf222e; border-color: #ffa198; }
    .result-panel { margin-top: 0.75rem; }
    .result-panel h4 { margin: 0 0 0.4rem; font-size: 0.85rem; }
    .sql-results { overflow-x: auto; max-height: 280px; border: 1px solid var(--border); border-radius: 8px; }
    .sql-results table { width: 100%; border-collapse: collapse; font-size: 0.76rem; margin: 0; }
    .sql-results th { position: sticky; top: 0; background: #f6f8fa; }
    .sql-results td, .sql-results th { border: 1px solid var(--border); padding: 0.3rem 0.45rem; }
    .msg { font-size: 0.82rem; padding: 0.5rem 0.65rem; border-radius: 6px; margin-top: 0.5rem; }
    .msg.ok { background: #dafbe1; color: #116329; }
    .msg.err { background: #ffebe9; color: #670600; }
    .msg.info { background: #ddf4ff; color: #0550ae; }
    .compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
    .gallery-card { background: var(--surface); border-radius: 12px; padding: 1rem; box-shadow: 0 4px 16px rgba(0,0,0,.15); }
    .gallery-card h3 { margin: 0 0 0.5rem; font-size: 1rem; }
    .toolbar { position: fixed; bottom: 1rem; right: 1rem; z-index: 20; }
    .toolbar button { background: var(--accent); color: #fff; border: none; padding: 0.55rem 1rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
    @media (max-width: 900px) { .layout { grid-template-columns: 1fr; } .sidebar { position: relative; top: 0; height: auto; max-height: none; } main.stage { padding: 1rem 1rem 3rem; } .compare-grid { grid-template-columns: 1fr; } }
    ${testing.extraCss}
  </style>
</head>
<body>
  <header class="hub-top">
    <h1>${hubManifest.title}</h1>
    <p>${hubManifest.tagline} · Rebuild: <code>cd Learning &amp;&amp; node build.mjs</code></p>
  </header>
  <div class="layout">
    <aside class="sidebar" id="hub-sidebar">
      <div class="paths-block">
        <h2 class="sidebar-heading">Learning paths</h2>
        <div class="track-list" id="track-list"></div>
      </div>
      <div class="sidebar-rail" aria-hidden="true"></div>
      <div class="detail-block">
        <div class="sidebar-context" id="sidebar-context">SQL &amp; Databases</div>
        <div class="track-nav-panel visible" id="nav-panel-sql" data-track="sql">
          <h2 class="sidebar-heading">Topics</h2>
          <div class="module-switch">${moduleButtonsHtml}</div>
          ${sideModulesHtml}
        </div>
        <div class="track-nav-panel" id="nav-panel-testing" data-track="testing">
          <h2 class="sidebar-heading">Topics</h2>
          <ul class="nav section-nav" id="testing-section-nav">${testingNavHtml}</ul>
        </div>
        <div class="track-nav-panel" id="nav-panel-fastapi" data-track="fastapi">
          <h2 class="sidebar-heading">Topics</h2>
          <ul class="nav section-nav" id="fastapi-section-nav">${fastapiNavHtml}</ul>
          <p class="side-hint"><a href="${fastapi.embedSrc}" target="_blank" rel="noopener">Open full page ↗</a></p>
        </div>
        <div class="track-nav-panel" id="nav-panel-planned" data-track="planned">
          <p class="side-hint">This path is coming soon. SQL and QA are ready above.</p>
        </div>
      </div>
    </aside>
    <main class="stage">
      <div class="track-panel visible" id="track-sql" data-track="sql" style="--track-accent:#238636">
        ${sql.trackModulesHtml}
      </div>
      <div class="track-panel" id="track-testing" data-track="testing" style="--track-accent:#1f6feb">
        <div class="testing-scroll">${testing.contentHtml}</div>
      </div>
      <div class="track-panel" id="track-fastapi" data-track="fastapi" style="--track-accent:#2457d6">
        <iframe id="fastapi-frame" class="track-embed" src="${fastapi.embedSrc}" title="FastAPI Learning Guide"></iframe>
      </div>
      <div class="track-panel" id="track-placeholder" data-track="placeholder"></div>
    </main>
  </div>
  <div class="toolbar"><button type="button" onclick="window.print()">Print</button></div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/sql-wasm.js"></script>
  <script>
    const HUB = ${manifestJson};
    const SCHEMA_SQL = ${sql.schemaJson};
    const EXERCISES = ${sql.exercisesJson};
    const DIAGRAMS = ${sql.diagramsJson};
    const LEVEL_DIAGRAMS = ${JSON.stringify(learnLevelDiagrams)};
    const TESTING_SECTIONS = ${testing.sectionsJson || "[]"};
    const FASTAPI_SECTIONS = ${fastapi.sectionsJson || "[]"};

    let db = null;
    let currentExerciseId = EXERCISES[0]?.id;
    let activeTrackId = HUB.defaultTrack || "sql";
    let activeModuleId = "learn";

    function smoothScrollTo(el) {
      if (!el) return;
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function renderTrackList() {
      const list = document.getElementById("track-list");
      list.innerHTML = "";
      HUB.tracks.forEach((t) => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "track-btn" + (t.id === activeTrackId ? " active" : "");
        btn.style.setProperty("--track-accent", t.accent || "#238636");
        btn.dataset.trackId = t.id;
        const badge = t.status === "planned" ? ' <span class="badge soon">Soon</span>' : "";
        btn.innerHTML =
          '<span class="track-icon">' + (t.icon || "📁") + "</span>" +
          '<span class="track-title">' + t.title + badge + "</span>";
        btn.addEventListener("click", () => selectTrack(t.id));
        list.appendChild(btn);
      });
    }

    function setTrackNavPanel(trackId) {
      document.querySelectorAll(".track-nav-panel").forEach((p) => {
        p.classList.toggle("visible", p.dataset.track === trackId);
      });
    }

    function scrollToTestingSection(sectionId, updateHash) {
      const el = document.querySelector("#track-testing #" + CSS.escape(sectionId));
      if (el) smoothScrollTo(el);
      document.querySelectorAll(".testing-jump").forEach((a) => {
        a.classList.toggle("active", a.dataset.section === sectionId);
      });
      if (updateHash !== false) {
        history.replaceState(
          null,
          "",
          "#track=testing&section=" + encodeURIComponent(sectionId)
        );
      }
    }

    function initTestingNav() {
      document.querySelectorAll(".testing-jump").forEach((a) => {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          scrollToTestingSection(a.dataset.section, true);
        });
      });
      const panels = document.querySelectorAll("#track-testing .panel");
      if (!panels.length) return;
      const obs = new IntersectionObserver(
        (entries) => {
          if (activeTrackId !== "testing") return;
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (visible?.target?.id) {
            document.querySelectorAll(".testing-jump").forEach((link) => {
              link.classList.toggle("active", link.dataset.section === visible.target.id);
            });
          }
        },
        { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.1, 0.25] }
      );
      panels.forEach((p) => obs.observe(p));
    }

    function selectTrack(id) {
      const track = HUB.tracks.find((t) => t.id === id);
      if (!track) return;
      activeTrackId = id;
      document.documentElement.style.setProperty("--track-accent", track.accent || "#238636");
      document.getElementById("sidebar-context").textContent = track.title;
      document.querySelectorAll(".track-btn").forEach((b) =>
        b.classList.toggle("active", b.dataset.trackId === id)
      );

      const sqlPanel = document.getElementById("track-sql");
      const testingPanel = document.getElementById("track-testing");
      const placeholder = document.getElementById("track-placeholder");

      document.querySelectorAll(".track-panel[data-track]").forEach((p) => {
        const pid = p.dataset.track;
        if (pid === "placeholder") return;
        p.classList.toggle("visible", pid === id);
      });

      if (track.status === "planned") {
        placeholder.classList.add("visible");
        sqlPanel?.classList.remove("visible");
        testingPanel?.classList.remove("visible");
        placeholder.innerHTML =
          '<div class="placeholder-card">' +
          "<h2>" + escapeHtml(track.title) + "</h2>" +
          "<p>" + escapeHtml(track.description || "Coming soon.") + "</p></div>";
        setTrackNavPanel("planned");
      } else if (track.id === "sql") {
        placeholder.classList.remove("visible");
        setTrackNavPanel("sql");
        document.querySelector("main.stage")?.classList.remove("embed-mode");
        showModule(activeModuleId || "learn", false);
        history.replaceState(
          null,
          "",
          "#track=sql&module=" + encodeURIComponent(activeModuleId || "learn")
        );
      } else if (track.id === "testing") {
        placeholder.classList.remove("visible");
        setTrackNavPanel("testing");
        document.querySelector("main.stage")?.classList.remove("embed-mode");
        const params = new URLSearchParams((location.hash || "").replace(/^#/, ""));
        let section = TESTING_SECTIONS[0]?.id;
        if (params.get("track") === "testing" && params.get("section")) {
          section = params.get("section");
        }
        if (section) {
          requestAnimationFrame(() => scrollToTestingSection(section, true));
        } else {
          history.replaceState(null, "", "#track=testing");
        }
      } else if (track.id === "fastapi") {
        placeholder.classList.remove("visible");
        setTrackNavPanel("fastapi");
        document.querySelector("main.stage")?.classList.add("embed-mode");
        const params = new URLSearchParams((location.hash || "").replace(/^#/, ""));
        let section = params.get("track") === "fastapi" ? params.get("section") : "";
        if (section) {
          scrollToFastapiSection("#" + section, false);
        } else {
          history.replaceState(null, "", "#track=fastapi");
        }
      } else {
        document.querySelector("main.stage")?.classList.remove("embed-mode");
      }
    }

    function scrollToFastapiSection(hash, updateHash) {
      const frame = document.getElementById("fastapi-frame");
      const h = hash.startsWith("#") ? hash : "#" + hash;
      const go = () => {
        if (!frame?.contentWindow) return;
        frame.contentWindow.location.hash = h.replace(/^#/, "");
        document.querySelectorAll(".fastapi-jump").forEach((a) => {
          a.classList.toggle("active", a.dataset.hash === h);
        });
        if (updateHash !== false) {
          history.replaceState(
            null,
            "",
            "#track=fastapi&section=" + encodeURIComponent(h.replace(/^#/, ""))
          );
        }
      };
      if (frame?.contentDocument?.readyState === "complete") go();
      else frame?.addEventListener("load", () => go(), { once: true });
    }

    function initFastapiNav() {
      document.querySelectorAll(".fastapi-jump").forEach((a) => {
        a.addEventListener("click", (e) => {
          e.preventDefault();
          scrollToFastapiSection(a.dataset.hash, true);
        });
      });
    }

    function showModule(id, updateHash) {
      activeModuleId = id;
      document.querySelectorAll("#nav-panel-sql .module-btn").forEach((b) =>
        b.classList.toggle("active", b.dataset.module === id)
      );
      document.querySelectorAll("#track-sql .module-panel").forEach((p) =>
        p.classList.toggle("visible", p.dataset.module === id)
      );
      document.querySelectorAll("#nav-panel-sql .side-module").forEach((p) =>
        p.classList.toggle("visible", p.dataset.module === id)
      );
      if (updateHash !== false) {
        history.replaceState(
          null,
          "",
          "#track=sql&module=" + encodeURIComponent(id)
        );
      }
    }

    function initModules() {
      document.querySelectorAll("#nav-panel-sql .module-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          if (activeTrackId !== "sql") selectTrack("sql");
          showModule(btn.dataset.module);
        });
      });
    }

    function fillToc(selector, tocId, labelReplace) {
      const toc = document.getElementById(tocId);
      if (!toc) return;
      toc.innerHTML = "";
      document.querySelectorAll(selector).forEach((h) => {
        const a = document.createElement("a");
        a.href = "#" + h.id;
        let label = h.textContent;
        if (labelReplace) label = label.replace(labelReplace, "");
        a.textContent = label;
        a.addEventListener("click", (e) => {
          e.preventDefault();
          smoothScrollTo(h);
        });
        const li = document.createElement("li");
        li.appendChild(a);
        toc.appendChild(li);
      });
    }

    function buildLearnToc() {
      fillToc("#sql-module-learn .content h2[id]", "toc-sql-learn", /^Level \\d+ — /);
    }

    function buildDbmsToc() {
      fillToc("#sql-module-dbms .content h2[id]", "toc-sql-dbms", /^\\d+\\.\\s*/);
    }

    function injectInlineDiagrams() {
      const learn = document.querySelector("#sql-module-learn .content");
      if (learn) {
        Object.entries(LEVEL_DIAGRAMS).forEach(([headingId, key]) => {
          const h = learn.querySelector("#" + CSS.escape(headingId));
          if (!h || !DIAGRAMS[key]) return;
          if (h.nextElementSibling?.classList?.contains("inline-concept-viz")) return;
          let insertAfter = h;
          if (headingId === "schema") {
            const rel = learn.querySelector("#schema ~ p");
            if (rel) insertAfter = rel;
          }
          const div = document.createElement("div");
          div.className = "inline-concept-viz";
          div.innerHTML = DIAGRAMS[key];
          insertAfter.insertAdjacentElement("afterend", div);
        });
      }
      const joinsH = document.querySelector("#sql-module-dbms #dbms-9-joins-conceptual");
      if (joinsH && DIAGRAMS["join-inner"]) {
        document.querySelectorAll("#sql-module-dbms p").forEach((p) => {
          if (/visual concepts/i.test(p.textContent)) p.remove();
        });
        if (!joinsH.nextElementSibling?.classList?.contains("join-viz-stack")) {
          const wrap = document.createElement("div");
          wrap.className = "join-viz-stack inline-concept-viz";
          wrap.innerHTML =
            (DIAGRAMS["join-inner"] || "") + (DIAGRAMS["join-left"] || "");
          joinsH.insertAdjacentElement("afterend", wrap);
        }
      }
    }

    function applyInterviewFilter() {
      const only = document.getElementById("filter-interview-only")?.checked;
      document.querySelectorAll(".practice-nav button[data-id]").forEach((btn) => {
        const ex = EXERCISES.find((e) => e.id === btn.dataset.id);
        const hide = only && ex && ex.level !== "Interview";
        btn.classList.toggle("hidden-by-filter", hide);
      });
      document.querySelectorAll(".practice-nav .nav-section").forEach((sec) => {
        if (!only) {
          sec.classList.remove("hidden-by-filter");
          return;
        }
        sec.classList.toggle("hidden-by-filter", sec.textContent.indexOf("Interview") === -1);
      });
    }

    function buildPracticeNav() {
      const nav = document.getElementById("practice-nav");
      let lastLevel = "";
      EXERCISES.forEach((ex) => {
        if (ex.level !== lastLevel) {
          const head = document.createElement("div");
          head.className = "nav-section";
          head.textContent = ex.level === "Interview" ? "Interview (most asked)" : ex.level;
          nav.appendChild(head);
          lastLevel = ex.level;
        }
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = ex.title;
        btn.dataset.id = ex.id;
        if (ex.level === "Interview") btn.classList.add("interview-item");
        btn.addEventListener("click", () => selectExercise(ex.id, { navigate: true }));
        nav.appendChild(btn);
      });
      const filter = document.getElementById("filter-interview-only");
      if (filter) filter.addEventListener("change", applyInterviewFilter);
    }

    function escapeHtml(s) {
      return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function execToTables(sql) {
      if (!db) throw new Error("Database not ready");
      const t = sql.trim();
      if (!t) throw new Error("Empty query");
      if (/^\\s*(insert|update|delete|drop|create)/i.test(t)) {
        db.run(t);
        return { type: "exec", message: "Query executed (no result rows)." };
      }
      const res = db.exec(t);
      if (!res.length) return { type: "empty", columns: [], values: [] };
      return { type: "result", columns: res[0].columns, values: res[0].values };
    }

    function renderResult(data) {
      if (data.type === "exec") return "<p class='msg info'>" + escapeHtml(data.message) + "</p>";
      if (data.type === "empty") return "<p class='msg info'>Query OK — 0 rows returned.</p>";
      let html = "<div class='sql-results'><table><thead><tr>";
      data.columns.forEach((c) => (html += "<th>" + escapeHtml(c) + "</th>"));
      html += "</tr></thead><tbody>";
      data.values.forEach((row) => {
        html += "<tr>";
        row.forEach((cell) => {
          html += "<td>" + escapeHtml(cell === null ? "NULL" : cell) + "</td>";
        });
        html += "</tr>";
      });
      html += "</tbody></table></div>";
      html += "<p class='msg info'>" + data.values.length + " row(s)</p>";
      return html;
    }

    function normalizeResult(data) {
      if (data.type !== "result") return JSON.stringify(data);
      return JSON.stringify({ columns: data.columns, values: data.values });
    }

    function selectExercise(id, opts) {
      const navigate = !opts || opts.navigate !== false;
      currentExerciseId = id;
      const ex = EXERCISES.find((e) => e.id === id);
      if (!ex) return;
      if (navigate) showModule("practice");
      document.querySelectorAll(".practice-nav button").forEach((b) => {
        b.classList.toggle("active", b.dataset.id === id);
      });
      const ws = document.getElementById("practice-workspace");
      ws.innerHTML =
        "<span class='level'>" + escapeHtml(ex.level) + "</span>" +
        "<h3>" + escapeHtml(ex.title) + "</h3>" +
        "<div class='concept-box'>" + escapeHtml(ex.concept) + "</div>" +
        (DIAGRAMS[ex.diagram]
          ? "<div class='inline-concept-viz'>" + DIAGRAMS[ex.diagram] + "</div>"
          : "") +
        "<p><strong>Task:</strong> " + escapeHtml(ex.task) + "</p>" +
        "<textarea class='sql-input' id='sql-editor' spellcheck='false'>" + escapeHtml(ex.starter || "") + "</textarea>" +
        "<div class='btn-row'>" +
        "<button type='button' class='primary' id='btn-run'>▶ Run</button>" +
        "<button type='button' id='btn-check'>✓ Check answer</button>" +
        "<button type='button' id='btn-hint'>Hint</button>" +
        "<button type='button' id='btn-solution'>Show solution</button>" +
        "<button type='button' class='danger' id='btn-reset-db'>Reset database</button>" +
        "</div>" +
        "<div class='result-panel' id='user-result'></div>" +
        "<div class='result-panel' id='compare-result' style='display:none'></div>";

      ws.querySelector("#btn-run").onclick = runUserQuery;
      ws.querySelector("#btn-check").onclick = checkAnswer;
      ws.querySelector("#btn-hint").onclick = () => {
        const msg = ws.querySelector("#user-result");
        msg.innerHTML = "<p class='msg info'>Hint: " + escapeHtml(ex.hint || ex.solution.split("\\n")[0]) + "</p>";
      };
      ws.querySelector("#btn-solution").onclick = () => {
        ws.querySelector("#sql-editor").value = ex.solution.trim();
      };
      ws.querySelector("#btn-reset-db").onclick = resetDb;
    }

    function runUserQuery() {
      const sql = document.getElementById("sql-editor").value;
      const out = document.getElementById("user-result");
      try {
        const data = execToTables(sql);
        out.innerHTML = "<h4>Your result</h4>" + renderResult(data);
      } catch (e) {
        out.innerHTML = "<p class='msg err'>" + escapeHtml(e.message) + "</p>";
      }
    }

    function checkAnswer() {
      const ex = EXERCISES.find((e) => e.id === currentExerciseId);
      const userSql = document.getElementById("sql-editor").value;
      const cmp = document.getElementById("compare-result");
      cmp.style.display = "block";
      try {
        resetDbSilent();
        const userData = execToTables(userSql);
        resetDbSilent();
        const expected = execToTables(ex.solution);
        const match = normalizeResult(userData) === normalizeResult(expected);
        cmp.innerHTML =
          "<h4>Check</h4>" +
          (match
            ? "<p class='msg ok'>Match — your result equals the expected solution.</p>"
            : "<p class='msg err'>Results differ. Compare below (your query vs solution).</p>") +
          "<div class='compare-grid'>" +
          "<div><h4>Your query</h4>" + renderResult(userData) + "</div>" +
          "<div><h4>Expected (solution)</h4>" + renderResult(expected) + "</div>" +
          "</div>";
      } catch (e) {
        cmp.innerHTML = "<p class='msg err'>" + escapeHtml(e.message) + "</p>";
      }
    }

    function resetDbSilent() {
      db = new window.SQL.Database();
      db.run(SCHEMA_SQL);
    }

    function resetDb() {
      resetDbSilent();
      const out = document.getElementById("user-result");
      if (out) out.innerHTML = "<p class='msg ok'>Database reset — sample Customers & Orders restored.</p>";
    }

    async function initDb() {
      const status = document.getElementById("db-status");
      try {
        const SQL = await initSqlJs({
          locateFile: (f) => "https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/" + f,
        });
        window.SQL = SQL;
        resetDbSilent();
        status.className = "db-status ok";
        status.textContent = "SQL engine ready — 10 customers, 19 orders loaded.";
      } catch (e) {
        status.className = "db-status err";
        status.textContent = "Could not load sql.js (need internet): " + e.message;
      }
    }

    function parseHash() {
      const hash = (location.hash || "").replace(/^#/, "");
      if (!hash) return;
      const params = new URLSearchParams(hash);
      const track = params.get("track");
      const mod = params.get("module");
      const section = params.get("section");
      if (track) activeTrackId = track;
      if (mod) activeModuleId = mod;
      if (section && track === "testing") {
        setTimeout(() => scrollToTestingSection(section, false), 200);
      }
      if (section && track === "fastapi") {
        setTimeout(() => scrollToFastapiSection("#" + section, false), 400);
      }
    }

    parseHash();
    renderTrackList();
    initModules();
    initTestingNav();
    initFastapiNav();
    selectTrack(activeTrackId);
    if (activeTrackId === "sql") showModule(activeModuleId, false);
    buildDbmsToc();
    buildLearnToc();
    injectInlineDiagrams();
    buildPracticeNav();
    selectExercise(EXERCISES[0].id, { navigate: false });
    initDb();
  </script>
</body>
</html>`;

const outputs = [
  join(paths.html, "index.html"),
  join(paths.html, "developer-hub.html"),
  join(paths.html, "software-developer.html"),
  join(paths.html, "Software-Developer-SQL-Guide.html"),
];
for (const out of outputs) {
  writeFileSync(out, html, "utf8");
}
writeFileSync(join(paths.html, ".nojekyll"), "", "utf8");
console.log("Created:", outputs.map((p) => p.split(/[/\\\\]/).pop()).join(", "));