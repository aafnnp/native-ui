import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const docsRootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const repoRootDir = resolve(docsRootDir, "../..");

/**
 * 旧链路残留文件（命中任一即失败）
 */
const legacyFiles = [
  "app/root.tsx",
  "app/routes.ts",
  "app/routes/_index.tsx",
  "app/routes/guide._index.tsx",
  "app/components/MarkdownPage.tsx",
  "content/index.md",
  "content/guide/getting-started.md",
  "content/guide/theme.md",
  "content/guide/migration.md",
  "scripts/generate-docs-routes.mjs",
  "scripts/path-to-route.mjs",
  "scripts/path-to-route.test.mjs",
];

/**
 * 旧链路关键字（命中任一即失败）
 */
const legacyPatterns = [
  { file: "package.json", token: "generate-docs-routes" },
  { file: "package.json", token: "path-to-route" },
];

const errors = [];

for (const relativePath of legacyFiles) {
  const absolutePath = resolve(docsRootDir, relativePath);
  if (existsSync(absolutePath)) {
    errors.push(`E_LEGACY_FILE_EXISTS ${relativePath}`);
  }
}

for (const item of legacyPatterns) {
  const absolutePath = resolve(docsRootDir, item.file);
  const source = readFileSync(absolutePath, "utf8");
  if (source.includes(item.token)) {
    errors.push(`E_LEGACY_REFERENCE_FOUND ${item.file} token:${item.token}`);
  }
}

const legacyRouteDir = resolve(docsRootDir, "app/routes");
if (existsSync(legacyRouteDir)) {
  const legacyGeneratedRoutes = readdirSync(legacyRouteDir).filter(
    (fileName) => /^guide\\.components\\..+\\.tsx$/.test(fileName),
  );
  for (const fileName of legacyGeneratedRoutes) {
    errors.push(`E_LEGACY_ROUTE_PATTERN_FOUND app/routes/${fileName}`);
  }
}

const migrationMapPath = resolve(
  repoRootDir,
  "docs/superpowers/specs/2026-03-27-docs-migration-map.md",
);
const migrationMapSource = readFileSync(migrationMapPath, "utf8");

if (!/\|\s*`\/`\s*\|\s*`\/`\s*\|/.test(migrationMapSource)) {
  errors.push("E_LEGACY_MIGRATION_MAP_FORMAT_INVALID");
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(error);
  }
  process.exit(1);
}

console.log("OK_LEGACY");
