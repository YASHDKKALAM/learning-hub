/**
 * Generates Testing-Study-Hub.html from markdown sources + Playwright sheet.
 * Run: node build-testing-hub.mjs  (from Learning/)
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import { paths } from "../paths.mjs";

function mdToHtml(markdown) {
  return execSync("npx --yes marked --gfm", {
    input: markdown,
    encoding: "utf8",
    cwd: paths.root,
    maxBuffer: 20 * 1024 * 1024,
    env: { ...process.env, npm_config_yes: "true" },
  });
}

function githubSlug(text) {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Add heading ids and prefix anchors so TOC links work in combined hub page. */
function enrichSectionHtml(html, sectionId) {
  const slugCounts = new Map();
  let out = html.replace(/<h([1-6])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, inner) => {
    if (/\bid\s*=/.test(attrs)) {
      return match.replace(/\bid="([^"]+)"/, (_, id) => {
        const prefixed = id.startsWith(`${sectionId}-`) ? id : `${sectionId}-${id}`;
        return `id="${prefixed}"`;
      });
    }
    let slug = githubSlug(inner);
    if (!slug) slug = `heading-${level}`;
    const count = slugCounts.get(slug) || 0;
    slugCounts.set(slug, count + 1);
    const id = count === 0 ? `${sectionId}-${slug}` : `${sectionId}-${slug}-${count}`;
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
  });

  out = out.replace(/href="#([^"]+)"/g, (m, hash) => {
    if (!hash || hash.startsWith(`${sectionId}-`)) return m;
    return `href="#${sectionId}-${hash}"`;
  });

  return out;
}

const sections = [
  {
    id: "qa",
    title: "QA Fundamentals",
    file: "QA-Fundamentals.md",
    icon: "📋",
    color: "#1565c0",
  },
  {
    id: "database",
    title: "Database Testing Basics",
    file: "Database-Testing-Basics.md",
    icon: "🗄️",
    color: "#5d4037",
  },
  {
    id: "api",
    title: "API Testing & Postman",
    file: "API-Testing-Postman-Interview.md",
    icon: "🔌",
    color: "#2e7d32",
  },
  {
    id: "selenium",
    title: "Selenium Interview Guide",
    file: "Selenium-Interview-Study-Notes.md",
    icon: "🌐",
    color: "#e65100",
  },
  {
    id: "playwright",
    title: "Playwright Commands (Top 50+)",
    file: "Playwright-Top50-Commands.html",
    icon: "🎭",
    color: "#c41e3a",
    isHtml: true,
  },
  {
    id: "cheetah",
    title: "Cheetah @ Dassault",
    file: "cheetahdassault.md",
    icon: "🐆",
    color: "#6a1b9a",
  },
  {
    id: "cicd",
    title: "CI/CD Guide",
    file: "CI-CD-Guide.md",
    icon: "⚙️",
    color: "#00838f",
  },
  {
    id: "informal",
    title: "Informal Interview Q&A",
    file: "Interview-Informal-Questions.md",
    icon: "💬",
    color: "#ad1457",
  },
];

function extractPlaywrightFromArchive() {
  return extractPanelBodyFromArchive("playwright", true);
}

function testingArchivePaths() {
  return [paths.testingArchive, paths.testingAllInOne, paths.testingHub].filter((p) => existsSync(p));
}

function extractPanelBodyFromArchive(sectionId, wrapPlaywright) {
  const panelRe = new RegExp(
    `<section class="panel" id="${sectionId}"[\\s\\S]*?<article class="panel-body markdown-body">\\s*([\\s\\S]*?)\\s*</article>\\s*</section>`,
    "i"
  );
  for (const archive of testingArchivePaths()) {
    const raw = readFileSync(archive, "utf8");
    const m = raw.match(panelRe);
    if (!m) continue;
    const inner = m[1].trim();
    if (/source file missing/i.test(inner)) continue;
    if (wrapPlaywright) {
      if (inner.includes("playwright-embed")) return inner;
      return `<div class="playwright-embed">${inner}</div>`;
    }
    return inner;
  }
  return null;
}

function loadSection(section) {
  const path = join(paths.contentTesting, section.file);
  if (!existsSync(path)) {
    const embedded =
      section.id === "playwright"
        ? extractPlaywrightFromArchive()
        : extractPanelBodyFromArchive(section.id);
    if (embedded) return embedded;
    return `<p><em>Source file missing: <code>${section.file}</code>. Add under <code>content/testing/</code> or keep full sections in <code>html/1.Testing-Study-All-In-One.html</code>, then rebuild.</em></p>`;
  }
  const raw = readFileSync(path, "utf8");
  if (section.isHtml) {
    const bodyMatch = raw.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const inner = bodyMatch ? bodyMatch[1] : raw;
    return `<div class="playwright-embed">${inner}</div>`;
  }
  return enrichSectionHtml(mdToHtml(raw), section.id);
}

const navItems = sections
  .map(
    (s) =>
      `<li><a href="#${s.id}" data-section="${s.id}" style="--accent:${s.color}"><span class="nav-icon">${s.icon}</span>${s.title}</a></li>`
  )
  .join("\n");

