/**
 * FastAPI track — embed html/fastapi_learn.html + sidebar TOC.
 */
import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { paths } from "../paths.mjs";

export function prepareFastapiTrack() {
  const file = join(paths.html, "fastapi_learn.html");
  if (!existsSync(file)) {
    return {
      sections: [],
      sectionsJson: "[]",
      embedSrc: "fastapi_learn.html",
    };
  }
  const raw = readFileSync(file, "utf8");
  const sections = [];
  const navMatch = raw.match(/<nav[^>]*aria-label="[^"]*"[^>]*>([\s\S]*?)<\/nav>/i) || raw.match(/<nav[^>]*>([\s\S]*?)<\/nav>/i);
  const navHtml = navMatch ? navMatch[1] : raw;
  for (const m of navHtml.matchAll(/<a href="(#[^"]+)">([^<]+)</gi)) {
    sections.push({
      id: m[1].slice(1),
      hash: m[1],
      title: m[2].trim(),
    });
  }
  return {
    sections,
    sectionsJson: JSON.stringify(sections),
    embedSrc: "fastapi_learn.html",
  };
}