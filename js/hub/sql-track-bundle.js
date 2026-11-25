/**
 * SQL track HTML — sources in content/sql/ or reuse html/developer-hub.html.
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { execSync } from "child_process";
import { paths } from "../paths.mjs";
import { exercises, diagramHtml } from "../data/sql-practice-exercises.js";

function prepareSqlTrackFromHub(hubPath) {
  const raw = readFileSync(hubPath, "utf8");
  const trackMatch = raw.match(
    /<div class="track-panel[^"]*" id="track-sql"[^>]*>([\s\S]*?)<\/div>\s*<div class="track-panel"/
  );
  let trackModulesHtml = trackMatch ? trackMatch[1].trim() : "";
  trackModulesHtml = trackModulesHtml
    .replace(/<section class="module-panel" id="sql-module-visuals"[\s\S]*?<\/section>\s*/i, "")
    .replace(/<p>See <strong>Visual concepts<\/strong> tab for diagrams\.<\/p>\s*/gi, "");

  const pick = (name) => {
    const m = raw.match(new RegExp(`const ${name} = ([\\s\\S]*?);\\r?\\n`));
    return m ? m[1] : null;
  };
  const schemaJson = pick("SCHEMA_SQL") ?? JSON.stringify("");
  const exercisesJson = pick("EXERCISES") ?? JSON.stringify(exercises);
  const diagramsJson = pick("DIAGRAMS") ?? JSON.stringify(diagramHtml);
  let schemaSql = "";
  try {
    schemaSql = JSON.parse(schemaJson);
  } catch {
    schemaSql = readFileSync(paths.schemaFile, "utf8");
  }
  return {
    trackModulesHtml,
    schemaSql,
    schemaJson,
    exercisesJson,
    diagramsJson,
  };
}

export function prepareSqlTrack() {
  const learnMd = join(paths.contentSql, "SQL-Learning-Guide.md");
  if (!existsSync(learnMd)) {
    if (existsSync(paths.developerHub)) return prepareSqlTrackFromHub(paths.developerHub);
  }

  const schemaSql = readFileSync(paths.schemaFile, "utf8");
  const md = readFileSync(learnMd, "utf8");
  const dbmsMd = readFileSync(join(paths.contentSql, "DBMS-Interview-Basics.md"), "utf8");

  const mdToHtml = (markdown) =>
    execSync("npx --yes marked --gfm", {
      input: markdown,
      encoding: "utf8",
      cwd: paths.root,
      maxBuffer: 10 * 1024 * 1024,
      env: { ...process.env, npm_config_yes: "true" },
    });

  const slugify = (text) =>
    text
      .replace(/<[^>]*>/g, "")
      .trim()
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

  const enrich = (html, prefix = "") =>
    html.replace(/<h([2-3])([^>]*)>([\s\S]*?)<\/h\1>/gi, (m, level, attrs, inner) => {
      if (/\bid=/.test(attrs)) return m;
      const id = (prefix ? prefix + "-" : "") + slugify(inner);
      return `<h${level}${attrs} id="${id}">${inner}</h${level}>`;
    });

  const schemaSafe = schemaSql.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const trackModulesHtml = `
    <section class="module-panel" id="sql-module-dbms" data-module="dbms">
      <div class="track-hero" style="--track-accent:#238636">
        <h2>DBMS — Interview basics</h2>
        <p>Keys, ACID, normalization, indexes, and 20 short Q&amp;A.</p>
      </div>
      <div class="gallery-row">
        <div class="gallery-card"><h3>Primary &amp; foreign keys</h3>${diagramHtml["pk-fk"]}</div>
        <div class="gallery-card"><h3>ACID transaction</h3>${diagramHtml.acid}</div>
      </div>
      <article class="content prose" data-toc="toc-sql-dbms">${enrich(mdToHtml(dbmsMd), "dbms")}</article>
    </section>
    <section class="module-panel visible" id="sql-module-learn" data-module="learn">
      <div class="track-hero" style="--track-accent:#238636">
        <h2>SQL learning guide</h2>
        <p>Customers &amp; Orders — theory, inline diagrams per level.</p>
      </div>
      <div class="card">
        <div class="card-head">Reference schema (Practice sandbox)</div>
        <div class="card-body"><pre class="schema-pre">${schemaSafe}</pre></div>
      </div>
      <article class="content prose" data-toc="toc-sql-learn">${enrich(mdToHtml(md))}</article>
    </section>
    <section class="module-panel" id="sql-module-practice" data-module="practice">
      <div class="track-hero" style="--track-accent:#238636">
        <h2>SQL practice lab</h2>
        <p>Run queries in-browser. <strong>15 Interview</strong> items in sidebar (gold bar).</p>
      </div>
      <div id="db-status" class="db-status load">Loading SQL engine…</div>
      <div class="practice-card" id="practice-workspace"></div>
    </section>`;

  return {
    trackModulesHtml,
    schemaSql,
    schemaJson: JSON.stringify(schemaSql),
    exercisesJson: JSON.stringify(exercises),
    diagramsJson: JSON.stringify(diagramHtml),
  };
}