const panels = sections
  .map((s) => {
    const content = loadSection(s);
    return `
<section class="panel" id="${s.id}" data-title="${s.title}">
  <header class="panel-head" style="border-color:${s.color}">
    <span class="panel-icon">${s.icon}</span>
    <div>
      <h2>${s.title}</h2>
      <p class="panel-source">Source: ${s.file}</p>
    </div>
  </header>
  <article class="panel-body markdown-body">
    ${content}
  </article>
</section>`;
  })
  .join("\n");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Testing Study Hub — QA, Database, API, Selenium, Playwright, Cheetah, CI/CD</title>
  <style>
    :root {
      --bg: #0f1419;
      --sidebar: #161b22;
      --surface: #ffffff;
      --text: #1a1a2e;
      --muted: #57606a;
      --border: #d0d7de;
      --link: #0969da;
      --sidebar-text: #e6edf3;
      --sidebar-muted: #8b949e;
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: auto; }
    body {
      margin: 0;
      font-family: "Segoe UI", system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
    }
    .layout {
      display: grid;
      grid-template-columns: 280px 1fr;
      min-height: 100vh;
    }
    .sidebar {
      background: var(--sidebar);
      color: var(--sidebar-text);
      padding: 1.25rem 0;
      position: sticky;
      top: 0;
      height: 100vh;
      overflow-y: auto;
      border-right: 1px solid #30363d;
    }
    .brand {
      padding: 0 1.25rem 1rem;
      border-bottom: 1px solid #30363d;
      margin-bottom: 0.75rem;
    }
    .brand h1 {
      font-size: 1.1rem;
      margin: 0 0 0.35rem;
      line-height: 1.3;
    }
    .brand p {
      margin: 0;
      font-size: 0.78rem;
      color: var(--sidebar-muted);
    }
    .nav { list-style: none; margin: 0; padding: 0 0.5rem; }
    .nav a {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.55rem 0.75rem;
      border-radius: 8px;
      color: var(--sidebar-text);
      text-decoration: none;
      font-size: 0.88rem;
      border-left: 3px solid transparent;
      transition: background 0.15s, border-color 0.15s;
    }
    .nav a:hover, .nav a.active {
      background: rgba(255,255,255,0.06);
      border-left-color: var(--accent, #58a6ff);
    }
    .nav-icon { font-size: 1.1rem; }
    main {
      padding: 1.5rem 2rem 3rem;
      max-width: 960px;
    }
    .intro {
      background: linear-gradient(135deg, #1f6feb 0%, #8957e5 100%);
      color: #fff;
      padding: 1.25rem 1.5rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
    }
    .intro h2 { margin: 0 0 0.5rem; font-size: 1.35rem; }
    .intro p { margin: 0; opacity: 0.92; font-size: 0.95rem; line-height: 1.5; }
    .panel {
      background: var(--surface);
      border-radius: 12px;
      margin-bottom: 2rem;
      box-shadow: 0 8px 24px rgba(0,0,0,0.25);
      overflow: hidden;
      scroll-margin-top: 1.25rem;
    }
    .panel-head {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      border-bottom: 3px solid;
      background: #f6f8fa;
    }
    .panel-icon { font-size: 2rem; }
    .panel-head h2 { margin: 0; font-size: 1.25rem; }
    .panel-source { margin: 0.2rem 0 0; font-size: 0.75rem; color: var(--muted); }
    .panel-body { padding: 1.25rem 1.5rem 1.75rem; }
    .markdown-body {
      font-size: 0.92rem;
      line-height: 1.6;
    }
    .markdown-body h1 { font-size: 1.5rem; margin-top: 0; }
    .markdown-body h2 {
      font-size: 1.15rem;
      margin-top: 1.75rem;
      padding-bottom: 0.35rem;
      border-bottom: 1px solid var(--border);
      scroll-margin-top: 5rem;
    }
    .markdown-body h3 { font-size: 1rem; margin-top: 1.25rem; scroll-margin-top: 5rem; }
    .markdown-body h4 { font-size: 0.95rem; scroll-margin-top: 5rem; }
    .markdown-body p, .markdown-body li { max-width: 72ch; }
    .markdown-body a { color: var(--link); }
    .markdown-body code {
      font-family: Consolas, monospace;
      font-size: 0.85em;
      background: #f6f8fa;
      padding: 0.12em 0.35em;
      border-radius: 4px;
    }
    .markdown-body pre {
      background: #0d1117;
      color: #e6edf3;
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 0.82rem;
    }
    .markdown-body pre code {
      background: none;
      padding: 0;
      color: inherit;
    }
    .markdown-body table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.85rem;
      margin: 1rem 0;
    }
    .markdown-body th, .markdown-body td {
      border: 1px solid var(--border);
      padding: 0.45rem 0.6rem;
      text-align: left;
      vertical-align: top;
    }
    .markdown-body th { background: #f6f8fa; }
    .markdown-body blockquote {
      margin: 1rem 0;
      padding: 0.5rem 1rem;
      border-left: 4px solid #0969da;
      background: #f6f8fa;
      color: #24292f;
    }
    .markdown-body hr { border: none; border-top: 1px solid var(--border); margin: 1.5rem 0; }
    .playwright-embed .print-hint { display: none; }
    .playwright-embed .sheet {
      box-shadow: none;
      border-radius: 0;
      max-width: none;
    }
    .playwright-embed body { padding: 0; background: #fff; }
    .toolbar {
      position: fixed;
      bottom: 1.25rem;
      right: 1.25rem;
      display: flex;
      gap: 0.5rem;
      z-index: 50;
    }
    .toolbar button {
      background: #238636;
      color: #fff;
      border: none;
      padding: 0.65rem 1rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .toolbar button.secondary {
      background: #21262d;
      border: 1px solid #30363d;
    }
    @media print {
      .sidebar, .toolbar, .intro { display: none !important; }
      .layout { grid-template-columns: 1fr; }
      main { padding: 0; max-width: none; }
      .panel { break-inside: avoid; box-shadow: none; page-break-before: always; }
      .panel:first-of-type { page-break-before: auto; }
    }
    @media (max-width: 900px) {
      .layout { grid-template-columns: 1fr; }
      .sidebar { position: relative; height: auto; }
    }
  </style>
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <h1>Testing Study Hub</h1>
        <p>QA · Database · API · Selenium · Playwright · Cheetah · CI/CD · Informal</p>
      </div>
      <ul class="nav">${navItems}</ul>
    </aside>
    <main>
      <div class="intro">
        <h2>Interview &amp; on-the-job reference</h2>
        <p>All guides in one place. Use the sidebar to jump to a topic. <strong>This single HTML file includes every section</strong> — share or open only <code>Testing-Study-All-In-One.html</code>; no <code>.md</code> files or build step needed on the reader&apos;s PC. Regenerate from sources with <code>node build-testing-hub.mjs</code> after you edit notes.</p>
      </div>
      ${panels}
    </main>
  </div>
  <div class="toolbar no-print">
    <button type="button" class="secondary" id="scroll-top-btn">↑ Top</button>
    <button type="button" onclick="window.print()">Print / PDF</button>
  </div>
  <script>
    const links = document.querySelectorAll('.nav a');
    const panels = document.querySelectorAll('.panel');
    let scrollAnimating = false;

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    function smoothScrollTo(targetY, durationMs) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        window.scrollTo(0, targetY);
        return Promise.resolve();
      }

      const startY = window.scrollY;
      const distance = targetY - startY;
      if (Math.abs(distance) < 2) return Promise.resolve();

      scrollAnimating = true;
      const startTime = performance.now();

      return new Promise((resolve) => {
        function frame(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / durationMs, 1);
          window.scrollTo(0, startY + distance * easeInOutCubic(progress));
          if (progress < 1) {
            requestAnimationFrame(frame);
          } else {
            scrollAnimating = false;
            resolve();
          }
        }
        requestAnimationFrame(frame);
      });
    }

    function scrollDurationForDistance(px) {
      const minMs = 650;
      const maxMs = 1400;
      const scaled = minMs + Math.abs(px) * 0.35;
      return Math.min(maxMs, Math.max(minMs, scaled));
    }

    function scrollToElement(el) {
      const targetY = el.getBoundingClientRect().top + window.scrollY - 20;
      const duration = scrollDurationForDistance(targetY - window.scrollY);
      return smoothScrollTo(targetY, duration);
    }

    links.forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const id = link.dataset.section;
        const target = document.getElementById(id);
        if (!target) return;

        links.forEach((l) => l.classList.toggle('active', l === link));
        scrollToElement(target);
      });
    });

    document.querySelector('main')?.addEventListener('click', (event) => {
      const anchor = event.target.closest('a[href^="#"]');
      if (!anchor || anchor.closest('.nav')) return;
      const hash = decodeURIComponent(anchor.getAttribute('href').slice(1));
      if (!hash) return;
      const target = document.getElementById(hash);
      if (!target) return;
      event.preventDefault();
      scrollToElement(target);
      history.replaceState(null, '', '#' + hash);
    });

    document.getElementById('scroll-top-btn')?.addEventListener('click', () => {
      const duration = scrollDurationForDistance(window.scrollY);
      smoothScrollTo(0, duration);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        if (scrollAnimating) return;
        entries.forEach((e) => {
          if (e.isIntersecting) {
            links.forEach((l) =>
              l.classList.toggle('active', l.dataset.section === e.target.id)
            );
          }
        });
      },
      { rootMargin: '-15% 0px -55% 0px', threshold: 0 }
    );
    panels.forEach((p) => observer.observe(p));

    if (location.hash) {
      const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
      if (target) setTimeout(() => scrollToElement(target), 100);
    }
  </script>
</body>
</html>`;

writeFileSync(paths.testingHub, html, "utf8");
writeFileSync(paths.testingAllInOne, html, "utf8");
console.log("Created Testing-Study-Hub.html");
console.log("Created Testing-Study-All-In-One.html (same file — use this to share)");
