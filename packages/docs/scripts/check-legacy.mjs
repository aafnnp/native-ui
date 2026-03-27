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

/**
 * 关键文件扫描列表（命中旧链路关键字即失败）
 */
const keywordScanFiles = [
  "README.md",
  "package.json",
  "wrangler.toml",
  "tsconfig.node.json",
  "tsconfig.cloudflare.json",
  "workers/app.ts",
  "scripts/check-redirects.mjs",
  "scripts/check-seo.mjs",
  "scripts/check-links.mjs",
  "scripts/check-smoke.mjs",
];

/**
 * 旧链路关键字（大小写不敏感）
 */
const keywordPatterns = [
  /react-router/i,
  /@react-router\//i,
  /generate-docs-routes/i,
  /app\/routes/i,
  /react\s+router/i,
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

for (const relativePath of keywordScanFiles) {
  const absolutePath = resolve(docsRootDir, relativePath);
  if (!existsSync(absolutePath)) {
    continue;
  }
  const source = readFileSync(absolutePath, "utf8");
  for (const pattern of keywordPatterns) {
    if (pattern.test(source)) {
      errors.push(`E_LEGACY_KEYWORD_FOUND ${relativePath} pattern:${pattern.source}`);
    }
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

/**
 * 递归判断目录下是否仍有文件
 * @param {string} dirPath
 * @returns {boolean}
 */
function hasFiles(dirPath) {
  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    const absoluteEntryPath = resolve(dirPath, entry.name);
    if (entry.isFile()) {
      return true;
    }
    if (entry.isDirectory() && hasFiles(absoluteEntryPath)) {
      return true;
    }
  }
  return false;
}

const legacyAppDir = resolve(docsRootDir, "app");
if (existsSync(legacyAppDir) && hasFiles(legacyAppDir)) {
  errors.push("E_LEGACY_APP_DIR_HAS_FILES app");
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
