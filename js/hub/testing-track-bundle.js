/**
 * Embeds Testing Study Hub content from html/Testing-Study-Hub.html.
 */
import { readFileSync, existsSync } from "fs";
import { paths } from "../paths.mjs";

function extractPanelCss(fullCss) {
  const keep = [];
  const chunks = fullCss.split(/\n(?=\s*\.)/);
  const prefixes = [
    ".panel",
    ".markdown-body",
    ".playwright-embed",
    ".panel-head",
    ".panel-body",
    ".panel-icon",
    ".panel-source",
  ];
  for (const chunk of chunks) {
    const head = chunk.trimStart();
    if (prefixes.some((p) => head.startsWith(p) || head.startsWith(p.slice(1)))) keep.push(chunk);
  }
  return keep.join("\n");
}

export function prepareTestingTrack() {
  if (!existsSync(paths.testingHub)) {
    return {
      sections: [],
      sectionsJson: "[]",
      contentHtml:
        '<div class="placeholder-card">Run <code>node build-testing-hub.mjs</code> to create html/Testing-Study-Hub.html.</div>',
      extraCss: "",
    };
  }
  const raw = readFileSync(paths.testingHub, "utf8");
  const sections = [];
  const linkRe =
    /<a href="#([^"]+)" data-section="[^"]*"[^>]*style="--accent:([^"]+)"[^>]*><span class="nav-icon">([^<]*)<\/span>([^<]*)<\/a>/gi;
  let m;
  while ((m = linkRe.exec(raw))) {
    sections.push({ id: m[1], color: m[2], icon: m[3], title: m[4].trim() });
  }

  const mainMatch = raw.match(/<main[^>]*>([\s\S]*)<\/main>/i);
  let contentHtml = mainMatch ? mainMatch[1].trim() : "";
  contentHtml = contentHtml.replace(
    /<div class="intro">[\s\S]*?<\/div>\s*/i,
    `<div class="track-hero" style="--track-accent:#1f6feb">
      <h2>QA &amp; Testing</h2>
      <p>API, Selenium, Playwright, database testing, CI/CD — jump via the left panel.</p>
    </div>`
  );

  const styleMatch = raw.match(/<style>([\s\S]*?)<\/style>/i);
  const extraCss = styleMatch ? extractPanelCss(styleMatch[1]) : "";

  return {
    sections,
    sectionsJson: JSON.stringify(sections),
    contentHtml,
    extraCss,
  };
}