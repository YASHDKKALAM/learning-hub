/**
 * Move Informal Q&A to last in sidebar nav and main panels (archive HTML).
 * Request: informal QA last in 1.Testing-Study-All-In-One.html
 */
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const htmlPath = join(dirname(fileURLToPath(import.meta.url)), "..", "html", "1.Testing-Study-All-In-One.html");
let html = readFileSync(htmlPath, "utf8");

const informalNav =
  '<li><a href="#informal" data-section="informal" style="--accent:#ad1457"><span class="nav-icon">💬</span>Informal Interview Q&A</a></li>';

html = html.replace(new RegExp("\\s*" + informalNav.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), "");

html = html.replace(
  /(<li><a href="#cicd"[^>]*>[\s\S]*?CI\/CD Guide<\/a><\/li>)/,
  `$1\n${informalNav}`
);

html = html.replace(
  /<p>Informal · QA · Database · API · Selenium · Playwright · Cheetah · CI\/CD<\/p>/,
  "<p>QA · Database · API · Selenium · Playwright · Cheetah · CI/CD · Informal</p>"
);

const panelRe = /<section class="panel" id="informal"[\s\S]*?<\/section>\s*/i;
const panelMatch = html.match(panelRe);
if (panelMatch) {
  const panel = panelMatch[0];
  html = html.replace(panelRe, "");
  html = html.replace(/(\s*)<\/main>/, `\n${panel}$1</main>`);
}

writeFileSync(htmlPath, html, "utf8");
console.log("Updated nav + panel order:", htmlPath);