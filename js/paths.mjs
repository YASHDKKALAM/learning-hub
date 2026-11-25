/**
 * Canonical paths for the Learning workspace (import from any js/** build script).
 */
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const jsDir = dirname(fileURLToPath(import.meta.url));
export const learningRoot = join(jsDir, "..");

export const paths = {
  root: learningRoot,
  html: join(learningRoot, "html"),
  sql: join(learningRoot, "sql"),
  data: join(learningRoot, "js", "data"),
  hub: join(learningRoot, "js", "hub"),
  testingScripts: join(learningRoot, "js", "testing"),
  contentSql: join(learningRoot, "content", "sql"),
  contentTesting: join(learningRoot, "content", "testing"),
  schemaFile: join(learningRoot, "sql", "sample-schema.sql"),
  developerHub: join(learningRoot, "html", "developer-hub.html"),
  testingHub: join(learningRoot, "html", "Testing-Study-Hub.html"),
  testingAllInOne: join(learningRoot, "html", "Testing-Study-All-In-One.html"),
  testingArchive: join(learningRoot, "html", "1.Testing-Study-All-In-One.html"),
};